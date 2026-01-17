import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import React, { useState } from "react";
import { colors, spacingX, spacingY } from "@/constants/theme";
import Avatar from "./Avatar";
import Typo from "./Type";
import moment from "moment";
import { ConversationListItemProps } from "@/types";
import { useAuth } from "@/context/authContext";
const ConversationItem = ({item , showDivider , router}:ConversationListItemProps) => {
  
  const { user : currentUser } = useAuth();
  const [ loading, setLoading ] = useState(false);
  const lastMessage: any = item.lastMessage;
  console.log("item:", item);
  console.log("lastMessage:", lastMessage);
  const isDirect = item.type === "direct";
  let avatar = item.avatar;
  console.log("item:", item);

  const otherParticipants = isDirect? item.participants.find(p=> p._id != currentUser?.id):null
  if(isDirect && otherParticipants){
    avatar = otherParticipants?.profilepic;
  }
  
  const getLastMessageContent = () => {
    if(!lastMessage) return null;

    return lastMessage?.attachement ? "image" : lastMessage?.content;
  }

  const getLastMessage = () => {
    if(!lastMessage?.createdAt) return null;

    const messageDate = moment(lastMessage.createdAt);
    const now = moment();

    if (messageDate.isSame(now, "day")) {
      return messageDate.format("h:mm A");
    }

    if (messageDate.isSame(now, "year")) {
      return messageDate.format("MMM DD");
    }

    
    return messageDate.format("MMM DD, YYYY");
   
  }

  const openConversation = () => {
    router.push({
      pathname:"/(main)/conversation",
      params:{
        id : item._id ,
        name : item.name,
        avatar : item.avatar || item.profilepic ,
        type : item.type,
        participants : JSON.stringify(item.participants)
      }
    })
  };

  return (
    <View>
      <TouchableOpacity
      style={styles.conversationItem}
      onPress={openConversation}>
        <View>
          <Avatar uri={avatar} size={47} isGroup={item.type === "group" } />
        </View>
        <View style={{ flex: 1 }} >
          <View style={styles.row}>
            <Typo size={17} fontWeight={"600"}>
              { isDirect? otherParticipants?.name : item.name}
            </Typo>
            {
              item.lastMessage && <Typo size={15}>{getLastMessage()}</Typo>
            }
          </View>
          <Typo size={15} color={colors.neutral600} textProps={{numberOfLines:1}} >
            {getLastMessageContent()}
          </Typo>
        </View>
      </TouchableOpacity>
      {showDivider && <View style={styles.divider} />}
    </View>
  );
};

export default ConversationItem;

const styles = StyleSheet.create({
  conversationItem: {
    gap: spacingX._10,
    marginVertical: spacingY._12,
    flexDirection: "row",
    alignItems: "center",
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  divider: {
    height: 1,
    width: "95%",
    alignSelf: "center",
    backgroundColor: "□ rgba(0,0,0,0.07)",
  },
});
