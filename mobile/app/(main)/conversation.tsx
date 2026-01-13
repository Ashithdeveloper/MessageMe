import {
  View,
  Text,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  FlatList,
} from "react-native";
import React from "react";
import { useLocalSearchParams } from "expo-router";
import { useAuth } from "@/context/authContext";
import { colors, radius, spacingX, spacingY } from "@/constants/theme";
import { scale, verticalScale } from "@/utils/styling";
import ScreenWrapper from "@/components/ScreenWrapper";
import Typo from "@/components/Type";
import { Header } from "@react-navigation/elements";
import BackButton from "@/components/BackButton";
import Avatar from "@/components/Avatar";
import MessageItem from "@/components/MessageItem";

const Conversation = () => {
  const { user: currentUser } = useAuth();

  const {
    id: conversationId,
    name,
    participants: stringifiedParticipants,
    avatar,
    type,
  } = useLocalSearchParams();

  const participants = stringifiedParticipants
    ? JSON.parse(stringifiedParticipants as string)
    : [];

  const isDirect = type === "direct";

  const otherParticipant = isDirect
    ? participants.find((p: any) => p._id !== currentUser?.id)
    : null;

  const conversationAvatar = isDirect ? otherParticipant?.profilepic : avatar;

  const conversationName = isDirect ? otherParticipant?.name : name;
  const dummyMessages = [
   {
     id: "msg_1",
     sender: {
       id: "user_2",
       name: "Jane Smith",
       avatar: null,
     },
     content: "Hey! Did you check the new update?",
     createdAt: "10:35 AM",
     isMe: false,
   },
   {
     id: "msg_2",
     sender: {
       id: "me",
       name: "Me",
       avatar: null,
     },
     content: "Yes, I did. The UI looks much cleaner now 👍",
     createdAt: "10:37 AM",
     isMe: true,
   },
   {
     id: "msg_3",
     sender: {
       id: "user_2",
       name: "Jane Smith",
       avatar: null,
     },
     content: "Exactly! The performance feels better too.",
     createdAt: "10:38 AM",
     isMe: false,
   },
   {
     id: "msg_4",
     sender: {
       id: "me",
       name: "Me",
       avatar: null,
     },
     content: "I agree. The chat feature is my favorite part.",
     createdAt: "10:40 AM",
     isMe: true,
   },
   {
     id: "msg_5",
     sender: {
       id: "user_2",
       name: "Jane Smith",
       avatar: null,
     },
     content: "Same here. We should add typing indicators next!",
     createdAt: "10:41 AM",
     isMe: false,
   },
   {
     id: "msg_6",
     sender: {
       id: "me",
       name: "Me",
       avatar: null,
     },
     content: "Yes 🔥 That would be really useful!",
     createdAt: "10:42 AM",
     isMe: true,
   },
 ];

  return (
    <ScreenWrapper showPattern bgOpacity={0.5}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.container}
      >
        {/* Header */}
        <Header
          title=""
          headerTransparent={true}
          headerStyle={{
            backgroundColor: "transparent", 
            elevation: 0,
            shadowOpacity: 0, 
            paddingTop: 0,
            height: 49,
          }}
          headerStatusBarHeight={0}
          headerTintColor={colors.white}
          headerLeft={() => (
            <View style={styles.headerLeft}>
              <BackButton color={colors.white} />
              <Avatar
                uri={conversationAvatar as string}
                isGroup={type === "group"}
              />
              <Typo fontWeight="600" color={colors.white}>
                {conversationName}
              </Typo>
            </View>
          )}
        />
        {/**messages */}
        <View style={styles.content}>
          <FlatList  
          data={dummyMessages} 
          inverted={true} 
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.messagesContent}
          renderItem={({item}) =>{
            return <MessageItem item={item} isDirect={isDirect} />
          }}
          keyExtractor={(item)=>item.id}
          />
        </View>
      </KeyboardAvoidingView>
    </ScreenWrapper>
  );
};

export default Conversation;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    paddingHorizontal: spacingX._15,
    paddingTop: spacingY._10,
    paddingBottom: spacingY._15,
  },
  headerLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacingX._12,
  },
  inputRightIcon: {
    position: "absolute",
    right: scale(10),
    top: verticalScale(15),
    paddingLeft: spacingX._12,
    borderLeftWidth: 1.5,
    borderLeftColor: colors.neutral300,
  },
  selectedFile: {
    position: "absolute",
    height: verticalScale(38),
    width: verticalScale(38),
    borderRadius: radius.full,
    alignSelf: "center",
  },
  content: {
    flex: 1,
    backgroundColor: colors.white,
    borderTopLeftRadius: radius._50,
    borderTopRightRadius: radius._50,
    borderCurve: "continuous",
    overflow: "hidden",
    paddingHorizontal: spacingX._15,
  },
  inputIcon: {
    backgroundColor: colors.primary,
    borderRadius: radius.full,
    padding: 8,
  },
  footer: {
    paddingTop: spacingY._7,
    paddingBottom: verticalScale(22),
  },
  messagesContainer: {
    flex: 1,
  },
  messagesContent: {
    // padding: spacingX._15,
    paddingTop: spacingY._20,
    paddingBottom: spacingY._10,
    gap: spacingY._12,
  },
  plusIcon: {
    backgroundColor: colors.primary,
    borderRadius: radius.full,
    padding: 8,
  },
});
