import React from "react";
import { View, Text, ImageBackground, StyleSheet } from "react-native";
import { LineChart } from "react-native-gifted-charts";
import {
  useFonts,
  Rubik_600SemiBold,
  Rubik_500Medium,
  Orbitron_600SemiBold,
} from "@expo-google-fonts/dev";

function Chart(props) {
  //console.log(props)

  return (
    <LineChart
      data={props.data}
      data2={props.data2 ? props.data2 : null}
      backgroundColor={"#fff"}
      curved={true}
      showVerticalLines={true}
      yAxisThickness={1}
      xAxisThickness={1}
      yAxisColor="black"
      yAxisTextStyle={{
        color: "black",
        fontSize: 10,
        fontFamily: "Rubik_600SemiBold",
      }}
      yAxisTextNumberOfLines={1}
      yAxisLabelWidth={25}
      xAxisLabelWidth={0}
      spacing={40}
      color={props.color}
      thickness={2}
      rulesType="solid"
      rulesColor="gray"
      initialSpacing={30}
      noOfSections={5}
      stepHeight={120 / 5}
      minValue={0}
      maxValue={props.max}
      height={120}
      hideOriginal={true}
      verticalLinesHeight={130}
      verticalLinesThickness={1.5}
      verticalLineColor={"#balck"}
      hideDataPoints1={true}
      isAnimated={true}
      // animateOnDataChange={true}
      scrollAnimation={true}
      scrollAnimationDuration={1000}
      pointerConfig={{
        activatePointersOnLongPress: true,
        activatePointersDelay: 250,
        pointerVanishDelay: 950,
        backgroundColor: "#99d6e0",
        pointerStripHeight: 130,
        pointerStripColor: "black",
        pointerStripWidth: 5,
        pointerColor: "black",
        radius: 6,
        pointerLabelWidth: 110,
        pointerLabelHeight: 40,
        autoAdjustPointerLabelPosition: false,
        pointerLabelComponent: (items) => {
          return (
            <View
              style={{
                height: 40,
                width: 100,
                top: 20,
                justifyContent: "center",
                // marginTop: -30,
                // marginLeft: -40,
              }}
            >
              <ImageBackground
                style={styles.image}
                resizeMode="contain"
                source={require("../../res/images/doubleArrow.png")}
              >
                <Text
                  style={{
                    color: "black",
                    fontSize: 12,
                    fontWeight: "bold",
                    textAlign: "center",
                    top: 15
                  }}
                >
                  {items[0].date}
                </Text>
              </ImageBackground>
              <View
                style={{
                  borderRadius: 5,
                  borderColor: "black",
                  borderWidth: 1,
                  height: 20,
                  width: "70%",
                  backgroundColor: "white",
                }}
              >
                <Text
                  style={{
                    fontSize: 15,
                    fontWeight: "bold",
                    textAlign: "center",
                  }}
                >
                  {items[0].value}
                </Text>
              </View>
            </View>
          );
        },
      }}
    />
  );
}

export default Chart;

const styles = StyleSheet.create({
  image: {
    height: 50,
    elevation:5,
    width: 120,
    top:20,
    right:25
  },
  text: {
    flex: 1,
    color: "black",
    borderWidth: 5,
    borderColor: "white",
    fontWeight: "bold",
    textAlign: "center",
    fontSize: 18,
    fontWeight: "bold",
    top: 2,
  },
});
