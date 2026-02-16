import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { COLORS, SIZES } from '../../constants/theme';
import auth from '@react-native-firebase/auth';

const ForgotPasswordScreen = ({ navigation }: any) => {
  const [email, setEmail] = useState('');

  const handleReset = async () => {
    if (!email) return Alert.alert("Error", "Please enter your email");
    try {
      await auth().sendPasswordResetEmail(email);
      Alert.alert("Sent", "Check your email for reset instructions.");
      navigation.goBack();
    } catch (e: any) {
      Alert.alert("Error", e.message);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Reset Password</Text>
      <TextInput 
        style={styles.input} 
        placeholder="Enter your registered email" 
        value={email}
        onChangeText={setEmail}
      />
      <TouchableOpacity style={styles.button} onPress={handleReset}>
        <Text style={styles.buttonText}>Send Reset Link</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: SIZES.large, justifyContent: 'center', backgroundColor: COLORS.background },
  title: { fontSize: SIZES.xl, fontWeight: 'bold', marginBottom: 20, textAlign: 'center' },
  input: { height: 55, borderWidth: 1, borderColor: COLORS.border, borderRadius: 10, paddingHorizontal: 15, marginBottom: 15 },
  button: { backgroundColor: COLORS.primary, height: 55, borderRadius: 10, justifyContent: 'center', alignItems: 'center' },
  buttonText: { color: '#fff', fontWeight: 'bold' }
});

export default ForgotPasswordScreen;