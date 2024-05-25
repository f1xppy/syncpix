import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet } from 'react-native';
import * as MediaLibrary from 'expo-media-library';
import Animated from 'react-native-reanimated';

const AlbumContents = ({ route }) => {
  const { albumId } = route.params;
  const [photos, setPhotos] = useState([]);
  const [loading, setLoading] = useState(false);
  const [after, setAfter] = useState(null);
  const [hasNextPage, setHasNextPage] = useState(true);

  useEffect(() => {
    loadPhotos();
  }, []);

  const loadPhotos = async () => {
    if (loading || !hasNextPage) return;
    setLoading(true);

    const media = await MediaLibrary.getAssetsAsync({
      album: albumId,
      mediaType: 'photo',
      first: 100,
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
        <TouchableOpacity>
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

const styles = StyleSheet.create({
  photo: {
    width: '33%',
    height: 100,
    aspectRatio: 1,
  },
  text: {
    textAlign: 'center',
    margin: 10,
  },
  syncText: {
    fontSize: 16,
    color: '#333',
  },
});

export default AlbumContents;
