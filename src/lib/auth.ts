import { 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  signOut as firebaseSignOut,
  onAuthStateChanged,
  User,
  updateProfile,
  signInWithPopup,
  signInWithRedirect,
  getRedirectResult,
  GoogleAuthProvider,
  FacebookAuthProvider,
  TwitterAuthProvider
} from 'firebase/auth';
import { auth, isDemoMode } from './firebase';
import { doc, setDoc, getDoc } from 'firebase/firestore';
import { db } from './firebase';
import {
  demoSignUp,
  demoSignIn,
  demoSignOut,
  demoGetCurrentUser,
  demoGetUserProfile,
  demoOnAuthStateChange,
  type DemoUser
} from './demo-auth';

export interface UserProfile {
  uid: string;
  email: string;
  displayName: string;
  role: 'student' | 'teacher' | 'admin';
  createdAt: Date;
  updatedAt: Date;
}

// Sign up with email and password
export const signUp = async (email: string, password: string, fullName: string) => {
  if (isDemoMode) {
    console.log('🚀 Demo Mode: Using demo authentication');
    return await demoSignUp(email, password, fullName);
  }
  
  try {
    const { user } = await createUserWithEmailAndPassword(auth, email, password);
    
    // Update the user's display name
    await updateProfile(user, {
      displayName: fullName
    });

    // Create user profile in Firestore
    const userProfile: UserProfile = {
      uid: user.uid,
      email: user.email!,
      displayName: fullName,
      role: 'student', // Default role
      createdAt: new Date(),
      updatedAt: new Date()
    };

    await setDoc(doc(db, 'users', user.uid), userProfile);

    return { user, profile: userProfile };
  } catch (error: any) {
    console.error('Error signing up:', error);
    throw new Error(error.message);
  }
};

// Sign in with email and password
export const signIn = async (email: string, password: string) => {
  if (isDemoMode) {
    console.log('🚀 Demo Mode: Using demo authentication');
    return await demoSignIn(email, password);
  }
  
  try {
    const { user } = await signInWithEmailAndPassword(auth, email, password);
    
    // Get user profile from Firestore
    const userDoc = await getDoc(doc(db, 'users', user.uid));
    const profile = userDoc.exists() ? userDoc.data() as UserProfile : null;

    return { user, profile };
  } catch (error: any) {
    console.error('Error signing in:', error);
    throw new Error(error.message);
  }
};

// Sign out
export const signOut = async () => {
  if (isDemoMode) {
    console.log('🚀 Demo Mode: Using demo authentication');
    return await demoSignOut();
  }
  
  try {
    await firebaseSignOut(auth);
  } catch (error: any) {
    console.error('Error signing out:', error);
    throw new Error(error.message);
  }
};

// Google Sign In with automatic popup blocking fallback
export const signInWithGoogle = async () => {
  if (isDemoMode) {
    console.log('🚀 Demo Mode: Social login not available in demo mode');
    throw new Error('🔧 Social login requires Firebase configuration. Please set up your Firebase project first.\n\nSteps:\n1. Visit the Firebase Console\n2. Enable Google Authentication\n3. Add your Firebase config to .env file');
  }
  
  try {
    const provider = new GoogleAuthProvider();
    // Add additional scopes if needed
    provider.addScope('profile');
    provider.addScope('email');
    
    let user: User;
    
    // Try popup first
    try {
      const result = await signInWithPopup(auth, provider);
      user = result.user;
    } catch (popupError: any) {
      if (popupError.code === 'auth/popup-blocked') {
        // Popup was blocked, fall back to redirect
        console.log('Popup blocked, falling back to redirect...');
        await signInWithRedirect(auth, provider);
        return null; // The page will redirect
      }
      throw popupError; // Re-throw other errors
    }
    
    // Check if user profile exists, if not create one
    const userDoc = await getDoc(doc(db, 'users', user.uid));
    let profile: UserProfile;

    if (!userDoc.exists()) {
      profile = {
        uid: user.uid,
        email: user.email!,
        displayName: user.displayName || 'Google User',
        role: 'student',
        createdAt: new Date(),
        updatedAt: new Date()
      };
      await setDoc(doc(db, 'users', user.uid), profile);
    } else {
      profile = userDoc.data() as UserProfile;
    }

    return { user, profile };
  } catch (error: any) {
    console.error('Error signing in with Google:', error);
    
    // Provide specific error messages
    if (error.code === 'auth/popup-closed-by-user') {
      throw new Error('Sign in was cancelled. Please try again.');
    } else if (error.code === 'auth/popup-blocked') {
      throw new Error('Authentication will continue with a page redirect...');
    } else if (error.code === 'auth/unauthorized-domain') {
      throw new Error('This domain is not authorized for Google sign-in. Please contact support.');
    }
    
    throw new Error(error.message || 'Failed to sign in with Google. Please try again.');
  }
};

