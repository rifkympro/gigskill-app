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

// Registrasi akun ke Cloud Firestore + Firebase Auth (jika didukung)
export async function registerWithFirebase(userData) {
  try {
    const cleanEmail = (userData.email || '').trim().toLowerCase();
    const cleanPassword = userData.password || '';

    // 1. Cek apakah email sudah terdaftar di Firestore
    if (db) {
      try {
        const checkQ = query(collection(db, 'users'), where('email', '==', cleanEmail));
        const checkSnap = await getDocs(checkQ);
        if (!checkSnap.empty) {
          return { 
            success: false, 
            error: 'Email ini sudah terdaftar. Silakan masuk atau gunakan email lain.' 
          };
        }
      } catch (checkErr) {
        console.warn('Firestore check notice:', checkErr);
      }
    }

    let uid = 'u_cloud_' + Date.now() + '_' + Math.random().toString(36).substring(2, 7);

    // 2. Coba daftarkan ke Firebase Auth jika password minimal 6 karakter
    if (auth && cleanPassword.length >= 6) {
      try {
        const userCredential = await createUserWithEmailAndPassword(auth, cleanEmail, cleanPassword);
        if (userCredential && userCredential.user) {
          uid = userCredential.user.uid;
        }
      } catch (fbAuthErr) {
        console.warn('Firebase Auth notice (falling back to direct cloud Firestore record):', fbAuthErr.code, fbAuthErr.message);
        if (fbAuthErr.code === 'auth/email-already-in-use') {
          return { 
            success: false, 
            error: 'Email ini sudah terdaftar. Silakan gunakan email lain atau masuk.' 
          };
        }
      }
    }

    const profileData = {
      id: uid,
      email: cleanEmail,
      password: cleanPassword, // disimpan untuk autentikasi multi-perangkat cross-browser
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

    // 3. Simpan profil ke Cloud Firestore agar dapat diakses dari laptop, HP, & browser mana pun
    if (db) {
      await setDoc(doc(db, 'users', uid), profileData);
    }

    return { success: true, user: profileData };
  } catch (error) {
    console.error('Register Cloud Error:', error);
    let message = 'Gagal mendaftar. Silakan periksa kembali data Anda.';
    if (error.code === 'auth/email-already-in-use') {
      message = 'Email ini sudah terdaftar. Silakan gunakan email lain atau masuk.';
    } else if (error.code === 'auth/invalid-email') {
      message = 'Format email tidak valid.';
    }
    return { success: false, error: message };
  }
}

// Login akun dengan Cloud Firestore & Firebase Auth
export async function loginWithFirebase(email, password) {
  try {
    const cleanEmail = (email || '').trim().toLowerCase();
    const cleanPassword = password || '';

    // 1. Cari data akun di Cloud Firestore
    if (db) {
      try {
        const q = query(collection(db, 'users'), where('email', '==', cleanEmail));
        const snap = await getDocs(q);

        if (!snap.empty) {
          const userDoc = snap.docs[0].data();
          const docId = snap.docs[0].id;

          // Bandingkan password
          if (userDoc.password === cleanPassword) {
            // Coba sinkronisasi sesi ke Firebase Auth jika ada
            if (auth && cleanPassword.length >= 6) {
              try {
                await signInWithEmailAndPassword(auth, cleanEmail, cleanPassword);
              } catch (e) {}
            }

            return { 
              success: true, 
              user: { ...userDoc, id: docId } 
            };
          } else {
            return { 
              success: false, 
              error: 'Password yang Anda masukkan salah. Silakan periksa kembali.' 
            };
          }
        }
      } catch (dbErr) {
        console.warn('Firestore query notice:', dbErr);
      }
    }

    // 2. Jika belum ditemukan di query Firestore langsung, coba periksa Firebase Auth
    if (auth && cleanPassword.length >= 6) {
      try {
        const userCredential = await signInWithEmailAndPassword(auth, cleanEmail, cleanPassword);
        const user = userCredential.user;

        if (db) {
          const userDocRef = doc(db, 'users', user.uid);
          const userSnap = await getDoc(userDocRef);

          if (userSnap.exists()) {
            return { success: true, user: { ...userSnap.data(), id: user.uid } };
          }
        }

        const fallbackUser = {
          id: user.uid,
          email: user.email,
          password: cleanPassword,
          name: user.displayName || user.email.split('@')[0],
          role: 'student',
          balance: 0,
          verified: false,
          isDummy: false
        };
        return { success: true, user: fallbackUser };
      } catch (authErr) {
        if (authErr.code === 'auth/wrong-password') {
          return { 
            success: false, 
            error: 'Password yang Anda masukkan salah. Silakan periksa kembali.' 
          };
        } else if (authErr.code === 'auth/user-not-found') {
          return { 
            success: false, 
            error: 'Akun dengan email ini belum terdaftar. Silakan daftar terlebih dahulu.' 
          };
        }
      }
    }

    // 3. Jika akun tidak ada di Firestore dan tidak ada di Auth
    return { 
      success: false, 
      error: 'Akun dengan email ini belum terdaftar. Silakan daftar terlebih dahulu.' 
    };
  } catch (error) {
    console.error('Firebase Login Error:', error);
    return { 
      success: false, 
      error: 'Terjadi kesalahan saat masuk. Silakan coba lagi.' 
    };
  }
}

// Sinkronisasi realtime pengguna terdaftar dari Cloud Firestore ke aplikasi
export function subscribeToCloudUsers(onUsersUpdated) {
  if (!db) return () => {};
  try {
    const usersCol = collection(db, 'users');
    return onSnapshot(usersCol, (snapshot) => {
      const cloudUsers = [];
      snapshot.forEach(docSnap => {
        cloudUsers.push({ ...docSnap.data(), id: docSnap.id });
      });
      onUsersUpdated(cloudUsers);
    }, (error) => {
      console.warn('Realtime cloud users sync notice:', error);
    });
  } catch (e) {
    console.warn('Cannot subscribe to cloud users:', e);
    return () => {};
  }
}

// Logout dari Firebase
export async function logoutFromFirebase() {
  try {
    if (auth) {
      await signOut(auth);
    }
    return { success: true };
  } catch (error) {
    console.error('Firebase Logout Error:', error);
    return { success: false };
  }
}
