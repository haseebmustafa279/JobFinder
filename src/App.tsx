import React, { useEffect, useState } from 'react';
import { View, ActivityIndicator, StyleSheet } from 'react-native';
import { NavigationContainer, createNavigationContainerRef } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import auth, { FirebaseAuthTypes } from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';

// Auth Screens
import LoginScreen from './screens/auth/LoginScreen';
import SignupScreen from './screens/auth/SignupScreen';
import RoleSelectionScreen from './screens/auth/RoleSelectionScreen';
import ForgotPasswordScreen from './screens/auth/ForgotPasswordScreen';

// App Screens
import CandidateHomeScreen from './screens/main/CandidateHomeScreen';
import EmployerHomeScreen from './screens/main/EmployerHomeScreen';
import AdminHomeScreen from './screens/main/AdminHomeScreen';
import JobDetailsScreen from './screens/main/JobDetailsScreen';
import PostJobScreen from './screens/main/PostJobScreen';
import MessagesScreen from './screens/main/MessagesScreen';
import ChatDetailScreen from './screens/main/ChatDetailScreen';
import ProfileScreen from './screens/main/ProfileScreen';

const Stack = createNativeStackNavigator();

const navigationRef = createNavigationContainerRef<any>();

const App = () => {
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<FirebaseAuthTypes.User | null>(null);
  const [userRole, setUserRole] = useState<string | null>(null);

  useEffect(() => {
    const unsubscribe = auth().onAuthStateChanged(async (authUser) => {
      try {
        if (!authUser) {
          setUser(null);
          setUserRole(null);
          setLoading(false);
          return;
        }

        // Refresh user to get latest emailVerified
        await authUser.reload();
        const refreshedUser = auth().currentUser;

        if (!refreshedUser || !refreshedUser.emailVerified) {
          setUser(null);
          setUserRole(null);
          setLoading(false);
          return;
        }

        // Fetch role from Firestore
        const snap = await firestore()
          .collection('users')
          .doc(refreshedUser.uid)
          .get();

        const role = snap.exists() ? snap.data()?.role : 'candidate';

        setUser(refreshedUser);
        const resolvedRole = role ?? 'candidate';
        setUserRole(resolvedRole);

        // If navigation is ready, reset root to the appropriate home screen immediately
        const target = resolvedRole === 'employer' ? 'EmployerHome' : resolvedRole === 'admin' ? 'AdminHome' : 'CandidateHome';
        if (navigationRef.isReady()) {
          try {
            navigationRef.resetRoot({ index: 0, routes: [{ name: target }] });
          } catch (navErr) {
            console.warn('Navigation reset failed:', navErr);
          }
        }
      } catch (error) {
        console.error('Auth bootstrap failed:', error);
        await auth().signOut();
        setUser(null);
        setUserRole(null);
      } finally {
        setLoading(false);
      }
    });

    return unsubscribe;
  }, []);

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  return (
    <SafeAreaProvider>
      <NavigationContainer>
        <Stack.Navigator
          key={user ? 'AppStack' : 'AuthStack'}
          initialRouteName={user ? (userRole === 'employer' ? 'EmployerHome' : userRole === 'admin' ? 'AdminHome' : 'CandidateHome') : undefined}
          screenOptions={{ headerShown: false }}
        >
          {user === null ? (
            // -------- AUTH STACK --------
            <>
              <Stack.Screen name="Login" component={LoginScreen} />
              <Stack.Screen name="Signup" component={SignupScreen} />
              <Stack.Screen name="RoleSelection" component={RoleSelectionScreen} />
              <Stack.Screen name="ForgotPassword" component={ForgotPasswordScreen} />
            </>
          ) : (
            // -------- APP STACK --------
            <>
              {userRole === 'employer' && (
                <Stack.Screen name="EmployerHome" component={EmployerHomeScreen} />
              )}
              {userRole === 'admin' && (
                <Stack.Screen name="AdminHome" component={AdminHomeScreen} />
              )}
              {userRole === 'candidate' && (
                <Stack.Screen name="CandidateHome" component={CandidateHomeScreen} />
              )}

              {/* Common screens */}
              <Stack.Screen name="JobDetails" component={JobDetailsScreen} />
              <Stack.Screen name="PostJob" component={PostJobScreen} />
              <Stack.Screen name="Messages" component={MessagesScreen} />
              <Stack.Screen name="ChatDetail" component={ChatDetailScreen} />
              <Stack.Screen name="Profile" component={ProfileScreen} />
            </>
          )}
        </Stack.Navigator>
      </NavigationContainer>
    </SafeAreaProvider>
  );
};

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default App;
