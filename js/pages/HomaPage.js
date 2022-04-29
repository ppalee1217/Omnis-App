import React, { Component, useState , useRef, useEffect} from 'react';
import {StyleSheet, Text, View, ImageBackground, Image, Button } from 'react-native';
import TabNavigator from 'react-native-tab-navigator'
import { TouchableWithoutFeedback } from 'react-native-web';
import { backgroundColor, color, tintColor } from 'react-native/Libraries/Components/View/ReactNativeStyleAttributes';
import { reportLogBoxError } from 'react-native/Libraries/LogBox/Data/LogBoxData';
import MapView from 'react-native-maps';
import BottomSheet , { BottomSheetView } from '@gorhom/bottom-sheet';
import { FloatingMenu } from 'react-native-floating-action-menu';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faBars, faTimes, faUserPlus } from '@fortawesome/free-solid-svg-icons';
import {AppLoading} from "expo";
import {
    useFonts,
    Rubik_600SemiBold,
    Rubik_500Medium,
    Orbitron_600SemiBold
} from "@expo-google-fonts/dev";


export default function HomePage() {
    let [fontsLoaded] = useFonts({
        Rubik_500Medium,Rubik_600SemiBold,Orbitron_600SemiBold,
        'digital-7':require("../../assets/fonts/digital-7.ttf")
    });
    const [selectedTab, setSelected] = useState('favorite');
    const [pass, Changepass] = useState('');
    const [TabBarHeight, setBarHeight] = useState(60);
    const [isMenuOpen, setMenuOpen] = useState(false);
    const bottomSheetRef = useRef(null);
    const items = [
        { 
          label: '碳排計算', 
          image: require("../../res/images/co2.png")
        },
        { 
          label: '相關網頁',
          image: require("../../res/images/web.png")
        },
        { 
            label: '個人設定',
            image: require("../../res/images/profile.png")
        },
      ];

    useEffect(() => {
        if(pass=='碳排計算'){
            Changepass('');
            changeTabToTrending();
        }
        else if(pass=='相關網頁'){
            Changepass('');
            changeTabToFavorite();
        }
        else if(pass=='個人設定'){
            Changepass('');
            changeTabToMy();
        }
    },[isMenuOpen]);

    handleItemPress = (item, index) =>{
        //const { itemsDown, dimmerActive } = menuState;
        //console.log(menuState);
        //const isItemPressed = itemsDown[index];
        //const color = isItemPressed ? '#fff' : '#63B8FF';
        //console.log('pressed item: ', item ,' and index: ' ,index,' and menuState: ' ,menuState);
        if(item.label=='碳排計算'){
            Changepass('碳排計算');
            ChangeMenuOpen();
        }
        else if(item.label=='相關網頁'){
            Changepass('相關網頁');
            ChangeMenuOpen();
        }
        else if(item.label=='個人設定'){
            Changepass('個人設定');
            ChangeMenuOpen();
        }
    };

    MenuIcon = (menuState) => {
        console.log('--',menuState);
        return isMenuOpen
          ? <FontAwesomeIcon
            icon={faTimes}
            size={25}
            color={'#63B8FF'}
        />
          : <FontAwesomeIcon
            icon={faBars}
            size={25}
            color={'#63B8FF'}
        />
    };

    ItemIcon = (item, index, menuState) => {
        // Icons can be rendered however you like.
        // Here are some examples, using data from the item object:
        const { itemsDown, dimmerActive } = menuState;
        console.log('++',menuState);
        if (item.image) {
            return (
              <Image
                source={item.image}
                style={{ tintColor: '#63B8FF'}}
                flex={1}
                width={null}
                height={null}
                resizeMode="contain"
              />
            );
        }
    
        return null;
    };

    function ChangeMenuOpen(){
        setMenuOpen(!isMenuOpen);
    }

    function changeTabToPopular(){
        setBarHeight(0)
        setSelected('popular')
    }
    
    function changeTabToTrending(){
        setBarHeight(60)
        setSelected('trending')
    }
        
    function changeTabToFavorite(){
        setBarHeight(60)
        setSelected('favorite')
    }

    function changeTabToMy(){
        setBarHeight(60)
        setSelected('my')
    }

    return (
        <View style={styles.container}>
            <TabNavigator
            tabBarStyle={{ height: TabBarHeight, overflow: 'hidden', borderTopLeftRadius: 20, borderTopRightRadius: 20}}
            sceneStyle= {{paddingBottom: TabBarHeight}}>
                <TabNavigator.Item
                    selected={selectedTab === 'popular'}
                    title="建議航速"
                    selectedTitleStyle={{color: '#63B8FF'}}
                    renderIcon={() =>
                        <Image style={[styles.icon,{tintColor:'#808080'}]} source={require('../../res/images/boat.png')}/>}
                    renderSelectedIcon={() =>
                        <Image style={[styles.icon,{tintColor:'#63B8FF'}]} source={require('../../res/images/boat.png')}/>}
                    onPress={changeTabToPopular}>
                        <>
                            <View style={styles.container}>
                                <MapView
                                    style={styles.map}
                                    initialRegion={{
                                    latitude: 22.9985,
                                    longitude: 120.2172,
                                    latitudeDelta: 0.0922,
                                    longitudeDelta: 0.0421,
                                    }}/>
                                    <View style={styles.container}>
                                        <FloatingMenu
                                        position={'top-left'}
                                        primaryColor={'#63B8FF'}
                                        dimmerStyle={
                                            {
                                                opacity:0.8
                                            }
                                        }
                                        innerWidth={50}
                                        isOpen={isMenuOpen}
                                        items={items}
                                        renderItemIcon={ItemIcon}
                                        renderMenuIcon={MenuIcon}
                                        onMenuToggle={ChangeMenuOpen}
                                        onItemPress={handleItemPress}
                                        />
                                    </View>
                                <BottomSheet
                                    backgroundStyle={styles.contentContainer}
                                    handleIndicatorStyle={
                                        {
                                            backgroundColor: '#e9faff',
                                            marginTop:15,
                                            height: 6,
                                            width:'65%'
                                        }
                                    }
                                    ref={bottomSheetRef}
                                    index={1}
                                    snapPoints={['7%', '30%']}>
                                    <BottomSheetView>
                                        <View style={styles.currentSpeedContainer}>
                                            <Text style={styles.currentSpeedText}>
                                                當前航速
                                            </Text>
                                            <View style={styles.digitalDisplayContainer}>
                                                <View style={styles.digitalDisplay}>
                                                    <Text style={styles.displayNumber}>0</Text>
                                                </View>
                                                <Text style={styles.currentSpeedText}>
                                                    Knots
                                                </Text>
                                            </View>
                                        </View>
                                        <View style={styles.changeSpeedContainer}>
                                            <Text style={styles.changeSpeedText}>
                                                航速維持
                                            </Text>
                                            <View style={styles.digitalDisplayContainerDown}>
                                                <View style={styles.digitalDisplay}>
                                                    <Text style={styles.displayNumber}>0</Text>
                                                </View>
                                                <Text style={styles.changeSpeedText}>
                                                    Knots
                                                </Text>
                                            </View>
                                        </View>
                                    </BottomSheetView>
                                </BottomSheet>
                            </View>                            
                        </>
                </TabNavigator.Item>
                <TabNavigator.Item
                    selected={selectedTab === 'trending'}
                    title="碳排計算"
                    selectedTitleStyle={{color: '#63B8FF'}}
                    renderIcon={() =>
                        <Image style={[styles.icon,{tintColor:'#808080'}]} source={require('../../res/images/co2.png')}/>}
                    renderSelectedIcon={() =>
                        <Image style={[styles.icon,{tintColor:'#63B8FF'}]} source={require('../../res/images/co2.png')}/>}
                    onPress={changeTabToTrending}>
                    <View
                        style={{backgroundColor:'#fff',flex:1}}>
                    </View>
                </TabNavigator.Item>
                <TabNavigator.Item
                    selected={selectedTab === 'favorite'}
                    title="相關網頁"
                    selectedTitleStyle={{color: '#63B8FF'}}
                    renderIcon={
                        () =><Image
                                style={[styles.icon,{tintColor:'#808080'}]}
                                source={require('../../res/images/web.png')}
                                />}
                    renderSelectedIcon={
                        () =><Image
                                style={[styles.icon,{tintColor:'#63B8FF'}]}
                                source={require('../../res/images/web.png')}
                                />}
                    onPress={changeTabToFavorite}>
                    <View style={styles.relatePage}>
                        <View style={styles.imageView}>
                            <ImageBackground
                                style={styles.image}
                                imageStyle={{
                                    borderRadius: 14,
                                    backgroundColor: "#000"
                                }}
                                source={require("../../res/images/news.jpg")}>
                                <Text style={styles.textInImageUP}>
                                    最新動態
                                </Text>
                                <Text style={styles.textInImageDOWN}>
                                    進出港船舶、到港時間
                                </Text>
                            </ImageBackground>
                        </View>
                        <View style={styles.imageView}>
                            <ImageBackground
                                style={styles.image}
                                imageStyle={{
                                    borderRadius: 14,
                                    backgroundColor: "#000",
                                    opacity:0.95
                                }}
                                source={require("../../res/images/info.jpg")}>
                                <Text style={styles.textInImageUP}>
                                    海向資訊
                                </Text>
                                <Text style={styles.textInImageDOWN}>
                                    查詢風向、風速、潮高
                                </Text>
                            </ImageBackground>
                        </View>
                        <View style={styles.imageView}>
                            <ImageBackground
                                style={styles.image}
                                imageStyle={{
                                    borderRadius: 14,
                                    backgroundColor: "#000",
                                    opacity:0.95
                                }}
                                source={require("../../res/images/safe.jpg")}>
                                <Text style={styles.textInImageUP}>
                                    港務安全
                                </Text>
                                <Text style={styles.textInImageDOWN}>
                                    政策條例、糾紛查詢
                                </Text>
                            </ImageBackground>
                        </View>
                    </View>
                </TabNavigator.Item>
                <TabNavigator.Item
                    selected={selectedTab === 'my'}
                    title="個人設定"
                    selectedTitleStyle={{color: '#63B8FF'}}
                    renderIcon={() =>
                        <Image style={[styles.icon,{tintColor:'#808080'}]} source={require('../../res/images/profile.png')}/>}
                    renderSelectedIcon={() =>
                        <Image style={[styles.icon,{tintColor:'#63B8FF'}]} source={require('../../res/images/profile.png')}/>}
                    onPress={changeTabToMy}>
                    <View style={[styles.container, {flexDirection: "column"}]}>
                        <View style={{backgroundColor:'#28c0d9',flex:1, alignItems:'center'}}>
                            <Text style={styles.information}>船舶資訊</Text>
                        </View>
                        <View style={styles.informationbtn}>
                            <View style={{flexDirection:'row'}}>
                                <Image style={styles.nation} source={require("../../res/images/USA.png")}/>
                                <Text style={styles.nation_text}>SWANSE</Text>
                            </View>
                            <Image style={styles.boat} source={require("../../res/images/boats.png")}/>
                            <View style={styles.shipContainer}>
                                <Text style={styles.shipType}>
                                    Container Ship
                                </Text>
                            </View>
                            <View style={{top:5,flexDirection:'column',alignItems:'center'}}>
                                <Text style={styles.informationText}>
                                    IMO : 9629469
                                </Text>
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
                </TabNavigator.Item>
            </TabNavigator>
        </View>
    );
}
 
