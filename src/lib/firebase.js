import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getDatabase } from "firebase/database";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
import { getAnalytics, isSupported } from "firebase/analytics";

const firebaseConfig = {
  apiKey: "AIzaSyC9OLBAGSL649cwzkDNAXsk0V-o-xIkYbY",
  authDomain: "sentinel-id-46bf9.firebaseapp.com",
  databaseURL: "https://sentinel-id-46bf9-default-rtdb.firebaseio.com",
  projectId: "sentinel-id-46bf9",
  storageBucket: "sentinel-id-46bf9.firebasestorage.app",
  messagingSenderId: "753089309330",
  appId: "1:753089309330:web:e41c777abeecb21e63544b",
  measurementId: "G-T1VKX2XT4L"
};

// Initialize Firebase App
export const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();

// Initialize Firebase services
export const auth = getAuth(app);
export const database = getDatabase(app);
export const db = getFirestore(app);
export const storage = getStorage(app);

// Analytics initialization helper (only runs in browser environment)
export const analyticsPromise = typeof window !== 'undefined'
  ? isSupported().then(supported => supported ? getAnalytics(app) : null).catch(() => null)
  : Promise.resolve(null);

export default app;
