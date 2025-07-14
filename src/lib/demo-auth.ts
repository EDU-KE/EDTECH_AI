// Demo authentication for development when Firebase is not configured
import type { UserProfile } from './auth';

export interface DemoUser {
  uid: string;
  email: string;
  displayName: string;
  photoURL?: string;
}

// Demo users for testing
const demoUsers: Array<{ email: string; password: string; profile: UserProfile }> = [
  {
    email: 'student@demo.com',
    password: 'password123',
    profile: {
      uid: 'demo-student-1',
      email: 'student@demo.com',
      displayName: 'Demo Student',
      role: 'student',
      curriculum: undefined,
      curriculumSelected: false,
      gradeLevel: undefined,
      createdAt: new Date(),
      updatedAt: new Date()
    }
  },
  {
    email: 'teacher@demo.com',
    password: 'password123',
    profile: {
      uid: 'demo-teacher-1',
      email: 'teacher@demo.com',
      displayName: 'Demo Teacher',
      role: 'teacher',
      curriculum: 'CBE',
      curriculumSelected: true,
      gradeLevel: 'Grade 6',
      createdAt: new Date(),
      updatedAt: new Date()
    }
  }
];

let currentDemoUser: { user: DemoUser; profile: UserProfile } | null = null;
let authStateCallbacks: Array<(user: DemoUser | null) => void> = [];

export const demoSignUp = async (email: string, password: string, fullName: string) => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  const newUser: DemoUser = {
    uid: `demo-${Date.now()}`,
    email,
    displayName: fullName
  };
  
  const newProfile: UserProfile = {
    uid: newUser.uid,
    email: newUser.email,
    displayName: newUser.displayName,
    role: 'student',
    curriculum: undefined,
    curriculumSelected: false,
    gradeLevel: undefined,
    createdAt: new Date(),
    updatedAt: new Date()
  };
  
  currentDemoUser = { user: newUser, profile: newProfile };
  
  // Notify auth state listeners
  authStateCallbacks.forEach(callback => callback(newUser));
  
  return { user: newUser, profile: newProfile };
};

export const demoSignIn = async (email: string, password: string) => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  const demoUser = demoUsers.find(u => u.email === email && u.password === password);
  
  if (!demoUser) {
    throw new Error('Invalid email or password');
  }
  
  const user: DemoUser = {
    uid: demoUser.profile.uid,
    email: demoUser.profile.email,
    displayName: demoUser.profile.displayName
  };
  
  currentDemoUser = { user, profile: demoUser.profile };
  
  // Set cookies for middleware authentication in demo mode
  if (typeof document !== 'undefined') {
    const sessionExpiry = Date.now() + (24 * 60 * 60 * 1000); // 24 hours
    document.cookie = `auth-token=demo-token-${user.uid}; path=/; max-age=86400`;
    document.cookie = `user-role=${demoUser.profile.role}; path=/; max-age=86400`;
    document.cookie = `session-expiry=${sessionExpiry}; path=/; max-age=86400`;
    document.cookie = `auth-session=demo-session; path=/; max-age=86400`;
  }
  
  // Notify auth state listeners
  authStateCallbacks.forEach(callback => callback(user));
  
  return { user, profile: demoUser.profile };
};

export const demoSignOut = async () => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 500));
  
  currentDemoUser = null;
  
  // Clear cookies for middleware authentication in demo mode
  if (typeof document !== 'undefined') {
    document.cookie = 'auth-token=; path=/; max-age=0';
    document.cookie = 'user-role=; path=/; max-age=0';
    document.cookie = 'session-expiry=; path=/; max-age=0';
    document.cookie = 'auth-session=; path=/; max-age=0';
  }
  
  // Notify auth state listeners
  authStateCallbacks.forEach(callback => callback(null));
};

export const demoGetCurrentUser = () => {
  return currentDemoUser?.user || null;
};

export const demoGetUserProfile = async (uid: string): Promise<UserProfile | null> => {
  if (currentDemoUser && currentDemoUser.user.uid === uid) {
    return currentDemoUser.profile;
  }
  return null;
};

export const demoOnAuthStateChange = (callback: (user: DemoUser | null) => void) => {
  authStateCallbacks.push(callback);
  
  // Immediately call with current state
  callback(currentDemoUser?.user || null);
  
  // Return unsubscribe function
  return () => {
    authStateCallbacks = authStateCallbacks.filter(cb => cb !== callback);
  };
};
