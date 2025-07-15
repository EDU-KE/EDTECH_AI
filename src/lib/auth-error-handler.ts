// Firebase Auth Error Handler
// Provides user-friendly error messages for Firebase authentication errors

export interface AuthError {
  title: string;
  message: string;
  type: 'error' | 'warning' | 'info';
  action?: string;
}

export const getAuthErrorMessage = (errorCode: string): AuthError => {
  switch (errorCode) {
    // Email/Password Authentication Errors
    case 'auth/invalid-credential':
      return {
        title: '🔐 Invalid Credentials',
        message: 'The email or password you entered is incorrect. Please check your credentials and try again.',
        type: 'error',
        action: 'Double-check your email and password'
      };

    case 'auth/user-not-found':
      return {
        title: '👤 Account Not Found',
        message: 'No account found with this email address. Would you like to create a new account?',
        type: 'warning',
        action: 'Try signing up instead'
      };

    case 'auth/wrong-password':
      return {
        title: '🔑 Incorrect Password',
        message: 'The password you entered is incorrect. Please try again or reset your password.',
        type: 'error',
        action: 'Try again or reset password'
      };

    case 'auth/invalid-email':
      return {
        title: '📧 Invalid Email',
        message: 'Please enter a valid email address.',
        type: 'error',
        action: 'Check email format'
      };

    case 'auth/user-disabled':
      return {
        title: '🚫 Account Disabled',
        message: 'This account has been disabled. Please contact support for assistance.',
        type: 'error',
        action: 'Contact support'
      };

    case 'auth/too-many-requests':
      return {
        title: '⏰ Too Many Attempts',
        message: 'Too many failed sign-in attempts. Please wait a few minutes before trying again.',
        type: 'warning',
        action: 'Wait and try again later'
      };

    // Google OAuth Errors
    case 'auth/popup-closed-by-user':
      return {
        title: '❌ Sign-in Cancelled',
        message: 'Google sign-in was cancelled. Please try again if you want to sign in.',
        type: 'info',
        action: 'Try again'
      };

    case 'auth/popup-blocked':
      return {
        title: '🚫 Popup Blocked',
        message: 'Your browser blocked the sign-in popup. We\'ll redirect you instead.',
        type: 'info',
        action: 'Allow popups or wait for redirect'
      };

    case 'auth/unauthorized-domain':
      return {
        title: '🌐 Domain Not Authorized',
        message: 'This domain is not authorized for Google sign-in. Please contact support.',
        type: 'error',
        action: 'Contact support'
      };

    case 'auth/internal-error':
      return {
        title: '⚙️ Google OAuth Not Configured',
        message: 'Google sign-in is not properly configured in Firebase. Please enable Google authentication in the Firebase Console.',
        type: 'error',
        action: 'Configure Google OAuth in Firebase Console'
      };

    case 'auth/oauth-not-configured':
      return {
        title: '⚙️ Google OAuth Setup Required',
        message: 'Google sign-in needs to be enabled in Firebase. Please configure OAuth 2.0 in the Firebase Console.',
        type: 'error',
        action: 'Enable Google authentication in Firebase'
      };

    // Account Creation Errors
    case 'auth/email-already-in-use':
      return {
        title: '📧 Email Already Registered',
        message: 'An account with this email already exists. Try signing in instead.',
        type: 'warning',
        action: 'Sign in instead'
      };

    case 'auth/weak-password':
      return {
        title: '🔐 Weak Password',
        message: 'Password should be at least 6 characters long with a mix of letters and numbers.',
        type: 'warning',
        action: 'Choose a stronger password'
      };

    // Network and General Errors
    case 'auth/network-request-failed':
      return {
        title: '🌐 Connection Error',
        message: 'Unable to connect to authentication service. Please check your internet connection.',
        type: 'error',
        action: 'Check internet connection'
      };

    case 'auth/operation-not-allowed':
      return {
        title: '🚫 Operation Not Allowed',
        message: 'This sign-in method is not enabled. Please contact support.',
        type: 'error',
        action: 'Contact support'
      };

    // Default case for unknown errors
    default:
      return {
        title: '❓ Authentication Error',
        message: 'An unexpected error occurred during sign-in. Please try again.',
        type: 'error',
        action: 'Try again'
      };
  }
};

// Helper function to extract error code from Firebase error
export const getFirebaseErrorCode = (error: any): string => {
  if (error?.code) {
    return error.code;
  }
  
  // Try to extract error code from error message
  const message = error?.message || '';
  const codeMatch = message.match(/\(([^)]+)\)/);
  return codeMatch ? codeMatch[1] : 'unknown-error';
};
