import {
  View,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  FlatList,
  TouchableOpacity,
  Alert,
} from "react-native";
import React, { useEffect, useState } from "react";
import { useLocalSearchParams } from "expo-router";
import * as ImagePicker from "expo-image-picker";
import { Image } from "expo-image";
import { PaperPlaneTiltIcon, Plus } from "phosphor-react-native";

import { useAuth } from "@/context/authContext";
import { colors, radius, spacingX, spacingY } from "@/constants/theme";
import { scale, verticalScale } from "@/utils/styling";
import ScreenWrapper from "@/components/ScreenWrapper";
import Typo from "@/components/Type";
import { Header } from "@react-navigation/elements";
import BackButton from "@/components/BackButton";
import Avatar from "@/components/Avatar";
import MessageItem from "@/components/MessageItem";
import Input from "@/components/Input";
import { uploadToCloudinary } from "@/services/imageUploaded";
import { MessageProps, ResponseProps } from "@/types";
import { getMessage, newMessage } from "@/socket/socketEven";
import { get } from "react-native/Libraries/TurboModule/TurboModuleRegistry";

const Conversation = () => {
  const { user: currentUser } = useAuth();
  const {
    id: conversationId,
    name,
    participants: stringifiedParticipants,
    avatar,
    type,
  } = useLocalSearchParams();

  const [message, setMessage] = useState("");
  const [ messages, setMessages] = useState<MessageProps[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedFile, setSelectedFile] = useState<{ uri: string } | null>(
    null
  );

  const participants = stringifiedParticipants
    ? JSON.parse(stringifiedParticipants as string)
    : [];

  const isDirect = type === "direct";

  const otherParticipant = isDirect
    ? participants.find((p: any) => p._id !== currentUser?.id)
    : null;

  const conversationAvatar = isDirect ? otherParticipant?.profilepic : avatar;
  const conversationName = isDirect ? otherParticipant?.name : name;


  useEffect(()=>{
    newMessage(newMessageHandler);
    getMessage(messageHandler);
    getMessage({conversationId});
    return ()=>{
      newMessage(newMessageHandler , true);
      getMessage(messageHandler , true);
    }
  },[])

  const messageHandler = (res : ResponseProps) => {
    if(res.success){
      setMessages(res.data);
    }
  };

  const newMessageHandler = (res : ResponseProps) => {
  
    console.log("newMessageHandler" , res);
    if (res.success) {
      if (res.data.ConversationId == conversationId) {
        setMessages((prevMessages) => [
          res.data as MessageProps,
          ...prevMessages,
        ]);
      }
    }
  };



  const pickImage = async () => {
    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (!permission.granted) {
      Alert.alert("Permission Required", "Please allow gallery access");
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    });

    if (!result.canceled) {
      setSelectedFile(result.assets[0]);
    }
  };

  const sendMesssage = async () =>{
    setLoading(true);
    try {
      let attachement = null ;
      if(selectedFile){
        const uploadImage = await uploadToCloudinary(selectedFile);
        if (uploadImage){
          attachement = uploadImage
        }
      }
      // send message
      newMessage({
        conversationId ,
        sender:{
          id : currentUser?.id,
          name : currentUser?.name,
          avatar : currentUser?.avatar
        },
        content : message.trim(),
        attachement
      })
     
      setMessage('');
      setSelectedFile(null);
    } catch (error) {
      console.log("sendmesssage error",error);
    }
  }

  return (
    <ScreenWrapper showPattern bgOpacity={0.5}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        keyboardVerticalOffset={Platform.OS === "ios" ? 90 : 0}
      >
        <View style={styles.container}>
          {/* HEADER */}
          <Header
            title=""
            headerTransparent
            headerStatusBarHeight={0}
            headerStyle={{ height: 49 }}
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

          {/* CONTENT */}
          <View style={styles.content}>
            {/* MESSAGES */}
            <FlatList
              data={messages}
              inverted
              keyExtractor={(item) => item.id}
              showsVerticalScrollIndicator={false}
              keyboardDismissMode="on-drag"
              keyboardShouldPersistTaps="handled"
              contentContainerStyle={styles.messagesContent}
              renderItem={({ item }) => (
                <MessageItem item={item} isDirect={isDirect} />
              )}
            />

            {/* INPUT */}
            <View style={styles.footer}>
              <Input
                value={message}
                onChangeText={setMessage}
                placeholder="Type message..."
                containerStyle={{
                  paddingLeft: spacingX._10,
                  paddingRight: scale(65),
                  borderWidth: 0,
                }}
                icon={
                  <TouchableOpacity
                    style={styles.inputIcon}
                    onPress={pickImage}
                  >
                    <Plus
                      color={colors.black}
                      weight="bold"
                      size={verticalScale(20)}
                    />
                    {selectedFile?.uri && (
                      <Image
                        source={{ uri: selectedFile.uri }}
                        style={styles.selectedFile}
                        contentFit="cover"
                      />
                    )}
                  </TouchableOpacity>
                }
              />

              <View style={styles.inputRightIcon}>
                <TouchableOpacity
                  style={styles.inputIcon}
                  onPress={sendMesssage}
                >
                  <PaperPlaneTiltIcon
                    color={colors.black}
                    weight="fill"
                    size={verticalScale(22)}
                  />
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </View>
      </KeyboardAvoidingView>
    </ScreenWrapper>
  );
};

export default Conversation;

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: {
    paddingHorizontal: spacingX._15,
    paddingTop: spacingY._10,
    paddingBottom: spacingY._15,
  },
  headerLeft: { flexDirection: "row", alignItems: "center", gap: spacingX._12 },
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
  messagesContainer: { flex: 1 },
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
