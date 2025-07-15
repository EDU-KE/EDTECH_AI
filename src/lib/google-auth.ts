import { 
  GoogleAuthProvider, 
  signInWithPopup, 
  signInWithRedirect, 
  getRedirectResult,
  Auth
} from 'firebase/auth';
import { doc, setDoc, getDoc, serverTimestamp } from 'firebase/firestore';
import { auth, db, isDemoMode } from './firebase';
import { handleFirebaseAuthError } from './firebase-auth-fix';

export interface GoogleSignInResult {
  user: {
    uid: string;
    email: string;
    displayName: string;
    photoURL?: string;
  };
  profile: {
    uid: string;
    email: string;
    displayName: string;
    photoURL?: string;
    role: 'student' | 'teacher';
    provider: 'google';
    createdAt: Date;
    lastLogin: Date;
  };
  isNewUser: boolean;
}

class GoogleAuthService {
  private provider: GoogleAuthProvider;
  
  constructor() {
    this.provider = new GoogleAuthProvider();
    this.setupProvider();
  }

  private setupProvider() {
    // Configure Google provider
    this.provider.addScope('email');
    this.provider.addScope('profile');
    
    // Force account selection every time
    this.provider.setCustomParameters({
      prompt: 'select_account'
    });
  }

  /**
   * Sign in with Google using popup method
   */
  async signInWithPopup(): Promise<GoogleSignInResult> {
    if (isDemoMode) {
      throw new Error('Google sign-in is not available in demo mode. Please configure Firebase.');
    }

    try {
      console.log('🔄 Starting Google sign-in with popup...');
      
      const result = await signInWithPopup(auth, this.provider);
      const { user } = result;
      
      console.log('✅ Google popup sign-in successful:', user.email);
      
      return await this.processGoogleUser(user);
      
    } catch (error: any) {
      console.error('❌ Google popup sign-in failed:', error);
      
      // Handle specific popup errors
      if (error.code === 'auth/popup-blocked') {
        console.log('🔄 Popup blocked, falling back to redirect...');
        await this.signInWithRedirect();
        throw new Error('Popup was blocked. Redirecting to Google sign-in...');
      }
      
      throw this.handleGoogleAuthError(error);
    }
  }

  /**
   * Sign in with Google using redirect method
   */
  async signInWithRedirect(): Promise<void> {
    if (isDemoMode) {
      throw new Error('Google sign-in is not available in demo mode. Please configure Firebase.');
    }

    try {
      console.log('🔄 Starting Google sign-in with redirect...');
      await signInWithRedirect(auth, this.provider);
    } catch (error: any) {
      console.error('❌ Google redirect sign-in failed:', error);
      throw this.handleGoogleAuthError(error);
    }
  }

  /**
   * Handle redirect result after user returns from Google
   */
  async handleRedirectResult(): Promise<GoogleSignInResult | null> {
    if (isDemoMode) {
      return null;
    }

    try {
      console.log('🔄 Checking for redirect result...');
      
      const result = await getRedirectResult(auth);
      
      if (!result) {
        console.log('ℹ️ No redirect result found');
        return null;
      }
      
      console.log('✅ Google redirect sign-in successful:', result.user.email);
      
      return await this.processGoogleUser(result.user);
      
    } catch (error: any) {
      console.error('❌ Google redirect result failed:', error);
      throw this.handleGoogleAuthError(error);
    }
  }

  /**
   * Process Google user and create/update profile
   */
  private async processGoogleUser(user: any): Promise<GoogleSignInResult> {
    try {
      const userRef = doc(db, 'users', user.uid);
      const userDoc = await getDoc(userRef);
      
      const isNewUser = !userDoc.exists();
      
      const userProfile = {
        uid: user.uid,
        email: user.email,
        displayName: user.displayName || 'Google User',
        photoURL: user.photoURL || undefined,
        provider: 'google' as const,
        role: (userDoc.exists() ? userDoc.data()?.role : 'student') as 'student' | 'teacher',
        createdAt: isNewUser ? new Date() : userDoc.data()?.createdAt?.toDate() || new Date(),
        lastLogin: new Date(),
        updatedAt: new Date()
      };

      // Save/update user profile in Firestore
      await setDoc(userRef, {
        ...userProfile,
        createdAt: isNewUser ? serverTimestamp() : userDoc.data()?.createdAt,
        lastLogin: serverTimestamp(),
        updatedAt: serverTimestamp()
      }, { merge: true });

      console.log('✅ User profile saved/updated:', userProfile.email);

      return {
        user: {
          uid: user.uid,
          email: user.email,
          displayName: user.displayName || 'Google User',
          photoURL: user.photoURL
        },
        profile: userProfile,
        isNewUser
      };

    } catch (error: any) {
      console.error('❌ Failed to process Google user:', error);
      throw new Error(`Failed to save user profile: ${error.message}`);
    }
  }

