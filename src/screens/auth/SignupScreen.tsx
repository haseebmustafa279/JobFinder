import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, ActivityIndicator } from 'react-native';
import { COLORS, SIZES } from '../../constants/theme';
import { signUpUser } from '../../services/firebaseAuth';

const SignupScreen = ({ route, navigation }: any) => {
  const { role } = route.params || { role: 'candidate' };
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);


  useEffect(() => {
    if (role === 'admin') {
      Alert.alert("Access Denied", "Admin accounts must be created by the system owner.");
      navigation.replace('Login');
    }
  }, [role]);


  const handleRegister = async () => {
  if (!email || !password || !fullName) {
    Alert.alert("Error", "Please fill all fields");
    return;
  }

  if (password !== confirmPassword) {
    Alert.alert('Password Mismatch', 'Password and confirm password do not match.');
    return;
  }

  setLoading(true);
  const success = await signUpUser(fullName,email, password, role);
  setLoading(false);

  if (success) {
    Alert.alert(
      "Verify your email",
      "A verification email has been sent. Please verify your email before logging in.",
      [
        {
          text: "OK",
          onPress: () => navigation.replace('Login'),
        },
      ]
    );
  }
};



  return (
    <View style={styles.container}>
      <Text
        style={styles.title}
        numberOfLines={1}
        adjustsFontSizeToFit
      >
        Create {role.charAt(0).toUpperCase() + role.slice(1)} Account
      </Text>

      <TextInput
        style={styles.input}
        placeholder="Full Name"
        value={fullName}
        onChangeText={setFullName}
      />

      <TextInput
        style={styles.input}
        placeholder="Email Address"
        keyboardType="email-address"
        autoCapitalize="none"
        value={email}
        onChangeText={setEmail}
      />

      <View style={styles.passwordContainer}>
        <TextInput
          style={styles.passwordInput}
          placeholder="Password"
          secureTextEntry={!showPassword}
          value={password}
          onChangeText={setPassword}
        />
        <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
          <Text style={styles.eye}>{showPassword ? '🙈' : '👁️'}</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.passwordContainer}>
        <TextInput
          style={styles.passwordInput}
          placeholder="Confirm Password"
          secureTextEntry={!showConfirmPassword}
          value={confirmPassword}
          onChangeText={setConfirmPassword}
        />
        <TouchableOpacity onPress={() => setShowConfirmPassword(!showConfirmPassword)}>
          <Text style={styles.eye}>{showConfirmPassword ? '🙈' : '👁️'}</Text>
        </TouchableOpacity>
      </View>


      <TouchableOpacity style={styles.button} onPress={handleRegister} disabled={loading}>
        {loading ? <ActivityIndicator color="#fff" /> : <Text style={styles.buttonText}>Register</Text>}

      </TouchableOpacity>

      <TouchableOpacity onPress={() => navigation.goBack()} style={styles.link}>
        <Text style={styles.linkText}>Back to Login</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: SIZES.large, backgroundColor: COLORS.background, justifyContent: 'center' },
  title: { fontSize: SIZES.xl, fontWeight: 'bold', color: COLORS.textPrimary, marginBottom: SIZES.xl, textAlign: 'center' },
  input: { height: 55, borderWidth: 1, borderColor: COLORS.border, borderRadius: 10, paddingHorizontal: 15, marginBottom: 15, backgroundColor: '#fff' },
  button: { backgroundColor: COLORS.primary, height: 55, borderRadius: 10, justifyContent: 'center', alignItems: 'center', marginTop: 10 },
  buttonText: { color: '#fff', fontWeight: 'bold', fontSize: 18 },
  link: { marginTop: 20, alignItems: 'center' },
  passwordContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: COLORS.border,
    paddingHorizontal: 15,
    marginBottom: 15,
  },
  passwordInput: {
    flex: 1,
    height: 55,
  },
  eye: {
    fontSize: 18,
  },
  linkText: { color: COLORS.primary, fontWeight: '600' }
});

export default SignupScreen;