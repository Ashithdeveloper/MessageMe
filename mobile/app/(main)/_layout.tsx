import React from "react";
import { Stack } from "expo-router";

export default function MainLayout() {
  return (
    <Stack>
      <Stack.Screen name="home" options={{ headerShown: false }} />

      <Stack.Screen
        name="profilemodal"
        options={{ 
          animation: "fade",
    
        }}
        
      />

      <Stack.Screen
        name="newconversationmodel"
        options={{
          animation: "fade", 
          headerShown: false
        }}
        
      />
      <Stack.Screen
        name="conversation"
        options={{
          animation: "fade", 
          headerShown: false
        }}
        
      />
    </Stack>
  );
}
