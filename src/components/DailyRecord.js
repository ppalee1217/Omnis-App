import {
  StyleSheet,
  Text,
  Image,
  View,
  Button,
  TextInput,
  FlatList,
} from "react-native";

import {
  useFonts,
  Rubik_600SemiBold,
  Rubik_500Medium,
  Orbitron_600SemiBold,
} from "@expo-google-fonts/dev";
// const data = {
//   date: (_date.getMonth() + 1 + "/" + _date.getDate()).toString(),
//   yesterDayPosition: yesterDayPosition,
//   nowPosition: position,
//   yesterDayco2: yesterDayco2,
//   toDayco2: toDayco2,
//   rpm: todayRPM,

//   AWH: waveHieght,
//   wind: windSpeed,
//   AWT: AWT,
// };

function DailyRecord(props) {
  let [fontsLoaded] = useFonts({
    "digital-7": require("../../assets/fonts/digital-7.ttf"),
  });
  let init = false;
  if (props.yesterDayCO2 == 0) {
    init = true;
  }
  let ysday = props.yesterDayPosition;
  let today = props.nowPosition;
  let co2percent;
  if (init) {
    co2percent = "第一天不計算值";
  } else {
    co2percent =
      ((props.toDayCO2 - props.yesterDayCO2) / props.yesterDayCO2) * 100;
  }
  //console.log(props.toDayco2)
  return (
    <View style={styles.DailyRecordContainer}>
      <View style={styles.DateContainer}>
        <Text style={styles.dateText}>{props.date}</Text>
        <View style={{ flexDirection: "row" }}>
          <Image
            style={styles.symbol}
            source={
              co2percent > 0
                ? require("../../res/images/up.png")
                : require("../../res/images/down.png")
            }
          />
          <Text style={styles.percentText}>{Math.abs(co2percent).toFixed(3)}</Text>
        </View>
        <Text style={styles.percentText}>
          CO2 : {(props.toDayCO2 / 1000).toFixed(2)}t
        </Text>
      </View>
      <View style={styles.TextContainer}>
        <View style={{ flexDirection: "row" }}>
          <Text style={styles.informationText}>From </Text>
          <Text style={[styles.informationText,{color:"#000"}]}>
            {ysday.latitude.toFixed(2)}°/{ysday.longitude.toFixed(2)}°
          </Text>
          <Text style={styles.informationText}> to </Text>
          <Text style={[styles.informationText,{color:"#000"}]}>
            {today.latitude.toFixed(2)}°/{today.longitude.toFixed(2)}°
          </Text>
        </View>
        <Text style={styles.informationText}>
          Max PPM : {Math.max(...props.todayRPM).toFixed(4)}
        </Text>
        <Text style={styles.informationText}>
          Min PRM : {Math.min(...props.todayRPM).toFixed(4)}
        </Text>
        <Text style={styles.informationText}>
          Ave Wave Height(m) : {props.waveHeight}
        </Text>
        <Text style={styles.informationText}>
          Max Wind (kts) : {props.windSpeed}
        </Text>
        <Text style={styles.informationText}>
          Ave Wind Temp : {props.AWT}°C
        </Text>
      </View>
    </View>
  );
}
export default DailyRecord;

const styles = StyleSheet.create({
  TextContainer: {
    height: 50,
    width: "75%",
    marginTop: 20,
    marginLeft: "4%",
    flexDirection: "column",
    alignItems: "flex-start",
  },

  informationText: {
    marginTop: 5,
    color: "gray",
    fontSize: 9,
    fontWeight: "bold",
  },

  DailyRecordContainer: {
    backgroundColor: "white",
    borderRadius: 15,
    height: 150,
    width: "90%",
    marginLeft: "5%",
    marginTop: 15,
    marginBottom: 10,
    flexDirection: "row",
    alignItems: "flex-start",
  },

  dateText: {
    color: "#fff",
    fontSize: 35,
    fontWeight: "400",
    marginLeft: 25,
  },

  percentText: {
    color: "#fff",
    fontSize: 15,
    marginTop: 2,
    marginLeft: "7%",
    fontFamily: "Rubik_600SemiBold",
    fontWeight: "bold",
  },

  DateContainer: {
    backgroundColor: "#28c0d9",
    borderRadius: 10,
    height: 110,
    width: "40%",
    marginLeft: "6%",
    marginTop: 20,
    flexDirection: "column",
    alignItems: "flex-start",
  },

  symbol: {
    marginLeft: 18,
    marginTop: 5,
    width: 20,
    height: 15,
  },
});
