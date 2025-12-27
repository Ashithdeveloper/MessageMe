import { View, Text, StyleSheet, TouchableOpacity, Modal, ScrollView, Touchable } from "react-native";
import React, { useState } from "react";
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

const Home = () => {
  const { user: currentUser, signOut } = useAuth();
  const router = useRouter()
  const [ selectedTab , setSelectedTab ] = useState(0)
  const [ loading, setLoading ] = useState(false);
  console.log("Current user:", currentUser);

  const handleLogout = async () => {
    await signOut();
  };
  const conversations = [
    {
      id: "1",
      name: "Alice Johnson",
      type: "direct",
      avatar: "https://i.pravatar.cc/150?img=1",
      lastMessage: {
        senderName: "Alice Johnson",
        content: "Hey! Are we still on for tonight?",
        createdAt: "2025-06-22T18:45:00Z",
      },
      unreadCount: 2,
      isOnline: true,
    },
    {
      id: "2",
      name: "Project Team",
      type: "group",
      avatar: "https://cdn-icons-png.flaticon.com/512/921/921071.png",
      lastMessage: {
        senderName: "Sarah",
        content: "Meeting rescheduled to 3pm tomorrow.",
        createdAt: "2025-06-21T14:10:00Z",
      },
      unreadCount: 0,
      isOnline: false,
    },
    {
      id: "3",
      name: "Bob Williams",
      type: "direct",
      avatar: "https://i.pravatar.cc/150?img=8",
      lastMessage: {
        senderName: "Bob Williams",
        content: "Bro, did you push the code to GitHub?",
        createdAt: "2025-06-22T10:30:00Z",
      },
      unreadCount: 5,
      isOnline: false,
    },
    {
      id: "4",
      name: "College Friends",
      type: "group",
      avatar: "https://cdn-icons-png.flaticon.com/512/847/847969.png",
      lastMessage: {
        senderName: "Rahul",
        content: "Let’s plan a trip this weekend 🔥",
        createdAt: "2025-06-20T20:15:00Z",
      },
      unreadCount: 1,
      isOnline: false,
    },
    {
      id: "5",
      name: "Mentor",
      type: "direct",
      avatar: "https://i.pravatar.cc/150?img=12",
      lastMessage: {
        senderName: "Mentor",
        content: "Good progress. Focus on optimization next.",
        createdAt: "2025-06-19T09:00:00Z",
      },
      unreadCount: 0,
      isOnline: true,
    },
  ];
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
                directConversations.map((item: any, index: number) => (
                  <ConversationItem
                    key={item.id}
                    item={item}
                    router={router}
                    showDivider={directConversations.length !== index + 1}
                  />
                ))}

              {selectedTab === 1 &&
                groupConversations.map((item: any, index: number) => (
                  <ConversationItem
                    key={item.id}
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
