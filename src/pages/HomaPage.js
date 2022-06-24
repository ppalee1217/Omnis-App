import React, {
  Component,
  useState,
  useRef,
  useEffect,
  PureComponent,
} from "react";
import {
  StyleSheet,
  Text,
  View,
  ImageBackground,
  Image,
  Button,
  FlatList,
  ScrollView,
  Pressable,
} from "react-native";
import TabNavigator from "react-native-tab-navigator";
import MapView, {
  Polyline,
  AnimatedRegion,
  Animated,
  Marker,
  MyCustomMarkerView,
} from "react-native-maps";
import BottomSheet, { BottomSheetView } from "@gorhom/bottom-sheet";
import { FloatingMenu } from "react-native-floating-action-menu";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { faBars, faTimes } from "@fortawesome/free-solid-svg-icons";
import DailyList from "../components/DailyList";
import DailyRecord from "../components/DailyRecord";
import Chart from "../components/Chart";
import RelatedPage from "./RelatedPage";
import RoundIcon from "../components/RoundIcon";
import SpeedIcon from "../components/SpeedIcon";
import LinearGradient from "react-native-linear-gradient";
import {
  useFonts,
  Rubik_600SemiBold,
  Rubik_500Medium,
  Orbitron_600SemiBold,
} from "@expo-google-fonts/dev";

