import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ActivityIndicator,
  BackHandler,
  Keyboard,
} from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { COLORS, SIZES } from '../../constants/theme';
import auth from '@react-native-firebase/auth';

const LoginScreen = ({ navigation }: any) => {
  const [role, setRole] = useState<'candidate' | 'employer' | 'admin'>('candidate');
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  // Android Back Handling
  useFocusEffect(
    useCallback(() => {
      const onBackPress = () => {
        if (role === 'admin') {
          setRole('candidate');
          return true;
        }
        return false;
      };
      const subscription = BackHandler.addEventListener('hardwareBackPress', onBackPress);
      return () => subscription.remove();
    }, [role])
  );

  // Immediate navigation fallback: fetch user role and reset stack
  const handleLogin = async () => {
    if (!identifier || !password) {
      Alert.alert('Error', 'Please fill all fields');
      return;
    }

    try {
      setLoading(true);

      const res = await auth().signInWithEmailAndPassword(identifier.trim(), password);

      // Refresh user to get latest emailVerified
      await res.user.reload();
      const refreshedUser = auth().currentUser;

      if (!refreshedUser?.emailVerified) {
        await auth().signOut();
        Alert.alert('Email not verified', 'Please verify your email before logging in.');
        return;
      }

      // Dismiss keyboard since App auth listener will handle navigation
      Keyboard.dismiss();
    } catch (error: any) {
      Alert.alert('Login failed', error.message);
    } finally {
      setPassword('');
      setLoading(false);
    }
  };


  return (
    <View style={styles.container}>
      {role === 'admin' && (
        <TouchableOpacity style={styles.adminBackBtn} onPress={() => setRole('candidate')}>
          <Text style={styles.adminBackText}>← Exit Admin Portal</Text>
        </TouchableOpacity>
      )}

      {role !== 'admin' && (
        <View style={styles.toggleContainer}>
          <TouchableOpacity
            style={[styles.toggleBtn, role === 'candidate' && styles.activeToggle]}
            onPress={() => setRole('candidate')}
          >
            <Text style={[styles.toggleText, role === 'candidate' && styles.activeText]}>Candidate</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.toggleBtn, role === 'employer' && styles.activeToggle]}
            onPress={() => setRole('employer')}
          >
            <Text style={[styles.toggleText, role === 'employer' && styles.activeText]}>Employer</Text>
          </TouchableOpacity>
        </View>
      )}

      <TouchableOpacity
        onLongPress={() => {
          setRole('admin');
          Alert.alert('Admin Access', 'System Administrator portal unlocked.');
        }}
        delayLongPress={2000}
        activeOpacity={1}
      >
        <Text style={styles.welcomeText}>
          {role === 'admin' ? 'Administrator Login' : role === 'employer' ? 'Hire Top Talent' : 'Find Your Dream Job'}
        </Text>
      </TouchableOpacity>

      <TextInput
        style={styles.input}
        placeholder="Email Address"
        value={identifier}
        onChangeText={setIdentifier}
        autoCapitalize="none"
      />

      <View style={styles.passwordContainer}>
        <TextInput
          style={styles.passwordInput}
          placeholder="Password"
          value={password}
          onChangeText={setPassword}
          secureTextEntry={!showPassword}
        />
        <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
          <Text style={styles.eye}>{showPassword ? '🙈' : '👁️'}</Text>
        </TouchableOpacity>
      </View>

      <TouchableOpacity style={styles.forgotBtn} onPress={() => navigation.navigate('ForgotPassword')}>
        <Text style={styles.forgotText}>Forgot Password?</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.button} onPress={handleLogin} disabled={loading}>
        {loading ? <ActivityIndicator color="#fff" /> : <Text style={styles.buttonText}>Login</Text>}
      </TouchableOpacity>

      {role !== 'admin' && (
        <TouchableOpacity style={styles.link} onPress={() => navigation.navigate('Signup', { role })}>
          <Text style={styles.linkText}>
            {role === 'employer' ? 'New Employer? Register Company' : 'New Candidate? Join Now'}
          </Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: SIZES.large, backgroundColor: COLORS.background, justifyContent: 'center' },
  adminBackBtn: { position: 'absolute', top: 50, left: 20, padding: 10 },
  adminBackText: { color: COLORS.primary, fontWeight: 'bold', fontSize: 16 },
  toggleContainer: { flexDirection: 'row', backgroundColor: '#E0E0E0', borderRadius: 25, marginBottom: 30, padding: 4 },
  toggleBtn: { flex: 1, paddingVertical: 10, alignItems: 'center', borderRadius: 21 },
  activeToggle: { backgroundColor: COLORS.primary },
  toggleText: { fontWeight: '600', color: '#666' },
  activeText: { color: '#FFF' },
  welcomeText: { fontSize: SIZES.xl, fontWeight: 'bold', color: COLORS.textPrimary, marginBottom: 25, textAlign: 'center' },
  input: { height: 55, borderWidth: 1, borderColor: COLORS.border, borderRadius: 10, paddingHorizontal: 15, marginBottom: 15, backgroundColor: '#fff' },
  passwordContainer: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#fff', borderRadius: 10, borderWidth: 1, borderColor: COLORS.border, paddingHorizontal: 15, marginBottom: 15 },
  passwordInput: { flex: 1, height: 55 },
  eye: { fontSize: 18 },
  forgotBtn: { alignSelf: 'flex-end', marginBottom: 20 },
  forgotText: { color: COLORS.primary, fontSize: 14, fontWeight: '500' },
  button: { backgroundColor: COLORS.primary, height: 55, borderRadius: 10, justifyContent: 'center', alignItems: 'center', marginTop: 10 },
  buttonText: { color: '#fff', fontWeight: 'bold', fontSize: 18 },
  link: { marginTop: 20, alignItems: 'center' },
  linkText: { color: COLORS.primary, fontWeight: '600' },
});

export default LoginScreen;
