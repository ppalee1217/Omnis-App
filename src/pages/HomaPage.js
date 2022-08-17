import React, { useState, useRef, useEffect } from "react";
import {
  StyleSheet,
  Text,
  View,
  ToastAndroid,
  Image,
  ScrollView,
  Pressable,
} from "react-native";
import TabNavigator from "react-native-tab-navigator";
import MapView, { Polyline, Marker } from "react-native-maps";
import BottomSheet, { BottomSheetView } from "@gorhom/bottom-sheet";
import { FloatingMenu } from "react-native-floating-action-menu";
import axios from "axios";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { faBars, faTimes } from "@fortawesome/free-solid-svg-icons";
import DailyRecord from "../components/DailyRecord";
import Chart from "../components/Chart";
import Chart2 from "../components/Chart2";
import RelatedPage from "./RelatedPage";
import RoundIcon from "../components/RoundIcon";
import SpeedIcon from "../components/SpeedIcon";
import LanguageBar from "../components/LanguageBar";
import Toast, { BaseToast } from "react-native-toast-message";
import LinearGradient from "react-native-linear-gradient";
import {
  useFonts,
  Rubik_600SemiBold,
  Rubik_500Medium,
  Orbitron_600SemiBold,
} from "@expo-google-fonts/dev";

export default function HomePage({ route, navigation }) {
  let [fontsLoaded] = useFonts({
    Rubik_600SemiBold,
    Rubik_500Medium,
    Orbitron_600SemiBold,
    "digital-7": require("../../assets/fonts/digital-7.ttf"),
  });
  const { imo } = route.params;
  const [isSpeedOver, setIsSpeedOver] = useState(false);
  const [positionLong, setPositionLong] = useState(0);
  const [positionLati, setPositionLati] = useState(0);
  const [selectedTab, setSelected] = useState("my");
  const [pass, Changepass] = useState("");
  const [TabBarHeight, setBarHeight] = useState(60);
  const [isMenuOpen, setMenuOpen] = useState(false);
  const bottomSheetRef = useRef(null);
  const [barBackgroundColor, setBarBackgroundColor] = useState("#fff");
  const [courseData, setCourseData] = useState(0);
  const [oldspeed, setOldSpeed] = useState(0);
  const [CO2_Data, setCo2Data] = useState([]);
  const [RPM_Data, setRPMData] = useState([]);
  const [old_CS_Data, setOldCSData] = useState([]);
  const [Current_Speed_Data, setCSData] = useState([]);
  const [old_WS_Data, setOldWSData] = useState([]);
  const [Wind_Speed_Data, setWSData] = useState([]);
  const [futureCordinates, setFutureCordinates] = useState([]);
  const [historyCordinates, setHistoryCordinates] = useState([]);
  const [speed, setSpeed] = useState(0);
  const [daily, setDaily] = useState([]);
  const items = [
    {
      label: "碳排計算",
      image: require("../../res/images/co2.png"),
      labelStyle: {
        fontSize: 18,
        fontFamily: "Rubik_600SemiBold",
        color: "white",
        //textDecorationLine: "underline",
      },
    },
    {
      label: "航跡追蹤",
      image: require("../../res/images/trace.png"),
      labelStyle: {
        fontSize: 18,
        fontFamily: "Rubik_600SemiBold",
        color: "white",
        //textDecorationLine: "underline",
      },
    },
    {
      label: "個人設定",
      image: require("../../res/images/profile.png"),
      labelStyle: {
        fontSize: 18,
        fontFamily: "Rubik_600SemiBold",
        color: "white",
        //textDecorationLine: "underline",
      },
    },
  ];

  const arrowImage = [
    require("../../res/images/UpArrow.png"),
    require("../../res/images/LeftArrow.png"),
    require("../../res/images/RightArrow.png"),
    require("../../res/images/DownArrow.png"),
  ];

  let adjustSpeed = 0;
  let passHourtmp;
  let calNumtmp;
  // Setting date
  let _date;
  // Setting one time parameter
  let speedOverTmp = false;
  let calNum = 0;
  let passHour = 0;
  let counter = 0;
  // setting chart
  let co2_tmp = [];
  let rpm_tmp = [];
  let old_cs_tmp = [];
  let cs_tmp = [];
  let old_ws_tmp = [];
  let ws_tmp = [];
  // setting map
  let FCtmp = [];
  let HCtmp = [];
  // setting daily record
  let dailytmp = [];
  let yesterDayPosition = {};
  let yesterDayco2 = 0;
  let toDayco2 = 0;
  const todayRPM = [];
  let windSpeed = 0;
  let waveHieght = 0;
  let AWT = 0;
  // Data Set for two boats
  const cargoData = require("../../res/data/4cargo.json");
  let calculatedData;
  let historyData;
  let storageDataOneTime;
  let storageDataPara;
  let cargo = {};
  let BoatURL;
  // Setting for counter activation
  let initReady = false;

  if (imo == 9604081) {
    calculatedData = require("../../res/data/calculated/Omnis_EVERLOGIC.json");
    historyData = require("../../res/data/EVER_LOGIC.json");
    storageDataOneTime = require("../../res/data/storage/BoatEverOneTime.json");
    storageDataPara = require("../../res/data/storage/BoatEverPara.json");
    cargo = cargoData[1];
    BoatURL = "BoatEver";
    initIsReady();
    //readBoat = require('../../res/data/Everlocation.json');
  } else {
    calculatedData = require("../../res/data/calculated/Omnis_CHINA.json");
    historyData = require("../../res/data/CHINA_STEEL.json");
    storageDataOneTime = require("../../res/data/storage/BoatChinaOneTime.json");
    storageDataPara = require("../../res/data/storage/BoatChinaPara.json");
    cargo = cargoData[0];
    BoatURL = "BoatChina";
    initIsReady();
    //readBoat = require('../../res/data/Chinalocation.json');
  }

  async function initIsReady() {
    // position init

    // setOldSpeed(storageDataOneTime.oldspeed);
    // setCourseData(storageDataOneTime.courseData);
    // setSpeed(storageDataOneTime.speed);
    await initStorageData();
    initReady = true;
    //console.log("initReady");
    //console.log(HCtmp)
    //console.log(dailytmp)
    //console.log(co2_tmp)
  }

  async function initStorageData() {
    //setPositionLati(storageDataOneTime.positionLati);
    //setPositionLong(storageDataOneTime.positionLong);
    // Setting date
    _date = new Date(storageDataOneTime._date);
    // Setting one time parameter
    speedOverTmp = storageDataOneTime.isSpeedOver;
    calNum = storageDataOneTime.calNum;
    calNumtmp = storageDataOneTime.calNum;
    passHour = storageDataOneTime.passHour;
    passHourtmp = storageDataOneTime.passHour;
    counter = storageDataOneTime.counter;
    // setting chart
    // co2_tmp = storageDataPara.CO2_Data;
    // rpm_tmp = storageDataPara.RPM_Data;
    // old_cs_tmp = storageDataPara.old_CS_Data;
    // cs_tmp = storageDataPara.Current_Speed_Data;
    // old_ws_tmp = storageDataPara.old_WS_Data;
    // ws_tmp = storageDataPara.Wind_Speed_Data;
    // setting map
    FCtmp = storageDataPara.futureCordinates;
    HCtmp = storageDataPara.historyCordinates;
    // setting daily record
    dailytmp = storageDataPara.daily;
    yesterDayPosition = storageDataPara.daily[dailytmp.length - 1].nowPosition;
    yesterDayco2 = storageDataPara.daily[dailytmp.length - 1].toDayco2;
  }

  const _co2_tmp = [...storageDataPara.CO2_Data];
  const _rpm_tmp = [...storageDataPara.RPM_Data];
  const _cs_tmp = [...storageDataPara.Current_Speed_Data];
  const _ws_tmp = [...storageDataPara.Wind_Speed_Data];

  useEffect(() => {
    if (pass == "碳排計算") {
      Changepass("");
      changeTabToTrending();
    } else if (pass == "航跡追蹤") {
      Changepass("");
      changeTabToFavorite();
    } else if (pass == "個人設定") {
      Changepass("");
      changeTabToMy();
    }
  }, [isMenuOpen]);

  // for (let i = 1; i < historyData.length; i++) {
  //   const position = {
  //     latitude: historyData[i].Latitude,
  //     longitude: historyData[i].Longitude,
  //   };
  //   FCtmp.push(position);
  // }

  const changeCo2Data = (changeDay, newData, day) => {
    //new part
    let _co2 = [...co2_tmp];
    if (changeDay) {
      _co2.push({
        value: newData.toFixed(1),
        date: day.toLocaleTimeString(),
        label: (day.getMonth() + 1 + "/" + day.getDate()).toString(),
        labelTextStyle: { color: "#99d6e0", fontWeight: "bold", width: 100 },
      });
    } else {
      _co2.push({ value: newData.toFixed(1), date: day.toLocaleTimeString() });
    }
    setCo2Data(_co2);
    co2_tmp = _co2;
  };

  const changeRPMData = (changeDay, newData, day) => {
    //new part
    let _rpm = [...rpm_tmp];
    if (changeDay) {
      _rpm.push({
        value: newData.toFixed(1),
        date: day.toLocaleTimeString(),
        label: (day.getMonth() + 1 + "/" + day.getDate()).toString(),
        labelTextStyle: { color: "#99d6e0", fontWeight: "bold", width: 100 },
      });
    } else {
      _rpm.push({ value: newData.toFixed(1), date: day.toLocaleTimeString() });
    }
    setRPMData(_rpm);
    rpm_tmp = _rpm;
  };

  const changeWSData = (changeDay, newData, oldData, day) => {
    //new part
    let _ws = [...ws_tmp];
    if (changeDay) {
      _ws.push({
        value: newData.toFixed(1),
        date: day.toLocaleTimeString(),
        label: (day.getMonth() + 1 + "/" + day.getDate()).toString(),
        labelTextStyle: { color: "#99d6e0", fontWeight: "bold", width: 100 },
      });
    } else {
      _ws.push({ value: newData.toFixed(1), date: day.toLocaleTimeString() });
    }
    setWSData(_ws);
    ws_tmp = _ws;
    //old part
    let _old_ws = [...old_ws_tmp];
    _old_ws.push({ value: oldData.toFixed(1), date: day.toLocaleTimeString() });
    setOldWSData(_old_ws);
    old_ws_tmp = _old_ws;
  };

  const changeCSData = (changeDay, newData, oldData, day) => {
    //new part
    let _cs = [...cs_tmp];
    if (changeDay) {
      _cs.push({
        value: newData.toFixed(1),
        date: day.toLocaleTimeString(),
        label: (day.getMonth() + 1 + "/" + day.getDate()).toString(),
        labelTextStyle: { color: "#99d6e0", fontWeight: "bold", width: 100 },
      });
    } else {
      _cs.push({ value: newData.toFixed(1), date: day.toLocaleTimeString() });
    }
    setCSData(_cs);
    cs_tmp = _cs;
    //old part
    let _old_cs = [...old_cs_tmp];
    _old_cs.push({ value: oldData.toFixed(1), date: day.toLocaleTimeString() });
    setOldCSData(_old_cs);
    old_cs_tmp = _old_cs;
  };

  const changeSpeed = (speed) => {
    setSpeed(speed);
  };

  const changePosition = (position) => {
    setPositionLati(position.latitude);
    setPositionLong(position.longitude);
    //console.log(`${positionLati}, ${positionLong}`);
  };

  const changeFutureCordinates = (position) => {
    let FC = [...FCtmp];
    FC.shift();
    FC.unshift(position);
    setFutureCordinates(FC);
    FCtmp = FC;
    // console.log(`移除: ${remove.latitude}, ${remove.longitude}`);
    // console.log(`加入: ${position.latitude}, ${position.longitude}`);
    // console.log(FC)
  };

  const changeFutureCordinatesHour = () => {
    let FC = [...FCtmp];
    FC.shift();
    setFutureCordinates(FC);
    FCtmp = FC;
  };

  const changeHistoryCordinates = (position) => {
    let HC = [...HCtmp];
    HC.push(position);
    setHistoryCordinates(HC);
    HCtmp = HC;
    //console.log(`加入: ${position.latitude}, ${position.longitude}`);
    //console.log(HC);
  };

  const addDailyRecord = (data) => {
    console.log("新增Reocrd!");
    let dailyTmp = [...dailytmp];
    dailyTmp.unshift(data);
    setDaily(dailyTmp);
    dailytmp = dailyTmp;
  };

  useEffect(() => {
    const interval = setInterval(() => {
      if (initReady) {
        counter++;
        if (calNum == 0) {
          //console.log(calculatedData[0]);
          //console.log(historyData[0]);
          calNum++;
          passHour++;
          const position = {
            latitude: calculatedData[0].latitude,
            longitude: calculatedData[0].longitude,
          };
          // Update Daily record
          yesterDayPosition = {
            latitude: calculatedData[0].latitude,
            longitude: calculatedData[0].longitude,
          };
          yesterDayco2 = 0;
          toDayco2 = calculatedData[0].CO2;
          todayRPM.push(calculatedData[0].RPM);
          // Update Chart
          setOldSpeed(calculatedData[0].HistorySpeed);
          setCourseData(calculatedData[0].HistoryCourse);
          changePosition(position);
          changeHistoryCordinates(position);
          changeSpeed(calculatedData[0].speed);
          changeFutureCordinates(position);
          changeCo2Data(true, calculatedData[0].CO2, _date);
          changeRPMData(true, calculatedData[0].RPM, _date);
          changeCSData(
            true,
            Math.abs(calculatedData[0].Current_Speed),
            Math.abs(historyData[0].CurrentsSpeed),
            _date
          );
          changeWSData(
            true,
            Math.abs(calculatedData[0].Wind_Speed),
            Math.abs(historyData[0].WindSpeed),
            _date
          );
        } else if (calculatedData[calNum-calNumtmp].time <= counter) {
          //console.log(daily)
          calNum++;
          const position = {
            latitude: calculatedData[calNum-calNumtmp].latitude,
            longitude: calculatedData[calNum-calNumtmp].longitude,
          };
          // Update Daily record
          toDayco2 += calculatedData[calNum-calNumtmp].CO2;
          todayRPM.push(calculatedData[calNum-calNumtmp].RPM);
          if ((counter / 3600) >= passHour) {
            console.log(`過一個小時了 ${passHour}`);
            console.log(`${_date}`)
            let changeDay = false;
            passHour++;
            let nowHour = _date.getHours();
            _date.setHours(nowHour + 1);
            if (_date.getHours() == 0) {
              changeDay = true;
            }
            // Update Chart
            changeCo2Data(changeDay, calculatedData[calNum-calNumtmp].CO2, _date);
            changeRPMData(changeDay, calculatedData[calNum-calNumtmp].RPM, _date);
            changeCSData(
              changeDay,
              Math.abs(calculatedData[calNum-calNumtmp].Current_Speed),
              Math.abs(historyData[passHour - passHourtmp].CurrentSpeed),
              _date
            );
            changeWSData(
              changeDay,
              Math.abs(calculatedData[calNum-calNumtmp].Wind_Speed),
              Math.abs(historyData[passHour - passHourtmp].WindSpeed),
              _date
            );

            if (changeDay) {
              console.log(`過一天了! ${_date}`);
              //Max wind
              windSpeed = historyData[passHour - passHourtmp].WindSpeed;
              //Wave height
              waveHieght = historyData[passHour - passHourtmp].WaveHeight;
              //Wind temperature
              AWT = historyData[passHour - passHourtmp].WindTemp;
              //Update Daily record
              let __date;
              if (_date.getMonth() < 10) {
                __date = `0${_date.getMonth() + 1}`;
              } else {
                __date = `${_date.getMonth() + 1}`;
              }
              if (_date.getDate() < 10) {
                __date += `/0${_date.getDate()}`;
              } else {
                __date += `/${_date.getDate()}`;
              }
              let todayRPMtmp = [...todayRPM];
              const data = {
                id: passHour,
                // Date
                date: __date,
                // From A to B
                yesterDayPosition: yesterDayPosition,
                nowPosition: position,
                // Total Co2
                yesterDayco2: yesterDayco2,
                toDayco2: toDayco2,
                // RPM array
                rpm: todayRPMtmp,
                // Misc
                AWH: waveHieght,
                wind: windSpeed,
                AWT: AWT,
              };
              addDailyRecord(data);
              yesterDayPosition = position;
              yesterDayco2 = toDayco2;
              // Reset
              toDayco2 = 0;
              todayRPM.splice(0, todayRPM.length);
              //console.log(todayRPM);
            }
            changeFutureCordinatesHour();
          }
          if (
            calculatedData[calNum-calNumtmp].HistorySpeed > calculatedData[calNum-calNumtmp].speed
          ) {
            if (!speedOverTmp) {
              setIsSpeedOver(true);
              speedOverTmp = true;
              let hs = calculatedData[calNum].HistorySpeed;
              let sp = calculatedData[calNum].speed;
              adjustSpeed = hs - sp;
              Toast.show({
                //需調速畫面
                type: "success",
                text1:
                  "Please                           the speed by            knots",
                text2: `       slow down                                ${adjustSpeed.toFixed(
                  2
                )}`,
              });
            }
          } else {
            if (speedOverTmp) {
              Toast.show({
                //調速完畢畫面
                type: "error",
                text1: "Speed has been reduced by                knots",
                text2: `${adjustSpeed.toFixed(2)}`,
              });
            }
            speedOverTmp = false;
            setIsSpeedOver(false);
          }

          setOldSpeed(calculatedData[calNum-calNumtmp].HistorySpeed);
          setCourseData(calculatedData[calNum-calNumtmp].HistoryCourse);
          changePosition(position);
          changeHistoryCordinates(position);
          changeSpeed(calculatedData[calNum-calNumtmp].speed);
          changeFutureCordinates(position);
          let dailyTmp = [...dailytmp];
          setDaily(dailyTmp)
          //console.log(`calNum: ${calNum} calNumtmp: ${calNumtmp}`)
          // let _co2 = [...co2_tmp];
          // setCo2Data(_co2);
          // let _rpm = [...rpm_tmp];
          // setRPMData(_rpm);
          // let _ws = [...ws_tmp];
          // setWSData(_ws);
          // let _old_ws = [...old_ws_tmp];
          // setOldWSData(_old_ws);
          // let _cs = [...cs_tmp];
          // setCSData(_cs);
          // let _old_cs = [...old_cs_tmp];
          // setOldCSData(_old_cs);

          // let BOAT1time = {
          //   //一次性變數
          //   counter : counter,
          //   calNum : calNum,
          //   passHour : passHour,
          //   _date : _date,
          //   positionLong : position.longitude,<
          //   positionLati : position.latitude,
          //   isSpeedOver : isSpeedOver,
          //   courseData : calculatedData[calNum].HistoryCourse,
          //   speed : calculatedData[calNum].speed,
          //   oldspeed : calculatedData[calNum].HistorySpeed,
          // }

          // let BOATpara = {
          //   // Map變數
          //   futureCordinates: FCtmp,
          //   historyCordinates: HCtmp,
          //   // Chart變數
          //   CO2_Data: co2_tmp,
          //   RPM_Data: rpm_tmp,
          //   Current_Speed_Data: cs_tmp,
          //   old_CS_Data: old_cs_tmp,
          //   Wind_Speed_Data: ws_tmp,
          //   old_WS_Data: old_ws_tmp,
          //   // Daily變數
          //   daily: dailytmp,
          // };

          //axios.post(`https://omnis-fdb7c-default-rtdb.asia-southeast1.firebasedatabase.app/${BoatURL}para3.json`,
          //BOATpara
          //);
          //axios.post(`https://omnis-fdb7c-default-rtdb.asia-southeast1.firebasedatabase.app/${BoatURL}oneTime2.json`,
          //BOAT1time
          //);
        }
        // console.log(calculatedData[calNum-calNumtmp].time)
        // console.log(`time: ${counter}`);
        // console.log(`目前使用參數編號: ${calNum}`);
        // console.log(`時間: ${_date}`);
        // console.log(`counter: ${counter / 3600} passHour: ${passHour}`);
        // console.log(`目前位置: ${positionLati}, ${positionLong}\n\n`);
      }
    }, 10);
    return () => clearInterval(interval);
  }, []);

  const handleItemPress = (item, index) => {
    if (item.label == "碳排計算") {
      Changepass("碳排計算");
      ChangeMenuOpen();
    } else if (item.label == "航跡追蹤") {
      Changepass("航跡追蹤");
      ChangeMenuOpen();
    } else if (item.label == "個人設定") {
      Changepass("個人設定");
      ChangeMenuOpen();
    }
  };

  const MenuIcon = (menuState) => {
    return isMenuOpen ? (
      <FontAwesomeIcon icon={faTimes} size={25} color={"#63B8FF"} />
    ) : (
      <FontAwesomeIcon icon={faBars} size={25} color={"#63B8FF"} />
    );
  };

  const ItemIcon = (item, index, menuState) => {
    // Icons can be rendered however you like.
    // Here are some examples, using data from the item object:
    const { itemsDown, dimmerActive } = menuState;
    if (item.image) {
      return (
        <Image
          source={item.image}
          style={{ tintColor: "#63B8FF" }}
          flex={1}
          width={null}
          height={null}
          resizeMode="contain"
        />
      );
    }

    return null;
  };

  const changeToLogin = () => {
    //setLoginPage(true);
    navigation.navigate("登入頁面");
  };

  const changeToRelated = () => {
    //setLoginPage(true);
    navigation.navigate("相關頁面");
  };

  function ChangeMenuOpen() {
    setMenuOpen(!isMenuOpen);
  }

  function changeTabToPopular() {
    setBarHeight(0);
    setSelected("popular");
  }

  function changeTabToTrending() {
    setBarHeight(60);
    setSelected("trending");
    setBarBackgroundColor("rgba(40, 192, 217, 0.4)");
  }

  function changeTabToFavorite() {
    setBarHeight(60);
    setSelected("favorite");
    setBarBackgroundColor("rgba(40, 192, 217, 0.4)");
  }

  function changeTabToMy() {
    setBarHeight(60);
    setSelected("my");
    setBarBackgroundColor("#fff");
  }

  const hideToast = () => {
    Toast.hide();
  };

  const toastConfig = {
    success: (props) => (
      <BaseToast
        {...props}
        style={{
          borderColor: "rgba(0,0,0,0.7)",
          backgroundColor: "rgba(0,0,0,0.85)",
          borderRadius: 15,
          left: 10,
          bottom: 48,
        }}
        contentContainerStyle={{ paddingHorizontal: 15 }}
        text1Style={{
          right: 10,
          top: 11,
          fontSize: 14,
          fontWeight: "500",
          fontFamily: "Rubik_600SemiBold",
          color: "white",
        }}
        //需調速畫面
        text2Style={{
          left: 19,
          bottom: 8,
          fontSize: 14,
          fontWeight: "500",
          fontFamily: "Rubik_600SemiBold",
          color: "#FFD569",
        }}
        renderTrailingIcon={() => (
          <Image
            tintColor={"white"}
            style={styles.closeButton}
            source={require("../../res/images/close.png")}
          />
        )}
      />
    ),
    error: (props) => (
      <BaseToast
        {...props}
        style={{
          borderColor: "rgba(0,0,0,0.7)",
          backgroundColor: "rgba(0,0,0,0.85)",
          borderRadius: 15,
          left: 10,
          bottom: 48,
        }}
        contentContainerStyle={{ paddingHorizontal: 15 }}
        text1Style={{
          right: 10,
          top: 11,
          fontSize: 14,
          fontWeight: "500",
          fontFamily: "Rubik_600SemiBold",
          color: "white",
        }}
        //調速完畫面
        text2Style={{
          left: 185,
          bottom: 8,
          fontSize: 14,
          fontWeight: "500",
          fontFamily: "Rubik_600SemiBold",
          color: "#FFD569",
        }}
        renderTrailingIcon={() => (
          <Image
            tintColor={"white"}
            style={styles.closeButton}
            source={require("../../res/images/close.png")}
          />
        )}
      />
    ),
  };

  return (
    <View style={styles.container}>
      <View style={{ flex: 1 }}>
        <TabNavigator
          tabBarStyle={{
            height: TabBarHeight,
            overflow: "hidden",
            borderWidth: 0,
            borderTopWidth: 0.5,
            borderRightWidth: 1,
            borderLeftWidth: 1,
            borderColor: "gray",
            borderTopLeftRadius: 20,
            borderTopRightRadius: 20,
          }}
          sceneStyle={{
            paddingBottom: TabBarHeight,
            backgroundColor: barBackgroundColor,
          }}
        >
          <TabNavigator.Item
            selected={selectedTab === "popular"}
            title="建議航速"
            selectedTitleStyle={{ color: "#63B8FF" }}
            renderIcon={() => (
              <Image
                style={[styles.icon, { tintColor: "#808080" }]}
                source={require("../../res/images/boat.png")}
              />
            )}
            renderSelectedIcon={() => (
              <Image
                style={[styles.icon, { tintColor: "#63B8FF" }]}
                source={require("../../res/images/boat.png")}
              />
            )}
            onPress={changeTabToPopular}
          >
            <>
              <View style={styles.container}>
                <MapView
                  style={styles.map}
                  initialRegion={{
                    latitude: positionLati,
                    longitude: positionLong,
                    latitudeDelta: 0.0922,
                    longitudeDelta: 0.0421,
                  }}
                >
                  {/* 歷史資料 */}
                  <Polyline
                    coordinates={historyCordinates}
                    strokeColor="#4A5DA6"
                    strokeWidth={5}
                  />
                  <Marker
                    coordinate={{
                      latitude: positionLati,
                      longitude: positionLong,
                    }}
                    style={{ width: 50, height: 50 }}
                  >
                    <View
                      style={{
                        backgroundColor: "#4A5DA6",
                        borderWidth: 3,
                        borderRadius: 50,
                        borderColor: "#fff",
                      }}
                    >
                      <Image
                        source={require("../../res/images/ship.png")}
                        style={{
                          height: "100%",
                          width: "100%",
                        }}
                      />
                    </View>
                  </Marker>
                  {/* 預測航線 */}
                  <Polyline
                    coordinates={futureCordinates}
                    strokeColor="#fff"
                    strokeWidth={3}
                    lineCap="square"
                    lineDashPattern={[50, 30]}
                  />
                </MapView>
                <View style={styles.container2}>
                  <FloatingMenu
                    position={"top-left"}
                    primaryColor={"#63B8FF"}
                    dimmerStyle={{
                      marginTop: -30,
                      backgroundColor: "rgba(47, 105, 118, 0.853)",
                    }}
                    innerWidth={50}
                    isOpen={isMenuOpen}
                    items={items}
                    renderItemIcon={ItemIcon}
                    renderMenuIcon={MenuIcon}
                    onMenuToggle={ChangeMenuOpen}
                    onItemPress={handleItemPress}
                  />
                  <Toast
                    onPress={hideToast}
                    config={toastConfig}
                    position="top"
                    visibilityTime={10000}
                  />
                  <View style={[styles.container, { top: "7%" }]}>
                    <RoundIcon
                      num={courseData}
                      text={"COURSE"}
                      img={arrowImage}
                    />
                    <Text style={styles.courseText}>COURSE</Text>
                  </View>
                  <View style={[styles.container, { bottom: "5%" }]}>
                    <RoundIcon
                      num={oldspeed.toFixed(1)}
                      text={"當前航速"}
                      img={null}
                    />
                    <Text style={styles.currentIconSpeedText}>當前航速</Text>
                    <View style={styles.speedIconContainer}>
                      <SpeedIcon isGood={!isSpeedOver} />
                      <Text style={styles.currentIconStatusText}>
                        {!isSpeedOver ? "請維持" : "請調速"}
                      </Text>
                    </View>
                  </View>
                </View>
                <BottomSheet
                  backgroundStyle={styles.contentContainer}
                  handleIndicatorStyle={{
                    backgroundColor: "#e9faff",
                    marginTop: 15,
                    height: 6,
                    width: "65%",
                  }}
                  ref={bottomSheetRef}
                  index={0}
                  snapPoints={["7%", "30%"]}
                >
                  <BottomSheetView>
                    <View>
                      <View style={styles.currentSpeedContainer}>
                        <Text style={styles.currentSpeedText}>當前航速</Text>
                        <View style={styles.digitalDisplayContainer}>
                          <View style={styles.digitalDisplay}>
                            <Text style={styles.displayNumber}>
                              {oldspeed.toFixed(2)}
                            </Text>
                          </View>
                          <Text style={styles.currentSpeedText}>Knots</Text>
                        </View>
                      </View>
                      <View
                        style={
                          !isSpeedOver
                            ? styles.dontChangeSpeedContainer
                            : styles.doChangeSpeedContainer
                        }
                      >
                        <Text style={styles.changeSpeedText}>
                          {!isSpeedOver ? "航速維持" : "請調速至"}
                        </Text>
                        <View style={styles.digitalDisplayContainerDown}>
                          <View style={styles.digitalDisplay}>
                            <Text style={styles.displayNumber}>
                              {speed.toFixed(2)}
                            </Text>
                          </View>
                          <Text style={styles.changeSpeedText}>Knots</Text>
                        </View>
                      </View>
                    </View>
                  </BottomSheetView>
                </BottomSheet>
              </View>
            </>
          </TabNavigator.Item>

          <TabNavigator.Item
            selected={selectedTab === "trending"}
            title="碳排計算"
            selectedTitleStyle={{ color: "#63B8FF" }}
            renderIcon={() => (
              <Image
                style={[styles.icon, { tintColor: "#808080" }]}
                source={require("../../res/images/co2.png")}
              />
            )}
            renderSelectedIcon={() => (
              <Image
                style={[styles.icon, { tintColor: "#63B8FF" }]}
                source={require("../../res/images/co2.png")}
              />
            )}
            onPress={changeTabToTrending}
          >
            <View style={{ flex: 1 }}>
              <View style={{ marginTop: 30 }}>
                <View style={styles.tempChartContainer}>
                  <View style={styles.tempChartSymbol}>
                    <Text style={styles.tempChartTextCo2}>CO2</Text>
                  </View>
                  <View
                    style={{
                      flex: 1,
                      borderRadius: 20,
                      backgroundColor: "white",
                      left: 20,
                      top: 5,
                    }}
                  >
                    <Chart data={_co2_tmp} color={"red"} max={2000} />
                  </View>
                </View>
                <View style={styles.tempChartContainer}>
                  <View style={styles.tempChartSymbol}>
                    <Text style={styles.tempChartText}>RPM</Text>
                  </View>
                  <View
                    style={{
                      flex: 1,
                      borderRadius: 20,
                      backgroundColor: "white",
                      left: 20,
                      top: 20,
                    }}
                  >
                    <Chart data={_rpm_tmp} color={"#4A5DA6"} max={20} />
                  </View>
                </View>
                <View style={styles.tempChartContainer}>
                  <View style={styles.tempChartSymbolSpeed}>
                    <View style={{ marginTop: 5 }}></View>
                    <Text style={styles.tempChartTextSpeed}>OG</Text>
                    <Text style={styles.tempChartTextSpeed}>Speed</Text>
                    <Text style={styles.tempChartKTS}>(kts)</Text>
                  </View>
                  <View
                    style={{
                      flex: 1,
                      borderRadius: 20,
                      backgroundColor: "white",
                      left: 20,
                      top: 35,
                    }}
                  >
                    <Chart
                      data={_cs_tmp}
                      //data2={old_cs_tmp}
                      color={"#4A5DA6"}
                      color2={"gray"}
                      max={5}
                    />
                  </View>
                </View>
                <View style={styles.tempChartContainer}>
                  <View style={styles.tempChartSymbolSpeed}>
                    <View style={{ marginTop: 5 }}></View>
                    <Text style={styles.tempChartTextSpeed}>Wind</Text>
                    <Text style={styles.tempChartTextSpeed}>Speed</Text>
                    <Text style={styles.tempChartKTS}>(kts)</Text>
                  </View>
                  <View
                    style={{
                      flex: 1,
                      borderRadius: 20,
                      backgroundColor: "white",
                      left: 20,
                      top: 50,
                    }}
                  >
                    <Chart
                      data={_ws_tmp}
                      //data2={old_ws_tmp}
                      color={"#4A5DA6"}
                      color2={"gray"}
                      max={10}
                    />
                  </View>
                </View>
              </View>
            </View>
          </TabNavigator.Item>

          <TabNavigator.Item
            selected={selectedTab === "favorite"}
            title="航跡追蹤"
            selectedTitleStyle={{ color: "#63B8FF" }}
            renderIcon={() => (
              <Image
                style={[styles.icon, { tintColor: "#808080" }]}
                source={require("../../res/images/trace.png")}
              />
            )}
            renderSelectedIcon={() => (
              <Image
                style={[styles.icon, { tintColor: "#63B8FF" }]}
                source={require("../../res/images/trace.png")}
              />
            )}
            onPress={changeTabToFavorite}
          >
            <View style={{ flex: 1 }}>
              <View style={{ marginTop: 50 }}>
                <ScrollView>
                  {daily.map((item) => {
                    return (
                      <DailyRecord
                        key={item.id}
                        toDayCO2={item.toDayco2}
                        yesterDayCO2={item.yesterDayco2}
                        date={item.date}
                        yesterDayPosition={item.yesterDayPosition}
                        nowPosition={item.nowPosition}
                        todayRPM={item.rpm}
                        waveHeight={item.AWH}
                        windSpeed={item.wind}
                        AWT={item.AWT}
                      />
                    );
                  })}
                </ScrollView>
              </View>
            </View>
          </TabNavigator.Item>

          <TabNavigator.Item
            selected={selectedTab === "my"}
            title="個人設定"
            selectedTitleStyle={{ color: "#63B8FF" }}
            renderIcon={() => (
              <Image
                style={[styles.icon, { tintColor: "#808080" }]}
                source={require("../../res/images/profile.png")}
              />
            )}
            renderSelectedIcon={() => (
              <Image
                style={[styles.icon, { tintColor: "#63B8FF" }]}
                source={require("../../res/images/profile.png")}
              />
            )}
            onPress={changeTabToMy}
          >
            <View style={[styles.container, { flexDirection: "column" }]}>
              <View
                style={{
                  backgroundColor: "#28c0d9",
                  flex: 1,
                  alignItems: "center",
                }}
              >
                <Text style={styles.information}>船舶資訊</Text>
                <View style={styles.logoutContainer}>
                  <Pressable
                    android_ripple={{ color: "#78b5d6", borderless: false }}
                    style={styles.logout}
                    onPress={changeToLogin}
                  >
                    <Text style={styles.logoutText}>登出</Text>
                    <Image
                      source={require("../../res/images/logout.png")}
                      style={styles.logoutImg}
                    />
                  </Pressable>
                </View>
              </View>
              <View style={styles.informationbtn}>
                <View style={styles.relatedContainer}>
                  <Pressable
                    android_ripple={{ color: "#78b5d6", borderless: false }}
                    style={styles.relatedBtn}
                    onPress={changeToRelated}
                  >
                    <Image
                      source={require("../../res/images/web.png")}
                      style={styles.relatedImg}
                    />
                    <Text style={styles.relatedText}>相關網站</Text>
                  </Pressable>
                  <View style={styles.relatedPageTextContainer}>
                    <Text style={styles.relatedPageText}>最新動態</Text>
                    <Text style={styles.relatedPageText}>海向資訊</Text>
                    <Text style={styles.relatedPageText}>港務安全</Text>
                  </View>
                </View>
                <View style={styles.informationContainer}>
                  <View style={{ flexDirection: "row" }}>
                    <Image
                      style={styles.nation}
                      source={require("../../res/images/taiwan.png")}
                    />
                    <Text style={styles.nation_text}>{cargo.vesselName}</Text>
                  </View>
                  <Image
                    style={styles.boat}
                    source={require("../../res/images/boats.png")}
                  />
                  <View style={styles.shipContainer}>
                    <Text style={styles.shipType}>Container Ship</Text>
                  </View>
                  <View
                    style={{
                      top: 5,
                      flexDirection: "column",
                      alignItems: "center",
                    }}
                  >
                    <View style={{ flexDirection: "row" }}>
                      <Text style={styles.informationText}>IMO : </Text>
                      <Text style={styles.informationTextPara}>
                        {" "}
                        {cargo.imo}
                      </Text>
                    </View>
                    <View style={{ flexDirection: "row" }}>
                      <Text style={styles.informationText}>MMSI : </Text>
                      <Text style={styles.informationTextPara}>
                        {" "}
                        {cargo.mmsi}
                      </Text>
                    </View>
                    <View style={{ flexDirection: "row" }}>
                      <Text style={styles.informationText}>length : </Text>
                      <Text style={styles.informationTextPara}>
                        {" "}
                        {cargo.length}
                      </Text>
                    </View>
                    <View style={{ flexDirection: "row" }}>
                      <Text style={styles.informationText}>Width : </Text>
                      <Text style={styles.informationTextPara}>
                        {" "}
                        {cargo.width}
                      </Text>
                    </View>
                    <View style={{ flexDirection: "row" }}>
                      <Text style={styles.informationText}>Capacity : </Text>
                      <Text style={styles.informationTextPara}>
                        {" "}
                        {cargo.capacity}
                      </Text>
                    </View>
                    <View style={{ flexDirection: "row" }}>
                      <Text style={styles.informationText}>Draught : </Text>
                      <Text style={styles.informationTextPara}>
                        {" "}
                        {cargo.draught}
                      </Text>
                    </View>
                    <View style={{ flexDirection: "row" }}>
                      <Text style={styles.informationText}>Draught Max : </Text>
                      <Text style={styles.informationTextPara}>
                        {" "}
                        {cargo.draughtMax}
                      </Text>
                    </View>
                    <View style={{ flexDirection: "row" }}>
                      <Text style={styles.informationText}>Draught Min : </Text>
                      <Text style={styles.informationTextPara}>
                        {" "}
                        {cargo.draughtMin}
                      </Text>
                    </View>
                    <View style={{ top: 20 }}>
                      <LanguageBar />
                    </View>
                  </View>
                </View>
              </View>
            </View>
          </TabNavigator.Item>
        </TabNavigator>
      </View>
      <View style={{ display: "none" }}>
        <RelatedPage />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  map: {
    ...StyleSheet.absoluteFillObject,
  },

  container: {
    flex: 1,
  },

  container2: {
    top: 30,
    flex: 1,
  },
  icon: {
    width: 26,
    height: 26,
  },

  relatePage: {
    justifyContent: "center",
    alignItems: "center",
    paddingTop: 30,
    //backgroundColor: '#c4d7ff'
  },

  imageView: {
    paddingTop: 30,
  },

  image: {
    flexDirection: "column",
    justifyContent: "center",
    height: 200,
    width: 317,
  },

  textInImageUP: {
    left: 5,
    top: "35%",
    fontSize: 32,
    color: "#ffffff",
    fontWeight: "bold",
  },

  textInImageDOWN: {
    left: 10,
    top: "35%",
    fontSize: 12,
    paddingBottom: 15,
    color: "#ffffff",
    fontWeight: "bold",
  },

  currentSpeedContainer: {
    backgroundColor: "#28c0d9",
    borderRadius: 15,
    height: 70,
    width: "75%",
    marginLeft: "10%",
    marginTop: 25,
    flexDirection: "row",
    alignItems: "flex-start",
  },

  currentSpeedText: {
    marginTop: 20,
    marginLeft: 20,
    color: "#fff",
    fontSize: 20,
    fontWeight: "bold",
  },

  dontChangeSpeedContainer: {
    flexDirection: "row",
    backgroundColor: "#41d83e",
    borderRadius: 15,
    height: 70,
    width: "75%",
    marginLeft: "10%",
    marginTop: 20,
  },
  doChangeSpeedContainer: {
    flexDirection: "row",
    backgroundColor: "#D83E3E",
    borderRadius: 15,
    height: 70,
    width: "75%",
    marginLeft: "10%",
    marginTop: 20,
  },

  changeSpeedText: {
    marginTop: 20,
    marginLeft: 20,
    color: "#fff",
    fontSize: 20,
    fontWeight: "bold",
  },

  digitalDisplayContainer: {
    alignItems: "flex-end",
    flexDirection: "row",
  },

  digitalDisplayContainerDown: {
    bottom: 25,
    alignItems: "flex-end",
    flexDirection: "row",
  },

  digitalDisplay: {
    height: 45,
    width: "50%",
    top: 10,
    left: 15,
    borderRadius: 15,
    backgroundColor: "#fff",
    alignItems: "center",
  },

  displayNumber: {
    fontFamily: "digital-7",
    fontSize: 28,
    top: 10,
  },

  container: {
    flex: 1,
  },

  contentContainer: {
    flex: 1,
    opacity: 1,
    borderTopLeftRadius: 50,
    borderTopRightRadius: 50,
    backgroundColor: "#c8f6ff",
    alignItems: "center",
  },

  information: {
    marginTop: 35,
    color: "#fff",
    fontSize: 23,
    fontWeight: "bold",
  },

  informationContainer: {
    top: 15,
    paddingBottom: 60,
    paddingLeft: 80,
    paddingRight: 80,
    alignItems: "center",
    borderRadius: 25,
    borderWidth: 2,
    borderColor: "#3ab0c2",
  },

  informationbtn: {
    backgroundColor: "white",
    flex: 8,
    alignItems: "center",
  },

  nation_text: {
    fontFamily: "Rubik_500Medium",
    marginTop: 29,
    color: "#000",
    fontSize: 24,
    fontWeight: "bold",
  },

  nation: {
    marginTop: 30,
    marginRight: 10,
    width: 32,
    height: 32,
  },

  boat: {
    marginTop: 15,
    width: 126,
    height: 126,
  },

  ship: {
    height: 50,
    elevation: 5,
    width: 120,
  },

  shipContainer: {
    backgroundColor: "#c4d8ff",
    borderRadius: 10,
    height: 30,
    width: 160,
    marginTop: 20,
    alignItems: "center",
  },

  shipType: {
    fontFamily: "Rubik_600SemiBold",
    top: 4,
    color: "#fff",
    fontSize: 17,
    //fontWeight: 'bold'
  },

  informationTextPara: {
    marginTop: 15,
    color: "gray",
    fontSize: 16,
    fontFamily: "Rubik_600SemiBold",
    fontWeight: "bold",
  },

  informationText: {
    marginTop: 15,
    color: "#000",
    fontSize: 16,
    fontFamily: "Rubik_500Medium",
    fontWeight: "bold",
  },

  tempChartSymbol: {
    backgroundColor: "white",
    height: 50,
    width: "15%",
    borderBottomRightRadius: 15,
    borderTopRightRadius: 15,
    alignItems: "center",
    marginTop: "16%",
  },

  tempChartTextCo2: {
    color: "#FB5353",
    fontSize: 20,
    marginTop: 12,
    fontFamily: "Rubik_500Medium",
  },

  tempChartText: {
    color: "gray",
    fontSize: 20,
    marginTop: 12,
    fontFamily: "Rubik_500Medium",
  },

  tempChartContainer: {
    flexDirection: "row",
    alignItems: "flex-start",
    justifyContent: "space-between",
    height: 144,
    marginTop: 20,
  },

  tempChart: {
    height: 140,
    width: "85%",
    borderRadius: 15,
    resizeMode: "cover",
    marginBottom: 5,
    marginLeft: 50,
  },

  tempChartSymbolSpeed: {
    backgroundColor: "white",
    height: 70,
    width: "15%",
    borderBottomRightRadius: 15,
    borderTopRightRadius: 15,
    alignItems: "flex-start",
    marginTop: "20%",
  },

  tempChartKTS: {
    color: "gray",
    fontSize: 13,
    fontFamily: "Rubik_500Medium",
    marginLeft: 5,
  },

  tempChartTextSpeed: {
    color: "gray",
    fontSize: 16,
    fontFamily: "Rubik_500Medium",
    marginLeft: 5,
  },

  ArrowText: {
    color: "white",
    fontSize: 10,
    fontFamily: "Rubik_500Medium",
  },

  ArrowTextMonth: {
    color: "white",
    fontSize: 12,
    fontFamily: "Rubik_600SemiBold",
  },

  ArrowTextContainer: {
    marginBottom: 10,
    marginLeft: "23%",
    width: "80%",
    alignItems: "baseline",
    justifyContent: "space-evenly",
    flexDirection: "row",
  },

  Arrow: {
    marginLeft: 145,
    height: 50,
    width: "30%",
    resizeMode: "contain",
  },

  courseText: {
    top: "47%",
    left: "10%",
    width: 90,
    color: "#ffffff",
    fontSize: 20,
    fontFamily: "Rubik_500Medium",
    fontWeight: "bold",
    textShadowColor: "rgba(0, 0, 0, 0.75)",
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 6,
  },

  currentIconSpeedText: {
    top: "42%",
    left: "10%",
    width: 90,
    color: "#ffffff",
    fontSize: 20,
    fontWeight: "bold",
    fontFamily: "Rubik_500Medium",
    textShadowColor: "rgba(0, 0, 0, 0.75)",
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 6,
  },

  currentIconStatusText: {
    top: "200%",
    left: "5%",
    width: 90,
    color: "#ffffff",
    fontSize: 20,
    fontWeight: "bold",
    fontFamily: "Rubik_500Medium",
    textShadowColor: "rgba(0, 0, 0, 0.75)",
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 6,
  },

  speedIconContainer: {
    top: "42%",
    left: "7%",
  },

  logoutContainer: {
    borderRadius: 12,
    left: 150,
    bottom: 30,
    backgroundColor: "#fff",
    width: 70,
    height: 30,
    justifyContent: "space-evenly",
    overflow: "hidden",
  },

  logout: {
    justifyContent: "space-evenly",
    alignItems: "center",
    flexDirection: "row",
  },

  logoutText: {
    fontFamily: "Rubik_600SemiBold",
    fontSize: 15,
    color: "#28C0D9",
  },

  logoutImg: {
    tintColor: "#28C0D9",
    resizeMode: "contain",
    width: 20,
  },

  relatedContainer: {
    zIndex: 1,
    width: 80,
    position: "absolute",
    left: 0,
    height: 200,
    top: "15%",
    backgroundColor: "rgba(40, 192, 217, 0.85)",
    borderRadius: 25,
    alignItems: "center",
  },

  relatedImg: {
    tintColor: "#28C0D9",
    resizeMode: "contain",
    width: 40,
    height: 40,
  },

  relatedBtn: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    height: 80,
    width: "100%",
    paddingTop: 10,
    borderColor: "#e8e8e8",
    elevation: 5,
    borderWidth: 1,
    borderBottomRightRadius: 25,
    borderTopRightRadius: 25,
  },
  relatedText: {
    color: "#28C0D9",
    fontSize: 14,
    top: 4,
    fontFamily: "Rubik_600SemiBold",
  },
  relatedPageText: {
    color: "#fff",
    fontSize: 14,
    paddingBottom: 5,
    fontFamily: "Rubik_600SemiBold",
    borderBottomWidth: 1,
    borderColor: "#fff",
  },
  relatedPageTextContainer: {
    flex: 2,
    flexDirection: "column",
    justifyContent: "space-evenly",
  },
  closeButton: {
    resizeMode: "contain",
    width: 10,
    height: 10,
    top: 27,
    right: 10,
  },
});
