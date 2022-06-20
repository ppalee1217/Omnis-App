import {Text, View, Image, StyleSheet} from 'react-native';
import {
  useFonts,
  Rubik_600SemiBold,
  Rubik_500Medium,
  Orbitron_600SemiBold,
} from "@expo-google-fonts/dev";

function SpeedIcon(props) {
  let [fontsLoaded] = useFonts({
    Rubik_500Medium,
    Rubik_600SemiBold,
    Orbitron_600SemiBold,
    "digital-7": require("../../assets/fonts/digital-7.ttf"),
  });

  return (
    <View style={styles.container}>
      <View style={
        props.isGood
        ? styles.good
        : styles.notgood
      }>
        <Image
          source={
            props.isGood
            ? require("../../res/images/done.png")
            : require("../../res/images/danger.png")
          }
          tintColor={props.isGood ? "#3fcf3c" : "#c53939"}
          style={styles.mark} />
      </View>
    </View>
  );
}

export default SpeedIcon;

const styles = StyleSheet.create({
  container: {
    width: "5%",
    height: "5%",
    top: "20%",
    left: "3%",
  },
  mark:{
    width: 30,
    height: 30,
  },
  good:{
    width: 80,
    height: 80,
    borderRadius: 40,
    borderWidth: 6,
    backgroundColor: "#fff",
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    borderColor:"#3fcf3c",
  },
  notgood:{
    width: 80,
    height: 80,
    borderRadius: 40,
    borderWidth: 6,
    backgroundColor: "#fff",
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    borderColor:"#c53939",
  },
})