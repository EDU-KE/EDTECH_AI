// Test the auth error handler
import { getAuthErrorMessage, getFirebaseErrorCode } from '@/lib/auth-error-handler';

// Test invalid-credential error
const testError = {
  code: 'auth/invalid-credential',
  message: 'Firebase: Error (auth/invalid-credential).'
};

const errorCode = getFirebaseErrorCode(testError);
const authError = getAuthErrorMessage(errorCode);

console.log('🧪 Testing Auth Error Handler');
console.log('Input error:', testError);
console.log('Extracted code:', errorCode);
console.log('Enhanced error:', authError);

// Expected output:
// {
//   title: '🔐 Invalid Credentials',
//   message: 'The email or password you entered is incorrect. Please check your credentials and try again.',
//   type: 'error',
//   action: 'Double-check your email and password'
// }
