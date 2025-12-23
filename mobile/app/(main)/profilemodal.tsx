import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  TextInput,
  Alert,
} from "react-native";
import { useState } from "react";
import { router } from "expo-router";
import * as ImagePicker from "expo-image-picker";

export default function ProfileModal() {
  const [isEditing, setIsEditing] = useState(false);

  const [username, setUsername] = useState("ashith_dev");
  const [email, setEmail] = useState("ashith@gmail.com");
  const [password, setPassword] = useState("password123");

  const [profileImage, setProfileImage] = useState<string | null>(null);

  //  Pick Image Function
  const pickImage = async () => {
    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (!permission.granted) {
      Alert.alert("Permission Required", "Please allow gallery access");
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    });

    if (!result.canceled) {
      setProfileImage(result.assets[0].uri);
    }
  };

  const handleSave = () => {
    setIsEditing(false);
    Alert.alert(
      "Profile Updated",
      "Your profile has been updated successfully"
    );
    // 👉 later: upload image + update profile API
  };

  return (
    <View style={styles.container}>
      {/* Profile Image */}
      <TouchableOpacity style={styles.imageWrapper} onPress={pickImage}>
        <Image
          source={{
            uri:
              profileImage ??
              "https://cdn-icons-png.flaticon.com/512/3135/3135715.png",
          }}
          style={styles.profileImage}
        />
        <Text style={styles.changePhoto}>Change Photo</Text>
      </TouchableOpacity>

      {/* Username */}
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

      {/* Email */}
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

      {/* Password */}
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

      {/* Buttons */}
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

      {/* Logout */}
      <TouchableOpacity
        style={styles.logoutButton}
        onPress={() => router.replace("/login")}
      >
        <Text style={styles.logoutText}>Logout</Text>
      </TouchableOpacity>
    </View>
  );
}

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
