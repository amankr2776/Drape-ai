'use client';

import { initializeApp, getApps, getApp, FirebaseApp } from 'firebase/app';
import { getAuth, Auth, GoogleAuthProvider } from 'firebase/auth';
import { getFirestore, Firestore } from 'firebase/firestore';
import { getStorage, FirebaseStorage } from 'firebase/storage';

/**
 * FIX 1 - ENVIRONMENT VARIABLES VALIDATION
 * Checks for all required VITE_FIREBASE_* variables before initialization.
 */
const requiredEnvVars = [
  'VITE_FIREBASE_API_KEY',
  'VITE_FIREBASE_AUTH_DOMAIN',
  'VITE_FIREBASE_PROJECT_ID',
  'VITE_FIREBASE_STORAGE_BUCKET',
  'VITE_FIREBASE_MESSAGING_SENDER_ID',
  'VITE_FIREBASE_APP_ID',
];

// Helper to access env safely across different bundlers
const getEnv = (key: string) => (globalThis as any).import?.meta?.env?.[key] || process.env[key];

requiredEnvVars.forEach(v => {
  if (!getEnv(v)) {
    console.error(`❌ Missing Firebase env variable: ${v}`);
  }
});

if (requiredEnvVars.some(v => !getEnv(v))) {
  throw new Error(
    "Firebase config incomplete. Check your .env file and make sure all VITE_FIREBASE_* variables are set, then restart the dev server with npm run dev"
  );
} else {
  if (process.env.NODE_ENV === 'development') {
    console.log('✅ Firebase config loaded successfully');
  }
}

/**
 * FIX 2 - FIREBASE CONFIG OBJECT
 * Strictly following the VITE_ prefix and import.meta.env pattern.
 */
const firebaseConfig = {
  apiKey: getEnv('VITE_FIREBASE_API_KEY'),
  authDomain: getEnv('VITE_FIREBASE_AUTH_DOMAIN'),
  projectId: getEnv('VITE_FIREBASE_PROJECT_ID'),
  storageBucket: getEnv('VITE_FIREBASE_STORAGE_BUCKET'),
  messagingSenderId: getEnv('VITE_FIREBASE_MESSAGING_SENDER_ID'),
  appId: getEnv('VITE_FIREBASE_APP_ID')
};

let app: FirebaseApp;
let auth: Auth;
let db: Firestore;
let storage: FirebaseStorage;
let googleProvider: GoogleAuthProvider;

/**
 * FIX 3 & 7 - SAFE INITIALIZATION & ERROR BOUNDARY
 */
try {
  app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);
  auth = getAuth(app);
  db = getFirestore(app);
  storage = getStorage(app);
  googleProvider = new GoogleAuthProvider();
  googleProvider.setCustomParameters({ prompt: 'select_account' });
} catch (error) {
  console.error("❌ Firebase initialization failed. Real error:", error);
  throw error;
}

// Named exports as requested
export { app, auth, db, storage, googleProvider };

/**
 * Returns the pre-initialized Firebase instances.
 */
export function initializeFirebase() {
  return { app, auth, db, storage, googleProvider };
}

export { FirebaseProvider, useFirebase } from './provider';
export { FirebaseClientProvider } from './client-provider';
export { useUser } from './auth/use-user';
