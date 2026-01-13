import React from "react";
import { Stack } from "expo-router";

export default function MainLayout() {
  return (
    <Stack>
      <Stack.Screen name="home" options={{ headerShown: false }} />

      <Stack.Screen
        name="profilemodal"
        options={{
          animation: "fade", // Fade is actually good here for a popup feel
    
        }}
        
      />

      <Stack.Screen
        name="newconversationmodel"
        options={{
          animation: "fade", // Fade is actually good here for a popup feel
          headerShown: false
        }}
        
      />
      <Stack.Screen
        name="conversation"
        options={{
          animation: "fade", // Fade is actually good here for a popup feel
          headerShown: false
        }}
        
      />
    </Stack>
  );
}
