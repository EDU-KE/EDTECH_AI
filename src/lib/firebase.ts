import { initializeApp, getApps } from 'firebase/app';
import { 
  getFirestore, 
  connectFirestoreEmulator,
  enableIndexedDbPersistence,
  CACHE_SIZE_UNLIMITED,
  initializeFirestore
} from 'firebase/firestore';
import { getAuth, connectAuthEmulator } from 'firebase/auth';

// Check if we're in demo mode (no Firebase config provided)
const isDemoMode = !process.env.NEXT_PUBLIC_FIREBASE_API_KEY || 
                   process.env.NEXT_PUBLIC_FIREBASE_API_KEY === "your_api_key_here";

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

// Connect to emulators in development
if (process.env.NODE_ENV === 'development' && typeof window !== 'undefined' && !isDemoMode) {
  try {
    // Connect Firestore emulator
    connectFirestoreEmulator(db, 'localhost', 8080);
    
    // Connect Auth emulator
    connectAuthEmulator(auth, 'http://localhost:9099');
  } catch (error) {
    console.log('Emulator connection error (might already be connected):', error);
  }
}

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
    authDomain: firebaseConfig.authDomain
  });
}

export { db, auth, isDemoMode };
export default app;
