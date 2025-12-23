import { Stack } from "expo-router";
import { AuthProvider } from "@/context/authContext";
import { StatusBar } from "expo-status-bar";
import { View } from "react-native";


export default function RootLayout() {
  return (
    <AuthProvider>
      <StatusBar style="light" />
      <Stack
        screenOptions={{ headerShown: false }}
      >
        <Stack.Screen name="(main)" />
        <Stack.Screen name="(auth)" />
      </Stack>
    </AuthProvider>
  );
}
