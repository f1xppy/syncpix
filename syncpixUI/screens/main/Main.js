import React,{ useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Dimensions,
  Modal,
  FlatList,
  StatusBar,
  Alert,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import {
  GestureDetector,
  Gesture,
  GestureHandlerRootView,
  gestureHandlerRootHOC,
} from "react-native-gesture-handler";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withDecay,
  withTiming,
  runOnJS,
} from "react-native-reanimated";
import * as ImagePicker from 'expo-image-picker';
import * as MediaLibrary from 'expo-media-library';
import { Image } from 'expo-image';
import { useNavigation } from '@react-navigation/native';
import SCREENS from '..';

const { width, height } = Dimensions.get("window");
const photoWidth = (width - 38) / 3;
const folderWidth = (width - 50) / 2;

const clamp = (value, min, max) => {
  'worklet';
  return Math.min(Math.max(value, min), max);
};



function MainScreen({navigation}) {
  const [selectedTab, setSelectedTab] = useState("Фото");
  const [selectedPhoto, setSelectedPhoto] = useState(null);
  const [syncModalVisible, setSyncModalVisible] = useState(false);
  //const [hasPermission, setHasPermission] = useState(null);
  const [status, requestPermission] = MediaLibrary.usePermissions();
  const [selectedAlbum, setSelectedAlbum] = useState(null);

  const openPhoto = (photo) => {
    isVisible.value = true;
    setSelectedPhoto(photo);
  };

  const closePhoto = () => {
    setSelectedPhoto(null);
  };

  const takeImageHandler = async () => {
    if (status === null) {
      const mediaLibraryPermission = await requestPermission();
      if (mediaLibraryPermission.status !== 'granted') {
        alert('Необходимо разрешение на доступ к медиатеке!');
        return;
      }
    }

    let result = await ImagePicker.launchCameraAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 0.5,
    });

    if (!result.cancelled) {
      const asset = await MediaLibrary.createAssetAsync(result.asset.uri);
      await MediaLibrary.createAlbumAsync('Camera', asset, false);
      alert('Фото сохранено в галерее!');
    }
  };



  const handleTabPress = (tab) => {
    setSelectedTab(tab);
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
      { duration: 300 },
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

    

  const menuSwipeHandle = (start, end) => {
    /*const childXValue = useRef(new Animated.Value((start + end) / 2)).current
    const swipeHorizontal = () => {
      Animated.timing(
        this.state.menuAnimation,
        toValue:  
        duration: 300
      ).start();
    };
    const swipeStyle ={
      transform: [{ translateX: childXValue.interpolate }]
    };*/
    if (selectedTab === "Фото") {
      if (start - end > 50) setSelectedTab("Альбомы");
      else if (start - end < -50) setSelectedTab("Подборки");
    } else if (selectedTab === "Альбомы") {
      if (start - end > 50) setSelectedTab("Подборки");
      else if (start - end < -50) setSelectedTab("Фото");
    } else if (selectedTab === "Подборки") {
      if (start - end > 50) setSelectedTab("Фото");
      else if (start - end < -50) setSelectedTab("Альбомы");
    }
  };
  //StatusBar.setHidden(true);

  const SyncHOC = gestureHandlerRootHOC(() => (
    <Animated.View style={styles.modalBackground}>
      <Animated.View style={styles.syncModalContainer}>
        <TouchableOpacity>
          <Animated.View style={styles.syncBtn}>
            <Text style={[styles.text, styles.syncText]}>Загрузить ...</Text>
          </Animated.View>
        </TouchableOpacity>
        <TouchableOpacity>
          <Animated.View style={styles.syncBtn}>
            <Text style={[styles.text, styles.syncText]}>Скачать ...</Text>
          </Animated.View>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => setSyncModalVisible(!syncModalVisible)}>
          <Animated.View style={styles.syncBtn}>
            <Text style={[styles.text, styles.syncText]}>Синхронизировать</Text>
          </Animated.View>
        </TouchableOpacity>
      </Animated.View>
    </Animated.View>
  ));
  
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
    <GestureHandlerRootView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.iconContainer}
          onPress={() => setSyncModalVisible(true)}
        >
          <Animated.Image
            name="sync"
            size={24}
            color="#8CE8E5"
            source={require("../../assets/UI_Elements/sync.png")}
          />
        </TouchableOpacity>
        <View>
          <TextInput style={styles.searchBar} placeholder="Search"></TextInput>
        </View>
        <TouchableOpacity style={styles.iconContainer} onPress={() => {navigation.navigate(SCREENS.SETTINGS)}}>
          <Ionicons name="settings" size={24} color="#8CE8E5" />
        </TouchableOpacity>
      </View>
      <View style={styles.tabs}>
        <TouchableOpacity>
          <Text
            onPress={() => handleTabPress("Фото")}
            style={[
              styles.tab,
              styles.text,
              selectedTab === "Фото" ? styles.selectedTab : null,
            ]}
          >
            Фото
          </Text>
        </TouchableOpacity>
        <TouchableOpacity>
          <Text
            onPress={() => handleTabPress("Альбомы")}
            style={[
              styles.tab,
              styles.text,
              selectedTab === "Альбомы" ? styles.selectedTab : null,
            ]}
          >
            Альбомы
          </Text>
        </TouchableOpacity>
        <TouchableOpacity>
          <Text
            onPress={() => handleTabPress("Подборки")}
            style={[
              styles.tab,
              styles.text,
              selectedTab === "Подборки" ? styles.selectedTab : null,
            ]}
          >
            Подборки
          </Text>
        </TouchableOpacity>
      </View>
      <View
        style = {{flex: 1}}
        onTouchStart={(e) => (this.touchX = e.nativeEvent.pageX)}
        onTouchEnd={(e) => {
          menuSwipeHandle(this.touchX, e.nativeEvent.pageX);
        }}
      >
        {selectedTab === "Фото" && (
          <Animated.View style={[styles.photoContainer]}>
            <RenderPhotos onPress={openPhoto} />
          </Animated.View>
        )}
        {selectedTab === "Альбомы" && (
          <Animated.View style={styles.albumContainer}>
            
            <RenderAlbums/>
          </Animated.View>
        )}
        {selectedTab === "Подборки" && (
          <Animated.View style={styles.collectionContainer}>
            {renderCollections()}
          </Animated.View>
        )}
      </View>
      <TouchableOpacity style={styles.takePhotoContainer} onPress={()=>takeImageHandler()}>
        <View style={styles.takePhotoBtn}>
          <Ionicons name="camera" size={photoWidth / 3} color="#000000" />
        </View>
      </TouchableOpacity>
      <Modal visible={selectedPhoto !== null} animationType="fade">
        <FullPhotoHOC />
      </Modal>
      <Modal
        visible={syncModalVisible === true}
        animationType="slide"
        transparent={true}
      >
        <SyncHOC />
      </Modal>
    </GestureHandlerRootView>
  );
}


