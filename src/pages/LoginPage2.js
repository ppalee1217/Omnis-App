import {
  Alert,
  Pressable,
  View,
  Image,
  Text,
  StyleSheet,
  TextInput,
  KeyboardAvoidingView,
} from "react-native";

import React, { useState } from "react";

function LoginPage2(props) {
  const [imo, setImo] = useState("");
  const [password, setPassword] = useState("");
  const [imoInput, setImoInput] = useState("");
  const [passwordInput, setPasswordInput] = useState("");
  const [canPress, setCanPress] = useState(false);

  const canBePressed = (imo,password) => {
    if (imo.length > 0 && password.length > 0) {
      setCanPress(true);
    } else {
      setCanPress(false);
    }
  };

  const imoChange = (input) => {
    setImoInput(input);
    setImo(input);
    canBePressed(input, password);
  };

  const passwordChange = (input) => {
    setPasswordInput(input);
    setPassword(input);
    canBePressed(imo, input);
  };

  const changeToMenu = () => {
    //console.log(`imo: ${imo.length}`);
    //console.log(`password: ${password.length}`);
    if (imo == 9604081 || imo == 9832975)
      props.navigation.navigate("Home", { imo: imo });
    else {
      Alert.alert("登入發生問題", "密碼錯誤或此船隻尚未註冊!", [
        {
          text: "我知道了!",
        },
      ]);
      setImoInput("");
      setImo("");
      setPasswordInput("");
      setPassword("");
      setCanPress(false);
    }
  };

  return (
    <KeyboardAvoidingView
      eyboardAvoidingView
      style={styles.loginPage}
      behavior={Platform.OS == "ios" ? "padding" : "height"}
      enabled={false}
    >
      <View style={styles.background}></View>
      <Image
        style={styles.logo}
        source={require("../../res/images/logo.png")}
      />
      <View style={styles.inputContainer}>
        <View style={styles.userinput}>
          <Text style={styles.text}>帳號</Text>
          <TextInput
            placeholder="船隻IMO編號"
            style={styles.ID}
            onChangeText={imoChange}
            onPressOut={() => canBePressed}
            value={imoInput}
          ></TextInput>
        </View>
        <View style={styles.userinput}>
          <Text style={styles.text}>密碼</Text>
          <TextInput
            secureTextEntry={true}
            autoCorrect={false}
            placeholder="已註冊船隻之密碼"
            onChangeText={passwordChange}
            onPressOut={() => canBePressed}
            style={styles.ID}
            value={passwordInput}
          ></TextInput>
        </View>
      </View>
      <View style={canPress ? styles.pressContainer : styles.noPressContainer}>
        <Pressable
          android_ripple={{ color: "#78b5d6", borderless: true }}
          style={styles.login}
          onPress={changeToMenu}
          disabled={!canPress}
        >
          <Text style={styles.loginText}>確認</Text>
        </Pressable>
      </View>
    </KeyboardAvoidingView>
  );
}

export default LoginPage2;

const styles = StyleSheet.create({
  loginPage: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
  logo: {
    resizeMode: "contain",
    position: "absolute",
    width: 120,
    height: 120,
    bottom: 550,
  },
  background: {
    flex: 4,
    width: "150%",
    height: "150%",
    top: "50%",
    left: "5%",
    position: "absolute",
    backgroundColor: "#C8F7FF",
    borderRadius: 500,
  },
  userinput: {
    width: "100%",
  },
  inputContainer: {
    top: "0%",
    alignItems: "center",
    justifyContent: "space-evenly",
    width: "58%",
    overflow: "hidden",
  },
  text: {
    color: "#A0A0A0",
    fontSize: 15,
    fontFamily: "Rubik_600SemiBold",
  },
  ID: {
    height: 38,
    alignSelf: "stretch",
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "gray",
    paddingLeft: 10,
    marginBottom: 30,
    backgroundColor: "#fff",
    fontSize: 15,
  },
  login: {
    width: "100%",
    justifyContent: "space-evenly",
    alignItems: "center",
    flexDirection: "row",
  },
  pressContainer: {
    top: "4%",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#1dd2ee",
    borderRadius: 10,
    width: "40%",
    height: 30,
    overflow: "hidden",
  },
  noPressContainer: {
    top: "4%",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#646566",
    borderRadius: 10,
    width: "40%",
    height: 30,
    overflow: "hidden",
  },
  loginText: {
    fontFamily: "Rubik_600SemiBold",
    fontSize: 18,
    color: "#fff",
  },
});
