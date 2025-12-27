import { Alert, ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import React, { useState } from "react";
import { useLocalSearchParams } from "expo-router";
import { colors, radius, spacingX, spacingY } from "@/constants/theme";
import ScreenWrapper from "@/components/ScreenWrapper";
import BackButton from "@/components/BackButton";
import Avatar from "@/components/Avatar";
import * as ImagePicker from "expo-image-picker";
import Input from "@/components/Input";
import Typo from "@/components/Type";
import { useAuth } from "@/context/authContext";
import Button from "@/components/Button";

const Newconversationmodel = () => {
  const { isGroup } = useLocalSearchParams();
  const isGroupMOde = isGroup === "1"
  const [pickedImage, setPickedImage] = useState<any>(null);
  const [profileImage, setProfileImage] = useState<string | null>(null);
  const [groupName, setGroupName] = useState("");
  const [selectedParticipants, setSelectedParticipants] = useState<number[]>([]);
  const [ isLoading, setIsLoading ] = useState(false);

  
  const { user:currentUser } = useAuth();
  console.log("Current user:", currentUser);
  
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
        const image = result.assets[0];
        setPickedImage(image);
        setProfileImage(image.uri);
      }
  };
const toggleParticipant = (user: any) => {
  setSelectedParticipants((prev) => {
    if (prev.includes(user.id)) {
      return prev.filter((id) => id !== user.id);
    } else {
      return [...prev, user.id];
    }
  });
};


const onSelectUser = (user: any) => {
  if (!currentUser) {
    Alert.alert("Authentication", "Please login to start a conversation");
    return;
  }

  if (isGroupMOde) {
    toggleParticipant(user);
  } else {
    // start single conversation
    console.log("Start chat with", user.id);
  }
};
const createGroup = () => {
  if(!groupName.trim() || !currentUser || selectedParticipants.length<2){
    return
  }
}
  // create group


  const contacts = [
    {
      id: 1,
      name: "Ashith ",
      image: "https://via.placeholder.com/150",
    },
    {
      id: 2,
      name: "Austine Doe",
      image: "https://via.placeholder.com/150",
    },
    {
      id: 3,
      name: "user 3",
      image: "https://via.placeholder.com/150",
    },
    {
      id: 4,
      name: "user 4",
      image: "https://via.placeholder.com/150",
    },
    {
      id: 5,
      name: "Alice",
      image: "https://via.placeholder.com/150",
    },
    {
      id: 6,
      name: "user 6",
      image: "https://via.placeholder.com/150",
    },
  ];


  return (
    <ScreenWrapper isModal={true}>
      <View style={styles.container}>
        {/* Custom Header */}
        <View style={styles.customHeader}>
          <BackButton color={colors.white} />
          <Text style={styles.headerTitle}>
            {isGroupMOde ? "New Group" : "Select Users"}
          </Text>
        </View>
        {/* group Header profile */}
        {isGroupMOde && (
          <View style={styles.groupInfoContainer}>
            <View style={styles.avatarContainer}>
              <TouchableOpacity onPress={pickImage}>
                <Avatar uri={profileImage} size={100} isGroup />
              </TouchableOpacity>
            </View>
            <View style={styles.groupNameContainer}>
              <Input
                placeholder="Group name"
                value={groupName}
                onChangeText={setGroupName}
              />
            </View>
          </View>
        )}
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.contactList}
        >
          {contacts.map((user: any) => {
            const isSelected = selectedParticipants.includes(user.id);

            return (
              <TouchableOpacity
                key={user.id}
                style={[
                  styles.contactRow,
                  isSelected && styles.selectedContact,
                ]}
                onPress={() => onSelectUser(user)}
              >
                <Avatar uri={user.image} size={45} />
                <Typo fontWeight="600" color={colors.white}>
                  {user.name}
                </Typo>

                {isGroupMOde && (
                  <View style={styles.selectionIndicator}>
                    <View
                      style={[styles.checkbox, isSelected && styles.checked]}
                    />
                  </View>
                )}
              </TouchableOpacity>
            );
          })}
        </ScrollView>
        {isGroupMOde && selectedParticipants.length >= 2 && (
          <View style={styles.createGroupButton}>
            <Button
              onPress={createGroup}
              disabled={!groupName.trim()}
              loading={isLoading}
              style={styles.createGroupBtn}
            >
              <Typo fontWeight="600" size={17} color={colors.white}>
                Create Group
              </Typo>
            </Button>
          </View>
        )}
      </View>
    </ScreenWrapper>
  );
};    

export default Newconversationmodel;

const styles = StyleSheet.create({
  container: {
    marginHorizontal: spacingX._15,
    flex: 1,
  },
  customHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacingX._10,
    paddingVertical: spacingY._10,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: colors.white,
  },
  groupInfoContainer: {
    alignItems: "center",
    marginTop: spacingY._10,
  },
  avatarContainer: {
    marginBottom: spacingY._10,
  },
  groupNameContainer: {
    width: "100%",
  },
  contactRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacingX._10,
    paddingVertical: spacingY._5,
  },
  selectedContact: {
    // backgroundColor: colors.neutral100,
    borderRadius: radius._15,
  },
  contactList: {
    gap: spacingY._12,
    marginTop: spacingY._10,
    paddingTop: spacingY._10,
    paddingBottom: spacingY._20,
  },
  selectionIndicator: {
    marginLeft: "auto",
    marginRight: spacingX._10,
  },
  checkbox: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: colors.primary,
  },
  checked: {
    backgroundColor: colors.primary,
  },
  createGroupButton: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    padding: spacingX._15,
    backgroundColor: colors.neutral900,
    borderTopWidth: 1,
    borderTopColor: colors.neutral700,
  },
  createGroupBtn: {
    width: "100%",
    borderRadius: radius.full,
    backgroundColor: colors.primary,
  },
});
