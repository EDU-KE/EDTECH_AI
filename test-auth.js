// Test script to verify authentication
console.log('🧪 Testing demo authentication...');

// Test demo login
const testLogin = async () => {
  try {
    // Get the auth context
    const { signIn } = await import('./src/lib/auth-context');
    
    console.log('🔐 Attempting login with demo credentials...');
    const result = await signIn('student@demo.com', 'password123');
    
    console.log('✅ Login successful!', result);
    console.log('🍪 Checking cookies...');
    
    // Check if cookies were set
    if (typeof document !== 'undefined') {
      const cookies = document.cookie.split(';').reduce((acc, cookie) => {
        const [key, value] = cookie.trim().split('=');
        acc[key] = value;
        return acc;
      }, {});
      
      console.log('🍪 Found cookies:', cookies);
    }
    
  } catch (error) {
    console.error('❌ Login failed:', error);
  }
};

// Run the test
testLogin();
