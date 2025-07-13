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

  // Force demo mode detection on client side
  const isClientDemoMode = typeof window !== 'undefined' && 
    (!process.env.NEXT_PUBLIC_FIREBASE_API_KEY || process.env.NEXT_PUBLIC_FIREBASE_API_KEY === "your_api_key_here");
  
  console.log('AuthProvider - Environment:', {
    isDemoMode,
    isClientDemoMode,
    apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY
  });

  useEffect(() => {
    console.log('AuthProvider initializing - using client demo mode check');
    
    // Always set a maximum loading time of 2 seconds
    const maxLoadingTimeout = setTimeout(() => {
      console.log('Maximum loading time reached, setting loading to false');
      setLoading(false);
    }, 2000);
    
    // Use client-side demo mode detection or fallback to server-side
    const demoMode = isClientDemoMode || isDemoMode;
    
    // Show demo mode notification
    if (demoMode) {
      console.log('🚀 Demo Mode Active: Firebase not configured. Using demo authentication.');
      console.log('📧 Demo accounts:');
      console.log('   Student: student@demo.com / password123');
      console.log('   Teacher: teacher@demo.com / password123');
      
      // In demo mode, set loading to false after a short delay
      setTimeout(() => {
        clearTimeout(maxLoadingTimeout);
        setLoading(false);
      }, 500);
      return () => clearTimeout(maxLoadingTimeout);
    }

    let unsubscribe: (() => void) | undefined;
    
    // Set a shorter timeout to ensure loading doesn't hang indefinitely
    const loadingTimeout = setTimeout(() => {
      console.warn('Auth initialization taking too long, setting loading to false');
      setLoading(false);
    }, 1000);
    
    try {
      unsubscribe = onAuthStateChange(async (firebaseUser) => {
        console.log('Auth state changed:', firebaseUser?.email || 'No user');
        clearTimeout(loadingTimeout); // Clear timeout since auth state was resolved
        setUser(firebaseUser);
        
        if (firebaseUser) {
          try {
            // Get user profile from Firestore (or demo storage)
            const userProfile = await getUserProfile(firebaseUser.uid);
            setProfile(userProfile);
          } catch (error) {
            console.error('Error getting user profile:', error);
            setProfile(null);
          }
        } else {
          setProfile(null);
        }
        
        setLoading(false);
      });
    } catch (error) {
      console.error('Error setting up auth state listener:', error);
      clearTimeout(loadingTimeout);
      setLoading(false);
    }

    return () => {
      clearTimeout(loadingTimeout);
      clearTimeout(maxLoadingTimeout);
      if (unsubscribe) {
        unsubscribe();
      }
    };
  }, []);

  const value = {
    user,
    profile,
    loading,
    isDemoMode: isClientDemoMode || isDemoMode,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
