import { Alert } from 'react-native';
import auth, { FirebaseAuthTypes } from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';

/* =========================
   PASSWORD RESET
========================= */
export const passwordReset = async (email: string): Promise<boolean> => {
  try {
    await auth().sendPasswordResetEmail(email.trim());
    Alert.alert('Success', 'Password reset link sent to your email.');
    return true;
  } catch (error: any) {
    Alert.alert('Error', error.message);
    return false;
  }
};

/* =========================
   SIGN UP (Verified-only)
========================= */


export const signUpUser = async (
  fullName: string,
  email: string,
  password: string,
  role: string
) => {
  try {
    // 1️⃣ Create auth user
    const res = await auth().createUserWithEmailAndPassword(
      email.trim(),
      password
    );


    await res.user.updateProfile({
      displayName: fullName,
    });
    // 2️⃣ Send verification email
    await res.user.sendEmailVerification();

    // 3️⃣ Save user in Firestore
    await firestore().collection('users').doc(res.user.uid).set({
       name: fullName,
      email: email.trim(),
      role,
      createdAt: firestore.FieldValue.serverTimestamp(),
    });

    return true;
  } catch (error: any) {
    if (error.code === 'auth/email-already-in-use') {
      throw new Error('Email already exists');
    }
    throw error;
  }
};


/* =========================
   RESEND VERIFICATION
========================= */
export const resendVerificationEmail = async (): Promise<void> => {
  try {
    const user = auth().currentUser;

    if (!user) {
      Alert.alert('Error', 'No user signed in.');
      return;
    }

    await user.sendEmailVerification();
    Alert.alert('Success', 'Verification email resent!');
  } catch (error: any) {
    Alert.alert('Error', error.message);
  }
};

/* =========================
   LOGIN (Verified-only)
========================= */
export const loginUser = async (
  email: string,
  password: string
): Promise<FirebaseAuthTypes.User | null> => {
  try {
    const credential = await auth().signInWithEmailAndPassword(
      email.trim(),
      password
    );

    const user = credential.user;

    if (!user.emailVerified) {
      await auth().signOut();
      Alert.alert(
        'Access Denied',
        'Please verify your email address first.'
      );
      return null;
    }

    return user;
  } catch (error: any) {
    Alert.alert('Login Failed', error.message);
    return null;
  }
};

/* =========================
   LOGOUT
========================= */
export const logoutUser = async (): Promise<void> => {
  try {
    await auth().signOut();
  } catch (error) {
    console.error('Logout error:', error);
  }
};