import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image, ScrollView, Dimensions, Modal, Button } from 'react-native';
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

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.iconContainer}>
          <Ionicons name="sync" size={24} color="black" />
        </TouchableOpacity>
        <Text style={styles.title}>Photo Viewer</Text>
        <TouchableOpacity style={styles.iconContainer}>
          <Ionicons name="settings" size={24} color="black" />
        </TouchableOpacity>
      </View>
      <View style={styles.tabs}>
        <TouchableOpacity
          
        >
          <Text onPress={() => handleTabPress('Фото')}style={[styles.tab, selectedTab === 'Фото' ? styles.selectedTab : null]}>Фото</Text>
        </TouchableOpacity>
        <TouchableOpacity>
          <Text onPress={() => handleTabPress('Альбомы')} style={[styles.tab, selectedTab === 'Альбомы' ? styles.selectedTab : null]}>Альбомы</Text>
        </TouchableOpacity>
        <TouchableOpacity>
          <Text onPress={() => handleTabPress('Подборки')} style={[styles.tab, selectedTab === 'Подборки' ? styles.selectedTab : null]}>Подборки</Text>
        </TouchableOpacity>
      </View>
      {/* Содержимое выбранной вкладки */}
      <ScrollView>
        {selectedTab === 'Фото' && (
          <View style={styles.photoContainer}>
            {renderPhotos(openPhoto)} {/* Передаем функцию openPhoto */}
          </View>
        )}
        {selectedTab === 'Альбомы' && (
          <View style={styles.albumContainer}>
            {renderAlbums()}
          </View>
        )}
        {selectedTab === 'Подборки' && (
          <View style={styles.collectionContainer}>
            {renderCollections()}
          </View>
        )}
      </ScrollView>

      {/* Модальное окно для открытия полного фото */}
      <Modal visible={selectedPhoto !== null} animationType="slide">
        <View style={styles.modalContainer}>
          <TouchableOpacity onPress={closePhoto} style={styles.backButton}>
            <Ionicons name="arrow-back" size={24} color="black" />
          </TouchableOpacity>
          <Image source={selectedPhoto} style={styles.fullPhoto} />
          <Button title="Закрыть" onPress={closePhoto} />
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
    <TouchableOpacity key={index} onPress={() => onPress(photo)}> {/* Вызываем onPress при нажатии */}
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
    padding: 0,
    backgroundColor: '#222222',
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
    marginTop: 50, // Добавляем отступ сверху для центрирования
  },
  fullPhoto: {
    width: width - 40, // Ширина экрана с отступами по 20 с обеих сторон
    height: height - 120, // Высота экрана с отступами сверху и снизу по 60
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
});
