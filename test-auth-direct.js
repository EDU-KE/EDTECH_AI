// Simple test to verify demo authentication
import { signIn } from '../lib/auth-context'

async function testAuth() {
  try {
    console.log('Testing demo authentication...')
    const result = await signIn('student@demo.com', 'password123')
    console.log('✅ Authentication successful:', result)
  } catch (error) {
    console.error('❌ Authentication failed:', error)
  }
}

testAuth()
