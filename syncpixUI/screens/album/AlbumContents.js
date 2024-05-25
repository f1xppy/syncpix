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
import Animated from "react-native-reanimated";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from '@react-navigation/native';
import SCREENS from '..';

const { width, height } = Dimensions.get("window");
const photoWidth = (width - 38) / 3;

const AlbumContents = ({ route}) => {
  const { albumId, albumTitle } = route.params;
  const [photos, setPhotos] = useState([]);
  const [loading, setLoading] = useState(false);
  const [after, setAfter] = useState(null);
  const [hasNextPage, setHasNextPage] = useState(true);
  const navigation = useNavigation();

  useEffect(() => {
    loadPhotos();
  }, []);

  const loadPhotos = async () => {
    if (loading || !hasNextPage) return;
    setLoading(true);

    const media = await MediaLibrary.getAssetsAsync({
      album: albumId,
      mediaType: "photo",
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
      <View style={styles.photoContainer}>
        <FlatList
          data={photos}
          keyExtractor={(photo) => photo.id}
          renderItem={({ item }) => (
            <TouchableOpacity>
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
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#333333",
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
