import { View, StyleSheet } from "react-native";
import React from "react";
import { verticalScale } from "@/utils/styling";
import { Image } from "expo-image";
import { getAvatarPath } from "@/services/imageUploaded";
import { AvatarProps } from "@/types";

const Avatar = ({ uri, size = 40, style, isGroup = false }: AvatarProps) => {
  return (
    <View
      style={[
        styles.avatar,
        {
          height: verticalScale(size),
          width: verticalScale(size),
          borderRadius: verticalScale(size) / 2,
        },
        style, // ✅ FIXED
      ]}
    >
      <Image
        style={styles.image}
        source={getAvatarPath(uri, isGroup)}
        contentFit="cover"
        transition={100}
      />
    </View>
  );
};

export default Avatar;

const styles = StyleSheet.create({
  avatar: {
    overflow: "hidden",
    backgroundColor: "#e5e5e5",
  },
  image: {
    flex: 1,
  },
});
