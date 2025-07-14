import { initializeApp, getApps } from 'firebase/app';
import { 
  getFirestore, 
  enableIndexedDbPersistence,
  CACHE_SIZE_UNLIMITED,
  initializeFirestore
} from 'firebase/firestore';
import { getAuth } from 'firebase/auth';

// Check if we're in demo mode (no Firebase config provided)
// Use a function to check this dynamically to avoid SSR/client hydration issues
const checkDemoMode = () => {
  if (typeof window === 'undefined') {
    // Server-side: check process.env
    return !process.env.NEXT_PUBLIC_FIREBASE_API_KEY || 
           process.env.NEXT_PUBLIC_FIREBASE_API_KEY === "your_api_key_here";
  } else {
    // Client-side: check if Firebase is properly configured
    try {
      return !process.env.NEXT_PUBLIC_FIREBASE_API_KEY || 
             process.env.NEXT_PUBLIC_FIREBASE_API_KEY === "your_api_key_here";
    } catch {
      return true; // Default to demo mode if there's any error
    }
  }
};

// For backward compatibility, create a constant
const isDemoMode = checkDemoMode();

// Firebase configuration object
const firebaseConfig = {
  // Your Firebase config object goes here
  // This should be loaded from environment variables in production
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY || "demo-api-key",
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN || "demo-project.firebaseapp.com",
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || "demo-project",
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET || "demo-project.appspot.com",
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || "123456789",
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID || "1:123456789:web:abcdef",
};

// Initialize Firebase
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];

// Initialize Firestore with optimized settings
const db = initializeFirestore(app, {
  cacheSizeBytes: CACHE_SIZE_UNLIMITED,
  experimentalForceLongPolling: false, // Use WebSocket for better real-time performance
});

// Initialize Auth
const auth = getAuth(app);

// NOTE: Emulator connections removed to use real Firebase
// If you want to use emulators again, uncomment the section below:
//
// if (process.env.NODE_ENV === 'development' && typeof window !== 'undefined' && !isDemoMode) {
//   try {
//     connectFirestoreEmulator(db, 'localhost', 8080);
//     connectAuthEmulator(auth, 'http://localhost:9099');
//   } catch (error) {
//     console.log('Emulator connection error (might already be connected):', error);
//   }
// }

// Enable offline persistence for better performance
if (typeof window !== 'undefined' && !isDemoMode) {
  enableIndexedDbPersistence(db).catch((err) => {
    if (err.code === 'failed-precondition') {
      console.log('Multiple tabs open, persistence can only be enabled in one tab at a time.');
    } else if (err.code === 'unimplemented') {
      console.log('The current browser does not support persistence.');
    }
  });
}

// Log Firebase configuration status
if (typeof window !== 'undefined') {
  console.log('🔥 Firebase Configuration:', {
    isDemoMode,
    projectId: firebaseConfig.projectId,
    authDomain: firebaseConfig.authDomain,
    usingRealFirebase: !isDemoMode,
    emulatorsDisabled: true
  });
}

export { db, auth, isDemoMode };
export default app;
