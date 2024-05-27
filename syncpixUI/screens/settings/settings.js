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
  Image,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from '@react-navigation/native';
import SCREENS from "..";

const { width, height } = Dimensions.get("window");

function SettingsScreen() {
  const [selectedSetting, setSelectedSetting] = useState(null);
  navigation = useNavigation();

  function SettingsMain() {
  
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
          <TouchableOpacity onPress={()=> setSelectedSetting("Profile")}>
          <Image
            style={styles.ava}
            source={require("../../assets/UI_Elements/unregistered.png")}
            />
          </TouchableOpacity>
        </View>
        <View style={styles.pageCont}>
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
        <TouchableOpacity
          style={styles.settingBtn}
          onPress={() => {
            navigation.navigate(SCREENS.TEST);
          }}
        >
          <Text style={[styles.text, styles.btnText]}>TEST</Text>
        </TouchableOpacity>
        </View>
      </View>
    );
  }

  function SettingsProfile() {
  
    return (
      <View style={{ flex: 1 }}>
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.backBtn}
            onPress={() => {
              setSelectedSetting(null);
            }}
          >
            <Ionicons name="chevron-back" size={34} style={styles.backIcon} />
          </TouchableOpacity>
        </View>
        <View style={styles.pageCont}>
        <View style={styles.pfpCont}>
            <Image
              source={require("../../assets/photo4.jpg")}
              style={styles.pfp}
            />
            <TouchableOpacity style={styles.changePfp}>
              <Ionicons name="camera" size={30}/>
            </TouchableOpacity>
        </View>
        <Text style={[styles.text, styles.userText]}>User Name</Text>
        <TouchableOpacity
          style={styles.settingBtn}
        >
          <Text style={[styles.text, styles.btnText]}>Войти</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.settingBtn}
        >
          <Text style={[styles.text, styles.btnText]}>Зарегистрироваться</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.settingBtn}
        >
          <Text style={[styles.text, styles.btnText]}>Выйти</Text>
        </TouchableOpacity>
        </View>
      </View>
    );
  }

  function SettingsLook() {
    return (
      <View style={{ flex: 1 }}>
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.backBtn}
            onPress={() => {
              setSelectedSetting(null)
            }}
          >
            <Ionicons name="chevron-back" size={34} style={styles.backIcon} />
          </TouchableOpacity>
          <Text style={styles.headerText}>Внешний Вид</Text>
        </View>
        <View style={styles.pageCont}>
        <TouchableOpacity
          style={styles.settingBtn}
        >
          <Text style={[styles.text, styles.btnText]}>Кнопка</Text>
        </TouchableOpacity>
        </View>
      </View>
    );
  }

  function SettingsEditor() {
    return (
      <View style={{ flex: 1 }}>
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.backBtn}
            onPress={() => {
              setSelectedSetting(null)
            }}
          >
            <Ionicons name="chevron-back" size={34} style={styles.backIcon} />
          </TouchableOpacity>
          <Text style={styles.headerText}>Редактор</Text>
        </View>
        <View style={styles.pageCont}>
        <TouchableOpacity
          style={styles.settingBtn}
        >
          <Text style={[styles.text, styles.btnText]}>Кнопка</Text>
        </TouchableOpacity>
        </View>
      </View>
    );
  }

  function SettingsSync() {
    return (
      <View style={{ flex: 1 }}>
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.backBtn}
            onPress={() => {
              setSelectedSetting(null)
            }}
          >
            <Ionicons name="chevron-back" size={34} style={styles.backIcon} />
          </TouchableOpacity>
          <Text style={styles.headerText}>Синхронизация</Text>
        </View>
        <View style={styles.pageCont}>
        <TouchableOpacity
          style={styles.settingBtn}
        >
          <Text style={[styles.text, styles.btnText]}>Кнопка</Text>
        </TouchableOpacity>
        </View>
      </View>
    );
  }

  function SettingsHelp() {
    return (
      <View style={{ flex: 1 }}>
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.backBtn}
            onPress={() => {
              setSelectedSetting(null)
            }}
          >
            <Ionicons name="chevron-back" size={34} style={styles.backIcon} />
          </TouchableOpacity>
          <Text style={styles.headerText}>Помощь</Text>
        </View>
        <View style={styles.pageCont}>
        <TouchableOpacity
          style={styles.settingBtn}
        >
          <Text style={[styles.text, styles.btnText]}>Кнопка</Text>
        </TouchableOpacity>
        </View>
      </View>
    );
  }

  function SettingsAbout() {
    return (
      <View style={{ flex: 1 }}>
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.backBtn}
            onPress={() => {
              setSelectedSetting(null)
            }}
          >
            <Ionicons name="chevron-back" size={34} style={styles.backIcon} />
          </TouchableOpacity>
          <Text style={styles.headerText}>О приложении</Text>
        </View>
        <View style={styles.pageCont}>
        <TouchableOpacity
          style={styles.settingBtn}
        >
          <Text style={[styles.text, styles.btnText]}>Кнопка</Text>
        </TouchableOpacity>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {selectedSetting === null && (
        <View style={{ flex: 1 }}>
            {SettingsMain()}
        </View>
      )}
      {selectedSetting === "Profile" && (
        <SettingsProfile/>
      )}
      {selectedSetting === "Внешний вид" && (
        <SettingsLook/>
      )}
      {selectedSetting === "Редактор" && (
        <SettingsEditor/>
      )}
      {selectedSetting === "Синхронизация" && (
        <SettingsSync/>
      )}
      {selectedSetting === "Помощь" && (
        <SettingsHelp/>
      )}
      {selectedSetting === "О приложении" && (
        <SettingsAbout/>
      )}
        
    </View>
  );
};

function logg(){
    return console.log("hello");
};





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
  pageCont:{
    alignItems: "center",
    //flex:1,
  },
  pfpCont:{
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: "center",
    //flex: 1,
    marginBottom: 40,
    width: width/2,
    height: width/2,
    borderRadius: 100,
    
  },
  pfp:{
    borderRadius: 100,
    width: width/2,
    height: width/2,
    backgroundColor: "#FFFFFF",
    //resizeMode: 'contain',
  },
  changePfp:{
    borderRadius: 50,
    width: 50,
    height: 50,
    backgroundColor: "#8CE8E5",
    position: "absolute",
    top: width/2.6,
    left: width/3,
    justifyContent: 'center',
    alignItems: 'center',
  },
  userText:{
    fontSize:24,
    color: "#FFFFFF",
    marginBottom: 40,
  },
  settingBtn: {
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#8CE8E5",
    borderRadius: 10,
    marginBottom: 15,
    width: width-40,
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
  headerText: {
    color: '#FFFFFF',
    fontSize: 20,
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
