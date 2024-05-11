import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export default function App() {
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
        <TouchableOpacity style={styles.tab}>
          <Text>Фото</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.tab}>
          <Text>Альбомы</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.tab}>
          <Text>Подборки</Text>
        </TouchableOpacity>
      </View>
      {/* Здесь будет содержимое выбранной вкладки */}
      <ScrollView>
        <View style={styles.photoContainer}>
          {renderPhotos()}
        </View>
      </ScrollView>
    </View>
  );
}

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
});
