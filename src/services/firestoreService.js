import { 
  collection, 
  doc, 
  setDoc, 
  getDoc, 
  getDocs, 
  deleteDoc, 
  onSnapshot 
} from 'firebase/firestore';
import { db } from '../firebase.js';

// Generic subscriber to any Firestore collection
export function subscribeToCollection(collectionName, onData, onError) {
  if (!db) return () => {};
  try {
    const colRef = collection(db, collectionName);
    return onSnapshot(colRef, (snapshot) => {
      const items = [];
      snapshot.forEach(docSnap => {
        items.push({ ...docSnap.data(), id: docSnap.id });
      });
      onData(items);
    }, (error) => {
      console.warn(`Firestore sync error on ${collectionName}:`, error);
      if (onError) onError(error);
    });
  } catch (err) {
    console.warn(`Cannot subscribe to ${collectionName}:`, err);
    return () => {};
  }
}

// Bersihkan undefined secara rekursif agar Firestore tidak melempar error Unsupported field value
export function deepClean(obj) {
  if (obj === null || obj === undefined) return null;
  if (Array.isArray(obj)) {
    return obj
      .filter(item => item !== undefined)
      .map(item => deepClean(item));
  }
  if (typeof obj === 'object') {
    const res = {};
    for (const key of Object.keys(obj)) {
      const val = obj[key];
      if (val !== undefined) {
        res[key] = deepClean(val);
      }
    }
    return res;
  }
  return obj;
}

// Simpan atau perbarui dokumen di Cloud Firestore
export async function saveDocToCloud(collectionName, docId, data) {
  if (!db || !docId) return false;
  try {
    const cleanData = deepClean(data);
    await setDoc(doc(db, collectionName, String(docId)), cleanData, { merge: true });
    return true;
  } catch (err) {
    console.error(`Error saving doc to ${collectionName}/${docId}:`, err);
    return false;
  }
}

// Hapus dokumen dari Cloud Firestore
export async function deleteDocFromCloud(collectionName, docId) {
  if (!db || !docId) return false;
  try {
    await deleteDoc(doc(db, collectionName, String(docId)));
    return true;
  } catch (err) {
    console.error(`Error deleting doc from ${collectionName}/${docId}:`, err);
    return false;
  }
}

// Batch seed initial data ke Firestore jika koleksi masih kosong
export async function seedIfEmpty(collectionName, initialItems) {
  if (!db || !Array.isArray(initialItems) || initialItems.length === 0) return;
  try {
    const colRef = collection(db, collectionName);
    const snap = await getDocs(colRef);
    if (snap.empty) {
      console.log(`Seeding initial items to cloud ${collectionName}...`);
      for (const item of initialItems) {
        if (item && item.id) {
          const cleanItem = deepClean(item);
          await setDoc(doc(db, collectionName, String(item.id)), cleanItem);
        }
      }
      console.log(`Seeding completed for ${collectionName}`);
    }
  } catch (err) {
    console.warn(`Seed notice on ${collectionName}:`, err);
  }
}