// Handle redirect result (important for redirect-based authentication)
export const handleRedirectResult = async () => {
  try {
    const result = await getRedirectResult(auth);
    if (result && result.user) {
      // Check if user profile exists, if not create one
      const userDoc = await getDoc(doc(db, 'users', result.user.uid));
      let profile: UserProfile;

      if (!userDoc.exists()) {
        profile = {
          uid: result.user.uid,
          email: result.user.email!,
          displayName: result.user.displayName || 'User',
          role: 'student',
          createdAt: new Date(),
          updatedAt: new Date()
        };
        await setDoc(doc(db, 'users', result.user.uid), profile);
      } else {
        profile = userDoc.data() as UserProfile;
      }

      return { user: result.user, profile };
    }
    return null;
  } catch (error: any) {
    console.error('Error handling redirect result:', error);
    throw new Error(error.message || 'Failed to complete sign in. Please try again.');
  }
};

// Facebook Sign In
export const signInWithFacebook = async () => {
  if (isDemoMode) {
    console.log('🚀 Demo Mode: Social login not available in demo mode');
    throw new Error('Social login is not available in demo mode. Please use email/password or configure Firebase.');
  }
  
  try {
    const provider = new FacebookAuthProvider();
    const { user } = await signInWithPopup(auth, provider);
    
    // Check if user profile exists, if not create one
    const userDoc = await getDoc(doc(db, 'users', user.uid));
    let profile: UserProfile;

    if (!userDoc.exists()) {
      profile = {
        uid: user.uid,
        email: user.email!,
        displayName: user.displayName!,
        role: 'student',
        createdAt: new Date(),
        updatedAt: new Date()
      };
      await setDoc(doc(db, 'users', user.uid), profile);
    } else {
      profile = userDoc.data() as UserProfile;
    }

    return { user, profile };
  } catch (error: any) {
    console.error('Error signing in with Facebook:', error);
    throw new Error(error.message);
  }
};

// Twitter Sign In
export const signInWithTwitter = async () => {
  if (isDemoMode) {
    console.log('🚀 Demo Mode: Social login not available in demo mode');
    throw new Error('🔧 Social login requires Firebase configuration. Please set up your Firebase project first.\n\nSteps:\n1. Visit the Firebase Console\n2. Enable Twitter Authentication\n3. Add your Firebase config to .env file');
  }
  
  try {
    const provider = new TwitterAuthProvider();
    const { user } = await signInWithPopup(auth, provider);
    
    // Check if user profile exists, if not create one
    const userDoc = await getDoc(doc(db, 'users', user.uid));
    let profile: UserProfile;

    if (!userDoc.exists()) {
      profile = {
        uid: user.uid,
        email: user.email || `${user.uid}@twitter.local`, // Twitter might not provide email
        displayName: user.displayName || 'Twitter User',
        role: 'student',
        createdAt: new Date(),
        updatedAt: new Date()
      };
      await setDoc(doc(db, 'users', user.uid), profile);
    } else {
      profile = userDoc.data() as UserProfile;
    }

    return { user, profile };
  } catch (error: any) {
    console.error('Error signing in with Twitter:', error);
    
    // Provide specific error messages
    if (error.code === 'auth/popup-closed-by-user') {
      throw new Error('Sign in was cancelled. Please try again.');
    } else if (error.code === 'auth/popup-blocked') {
      throw new Error('Popup was blocked by your browser. Please allow popups and try again.');
    } else if (error.code === 'auth/unauthorized-domain') {
      throw new Error('This domain is not authorized for Twitter sign-in. Please contact support.');
    }
    
    throw new Error(error.message || 'Failed to sign in with Twitter. Please try again.');
  }
};

// Auth state listener
export const onAuthStateChange = (callback: (user: User | DemoUser | null) => void) => {
  if (isDemoMode) {
    return demoOnAuthStateChange(callback as (user: DemoUser | null) => void);
  }
  return onAuthStateChanged(auth, callback as (user: User | null) => void);
};

// Get current user
export const getCurrentUser = () => {
  if (isDemoMode) {
    return demoGetCurrentUser();
  }
  return auth.currentUser;
};

// Get user profile from Firestore
export const getUserProfile = async (uid: string): Promise<UserProfile | null> => {
  if (isDemoMode) {
    return await demoGetUserProfile(uid);
  }
  
  try {
    const userDoc = await getDoc(doc(db, 'users', uid));
    return userDoc.exists() ? userDoc.data() as UserProfile : null;
  } catch (error) {
    console.error('Error getting user profile:', error);
    return null;
  }
};

// Delete user account
export const deleteUserAccount = async () => {
  if (isDemoMode) {
    console.log('🚀 Demo Mode: Account deletion simulation');
    // In demo mode, just sign out the user
    await demoSignOut();
    return;
  }
  
  try {
    const user = auth.currentUser;
    if (!user) {
      throw new Error('No user is currently signed in');
    }

    // Delete user profile from Firestore first
    try {
      await setDoc(doc(db, 'users', user.uid), {}, { merge: false });
      console.log('User profile deleted from Firestore');
    } catch (firestoreError) {
      console.warn('Could not delete user profile from Firestore:', firestoreError);
      // Continue with account deletion even if Firestore deletion fails
    }

    // Delete the Firebase Auth user account
    await user.delete();
    
    console.log('User account deleted successfully');
  } catch (error: any) {
    console.error('Error deleting user account:', error);
    
    // Provide specific error messages
    if (error.code === 'auth/requires-recent-login') {
      throw new Error('For security reasons, please log out and log back in before deleting your account.');
    } else if (error.code === 'auth/user-not-found') {
      throw new Error('User account not found.');
    }
    
    throw new Error(error.message || 'Failed to delete account. Please try again.');
  }
};
