'use client';

import React, { Component, ErrorInfo, ReactNode } from 'react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { AlertTriangle, RefreshCw, ExternalLink } from 'lucide-react';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
}

export class FirebaseErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error, errorInfo: null };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Firebase Error Boundary caught an error:', error, errorInfo);
    this.setState({ error, errorInfo });
  }

  render() {
    if (this.state.hasError) {
      const isFirebaseError = this.state.error?.message?.includes('Firebase') || 
                              this.state.error?.stack?.includes('firebase') ||
                              this.state.error?.name === 'FirebaseError';

      return (
        <div className="container max-w-4xl mx-auto p-6">
          <Alert className="border-red-200 bg-red-50 mb-6">
            <AlertTriangle className="h-4 w-4 text-red-600" />
            <AlertTitle className="text-red-800">
              {isFirebaseError ? 'Firebase Error Detected' : 'Application Error'}
            </AlertTitle>
            <AlertDescription className="text-red-700">
              {isFirebaseError 
                ? 'There was an issue with Firebase initialization or authentication.'
                : 'An unexpected error occurred in the application.'
              }
            </AlertDescription>
          </Alert>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <AlertTriangle className="w-5 h-5 text-red-500" />
                Error Details
              </CardTitle>
              <CardDescription>
                Information about the error that occurred
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <h4 className="font-medium text-sm mb-2">Error Message:</h4>
                  <code className="block bg-gray-100 p-3 rounded text-sm break-words">
                    {this.state.error?.message || 'Unknown error'}
                  </code>
                </div>

                {this.state.error?.name && (
                  <div>
                    <h4 className="font-medium text-sm mb-2">Error Type:</h4>
                    <code className="bg-gray-100 px-2 py-1 rounded text-sm">
                      {this.state.error.name}
                    </code>
                  </div>
                )}

                {isFirebaseError && (
                  <div className="bg-blue-50 p-4 rounded">
                    <h4 className="font-medium text-blue-800 mb-2">🔧 Common Firebase Solutions:</h4>
                    <ul className="list-disc list-inside text-sm text-blue-700 space-y-1">
                      <li>Check your internet connection</li>
                      <li>Verify Firebase configuration in environment variables</li>
                      <li>Make sure your domain is authorized in Firebase Console</li>
                      <li>Try refreshing the page</li>
                      <li>Clear browser cache and cookies</li>
                      <li>Use demo mode for testing (student@demo.com / password123)</li>
                    </ul>
                  </div>
                )}

                <div className="flex flex-wrap gap-3">
                  <Button 
                    onClick={() => window.location.reload()}
                    className="flex items-center gap-2"
                  >
                    <RefreshCw className="w-4 h-4" />
                    Reload Page
                  </Button>
                  
                  <Button 
                    variant="outline"
                    onClick={() => this.setState({ hasError: false, error: null, errorInfo: null })}
                  >
                    Try Again
                  </Button>

                  <Button 
                    variant="outline"
                    onClick={() => window.open('/firebase-setup', '_blank')}
                  >
                    <ExternalLink className="w-4 h-4 mr-2" />
                    Firebase Setup Guide
                  </Button>
                </div>

                {process.env.NODE_ENV === 'development' && this.state.error?.stack && (
                  <details className="mt-4">
                    <summary className="cursor-pointer font-medium text-sm">
                      🔍 Stack Trace (Development Only)
                    </summary>
                    <pre className="mt-2 bg-gray-100 p-3 rounded text-xs overflow-x-auto whitespace-pre-wrap">
                      {this.state.error.stack}
                    </pre>
                  </details>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      );
    }

    return this.props.children;
  }
}