export default function HomePage({ navigation }) {
  let [fontsLoaded] = useFonts({
    Rubik_500Medium,
    Rubik_600SemiBold,
    Orbitron_600SemiBold,
    "digital-7": require("../../assets/fonts/digital-7.ttf"),
  });
  const [positionLong, setPositionLong] = useState(0);
  const [positionLati, setPositionLati] = useState(0);
  const [selectedTab, setSelected] = useState("my");
  const [pass, Changepass] = useState("");
  const [TabBarHeight, setBarHeight] = useState(60);
  const [isMenuOpen, setMenuOpen] = useState(false);
  const bottomSheetRef = useRef(null);
  const [barBackgroundColor, setBarBackgroundColor] = useState(
    "#fff"
  );
  const [courseData,setCourseData] = useState(0);
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
  const OmnisEverLogicData = require("../../res/data/calculated/Omnis_EVERLOGIC.json");
  const EverLogicData = require("../../res/data/EVER_LOGIC.json");
  //setting date
  let _date = new Date("June 2 2022 06:15:30");
  let calNum = 0;
  let passHour = 0;
  let counter = 0;
  let co2_tmp = [];
  let rpm_tmp = [];
  let old_cs_tmp = [];
  let cs_tmp = [];
  let old_ws_tmp = [];
  let ws_tmp = [];
  let FCtmp = [];
  let HCtmp = [];
  let dailytmp = [];
  let yesterDayPosition = {};
  let yesterDayco2 = 0;
  let toDayco2 = 0;
  const todayRPM = [];
  let windSpeed = 0;
  let waveHieght = 0;
  let AWT = 0;

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

  for (let i = 1; i < EverLogicData.length; i++) {
    const position = {
      latitude: EverLogicData[i].Latitude,
      longitude: EverLogicData[i].Longitude,
    };
    FCtmp.push(position);
  }
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
    // let _old_ws = [...old_ws_tmp];
    // _old_ws.push({ value: oldData.toFixed(1), date: day.toLocaleTimeString() });
    // setOldWSData(_old_ws);
    // old_ws_tmp = _old_ws;
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
    // let _old_cs = [...old_cs_tmp];
    // _old_cs.push({ value: oldData.toFixed(1), date: day.toLocaleTimeString() });
    // setOldCSData(_old_cs);
    // old_cs_tmp = _old_cs;
  };

  // const changeCourse = (course) => {
  //   setCourseDa(course);
  // };

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
    let remove = FC.shift();
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

  // const data = {
  //   date: (_date.getMonth() + 1 + "/" + _date.getDate()).toString(),
  //   yesterDayPosition: yesterDayPosition,
  //   nowPosition: position,
  //   co2: yesterDayco2,
  //   rpm: todayRPM,

  //   AWH: waveHieght,
  //   wind: windSpeed,
  //   AWT: AWT,
  // };

  // const addDailyRecord = (data) => {
  //   let dailyTmp = [...dailytmp];
  //   dailyTmp.push(data);
  //   setDaily(dailyTmp);
  //   dailytmp = dailyTmp;
  // };

  const _dailytmp = [
    {
      date: "06/02",
      percent: 0.03,
      co2: "22464t",
      yesterDayPosition:{
        latitude: 22.32706,
        longitude: 114.1327,
      },
      nowPosition:{
        latitude: 21.75256,
        longitude: 118.6125,
      },
      rpm:[11.24,11.34],
      wind:15,
      AWH:0.7,
      AWT:27,
    },
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      counter++;
      if (calNum == 0) {
        //console.log(OmnisEverLogicData[0]);
        //console.log(EverLogicData[0]);
        calNum++;
        passHour++;
        const position = {
          latitude: OmnisEverLogicData[0].latitude,
          longitude: OmnisEverLogicData[0].longitude,
        };

        yesterDayPosition = {
          latitude: OmnisEverLogicData[0].latitude,
          longitude: OmnisEverLogicData[0].longitude,
        };
        toDayco2 = OmnisEverLogicData[0].CO2;
        todayRPM.push(OmnisEverLogicData[0].RPM);
        windSpeed = OmnisEverLogicData[0].WindSpeed;
        waveHieght = OmnisEverLogicData[0].WaveHeight;
        AWT = OmnisEverLogicData[0].WindTemp;
        setOldSpeed(OmnisEverLogicData[0].HistorySpeed);
        setCourseData(OmnisEverLogicData[0].HistoryCourse);
        changePosition(position);
        changeHistoryCordinates(position);
        //changeCourse(OmnisEverLogicData[0].course);
        changeSpeed(OmnisEverLogicData[0].speed);
        changeFutureCordinates(position);
        changeCo2Data(true, OmnisEverLogicData[0].CO2, _date);
        changeRPMData(true, OmnisEverLogicData[0].RPM, _date);
        changeCSData(
          true,
          Math.abs(OmnisEverLogicData[0].Current_Speed),
          Math.abs(EverLogicData[0].CurrentSpeed),
          _date
        );
        changeWSData(
          true,
          Math.abs(OmnisEverLogicData[0].Wind_Speed),
          Math.abs(EverLogicData[0].WindSpeed),
          _date
        );
      } else if (OmnisEverLogicData[calNum].time <= counter) {
        calNum++;
        const position = {
          latitude: OmnisEverLogicData[calNum].latitude,
          longitude: OmnisEverLogicData[calNum].longitude,
        };
        if (counter / 3600 >= passHour) {
          let changeDay = false;
          passHour++;
          let nowHour = _date.getHours();
          _date.setHours(nowHour + 1);
          if (_date.getHours() == 1) {
            _date.setDate(_date.getDate() + 1);
            changeDay = true;
            if (_date.getDate() == 1) {
              _date.setMonth(_date.getMonth() + 1);
              if (_date.getMonth() == 1) {
                _date.setFullYear(_date.getFullYear() + 1);
              }
            }
          }
          toDayco2 += OmnisEverLogicData[calNum].CO2;
          todayRPM.push(OmnisEverLogicData[calNum].RPM);

          changeCo2Data(changeDay, OmnisEverLogicData[calNum].CO2, _date);
          changeRPMData(changeDay, OmnisEverLogicData[calNum].RPM, _date);
          changeCSData(
            changeDay,
            Math.abs(OmnisEverLogicData[calNum].Current_Speed),
            Math.abs(EverLogicData[passHour].CurrentSpeed),
            _date
          );
          changeWSData(
            changeDay,
            Math.abs(OmnisEverLogicData[0].Wind_Speed),
            Math.abs(EverLogicData[0].WindSpeed),
            _date
          );

          if (changeDay) {
            windSpeed = OmnisEverLogicData[calNum].WindSpeed;
            waveHieght = OmnisEverLogicData[calNum].WaveHeight;
            AWT = OmnisEverLogicData[calNum].WindTemp;

            const data = {
              date: (_date.getMonth() + 1 + "/" + _date.getDate()).toString(),
              yesterDayPosition: yesterDayPosition,
              nowPosition: position,
              yesterDayco2: yesterDayco2,
              toDayco2: toDayco2,
              rpm: todayRPM,

              AWH: waveHieght,
              wind: windSpeed,
              AWT: AWT,
            };
            addDailyRecord(data);
            yesterDayPosition = position;
            yesterDayco2 = toDayco2;
            toDayco2 = OmnisEverLogicData[calNum].CO2;
            todayRPM.length = 0;
          }
          changeFutureCordinatesHour();
        }
        setOldSpeed(OmnisEverLogicData[calNum].HistorySpeed);
        setCourseData(OmnisEverLogicData[calNum].HistoryCourse);
        changePosition(position);
        changeHistoryCordinates(position);
        changeSpeed(OmnisEverLogicData[calNum].speed);
        changeFutureCordinates(position);
      }
      //console.log(`time: ${counter}`);
      //console.log(`目前使用參數編號: ${calNum}`);
      //console.log(`1.目前位置: ${positionLati}, ${positionLong}`);
    }, 1);
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
                <View style={styles.container}>
                  <FloatingMenu
                    position={"top-left"}
                    primaryColor={"#63B8FF"}
                    dimmerStyle={{
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
                  <View style={[styles.container, { top: "7%" }]}>
                    <RoundIcon num={courseData} text={"COURSE"} img={arrowImage} />
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
                      <SpeedIcon isGood={true} />
                      <Text style={styles.currentIconStatusText}>請維持</Text>
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
                            <Text style={styles.displayNumber}>{oldspeed}</Text>
                          </View>
                          <Text style={styles.currentSpeedText}>Knots</Text>
                        </View>
                      </View>
                      <View style={styles.changeSpeedContainer}>
                        <Text style={styles.changeSpeedText}>航速維持</Text>
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
                    <Chart data={CO2_Data} color={"red"} max={2000} />
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
                    <Chart data={RPM_Data} color={"#4A5DA6"} max={20} />
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
                      data={Current_Speed_Data}
                      data2={old_CS_Data}
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
                      data={Wind_Speed_Data}
                      data2={old_WS_Data}
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
                  <DailyRecord num={0} data={_dailytmp} positive={false} />
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
                      source={require("../../res/images/USA.png")}
                    />
                    <Text style={styles.nation_text}>SWANSE</Text>
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
                    <Text style={styles.informationText}>IMO : 9629469</Text>
                    <Text style={styles.informationText}>
                      Position Received : 2022-06-02 06:30 UTC
                    </Text>
                    <Text style={styles.informationText}>
                      Vessel is Out-of-Range
                    </Text>
                    <Text style={styles.informationText}>
                      Area : SCHINA-East China Sea
                    </Text>
                    <Text style={styles.informationText}>
                      Current Port : QINGDAO
                    </Text>
                    <Text style={styles.informationText}>
                      AIS Source : 4786 BX3ACC
                    </Text>
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

  changeSpeedContainer: {
    flexDirection: "row",
    backgroundColor: "#41d83e",
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
    top: 40,
    paddingBottom: 80,
    paddingLeft: 20,
    paddingRight: 20,
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
    fontFamily: "Rubik_600SemiBold",
    marginTop: 72,
    color: "#000",
    fontSize: 24,
    //fontWeight: 'bold'
  },

  nation: {
    marginTop: 70,
    marginRight: 10,
    width: 32,
    height: 32,
  },

  boat: {
    marginTop: 15,
    width: 126,
    height: 126,
  },

  logout: {},

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

  informationText: {
    marginTop: 20,
    color: "#000",
    fontSize: 16,
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
});
