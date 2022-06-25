import React from "react";
import {
  View,
  Text,
  SafeAreaView,
  StatusBar,
  Dimensions,
  StyleSheet,
  ScrollView,
  Image,
} from "react-native";
const { width } = Dimensions.get("window");
import FontAwesome from "react-native-vector-icons/FontAwesome";
import Ionicons from "react-native-vector-icons/Ionicons";
import SelectDropdown from "react-native-select-dropdown";
import {
  useFonts,
  Rubik_600SemiBold,
  Rubik_500Medium,
  Orbitron_600SemiBold,
} from "@expo-google-fonts/dev";

function LanguageBar(props) {
  const languages = [
    "(CN) Chinese",
    "(EN) English",
  ];

  return (
      <SelectDropdown
        data={languages}
        // defaultValueByIndex={1}
        // defaultValue={'Egypt'}
        onSelect={(selectedItem, index) => {
          console.log(selectedItem, index);
        }}
        defaultButtonText={"Languages"}
        buttonTextAfterSelection={(selectedItem, index) => {
          return selectedItem;
        }}
        rowTextForSelection={(item, index) => {
          return item;
        }}
        buttonStyle={styles.dropdown1BtnStyle}
        buttonTextStyle={styles.dropdown1BtnTxtStyle}
        renderDropdownIcon={(isOpened) => {
          return (
            <FontAwesome
              name={isOpened ? "chevron-up" : "chevron-down"}
              color={"#777"}
              size={18}
            />
          );
        }}
        dropdownIconPosition={"right"}
        dropdownStyle={styles.dropdown1DropdownStyle}
        rowStyle={styles.dropdown1RowStyle}
        rowTextStyle={styles.dropdown1RowTxtStyle}
      />
  );
}

export default LanguageBar;

const styles = StyleSheet.create({
  dropdown1BtnStyle: {
    width: "80%",
    height: 40,
    backgroundColor: "#FFF",
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "#777",
    elevation: 2,
  },
  dropdown1BtnTxtStyle: { color: "#777", textAlign: "left", fontFamily: "Rubik_500Medium",paddingLeft: 30 },
  dropdown1DropdownStyle: {
    backgroundColor: "rgba(160,160,160,0.95)",
    borderBottomStartRadius: 25,
    borderBottomEndRadius: 25
  },
  dropdown1RowStyle: {
    borderRadius: 25,
    //backgroundColor: "transparent)",
  },
  dropdown1RowTxtStyle: { color: "white", textAlign: "left",paddingLeft: 35,fontFamily: "Rubik_500Medium" },
});
