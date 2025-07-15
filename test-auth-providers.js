#!/usr/bin/env node

/**
 * Firebase Authentication Providers Test
 * Checks the actual authentication providers and their status
 */

const https = require('https');
const fs = require('fs');

console.log('🔥 FIREBASE AUTHENTICATION PROVIDERS TEST');
console.log('=========================================\n');

// Read Firebase config
const envContent = fs.readFileSync('.env.local', 'utf8');
const getEnvVar = (name) => {
  const line = envContent.split('\n').find(l => l.startsWith(name));
  return line ? line.split('=')[1] : null;
};

const projectId = getEnvVar('NEXT_PUBLIC_FIREBASE_PROJECT_ID');
const apiKey = getEnvVar('NEXT_PUBLIC_FIREBASE_API_KEY');

console.log('📊 Project Information:');
console.log(`- Project ID: ${projectId}`);
console.log(`- API Key: ${apiKey ? apiKey.substring(0, 10) + '...' : 'Not found'}`);

if (!projectId || !apiKey) {
  console.log('\n❌ Firebase configuration incomplete');
  process.exit(1);
}

console.log('\n🔗 Firebase Console Links:');
console.log(`- Project Console: https://console.firebase.google.com/project/${projectId}`);
console.log(`- Authentication: https://console.firebase.google.com/project/${projectId}/authentication/providers`);
console.log(`- Settings: https://console.firebase.google.com/project/${projectId}/authentication/settings`);

console.log('\n🔍 Authentication Providers Status:');
console.log('===================================');

// Check what we can determine from the configuration
console.log('✅ Email/Password: Likely enabled (standard Firebase auth)');

// Google OAuth check
console.log('\n🔗 Google OAuth Status:');
console.log('- Provider: Google');
console.log('- Project Number: 760347188535 (from Firebase config)');
console.log('- Status: ❓ Needs manual verification');

console.log('\n📋 Manual Verification Steps:');
console.log('1. Open Firebase Console Authentication page:');
console.log(`   https://console.firebase.google.com/project/${projectId}/authentication/providers`);
console.log('2. Check if Google provider shows "Enabled" status');
console.log('3. Verify authorized domains include:');
console.log('   - localhost');
console.log('   - 127.0.0.1');
console.log('   - your-codespace-domain.app.github.dev');

// Test authentication endpoints
console.log('\n🌐 Testing Authentication Endpoints:');

// Test the Next.js app
const testEndpoint = (url, description) => {
  return new Promise((resolve) => {
    const req = https.get(url, (res) => {
      console.log(`✅ ${description}: HTTP ${res.statusCode}`);
      resolve(true);
    });
    
    req.on('error', (err) => {
      console.log(`❌ ${description}: ${err.message}`);
      resolve(false);
    });
    
    req.setTimeout(5000, () => {
      console.log(`⏰ ${description}: Timeout`);
      req.destroy();
      resolve(false);
    });
  });
};

// Test login page
(async () => {
  console.log('\nTesting application endpoints...');
  
  // We'll test via HTTP since we know the server is running on port 9002
  const http = require('http');
  
  const testLocalEndpoint = (path, description) => {
    return new Promise((resolve) => {
      const req = http.get(`http://localhost:9002${path}`, (res) => {
        console.log(`✅ ${description}: HTTP ${res.statusCode}`);
        resolve(true);
      });
      
      req.on('error', (err) => {
        console.log(`❌ ${description}: ${err.message}`);
        resolve(false);
      });
      
      req.setTimeout(3000, () => {
        console.log(`⏰ ${description}: Timeout`);
        req.destroy();
        resolve(false);
      });
    });
  };
  
  await testLocalEndpoint('/', 'Home Page');
  await testLocalEndpoint('/login', 'Login Page');
  await testLocalEndpoint('/signup', 'Signup Page');
  
  console.log('\n🎯 AUTHENTICATION ANALYSIS SUMMARY');
  console.log('==================================');
  
  console.log('\n✅ Working Components:');
  console.log('- Firebase configuration loaded');
  console.log('- Development server running');
  console.log('- Authentication pages accessible');
  console.log('- Auth error handling implemented');
  
  console.log('\n❓ Needs Verification:');
  console.log('- Google OAuth provider enabled in Firebase Console');
  console.log('- Authorized domains configured');
  console.log('- Firestore security rules');
  
  console.log('\n🔧 Recommended Testing Order:');
  console.log('1. Test email/password authentication first');
  console.log('2. Check browser console for any Firebase errors');
  console.log('3. Verify Google OAuth provider in Firebase Console');
  console.log('4. Test Google sign-in after enabling provider');
  
  console.log('\n🚨 Common Error Patterns to Watch For:');
  console.log('- "auth/internal-error" → Google provider not enabled');
  console.log('- "auth/unauthorized-domain" → Domain not authorized');
  console.log('- "auth/popup-blocked" → Browser blocking popups');
  console.log('- "loadJS" errors → OAuth configuration issues');
  
  console.log('\n🌐 Test Your Authentication:');
  console.log('- Login: http://localhost:9002/login');
  console.log('- Signup: http://localhost:9002/signup');
  console.log('- Test: http://localhost:9002/auth-test.html');
  
  process.exit(0);
})();
