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

function heehee() {
    const apiUrl='http://172.18.0.39:8000/devices?account_id=1';
    axios.get(apiUrl).then(response);
    return response;
  }

export default function Testik() {
  return (
    <View style={{flex: 1, justifyContent: "center", alignContent: "center"}}>
      <Button 
        onPress={() => heehee}
        title="Нажми"
      />
    </View>
  );
}
