import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, FlatList, Alert } from 'react-native';
import { COLORS, SIZES } from '../../constants/theme';
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';

const EmployerHomeScreen = ({ navigation, route }: any) => {
  const [profileName, setProfileName] = useState<string | null>(null);
  const [profileEmail, setProfileEmail] = useState<string | null>(null);
  const userRole = route.params?.role || 'employer';
  const displayName = profileName ?? (userRole.charAt(0).toUpperCase() + userRole.slice(1));
  // Mock data for jobs posted by this specific employer
  const MY_JOBS = [
    { id: '1', title: 'Android Developer', applicants: 12, status: 'Active' },
  ];
  
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const u = auth().currentUser;
        if (!u) return;
        const snap = await firestore().collection('users').doc(u.uid).get();
        if (snap.exists()) {
          const data = snap.data() as any;
          setProfileName(data.name || data.companyName || data.email || u.displayName || null);
          setProfileEmail(data.email || u.email || null);
        } else {
          setProfileName(u.displayName || u.email || null);
          setProfileEmail(u.email || null);
        }
      } catch (err) {
        console.warn('Failed to load employer profile:', err);
      }
    };

    fetchProfile();
  }, []);

  return (
    <View style={styles.container}>
      <View style={styles.welcomeHeader}>
        <View style={{ flex: 1 }}>
          <Text style={styles.welcomeSubtitle}>Hello, {displayName}!</Text>
          <Text style={styles.welcomeTitle}>Post a Job & Hire</Text>
        </View>

        <TouchableOpacity
          style={styles.iconBtn}
          onPress={() => navigation.navigate('Messages')}
        >
          <Text style={{ fontSize: 22 }}>💬</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.avatarContainer}
          onPress={() => navigation.navigate('Profile', { role: userRole })}
        >
          <Text style={styles.avatarText}>{displayName.charAt(0)}</Text>
        </TouchableOpacity>
        
      </View>

      {/* Stats Cards */}
      <View style={styles.statsRow}>
        <View style={styles.statCard}>
          <Text style={styles.statNumber}>{MY_JOBS.length}</Text>
          <Text style={styles.statLabel}>Active Jobs</Text>
        </View>
        <View style={styles.statCard}>
          <Text style={styles.statNumber}>12</Text>
          <Text style={styles.statLabel}>Applicants</Text>
        </View>
      </View>

      <TouchableOpacity
        style={styles.postBtn}
        onPress={() => navigation.navigate('PostJob')}
      >
        <Text style={styles.postBtnText}>+ Post a New Job</Text>
      </TouchableOpacity>

      <Text style={styles.subHeader}>Your Job Postings</Text>
      <FlatList
        data={MY_JOBS}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.jobItem}>
            <View>
              <Text style={styles.jobTitle}>{item.title}</Text>
              <Text style={styles.jobDetails}>{item.applicants} Applicants • {item.status}</Text>
            </View>
            <TouchableOpacity><Text style={{ color: COLORS.primary }}>Edit</Text></TouchableOpacity>
          </View>
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background, padding: SIZES.medium },
  welcomeHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 20,
    marginTop: 10,
  },
  iconBtn: {
    width: 45,
    height: 45,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10, // Space between chat and profile
  },
  dot: {
    position: 'absolute',
    top: 10,
    right: 10,
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#e74c3c', // Red notification dot
    borderWidth: 2,
    borderColor: COLORS.background,
  },
  welcomeSubtitle: { fontSize: 14, color: COLORS.textSecondary },
  welcomeTitle: { fontSize: 24, fontWeight: 'bold', color: COLORS.textPrimary },
  avatarContainer: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: COLORS.primary,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 4,
  },
  avatarText: { color: COLORS.white, fontSize: 20, fontWeight: 'bold' },
  
  header: { fontSize: SIZES.xl, fontWeight: 'bold', color: COLORS.textPrimary, marginTop: SIZES.large },
  statsRow: { flexDirection: 'row', justifyContent: 'space-between', marginVertical: SIZES.large },
  statCard: { backgroundColor: COLORS.white, padding: SIZES.medium, borderRadius: SIZES.medium, width: '48%', elevation: 2, alignItems: 'center' },
  statNumber: { fontSize: SIZES.xl, fontWeight: 'bold', color: COLORS.primary },
  statLabel: { fontSize: SIZES.small, color: COLORS.textSecondary },
  postBtn: { backgroundColor: COLORS.primary, padding: SIZES.medium, borderRadius: SIZES.medium, alignItems: 'center', marginBottom: SIZES.large },
  postBtnText: { color: COLORS.white, fontWeight: 'bold', fontSize: SIZES.medium },
  subHeader: { fontSize: SIZES.large, fontWeight: 'bold', color: COLORS.textPrimary, marginBottom: SIZES.small },
  jobItem: { backgroundColor: COLORS.white, padding: SIZES.medium, borderRadius: SIZES.medium, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: SIZES.small },
  jobTitle: { fontWeight: 'bold', fontSize: SIZES.medium },
  jobDetails: { fontSize: 12, color: COLORS.textSecondary }
});

export default EmployerHomeScreen;