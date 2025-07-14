"use client"

import React, { createContext, useContext, useEffect, useState } from 'react';
import { User } from 'firebase/auth';
import { onAuthStateChange, getUserProfile, handleRedirectResult } from '@/lib/auth';
import type { UserProfile } from '@/lib/auth';
import type { DemoUser } from '@/lib/demo-auth';
import { demoOnAuthStateChange, demoGetUserProfile } from '@/lib/demo-auth';
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
    console.log('AuthProvider starting - immediately setting 2 second timeout');
    
    // EMERGENCY: Force loading to stop after 2 seconds no matter what
    const forceStop = setTimeout(() => {
      console.log('EMERGENCY: Forcing loading to stop now!');
      setLoading(false);
    }, 2000);
    
    // Quick demo mode check
    const isDemo = !process.env.NEXT_PUBLIC_FIREBASE_API_KEY || 
                   process.env.NEXT_PUBLIC_FIREBASE_API_KEY === "your_api_key_here";
    
    console.log('Demo mode check:', isDemo, process.env.NEXT_PUBLIC_FIREBASE_API_KEY);
    
    if (isDemo) {
      console.log('Demo mode detected - setting up demo user');
      
      // Set up default demo student user
      const demoUser: DemoUser = {
        uid: 'demo-student-1',
        email: 'student@demo.com',
        displayName: 'Demo Student'
      };
      
      const demoProfile: UserProfile = {
        uid: 'demo-student-1',
        email: 'student@demo.com',
        displayName: 'Demo Student',
        role: 'student',
        createdAt: new Date(),
        updatedAt: new Date()
      };
      
      setUser(demoUser);
      setProfile(demoProfile);
      
      setTimeout(() => {
        console.log('Demo timeout reached - stopping loading');
        clearTimeout(forceStop);
        setLoading(false);
      }, 1000);
    } else {
      // Real Firebase auth
      const unsubscribe = onAuthStateChange(async (user) => {
        setUser(user);
        if (user) {
          const profile = await getUserProfile(user.uid);
          setProfile(profile);
        } else {
          setProfile(null);
        }
        setLoading(false);
      });

      // Handle redirect result for social authentication
      handleRedirectResult().then((result) => {
        if (result) {
          console.log('Redirect authentication successful:', result.user.email);
          // The auth state change listener will handle setting user/profile
        }
      }).catch((error) => {
        console.error('Redirect authentication error:', error);
        setLoading(false);
      });
      
      return () => unsubscribe();
    }
    
    return () => {
      clearTimeout(forceStop);
    };
  }, []);

  const value = {
    user,
    profile,
    loading,
    isDemoMode: !process.env.NEXT_PUBLIC_FIREBASE_API_KEY || process.env.NEXT_PUBLIC_FIREBASE_API_KEY === "your_api_key_here",
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
