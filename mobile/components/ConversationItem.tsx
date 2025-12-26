import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import React from "react";
import { spacingX, spacingY } from "@/constants/theme";
import Avatar from "./Avatar";
import Typo from "./Type";

const ConversationItem = ({item , showDivider , router}:any) => {
  const openConversation = () => {
    
  }
  return (
    <View>
      <TouchableOpacity
      style={styles.conversationItem}
      onPress={openConversation}>
        <View>
          <Avatar uri={null} size={47} isGroup={item.type === "group" } />
        </View>
        <View style={{ flex: 1 }} >
          <View style={styles.row}>
            <Typo size={17} fontWeight={"600"}>
              {item.name}
            </Typo>
            {
              
            }
          </View>
        </View>
      </TouchableOpacity>
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
