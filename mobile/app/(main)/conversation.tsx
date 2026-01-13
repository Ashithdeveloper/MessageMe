import { View, Text } from 'react-native'
import React from 'react'
import { useLocalSearchParams } from 'expo-router'

const Conversation = () => {
  
  const data = useLocalSearchParams();

  console.log(data);
  
  return (
    <View>
      <Text>Conversation</Text>
    </View>
  )
}

export default Conversation