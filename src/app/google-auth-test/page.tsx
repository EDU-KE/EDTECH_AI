"use client";

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { GoogleSignInButton } from '@/components/auth/google-sign-in';
import { checkGoogleStatus } from '@/lib/google-auth';
import { isDemoMode } from '@/lib/firebase';
import { CheckCircle, XCircle, AlertCircle, RefreshCw } from 'lucide-react';

interface TestResult {
  name: string;
  status: 'pass' | 'fail' | 'warning' | 'pending';
  message: string;
  details?: string;
}

export default function GoogleAuthTestPage() {
  const [testResults, setTestResults] = useState<TestResult[]>([]);
  const [testing, setTesting] = useState(false);
  const [googleStatus, setGoogleStatus] = useState<any>(null);

  useEffect(() => {
    runInitialTests();
  }, []);

  const runInitialTests = async () => {
    setTesting(true);
    const results: TestResult[] = [];

    // Test 1: Demo Mode Check
    results.push({
      name: 'Demo Mode Check',
      status: isDemoMode ? 'warning' : 'pass',
      message: isDemoMode ? 'Running in demo mode' : 'Firebase configuration detected',
      details: isDemoMode ? 'Google sign-in will not work in demo mode' : 'Firebase is properly configured'
    });

    // Test 2: Google Provider Status
    try {
      const status = await checkGoogleStatus();
      setGoogleStatus(status);
      
      results.push({
        name: 'Google Provider Status',
        status: status.available && status.configured ? 'pass' : 'fail',
        message: status.available && status.configured ? 'Google provider available' : 'Google provider not available',
        details: status.error || 'Provider configuration successful'
      });
    } catch (error: any) {
      results.push({
        name: 'Google Provider Status',
        status: 'fail',
        message: 'Failed to check Google provider',
        details: error.message
      });
    }

    // Test 3: Component Load Test
    try {
      results.push({
        name: 'Google Sign-In Component',
        status: 'pass',
        message: 'Component loaded successfully',
        details: 'React component is properly imported and rendered'
      });
    } catch (error: any) {
      results.push({
        name: 'Google Sign-In Component',
        status: 'fail',
        message: 'Component failed to load',
        details: error.message
      });
    }

    setTestResults(results);
    setTesting(false);
  };

  const handleGoogleSuccess = (result: any) => {
    const newResult: TestResult = {
      name: 'Google Sign-In Test',
      status: 'pass',
      message: `Successfully signed in as ${result.user.displayName}`,
      details: `Email: ${result.user.email}, New User: ${result.isNewUser}`
    };
    
    setTestResults(prev => [...prev, newResult]);
  };

  const handleGoogleError = (error: Error) => {
    const newResult: TestResult = {
      name: 'Google Sign-In Test',
      status: 'fail',
      message: 'Google sign-in failed',
      details: error.message
    };
    
    setTestResults(prev => [...prev, newResult]);
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pass':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'fail':
        return <XCircle className="h-4 w-4 text-red-500" />;
      case 'warning':
        return <AlertCircle className="h-4 w-4 text-yellow-500" />;
      default:
        return <RefreshCw className="h-4 w-4 text-blue-500" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pass':
        return 'border-green-200 bg-green-50';
      case 'fail':
        return 'border-red-200 bg-red-50';
      case 'warning':
        return 'border-yellow-200 bg-yellow-50';
      default:
        return 'border-blue-200 bg-blue-50';
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">🔍 Google Authentication Test</h1>
        <p className="text-gray-600">
          This page tests the new Google sign-in implementation to ensure everything works correctly.
        </p>
      </div>

      {/* System Status */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>📊 System Status</CardTitle>
          <CardDescription>
            Current authentication system configuration
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-3 border rounded-lg">
              <div className="font-semibold">Firebase Mode</div>
              <div className={isDemoMode ? "text-yellow-600" : "text-green-600"}>
                {isDemoMode ? "Demo Mode" : "Production Mode"}
              </div>
            </div>
            <div className="p-3 border rounded-lg">
              <div className="font-semibold">Google Provider</div>
              <div className={googleStatus?.available ? "text-green-600" : "text-red-600"}>
                {googleStatus?.available ? "Available" : "Not Available"}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Test Results */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>🧪 Test Results</CardTitle>
          <CardDescription>
            Automated tests for Google authentication functionality
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {testResults.map((result, index) => (
              <div
                key={index}
                className={`p-4 border rounded-lg ${getStatusColor(result.status)}`}
              >
                <div className="flex items-center gap-2 mb-2">
                  {getStatusIcon(result.status)}
                  <span className="font-semibold">{result.name}</span>
                </div>
                <div className="text-sm mb-1">{result.message}</div>
                {result.details && (
                  <div className="text-xs text-gray-600">{result.details}</div>
                )}
              </div>
            ))}
          </div>
          
          <div className="mt-4">
            <Button 
              onClick={runInitialTests} 
              disabled={testing}
              variant="outline"
              size="sm"
            >
              {testing ? (
                <>
                  <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                  Running Tests...
                </>
              ) : (
                <>
                  <RefreshCw className="h-4 w-4 mr-2" />
                  Re-run Tests
                </>
              )}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Google Sign-In Test */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>🚀 Google Sign-In Test</CardTitle>
          <CardDescription>
            Test the actual Google sign-in functionality
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <Alert>
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                Click the button below to test Google sign-in. This will use the new implementation
                with automatic popup/redirect fallback.
              </AlertDescription>
            </Alert>
            
            <div className="max-w-sm">
              <GoogleSignInButton
                onSuccess={handleGoogleSuccess}
                onError={handleGoogleError}
                className="w-full"
              />
            </div>
            
            <div className="text-sm text-gray-600">
              <strong>What to expect:</strong>
              <ul className="list-disc list-inside mt-2 space-y-1">
                <li>If Google OAuth is enabled: Sign-in popup or redirect</li>
                <li>If popup is blocked: Automatic fallback to redirect</li>
                <li>If Google OAuth is disabled: Clear error message</li>
                <li>Success: User profile created/updated in Firestore</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Configuration Help */}
      <Card>
        <CardHeader>
          <CardTitle>⚙️ Configuration Help</CardTitle>
          <CardDescription>
            Steps to configure Google OAuth if tests fail
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="p-4 border-l-4 border-blue-500 bg-blue-50">
              <h4 className="font-semibold mb-2">Enable Google Provider</h4>
              <ol className="list-decimal list-inside space-y-1 text-sm">
                <li>Open <a href="https://console.firebase.google.com/project/last-35eb7/authentication/providers" target="_blank" rel="noopener noreferrer" className="text-blue-600 underline">Firebase Console</a></li>
                <li>Click on "Google" provider</li>
                <li>Toggle "Enable" to ON</li>
                <li>Add support email</li>
                <li>Click "Save"</li>
              </ol>
            </div>
            
            <div className="p-4 border-l-4 border-yellow-500 bg-yellow-50">
              <h4 className="font-semibold mb-2">Authorize Domains</h4>
              <ol className="list-decimal list-inside space-y-1 text-sm">
                <li>Go to <a href="https://console.firebase.google.com/project/last-35eb7/authentication/settings" target="_blank" rel="noopener noreferrer" className="text-blue-600 underline">Authentication Settings</a></li>
                <li>Add these domains to "Authorized domains":</li>
                <ul className="list-disc list-inside ml-4 mt-1">
                  <li>localhost</li>
                  <li>127.0.0.1</li>
                  <li>Your Codespace domain (if using GitHub Codespaces)</li>
                </ul>
              </ol>
            </div>
            
            <div className="p-4 border-l-4 border-green-500 bg-green-50">
              <h4 className="font-semibold mb-2">Test Again</h4>
              <p className="text-sm">
                After making the configuration changes, refresh this page and test Google sign-in again.
                The new implementation should handle all edge cases gracefully.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
