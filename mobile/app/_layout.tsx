import { Stack } from "expo-router";
import { AuthProvider } from "@/context/authContext";
import { StatusBar } from "expo-status-bar";
import { View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";


export default function RootLayout() {
  return (
    <SafeAreaView style={{ flex: 1 }} edges={["bottom", "left", "right"]}>    
      <AuthProvider>
      <StatusBar style="light" />
      <Stack
        screenOptions={{ headerShown: false }}
      >
        <Stack.Screen name="(main)" />
        <Stack.Screen name="(auth)" />
      </Stack>
    </AuthProvider>
    </SafeAreaView>
  );
}