  /**
   * Handle Google authentication errors with detailed guidance
   */
  private handleGoogleAuthError(error: any): Error {
    const errorCode = error.code;
    let message = 'Google sign-in failed. Please try again.';
    let title = 'Google Sign-in Error';
    let actionRequired = '';

    console.error('🚨 Google Auth Error Details:', {
      code: errorCode,
      message: error.message,
      stack: error.stack
    });

    // Use the enhanced error handler
    handleFirebaseAuthError(error);

    switch (errorCode) {
      case 'auth/popup-closed-by-user':
        title = 'Sign-in Cancelled';
        message = 'Sign-in was cancelled. Please try again if you want to continue.';
        actionRequired = 'Click the Google sign-in button again';
        break;
        
      case 'auth/popup-blocked':
        title = 'Popup Blocked';
        message = 'Popup was blocked by your browser. Please allow popups for this site or we\'ll redirect you instead.';
        actionRequired = 'Allow popups in browser settings';
        break;
        
      case 'auth/unauthorized-domain':
        title = 'Domain Not Authorized';
        message = `This domain is not authorized for Google sign-in. Please add your domain to Firebase Console.`;
        actionRequired = `Add domain to Firebase Console: https://console.firebase.google.com/project/last-35eb7/authentication/settings`;
        break;
        
      case 'auth/internal-error':
        title = '🔧 Firebase Auth Internal Error';
        message = `Firebase authentication encountered an internal error. This is commonly caused by:
        
1. Network connectivity issues
2. Firebase JavaScript loading problems
3. Browser security restrictions
4. Missing authorized domains in Firebase Console

📋 To fix this:
1. Check your internet connection
2. Verify authorized domains in Firebase Console
3. Try refreshing the page
4. Check browser console for detailed error messages
5. Ensure all required domains are added to Firebase Console

Current domain: ${window.location.hostname}
Required domains: localhost, 127.0.0.1, *.githubpreview.dev
6. Refresh this page and try again

This is a one-time setup that takes about 2 minutes.`;
        actionRequired = 'Enable Google provider in Firebase Console';
        break;
        
      case 'auth/operation-not-allowed':
        title = 'Google Sign-in Disabled';
        message = 'Google sign-in is not enabled for this project. Please enable it in Firebase Console.';
        actionRequired = 'Enable Google authentication in Firebase Console';
        break;
        
      case 'auth/account-exists-with-different-credential':
        title = 'Account Exists';
        message = 'An account already exists with this email using a different sign-in method. Please try signing in with email/password.';
        actionRequired = 'Try email/password sign-in instead';
        break;
        
      case 'auth/network-request-failed':
        title = 'Network Error';
        message = 'Network error occurred. Please check your internet connection and try again.';
        actionRequired = 'Check internet connection and retry';
        break;
        
      default:
        // Handle unknown errors with more context
        if (error.message?.includes('Google')) {
          title = 'Google Configuration Error';
          message = `Google sign-in configuration issue: ${error.message}`;
          actionRequired = 'Check Firebase Console Google provider settings';
        } else {
          title = 'Authentication Error';
          message = `Google sign-in error: ${error.message || 'Unknown error occurred'}`;
          actionRequired = 'Try again or contact support';
        }
    }

    const enhancedError = new Error(message);
    (enhancedError as any).code = errorCode;
    (enhancedError as any).title = title;
    (enhancedError as any).actionRequired = actionRequired;
    (enhancedError as any).originalError = error;
    
    return enhancedError;
  }

  /**
   * Check if Google provider is available and configured
   */
  async checkGoogleProviderStatus(): Promise<{
    available: boolean;
    configured: boolean;
    error?: string;
  }> {
    if (isDemoMode) {
      return {
        available: false,
        configured: false,
        error: 'Demo mode - Firebase not configured'
      };
    }

    try {
      // Try to create a provider instance
      const testProvider = new GoogleAuthProvider();
      
      return {
        available: true,
        configured: true
      };
      
    } catch (error: any) {
      return {
        available: false,
        configured: false,
        error: error.message
      };
    }
  }
}

// Create singleton instance
export const googleAuthService = new GoogleAuthService();

// Export convenience functions
export const signInWithGoogle = () => googleAuthService.signInWithPopup();
export const signInWithGoogleRedirect = () => googleAuthService.signInWithRedirect();
export const handleGoogleRedirect = () => googleAuthService.handleRedirectResult();
export const checkGoogleStatus = () => googleAuthService.checkGoogleProviderStatus();
