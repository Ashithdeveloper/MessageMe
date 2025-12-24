import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  TextInput,
  Alert,
} from "react-native";
import { useEffect, useState } from "react";
import * as ImagePicker from "expo-image-picker";
import { uploadToCloudinary } from "@/services/imageUploaded";
import { useAuth } from "@/context/authContext";
import { getDetails, updateProfile } from "@/services/authService";

export default function ProfileModal() {
  const { signOut } = useAuth();
  const [isEditing, setIsEditing] = useState(false);

  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [pickedImage, setPickedImage] = useState<any>(null);
  const [profileImage, setProfileImage] = useState<string | null>(null);

  useEffect(() => {
    ProfileDetails();
  }, []);

  /* ---------------- LOGOUT ---------------- */
  const handleLogout = async () => {
    await signOut();
  };

  /* ---------------- PICK IMAGE ---------------- */
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
      handleSave();
    }
  };

  /* ---------------- GET PROFILE ---------------- */
  const ProfileDetails = async (): Promise<void> => {
    try {
      const res: any = await getDetails();

      if (!res || typeof res !== "object" || !("user" in res)) {
        console.log("Invalid profile response:", res);
        return;
      }

      setUsername(res.user.name);
      setEmail(res.user.email);
      setProfileImage(res.user.profilepic ?? null);
    } catch (error) {
      console.log("ProfileDetails error:", error);
    }
  };

  /* ---------------- SAVE PROFILE ---------------- */
  const handleSave = async () => {
    try {
      setIsEditing(false);

      let uploadedImageUrl: string | undefined = profileImage ?? undefined;

      if (pickedImage) {
        uploadedImageUrl = await uploadToCloudinary(pickedImage);
        setProfileImage(uploadedImageUrl);
        console.log(uploadedImageUrl);
      }
      console.log(uploadedImageUrl);

      const res: any = await updateProfile(
        username,
        email,
        password,
        uploadedImageUrl
      );

      if (!res || typeof res !== "object" || !("user" in res)) {
        console.log("Invalid update response:", res);
        Alert.alert("Error", "Unexpected server response");
        return;
      }

      setUsername(res.user.name);
      setEmail(res.user.email);
      setProfileImage(res.user.profilepic ?? null);

      Alert.alert("Profile Updated", "Your profile updated successfully");
    } catch (error) {
      console.log("Update profile error:", error);
      Alert.alert("Error", "Profile update failed");
    }
  };

  return (
    <View style={styles.container}>
      {/* PROFILE IMAGE */}
      <TouchableOpacity style={styles.imageWrapper} onPress={pickImage}>
        <Image
          source={{
            uri:
              profileImage ||
              "https://cdn-icons-png.flaticon.com/512/3135/3135715.png",
          }}
          style={styles.profileImage}
        />
        <Text style={styles.changePhoto}>Change Photo</Text>
      </TouchableOpacity>

      {/* USERNAME */}
      <View style={styles.infoBox}>
        <Text style={styles.label}>Username</Text>
        {isEditing ? (
          <TextInput
            value={username}
            onChangeText={setUsername}
            style={styles.input}
          />
        ) : (
          <Text style={styles.value}>{username}</Text>
        )}
      </View>

      {/* EMAIL */}
      <View style={styles.infoBox}>
        <Text style={styles.label}>Email</Text>
        {isEditing ? (
          <TextInput
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            style={styles.input}
          />
        ) : (
          <Text style={styles.value}>{email}</Text>
        )}
      </View>

      {/* PASSWORD */}
      <View style={styles.infoBox}>
        <Text style={styles.label}>Password</Text>
        {isEditing ? (
          <TextInput
            value={password}
            onChangeText={setPassword}
            secureTextEntry
            style={styles.input}
          />
        ) : (
          <Text style={styles.value}>••••••••</Text>
        )}
      </View>

      {isEditing ? (
        <>
          <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
            <Text style={styles.saveText}>Save</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.cancelButton}
            onPress={() => setIsEditing(false)}
          >
            <Text style={styles.cancelText}>Cancel</Text>
          </TouchableOpacity>
        </>
      ) : (
        <TouchableOpacity
          style={styles.editButton}
          onPress={() => setIsEditing(true)}
        >
          <Text style={styles.editText}>Edit Profile</Text>
        </TouchableOpacity>
      )}

      {/* LOGOUT */}
      <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
        <Text style={styles.logoutText}>Logout</Text>
      </TouchableOpacity>
    </View>
  );
}

/* ---------------- STYLES ---------------- */

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    padding: 20,
    alignItems: "center",
    paddingTop: 40,
  },
  imageWrapper: {
    alignItems: "center",
    marginBottom: 30,
  },
  profileImage: {
    width: 110,
    height: 110,
    borderRadius: 55,
    marginBottom: 8,
  },
  changePhoto: {
    color: "#3797EF",
    fontWeight: "600",
  },
  infoBox: {
    width: "100%",
    marginBottom: 15,
  },
  label: {
    fontSize: 13,
    color: "#888",
    marginBottom: 4,
  },
  value: {
    fontSize: 16,
    paddingVertical: 12,
    paddingHorizontal: 12,
    backgroundColor: "#F2F2F2",
    borderRadius: 8,
  },
  input: {
    fontSize: 16,
    paddingVertical: 12,
    paddingHorizontal: 12,
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#3797EF",
    borderRadius: 8,
  },
  editButton: {
    width: "100%",
    backgroundColor: "#facc15",
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: "center",
    marginTop: 20,
  },
  editText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
  saveButton: {
    width: "100%",
    backgroundColor: "#34C759",
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: "center",
    marginTop: 20,
  },
  saveText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
  cancelButton: {
    marginTop: 10,
  },
  cancelText: {
    color: "#888",
    fontSize: 15,
  },
  logoutButton: {
    marginTop: 25,
  },
  logoutText: {
    color: "red",
    fontSize: 15,
    fontWeight: "600",
  },
});
