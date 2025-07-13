"use client";

import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  signOut as firebaseSignOut, 
  onAuthStateChanged,
  User as FirebaseUser,
  updateProfile
} from 'firebase/auth';
import { doc, setDoc, getDoc } from 'firebase/firestore';
import { auth, db, isDemoMode } from './firebase';
import { SessionManager, SessionData } from './session-manager-client';

export interface User {
  uid: string;
  email: string;
  displayName: string;
  role: 'student' | 'teacher' | 'admin';
  photoURL?: string;
  createdAt?: Date;
  lastLogin?: Date;
  sessionData?: SessionData;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<User>;
  signUp: (email: string, password: string, displayName: string, role: 'student' | 'teacher') => Promise<User>;
  signOut: () => Promise<void>;
  updateUserProfile: (updates: Partial<User>) => Promise<void>;
  refreshSession: () => Promise<boolean>;
  isSessionValid: () => boolean;
  getSessionTimeRemaining: () => number;
  isDemoMode: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Demo users for testing
const demoUsers = [
  { 
    uid: 'demo-student-1', 
    email: 'student@demo.com', 
    displayName: 'Demo Student', 
    role: 'student' as const,
    createdAt: new Date(),
    lastLogin: new Date()
  },
  { 
    uid: 'demo-teacher-1', 
    email: 'teacher@demo.com', 
    displayName: 'Demo Teacher', 
    role: 'teacher' as const,
    createdAt: new Date(),
    lastLogin: new Date()
  },
  { 
    uid: 'demo-admin-1', 
    email: 'admin@demo.com', 
    displayName: 'Demo Admin', 
    role: 'admin' as const,
    createdAt: new Date(),
    lastLogin: new Date()
  },
];

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  // Helper function to get client IP and User Agent
  const getClientInfo = () => {
    return {
      userAgent: typeof window !== 'undefined' ? navigator.userAgent : undefined,
      // IP address would typically be obtained server-side
      ipAddress: undefined as string | undefined
    };
  };

  // Convert Firebase user to our User type
  const mapFirebaseUser = async (firebaseUser: FirebaseUser): Promise<User | null> => {
    if (!firebaseUser) return null;

    try {
      // Get user document from Firestore
      const userDoc = await getDoc(doc(db, 'users', firebaseUser.uid));
      const userData = userDoc.data();

      const user: User = {
        uid: firebaseUser.uid,
        email: firebaseUser.email || '',
        displayName: firebaseUser.displayName || userData?.displayName || 'User',
        role: userData?.role || 'student',
        photoURL: firebaseUser.photoURL || userData?.photoURL,
        createdAt: userData?.createdAt?.toDate() || new Date(),
        lastLogin: new Date(),
      };

      // Create or refresh session
      const clientInfo = getClientInfo();
      const sessionToken = await SessionManager.createSession({
        userId: user.uid,
        email: user.email,
        role: user.role,
        displayName: user.displayName,
        ...clientInfo
      });

      // Get session data
      const sessionData = await SessionManager.getSession(sessionToken);
      if (sessionData) {
        user.sessionData = sessionData;
      }

      return user;
    } catch (error) {
      console.error('Error mapping Firebase user:', error);
      return null;
    }
  };

  // Handle demo mode authentication
  const handleDemoAuth = async (email: string): Promise<User | null> => {
    const demoUser = demoUsers.find(u => u.email === email);
    if (!demoUser) return null;

    // Create session for demo user
    const clientInfo = getClientInfo();
    const sessionToken = await SessionManager.createSession({
      userId: demoUser.uid,
      email: demoUser.email,
      role: demoUser.role,
      displayName: demoUser.displayName,
      ...clientInfo
    });

    const sessionData = await SessionManager.getSession(sessionToken);
    const user: User = {
      ...demoUser,
      sessionData: sessionData ?? undefined
    };

    return user;
  };

  // Sign in function
  const signIn = async (email: string, password: string): Promise<User> => {
    setLoading(true);
    
    try {
      if (isDemoMode) {
        // Demo mode authentication
        const demoUser = await handleDemoAuth(email);
        if (!demoUser) {
          throw new Error('Invalid demo credentials. Use student@demo.com, teacher@demo.com, or admin@demo.com');
        }
        
        setUser(demoUser);
        setLoading(false);
        return demoUser;
      } else {
        // Firebase authentication
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        const user = await mapFirebaseUser(userCredential.user);
        
        if (!user) {
          throw new Error('Failed to authenticate user');
        }

        // Update last login
        await setDoc(doc(db, 'users', user.uid), {
          lastLogin: new Date(),
        }, { merge: true });

        setUser(user);
        setLoading(false);
        return user;
      }
    } catch (error) {
      setLoading(false);
      throw error;
    }
  };

