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
  const [text_content, setText] = useState('none');
  
  const getDevices = async() => {
    const apiUrl='http://172.18.0.39:8000/devices?account_id=1';
    try {
      const response = await axios.get(apiUrl, {timeout: 2000});
      setText(response.data);
    } catch (err) {
      setText(err.message);
    }
    //setText('Ttt');
  }
  return (
    <View style={{flex: 1, justifyContent: "center", alignContent: "center"}}>
      <Button 
        onPress={getDevices}
        title="Нажми"
      />
      <Text>{text_content}</Text>
    </View>
  );
}
