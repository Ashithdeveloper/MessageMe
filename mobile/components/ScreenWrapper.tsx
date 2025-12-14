import { View, Platform, Dimensions } from "react-native";
import React from "react";
import { ScreenWrapperProps } from "@/types";
import { ImageBackground } from "expo-image";
import { colors } from "@/constants/theme";

const { height } = Dimensions.get("window");

export default function ScreenWrapper({
  style,
  children,
  showPattern = true,
  isModal = false,
  bgOpacity = 1,
}: ScreenWrapperProps) {
  const paddingTop = Platform.OS === "ios" ? height * 0.06 : 40;

  const paddingBottom = isModal ? height * 0.06 : 0;

  return (
    <ImageBackground
      style={{
        flex: 1,
        backgroundColor: isModal ? colors.white : colors.neutral900,
      }}
      imageStyle={{ opacity: showPattern ? bgOpacity : 0 }}
      source={require("../assets/images/bgPattern.png")}
    >
      <View
        style={[
          {
            flex: 1,
            paddingTop,
            paddingBottom,
          },
          style,
        ]}
      >
        {children}
      </View>
    </ImageBackground>
  );
}
