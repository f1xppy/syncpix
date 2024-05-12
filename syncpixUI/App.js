import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Image, ScrollView, Dimensions, Modal, Button, StatusBar } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const { width, height } = Dimensions.get('window');
const photoWidth = (width - 40) / 3; // Определяем ширину фотографии

export default function App() {
  const [selectedTab, setSelectedTab] = useState('Фото');
  const [selectedPhoto, setSelectedPhoto] = useState(null); // Состояние для открытого фото

  const handleTabPress = (tab) => {
    setSelectedTab(tab);
  };

  const openPhoto = (photo) => {
    setSelectedPhoto(photo);
  };

  const closePhoto = () => {
    setSelectedPhoto(null);
  };

  const menuSwipeHandle = (start, end) => {
    if (selectedTab === 'Фото')
      if (start - end > 20) setSelectedTab("Альбомы");
      else if (start - end < -20) setSelectedTab("Подборки");
    else if (selectedTab === 'Альбомы')
      if (start - end > 20) setSelectedTab("Подборки");
      else if (start - end < -20) setSelectedTab("Фото");
    else if (selectedTab === 'Подборки')
      if (start - end > 20) setSelectedTab("Фото");
      else if (start - end < -20) setSelectedTab("Альбомы");
  };

  return (
    <View style={styles.container}>
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
              selectedTab === "Подборки" ? styles.selectedTab : null,
            ]}
          >
            Подборки
          </Text>
        </TouchableOpacity>
      </View>
      <ScrollView style={styles.test} onTouchStart={(e) => (this.touchX = e.nativeEvent.pageX)} onTouchEnd={(e) => {menuSwipeHandle(this.touchX, e.nativeEvent.pageX)}}>
        {selectedTab === "Фото" && (
          <View style={styles.photoContainer}>
            {renderPhotos(openPhoto)}
          </View>
        )}
        {selectedTab === "Альбомы" && (
          <View style={styles.albumContainer}>
            {renderAlbums()}
          </View>
        )}
        {selectedTab === "Подборки" && (
          <View style={styles.collectionContainer}>
              {renderCollections()}
          </View>
        )}
      </ScrollView>

      <Modal visible={selectedPhoto !== null} animationType="fade">
        <View style={styles.modalContainer}>
          <TouchableOpacity onPress={closePhoto} style={styles.backButton}>
            <Ionicons name="arrow-back" size={24} color="#8CE8E5" />
          </TouchableOpacity>
          <Image
            source={selectedPhoto}
            style={styles.fullPhoto}
            onTouchStart={(e) => (this.touchY = e.nativeEvent.pageY)}
            onTouchEnd={(e) => {
              if (this.touchY - e.nativeEvent.pageY < -20) closePhoto();
            }}
          />
        </View>
      </Modal>
    </View>
  );
}

// Функция для отображения фотографий из папки assets
const renderPhotos = (onPress) => { // Принимаем функцию onPress
  const photos = [
    require('./assets/photo1.jpg'),
    require('./assets/photo2.jpg'),
    require('./assets/photo3.jpg'),
    // Добавьте больше фотографий по аналогии
  ];

  return photos.map((photo, index) => (
    <TouchableOpacity key={index} onPress={() => onPress(photo)}>
      <Image source={photo} style={styles.photo} />
    </TouchableOpacity>
  ));
};

// Функция для отображения альбомов
const renderAlbums = () => {
  const albums = [
    'Альбом 1',
    'Альбом 2',
    'Альбом 3',
    // Добавьте больше альбомов по аналогии
  ];

  return albums.map((album, index) => (
    <TouchableOpacity key={index} style={styles.album}>
      <Text>{album}</Text>
    </TouchableOpacity>
  ));
};

// Функция для отображения подборок
const renderCollections = () => {
  const collections = [
    'Подборка 1',
    'Подборка 2',
    'Подборка 3',
    // Добавьте больше подборок по аналогии
  ];

  return collections.map((collection, index) => (
    <TouchableOpacity key={index} style={styles.collection}>
      <Text>{collection}</Text>
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
    borderBottomWidth: 1,
    backgroundColor: '#222222',
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
  },
  tab: {
    padding: 10,
    color: '#FFFFFF',
    fontFamily: 'Roboto',
  },
  selectedTab: {
    color: '#8CE8E5',
    fontFamily: 'Roboto',
  },
  photoContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    padding: 10,
  },
  photo: {
    width: photoWidth,
    height: photoWidth,
    borderRadius: 10,
    margin: 3,
  },
  albumContainer: {
    padding: 10,
  },
  album: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  collectionContainer: {
    padding: 10,
  },
  collection: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
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
    fontFamily: 'Roboto',
    fontWeight: 'medium',
    fontSize: 20,
  },
  headerBtnPressed: {
    color: '#8CE8E5',
    fontFamily: 'Roboto',
    fontWeight: 'medium',
    fontSize: 20,
  },
  menuText: {

  },
  defText: {

  },
  test: {
    backgroundColor: 'orange',
  },
});
