import { View, Text } from 'react-native'
import React, { useEffect } from 'react'
import ScreenWrapper from '@/components/ScreenWrapper'
import Typo from '@/components/Type'
import { colors } from '@/constants/theme'
import Button from '@/components/Button'
import { useAuth } from '@/context/authContext'
import { testSocket } from '@/socket/socketEven'



const Home = () => {
  const { user , signOut} = useAuth();
  const handleLoginOut = async() => {
    await signOut();
  }
  useEffect(() => {
    testSocket(testSocketCallbackHandler);
    testSocket(null);
    return () => {
      testSocket(testSocketCallbackHandler , true);
    }
  }, [])

  const testSocketCallbackHandler = (data : any) => {
    console.log("testSocketCallbackHandler" , data);
  }

  return (
    <ScreenWrapper>
      <Typo size={30} color={colors.white} >Home</Typo>
      <Button onPress={handleLoginOut}  >
        <Typo size={30} color={colors.white} >Logout</Typo>
      </Button>
    </ScreenWrapper>
  )
}

export default Home