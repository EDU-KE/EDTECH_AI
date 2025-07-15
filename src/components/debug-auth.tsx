"use client";

import { useAuth } from '@/lib/auth-context';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export function DebugAuth() {
  const { user, signIn, signOut, isDemoMode } = useAuth();

  const handleTestLogin = async () => {
    try {
      console.log('🧪 Testing demo login...');
      await signIn('student@demo.com', 'password123');
      console.log('✅ Demo login successful');
    } catch (error) {
      console.error('❌ Demo login failed:', error);
    }
  };

  const handleTestLogout = async () => {
    try {
      console.log('🧪 Testing logout...');
      await signOut();
      console.log('✅ Logout successful');
    } catch (error) {
      console.error('❌ Logout failed:', error);
    }
  };

  const checkCookies = () => {
    if (typeof document !== 'undefined') {
      const cookies = document.cookie.split(';').reduce((acc, cookie) => {
        const [key, value] = cookie.trim().split('=');
        acc[key] = value;
        return acc;
      }, {} as Record<string, string>);
      
      console.log('🍪 Current cookies:', cookies);
      console.log('🍪 Auth token:', cookies['auth-token']);
      console.log('🍪 User role:', cookies['user-role']);
      console.log('🍪 Session expiry:', cookies['session-expiry']);
    }
  };

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle>🔍 Auth Debug</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <p><strong>Mode:</strong> {isDemoMode ? 'Demo' : 'Firebase'}</p>
          <p><strong>User:</strong> {user ? user.email : 'None'}</p>
          <p><strong>Role:</strong> {user ? user.role : 'None'}</p>
        </div>
        
        <div className="space-y-2">
          <Button onClick={handleTestLogin} className="w-full">
            Test Demo Login
          </Button>
          <Button onClick={handleTestLogout} variant="outline" className="w-full">
            Test Logout
          </Button>
          <Button onClick={checkCookies} variant="secondary" className="w-full">
            Check Cookies
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
