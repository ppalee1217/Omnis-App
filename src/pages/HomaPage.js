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
import DailyRecord from "../components/DailyRecord";
import Chart from "../components/Chart";
import RelatedPage from "./RelatedPage";
import RoundIcon from "../components/RoundIcon";
import SpeedIcon from "../components/SpeedIcon";
import BackgroundTimer from "react-native-background-timer";
import LinearGradient from "react-native-linear-gradient";
import {
  useFonts,
  Rubik_600SemiBold,
  Rubik_500Medium,
  Orbitron_600SemiBold,
} from "@expo-google-fonts/dev";

export default function HomePage({ navigation }) {
  let fontsLoaded = useFonts({
    Rubik_500Medium,
    Rubik_600SemiBold,
    Orbitron_600SemiBold,
    "digital-7": require("../../assets/fonts/digital-7.ttf"),
  });
  const [selectedTab, setSelected] = useState("trending");
  const [pass, Changepass] = useState("");
  const [TabBarHeight, setBarHeight] = useState(60);
  const [isMenuOpen, setMenuOpen] = useState(false);
  const bottomSheetRef = useRef(null);
  const [barBackgroundColor, setBarBackgroundColor] = useState(
    "rgba(40, 192, 217, 0.4)"
  );

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

  const OmnisEverLogicDate = require("../../res/data/calculated/Omnis_EVERLOGIC.json");
  const EverLogicData = require("../../res/data/EVER_LOGIC.json");
  let newPosition = {};
  let newSpeedandDir = {};
  let calNum = 1;
  let passHour = 0;
  let counter = 0;
  const historyCordinates = [];
  const futureCordinates = [];

  for (let i = 1; i < EverLogicData.length; i++) {
    const position = {
      latitude: EverLogicData[i].Latitude,
      longitude: EverLogicData[i].Longitude,
    };
    futureCordinates.push(position);
    // if (i <= EverLogicData.length / 4) {
    //   historyCordinates.push(position);
    // }
    // if(i==EverLogicData.length/4){
    //   newPosition = position;
    //   newSpeedandDir ={
    //     speed:EverLogicData[i].Speed,
    //     course:EverLogicData[i].Course,
    //   }
    // }
  }

  const timeoutId = BackgroundTimer.setTimeout(() => {
    // this will be executed once after 10 seconds
    // even when app is the the background
    counter++;
    console.log(counter);
  }, 1000);
  // useEffect(() => {
  //   setTimeout(() => {
  //     counter++;
  // if (calNum == 1 && counter == 1) {
  //   const position = {
  //     latitude: OmnisEverLogicDate[0].Latitude,
  //     longitude: OmnisEverLogicDate[0].Longitude,
  //   };
  //   futureCordinates.unshift(position);
  //   historyCordinates.push(position);
  //   newPosition = position;
  //   newSpeedandDir.speed = OmnisEverLogicDate[0].speed;
  //   CO2_Data.push({
  //     value: OmnisEverLogicDate[0].CO2,
  //     date: new Date().toLocaleString(),
  //   });
  //   RPM_Data.push({
  //     value: OmnisEverLogicDate[0].RPM,
  //     date: new Date().toLocaleString(),
  //   });
  //   Current_Speed_Data.push({
  //     value: OmnisEverLogicDate[0].Current_Speed,
  //     date: new Date().toLocaleString(),
  //   });
  //   Wind_Speed_Data.push({
  //     value: OmnisEverLogicDate[0].Wind_Speed,
  //     date: new Date().toLocaleString(),
  //   });
  // } else if (
  //   OmnisEverLogicDate[calNum + 1].time - OmnisEverLogicDate[calNum].time <=
  //   counter
  // ) {
  //   calNum++;
  //   const position = {
  //     latitude: OmnisEverLogicDate[calNum].Latitude,
  //     longitude: OmnisEverLogicDate[calNum].Longitude,
  //   };
  //   if (counter / 3600 >= passHour) {
  //     passHour++;
  //     futureCordinates.pop();
  //   }
  //   futureCordinates.unshift(position);
  //   historyCordinates.push(position);
  //   newPosition = position;
  //   newSpeedandDir.speed = OmnisEverLogicDate[calNum].speed;
  //   CO2_Data.push({
  //     value: OmnisEverLogicDate[calNum].CO2,
  //     date: new Date().toLocaleString(),
  //   });
  //   RPM_Data.push({
  //     value: OmnisEverLogicDate[calNum].RPM,
  //     date: new Date().toLocaleString(),
  //   });
  //   Current_Speed_Data.push({
  //     value: OmnisEverLogicDate[calNum].Current_Speed,
  //     date: new Date().toLocaleString(),
  //   });
  //   Wind_Speed_Data.push({
  //     value: OmnisEverLogicDate[calNum].Wind_Speed,
  //     date: new Date().toLocaleString(),
  //   });
  // }
  //   }, 1000);
  // });

  const daily = [
    {
      date: "06/10",
      percent: 0.033,
      co2: "2.45kg",
    },
    {
      date: "06/09",
      percent: -0.023,
      co2: "2.45kg",
    },
    {
      date: "06/08",
      percent: -0.006,
      co2: "2.45kg",
    },
    {
      date: "06/07",
      percent: 0.033,
      co2: "2.45kg",
    },
    {
      date: "06/06",
      percent: 0.37,
      co2: "2.45kg",
    },
    {
      date: "06/05",
      percent: 0.01,
      co2: "2.45kg",
    },
    {
      date: "06/04",
      percent: 0.038,
      co2: "2.45kg",
    },
    {
      date: "06/03",
      percent: 0.03,
      co2: "2.45kg",
    },
  ];

  const CO2_Data = [
    // { value: 120, date: "9 Apr 2022" },
    // {
    //   value: 240,
    //   date: "10 Apr 2022",
    //   label: "10 Apr",
    //   labelTextStyle: { color: "#99d6e0", fontWeight: "bold", width: 50 },
    // },
  ];

  const RPM_Data = [];

  const Current_Speed_Data = [];

  const Wind_Speed_Data = [];

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

  handleItemPress = (item, index) => {
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

  MenuIcon = (menuState) => {
    return isMenuOpen ? (
      <FontAwesomeIcon icon={faTimes} size={25} color={"#63B8FF"} />
    ) : (
      <FontAwesomeIcon icon={faBars} size={25} color={"#63B8FF"} />
    );
  };

  ItemIcon = (item, index, menuState) => {
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
                    latitude: newPosition.latitude,
                    longitude: newPosition.longitude,
                    latitudeDelta: 0.0922,
                    longitudeDelta: 0.0421,
                  }}
                >
                  {/* 歷史資料 */}
                  <Polyline
                    coordinates={historyCordinates}
                    strokeColor="#4A5DA6"
                    strokeWidth={4}
                  />
                  <Marker
                    coordinate={{
                      latitude: newPosition.latitude,
                      longitude: newPosition.longitude,
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
                    strokeWidth={4}
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
                    <RoundIcon
                      num={newSpeedandDir.course}
                      text={"COURSE"}
                      img={arrowImage}
                    />
                    <Text style={styles.courseText}>COURSE</Text>
                  </View>
                  <View style={[styles.container, { bottom: "5%" }]}>
                    <RoundIcon
                      num={newSpeedandDir.speed}
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
                            <Text style={styles.displayNumber}>
                              {newSpeedandDir.speed}
                            </Text>
                          </View>
                          <Text style={styles.currentSpeedText}>Knots</Text>
                        </View>
                      </View>
                      <View style={styles.changeSpeedContainer}>
                        <Text style={styles.changeSpeedText}>航速維持</Text>
                        <View style={styles.digitalDisplayContainerDown}>
                          <View style={styles.digitalDisplay}>
                            <Text style={styles.displayNumber}>42</Text>
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
                    <Chart
                      data={CO2_Data}
                      //predict={ptDataPredict}
                      color={"red"}
                      max={250}
                    />
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
                    <Chart
                      data={RPM_Data}
                      //predict={ptDataPredict}
                      color={"#4A5DA6"}
                      max={100}
                    />
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
                      color={"#4A5DA6"}
                      max={500}
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
                    <Chart data={Wind_Speed_Data} color={"#4A5DA6"} max={350} />
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
              <View style={{ marginTop: 50 }}></View>
              <ScrollView>
                <DailyRecord num={0} data={daily} positive={true} />
                <DailyRecord num={1} data={daily} positive={false} />
                <DailyRecord num={2} data={daily} positive={false} />
                <DailyRecord num={3} data={daily} positive={true} />
                <DailyRecord num={4} data={daily} positive={true} />
                <DailyRecord num={5} data={daily} positive={true} />
                <DailyRecord num={6} data={daily} positive={true} />
              </ScrollView>
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
                      Position Received : 2021-11-11 23:30 UTC
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
