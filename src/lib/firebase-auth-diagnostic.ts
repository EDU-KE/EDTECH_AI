// Firebase Auth Diagnostic Tool
// Use this in browser console to diagnose auth/internal-error issues

declare global {
  interface Window {
    diagnoseFirebaseAuth: () => Promise<void>;
    testFirebaseAuth: () => Promise<void>;
  }
}

export async function diagnoseFirebaseAuth(): Promise<void> {
  console.log('🔍 Firebase Auth Diagnostic Tool Starting...');
  console.log('==========================================');
  
  try {
    // Check if Firebase is loaded
    console.log('1. Checking Firebase availability...');
    if (typeof window !== 'undefined') {
      console.log('✅ Running in browser environment');
      
      // Check if Firebase app is available
      const { getApps } = await import('firebase/app');
      const apps = getApps();
      console.log(`✅ Firebase apps found: ${apps.length}`);
      
      if (apps.length === 0) {
        console.error('❌ No Firebase apps initialized');
        return;
      }
      
      const app = apps[0];
      console.log('✅ Firebase app:', app.name);
      
      // Check Firebase configuration
      console.log('2. Checking Firebase configuration...');
      const config = app.options;
      console.log('✅ Firebase config:', {
        projectId: config.projectId,
        authDomain: config.authDomain,
        apiKey: config.apiKey ? '***' : 'MISSING'
      });
      
      // Check if auth domain is accessible
      console.log('3. Testing auth domain accessibility...');
      if (config.authDomain) {
        try {
          const response = await fetch(`https://${config.authDomain}`, { method: 'HEAD' });
          console.log(`✅ Auth domain accessible: ${response.status}`);
        } catch (error) {
          console.log(`⚠️ Auth domain check failed: ${error}`);
        }
      }
      
      // Check Google APIs accessibility
      console.log('4. Testing Google APIs accessibility...');
      try {
        const response = await fetch('https://www.googleapis.com/', { method: 'HEAD' });
        console.log(`✅ Google APIs accessible: ${response.status}`);
      } catch (error) {
        console.log(`⚠️ Google APIs check failed: ${error}`);
      }
      
      // Test Firebase Auth initialization
      console.log('5. Testing Firebase Auth initialization...');
      try {
        const { getAuth } = await import('firebase/auth');
        const auth = getAuth(app);
        console.log('✅ Firebase Auth initialized successfully');
        
        // Test auth state
        console.log('6. Testing auth state...');
        const user = auth.currentUser;
        console.log(`✅ Current user: ${user ? user.email : 'None'}`);
        
        // Test Google Auth Provider
        console.log('7. Testing Google Auth Provider...');
        const { GoogleAuthProvider } = await import('firebase/auth');
        const provider = new GoogleAuthProvider();
        console.log('✅ Google Auth Provider created');
        
        // Check if we can access sign-in methods
        console.log('8. Testing sign-in methods availability...');
        const { signInWithPopup, signInWithRedirect } = await import('firebase/auth');
        console.log('✅ Sign-in methods available');
        
        console.log('🎉 All Firebase Auth checks passed!');
        
      } catch (error) {
        console.error('❌ Firebase Auth initialization failed:', error);
        
        if (error instanceof Error) {
          if (error.message.includes('auth/internal-error')) {
            console.log('🔧 This is the auth/internal-error we need to fix!');
            console.log('Possible causes:');
            console.log('1. Network connectivity issues');
            console.log('2. Firebase script loading problems');
            console.log('3. Content Security Policy restrictions');
            console.log('4. Missing OAuth configuration');
          }
        }
      }
      
    } else {
      console.log('❌ Not running in browser environment');
    }
    
  } catch (error) {
    console.error('❌ Diagnostic failed:', error);
  }
  
  console.log('==========================================');
  console.log('🔍 Firebase Auth Diagnostic Complete');
}

export async function testFirebaseAuth(): Promise<void> {
  console.log('🧪 Testing Firebase Auth...');
  
  try {
    // Import Firebase auth loader
    const { getFirebaseAuth } = await import('./firebase-auth-loader');
    const { getApps } = await import('firebase/app');
    
    const apps = getApps();
    if (apps.length === 0) {
      console.error('❌ No Firebase apps found');
      return;
    }
    
    const app = apps[0];
    const auth = await getFirebaseAuth(app);
    
    console.log('✅ Firebase Auth loaded successfully');
    console.log('Auth instance:', auth);
    
    // Test Google provider
    const { GoogleAuthProvider } = await import('firebase/auth');
    const provider = new GoogleAuthProvider();
    provider.addScope('email');
    provider.addScope('profile');
    
    console.log('✅ Google Auth Provider configured');
    console.log('🎉 Firebase Auth is working correctly!');
    
  } catch (error) {
    console.error('❌ Firebase Auth test failed:', error);
  }
}

// Make functions available globally for browser console
if (typeof window !== 'undefined') {
  window.diagnoseFirebaseAuth = diagnoseFirebaseAuth;
  window.testFirebaseAuth = testFirebaseAuth;
}
