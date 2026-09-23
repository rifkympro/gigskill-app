import { 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword, 
  signOut,
  onAuthStateChanged 
} from 'firebase/auth';
import { 
  collection, 
  doc, 
  setDoc, 
  getDoc, 
  getDocs, 
  query, 
  where, 
  onSnapshot 
} from 'firebase/firestore';
import { auth, db } from '../firebase.js';

// Registrasi akun online ke Firebase Auth + Simpan Profil ke Firestore
export async function registerWithFirebase(userData) {
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, userData.email, userData.password);
    const user = userCredential.user;

    const profileData = {
      id: user.uid,
      email: userData.email,
      name: userData.name || '',
      role: userData.role || 'student',
      univ: userData.univ || '',
      location: userData.location || '',
      phone: userData.phone || '',
      balance: 0,
      verified: false,
      isDummy: false,
      skills: userData.role === 'student' ? [] : undefined,
      portfolios: userData.role === 'student' ? [] : undefined,
      createdAt: new Date().toISOString()
    };

    // Bersihkan field undefined sebelum simpan
    Object.keys(profileData).forEach(k => profileData[k] === undefined && delete profileData[k]);

    await setDoc(doc(db, 'users', user.uid), profileData);
    return { success: true, user: profileData };
  } catch (error) {
    console.error('Firebase Register Error:', error);
    let message = 'Gagal mendaftar. Silakan coba lagi.';
    if (error.code === 'auth/email-already-in-use') {
      message = 'Email ini sudah terdaftar. Silakan gunakan email lain atau login.';
    } else if (error.code === 'auth/weak-password') {
      message = 'Password terlalu lemah. Minimal 6 karakter.';
    } else if (error.code === 'auth/invalid-email') {
      message = 'Format email tidak valid.';
    }
    return { success: false, error: message };
  }
}

// Login akun online dengan Firebase Auth
export async function loginWithFirebase(email, password) {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    const userDocRef = doc(db, 'users', user.uid);
    const userSnap = await getDoc(userDocRef);

    if (userSnap.exists()) {
      return { success: true, user: { ...userSnap.data(), id: user.uid } };
    } else {
      // Fallback jika profil firestore belum ada
      const fallbackUser = {
        id: user.uid,
        email: user.email,
        name: user.displayName || user.email.split('@')[0],
        role: 'student',
        balance: 0,
        verified: false,
        isDummy: false
      };
      await setDoc(userDocRef, fallbackUser);
      return { success: true, user: fallbackUser };
    }
  } catch (error) {
    console.error('Firebase Login Error:', error);
    let message = 'Email atau password salah!';
    if (error.code === 'auth/user-not-found' || error.code === 'auth/wrong-password' || error.code === 'auth/invalid-credential') {
      message = 'Email atau password tidak sesuai.';
    } else if (error.code === 'auth/too-many-requests') {
      message = 'Terlalu banyak percobaan login gagal. Silakan coba sesaat lagi.';
    }
    return { success: false, error: message };
  }
}

// Logout dari Firebase
export async function logoutFromFirebase() {
  try {
    await signOut(auth);
    return { success: true };
  } catch (error) {
    console.error('Firebase Logout Error:', error);
    return { success: false };
  }
}
