import {
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  View,
} from "react-native";
import React, { useRef } from "react";
import ScreenWrapper from "@/components/ScreenWrapper";
import Typo from "@/components/Type";
import { colors, radius, spacingX, spacingY } from "@/constants/theme";
import BackButton from "@/components/BackButton";
import Input from "@/components/Input";
import { verticalScale } from "@/utils/styling";
import { EnvelopeSimple, Lock, User } from "phosphor-react-native";
import Button from "@/components/Button";
import { router } from "expo-router";

const Login = () => {
  const emailRef = useRef<string>("");
  const passwordRef = useRef<string>("");

  const handleRegister = () => {
    if ( !emailRef.current || !passwordRef.current) {
      console.log("All fields are required");
      return;
    }
    console.log("Email:", emailRef.current);
    console.log("Password:", passwordRef.current);

    // 🔜 API call here

  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <ScreenWrapper showPattern>
        <View style={styles.container}>
          {/* Header */}
          <View style={styles.header}>
            <BackButton />
            <Typo size={17} fontWeight="800" color={colors.white}>
              Need some help?
            </Typo>
          </View>

          {/* Content */}
          <View style={styles.content}>
            <ScrollView
              contentContainerStyle={styles.form}
              showsVerticalScrollIndicator={false}
            >
              {/* Title */}
              <View style={{ gap: spacingY._10 }}>
                <Typo size={28} fontWeight="600">
                  Welcome Back
                </Typo>
                <Typo color={colors.neutral600}>Sign in to your account</Typo>
              </View>

              {/* Email */}
              <Input
                placeholder="Enter your email"
                keyboardType="email-address"
                autoCapitalize="none"
                onChangeText={(value) => (emailRef.current = value)}
                icon={
                  <EnvelopeSimple
                    size={verticalScale(26)}
                    color={colors.neutral600}
                    weight="regular"
                  />
                }
              />
              {/* Password */}
              <Input
                placeholder="Enter your password"
                secureTextEntry
                onChangeText={(value) => (passwordRef.current = value)}
                icon={
                  <Lock
                    size={verticalScale(26)}
                    color={colors.neutral600}
                    weight="regular"
                  />
                }
              />
              {/* Button */}
              <View style={{ marginTop: spacingY._25 }}>
                <Button loading={false} onPress={handleRegister}>
                  <Typo size={17} fontWeight="600" color={colors.black}>
                    Login  
                  </Typo>
                </Button>
              </View>

              {/* Footer */}
              <View style={styles.footer}>
                <Typo size={15} fontWeight="600" color={colors.neutral600}>
                  Don&apos;t have an account?
                </Typo>
                <Pressable onPress={() => router.push("/(auth)/register")}>
                  <Typo size={15} fontWeight="600" color={colors.primaryDark}>
                    Sign Up
                  </Typo>
                </Pressable>
              </View>
            </ScrollView>
          </View>
        </View>
      </ScreenWrapper>
    </KeyboardAvoidingView>
  );
};

export default Login;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "space-between",
  },
  header: {
    paddingHorizontal: spacingX._20,
    paddingTop: spacingY._15,
    paddingBottom: spacingY._20,
    flexDirection: "row",
    justifyContent: "space-between",
    alignContent: "center",
  },
  content: {
    flex: 1,
    backgroundColor: colors.white,
    borderTopLeftRadius: radius._50,
    borderTopRightRadius: radius._50,
    borderCurve: "continuous",
    paddingHorizontal: spacingX._20,
    paddingTop: spacingY._20,
  },
  form: { gap: spacingY._15, marginTop: spacingY._20 },
  footer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 5,
  },
});
