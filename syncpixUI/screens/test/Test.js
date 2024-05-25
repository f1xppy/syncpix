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

/*
function heehee() {
    return 
  }
*/
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
