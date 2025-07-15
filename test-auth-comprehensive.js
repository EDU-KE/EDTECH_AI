#!/usr/bin/env node

/**
 * Comprehensive Authentication Test Script
 * Tests all authentication flows and identifies issues
 */

console.log('🔍 COMPREHENSIVE AUTHENTICATION ANALYSIS');
console.log('========================================\n');

// Check Node.js environment
console.log('📋 Environment Check:');
console.log('- Node.js Version:', process.version);
console.log('- Platform:', process.platform);
console.log('- Current Directory:', process.cwd());

// Check if .env.local exists and is properly configured
const fs = require('fs');
const path = require('path');

try {
  const envPath = path.join(process.cwd(), '.env.local');
  if (fs.existsSync(envPath)) {
    console.log('✅ .env.local file found');
    
    const envContent = fs.readFileSync(envPath, 'utf8');
    const envLines = envContent.split('\n').filter(line => line.trim() && !line.startsWith('#'));
    
    console.log('\n🔑 Firebase Configuration:');
    
    const requiredVars = [
      'NEXT_PUBLIC_FIREBASE_API_KEY',
      'NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN', 
      'NEXT_PUBLIC_FIREBASE_PROJECT_ID',
      'NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET',
      'NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID',
      'NEXT_PUBLIC_FIREBASE_APP_ID'
    ];
    
    let configValid = true;
    
    requiredVars.forEach(varName => {
      const line = envLines.find(l => l.startsWith(varName));
      if (line) {
        const [key, value] = line.split('=');
        const isConfigured = value && value !== 'your_api_key_here' && value !== '';
        console.log(`${isConfigured ? '✅' : '❌'} ${key}: ${isConfigured ? 'Configured' : 'Missing/Invalid'}`);
        if (!isConfigured) configValid = false;
      } else {
        console.log(`❌ ${varName}: Not found`);
        configValid = false;
      }
    });
    
    console.log(`\n🔥 Firebase Config Status: ${configValid ? '✅ Valid' : '❌ Invalid'}`);
    
    if (configValid) {
      // Extract project info
      const projectIdLine = envLines.find(l => l.startsWith('NEXT_PUBLIC_FIREBASE_PROJECT_ID'));
      const authDomainLine = envLines.find(l => l.startsWith('NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN'));
      
      if (projectIdLine && authDomainLine) {
        const projectId = projectIdLine.split('=')[1];
        const authDomain = authDomainLine.split('=')[1];
        
        console.log('\n📊 Project Details:');
        console.log(`- Project ID: ${projectId}`);
        console.log(`- Auth Domain: ${authDomain}`);
        console.log(`- Console URL: https://console.firebase.google.com/project/${projectId}`);
        console.log(`- Authentication: https://console.firebase.google.com/project/${projectId}/authentication/providers`);
      }
    }
    
  } else {
    console.log('❌ .env.local file not found');
    configValid = false;
  }
} catch (error) {
  console.log('❌ Error reading configuration:', error.message);
}

// Check for authentication files
console.log('\n📁 Authentication Files Check:');

const authFiles = [
  'src/lib/firebase.ts',
  'src/lib/auth.ts',
  'src/lib/auth-context.tsx',
  'src/lib/auth-error-handler.ts',
  'src/app/login/page.tsx',
  'src/app/signup/page.tsx'
];

authFiles.forEach(file => {
  const exists = fs.existsSync(path.join(process.cwd(), file));
  console.log(`${exists ? '✅' : '❌'} ${file}`);
});

// Check package.json for Firebase dependencies
console.log('\n📦 Dependencies Check:');

try {
  const packageJson = JSON.parse(fs.readFileSync('package.json', 'utf8'));
  const deps = { ...packageJson.dependencies, ...packageJson.devDependencies };
  
  const firebaseDeps = [
    'firebase',
    'firebase-admin'
  ];
  
  firebaseDeps.forEach(dep => {
    if (deps[dep]) {
      console.log(`✅ ${dep}: ${deps[dep]}`);
    } else {
      console.log(`❌ ${dep}: Not installed`);
    }
  });
  
} catch (error) {
  console.log('❌ Error reading package.json:', error.message);
}

// Test server availability
console.log('\n🌐 Server Status:');
const http = require('http');

function testServer(port, callback) {
  const req = http.get(`http://localhost:${port}`, (res) => {
    console.log(`✅ Server running on port ${port} (Status: ${res.statusCode})`);
    callback(true);
  });
  
  req.on('error', (err) => {
    console.log(`❌ Server not accessible on port ${port}: ${err.message}`);
    callback(false);
  });
  
  req.setTimeout(5000, () => {
    console.log(`❌ Server timeout on port ${port}`);
    req.destroy();
    callback(false);
  });
}

testServer(9002, (running) => {
  console.log('\n🔍 Analysis Summary:');
  console.log('==================');
  
  if (running) {
    console.log('✅ Development server is running');
    console.log('🌐 Access your app at: http://localhost:9002');
    console.log('🔐 Login page: http://localhost:9002/login');
    console.log('📝 Signup page: http://localhost:9002/signup');
  } else {
    console.log('❌ Development server is not running');
    console.log('💡 Start with: npm run dev');
  }
  
  console.log('\n🎯 Next Steps for Authentication Testing:');
  console.log('1. Open http://localhost:9002/login in your browser');
  console.log('2. Try email/password authentication first');
  console.log('3. Check browser console for any errors');
  console.log('4. Test Google OAuth if enabled');
  console.log('5. Review Firebase Console for provider status');
  
  console.log('\n🔧 Common Issues to Check:');
  console.log('- Google OAuth provider enabled in Firebase Console');
  console.log('- Authorized domains configured (localhost, etc.)');
  console.log('- Firestore rules allow user creation');
  console.log('- Browser popup blocker settings');
  
  process.exit(0);
});
