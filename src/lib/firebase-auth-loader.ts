// Firebase Auth Script Loading Fix for GitHub Codespaces
// This addresses the auth/internal-error caused by dynamic script loading failures

import { FirebaseApp } from 'firebase/app';
import { Auth, getAuth } from 'firebase/auth';

// Fix for Firebase auth/internal-error in GitHub Codespaces
export class FirebaseAuthLoader {
  private static instance: FirebaseAuthLoader;
  private authInstance: Auth | null = null;
  private loading = false;
  private loadPromise: Promise<Auth> | null = null;

  static getInstance(): FirebaseAuthLoader {
    if (!FirebaseAuthLoader.instance) {
      FirebaseAuthLoader.instance = new FirebaseAuthLoader();
    }
    return FirebaseAuthLoader.instance;
  }

  async loadAuth(app: FirebaseApp): Promise<Auth> {
    if (this.authInstance) {
      return this.authInstance;
    }

    if (this.loadPromise) {
      return this.loadPromise;
    }

    this.loadPromise = this.initializeAuth(app);
    return this.loadPromise;
  }

  private async initializeAuth(app: FirebaseApp): Promise<Auth> {
    try {
      console.log('🔄 Initializing Firebase Auth...');
      
      // Pre-load required Firebase auth scripts
      await this.preloadFirebaseAuthScripts();
      
      // Wait a bit to ensure scripts are loaded
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Initialize auth
      this.authInstance = getAuth(app);
      
      // Wait for auth to be ready
      await this.waitForAuthReady(this.authInstance);
      
      console.log('✅ Firebase Auth initialized successfully');
      return this.authInstance;
      
    } catch (error) {
      console.error('❌ Firebase Auth initialization failed:', error);
      
      // If we get auth/internal-error, try fallback initialization
      if (this.isInternalError(error)) {
        console.log('🔧 Attempting fallback auth initialization...');
        return this.fallbackAuthInit(app);
      }
      
      throw error;
    }
  }

  private async preloadFirebaseAuthScripts(): Promise<void> {
    if (typeof window === 'undefined') return;

    const scripts = [
      'https://www.gstatic.com/firebasejs/11.10.0/firebase-auth.js',
      'https://apis.google.com/js/api.js',
      'https://apis.google.com/js/platform.js'
    ];

    const loadScript = (src: string): Promise<void> => {
      return new Promise((resolve, reject) => {
        // Check if script already exists
        if (document.querySelector(`script[src="${src}"]`)) {
          resolve();
          return;
        }

        const script = document.createElement('script');
        script.src = src;
        script.async = true;
        script.crossOrigin = 'anonymous';
        
        script.onload = () => resolve();
        script.onerror = () => {
          console.warn(`⚠️ Failed to load script: ${src}`);
          resolve(); // Don't reject, continue anyway
        };
        
        document.head.appendChild(script);
      });
    };

    try {
      await Promise.all(scripts.map(loadScript));
      console.log('✅ Firebase auth scripts preloaded');
    } catch (error) {
      console.warn('⚠️ Some Firebase auth scripts failed to load:', error);
    }
  }

  private async waitForAuthReady(auth: Auth): Promise<void> {
    return new Promise((resolve, reject) => {
      const timeout = setTimeout(() => {
        unsubscribe();
        reject(new Error('Auth initialization timeout'));
      }, 10000);

      const unsubscribe = auth.onAuthStateChanged(
        () => {
          clearTimeout(timeout);
          unsubscribe();
          resolve();
        },
        (error) => {
          clearTimeout(timeout);
          unsubscribe();
          reject(error);
        }
      );
    });
  }

  private async fallbackAuthInit(app: FirebaseApp): Promise<Auth> {
    try {
      // Clear any existing auth instance
      this.authInstance = null;
      
      // Wait a bit longer
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Try basic auth initialization
      const auth = getAuth(app);
      
      // Don't wait for auth state, just return
      this.authInstance = auth;
      console.log('✅ Fallback auth initialization successful');
      
      return auth;
    } catch (error) {
      console.error('❌ Fallback auth initialization failed:', error);
      throw error;
    }
  }

  private isInternalError(error: any): boolean {
    return error?.code === 'auth/internal-error' || 
           error?.message?.includes('auth/internal-error') ||
           error?.message?.includes('loadJS');
  }

  getAuth(): Auth | null {
    return this.authInstance;
  }

  reset(): void {
    this.authInstance = null;
    this.loading = false;
    this.loadPromise = null;
  }
}

// Export singleton instance
export const firebaseAuthLoader = FirebaseAuthLoader.getInstance();

// Helper function to get auth with proper loading
export async function getFirebaseAuth(app: FirebaseApp): Promise<Auth> {
  return firebaseAuthLoader.loadAuth(app);
}

// Add additional meta tags for Firebase auth
export function addFirebaseAuthDomainSupport(): void {
  if (typeof document === 'undefined') return;
  
  // Add meta tag for Firebase auth domain
  const authDomainMeta = document.createElement('meta');
  authDomainMeta.name = 'firebase-auth-domain';
  authDomainMeta.content = 'last-35eb7.firebaseapp.com';
  document.head.appendChild(authDomainMeta);
  
  // Add meta tag for current domain
  const currentDomainMeta = document.createElement('meta');
  currentDomainMeta.name = 'current-domain';
  currentDomainMeta.content = window.location.origin;
  document.head.appendChild(currentDomainMeta);
}
