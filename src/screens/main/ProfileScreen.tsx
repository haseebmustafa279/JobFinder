import React, { useState, useEffect } from 'react';
import { View, Text, Modal, StyleSheet, TouchableOpacity, ScrollView, Alert, TextInput } from 'react-native';
import { logoutUser } from '../../services/firebaseAuth';
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import { COLORS, SIZES } from '../../constants/theme';

const ProfileScreen = ({ route, navigation }: any) => {
  const { role } = route.params || { role: 'candidate' };
  const isEmployer = role === 'employer';

  // State for user data
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const u = auth().currentUser;
        if (!u) return;
        const snap = await firestore().collection('users').doc(u.uid).get();
        if (snap.exists()) {
          const data = snap.data() as any;
          setName(data.name || data.email || `User`);
          setEmail(data.email || u.email || '');
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

  const handleSave = () => {
    setName(tempName);
    setIsModalVisible(false);
    Alert.alert("Success", "Profile updated locally!");
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
          onPress={() => Alert.alert("Image Picker", "Gallery access will be added with Firebase integration!")}
        >
          <Text style={styles.avatarLetter}>{name.charAt(0)}</Text>
          <View style={styles.editIconBadge}><Text style={{fontSize: 10}}>✏️</Text></View>
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
          <TouchableOpacity style={styles.optionRow}>
            <Text style={styles.optionText}>My Resume / CV</Text>
            <Text style={styles.arrow}>›</Text>
          </TouchableOpacity>
        )}

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
                <Text style={styles.btnText}>Cancel</Text>
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={[styles.modalBtn, { backgroundColor: COLORS.primary }]} 
                onPress={handleSave}
              >
                <Text style={styles.btnText}>Save</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </ScrollView>
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