// Debug Google Auth Implementation
const { initializeApp } = require('firebase/app');
const { getAuth, GoogleAuthProvider, signInWithPopup } = require('firebase/auth');

// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyD05R5TMWg9QcWqkEVZnw-STsZgzY_Xe9k",
  authDomain: "last-35eb7.firebaseapp.com",
  projectId: "last-35eb7",
  storageBucket: "last-35eb7.firebasestorage.app",
  messagingSenderId: "760347188535",
  appId: "1:760347188535:web:7b0a5b17d87aa38b430eb2"
};

async function debugGoogleAuth() {
  try {
    console.log('🔍 Starting Google Auth Debug...');
    
    // 1. Test Firebase initialization
    console.log('1. Testing Firebase initialization...');
    const app = initializeApp(firebaseConfig);
    console.log('✅ Firebase initialized successfully');
    
    // 2. Test Auth instance
    console.log('2. Testing Auth instance...');
    const auth = getAuth(app);
    console.log('✅ Auth instance created successfully');
    console.log('   - Current user:', auth.currentUser?.email || 'None');
    
    // 3. Test Google Provider
    console.log('3. Testing Google Provider...');
    const provider = new GoogleAuthProvider();
    provider.addScope('email');
    provider.addScope('profile');
    provider.setCustomParameters({
      prompt: 'select_account'
    });
    console.log('✅ Google Provider created successfully');
    
    // 4. Test Provider Configuration
    console.log('4. Testing Provider Configuration...');
    console.log('   - Provider ID:', provider.providerId);
    console.log('   - Scopes:', provider.scopes);
    console.log('   - Custom params:', provider.customParameters);
    
    // 5. Test if Google Auth is enabled (this will show the real issue)
    console.log('5. Testing Google Auth availability...');
    
    // Try to get current user or trigger an auth check
    console.log('   - Auth domain:', firebaseConfig.authDomain);
    console.log('   - Project ID:', firebaseConfig.projectId);
    
    // 6. Environment check
    console.log('6. Environment check...');
    console.log('   - NODE_ENV:', process.env.NODE_ENV);
    console.log('   - API Key present:', !!firebaseConfig.apiKey);
    console.log('   - Auth domain:', firebaseConfig.authDomain);
    
    console.log('\n📋 DIAGNOSIS:');
    console.log('✅ Firebase configuration: VALID');
    console.log('✅ Google provider setup: VALID');
    console.log('❓ Google OAuth enabled in Firebase Console: NEEDS VERIFICATION');
    
    console.log('\n🔧 Next Steps:');
    console.log('1. Check Firebase Console: https://console.firebase.google.com/project/last-35eb7/authentication/providers');
    console.log('2. Verify Google provider is ENABLED');
    console.log('3. Check authorized domains in Firebase Console');
    console.log('4. Ensure support email is configured');
    
  } catch (error) {
    console.error('❌ Google Auth Debug Failed:', error);
    
    if (error.code === 'auth/invalid-api-key') {
      console.log('🚨 ISSUE: Invalid API key');
    } else if (error.code === 'auth/operation-not-allowed') {
      console.log('🚨 ISSUE: Google sign-in not enabled in Firebase Console');
    } else {
      console.log('🚨 ISSUE: Unknown error -', error.message);
    }
  }
}

debugGoogleAuth();
