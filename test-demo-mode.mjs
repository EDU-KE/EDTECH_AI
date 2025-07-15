// Test if system is in demo mode
const isDemoMode = !process.env.NEXT_PUBLIC_FIREBASE_API_KEY || 
                   process.env.NEXT_PUBLIC_FIREBASE_API_KEY === "your_api_key_here" ||
                   process.env.NEXT_PUBLIC_FIREBASE_API_KEY === "";

console.log('🔍 Demo Mode Status Check:');
console.log('=========================');
console.log('API Key present:', !!process.env.NEXT_PUBLIC_FIREBASE_API_KEY);
console.log('API Key value (first 20 chars):', process.env.NEXT_PUBLIC_FIREBASE_API_KEY?.substring(0, 20) + '...');
console.log('Is demo mode?', isDemoMode);

if (isDemoMode) {
  console.log('🚨 PROBLEM FOUND: System is in DEMO MODE!');
  console.log('This is why Google auth is not working even though it\'s enabled in Firebase Console.');
  console.log('Demo mode disables all Firebase authentication.');
} else {
  console.log('✅ System is NOT in demo mode - Firebase should work');
}

// Also check the auth context behavior
import { isDemoMode as authIsDemoMode } from './src/lib/firebase.js';

console.log('\n🔍 Auth Context Demo Mode Check:');
console.log('Auth context demo mode:', authIsDemoMode);

export {};
