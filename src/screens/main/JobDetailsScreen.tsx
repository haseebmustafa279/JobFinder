import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { COLORS, SIZES } from '../../constants/theme';

const JobDetailsScreen = ({ route, navigation }: any) => {
  const { job } = route.params; // Get the job data we passed

  return (
    <View style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <Text style={styles.backText}>← Back</Text>
        </TouchableOpacity>

        <Text style={styles.jobTitle}>{job.title}</Text>
        <Text style={styles.companyName}>{job.company}</Text>
        
        <View style={styles.infoRow}>
          <View style={styles.tag}><Text style={styles.tagText}>{job.type}</Text></View>
          <Text style={styles.locationText}>{job.location}</Text>
          <Text style={styles.salaryText}>{job.salary}</Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Job Description</Text>
          <Text style={styles.description}>
            We are looking for a talented {job.title} to join our team at {job.company}. 
            You will be responsible for developing high-quality applications and 
            collaborating with cross-functional teams.
          </Text>
        </View>
      </ScrollView>

      <TouchableOpacity style={styles.applyFooterBtn}>
        <Text style={styles.applyFooterText}>Apply for this Job</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.white, padding: SIZES.medium },
  backBtn: { marginTop: SIZES.large, marginBottom: SIZES.medium },
  backText: { color: COLORS.primary, fontWeight: 'bold' },
  jobTitle: { fontSize: SIZES.xl, fontWeight: 'bold', color: COLORS.textPrimary },
  companyName: { fontSize: SIZES.large, color: COLORS.textSecondary, marginBottom: SIZES.medium },
  infoRow: { flexDirection: 'row', alignItems: 'center', marginBottom: SIZES.large },
  tag: { backgroundColor: COLORS.background, padding: 6, borderRadius: 8, marginRight: 10 },
  tagText: { color: COLORS.primary, fontWeight: 'bold', fontSize: 12 },
  locationText: { color: COLORS.textSecondary, marginRight: 10 },
  salaryText: { color: COLORS.primary, fontWeight: '700' },
  section: { marginTop: SIZES.large },
  sectionTitle: { fontSize: SIZES.medium, fontWeight: 'bold', marginBottom: 10 },
  description: { lineHeight: 22, color: COLORS.textSecondary },
  applyFooterBtn: {
    backgroundColor: COLORS.primary,
    padding: SIZES.medium,
    borderRadius: SIZES.medium,
    alignItems: 'center',
    position: 'absolute',
    bottom: 20,
    left: SIZES.medium,
    right: SIZES.medium,
  },
  applyFooterText: { color: COLORS.white, fontWeight: 'bold', fontSize: SIZES.medium }
});

export default JobDetailsScreen;