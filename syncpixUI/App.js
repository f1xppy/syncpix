import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image, ScrollView, Dimensions } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const { width } = Dimensions.get('window');
const photoWidth = (width - 40) / 3; // Определяем ширину фотографии

export default function App() {
  const [selectedTab, setSelectedTab] = useState('Фото');

  const handleTabPress = (tab) => {
    setSelectedTab(tab);
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
          style={[styles.tab, selectedTab === 'Фото' ? styles.selectedTab : null]}
          onPress={() => handleTabPress('Фото')}
        >
          <Text>Фото</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, selectedTab === 'Альбомы' ? styles.selectedTab : null]}
          onPress={() => handleTabPress('Альбомы')}
        >
          <Text>Альбомы</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, selectedTab === 'Подборки' ? styles.selectedTab : null]}
          onPress={() => handleTabPress('Подборки')}
        >
          <Text>Подборки</Text>
        </TouchableOpacity>
      </View>
      {/* Содержимое выбранной вкладки */}
      <ScrollView>
        {selectedTab === 'Фото' && (
          <View style={styles.photoContainer}>
            {renderPhotos()}
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
    </View>
  );
}

// Функция для отображения фотографий из папки assets
const renderPhotos = () => {
  const photos = [
    require('./assets/photo1.jpg'),
    require('./assets/photo2.jpg'),
    require('./assets/photo3.jpg'),
    // Добавьте больше фотографий по аналогии
  ];

  return photos.map((photo, index) => (
    <Image key={index} source={photo} style={styles.photo} />
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
    backgroundColor: '#fff',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
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
    borderBottomColor: '#ccc',
  },
  tab: {
    padding: 10,
  },
  selectedTab: {
    backgroundColor: '#ccc',
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
    margin: 3, // Обновленный стиль для фотографий
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
});
