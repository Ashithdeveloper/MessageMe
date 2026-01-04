import { Alert, ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import React, { useEffect, useState } from "react";
import { router, useLocalSearchParams } from "expo-router";
import { colors, radius, spacingX, spacingY } from "@/constants/theme";
import ScreenWrapper from "@/components/ScreenWrapper";
import BackButton from "@/components/BackButton";
import Avatar from "@/components/Avatar";
import * as ImagePicker from "expo-image-picker";
import Input from "@/components/Input";
import Typo from "@/components/Type";
import { useAuth } from "@/context/authContext";
import Button from "@/components/Button";
import { getContacts, newConversation } from "@/socket/socketEven";
import { uploadToCloudinary } from "@/services/imageUploaded";

const Newconversationmodel = () => {
  const { isGroup } = useLocalSearchParams();
  const isGroupMOde = isGroup === "1"
  const [pickedImage, setPickedImage] = useState<any>(null);
  const [profileImage, setProfileImage] = useState<string | null>(null);
  const [groupName, setGroupName] = useState("");
  const [selectedParticipants, setSelectedParticipants] = useState<number[]>([]);
  const [ isLoading, setIsLoading ] = useState(false);
  const [ contacts , setContacts ] = useState([]);

  
  const { user:currentUser } = useAuth();
  console.log("Current user:", currentUser);

  //contacts socket API 
  useEffect(()=>{
    getContacts(processContacts);
    newConversation(processNewConversation);
    getContacts(
      {}
    )
    return () => {
      getContacts(processContacts , true);
      newConversation(processNewConversation , true);
    }
  },[])
  const processContacts = (res: any) =>{
    console.log("Contacts:", res);
    if(res.success){
      setContacts(res.data);
      console.log("Contacts:", res.data);
    }
  }
  const processNewConversation = (res: any) =>{
    console.log("New Conversation:", res);
    setIsLoading(false);
    if(res.success){
      router.back(); 
      router.push({
        pathname:"/conversation",
        params:{
          id : res.data._id ,
          name : res.data.name,
          avatar : res.data.avatar,
          type : res.data.type,
          participants : JSON.stringify(res.data.participants)
        }
      })
    }else{
      console.log("New Conversation:", res);
      Alert.alert("Error", res.msg);
    }
 
  }
   const PickImage = async () => {
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
    newConversation({
      type: "direct",
      participants: [currentUser.id, user.id],
    })

  }
};
const createGroup = async () => {
  if(!groupName.trim() || !currentUser || selectedParticipants.length<2){
    return
  }
  setIsLoading(true);
  try {
    let avatar = null;
    if(pickedImage){
      const res = await uploadToCloudinary(pickedImage);
      if(res){
        avatar = res;
      }
    }
    newConversation({
      type: "group",
      participants :[currentUser.id , ...selectedParticipants],
      name : groupName,
      avatar,
    })
   
  } catch (error) {
    console.log(error);
  }
}
  
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
              <TouchableOpacity onPress={PickImage}>
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
                <Avatar uri={user.profilepic} size={45} />
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
