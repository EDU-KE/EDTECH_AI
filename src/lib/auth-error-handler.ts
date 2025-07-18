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
        title: 'Invalid Login Details',
        message: 'The email or password you entered doesn\'t match our records. Please try again.',
        type: 'error',
        action: 'Check your email and password, then try again'
      };

    case 'auth/user-not-found':
      return {
        title: 'Account Not Found',
        message: 'We couldn\'t find an account with that email. Would you like to create one?',
        type: 'warning',
        action: 'Click here to create an account'
      };

    case 'auth/wrong-password':
      return {
        title: 'Incorrect Password',
        message: 'The password you entered doesn\'t match this account. Need help getting back in?',
        type: 'error',
        action: 'Reset your password'
      };

    case 'auth/invalid-email':
      return {
        title: 'Invalid Email Format',
        message: 'This doesn\'t look like a valid email address. Please check and try again.',
        type: 'error',
        action: 'Check your email address'
      };

    case 'auth/user-disabled':
      return {
        title: 'Account Access Limited',
        message: 'Your account access has been temporarily limited. Please contact our support team for help.',
        type: 'error',
        action: 'Contact Support'
      };

    case 'auth/too-many-requests':
      return {
        title: 'Account Protected',
        message: 'For your security, we\'ve temporarily limited access to this account. Please try again in a few minutes.',
        type: 'warning',
        action: 'Try again later or reset password'
      };

    // Google OAuth Errors
    case 'auth/popup-closed-by-user':
      return {
        title: 'Sign-in Cancelled',
        message: 'You closed the Google sign-in window. Click the Google sign-in button to try again.',
        type: 'info',
        action: 'Click to try again'
      };

    case 'auth/popup-blocked':
      return {
        title: 'Pop-up Blocked',
        message: 'We couldn\'t open the Google sign-in window. We\'ll try a different method.',
        type: 'info',
        action: 'Continue with redirect sign-in'
      };

    case 'auth/unauthorized-domain':
      return {
        title: 'Security Check',
        message: 'For your security, Google sign-in is only available on authorized websites. Please try a different sign-in method.',
        type: 'error',
        action: 'Try another sign-in method'
      };

    case 'auth/internal-error':
      return {
        title: 'Temporary Issue',
        message: 'We\'re having trouble connecting to Google. Please try again in a few moments.',
        type: 'error',
        action: 'Try again later'
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
        title: 'Sign-in Issue',
        message: 'We encountered an unexpected issue while signing you in. Please try again.',
        type: 'error',
        action: 'Try again or contact our support team'
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
