import { GoogleAuthProvider, signInWithPopup, getAuth } from 'firebase/auth';
import app from './firebase';

// Test Google OAuth configuration
export const testGoogleOAuth = async () => {
  try {
    console.log('🔍 Testing Google OAuth Configuration...');
    
    const auth = getAuth(app);
    const provider = new GoogleAuthProvider();
    
    // Add additional scopes if needed
    provider.addScope('profile');
    provider.addScope('email');
    
    // Configure provider settings
    provider.setCustomParameters({
      prompt: 'select_account'
    });
    
    console.log('✅ Google Auth Provider configured successfully');
    console.log('Auth instance:', auth);
    console.log('Provider:', provider);
    
    // Test the popup (this will fail if OAuth is not configured)
    console.log('🚀 Attempting Google sign-in...');
    
    const result = await signInWithPopup(auth, provider);
    
    console.log('✅ Google OAuth SUCCESS!');
    console.log('User:', result.user);
    
    // Get the credential from the result
    const credential = GoogleAuthProvider.credentialFromResult(result);
    console.log('Credential:', credential);
    
    return {
      success: true,
      user: result.user,
      credential: credential
    };
    
  } catch (error: any) {
    console.error('❌ Google OAuth ERROR:', error);
    
    // Detailed error analysis
    if (error.code === 'auth/internal-error') {
      console.error('🚨 INTERNAL ERROR: Google OAuth is not properly configured');
      console.error('This means:');
      console.error('1. OAuth client not created in Google Cloud Console');
      console.error('2. Client ID mismatch between Firebase and Google Cloud Console');
      console.error('3. Missing redirect URIs in OAuth client');
      console.error('4. OAuth consent screen not configured');
      console.error('5. User not added as test user (if app is in Testing mode)');
      console.error('');
      console.error('🔧 Fix: Run ./fix-google-oauth-complete.sh');
    } else if (error.code === 'auth/popup-closed-by-user') {
      console.error('🚨 POPUP CLOSED: User closed the OAuth popup');
    } else if (error.code === 'auth/popup-blocked') {
      console.error('🚨 POPUP BLOCKED: Browser blocked the OAuth popup');
    } else {
      console.error('🚨 UNKNOWN ERROR:', error.code, error.message);
    }
    
    return {
      success: false,
      error: error.code,
      message: error.message
    };
  }
};

// Test function that can be called from browser console
if (typeof window !== 'undefined') {
  (window as any).testGoogleOAuth = testGoogleOAuth;
  console.log('🔧 Google OAuth test function available: testGoogleOAuth()');
}
