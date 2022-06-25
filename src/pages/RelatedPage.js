import {
  View,
  Text,
  StyleSheet,
  ImageBackground,
  TouchableOpacity,
  Linking,
} from "react-native";

function RelatedPage() {
  return (
    <View style={styles.relatePage}>
      <View style={styles.imageView}>
        <ImageBackground
          style={styles.image}
          imageStyle={{
            borderRadius: 14,
            backgroundColor: "#000",
          }}
          source={require("../../res/images/news.jpg")}
        >
          <TouchableOpacity
            onPress={() =>
              Linking.openURL("https://www.twport.com.tw/chinese/")
            }
          >
            <Text style={styles.textInImageUP}>最新動態</Text>
            <Text style={styles.textInImageDOWN}>進出港船舶、到港時間</Text>
          </TouchableOpacity>
        </ImageBackground>
      </View>
      <View style={styles.imageView}>
        <ImageBackground
          style={styles.image}
          imageStyle={{
            borderRadius: 14,
            backgroundColor: "#000",
            opacity: 0.95,
          }}
          source={require("../../res/images/info.jpg")}
        >
          <TouchableOpacity
            onPress={() =>
              Linking.openURL("https://isohe.ihmt.gov.tw/Frontend/index.aspx")
            }
          >
            <Text style={styles.textInImageUP}>海向資訊</Text>
            <Text style={styles.textInImageDOWN}>查詢風向、風速、潮高</Text>
          </TouchableOpacity>
        </ImageBackground>
      </View>
      <View style={styles.imageView}>
        <ImageBackground
          style={styles.image}
          imageStyle={{
            borderRadius: 14,
            backgroundColor: "#000",
            opacity: 0.95,
          }}
          source={require("../../res/images/safe.jpg")}
        >
          <TouchableOpacity
            onPress={() =>
              Linking.openURL("https://www.motcmpb.gov.tw/")
            }
          >
            <Text style={styles.textInImageUP}>港務安全</Text>
            <Text style={styles.textInImageDOWN}>政策條例、糾紛查詢</Text>
          </TouchableOpacity>
        </ImageBackground>
      </View>
    </View>
  );
}

export default RelatedPage;

const styles = StyleSheet.create({
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
    borderRadius: 14,
    elevation: 15,
  },

  textInImageUP: {
    left: 5,
    top: "85%",
    fontSize: 32,
    color: "#ffffff",
    fontWeight: "bold",
  },

  textInImageDOWN: {
    left: 10,
    top: "85%",
    fontSize: 12,
    paddingBottom: 15,
    color: "#ffffff",
    fontWeight: "bold",
  },
});
