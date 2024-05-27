import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  StatusBar,
  Modal,
} from "react-native";
import * as MediaLibrary from "expo-media-library";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withDecay,
  withTiming,
  runOnJS,
} from "react-native-reanimated";
import {
  GestureDetector,
  Gesture,
  GestureHandlerRootView,
  gestureHandlerRootHOC,
} from "react-native-gesture-handler";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from '@react-navigation/native';
import SCREENS from '..';

const { width, height } = Dimensions.get("window");
const photoWidth = (width - 38) / 3;

const clamp = (value, min, max) => {
  'worklet';
  return Math.min(Math.max(value, min), max);
};

const AlbumContents = ({ route}) => {
  const { albumId, albumTitle } = route.params;
  const [photos, setPhotos] = useState([]);
  const [loading, setLoading] = useState(false);
  const [after, setAfter] = useState(null);
  const [hasNextPage, setHasNextPage] = useState(true);
  const [selectedPhoto, setSelectedPhoto] = useState(null);
  const [status, requestPermission] = MediaLibrary.usePermissions();

  const navigation = useNavigation();

  const openPhoto = (photo) => {
    isVisible.value = true;
    setSelectedPhoto(photo);
  };

  const closePhoto = () => {
    setSelectedPhoto(null);
  };

  const scale = useSharedValue(1);
  const startScale = useSharedValue(1);
  const translationX = useSharedValue(0);
  const translationY = useSharedValue(0);
  const prevTranslationX = useSharedValue(0);
  const prevTranslationY = useSharedValue(0);
  const isClosing = useSharedValue(false);
  const isVisible = useSharedValue(true);


  const closePhotoWithAnimation = () => {
    translationY.value = withTiming(
      height,
      { duration: 50 },
      (isFinished) => {
        if (isFinished) {
          runOnJS(closePhoto)();
          isClosing.value = false;
          isVisible.value = false;
          translationX.value = 0;
          translationY.value = 0;
        }
      }
    );
  };

  const swipeToNextPhoto = () => {
    const currentIndex = photos.findIndex(photo => photo.uri === selectedPhoto.uri);
    const nextIndex = currentIndex - 1;
    if (nextIndex > 0) {
      const nextPhoto = photos[nextIndex];
      translationX.value = withTiming(width + 100, { duration: 300 }, () => {
        runOnJS(setSelectedPhoto)(nextPhoto);
        translationX.value = withTiming(0, { duration: 300 });
      });
    }
  };

  const swipeToPreviousPhoto = () => {
    const currentIndex = photos.findIndex(photo => photo.uri === selectedPhoto.uri);
    const prevIndex = currentIndex + 1;
    if (prevIndex < photos.length) {
      const prevPhoto = photos[prevIndex];
      translationX.value = withTiming(-width - 100, { duration: 300 }, () => {
        runOnJS(setSelectedPhoto)(prevPhoto);
        translationX.value = withTiming(0, { duration: 300 });
      });
    }
  };

  const pinch = Gesture.Pinch()
    .onStart(() => {
      startScale.value = scale.value;
    })
    .onUpdate((event) => {
      scale.value = clamp(
        startScale.value * event.scale,
        0.5,
        Math.min(width / 100, height / 100)
      );
    })
    .onEnd(() => {
      if (scale.value < 1) {
        scale.value = withSpring(1);
        translationX.value = withSpring(0);
        translationY.value = withSpring(0);
      }
    });

  const pan = Gesture.Pan()
    .minDistance(10)
    .onStart(() => {
      prevTranslationX.value = translationX.value;
      prevTranslationY.value = translationY.value;
    })
    .onUpdate((event) => {
      if (scale.value === 1) {
        translationY.value = clamp(
          prevTranslationY.value + event.translationY,
          -height / 2,
          height / 2
        );
      } else {
        const maxTranslateX = (width * scale.value - width) / 2;
        const maxTranslateY = (height * scale.value - height) / 2;

        translationX.value = clamp(
          prevTranslationX.value + event.translationX,
          -maxTranslateX,
          maxTranslateX
        );
        translationY.value = clamp(
          prevTranslationY.value + event.translationY,
          -maxTranslateY,
          maxTranslateY
        );
      }
    })
    .onEnd((event) => {
      if (scale.value > 1) {
        translationX.value = withDecay({
          velocity: event.velocityX,
          clamp: [
            -(width * scale.value - width) / 2,
            (width * scale.value - width) / 2,
          ],
        });
        translationY.value = withDecay({
          velocity: event.velocityY,
          clamp: [
            -(height * scale.value - height) / 2,
            (height * scale.value - height) / 2,
          ],
        });
      } else {
        if (translationY.value > 120 && scale.value === 1 && !isClosing.value) {
          isClosing.value = true;
          runOnJS(closePhotoWithAnimation)();
        } else if (scale.value <= 1) {
          translationX.value = withSpring(0);
          translationY.value = withSpring(0);
        }

        if (scale.value === 1) {
          if (event.translationX > 50) {
            runOnJS(swipeToNextPhoto)();
          } else if (event.translationX < -50) {
            runOnJS(swipeToPreviousPhoto)();
          }
        }
      }
    });



    const doubleTap = Gesture.Tap()
    .numberOfTaps(2)
    .onEnd((event) => {
      const tapX = event.absoluteX - width / 2;
      const tapY = event.absoluteY - height / 2;
      const newScale = scale.value > 1 ? 1 : 2;

      if (newScale === 1) {
        scale.value = withSpring(1);
        translationX.value = withSpring(0);
        translationY.value = withSpring(0);
      } else {
        const maxTranslateX = (width * newScale - width) / 2;
        const maxTranslateY = (height * newScale - height) / 2;

        scale.value = withSpring(newScale);
        translationX.value = withSpring(
          clamp(tapX * -1 * (newScale - 1), -maxTranslateX, maxTranslateX)
        );
        translationY.value = withSpring(
          clamp(tapY * -1 * (newScale - 1), -maxTranslateY, maxTranslateY)
        );
      }
    });
    
    const animatedPhotoStyles = useAnimatedStyle(() => ({
      opacity: isVisible.value ? 1 : 0,
      transform: [
        { translateX: translationX.value },
        { translateY: translationY.value },
        { scale: scale.value },
      ],
    }));
    
    const composedFullPhoto = Gesture.Simultaneous(pan, pinch, doubleTap);

  useEffect(() => {
    loadPhotos();
  }, []);

  const loadPhotos = async () => {
    if (status.status !== 'granted') {
      await MediaLibrary.requestPermissionsAsync();
    }
    if (loading || !hasNextPage) return;
    setLoading(true);

    const media = await MediaLibrary.getAssetsAsync({
      album: albumId,
      mediaType: "photo",
      first: 90,
      after,
      sortBy: [[MediaLibrary.SortBy.creationTime, false]],
    });

    setPhotos((prevPhotos) => [...prevPhotos, ...media.assets]);
    setAfter(media.endCursor);
    setHasNextPage(media.hasNextPage);
    setLoading(false);
  };

  const FullPhotoHOC = gestureHandlerRootHOC(() => (
    <Animated.View style={styles.modalContainer}>
      <TouchableOpacity onPress={closePhoto} style={styles.backButton}>
        <Ionicons name="arrow-back" size={24} color="#8CE8E5" />
      </TouchableOpacity>
      <GestureDetector gesture={composedFullPhoto}>
        <Animated.Image
          source={selectedPhoto}
          style={[animatedPhotoStyles, styles.fullPhoto]}
        />
      </GestureDetector>
    </Animated.View>
  ));

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backBtn}
          onPress={() => {
            navigation.navigate(SCREENS.MAIN);
          }}
        >
          <Ionicons name="chevron-back" size={30} style={styles.backIcon} />
        </TouchableOpacity>
        <Text style={styles.albumTxt}>{albumTitle}</Text>
      </View>
        <FlatList
          data={photos}
          keyExtractor={(photo) => photo.id}
          renderItem={({ item }) => (
            <TouchableOpacity onPress={() => openPhoto(item)}>
              <Animated.Image source={{ uri: item.uri }} style={styles.photo} />
            </TouchableOpacity>
          )}
          numColumns={3}
          onEndReached={loadPhotos}
          onEndReachedThreshold={0.5}
          ListFooterComponent={
            loading ? (
              <Text style={[styles.text, styles.syncText]}>loading...</Text>
            ) : null
          }
        />
        <Modal visible={selectedPhoto !== null} animationType="fade">
        <FullPhotoHOC />
      </Modal>
      </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#333333",
    //alignItems: "center",
  },
  backBtn: {
    position: 'absolute',
    top: 20,
    left: 10,
    zIndex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#8CE8E5",
    borderRadius: 10,
    height: 35,
    width: 35,
    marginHorizontal: 15,
    marginTop: 20,
    paddingRight: 2,
  },
  photoContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    padding: 10,
    alignItems: "center",
    justifyContent: "space-between",
  },
  fullPhoto: {
    width: width, // Ширина экрана с отступами по 20 с обеих сторон
    height: height, // Высота экрана с отступами сверху и снизу по 60
    resizeMode: 'contain',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#000000',
  },
  backButton: {
    position: 'absolute',
    top: 20,
    left: 20,
    zIndex: 1,
  },
  header: {
    //flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#222222',
    paddingTop: StatusBar.currentHeight + 5,
    paddingBottom: 15,
    borderBottomLeftRadius: 10,
    borderBottomRightRadius: 10,
  },
  photo: {
    width: photoWidth,
    height: photoWidth,
    borderRadius: 10,
    margin: 3,
  },
  albumTxt: {
    fontSize: 20,
    color:'#FFFFFF',
  },
  text: {
    textAlign: "center",
    margin: 10,
    fontFamily: 'Roboto',
  },
  syncText: {
    fontSize: 16,
    color: "#333",
  },
});

export default AlbumContents;
