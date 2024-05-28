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
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const { width, height } = Dimensions.get("window");

function SettingsScreen() {
  const [selectedSetting, setSelectedSetting] = useState(null);
  const [isLoging, setLoging] = useState(false);
  const [isRegistering, setRegistering] = useState(false);
  const [login, setLogin] = useState('');
  const [email, setEmail] = useState('');
  const [passwd, setPasswd] = useState('');
  const [confPasswd, setConfPasswd] = useState('');
  const [username, setUsername] = useState('Guest');
  const server_address = 'http://192.168.0.106:8000/';
  navigation = useNavigation();

  const register = async () => {

    let apiUrl = server_address + 'register';
    const reg_data = {
      "username": login,
      "email": email,
      "password": passwd,
      "full_name": "vaflya"
    }

    await axios.post(apiUrl, reg_data);

    setEmail(null);
    setPasswd(null);
    setConfPasswd(null);

    setRegistering(false);
  };

  const logIn = async () => {
    let apiUrl = server_address + 'token';

    let data = new URLSearchParams();
    data.append('username', login);
    data.append('password', passwd);

    response = await axios.post(apiUrl, data, { headers: 'Content-type: application/x-www-form-urlencoded' });
    let token = response.data['access_token'];
    let apiUrl2 = server_address + 'users/me?token=' + token;

    response = await axios.get(apiUrl2);
    data = response.data;

    await AsyncStorage.setItem('@account_id', data['id'].toString());
    await AsyncStorage.setItem('@username', data['username'].toString());
    get_username();

    setPasswd(null)

    setLoging(false);
  };

  const logout = async () => {
    await AsyncStorage.removeItem('@account_id');
    await AsyncStorage.setItem('@username', 'Guest');
    get_username();
  };

  const get_username = async () => {
    const value = await AsyncStorage.getItem('@username');
    setUsername(value);
  }

  function SettingsMain() {
    get_username();
    return (
      <View style={{ flex: 1 }} onPress={() => { logg(); }}>
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.backBtn}
            onPress={() => {
              navigation.navigate(SCREENS.MAIN);
            }}
          >
            <Ionicons name="chevron-back" size={34} style={styles.backIcon} />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => setSelectedSetting("Profile")}>
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
              <Ionicons name="camera" size={30} />
            </TouchableOpacity>
          </View>
          <Text style={[styles.text, styles.userText]}>{username}</Text>
          <TouchableOpacity style={styles.settingBtn} onPress={() => setLoging(true)}>
            <Text style={[styles.text, styles.btnText]}>Войти</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.settingBtn} onPress={() => setRegistering(true)}>
            <Text style={[styles.text, styles.btnText]}>
              Зарегистрироваться
            </Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.settingBtn} onPress={() => logout()}>
            <Text style={[styles.text, styles.btnText]}>Выйти</Text>
          </TouchableOpacity>
        </View>

        <Modal
          visible={isLoging === true}
          animationType="fade"
          transparent={true}
        >
          <View style={styles.modalBackground}>
            <View style={styles.modalCont}>
              <TouchableOpacity
                style={styles.modalBackBtn}
                onPress={() => setLoging(false)}
              >
                <Ionicons name="chevron-back" size={34} style={styles.backIcon} />
              </TouchableOpacity>
              <View style={styles.modalElem}>
                <Text style={[styles.text, styles.modalTxt]}>Login</Text>
                <TextInput style={styles.modalInput} onEndEditing={(value) => setLogin(value.nativeEvent.text)} placeholder="...">{login}</TextInput>
              </View>
              <View style={styles.modalElem}>
                <Text style={[styles.text, styles.modalTxt]}>Password</Text>
                <TextInput style={styles.modalInput} onEndEditing={(value) => setPasswd(value.nativeEvent.text)} secureTextEntry={true} placeholder="...">{passwd}</TextInput>
              </View>
              <TouchableOpacity onPress={() => logIn()}>
                <View style={[styles.applyBtn, styles.modalElem]}>
                  <Text style={[styles.text, styles.applyTxt]}>Войти</Text>
                </View>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>

        <Modal
          visible={isRegistering === true}
          animationType="fade"
          transparent={true}
        >
          <View style={styles.modalBackground}>
            <View style={styles.modalRegCont}>
              <TouchableOpacity
                style={[styles.backBtn, { left: -width / 3, top: -40 }]}
                onPress={() => setRegistering(false)}
              >
                <Ionicons name="chevron-back" size={34} style={styles.backIcon} />
              </TouchableOpacity>
              <View style={styles.modalElem}>
                <Text style={[styles.text, styles.modalTxt]}>Login</Text>
                <TextInput style={styles.modalInput} onEndEditing={(value) => setLogin(value.nativeEvent.text)} placeholder="...">{login}</TextInput>
              </View>
              <View style={styles.modalElem}>
                <Text style={[styles.text, styles.modalTxt]}>E-mail</Text>
                <TextInput style={styles.modalInput} onEndEditing={(value) => setEmail(value.nativeEvent.text)} keyboardType="email-address" placeholder="example@sut.ru">{email}</TextInput>
              </View>
              <View style={styles.modalElem}>
                <Text style={[styles.text, styles.modalTxt]}>Password</Text>
                <TextInput style={styles.modalInput} onEndEditing={(value) => setPasswd(value.nativeEvent.text)} secureTextEntry={true} placeholder="...">{passwd}</TextInput>
              </View>
              <View style={styles.modalElem}>
                <Text style={[styles.text, styles.modalTxt]}>Confirm Password</Text>
                <TextInput style={styles.modalInput} onEndEditing={(value) => setConfPasswd(value.nativeEvent.text)} secureTextEntry={true} placeholder="...">{confPasswd}</TextInput>
              </View>
              <TouchableOpacity onPress={() => register()}>
                <View style={[styles.applyBtn, styles.modalElem]}>
                  <Text style={[styles.text, styles.applyTxt]}>Зарегистрироваться</Text>
                </View>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
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
        <SettingsProfile />
      )}
      {selectedSetting === "Внешний вид" && (
        <SettingsLook />
      )}
      {selectedSetting === "Редактор" && (
        <SettingsEditor />
      )}
      {selectedSetting === "Синхронизация" && (
        <SettingsSync />
      )}
      {selectedSetting === "Помощь" && (
        <SettingsHelp />
      )}
      {selectedSetting === "О приложении" && (
        <SettingsAbout />
      )}

    </View>
  );
};

