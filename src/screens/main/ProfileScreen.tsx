import React, { useState, useEffect } from 'react';
import { View, Image, Text, Modal, StyleSheet, TouchableOpacity, ScrollView, Alert, TextInput } from 'react-native';
import { logoutUser } from '../../services/firebaseAuth';
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import { COLORS, SIZES } from '../../constants/theme';
import storage from '@react-native-firebase/storage';
import { launchImageLibrary } from 'react-native-image-picker';
import DocumentPicker from 'react-native-document-picker';
import Config from 'react-native-config';
Config.CLOUDINARY_CLOUD_NAME
Config.CLOUDINARY_UPLOAD_PRESET

const ProfileScreen = ({ route, navigation }: any) => {
  const { role } = route.params || { role: 'candidate' };
  const isEmployer = role === 'employer';

  // State for user data
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [updating, setUpdating] = useState(false);
  const [photoURL, setPhotoURL] = useState<string | null>(null);
  const [resumeURL, setResumeURL] = useState<string | null>(null);


  const handleDeleteAccount = async () => {
    Alert.alert(
      "Confirm Delete",
      "This action cannot be undone",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: async () => {
            try {
              const user = auth().currentUser;
              if (!user) return;

              await firestore().collection('users').doc(user.uid).delete();
              try {
                const ref = storage().ref(`profileImages/${user.uid}.jpg`);
                await ref.getDownloadURL(); // check if exists
                await ref.delete();
              } catch (e) {
                // ignore if file doesn't exist
              }
              await user.delete();

              Alert.alert("Account Deleted");
            } catch (error: any) {
              Alert.alert("Re-authentication required", error.message);
            }
          }
        }
      ]
    );
  };


  const handleImagePick = async () => {
    try {
      const result = await launchImageLibrary({
        mediaType: 'photo',
        quality: 0.7,
      });

      if (!result.assets || result.assets.length === 0) return;

      const image = result.assets[0];
      if (!image.uri) return;

      const data = new FormData();
      data.append('file', {
        uri: image.uri,
        type: image.type || 'image/jpeg',
        name: image.fileName || 'profile.jpg',
      } as any);

      data.append('upload_preset', Config.CLOUDINARY_UPLOAD_PRESET);

      const response = await fetch(
        `https://api.cloudinary.com/v1_1/${Config.CLOUDINARY_CLOUD_NAME}/image/upload`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'multipart/form-data',
          },
          body: data,
        }
      );

      const uploadResult = await response.json();
      if (!uploadResult.secure_url) {
        throw new Error("Upload failed");
      }

      const user = auth().currentUser;
      if (!user) return;

      await firestore().collection('users').doc(user.uid).set(
        { photoURL: uploadResult.secure_url },
        { merge: true }
      );

      setPhotoURL(uploadResult.secure_url);

      Alert.alert("Success", "Profile image updated!");
    } catch (error: any) {
      console.log(error);
      Alert.alert("Error", error.message || "Image upload failed");
    }
  };
  const handleChangePassword = async () => {
    const user = auth().currentUser;
    if (!user?.email) return;

    try {
      await auth().sendPasswordResetEmail(user.email);
      Alert.alert("Password Reset Email Sent");
    } catch (error) {
      Alert.alert("Error", "Failed to send reset email");
    }
  };

  const handleResumeUpload = async () => {
  try {
    const res = await DocumentPicker.pickSingle({
      type: [DocumentPicker.types.pdf],
      copyTo: 'cachesDirectory',
    });

    const user = auth().currentUser;
    if (!user) return;

    const data = new FormData();

    data.append('file', {
      uri: res.fileCopyUri || res.uri,
      type: 'application/pdf',
      name: `resume_${user.uid}.pdf`,
    } as any);

    data.append('upload_preset', Config.CLOUDINARY_UPLOAD_PRESET);

    const response = await fetch(
      `https://api.cloudinary.com/v1_1/${Config.CLOUDINARY_CLOUD_NAME}/raw/upload`,
      {
        method: 'POST',
        body: data,
      }
    );

    const uploadResult = await response.json();

    console.log("Cloudinary PDF response:", uploadResult);

    if (!uploadResult.secure_url) {
      throw new Error(uploadResult?.error?.message || "Upload failed");
    }

    await firestore().collection('users').doc(user.uid).update({
      resumeURL: uploadResult.secure_url,
    });

    setResumeURL(uploadResult.secure_url);

    Alert.alert("Resume uploaded successfully!");
  } catch (error) {
    console.log("Resume upload error:", error);
    if (!DocumentPicker.isCancel(error)) {
      Alert.alert("Error uploading resume");
    }
  }
};

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const u = auth().currentUser;
        if (!u) return;

        const snap = await firestore()
          .collection('users')
          .doc(u.uid)
          .get();

        if (snap.exists()) {
          const data = snap.data() as any;

          setName(data.name || data.email || 'User');
          setEmail(data.email || u.email || '');

          // ✅ Move these here AFTER data is defined
          setPhotoURL(data.photoURL || null);
          setResumeURL(data.resumeURL || null);
        } else {
          setName(u.displayName || u.email || 'User');
          setEmail(u.email || '');
        }
      } catch (err) {
        console.warn('Failed to load profile:', err);
      }
    };

    fetchProfile();
  }, []);


  // State for the Edit Modal
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [tempName, setTempName] = useState(name);

  const handleSave = async () => {
    if (!tempName.trim()) {
      Alert.alert("Error", "Name cannot be empty");
      return;
    }

    try {
      setUpdating(true);

      const user = auth().currentUser;
      if (!user) return;

      // 1️⃣ Update Firestore
      await firestore()
        .collection('users')
        .doc(user.uid)
        .set(
          { name: tempName.trim() },
          { merge: true } // keeps other fields safe
        );

      // 2️⃣ Update Firebase Auth displayName
      await user.updateProfile({
        displayName: tempName.trim(),
      });

      // 3️⃣ Update local state
      setName(tempName.trim());
      setIsModalVisible(false);

      Alert.alert("Success", "Profile updated successfully!");
    } catch (error) {
      console.error("Profile update failed:", error);
      Alert.alert("Error", "Failed to update profile");
    } finally {
      setUpdating(false);
    }
  };


  return (
    <ScrollView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={styles.backBtn}>← Back</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Profile</Text>
        <View style={{ width: 40 }} />
      </View>

      {/* Profile Info Section (Single Card) */}
      <View style={styles.profileCard}>
        <TouchableOpacity
          style={styles.largeAvatar}
          onPress={handleImagePick}
        >
          {photoURL ? (
            <Image
              source={{ uri: photoURL }}
              style={{ width: 80, height: 80, borderRadius: 40 }}
            />
          ) : (
            <Text style={styles.avatarLetter}>
              {name.charAt(0)}
            </Text>
          )}
        </TouchableOpacity>


        <Text style={styles.userName}>{name}</Text>
        <Text style={styles.userEmail}>{email}</Text>

        <View style={styles.badge}>
          <Text style={styles.badgeText}>{role.toUpperCase()}</Text>
        </View>
      </View>

      {/* Options Section (Single List) */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Account Settings</Text>

        <TouchableOpacity
          style={styles.optionRow}
          onPress={() => {
            setTempName(name);
            setIsModalVisible(true);
          }}
        >
          <Text style={styles.optionText}>Edit Name</Text>
          <Text style={styles.arrow}>›</Text>
        </TouchableOpacity>

        {isEmployer ? (
          <TouchableOpacity style={styles.optionRow}>
            <Text style={styles.optionText}>Company Settings</Text>
            <Text style={styles.arrow}>›</Text>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity
            style={styles.optionRow}
            onPress={handleResumeUpload}
          >
            <Text style={styles.optionText}>
              {resumeURL ? "Update Resume" : "Upload Resume"}
            </Text>
            <Text style={styles.arrow}>›</Text>
          </TouchableOpacity>

        )}

        <TouchableOpacity style={styles.optionRow} onPress={handleDeleteAccount}>
          <Text style={[styles.optionText, { color: 'red' }]}>Delete Account</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.optionRow} onPress={handleChangePassword}>
          <Text style={styles.optionText}>Change Password</Text>
        </TouchableOpacity>


        <TouchableOpacity
          style={[styles.optionRow, { borderBottomWidth: 0 }]}
          onPress={async () => {
            try {
              await logoutUser();
            } catch (e: any) {
              console.error('Logout failed:', e);
              Alert.alert('Logout Failed', e?.message || 'Please try again');
            }
          }}
        >
          <Text style={[styles.optionText, { color: '#e74c3c' }]}>Logout</Text>
          <Text style={styles.arrow}>›</Text>
        </TouchableOpacity>
      </View>

      {/* Edit Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={isModalVisible}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Edit Profile Name</Text>

            <TextInput
              style={styles.input}
              value={tempName}
              onChangeText={setTempName}
              placeholder="Enter new name"
            />

            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={[styles.modalBtn, { backgroundColor: '#ccc' }]}
                onPress={() => setIsModalVisible(false)}
              >
                <Text style={[styles.btnText, { color: '#000' }]}>
                  Cancel
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[
                  styles.modalBtn,
                  { backgroundColor: updating ? '#999' : COLORS.primary }
                ]}
                onPress={handleSave}
                disabled={updating}
              >
                <Text style={styles.btnText}>
                  {updating ? "Saving..." : "Save"}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

    </ScrollView >
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: SIZES.medium,
    marginTop: 20
  },
  backBtn: { fontSize: 16, color: COLORS.primary, fontWeight: 'bold' },
  headerTitle: { fontSize: 18, fontWeight: 'bold', color: COLORS.textPrimary },
  profileCard: {
    alignItems: 'center',
    padding: 30,
    backgroundColor: COLORS.white,
    margin: SIZES.medium,
    borderRadius: 20,
    elevation: 3
  },
  largeAvatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: COLORS.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 15
  },
  avatarLetter: { color: COLORS.white, fontSize: 32, fontWeight: 'bold' },
  editIconBadge: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    backgroundColor: COLORS.white,
    padding: 5,
    borderRadius: 10,
    elevation: 2,
  },
  userName: { fontSize: 20, fontWeight: 'bold', color: COLORS.textPrimary },
  userEmail: { fontSize: 14, color: COLORS.textSecondary, marginBottom: 10 },
  badge: {
    backgroundColor: '#e0e7ff',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 20
  },
  badgeText: { color: COLORS.primary, fontSize: 10, fontWeight: 'bold' },
  section: { backgroundColor: COLORS.white, marginHorizontal: SIZES.medium, borderRadius: 20, padding: 10 },
  sectionTitle: { padding: 15, fontSize: 16, fontWeight: 'bold', color: COLORS.textPrimary },
  optionRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border
  },
  optionText: { fontSize: 16, color: COLORS.textPrimary },
  arrow: { fontSize: 20, color: COLORS.textSecondary },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    width: '85%',
    backgroundColor: COLORS.white,
    padding: 20,
    borderRadius: 20,
    elevation: 5,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 15,
    textAlign: 'center',
  },
  input: {
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 10,
    padding: 12,
    marginBottom: 20,
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  modalBtn: {
    flex: 0.45,
    padding: 12,
    borderRadius: 10,
    alignItems: 'center',
  },
  btnText: {
    color: COLORS.white,
    fontWeight: 'bold',
  },
});

export default ProfileScreen;