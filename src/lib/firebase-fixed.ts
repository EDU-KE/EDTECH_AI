import { initializeApp, getApps, FirebaseApp } from 'firebase/app';
import { 
  getFirestore, 
  enableIndexedDbPersistence,
  CACHE_SIZE_UNLIMITED,
  initializeFirestore,
  Firestore
} from 'firebase/firestore';
import { getAuth, Auth } from 'firebase/auth';
import { handleIndexedDBCorruption, isIndexedDBCorruption } from './firebase-indexeddb-handler';

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
    const hasValidConfig = process.env.NEXT_PUBLIC_FIREBASE_API_KEY && 
                          process.env.NEXT_PUBLIC_FIREBASE_API_KEY !== "your_api_key_here" &&
                          process.env.NEXT_PUBLIC_FIREBASE_API_KEY !== "";
    return !hasValidConfig;
  } catch {
    console.warn('Firebase configuration check failed, falling back to demo mode');
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

// Initialize Firebase with enhanced error handling
let app: FirebaseApp;
let db: Firestore;
let auth: Auth;

try {
  // Initialize Firebase app
  app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];
  
  console.log('🔥 Firebase App initialized successfully');
  
  // Initialize Auth with error handling
  try {
    auth = getAuth(app);
    console.log('🔐 Firebase Auth initialized successfully');
  } catch (authError: any) {
    console.error('❌ Firebase Auth initialization failed:', authError);
    throw new Error(`Firebase Auth initialization failed: ${authError.message}`);
  }
  
  // Initialize Firestore with enhanced error handling
  try {
    db = initializeFirestore(app, {
      cacheSizeBytes: CACHE_SIZE_UNLIMITED,
      experimentalForceLongPolling: false,
    });
    console.log('📊 Firestore initialized successfully');
  } catch (firestoreError: any) {
    console.warn('⚠️ Firestore initialization failed:', firestoreError);
    
    // Handle IndexedDB corruption specifically
    if (isIndexedDBCorruption(firestoreError)) {
      console.warn('🔧 IndexedDB corruption detected during initialization.');
      handleIndexedDBCorruption();
      // Use default Firestore as fallback
      db = getFirestore(app);
    } else {
      // Fall back to default Firestore initialization
      db = getFirestore(app);
    }
    console.log('📊 Firestore fallback initialized');
  }
  
} catch (error: any) {
  console.error('❌ Firebase initialization error:', error);
  
  // Create minimal Firebase app for demo mode
  if (isDemoMode) {
    console.log('🔧 Creating demo Firebase configuration...');
    try {
      app = initializeApp({
        apiKey: "demo-api-key",
        authDomain: "demo-project.firebaseapp.com",
        projectId: "demo-project",
      });
      auth = getAuth(app);
      db = getFirestore(app);
      console.log('🎭 Demo Firebase setup completed');
    } catch (demoError: any) {
      console.error('❌ Demo Firebase setup failed:', demoError);
      throw new Error('Firebase initialization failed completely. Please check your configuration.');
    }
  } else {
    throw error;
  }
}

// Enable offline persistence for better performance with enhanced error handling
if (typeof window !== 'undefined' && !isDemoMode) {
  enableIndexedDbPersistence(db).catch((err) => {
    if (err.code === 'failed-precondition') {
      console.log('ℹ️ Multiple tabs open, persistence can only be enabled in one tab at a time.');
    } else if (err.code === 'unimplemented') {
      console.log('ℹ️ The current browser does not support persistence.');
    } else if (isIndexedDBCorruption(err)) {
      console.warn('🔧 IndexedDB corruption detected during persistence setup.');
      handleIndexedDBCorruption();
    } else {
      console.warn('⚠️ Firebase persistence error:', err);
    }
  });
}

// Enhanced Firebase configuration status logging
if (typeof window !== 'undefined') {
  console.log('🔥 Firebase Configuration Status:', {
    isDemoMode,
    projectId: firebaseConfig.projectId,
    authDomain: firebaseConfig.authDomain,
    usingRealFirebase: !isDemoMode,
    authInitialized: !!auth,
    firestoreInitialized: !!db,
    appInitialized: !!app
  });
  
  // Additional auth status check
  if (auth) {
    console.log('🔐 Firebase Auth Status:', {
      currentUser: auth.currentUser,
      authReady: true,
      appId: app.options.appId
    });
  }
}

export { db, auth, isDemoMode };
export default app;
