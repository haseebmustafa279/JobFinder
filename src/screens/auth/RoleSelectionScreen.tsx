import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { COLORS, SIZES } from '../../constants/theme';

const RoleSelectionScreen = ({ navigation }: any) => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>I am a...</Text>


      <TouchableOpacity
        style={styles.roleCard}
        onPress={() => navigation.navigate('Signup', { role: 'candidate' })}
      >
        <Text style={styles.roleTitle}>Job Seeker</Text>
        <Text style={styles.roleDesc}>I want to find my dream job</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={[styles.roleCard, { borderColor: COLORS.secondary }]}
        onPress={() => navigation.navigate('Signup', { role: 'employer' })}
      >
        <Text style={styles.roleTitle}>Employer</Text>
        <Text style={styles.roleDesc}>I want to hire top talent</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={[styles.roleCard, { borderColor: '#555' }]}
        onPress={() => navigation.navigate('Login', { role: 'admin' })}
      >
        <Text style={styles.roleTitle}>System Admin</Text>
        <Text style={styles.roleDesc}>I want to manage the platform</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: SIZES.large, backgroundColor: COLORS.background, justifyContent: 'center' },
  title: { fontSize: SIZES.xl, fontWeight: 'bold', color: COLORS.textPrimary, marginBottom: SIZES.xl, textAlign: 'center' },
  roleCard: {
    padding: SIZES.large,
    borderWidth: 2,
    borderColor: COLORS.primary,
    borderRadius: SIZES.medium,
    marginBottom: SIZES.medium,
    backgroundColor: COLORS.white,
  },
  roleTitle: { fontSize: SIZES.large, fontWeight: 'bold', color: COLORS.textPrimary },
  roleDesc: { fontSize: SIZES.medium, color: COLORS.textSecondary, marginTop: 5 },
});

export default RoleSelectionScreen;