import { initializeApp, getApps, FirebaseApp } from 'firebase/app';
import { 
  getFirestore, 
  enableIndexedDbPersistence,
  CACHE_SIZE_UNLIMITED,
  Firestore
} from 'firebase/firestore';
import { Auth } from 'firebase/auth';
import { handleIndexedDBCorruption, isIndexedDBCorruption } from './firebase-indexeddb-handler';
import { addFirebaseAuthMetaTags, handleFirebaseAuthError } from './firebase-auth-fix';
import { getFirebaseAuth, addFirebaseAuthDomainSupport } from './firebase-auth-loader';

// Check if we're in demo mode (no Firebase config provided)
const checkDemoMode = (): boolean => {
  if (typeof window === 'undefined') {
    // Server-side: check process.env
    return !process.env.NEXT_PUBLIC_FIREBASE_API_KEY || 
           process.env.NEXT_PUBLIC_FIREBASE_API_KEY === "your_api_key_here" ||
           process.env.NEXT_PUBLIC_FIREBASE_API_KEY === "";
  }
  
  // Client-side: check if Firebase is properly configured
  try {
    const config = {
      apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
      authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
      projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID
    };
    
    // Log configuration for debugging (without sensitive values)
    console.log('Firebase Config Check:', {
      apiKey: config.apiKey ? '✓ Set' : '✗ Missing',
      authDomain: config.authDomain ? '✓ Set' : '✗ Missing',
      projectId: config.projectId ? '✓ Set' : '✗ Missing'
    });
    
    const hasValidConfig = config.apiKey && 
                          config.apiKey !== "your_api_key_here" &&
                          config.apiKey !== "" &&
                          config.authDomain &&
                          config.authDomain !== "your_auth_domain_here" &&
                          config.projectId &&
                          config.projectId !== "your_project_id_here";
                          
    if (!hasValidConfig) {
      console.warn('Invalid Firebase configuration detected');
      console.log('Current domain:', window.location.hostname);
    }
    
    return !hasValidConfig;
  } catch (error) {
    console.error('Firebase configuration check failed:', error);
    return true; // Default to demo mode if there's any error
  }
};

// For backward compatibility, create a constant
const isDemoMode = checkDemoMode();

// Firebase configuration object
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY || "demo-api-key",
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN || "demo-project.firebaseapp.com",
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || "demo-project",
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET || "demo-project.appspot.com",
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || "123456789",
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID || "1:123456789:web:abcdef",
};

// Initialize Firebase with error handling
let app: FirebaseApp;
let db: Firestore;
let auth: Auth;

// Add required meta tags for Firebase auth
if (typeof window !== 'undefined') {
  addFirebaseAuthMetaTags();
  addFirebaseAuthDomainSupport();
  
  // Load diagnostic tool in development
  if (process.env.NODE_ENV === 'development') {
    import('./firebase-auth-diagnostic').then(() => {
      console.log('🔍 Firebase Auth Diagnostic Tool loaded');
      console.log('Use diagnoseFirebaseAuth() or testFirebaseAuth() in console to debug');
    });
  }
}

try {
  // Initialize Firebase app
  app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];
  
  if (isDemoMode) {
    console.log('🚀 Firebase Demo Mode: Using local authentication simulation');
  }
  
  // Initialize Auth with enhanced loader
  if (typeof window !== 'undefined') {
    // Client-side: use the enhanced auth loader
    getFirebaseAuth(app).then((authInstance) => {
      auth = authInstance;
      console.log('✅ Firebase Auth loaded successfully');
    }).catch((error) => {
      console.error('❌ Firebase Auth loading failed:', error);
      handleFirebaseAuthError(error);
      // Import getAuth here as fallback
      import('firebase/auth').then(({ getAuth }) => {
        auth = getAuth(app);
      });
    });
  } else {
    // Server-side: use dynamic import
    import('firebase/auth').then(({ getAuth }) => {
      auth = getAuth(app);
    });
  }
  
  // Initialize Firestore with simple initialization
  db = getFirestore(app);
  
} catch (error) {
  console.error('Firebase initialization error:', error);
  handleFirebaseAuthError(error);
  
  // Create minimal Firebase app for demo mode
  if (isDemoMode) {
    console.log('🔧 Creating demo Firebase configuration...');
    try {
      app = initializeApp({
        apiKey: "demo-api-key",
        authDomain: "demo-project.firebaseapp.com",
        projectId: "demo-project",
      });
      // Use dynamic import for demo mode too
      import('firebase/auth').then(({ getAuth }) => {
        auth = getAuth(app);
      });
      db = getFirestore(app);
    } catch (demoError) {
      console.error('Demo Firebase setup failed:', demoError);
      throw new Error('Firebase initialization failed completely. Please check your configuration.');
    }
  } else {
    throw error;
  }
}

// Export the initialized instances
//
// if (process.env.NODE_ENV === 'development' && typeof window !== 'undefined' && !isDemoMode) {
//   try {
//     connectFirestoreEmulator(db, 'localhost', 8080);
//     connectAuthEmulator(auth, 'http://localhost:9099');
//   } catch (error) {
//     console.log('Emulator connection error (might already be connected):', error);
//   }
// }

// Enable offline persistence for better performance with enhanced error handling
if (typeof window !== 'undefined' && !isDemoMode) {
  enableIndexedDbPersistence(db).catch((err) => {
    if (err.code === 'failed-precondition') {
      console.log('Multiple tabs open, persistence can only be enabled in one tab at a time.');
    } else if (err.code === 'unimplemented') {
      console.log('The current browser does not support persistence.');
    } else if (isIndexedDBCorruption(err)) {
      console.warn('IndexedDB corruption detected during persistence setup.');
      handleIndexedDBCorruption();
    } else {
      console.warn('Firebase persistence error:', err);
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

// Export the initialized instances with safe access
export { db, isDemoMode };
export default app;

// Safe auth getter that handles async loading
export async function getAuthInstance(): Promise<Auth> {
  if (auth) {
    return auth;
  }
  
  // If auth is not ready, wait for it
  let attempts = 0;
  const maxAttempts = 50; // 5 seconds max
  
  while (!auth && attempts < maxAttempts) {
    await new Promise(resolve => setTimeout(resolve, 100));
    attempts++;
  }
  
  if (!auth) {
    throw new Error('Firebase Auth not initialized');
  }
  
  return auth;
}

// For backward compatibility - use with caution
export { auth };
