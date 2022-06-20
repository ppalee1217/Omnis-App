import { View, Image, Text, StyleSheet, Pressable } from "react-native";

function LoginPage(props) {

  const changeToLogin = () =>{
    props.navigation.navigate("輸入頁面");
  }

  return (
    <View style={styles.loginPage}>
      <View style={styles.background}></View>
      <Image
        style={styles.logo}
        source={require("../../res/images/logo.png")}
      />
      <View style={styles.pressContainer}>
        <Pressable
          android_ripple={{ color: "#78b5d6", borderless: true }}
          style={styles.login}
          onPress={changeToLogin}
        >
          <Text style={styles.loginText}>登入</Text>
        </Pressable>
      </View>
    </View>
  );
}

export default LoginPage;

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
    width: 200,
    height: 200,
    bottom: 450,
  },
  background: {
    flex: 4,
    width: "150%",
    height: "150%",
    bottom: "20%",
    position: "absolute",
    backgroundColor: "#C8F7FF",
    borderRadius: 500,
  },
  login: {
    width: "100%",
    justifyContent: "space-evenly",
    alignItems: "center",
    flexDirection: "row",
  },
  pressContainer:{
    top: "4%",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#1dd2ee",
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
