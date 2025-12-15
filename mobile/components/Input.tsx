import React, { useState } from "react";
import { StyleSheet, TextInput, View } from "react-native";
import { colors, radius, spacingX } from "@/constants/theme";
import { InputProps } from "@/types";
import { verticalScale } from "@/utils/styling";

const Input = (props: InputProps) => {
  const [isFocused, setIsFocused] = useState(false);

  return (
    <View
      style={[
        styles.container,
        props.containerStyle,
        isFocused && styles.primaryBorder,
      ]}
    >
      {props.icon && props.icon}

      <TextInput
        {...props}
        ref={props.inputRef}
        style={[styles.input, props.inputStyle]}
        placeholderTextColor={colors.neutral400}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
      />
    </View>
  );
};

export default Input;

const styles = StyleSheet.create({
  container: {
    borderWidth: 1,
    borderColor: colors.neutral200,
    borderRadius: radius.full,
    paddingHorizontal: spacingX._15,
    backgroundColor: colors.neutral100,
    flexDirection: "row",
    alignItems: "center",
    gap: spacingX._10,
  },

  primaryBorder: {
    borderColor: colors.primary,
  },

  input: {
    flex: 1,
    color: colors.text,
    fontSize: verticalScale(19),
  },
});
