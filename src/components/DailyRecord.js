import { useState } from "react";
import {
  StyleSheet,
  Text,
  Image,
  View,
  Button,
  TextInput,
  FlatList,
} from "react-native";

function DailyRecord(props) {
  return (
    <View style={styles.DailyRecordContainer}>
      <View style={styles.DateContainer}>
        <Text style={styles.dateText}>{props.data[props.num].date}</Text>
        <View style={{ flexDirection: "row" }}>
          <Image
            style={styles.symbol}
            source={
              props.positive
                ? require("../../res/images/up.png")
                : require("../../res/images/down.png")
            }
          />
          <Text style={styles.percentText}>
            {Math.abs(props.data[props.num].percent)}
          </Text>
        </View>
        <Text style={styles.percentText}>
          CO2 : {props.data[props.num].co2}
        </Text>
      </View>
      <View style={styles.TextContainer}>
        <Text style={styles.informationText}>
          From 25.81°/120.77° to 40.42°/123.83°
        </Text>
        <Text style={styles.informationText}>Max PPM : 50.7</Text>
        <Text style={styles.informationText}>Min PRM : 17.5</Text>
        <Text style={styles.informationText}>Ave Wave Height(m) : 1.03</Text>
        <Text style={styles.informationText}>Max Wind (kts) :10</Text>
        <Text style={styles.informationText}>Ave Wind Temp : 24.5°C</Text>
      </View>
    </View>
  );
}

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
    color: "#000",
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
    fontWeight: "bold",
    marginLeft: 25,
  },

  percentText: {
    color: "#fff",
    fontSize: 15,
    marginTop: 3,
    marginLeft: "7%",
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

export default DailyRecord;
