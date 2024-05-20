import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  Modal,
  StatusBar,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from '@react-navigation/native';
import SCREENS from "..";

const { width, height } = Dimensions.get("window");

function SettingsScreen() {
  const [selectedSetting, setSelectedSetting] = useState(null);
  return (
    <View style={styles.container}>
      {selectedSetting === null && (
        <View style={{ flex: 1 }}>
            {SettingsMain()}
        </View>
      )}
    </View>
  );
};

function logg(){
    return console.log("hello");
};

function SettingsMain() {
  const navigation = useNavigation();
  return (
    <View style={{ flex: 1 }} onPress={() => {logg();}}>
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backBtn}
          onPress={() => {
            navigation.navigate(SCREENS.MAIN);
          }}
        >
          <Ionicons name="chevron-back" size={34} style={styles.backIcon} />
        </TouchableOpacity>
        <View style={styles.ava}></View>
      </View>
      <TouchableOpacity
        style={styles.settingBtn}
        onPress={() => setSelectedSetting("Внешний вид")}
      >
        <Text style={[styles.text, styles.btnText]}>Внешний вид</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.settingBtn}
        onPress={() => setSelectedSetting("Редактор")}
      >
        <Text style={[styles.text, styles.btnText]}>Редактор</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.settingBtn}
        onPress={() => setSelectedSetting("Синхронизация")}
      >
        <Text style={[styles.text, styles.btnText]}>Синхронизация</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.settingBtn}
        onPress={() => setSelectedSetting("Помощь")}
      >
        <Text style={[styles.text, styles.btnText]}>Помощь</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.settingBtn}
        onPress={() => setSelectedSetting("О приложении")}
      >
        <Text style={[styles.text, styles.btnText]}>О приложении</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#333333",
    paddingTop: StatusBar.currentHeight,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 100,
  },
  ava: {
    borderRadius: 50,
    width: 50,
    height: 50,
    backgroundColor: "#FFFFFF",
    marginHorizontal: 15,
    marginTop: 20,
  },
  settingBtn: {
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#8CE8E5",
    borderRadius: 10,
    marginLeft: 20,
    marginRight: 20,
    marginBottom: 15,
    height: 45,
  },
  backBtn: {
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#8CE8E5",
    borderRadius: 10,
    height: 45,
    width: 45,
    marginHorizontal: 15,
    marginTop: 20,
    paddingRight: 2,
  },
  backIcon: {
    color: "#333333",
  },
  text: {
    fontFamily: "Roboto",
  },
  test: {
    backgroundColor: "orange",
  },
  btnText: {
    color: "#333333",
    fontSize: 20,
  },
});

export default SettingsScreen;
