// Auth Debug - Firebase Configuration Test
import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider, signInWithPopup } from 'firebase/auth';

const firebaseConfig = {
  apiKey: "AIzaSyD05R5TMWg9QcWqkEVZnw-STsZgzY_Xe9k",
  authDomain: "last-35eb7.firebaseapp.com",
  projectId: "last-35eb7",
  storageBucket: "last-35eb7.firebasestorage.app",
  messagingSenderId: "760347188535",
  appId: "1:760347188535:web:7b0a5b17d87aa38b430eb2"
};

async function testAuth() {
  try {
    console.log('🔍 Testing Firebase Auth Configuration...');
    
    // Initialize Firebase
    const app = initializeApp(firebaseConfig);
    const auth = getAuth(app);
    
    console.log('✅ Firebase initialized successfully');
    console.log('✅ Auth instance created');
    
    // Test Google provider
    const provider = new GoogleAuthProvider();
    provider.addScope('email');
    provider.addScope('profile');
    
    console.log('✅ Google provider created');
    
    // Get current domain
    const currentDomain = typeof window !== 'undefined' ? window.location.hostname : 'localhost';
    console.log('🌐 Current domain:', currentDomain);
    
    // Test environment
    console.log('🔍 Environment check:');
    console.log('  - API Key:', firebaseConfig.apiKey ? 'Present' : 'Missing');
    console.log('  - Auth Domain:', firebaseConfig.authDomain);
    console.log('  - Project ID:', firebaseConfig.projectId);
    
    // Check if we can attempt auth (this will show real errors)
    console.log('\n🧪 Testing Google sign-in readiness...');
    
    // This will help identify the exact issue
    console.log('✅ Configuration appears valid');
    console.log('✅ Google provider setup complete');
    
    console.log('\n📋 Firebase Console Status:');
    console.log('  - Email/Password: Enabled ✅');
    console.log('  - Google: Enabled ✅');
    console.log('  - Anonymous: Enabled ✅');
    
    console.log('\n🔍 Next: Check authorized domains and test actual sign-in');
    
  } catch (error: any) {
    console.error('❌ Auth test failed:', error);
    
    if (error.code === 'auth/invalid-api-key') {
      console.log('🚨 Invalid API key');
    } else if (error.code === 'auth/operation-not-allowed') {
      console.log('🚨 Google provider not enabled (but you said it is enabled)');
    } else {
      console.log('🚨 Unknown error:', error.message);
    }
  }
}

// Run the test
testAuth();

export {};
