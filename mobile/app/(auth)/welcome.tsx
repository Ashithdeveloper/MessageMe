import { View, StyleSheet } from "react-native";
import React from "react";
import ScreenWrapper from "@/components/ScreenWrapper";

import Button from "@/components/Button";
import { colors, spacingX, spacingY } from "@/constants/theme";
import { verticalScale } from "@/utils/styling";
import Animated, { FadeIn } from "react-native-reanimated";
import Typo from "@/components/Type";
import { useRouter } from "expo-router";

const Welcome = () => {

  const route = useRouter();
  return (
    <ScreenWrapper showPattern>
      <View style={styles.container}>
        {/* App Title */}
        <View style={styles.center}>
          <Typo size={44} fontWeight="900" color={colors.white}>
            Bubbly
          </Typo>
        </View>

        {/* Image */}
        <Animated.Image
          entering={FadeIn.duration(700).springify()}
          source={require("../../assets/images/welcome.png")}
          style={styles.welcomeImage}
          resizeMode="contain"
        />

        {/* Text */}
        <View style={styles.textBlock}>
          <Typo size={30} fontWeight="800" color={colors.white}>
            Stay Connected
          </Typo>
          <Typo size={30} fontWeight="800" color={colors.white}>
            with your friends
          </Typo>
          <Typo size={30} fontWeight="800" color={colors.white}>
            and family
          </Typo>
        </View>

        {/* Button */}
        <Button style={styles.button}  onPress={() => route.push("/(auth)/register")}>
          <Typo size={18} fontWeight={"bold"} color={colors.text}>
            Get Started...
          </Typo>
        </Button>
      </View>
    </ScreenWrapper>
  );
};

export default Welcome;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "space-between",
    paddingHorizontal: spacingX._20,
    paddingVertical: spacingY._20,
  },
  center: {
    alignItems: "center",
    marginTop: spacingY._20,
  },
  textBlock: {
    alignItems: "center",
    gap: verticalScale(6),
  },
  welcomeImage: {
    height: verticalScale(320),
    width: "100%",
    alignSelf: "center",
  },
  button: {
    backgroundColor: colors.white,
    marginBottom: spacingY._20,
  },
});
