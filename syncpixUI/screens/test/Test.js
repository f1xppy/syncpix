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
  Button,
} from "react-native";
import axios from 'axios';
export default function Testik() {

  const getDevices = async() => {

    const apiUrl='http://172.18.0.39:8000/devices?account_id=1&mac=44';
      await axios.post(apiUrl).then(function(response) { 
        console.log(response.data);
    });
  }
  return (
    <View style={{flex: 1, justifyContent: "center", alignContent: "center"}}>
      <Button 
        onPress={getDevices}
        title="Нажми"
      />
    </View>
  );
}
