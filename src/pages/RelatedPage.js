import { View, Text, StyleSheet, ImageBackground } from 'react-native';

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
          <Text style={styles.textInImageUP}>最新動態</Text>
          <Text style={styles.textInImageDOWN}>進出港船舶、到港時間</Text>
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
          <Text style={styles.textInImageUP}>海向資訊</Text>
          <Text style={styles.textInImageDOWN}>查詢風向、風速、潮高</Text>
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
          <Text style={styles.textInImageUP}>港務安全</Text>
          <Text style={styles.textInImageDOWN}>政策條例、糾紛查詢</Text>
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
});