// Функция для отображения фотографий
const RenderPhotos = ({ onPress }) => {
  const [photos, setPhotos] = useState([]);
  const [hasMediaPermission, setHasMediaPermission] = useState(null);
  const [loading, setLoading] = useState(false);
  const [after, setAfter] = useState(null);
  const [hasNextPage, setHasNextPage] = useState(true);

  useEffect(() => {
    (async () => {
      const { status } = await MediaLibrary.requestPermissionsAsync();
      setHasMediaPermission(status === 'granted');

      if (status === 'granted') {
        loadPhotos();
      }
    })();
  }, []);

  const loadPhotos = async () => {
    if (loading || !hasNextPage) return;
    setLoading(true);

    const media = await MediaLibrary.getAssetsAsync({
      mediaType: 'photo',
      first: 90,
      after,
      sortBy: [[MediaLibrary.SortBy.creationTime, false]],
    });

    setPhotos((prevPhotos) => [...prevPhotos, ...media.assets]);
    setAfter(media.endCursor);
    setHasNextPage(media.hasNextPage);
    setLoading(false);
  };

  return (
    <FlatList
      data={photos}
      keyExtractor={(photo) => photo.id}
      renderItem={({ item }) => (
        <TouchableOpacity onPress={() => onPress(item)}>
          <Animated.Image
            source={{ uri: item.uri }}
            style={styles.photo}
          />

    </TouchableOpacity>
      )}
      numColumns={3}
      onEndReached={loadPhotos}
      onEndReachedThreshold={0.5}
      ListFooterComponent={loading ? <Text style={[styles.text, styles.syncText]}>loading...</Text> : null}
    />
  );
};


const RenderAlbums = () => {
  const [albums, setAlbums] = useState([]);
  const navigation = useNavigation();

  useEffect(() => {
    (async () => {
      const { status } = await MediaLibrary.requestPermissionsAsync();
      if (status === 'granted') {
        const albumList = await MediaLibrary.getAlbumsAsync();
        const albumsWithCover = await Promise.all(albumList.map(async (album) => {
          const albumAssets = await MediaLibrary.getAssetsAsync({ album: album.id, first: 1 });
          return { ...album, cover: albumAssets.assets[0]?.uri };
        }));
        setAlbums(albumsWithCover);
      }
    })();
  }, []);

  const renderItem = ({ item }) => (
    <TouchableOpacity key={item.id} onPress={() => navigation.navigate(SCREENS.ALBUMCONTENTS, { albumId: item.id, albumTitle: item.title })}>
      <View style={styles.albumWrapper}>
        <Image source={{ uri: item.cover }} style={styles.album} />
        <Text style={[styles.albumText, styles.text]}>{item.title}</Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <FlatList
      data={albums}
      renderItem={renderItem}
      keyExtractor={(item) => item.id}
      numColumns={2}
      //contentContainerStyle={styles.albumListContainer}
    />
  );
};

