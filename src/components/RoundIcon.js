import {Text, View, Image, StyleSheet} from 'react-native';
import {
  useFonts,
  Rubik_600SemiBold,
  Rubik_500Medium,
  Orbitron_600SemiBold,
} from "@expo-google-fonts/dev";

function RoundIcon(props) {
  
  let [fontsLoaded] = useFonts({
    Rubik_500Medium,
    Rubik_600SemiBold,
    Orbitron_600SemiBold,
    "digital-7": require("../../assets/fonts/digital-7.ttf"),
  });
  let D ="D"
  let upImage = null
  let downImage = null
  let rightImage = null
  let leftImage = null

  if(props.img != null){
    if(props.num == 0){
      rightImage=props.img[2]
    }
    else if(props.num > 0 && props.num < 90){
      upImage=props.img[0]
      rightImage=props.img[2]
    }
    else if(props.num == 90){
      upImage=props.img[0]
    }
    else if(props.num > 90 && props.num < 180){
      upImage=props.img[0]
      leftImage=props.img[1]
    }
    else if(props.num == 180){
      leftImage=props.img[1]
    }
    else if(props.num > 180 && props.num < 270){
      leftImage=props.img[1]
      downImage=props.img[3]
    }
    else if(props.num == 270){
      downImage=props.img[3]
    }
    else if(props.num > 270 && props.num < 360){
      downImage=props.img[3]
      rightImage=props.img[2]
    }
  }
  else{
    D=null;
  }
  return (
    <View style={styles.courseContainer}>
      <Image source={upImage} style={[styles.Arrow,styles.upArrow]} />
      <View style={styles.middleLine}>
        <Image source={leftImage} style={[styles.Arrow, styles.leftArrow]} />
        <View style={styles.course}>
          <Text style={styles.courseNum}>{props.num}</Text>
          <Text style={styles.courseNum2}>{D}</Text>
        </View>
        <Image source={rightImage} style={[styles.Arrow, styles.rightArrow]} />
      </View>
      <Image source={downImage} style={[styles.Arrow, styles.downArrow]} />
    </View>
  );
}

export default RoundIcon;

const styles = StyleSheet.create({
  courseContainer: {
    width: "5%",
    height: "5%",
    top: "20%",
    left: "3%",
  },
  middleLine:{
    flexDirection: "row",
  },
  course:{
    width: 80,
    height: 80,
    borderRadius: 40,
    borderColor: "#28c0d9",
    borderWidth: 6,
    backgroundColor: "#fff",
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  courseNum:{
    color: "#354379",
    fontSize: 28,
    fontFamily: "Rubik_600SemiBold",
  },
  courseNum2:{
    top: "5%",
    color: "#354379",
    fontSize: 18,
    fontFamily: "Rubik_600SemiBold",
  },
  Arrow:{
    width: 25,
    height: 25,
  },
  downArrow:{
    top: "10%",
    left: 55,
  },
  upArrow:{
    bottom: "10%",
    left: 55,
  },
  leftArrow:{
    top: 25,
    right: "5%",
  },
  rightArrow:{
    top: 25,
    left: "5%",
  },
})