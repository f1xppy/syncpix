import React,{ useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Dimensions,
  Modal,
  Button,
  StatusBar,
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
} from "react-native-reanimated";
import { Image } from 'expo-image';
import SCREENS from '..';

const { width, height } = Dimensions.get("window");
const photoWidth = (width - 38) / 3;
const folderWidth = (width - 50) / 2;

const INITIAL_POS_Y_INPUT = -50;

const INITIAL_POS_Y_SCROLL = 0;

const DELAY_RESET_POSITION = 500;

const CustomScrollView = () => {
  const inputSv = useSharedValue(INITIAL_POS_Y_INPUT);
  const scrollSv = useSharedValue(0);

  const scrollPanGesture = Gesture.Pan()
    .onUpdate(({ translationY }) => {
      const clampedValue = clamp(translationY, 0, -INITIAL_POS_Y_INPUT);

      inputSv.value = interpolate(
        clampedValue,
        [0, -INITIAL_POS_Y_INPUT],
        [INITIAL_POS_Y_INPUT, 0],
      );
      scrollSv.value = clampedValue;
    })
    .onFinalize(({ translationY }) => {
      const inputGoBackAnimation = withTiming(INITIAL_POS_Y_INPUT);
      const scrollGoBackAnimation = withTiming(INITIAL_POS_Y_SCROLL);

      if (translationY >= -INITIAL_POS_Y_INPUT) {
        runOnJS(navigate)(Screens.NewTask);

        inputSv.value = withDelay(DELAY_RESET_POSITION, inputGoBackAnimation);
        scrollSv.value = withDelay(DELAY_RESET_POSITION, scrollGoBackAnimation);
      } else {
        inputSv.value = inputGoBackAnimation;
        scrollSv.value = scrollGoBackAnimation;
      }
    })

  const nativeGesture = Gesture.Native();

  const composedGestures = Gesture.Simultaneous(
    scrollPanGesture,
    nativeGesture,
  );

  const inputAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: inputSv.value }],
  }));

  const scrollAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: scrollSv.value }],
  }));
  return (
    <View style={styles.container}>
      <GestureDetector gesture={composedGestures}>
        <Animated.ScrollView
          bounces={false}
          scrollEventThrottle={16}
          showsVerticalScrollIndicator={false}
          style={[styles.scrollView, scrollAnimatedStyle]}>
        </Animated.ScrollView>
      </GestureDetector>
    </View>
  );
};

function clamp(val, min, max) {
  return Math.min(Math.max(val, min), max);
}




function MainScreen({navigation}) {
  const [selectedTab, setSelectedTab] = useState("Фото");
  const [selectedPhoto, setSelectedPhoto] = useState(null);
  const [syncModalVisible, setSyncModalVisible] = useState(false);

  const handleTabPress = (tab) => {
    setSelectedTab(tab);
  };

  const scale = useSharedValue(1);
  const startScale = useSharedValue(0);

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
    .onEnd(()=>{
      if (scale.value < 1) {
        scale.value = withSpring(1);
        translationX.value = withSpring(0);
        translationY.value = withSpring(0);
      }
    })
    .runOnJS(true);
  const translationX = useSharedValue(0);
  const translationY = useSharedValue(0);
  const prevTranslationX = useSharedValue(0);
  const prevTranslationY = useSharedValue(0);

  const animatedPhotoStyles = useAnimatedStyle(() => ({
    transform: [
      { translateX: translationX.value },
      { translateY: translationY.value },
      { scale: scale.value },
    ],
  }));

  const pan = Gesture.Pan()
    .minDistance(30)
    .onStart(() => {
      prevTranslationX.value = translationX.value;
      prevTranslationY.value = translationY.value;
    })
    .onUpdate((event) => {
      const maxTranslateX = width / 2;
      const maxTranslateY = height /2 ;
      translationY.value = clamp(
        prevTranslationY.value + event.translationY,
        -maxTranslateY,
        maxTranslateY
      );
      if (scale.value !== 1){
        translationX.value = clamp(
          prevTranslationX.value + event.translationX,
          -maxTranslateX,
          maxTranslateX
      );
      
    }
    })
    .onFinalize(() =>{
      if (translationY.value > 120 && scale.value  === 1)
        {
          closePhoto();
          console.log("exit");
          translationX.value = 0;
          translationY.value = 0;
        }
        else if (scale.value < 1){
          translationX.value = withSpring(0);
          translationY.value = withSpring(0);
        }
    })
    .onEnd((event)=>{
      if (scale.value <= 1) {
        scale.value = withSpring(1);
        translationX.value = withSpring(0);
        translationY.value = withSpring(0);
      }
      else {
        translationX.value = withDecay({
          velocity: event.velocityX,
          rubberBandEffect:false,
          clamp: [-50, 50],
        });
        translationY.value = withDecay({
          velocity: event.velocityY,
          rubberBandEffect:false,
          clamp: [-50, 50],
        });
        
      }
  })
    .runOnJS(true);


    const composedFullPhoto = Gesture.Simultaneous(pan, pinch)

    const openPhoto = (photo) => {
      setSelectedPhoto(photo);
    };
  
    const closePhoto = () => {
      setSelectedPhoto(null);
    };

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
      <ScrollView
        onTouchStart={(e) => (this.touchX = e.nativeEvent.pageX)}
        onTouchEnd={(e) => {
          menuSwipeHandle(this.touchX, e.nativeEvent.pageX);
        }}
      >
        {selectedTab === "Фото" && (
          <Animated.View style={[styles.photoContainer]}>
            {renderPhotos(openPhoto)}
          </Animated.View>
        )}
        {selectedTab === "Альбомы" && (
          <Animated.View style={styles.albumContainer}>
            <TouchableOpacity>
              <View style={styles.albumWrapper}>
                <View style={styles.addAlbum}>
                  <Ionicons
                    name="add-sharp"
                    size={folderWidth / 2}
                    color="#8CE8E5"
                  />
                </View>
                <Text style={[styles.albumText, styles.text]}>Добавить</Text>
              </View>
            </TouchableOpacity>
            {renderAlbums()}
          </Animated.View>
        )}
        {selectedTab === "Подборки" && (
          <Animated.View style={styles.collectionContainer}>
            {renderCollections()}
          </Animated.View>
        )}
      </ScrollView>
      <TouchableOpacity style={styles.takePhotoContainer}>
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

// Функция для отображения фотографий из папки assets
const renderPhotos = (onPress) => {
  // Принимаем функцию onPress
  const photos = [
    require("../../assets/photo1.jpg"),
    require("../../assets/photo2.jpg"),
    require("../../assets/photo3.jpg"),
    // Добавьте больше фотографий по аналогии
  ];

  return photos.map((photo, index) => (
    <TouchableOpacity key={index} onPress={() => onPress(photo)}>
      <Animated.Image
        //ref={openingPhotoRef}
        source={photo}
        style={styles.photo}
      />
    </TouchableOpacity>
  ));
};

// Функция для отображения альбомов
const renderAlbums = () => {
  const albums = [
    require("../../assets/photo1.jpg"),
    require("../../assets/photo2.jpg"),
    require("../../assets/photo3.jpg"),
    // Добавьте больше альбомов по аналогии
  ];

  return albums.map((album, index) => (
    <TouchableOpacity key={index}>
      <View style={styles.albumWrapper}>
        <Image source={album} style={styles.album} />
        <Text style={[styles.albumText, styles.text]}>Sample</Text>
      </View>
    </TouchableOpacity>
  ));
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