function logg() {
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
  pageCont: {
    alignItems: "center",
    //flex:1,
  },
  modalBackground: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    alignItems: "center",
    justifyContent: 'center',
  },
  modalCont: {
    //flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#333333',
    borderRadius: 30,
    width: width - width / 10,
    height: height / 2,
  },
  modalRegCont: {
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#333333',
    borderRadius: 30,
    width: width - width / 10,
    height: height / 1.5,
  },
  modalTxt: {
    fontSize: 18,
    color: '#FFFFFF',
    marginBottom: 5,
  },
  modalInput: {
    borderRadius: 10,
    backgroundColor: "#E7E7E7",
    width: 286,
    height: 35,
    paddingLeft: 8,
  },
  modalElem: {
    marginVertical: 5,
  },
  applyBtn: {
    borderRadius: 10,
    backgroundColor: "#8CE8E5",
    width: width - 2 * (width / 5),
    height: 40,
    width: 286,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 40,
  },
  applyTxt: {
    color: "#333333",
    fontSize: 18,
  },
  modalBackBtn: {
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#8CE8E5",
    borderRadius: 10,
    height: 45,
    width: 45,
    marginTop: 20,
    left: -width / 3,
    top: -40,
  },
  pfpCont: {
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: "center",
    //flex: 1,
    marginBottom: 40,
    width: width / 2,
    height: width / 2,
    borderRadius: 100,

  },
  pfp: {
    borderRadius: 100,
    width: width / 2,
    height: width / 2,
    backgroundColor: "#FFFFFF",
    //resizeMode: 'contain',
  },
  changePfp: {
    borderRadius: 50,
    width: 50,
    height: 50,
    backgroundColor: "#8CE8E5",
    position: "absolute",
    top: width / 2.6,
    left: width / 3,
    justifyContent: 'center',
    alignItems: 'center',
  },
  userText: {
    fontSize: 24,
    color: "#FFFFFF",
    marginBottom: 40,
  },
  settingBtn: {
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#8CE8E5",
    borderRadius: 10,
    marginBottom: 15,
    width: width - 40,
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
