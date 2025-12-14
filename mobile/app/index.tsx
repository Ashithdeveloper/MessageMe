import { colors } from "@/constants/theme";
import { useRouter } from "expo-router";
import { useEffect } from "react";

import { StatusBar, StyleSheet,  View } from "react-native";
import Animated, {  FadeInDown } from "react-native-reanimated";

export default function SplashScreen() {
  const router = useRouter();
  useEffect(()=>{
    setTimeout(() => {
      router.replace("/(auth)/welcome");
    }, 2000);
  },[])
  return (
    <View
      style={style.constainer}
    >
      <StatusBar barStyle={"light-content"} backgroundColor={colors.neutral900} />
      <Animated.Image source={require("../assets/images/splashImage.png")} 
      entering={FadeInDown.duration(700).springify()} 
      style={style.logo} 
      resizeMode={"contain"}/>
    </View>
  );
}

const style = StyleSheet.create({
  constainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor:  colors.neutral900,
  },
  logo:{
    height: "23%",
    aspectRatio: 1,

  }
})
