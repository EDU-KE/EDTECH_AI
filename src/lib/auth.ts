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
import { getAuthErrorMessage, getFirebaseErrorCode } from './auth-error-handler';
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
  curriculum?: 'CBE' | '8-4-4' | 'IGCSE';
  curriculumSelected: boolean;
  gradeLevel?: string;
  createdAt: Date;
  updatedAt: Date;
}

// Helper function to remove undefined values from objects (Firestore doesn't accept undefined)
const cleanObject = <T extends Record<string, any>>(obj: T): Partial<T> => {
  const cleaned: Partial<T> = {};
  for (const [key, value] of Object.entries(obj)) {
    if (value !== undefined) {
      cleaned[key as keyof T] = value;
    }
  }
  return cleaned;
};

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
      curriculumSelected: false,
      createdAt: new Date(),
      updatedAt: new Date()
    };

    await setDoc(doc(db, 'users', user.uid), userProfile);

    return { user, profile: userProfile };
  } catch (error: any) {
    console.error('Error signing up:', error);
    
    const errorCode = getFirebaseErrorCode(error);
    const authError = getAuthErrorMessage(errorCode);
    
    // Create a structured error with user-friendly message
    const enhancedError = new Error(authError.message);
    (enhancedError as any).title = authError.title;
    (enhancedError as any).type = authError.type;
    (enhancedError as any).action = authError.action;
    (enhancedError as any).code = errorCode;
    
    throw enhancedError;
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
    
    const errorCode = getFirebaseErrorCode(error);
    const authError = getAuthErrorMessage(errorCode);
    
    // Create a structured error with user-friendly message
    const enhancedError = new Error(authError.message);
    (enhancedError as any).title = authError.title;
    (enhancedError as any).type = authError.type;
    (enhancedError as any).action = authError.action;
    (enhancedError as any).code = errorCode;
    
    throw enhancedError;
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

// Google Sign In with account selection and default Google page
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
    
    // Configure provider to use default Google sign-in page with account selection
    provider.setCustomParameters({
      prompt: 'select_account', // Forces account selection every time
      // hd: 'yourdomain.com', // Uncomment and set domain if you want to restrict to specific domain
    });
    
    let user: User;
    
    // Try popup first
    try {
      const result = await signInWithPopup(auth, provider);
      user = result.user;
    } catch (popupError: any) {
      if (popupError.code === 'auth/popup-blocked') {
        // Popup was blocked, fall back to redirect
        console.log('Popup blocked, falling back to redirect...');
        // Configure provider for redirect with same settings
        const redirectProvider = new GoogleAuthProvider();
        redirectProvider.addScope('profile');
        redirectProvider.addScope('email');
        redirectProvider.setCustomParameters({
          prompt: 'select_account',
        });
        await signInWithRedirect(auth, redirectProvider);
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
        curriculumSelected: false,
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
    console.error('Error code:', error.code);
    console.error('Error message:', error.message);
    
    // Handle specific Google OAuth errors
    if (error.code === 'auth/unauthorized-domain') {
      const currentDomain = window.location.hostname;
      const enhancedError = new Error(
        `🔧 Domain Authorization Required\n\n` +
        `The domain '${currentDomain}' is not authorized for Google sign-in.\n\n` +
        `To fix this:\n` +
        `1. Go to Firebase Console → Authentication → Settings → Authorized domains\n` +
        `2. Add '${currentDomain}' to the authorized domains list\n` +
        `3. For local development, make sure 'localhost' is in the list\n` +
        `4. For Codespaces, add your codespace domain\n\n` +
        `If you're in demo mode, you can use email/password authentication instead.`
      );
      (enhancedError as any).title = 'Domain Not Authorized';
      (enhancedError as any).type = 'configuration';
      (enhancedError as any).action = 'Configure Firebase authorized domains';
      (enhancedError as any).code = 'auth/unauthorized-domain';
      throw enhancedError;
    }
    
    if (error.code === 'auth/popup-closed-by-user') {
      throw new Error('Sign in was cancelled. Please try again.');
    }
    
    if (error.code === 'auth/popup-blocked') {
      throw new Error('Popup was blocked by your browser. Please allow popups and try again.');
    }
    
    // Handle other errors using the existing error handler
    const errorCode = getFirebaseErrorCode(error);
    const authError = getAuthErrorMessage(errorCode);
    
    // Create a structured error with user-friendly message
    const enhancedError = new Error(authError.message);
    (enhancedError as any).title = authError.title;
    (enhancedError as any).type = authError.type;
    (enhancedError as any).action = authError.action;
    (enhancedError as any).code = errorCode;
    
    throw enhancedError;
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
          curriculumSelected: false,
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
        curriculumSelected: false,
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
        curriculumSelected: false,
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

// Update user curriculum
export const updateUserCurriculum = async (curriculum: 'CBE' | '8-4-4' | 'IGCSE', gradeLevel?: string) => {
  if (isDemoMode) {
    console.log('🚀 Demo Mode: Curriculum update simulation');
    return;
  }
  
  try {
    const user = auth.currentUser;
    if (!user) {
      throw new Error('No user is currently signed in');
    }

    const updateData: Partial<UserProfile> = {
      curriculum,
      curriculumSelected: true,
      updatedAt: new Date()
    };

    if (gradeLevel) {
      updateData.gradeLevel = gradeLevel;
    }

    // Clean undefined values before saving to Firestore
    const cleanedData = cleanObject(updateData);
    await setDoc(doc(db, 'users', user.uid), cleanedData, { merge: true });
    
    console.log('User curriculum updated successfully');
  } catch (error: any) {
    console.error('Error updating user curriculum:', error);
    throw new Error(error.message || 'Failed to update curriculum. Please try again.');
  }
};

// Check if user needs curriculum selection
export const needsCurriculumSelection = (profile: UserProfile | null): boolean => {
  if (!profile) return false;
  return !profile.curriculumSelected || !profile.curriculum;
};

// Get curriculum info
export const getCurriculumInfo = (curriculum: 'CBE' | '8-4-4' | 'IGCSE') => {
  const curriculumData = {
    'CBE': {
      name: 'Competency-Based Education (CBE)',
      description: 'Modern competency-based curriculum focusing on practical skills and real-world applications.',
      grades: ['Pre-Primary 1', 'Pre-Primary 2', 'Grade 1', 'Grade 2', 'Grade 3', 'Grade 4', 'Grade 5', 'Grade 6', 'Junior Secondary 1', 'Junior Secondary 2', 'Junior Secondary 3'],
      subjects: ['English', 'Kiswahili', 'Mathematics', 'Science & Technology', 'Social Studies', 'Creative Arts', 'Physical Education', 'Life Skills'],
      icon: '🎯'
    },
    '8-4-4': {
      name: '8-4-4 System',
      description: 'Traditional Kenyan education system with 8 years primary, 4 years secondary, and 4 years university.',
      grades: ['Standard 1', 'Standard 2', 'Standard 3', 'Standard 4', 'Standard 5', 'Standard 6', 'Standard 7', 'Standard 8', 'Form 1', 'Form 2', 'Form 3', 'Form 4'],
      subjects: ['English', 'Kiswahili', 'Mathematics', 'Science', 'Social Studies', 'Christian Religious Education', 'Art & Craft', 'Music', 'Physical Education'],
      icon: '📚'
    },
    'IGCSE': {
      name: 'International General Certificate of Secondary Education',
      description: 'Internationally recognized qualification for students aged 14-16, preparing for advanced studies.',
      grades: ['Year 9', 'Year 10', 'Year 11', 'AS Level', 'A Level'],
      subjects: ['English Language', 'English Literature', 'Mathematics', 'Physics', 'Chemistry', 'Biology', 'History', 'Geography', 'Economics', 'Business Studies', 'Art & Design'],
      icon: '🌍'
    }
  };
  
  return curriculumData[curriculum];
};
