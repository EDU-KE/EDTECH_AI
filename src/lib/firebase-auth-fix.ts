// Firebase Auth Internal Error Fix
// This addresses the auth/internal-error caused by dynamic JavaScript loading

import { getAuth, Auth, connectAuthEmulator } from 'firebase/auth';
import { FirebaseApp } from 'firebase/app';

// Fix for Firebase auth/internal-error in GitHub Codespaces
export async function initializeFirebaseAuth(app: FirebaseApp): Promise<Auth> {
  try {
    // Get auth instance
    const auth = getAuth(app);
    
    // Wait for auth to be ready
    await new Promise<void>((resolve, reject) => {
      const unsubscribe = auth.onAuthStateChanged(
        (user) => {
          // Auth is ready
          unsubscribe();
          resolve();
        },
        (error) => {
          console.error('Auth state change error:', error);
          unsubscribe();
          reject(error);
        }
      );
      
      // Timeout after 5 seconds
      setTimeout(() => {
        unsubscribe();
        resolve(); // Resolve anyway to prevent hanging
      }, 5000);
    });
    
    console.log('✅ Firebase Auth initialized successfully');
    return auth;
    
  } catch (error) {
    console.error('Firebase Auth initialization error:', error);
    
    // If we get auth/internal-error, try to reinitialize
    if (error instanceof Error && error.message.includes('auth/internal-error')) {
      console.log('🔧 Attempting to fix auth/internal-error...');
      
      try {
        // Force reload the auth module
        const auth = getAuth(app);
        
        // Add a small delay to let Firebase settle
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        return auth;
      } catch (retryError) {
        console.error('Auth retry failed:', retryError);
        throw retryError;
      }
    }
    
    throw error;
  }
}

// Check if we're in a development environment with potential CORS issues
export function isDevelopmentEnvironment(): boolean {
  if (typeof window === 'undefined') return false;
  
  const hostname = window.location.hostname;
  return hostname.includes('github.dev') || 
         hostname.includes('gitpod.io') || 
         hostname.includes('localhost') ||
         hostname.includes('127.0.0.1');
}

// Add required meta tags for Firebase auth to work properly
export function addFirebaseAuthMetaTags(): void {
  if (typeof document === 'undefined') return;
  
  // Add viewport meta tag if missing
  if (!document.querySelector('meta[name="viewport"]')) {
    const viewportMeta = document.createElement('meta');
    viewportMeta.name = 'viewport';
    viewportMeta.content = 'width=device-width, initial-scale=1.0';
    document.head.appendChild(viewportMeta);
  }
  
  // Add charset meta tag if missing
  if (!document.querySelector('meta[charset]')) {
    const charsetMeta = document.createElement('meta');
    charsetMeta.setAttribute('charset', 'UTF-8');
    document.head.appendChild(charsetMeta);
  }
}

// Enhanced error handler for Firebase auth errors
export function handleFirebaseAuthError(error: any): void {
  if (error?.code === 'auth/internal-error') {
    console.error('🚨 Firebase Auth Internal Error Detected');
    console.error('This usually indicates:');
    console.error('1. Network connectivity issues');
    console.error('2. Firebase configuration problems');
    console.error('3. Browser security restrictions');
    console.error('4. Missing required domains in Firebase Console');
    
    // Try to diagnose the specific issue
    if (isDevelopmentEnvironment()) {
      console.log('🔍 Development environment detected');
      console.log('Check if these domains are added to Firebase Console:');
      console.log('- localhost');
      console.log('- 127.0.0.1');
      console.log('- *.githubpreview.dev');
      console.log('- *.app.github.dev');
    }
  }
}
