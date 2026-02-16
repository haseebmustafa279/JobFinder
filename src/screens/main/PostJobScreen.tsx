import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView, Alert } from 'react-native';
import { COLORS, SIZES } from '../../constants/theme';

const PostJobScreen = ({ navigation }: any) => {
  const [jobData, setJobData] = useState({
    title: '',
    location: '',
    salary: '',
    description: ''
  });

  const handlePost = () => {
    if(!jobData.title || !jobData.salary) {
      Alert.alert("Error", "Please fill in the Job Title and Salary.");
      return;
    }
    // Logic to save job goes here
    Alert.alert("Success", "Job posted successfully!");
    navigation.goBack();
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Post a New Job</Text>
      
      <Text style={styles.label}>Job Title</Text>
      <TextInput 
        style={styles.input} 
        placeholder="e.g. Senior Android Developer"
        onChangeText={(text) => setJobData({...jobData, title: text})}
      />

      <Text style={styles.label}>Location</Text>
      <TextInput 
        style={styles.input} 
        placeholder="e.g. Lahore or Remote"
        onChangeText={(text) => setJobData({...jobData, location: text})}
      />

      <Text style={styles.label}>Salary Range</Text>
      <TextInput 
        style={styles.input} 
        placeholder="e.g. 100k - 150k"
        onChangeText={(text) => setJobData({...jobData, salary: text})}
      />

      <Text style={styles.label}>Description</Text>
      <TextInput 
        style={[styles.input, { height: 120 }]} 
        placeholder="Describe the roles and requirements..."
        multiline
        textAlignVertical="top"
        onChangeText={(text) => setJobData({...jobData, description: text})}
      />

      <TouchableOpacity style={styles.button} onPress={handlePost}>
        <Text style={styles.buttonText}>Publish Job</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.white, padding: SIZES.medium },
  title: { fontSize: SIZES.xl, fontWeight: 'bold', marginBottom: SIZES.large, marginTop: SIZES.large },
  label: { fontWeight: '600', marginBottom: 5, color: COLORS.textPrimary },
  input: { borderWidth: 1, borderColor: COLORS.border, borderRadius: SIZES.base, padding: SIZES.medium, marginBottom: SIZES.medium },
  button: { backgroundColor: COLORS.primary, padding: SIZES.medium, borderRadius: SIZES.medium, alignItems: 'center', marginTop: SIZES.medium },
  buttonText: { color: COLORS.white, fontWeight: 'bold' }
});

export default PostJobScreen;