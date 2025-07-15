// Simple Google Auth Test
import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider } from 'firebase/auth';

// Test configuration
const firebaseConfig = {
  apiKey: "AIzaSyD05R5TMWg9QcWqkEVZnw-STsZgzY_Xe9k",
  authDomain: "last-35eb7.firebaseapp.com",
  projectId: "last-35eb7",
  storageBucket: "last-35eb7.firebasestorage.app",
  messagingSenderId: "760347188535",
  appId: "1:760347188535:web:7b0a5b17d87aa38b430eb2"
};

console.log('🔍 Testing Google Auth Setup...');

try {
  // Initialize Firebase
  const app = initializeApp(firebaseConfig);
  console.log('✅ Firebase initialized');
  
  // Get auth instance
  const auth = getAuth(app);
  console.log('✅ Auth instance created');
  
  // Create Google provider
  const provider = new GoogleAuthProvider();
  console.log('✅ Google Provider created');
  
  // Test provider configuration
  provider.addScope('email');
  provider.addScope('profile');
  console.log('✅ Provider scopes added');
  
  console.log('\n📊 Configuration Status:');
  console.log('- Firebase App:', !!app);
  console.log('- Auth Instance:', !!auth);
  console.log('- Google Provider:', !!provider);
  console.log('- Provider ID:', provider.providerId);
  
  console.log('\n🔧 The issue is likely:');
  console.log('1. Google OAuth NOT enabled in Firebase Console');
  console.log('2. Domain not authorized in Firebase Console');
  console.log('3. Missing support email in Firebase Console');
  
  console.log('\n🛠️ To fix:');
  console.log('1. Go to: https://console.firebase.google.com/project/last-35eb7/authentication/providers');
  console.log('2. Find Google provider and click it');
  console.log('3. Toggle Enable to ON');
  console.log('4. Add support email');
  console.log('5. Click Save');
  
} catch (error) {
  console.error('❌ Setup failed:', error);
}

export {};
