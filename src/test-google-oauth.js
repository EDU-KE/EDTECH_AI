// Google OAuth Configuration Test
// Run this in browser console to check OAuth status

console.log('🔍 Google OAuth Configuration Test');
console.log('==================================');

// Check Firebase config
console.log('Firebase Config:');
console.log('Project ID:', process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || 'Not found');
console.log('Auth Domain:', process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN || 'Not found');

// Check current domain
console.log('Current Domain:', window.location.hostname);
console.log('Full URL:', window.location.href);

// Test Google OAuth provider availability
import { GoogleAuthProvider } from 'firebase/auth';
const provider = new GoogleAuthProvider();
console.log('Google Provider Created:', !!provider);

// Expected Configuration:
console.log('\n📋 Expected Configuration:');
console.log('Provider ID: project-760347188535');
console.log('Authorized Domains should include:');
console.log('- localhost');
console.log('- fictional-space-guide-x556vjvrxwx53p4gp.preview.app.github.dev');

console.log('\n🔗 Fix Links:');
console.log('Firebase Console: https://console.firebase.google.com/project/last-35eb7/authentication/providers');
console.log('Add your domain to authorized domains!');