const styles = StyleSheet.create({
    map: {
        ...StyleSheet.absoluteFillObject,
      },

    container: {
        flex: 1
    },
    icon: {
        width:26,
        height:26
    },

    relatePage:{
        justifyContent: 'center',
        alignItems: 'center',
        paddingTop:30,
        //backgroundColor: '#c4d7ff'
    },

    imageView: {
        paddingTop: 30
    },

    image: {
        flexDirection: 'column',
        justifyContent: 'center',
        height: 200,
        width: 317,
    },

    textInImageUP: {
        left:5,
        top: '35%',
        fontSize:32,
        color: '#ffffff',
        fontWeight: 'bold'
    },

    textInImageDOWN: {
        left:10,
        top: '35%',
        fontSize:12,
        paddingBottom:15,
        color: '#ffffff',
        fontWeight: 'bold'
    },

    currentSpeedContainer:{
        backgroundColor:'#28c0d9',
        borderRadius: 15,
        height: 70,
        width:'75%',
        marginLeft: '10%',
        marginTop: 25,
        flexDirection:'row',
        alignItems: 'flex-start',
    },

    currentSpeedText:{
        marginTop: 20,
        marginLeft: 20,
        color: '#fff',
        fontSize: 20,
        fontWeight: 'bold'
    },

    changeSpeedContainer:{
        flexDirection: 'row',
        backgroundColor:'#41d83e',
        borderRadius: 15,
        height: 70,
        width:'75%',
        marginLeft: '10%',
        marginTop: 20,
    },

    changeSpeedText:{
        marginTop: 20,
        marginLeft: 20,
        color: '#fff',
        fontSize: 20,
        fontWeight: 'bold'
    },

    digitalDisplayContainer:{
        alignItems: 'flex-end',
        flexDirection: 'row',
    },

    digitalDisplayContainerDown:{
        bottom:25,
        alignItems: 'flex-end',
        flexDirection: 'row',
    },

    digitalDisplay:{
        height: 45,
        width:'50%',
        top: 10,
        left: 15,
        borderRadius: 15,
        backgroundColor: '#fff',
        alignItems: 'center'
    },

    displayNumber:{
        fontFamily:'digital-7',
        fontSize: 28,
        top: 10
    },

    container: {
        flex: 1,
    },

    contentContainer: {
        flex: 1,
        borderTopLeftRadius: 50,
        borderTopRightRadius: 50,
        backgroundColor: '#c8f6ff',
        alignItems: 'center',
    },

    information:{
        marginTop: 35,
        color: '#fff',
        fontSize: 23,
        fontWeight: 'bold'
    },

    informationbtn:{
        backgroundColor:'white',
        flex:8,
        alignItems:'center'
    },

    nation_text:{
        fontFamily: "Rubik_600SemiBold",
        marginTop:72,
        color: '#000',
        fontSize: 24,
        //fontWeight: 'bold'
    },

    nation:{
        marginTop:70,
        marginRight:10,
        width:32,
        height:32,
    },

    boat:{
        marginTop:15,
        width:126,
        height:126
    },

    logout:{

    },

    shipContainer:{
        backgroundColor:'#c4d8ff',
        borderRadius: 10,
        height: 30,
        width:'40%',
        marginTop: 20,
        alignItems: 'center',
    },

    shipType:{
        fontFamily: "Rubik_600SemiBold",
        top:4,
        color: '#fff',
        fontSize: 17,
        //fontWeight: 'bold'
    },

    informationText:{
        marginTop:20,
        color: '#000',
        fontSize: 16,
        fontWeight: 'bold'
    },
});