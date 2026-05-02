'use client';

import { 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  signInWithPopup, 
  sendPasswordResetEmail,
  updateProfile,
  UserCredential
} from 'firebase/auth';
import { auth, googleProvider, appleProvider } from '@/firebase';
import { supabase } from '@/lib/supabase';

/**
 * Maps Firebase error codes to user-friendly luxury tone messages.
 */
export const mapAuthError = (code: string): string => {
  switch (code) {
    case 'auth/email-already-in-use': return "This email is already part of the atelier.";
    case 'auth/wrong-password': return "Incorrect secret phrase. Please try again.";
    case 'auth/user-not-found': return "No account found with this identity.";
    case 'auth/too-many-requests': return "Too many attempts. The atelier is temporarily locked.";
    case 'auth/popup-closed-by-user': return "Sign-in cancelled.";
    case 'auth/network-request-failed': return "Connection error. Check your internet.";
    default: return "An unexpected error occurred in the atelier.";
  }
};

export const signInWithEmail = async (email: string, password: string): Promise<UserCredential> => {
  const credential = await signInWithEmailAndPassword(auth!, email, password);
  // Update last seen
  await supabase.from('profiles').update({ last_seen: new Date().toISOString() }).eq('id', credential.user.uid);
  return credential;
};

export const signUpWithEmail = async (email: string, password: string, fullName: string): Promise<UserCredential> => {
  const credential = await createUserWithEmailAndPassword(auth!, email, password);
  await updateProfile(credential.user, { displayName: fullName });
  
  // Create Supabase profile
  await supabase.from('profiles').insert({
    id: credential.user.uid,
    email,
    full_name: fullName,
    role: 'user',
    is_onboarded: false,
    created_at: new Date().toISOString()
  });

  // Log activity
  await supabase.from('user_activity').insert({
    user_id: credential.user.uid,
    action_type: 'signup'
  });

  return credential;
};

export const signInSocial = async (provider: 'google' | 'apple'): Promise<UserCredential> => {
  const p = provider === 'google' ? googleProvider : appleProvider;
  const credential = await signInWithPopup(auth!, p);
  
  // Check if profile exists
  const { data: profile } = await supabase.from('profiles').select('id').eq('id', credential.user.uid).single();
  
  if (!profile) {
    await supabase.from('profiles').insert({
      id: credential.user.uid,
      email: credential.user.email!,
      full_name: credential.user.displayName,
      avatar_url: credential.user.photoURL,
      role: 'user',
      is_onboarded: false,
      created_at: new Date().toISOString()
    });
  } else {
    await supabase.from('profiles').update({ last_seen: new Date().toISOString() }).eq('id', credential.user.uid);
  }

  return credential;
};

export const sendPasswordReset = async (email: string): Promise<void> => {
  await sendPasswordResetEmail(auth!, email);
};