  // Sign up function
  const signUp = async (email: string, password: string, displayName: string, role: 'student' | 'teacher'): Promise<User> => {
    setLoading(true);
    
    try {
      if (isDemoMode) {
        throw new Error('Sign up is not available in demo mode');
      }

      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      
      // Update user profile
      await updateProfile(userCredential.user, { displayName });

      // Create user document in Firestore
      const userData = {
        email,
        displayName,
        role,
        createdAt: new Date(),
        lastLogin: new Date(),
      };

      await setDoc(doc(db, 'users', userCredential.user.uid), userData);

      const user = await mapFirebaseUser(userCredential.user);
      if (!user) {
        throw new Error('Failed to create user');
      }

      setUser(user);
      setLoading(false);
      return user;
    } catch (error) {
      setLoading(false);
      throw error;
    }
  };

  // Sign out function
  const signOut = async (): Promise<void> => {
    setLoading(true);
    
    try {
      // Destroy session
      await SessionManager.destroySession();
      
      if (!isDemoMode) {
        await firebaseSignOut(auth);
      }
      
      setUser(null);
      setLoading(false);
    } catch (error) {
      setLoading(false);
      throw error;
    }
  };

  // Update user profile
  const updateUserProfile = async (updates: Partial<User>): Promise<void> => {
    if (!user) throw new Error('No user logged in');

    try {
      if (!isDemoMode) {
        // Update Firebase profile
        if (updates.displayName || updates.photoURL) {
          await updateProfile(auth.currentUser!, {
            displayName: updates.displayName || user.displayName,
            photoURL: updates.photoURL || user.photoURL || null
          });
        }

        // Update Firestore document
        await setDoc(doc(db, 'users', user.uid), updates, { merge: true });
      }

      // Update local user state
      setUser(prev => prev ? { ...prev, ...updates } : null);
    } catch (error) {
      console.error('Error updating user profile:', error);
      throw error;
    }
  };

  // Refresh session
  const refreshSession = async (): Promise<boolean> => {
    if (!user?.sessionData) return false;

    try {
      // Get current session token from storage
      const allTokens = getAllSessionTokens();
      let sessionToken: string | undefined;
      
      // Find the token for the current user
      for (const token of allTokens) {
        const data = await SessionManager.getSession(token);
        if (data?.userId === user.uid) {
          sessionToken = token;
          break;
        }
      }

      if (sessionToken) {
        return await SessionManager.refreshSession(sessionToken);
      }
      return false;
    } catch (error) {
      console.error('Error refreshing session:', error);
      return false;
    }
  };

  // Helper to get all session tokens
  const getAllSessionTokens = (): string[] => {
    if (typeof window !== 'undefined') {
      const tokens: string[] = [];
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key?.startsWith('session_')) {
          tokens.push(key.replace('session_', ''));
        }
      }
      return tokens;
    } else {
      // For server-side, we don't have access to session storage
      return [];
    }
  };

  // Check if session is valid
  const isSessionValid = (): boolean => {
    if (!user?.sessionData) return false;
    
    const now = Date.now();
    return now < user.sessionData.expiresAt && 
           (now - user.sessionData.lastActivity) < 30 * 60 * 1000; // 30 minutes
  };

  // Get session time remaining
  const getSessionTimeRemaining = (): number => {
    if (!user?.sessionData) return 0;
    
    const now = Date.now();
    const timeRemaining = user.sessionData.expiresAt - now;
    return Math.max(0, timeRemaining);
  };

  // Listen for authentication state changes
  useEffect(() => {
    if (isDemoMode) {
      // In demo mode, check for existing session
      const checkDemoSession = async () => {
        const sessionData = await SessionManager.getSession();
        if (sessionData) {
          const demoUser = demoUsers.find(u => u.uid === sessionData.userId);
          if (demoUser) {
            setUser({ ...demoUser, sessionData });
          }
        }
        setLoading(false);
      };
      
      checkDemoSession();
      return;
    }

    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      setLoading(true);
      
      if (firebaseUser) {
        const user = await mapFirebaseUser(firebaseUser);
        setUser(user);
      } else {
        // Clear session when user signs out
        await SessionManager.destroySession();
        setUser(null);
      }
      
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  // Auto-refresh session periodically
  useEffect(() => {
    if (!user) return;

    const interval = setInterval(async () => {
      if (isSessionValid()) {
        await refreshSession();
      } else {
        // Session expired, sign out
        await signOut();
      }
    }, 5 * 60 * 1000); // Check every 5 minutes

    return () => clearInterval(interval);
  }, [user]);

  const value: AuthContextType = {
    user,
    loading,
    signIn,
    signUp,
    signOut,
    updateUserProfile,
    refreshSession,
    isSessionValid,
    getSessionTimeRemaining,
    isDemoMode
  };

  return React.createElement(
    AuthContext.Provider,
    { value },
    children
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

export default AuthContext;
