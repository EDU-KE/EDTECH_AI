'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { CheckCircle, XCircle, AlertTriangle, RefreshCw } from 'lucide-react';

export default function FirebaseDebugPage() {
  const [debugInfo, setDebugInfo] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const runDiagnostics = async () => {
    setLoading(true);
    const info: any = {
      timestamp: new Date().toISOString(),
      environment: {},
      firebase: {},
      network: {},
      browser: {},
      errors: []
    };

    try {
      // Environment checks
      info.environment = {
        NODE_ENV: process.env.NODE_ENV,
        isDemoMode: null,
        hasFirebaseConfig: Boolean(process.env.NEXT_PUBLIC_FIREBASE_API_KEY),
        firebaseApiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY ? 
          `${process.env.NEXT_PUBLIC_FIREBASE_API_KEY.substring(0, 10)}...` : 'Not set',
        domain: window.location.hostname,
        protocol: window.location.protocol,
        port: window.location.port
      };

      // Browser checks
      info.browser = {
        userAgent: navigator.userAgent,
        cookiesEnabled: navigator.cookieEnabled,
        onLine: navigator.onLine,
        localStorage: typeof(Storage) !== "undefined",
        indexedDB: 'indexedDB' in window
      };

      // Firebase initialization check
      try {
        const { isDemoMode } = await import('@/lib/firebase');
        info.firebase.isDemoMode = isDemoMode;
        info.firebase.initializationSuccess = true;
      } catch (error: any) {
        info.firebase.initializationSuccess = false;
        info.firebase.initializationError = error.message;
        info.errors.push(`Firebase initialization: ${error.message}`);
      }

      // Auth check
      try {
        const { auth } = await import('@/lib/firebase');
        info.firebase.authAvailable = Boolean(auth);
        info.firebase.authConfig = auth?.config ? 'Present' : 'Missing';
      } catch (error: any) {
        info.firebase.authAvailable = false;
        info.errors.push(`Firebase Auth: ${error.message}`);
      }

      // Firestore check
      try {
        const { db } = await import('@/lib/firebase');
        info.firebase.firestoreAvailable = Boolean(db);
        info.firebase.firestoreApp = db?.app ? 'Connected' : 'Disconnected';
      } catch (error: any) {
        info.firebase.firestoreAvailable = false;
        info.errors.push(`Firestore: ${error.message}`);
      }

      // Network connectivity test
      try {
        const response = await fetch('https://www.google.com/favicon.ico', { 
          mode: 'no-cors',
          cache: 'no-cache'
        });
        info.network.internetConnection = true;
      } catch {
        info.network.internetConnection = false;
        info.errors.push('No internet connection detected');
      }

      // Firebase services reachability
      try {
        const response = await fetch('https://identitytoolkit.googleapis.com/', {
          mode: 'no-cors',
          cache: 'no-cache'
        });
        info.network.firebaseReachable = true;
      } catch {
        info.network.firebaseReachable = false;
        info.errors.push('Firebase services unreachable');
      }

    } catch (error: any) {
      info.errors.push(`Diagnostics error: ${error.message}`);
    }

    setDebugInfo(info);
    setLoading(false);
  };

  useEffect(() => {
    runDiagnostics();
  }, []);

  const getStatusIcon = (status: boolean | null) => {
    if (status === null) return <AlertTriangle className="w-4 h-4 text-yellow-500" />;
    return status ? 
      <CheckCircle className="w-4 h-4 text-green-500" /> : 
      <XCircle className="w-4 h-4 text-red-500" />;
  };

  const getStatusBadge = (status: boolean | null, trueText = 'OK', falseText = 'Error', nullText = 'Unknown') => {
    if (status === null) return <Badge variant="outline">{nullText}</Badge>;
    return status ? 
      <Badge className="bg-green-100 text-green-800">{trueText}</Badge> :
      <Badge variant="destructive">{falseText}</Badge>;
  };

  if (loading) {
    return (
      <div className="container max-w-4xl mx-auto p-6">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <RefreshCw className="w-8 h-8 animate-spin mx-auto mb-4" />
            <p>Running Firebase diagnostics...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container max-w-4xl mx-auto p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Firebase Debug Console</h1>
        <p className="text-muted-foreground">
          Diagnostic information to help troubleshoot Firebase issues.
        </p>
        <Button onClick={runDiagnostics} className="mt-4" size="sm">
          <RefreshCw className="w-4 h-4 mr-2" />
          Refresh Diagnostics
        </Button>
      </div>

      {debugInfo?.errors.length > 0 && (
        <Alert className="mb-6 border-red-200 bg-red-50">
          <AlertTriangle className="h-4 w-4 text-red-600" />
          <AlertDescription className="text-red-700">
            <strong>{debugInfo.errors.length} issue(s) detected:</strong>
            <ul className="list-disc list-inside mt-2">
              {debugInfo.errors.map((error: string, index: number) => (
                <li key={index}>{error}</li>
              ))}
            </ul>
          </AlertDescription>
        </Alert>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Environment Info */}
        <Card>
          <CardHeader>
            <CardTitle>Environment</CardTitle>
            <CardDescription>Current environment configuration</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span>Environment</span>
                <Badge variant="outline">{debugInfo?.environment.NODE_ENV}</Badge>
              </div>
              <div className="flex justify-between items-center">
                <span>Demo Mode</span>
                {getStatusBadge(debugInfo?.firebase.isDemoMode, 'Demo', 'Production')}
              </div>
              <div className="flex justify-between items-center">
                <span>Firebase Config</span>
                {getStatusBadge(debugInfo?.environment.hasFirebaseConfig, 'Present', 'Missing')}
              </div>
              <div className="flex justify-between items-center">
                <span>Domain</span>
                <code className="text-sm">{debugInfo?.environment.domain}</code>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Firebase Services */}
        <Card>
          <CardHeader>
            <CardTitle>Firebase Services</CardTitle>
            <CardDescription>Firebase initialization status</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span>Initialization</span>
                <div className="flex items-center gap-2">
                  {getStatusIcon(debugInfo?.firebase.initializationSuccess)}
                  {getStatusBadge(debugInfo?.firebase.initializationSuccess)}
                </div>
              </div>
              <div className="flex justify-between items-center">
                <span>Authentication</span>
                <div className="flex items-center gap-2">
                  {getStatusIcon(debugInfo?.firebase.authAvailable)}
                  {getStatusBadge(debugInfo?.firebase.authAvailable, 'Available', 'Error')}
                </div>
              </div>
              <div className="flex justify-between items-center">
                <span>Firestore</span>
                <div className="flex items-center gap-2">
                  {getStatusIcon(debugInfo?.firebase.firestoreAvailable)}
                  {getStatusBadge(debugInfo?.firebase.firestoreAvailable, 'Available', 'Error')}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Network Status */}
        <Card>
          <CardHeader>
            <CardTitle>Network Connectivity</CardTitle>
            <CardDescription>Internet and Firebase connectivity</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span>Internet Connection</span>
                <div className="flex items-center gap-2">
                  {getStatusIcon(debugInfo?.network.internetConnection)}
                  {getStatusBadge(debugInfo?.network.internetConnection, 'Connected', 'Offline')}
                </div>
              </div>
              <div className="flex justify-between items-center">
                <span>Firebase Services</span>
                <div className="flex items-center gap-2">
                  {getStatusIcon(debugInfo?.network.firebaseReachable)}
                  {getStatusBadge(debugInfo?.network.firebaseReachable, 'Reachable', 'Blocked')}
                </div>
              </div>
              <div className="flex justify-between items-center">
                <span>Browser Online</span>
                <div className="flex items-center gap-2">
                  {getStatusIcon(debugInfo?.browser.onLine)}
                  {getStatusBadge(debugInfo?.browser.onLine, 'Online', 'Offline')}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Browser Capabilities */}
        <Card>
          <CardHeader>
            <CardTitle>Browser Support</CardTitle>
            <CardDescription>Browser features and compatibility</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span>Cookies</span>
                <div className="flex items-center gap-2">
                  {getStatusIcon(debugInfo?.browser.cookiesEnabled)}
                  {getStatusBadge(debugInfo?.browser.cookiesEnabled, 'Enabled', 'Disabled')}
                </div>
              </div>
              <div className="flex justify-between items-center">
                <span>Local Storage</span>
                <div className="flex items-center gap-2">
                  {getStatusIcon(debugInfo?.browser.localStorage)}
                  {getStatusBadge(debugInfo?.browser.localStorage, 'Available', 'Unavailable')}
                </div>
              </div>
              <div className="flex justify-between items-center">
                <span>IndexedDB</span>
                <div className="flex items-center gap-2">
                  {getStatusIcon(debugInfo?.browser.indexedDB)}
                  {getStatusBadge(debugInfo?.browser.indexedDB, 'Available', 'Unavailable')}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Raw Debug Data */}
      {process.env.NODE_ENV === 'development' && (
        <Card className="mt-6">
          <CardHeader>
            <CardTitle>Raw Debug Data</CardTitle>
            <CardDescription>Complete diagnostic information (Development only)</CardDescription>
          </CardHeader>
          <CardContent>
            <pre className="bg-gray-100 p-4 rounded text-xs overflow-x-auto">
              {JSON.stringify(debugInfo, null, 2)}
            </pre>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
