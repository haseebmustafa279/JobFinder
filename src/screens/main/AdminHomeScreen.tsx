import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, FlatList, ScrollView, Alert } from 'react-native';
import { COLORS, SIZES } from '../../constants/theme';
import { logoutUser } from '../../services/firebaseAuth';

const AdminHomeScreen = ({ navigation }: any) => {
  // Mock statistics for the Admin
  const stats = [
    { label: 'Total Users', value: '1,240', color: '#3498db' },
    { label: 'Active Jobs', value: '450', color: '#2ecc71' },
    { label: 'Pending Reports', value: '12', color: '#e74c3c' },
    { label: 'Companies', value: '85', color: '#f1c40f' },
  ];

  const recentActivities = [
    { id: '1', action: 'New Employer Registered', time: '2 mins ago' },
    { id: '2', action: 'Job "Android Dev" Approved', time: '1 hour ago' },
    { id: '3', action: 'User "John Doe" Reported', time: '3 hours ago' },
  ];

  return (
    <View style={styles.container}>
      <Text style={styles.header}>System Admin</Text>
      
      {/* Stats Grid */}
      <View style={styles.grid}>
        {stats.map((item, index) => (
          <View key={index} style={[styles.statBox, { borderLeftColor: item.color }]}>
            <Text style={styles.statValue}>{item.value}</Text>
            <Text style={styles.statLabel}>{item.label}</Text>
          </View>
        ))}
      </View>

      <Text style={styles.subHeader}>Recent Activity</Text>
      <FlatList
        data={recentActivities}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.activityItem}>
            <Text style={styles.activityText}>{item.action}</Text>
            <Text style={styles.activityTime}>{item.time}</Text>
          </View>
        )}
      />

      <TouchableOpacity 
        style={styles.logoutBtn}
        onPress={async () => {
          try {
            await logoutUser();
          } catch (e: any) {
            console.error('Logout failed:', e);
            Alert.alert('Logout Failed', e?.message || 'Please try again');
          }
        }}
      >
        <Text style={styles.logoutText}>Logout to Selection</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background, padding: SIZES.medium },
  header: { fontSize: SIZES.xl, fontWeight: 'bold', color: COLORS.textPrimary, marginTop: SIZES.large, marginBottom: SIZES.medium },
  grid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between' },
  statBox: { 
    backgroundColor: COLORS.white, 
    width: '48%', 
    padding: SIZES.medium, 
    borderRadius: SIZES.base, 
    marginBottom: SIZES.medium,
    borderLeftWidth: 5,
    elevation: 2 
  },
  statValue: { fontSize: SIZES.large, fontWeight: 'bold' },
  statLabel: { fontSize: 12, color: COLORS.textSecondary },
  subHeader: { fontSize: SIZES.large, fontWeight: 'bold', marginVertical: SIZES.medium },
  activityItem: { 
    backgroundColor: COLORS.white, 
    padding: SIZES.medium, 
    borderRadius: SIZES.base, 
    marginBottom: SIZES.small,
    flexDirection: 'row',
    justifyContent: 'space-between'
  },
  activityText: { fontSize: 14, color: COLORS.textPrimary },
  activityTime: { fontSize: 12, color: COLORS.textSecondary },
  logoutBtn: { marginTop: 'auto', padding: SIZES.medium, alignItems: 'center' },
  logoutText: { color: COLORS.primary, fontWeight: 'bold' }
});

export default AdminHomeScreen;