// Функция для отображения подборок
const renderCollections = () => {
  const collections = [
    require("../../assets/photo1.jpg"),
    require("../../assets/photo2.jpg"),
    require("../../assets/photo3.jpg"),
    // Добавьте больше подборок по аналогии
  ];

  return collections.map((collection, index) => (
    <TouchableOpacity key={index}>
      <View style={[styles.albumWrapper, (style = { color: "#ffffff" })]}>
        <Image source={collection} style={styles.collection} />
        <Text style={[styles.albumText, styles.text]}>Sample</Text>
      </View>
    </TouchableOpacity>
  ));
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#333333',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#222222',
    paddingTop: StatusBar.currentHeight,
  },
  searchBar: {
    borderRadius: 20,
    backgroundColor: "#E7E7E7",
    width: 286,
    height: 35,
    paddingLeft: 8,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  iconContainer: {
    padding: 5,
  },
  tabs: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    padding: 10,
    backgroundColor: '#222222',
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
    fontSize: 20,
  },
  albumListContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    padding: 10,
    alignContent: 'center',
    justifyContent: 'space-between',
  },
  tab: {
    padding: 10,
    color: '#FFFFFF',
    fontWeight: 'medium',
  },
  selectedTab: {
    color: '#8CE8E5',
  },
  photoContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    padding: 10,
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  photo: {
    width: photoWidth,
    height: photoWidth,
    borderRadius: 10,
    margin: 3,
  },
  albumContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    padding: 10,
    alignContent: 'center',
    justifyContent: 'space-between',
  },
  albumWrapper:{
    width: folderWidth,
    height: folderWidth + folderWidth/4,
    borderRadius: 30,
    margin: 5,
    backgroundColor: '#8CE8E5',
  },
  albumText:{
    color: '#333333',
    fontSize: 18,
    marginLeft: folderWidth/8,
    marginTop: folderWidth/16,
    fontWeight: 739
  },
  album: {
    width: folderWidth,
    height: folderWidth,
    borderRadius: 30,
  },
  addAlbum:{
    width:folderWidth, 
    height: folderWidth, 
    backgroundColor:'#707070', 
    borderRadius:30,
    alignItems: 'center',
    justifyContent: 'center',
  },
  collectionContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    padding: 10,
    alignContent: 'center',
    justifyContent: 'space-between',
  },
  collection: {
    width: folderWidth,
    height: folderWidth,
    borderRadius: 30,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#000000',
  },

  syncModalContainer:{
    flex: 1,
    alignItems: 'center',
    backgroundColor: '#333333',
    borderRadius: 30,
    width: width - width/5,    
    height: height/2,
    margin: 20,
    padding: 20,
  },

  syncBtn:{
    borderRadius: 10,
    borderColor: '#555555',
    borderWidth: 1,
    width: width - 2*(width/5), 
    height:40,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 15,
  },
  modalBackground:{
    flex: 1, 
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  fullPhoto: {
    width: width, // Ширина экрана с отступами по 20 с обеих сторон
    height: height, // Высота экрана с отступами сверху и снизу по 60
    resizeMode: 'contain',
  },
  backButton: {
    position: 'absolute',
    top: 20,
    left: 20,
    zIndex: 1,
  },
  headerBtnText: {
    color: '#FFFFFF',
    fontWeight: 'medium',
    fontSize: 20,
  },
  headerBtnPressed: {
    color: '#8CE8E5',
    fontWeight: 'medium',
    fontSize: 20,
  },
  takePhotoBtn:{
    borderRadius: 50,
    width: photoWidth/2,
    height: photoWidth/2,
    backgroundColor: "#8CE8E5",
    
    justifyContent: 'center',
    alignItems: 'center',
  },
  takePhotoContainer: {
    position: 'absolute',
    top: height - photoWidth/4,
    left: width/2 - photoWidth/4,
  },
  syncText: {
    color: '#FFFFFF',
    fontWeight: 'regular',
    fontSize: 20,
  },
  text: {
    fontFamily: 'Roboto',
  },
  test: {
    backgroundColor: 'orange',
  },

});

export default MainScreen;