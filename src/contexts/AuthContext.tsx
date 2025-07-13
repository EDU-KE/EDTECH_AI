"use client"

import React, { createContext, useContext, useEffect, useState } from 'react';
import { User } from 'firebase/auth';
import { onAuthStateChange, getUserProfile } from '@/lib/auth';
import type { UserProfile } from '@/lib/auth';
import type { DemoUser } from '@/lib/demo-auth';
import { isDemoMode } from '@/lib/firebase';

interface AuthContextType {
  user: User | DemoUser | null;
  profile: UserProfile | null;
  loading: boolean;
  isDemoMode: boolean;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  profile: null,
  loading: true,
  isDemoMode: false,
});

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | DemoUser | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Show demo mode notification
    if (isDemoMode) {
      console.log('🚀 Demo Mode Active: Firebase not configured. Using demo authentication.');
      console.log('📧 Demo accounts:');
      console.log('   Student: student@demo.com / password123');
      console.log('   Teacher: teacher@demo.com / password123');
    }

    const unsubscribe = onAuthStateChange(async (firebaseUser) => {
      setUser(firebaseUser);
      
      if (firebaseUser) {
        // Get user profile from Firestore (or demo storage)
        const userProfile = await getUserProfile(firebaseUser.uid);
        setProfile(userProfile);
      } else {
        setProfile(null);
      }
      
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const value = {
    user,
    profile,
    loading,
    isDemoMode,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
