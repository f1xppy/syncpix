import React, { useRef, useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView, Dimensions, Modal, Button, StatusBar, Platform } from 'react-native';
import { Image } from 'expo-image';
import { Ionicons } from '@expo/vector-icons';
import {GestureDetector, Gesture, GestureHandlerRootView}  from 'react-native-gesture-handler';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  useAnimatedRef,
  measure,
} from 'react-native-reanimated';

const { width, height } = Dimensions.get('window');
const photoWidth = (width - 38) / 3; // Определяем ширину фотографии
const folderWidth = (width - 38) / 2; // Определяем ширину folder


function clamp(val, min, max) {
  return Math.min(Math.max(val, min), max);}

export default function App() {
  const [selectedTab, setSelectedTab] = useState("Фото");
  const [selectedPhoto, setSelectedPhoto] = useState(null); // Состояние для открытого фото

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
      if (scale.value < 1)
        scale.value = 1;
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
    .minDistance(50)
    .onStart(() => {
      prevTranslationX.value = translationX.value;
      prevTranslationY.value = translationY.value;
    })
    .onUpdate((event) => {
      const maxTranslateX = width / 2 - 50;
      const maxTranslateY = height / 2 - 50;

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
      console.log(scale.value);
    })
    .onFinalize(()=>{
      if (scale.value == 1){
        translationX.value = 0;
        translationY.value = 0;
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

  return (
    <GestureHandlerRootView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.iconContainer}>
          <Image
            name="sync"
            size={24}
            color="#8CE8E5"
            width="48"
            height="40"
            source={require("./assets/UI_Elements/sync.png")}
          />
        </TouchableOpacity>
        <View>
          <TextInput style={styles.searchBar} placeholder="Search"></TextInput>
        </View>
        <TouchableOpacity style={styles.iconContainer}>
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
            <TouchableOpacity onPress={() => onPress(album)}>
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

      <Modal visible={selectedPhoto !== null} animationType="fade">
        <Animated.View style={styles.modalContainer}>
          <TouchableOpacity onPress={closePhoto} style={styles.backButton}>
            <Ionicons name="arrow-back" size={24} color="#8CE8E5" />
          </TouchableOpacity>
          <GestureDetector gesture={composedFullPhoto}>
          <Animated.Image
            source={selectedPhoto}
            style={[animatedPhotoStyles, styles.fullPhoto]}
            onTouchStart={(e) => (this.touchY = e.nativeEvent.pageY)}
            onTouchEnd={(e) => {
              if (this.touchY - e.nativeEvent.pageY < -20) closePhoto();
            }}
          />
          </GestureDetector>
        </Animated.View>
      </Modal>
    </GestureHandlerRootView>
  );
}

// Функция для отображения фотографий из папки assets
const renderPhotos = (onPress) => {
  // Принимаем функцию onPress
  const photos = [
    require("./assets/photo1.jpg"),
    require("./assets/photo2.jpg"),
    require("./assets/photo3.jpg"),
    // Добавьте больше фотографий по аналогии
  ];

  return photos.map((photo, index) => (
    <TouchableOpacity key={index} onPress={() => onPress(photo)}>
      <Animated.Image
        ref={openingPhotoRef} 
        source={photo} 
        style={styles.photo} />
    </TouchableOpacity>
  ));
};

// Функция для отображения альбомов
const renderAlbums = () => {
  const albums = [
    require('./assets/photo1.jpg'),
    require('./assets/photo2.jpg'),
    require('./assets/photo3.jpg'),
    // Добавьте больше альбомов по аналогии
  ];

  return albums.map((album, index) => (
    <TouchableOpacity key={index} onPress={() => onPress(album)}>
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
    require('./assets/photo1.jpg'),
    require('./assets/photo2.jpg'),
    require('./assets/photo3.jpg'),
    // Добавьте больше подборок по аналогии
  ];

  return collections.map((collection, index) => (
    <TouchableOpacity key={index} onPress={() => onPress(collection)}>
      <View style={styles.albumWrapper}>
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
    paddingTop: 25,
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
    alignContent: 'center',
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
  menuText: {

  },
  defText: {

  },
  text: {
    fontFamily: 'Roboto',
  },
  test: {
    backgroundColor: 'orange',
  },
});
