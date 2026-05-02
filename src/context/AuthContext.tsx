
'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { 
  User as FirebaseUser, 
  onAuthStateChanged, 
  signOut as firebaseSignOut,
  signInWithPopup,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  updateProfile as firebaseUpdateProfile
} from 'firebase/auth';
import { auth, googleProvider, appleProvider } from '@/firebase';
import { supabase, type Profile, type StyleProfile } from '@/lib/supabase';
import { useToast } from '@/hooks/use-toast';

interface AuthContextType {
  user: FirebaseUser | null;
  profile: Profile | null;
  styleProfile: StyleProfile | null;
  role: Profile['role'];
  isLoading: boolean;
  isAuthenticated: boolean;
  isOnboarded: boolean;
  signInWithGoogle: () => Promise<void>;
  signInWithApple: () => Promise<void>;
  signOut: () => Promise<void>;
  refreshProfile: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<FirebaseUser | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [styleProfile, setStyleProfile] = useState<StyleProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  const fetchProfile = async (uid: string) => {
    try {
      const { data: profileData, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', uid)
        .single();

      if (profileError) throw profileError;
      setProfile(profileData);

      const { data: styleData } = await supabase
        .from('user_style_profile')
        .select('*')
        .eq('user_id', uid)
        .single();

      if (styleData) setStyleProfile(styleData);
    } catch (error) {
      console.error('Error fetching profile:', error);
    }
  };

  useEffect(() => {
    if (!auth) return;
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      setUser(firebaseUser);
      if (firebaseUser) {
        await fetchProfile(firebaseUser.uid);
        // Log login activity
        await supabase.from('user_activity').insert({
          user_id: firebaseUser.uid,
          action_type: 'login'
        });
      } else {
        setProfile(null);
        setStyleProfile(null);
      }
      setIsLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const signInWithGoogle = async () => {
    if (!auth) return;
    try {
      const result = await signInWithPopup(auth, googleProvider);
      // Sync with Supabase (simplified upsert for prototype)
      await supabase.from('profiles').upsert({
        id: result.user.uid,
        email: result.user.email!,
        full_name: result.user.displayName,
        avatar_url: result.user.photoURL,
        last_seen: new Date().toISOString()
      });
      toast({ title: "Welcome to the Atelier", description: "Successfully signed in with Google." });
    } catch (error) {
      console.error(error);
      toast({ variant: "destructive", title: "Auth Error", description: "Google sign-in failed." });
    }
  };

  const signInWithApple = async () => {
    if (!auth) return;
    try {
      await signInWithPopup(auth, appleProvider);
      toast({ title: "Welcome to the Atelier", description: "Successfully signed in with Apple." });
    } catch (error) {
      console.error(error);
      toast({ variant: "destructive", title: "Auth Error", description: "Apple sign-in failed." });
    }
  };

  const signOut = async () => {
    if (!auth) return;
    try {
      await firebaseSignOut(auth);
      toast({ title: "Signed Out", description: "See you soon in the atelier." });
    } catch (error) {
      console.error(error);
    }
  };

  const refreshProfile = async () => {
    if (user) await fetchProfile(user.uid);
  };

  return (
    <AuthContext.Provider value={{
      user,
      profile,
      styleProfile,
      role: profile?.role || 'user',
      isLoading,
      isAuthenticated: !!user,
      isOnboarded: !!profile?.is_onboarded,
      signInWithGoogle,
      signInWithApple,
      signOut,
      refreshProfile
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
};
