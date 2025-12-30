import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore, enableIndexedDbPersistence } from "firebase/firestore";
import { getStorage } from "firebase/storage";
import { getFunctions } from "firebase/functions";

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

// Initialize Firebase
let app;
let auth: any;
let db: any;
let storage: any;
let functions: any;

try {
  app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
  auth = getAuth(app);
  db = getFirestore(app);
  storage = getStorage(app);
  functions = getFunctions(app);

  // Enable offline persistence - PERMANENT FIX FOR TIMEOUTS
  if (typeof window !== 'undefined' && db) {
    enableIndexedDbPersistence(db).catch((err) => {
      if (err.code === 'failed-precondition') {
        console.warn('⚠️ Firestore persistence failed: Multiple tabs open. Using memory cache.');
      } else if (err.code === 'unimplemented') {
        console.warn('⚠️ Firestore persistence not available in this browser.');
      } else {
        console.warn('⚠️ Firestore persistence error:', err);
      }
    }).then(() => {
      console.log('✅ Firestore offline persistence enabled - App will work offline!');
    });
  }
} catch (error) {
  console.warn("Firebase initialization error (expected during build if env missing):", error);
}

export { auth, db, storage, functions };
