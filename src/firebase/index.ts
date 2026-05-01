'use client';

import { initializeApp, getApps, getApp, FirebaseApp } from 'firebase/app';
import { getAuth, Auth, GoogleAuthProvider } from 'firebase/auth';
import { getFirestore, Firestore } from 'firebase/firestore';
import { firebaseConfig } from './config';

/**
 * Initialize Firebase only once at the module level to ensure a consistent singleton instance.
 */
const app: FirebaseApp = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);
const auth: Auth = getAuth(app);
const db: Firestore = getFirestore(app);
const googleProvider = new GoogleAuthProvider();

export { app, auth, db, googleProvider };

/**
 * Returns the pre-initialized Firebase instances.
 */
export function initializeFirebase(): {
  app: FirebaseApp;
  auth: Auth;
  db: Firestore;
  googleProvider: GoogleAuthProvider;
} {
  return { app, auth, db, googleProvider };
}

export { FirebaseProvider, useFirebase } from './provider';
export { FirebaseClientProvider } from './client-provider';
export { useUser } from './auth/use-user';
