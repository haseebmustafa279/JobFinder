import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity, TextInput } from 'react-native';
import { COLORS, SIZES } from '../../constants/theme';
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';

const JOBS = [
  { id: '1', title: 'Android Developer', company: 'Tech Corp', location: 'Lahore', type: 'Full-time', salary: '100k - 150k' },
  { id: '2', title: 'React Native Internee', company: 'OZ Tech Stack', location: 'Remote', type: 'Internship', salary: '25k - 40k' },
  { id: '3', title: 'Junior Software Engineer', company: 'Devsinc', location: 'Lahore', type: 'Full-time', salary: '80k - 120k' },
];

const CandidateHomeScreen = ({ navigation, route }: any) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [profileName, setProfileName] = useState<string | null>(null);
  const [profileEmail, setProfileEmail] = useState<string | null>(null);
  const userRole = route.params?.role ?? 'candidate';
  const displayName = profileName ?? (userRole.charAt(0).toUpperCase() + userRole.slice(1));

  const filteredJobs = JOBS.filter((job) => {
    const searchTerm = searchQuery.toLowerCase();
    return (
      job.title.toLowerCase().includes(searchTerm) ||
      job.company.toLowerCase().includes(searchTerm)
    );
  });

  const renderJobItem = ({ item }: any) => (
    <TouchableOpacity
      style={styles.jobCard}
      onPress={() => navigation.navigate('JobDetails', { job: item })}
    >
      <View style={styles.cardHeader}>
        <View style={[styles.logoBox, { backgroundColor: COLORS.secondary }]}>
          <Text style={styles.logoText}>{item.company.charAt(0)}</Text>
        </View>
        <View style={styles.titleContainer}>
          <Text style={styles.jobTitle}>{item.title}</Text>
          <Text style={styles.companyName}>{item.company}</Text>
        </View>
        <TouchableOpacity>
          <Text style={{ fontSize: 20 }}>🔖</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.cardFooter}>
        <View style={styles.infoBadge}>
          <Text style={styles.infoBadgeText}>{item.location}</Text>
        </View>
        <View style={styles.infoBadge}>
          <Text style={styles.infoBadgeText}>{item.type}</Text>
        </View>
        <Text style={styles.salaryText}>{item.salary}</Text>
      </View>
    </TouchableOpacity>
  );

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const u = auth().currentUser;
        if (!u) return;
        const snap = await firestore().collection('users').doc(u.uid).get();
        if (snap.exists()) {
          const data = snap.data() as any;
          setProfileName(data.name || data.email || u.displayName || null);
          setProfileEmail(data.email || u.email || null);
        } else {
          setProfileName(u.displayName || u.email || null);
          setProfileEmail(u.email || null);
        }
      } catch (err) {
        console.warn('Failed to load candidate profile:', err);
      }
    };

    fetchProfile();
  }, []);
  

  return (
    <View style={styles.container}>
      <View style={styles.welcomeHeader}>
        <View style={{ flex: 1 }}>
          <Text style={styles.welcomeSubtitle}>Hello, {displayName}!</Text>
          <Text style={styles.welcomeTitle}>
            {userRole === 'employer' ? 'Manage your listings' : 'Find your dream job'}
          </Text>
        </View>
        <TouchableOpacity
          style={styles.iconBtn}
          onPress={() => navigation.navigate('Messages')}
        >
          <Text style={{ fontSize: 22 }}>💬</Text>
          <View style={styles.dot} />
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.avatarContainer}
          onPress={() => navigation.navigate('Profile', { role: userRole })}
        >
          <Text style={styles.avatarText}>{displayName.charAt(0)}</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.searchContainer}>
        <TextInput
          style={styles.searchInput}
          placeholder="Search for 'Android' or 'Devsinc'..."
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
        <TouchableOpacity style={styles.searchBtn}>
          <Text style={{ color: COLORS.white }}>🔍</Text>
        </TouchableOpacity>
      </View>

      <Text style={styles.header}>
        {searchQuery ? `Results for "${searchQuery}"` : 'Popular Jobs'}
      </Text>

      <FlatList
        data={filteredJobs}
        keyExtractor={(item) => item.id}
        renderItem={renderJobItem}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 20 }}
        ListEmptyComponent={() => (
          <View style={{ alignItems: 'center', marginTop: 50 }}>
            <Text style={{ color: COLORS.textSecondary }}>No jobs found matching your search.</Text>
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
    marginRight: 10,
  },
  dot: {
    position: 'absolute',
    top: 10,
    right: 10,
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#e74c3c',
    borderWidth: 2,
    borderColor: COLORS.background,
  },
  avatarContainer: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: COLORS.primary,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: COLORS.secondary,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
  },
  avatarText: {
    color: COLORS.white,
    fontSize: 20,
    fontWeight: 'bold',
  },
  
  welcomeSubtitle: { fontSize: 14, color: COLORS.textSecondary },
  welcomeTitle: { fontSize: 24, fontWeight: 'bold', color: COLORS.textPrimary },
  searchContainer: { flexDirection: 'row', height: 50, marginBottom: 10 },
  searchInput: {
    flex: 1,
    backgroundColor: COLORS.white,
    marginRight: SIZES.small,
    borderRadius: SIZES.medium,
    height: "100%",
    paddingHorizontal: SIZES.medium,
    borderWidth: 1,
    borderColor: COLORS.border
  },
  searchBtn: {
    width: 50,
    height: "100%",
    backgroundColor: COLORS.primary,
    borderRadius: SIZES.medium,
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: { fontSize: SIZES.xl, fontWeight: 'bold', color: COLORS.textPrimary, marginVertical: SIZES.medium },
  jobCard: {
    backgroundColor: COLORS.white,
    padding: 16,
    borderRadius: 20,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: COLORS.border,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
  },
  cardHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: 12 },
  logoBox: { width: 45, height: 45, borderRadius: 12, justifyContent: 'center', alignItems: 'center' },
  logoText: { color: COLORS.primary, fontWeight: 'bold', fontSize: 18 },
  titleContainer: { flex: 1, marginLeft: 12 },
  jobTitle: { fontSize: 16, fontWeight: '700', color: COLORS.textPrimary },
  companyName: { fontSize: 14, color: COLORS.textSecondary, marginTop: 2 },
  cardFooter: { flexDirection: 'row', alignItems: 'center', borderTopWidth: 1, borderTopColor: '#f1f5f9', paddingTop: 12 },
  infoBadge: { backgroundColor: '#f1f5f9', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 8, marginRight: 8 },
  infoBadgeText: { fontSize: 11, color: COLORS.textSecondary, fontWeight: '600' },
  salaryText: { flex: 1, textAlign: 'right', fontSize: 14, fontWeight: '700', color: COLORS.primary },
});

export default CandidateHomeScreen;