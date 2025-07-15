// Test Google OAuth configuration
const { initializeApp } = require('firebase/app');
const { getAuth, GoogleAuthProvider } = require('firebase/auth');

// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyD05R5TMWg9QcWqkEVZnw-STsZgzY_Xe9k",
  authDomain: "last-35eb7.firebaseapp.com",
  projectId: "last-35eb7",
  storageBucket: "last-35eb7.firebasestorage.app",
  messagingSenderId: "760347188535",
  appId: "1:760347188535:web:7b0a5b17d87aa38b430eb2"
};

try {
  // Initialize Firebase
  const app = initializeApp(firebaseConfig);
  const auth = getAuth(app);
  
  // Create Google provider
  const provider = new GoogleAuthProvider();
  
  console.log('✅ Firebase initialized successfully');
  console.log('✅ Google Auth Provider created successfully');
  console.log('📧 Auth Domain:', firebaseConfig.authDomain);
  console.log('🔑 Project ID:', firebaseConfig.projectId);
  console.log('🌐 Auth Domain URL:', `https://${firebaseConfig.authDomain}`);
  
  console.log('\n📋 Next Steps:');
  console.log('1. Go to Firebase Console -> Authentication -> Sign-in method');
  console.log('2. Enable Google provider');
  console.log('3. Add authorized domains for your Codespace');
  console.log('4. Test Google sign-in in your application');
  
} catch (error) {
  console.error('❌ Firebase initialization failed:', error.message);
}
