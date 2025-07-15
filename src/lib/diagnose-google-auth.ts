import { GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
import { auth } from './firebase';

// Test function to diagnose the auth/internal-error
export const diagnoseGoogleAuthError = async () => {
  console.log('🔍 DIAGNOSING GOOGLE AUTH ERROR');
  console.log('================================');
  
  try {
    // Check Firebase configuration
    console.log('1. 🔧 Firebase Configuration:');
    console.log('   - Auth Domain:', process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN);
    console.log('   - Project ID:', process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID);
    console.log('   - API Key:', process.env.NEXT_PUBLIC_FIREBASE_API_KEY?.substring(0, 20) + '...');
    
    // Check Firebase auth instance
    console.log('\n2. 🔥 Firebase Auth Instance:');
    console.log('   - Auth instance:', auth);
    console.log('   - Auth app:', auth.app);
    console.log('   - Auth config:', auth.config);
    
    // Check Google provider
    console.log('\n3. 🔍 Google Provider Setup:');
    const provider = new GoogleAuthProvider();
    provider.addScope('email');
    provider.addScope('profile');
    provider.setCustomParameters({
      prompt: 'select_account'
    });
    
    console.log('   - Provider:', provider);
    console.log('   - Provider ID:', provider.providerId);
    console.log('   - Custom Parameters: set via setCustomParameters()');
    
    // Try to initiate sign-in to see where it fails
    console.log('\n4. 🚀 Testing Google Sign-In:');
    console.log('   - Attempting signInWithPopup...');
    
    const result = await signInWithPopup(auth, provider);
    
    console.log('✅ SUCCESS! Google sign-in worked:');
    console.log('   - User:', result.user);
    console.log('   - Email:', result.user.email);
    
    return {
      success: true,
      user: result.user,
      message: 'Google authentication successful!'
    };
    
  } catch (error: any) {
    console.error('❌ GOOGLE AUTH ERROR DETAILS:');
    console.error('   - Error Code:', error.code);
    console.error('   - Error Message:', error.message);
    console.error('   - Full Error:', error);
    
    // Detailed error analysis
    console.log('\n🔍 ERROR ANALYSIS:');
    
    if (error.code === 'auth/internal-error') {
      console.log('🚨 auth/internal-error DETECTED:');
      console.log('   This typically means one of:');
      console.log('   1. Google OAuth client not configured in Google Cloud Console');
      console.log('   2. Firebase Google provider not enabled');
      console.log('   3. Client ID mismatch between Google Cloud and Firebase');
      console.log('   4. Auth domain mismatch in OAuth configuration');
      console.log('   5. Missing required APIs in Google Cloud Console');
      
      // Check specific configuration issues
      console.log('\n🔧 CONFIGURATION CHECKS:');
      console.log('   - Firebase Auth Domain:', process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN);
      console.log('   - Expected OAuth redirect:', `https://${process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN}/__/auth/handler`);
      console.log('   - Current location:', window.location.origin);
      
      // Check if we're in the right environment
      if (process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN !== 'last-35eb7.firebaseapp.com') {
        console.log('   ⚠️  Auth domain mismatch detected!');
        console.log('   Expected: last-35eb7.firebaseapp.com');
        console.log('   Current:', process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN);
      }
      
    } else {
      console.log('   Other Google Auth Error:', error.code);
    }
    
    return {
      success: false,
      error: error.code,
      message: error.message,
      details: error
    };
  }
};

// Test function for browser console
if (typeof window !== 'undefined') {
  (window as any).diagnoseGoogleAuthError = diagnoseGoogleAuthError;
  console.log('🔧 Diagnosis function available: diagnoseGoogleAuthError()');
}
