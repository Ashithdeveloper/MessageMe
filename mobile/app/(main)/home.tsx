import { View, Text, StyleSheet, TouchableOpacity, Modal, ScrollView, Touchable } from "react-native";
import React, { useEffect, useState } from "react";
import ScreenWrapper from "@/components/ScreenWrapper";
import Typo from "@/components/Type";
import { colors, radius, spacingX, spacingY } from "@/constants/theme";
import { useAuth } from "@/context/authContext";
import { Gear, Plus } from "phosphor-react-native";
import { verticalScale } from "@/utils/styling";
import { useRouter } from "expo-router";
import ConversationItem from "@/components/ConversationItem";
import Loading from "@/components/Loading";
import Button from "@/components/Button";
import { getConversations, newConversation } from "@/socket/socketEven";
import { get } from "react-native/Libraries/TurboModule/TurboModuleRegistry";
import { ConversationProps, ResponseProps } from "@/types";

const Home = () => {
  const { user: currentUser, signOut } = useAuth();
  const router = useRouter()
  const [ selectedTab , setSelectedTab ] = useState(0)
  const [ loading, setLoading ] = useState(false);
  const [conversations, setConversations] = useState<ConversationProps[]>([]);

  console.log("Current user:", currentUser);

  useEffect(() => {
    getConversations(processConversation);
    newConversation(newConversationHandle)
    getConversations(null)
    return () => {
      getConversations(processConversation , true);
      newConversation(newConversationHandle , true);
    }
  }, []);
  const processConversation = ( res : any  ) =>{
    console.log("Conversations:", res);
    setConversations(res.data);
  }
  const newConversationHandle = (res: ResponseProps)=>{
    if(res.success && res.data?.isNew){
      setConversations((prevConversations) => [...prevConversations, res.data]);  
    }
  }
  const handleLogout = async () => {
    await signOut();
  };

const directConversations = conversations
  .filter((item: any) => item.type === "direct")
  .sort((a: any, b: any) => {
    const dateA = new Date(a?.lastMessage?.createdAt || a.createdAt);
    const dateB = new Date(b?.lastMessage?.createdAt || b.createdAt);
    return dateB.getTime() - dateA.getTime();
  });

 const groupConversations = conversations
   .filter((item: any) => item.type === "group")
   .sort((a: any, b: any) => {
     const dateA = new Date(a?.lastMessage?.createdAt || a.createdAt);
     const dateB = new Date(b?.lastMessage?.createdAt || b.createdAt);
     return dateB.getTime() - dateA.getTime();
   });



  return (
    <ScreenWrapper showPattern={true} bgOpacity={0.4}>
      <View style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <View style={{ flex: 1 }}>
            <Typo
              color={colors.neutral200}
              size={19}
              textProps={{ numberOfLines: 1 }}
            >
              Welcome back,{" "}
              <Text style={styles.username}>{currentUser?.name || "User"}</Text>
            </Typo>
          </View>

          <TouchableOpacity
            style={styles.settingIcon}
            onPress={() => router.push("/(main)/profilemodal")}
          >
            <Gear size={24} color={colors.white} weight="bold" />
          </TouchableOpacity>
        </View>

        {/* Content Area */}
        <View style={styles.content}>
          <ScrollView
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{ paddingVertical: spacingY._20 }}
          >
            <View style={styles.navBar}>
              <View style={styles.tabs}>
                <TouchableOpacity
                  onPress={() => setSelectedTab(0)}
                  style={[
                    styles.tabStyle,
                    selectedTab === 0 && styles.activeTabStyle,
                  ]}
                >
                  <Typo>Direct Message</Typo>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => setSelectedTab(1)}
                  style={[
                    styles.tabStyle,
                    selectedTab === 1 && styles.activeTabStyle,
                  ]}
                >
                  <Typo>Group Message</Typo>
                </TouchableOpacity>
              </View>
            </View>
            {/* messages */}
            <View style={styles.conversationList}>
              {selectedTab === 0 &&
                directConversations.map((item: ConversationProps, index: number) => (
                  <ConversationItem
                    key={index}
                    item={item}
                    router={router}
                    showDivider={directConversations.length !== index + 1}
                  />
                ))}

              {selectedTab === 1 &&
                groupConversations.map((item: ConversationProps, index: number) => (
                  <ConversationItem
                    key={index}
                    item={item}
                    router={router}
                    showDivider={groupConversations.length !== index + 1}
                  />
                ))}
            </View>
            {
              !loading && selectedTab === 0 && directConversations.length === 0 && (
                <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
                  <Typo color={colors.neutral200}>No conversation found</Typo>
                </View>
              )
            }
            {
              !loading && selectedTab === 1 && groupConversations.length === 0 && (
                <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
                  <Typo color={colors.neutral200}>No conversation found</Typo>
                </View>
              )
            }

            { loading && <Loading /> }
          </ScrollView>
        </View>
      </View>
      <Button style={styles.floatingButton}
      onPress={()=>router.push({
        pathname:"/(main)/newconversationmodel",
        params:{isGroup:selectedTab}
      })} >
        <Plus size={verticalScale(24)} color={colors.black} weight="bold"  />
      </Button>
    </ScreenWrapper>
  );
};

export default Home;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  username: {
    color: colors.white,
    fontWeight: "600",
    fontSize: 20,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: spacingX._20,
    gap: spacingY._15,
    paddingTop: spacingY._15,
    paddingBottom: spacingY._20,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  content: {
    flex: 1,
    backgroundColor: colors.white,
    borderTopLeftRadius: radius._50,
    borderTopRightRadius: radius._50,
    borderCurve: "continuous",
    overflow: "hidden",
    paddingHorizontal: spacingX._20,
  },
  navBar: {
    flexDirection: "row",
    gap: spacingX._15,
    alignItems: "center",
    paddingHorizontal: spacingX._10,
  },
  tabs: {
    flexDirection: "row",
    gap: spacingX._10,
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  tabStyle: {
    paddingVertical: spacingY._10,
    paddingHorizontal: spacingX._20,
    borderRadius: radius.full,
    backgroundColor: colors.neutral100,
  },
  activeTabStyle: {
    backgroundColor: colors.primaryLight,
  },
  conversationList: {
    paddingVertical: spacingY._20,
  },
  settingIcon: {
    padding: spacingY._10,
    backgroundColor: colors.neutral700,
    borderRadius: radius.full,
  },
  floatingButton: {
    height: verticalScale(50),
    width: verticalScale(50),
    borderRadius: 100,
    position: "absolute",
    bottom: verticalScale(30),
    right: verticalScale(30),
  },
});
