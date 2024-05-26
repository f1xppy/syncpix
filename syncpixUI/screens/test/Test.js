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
import axios from 'axios'; // запросы

// import DeviceInfo from 'react-native-device-info'; // чтобы брать название устройства

export default function Testik() {
  //const fs = require('fs'); //файловая система
  const [devices, setDevices] = useState('none'); // тестовое текстовое поле
  const getDevices = async() => { // получить список устройств
    
    const apiUrl='http://172.18.0.39:8000/devices?account_id=1';
    await axios.get(apiUrl).then(function(response) { 
      const data = response.data;
      const dataString = typeof data === 'object' ? JSON.stringify(data, null, 2) : data;
      
      /*fs.writeFile('../devices.txt', dataString, (err) => {
        if (err) {
          console.error('Error writing to file', err);
        } else {
          console.log('File has been saved');
        }
      });*/
    });
  }
  const addDevice = async() => {    // добавить себя
    const account_id = 1;
    const deviceName = 'Redmi Note 15';
    const deviceName_enq = encodeURIComponent(deviceName);
    const apiUrl = 'http://127.0.0.1:8000/devices?account_id=1&name='+deviceName_enq;
    setDevices(apiUrl);
    await axios.post(apiUrl);
  }
  return (
    <View style={{flex: 1, justifyContent: "center", alignContent: "center"}}>
      <Button 
        onPress={addDevice}
        title="Нажми"
      />
      <Text>{devices}</Text>
    </View>
  );
}
