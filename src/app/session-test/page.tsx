"use client";

import { useAuth } from '@/lib/auth-context';
import { SessionTimeoutDialog, SessionStatusIndicator } from '@/components/session-timeout-dialog';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Shield, Clock, User, LogOut, RefreshCw } from 'lucide-react';

export default function SessionTestPage() {
  const { 
    user, 
    signOut, 
    isSessionValid, 
    getSessionTimeRemaining, 
    refreshSession,
    isDemoMode 
  } = useAuth();

  if (!user) {
    return (
      <div className="container mx-auto py-8">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="h-5 w-5" />
              Access Denied
            </CardTitle>
            <CardDescription>
              You need to be logged in to view this page.
            </CardDescription>
          </CardHeader>
        </Card>
      </div>
    );
  }

  const timeRemaining = getSessionTimeRemaining();
  const isValid = isSessionValid();
  const minutes = Math.floor(timeRemaining / (1000 * 60));
  const hours = Math.floor(minutes / 60);
  const displayMinutes = minutes % 60;

  const formatTimeRemaining = () => {
    if (hours > 0) {
      return `${hours}h ${displayMinutes}m`;
    }
    return `${minutes}m`;
  };

  const handleRefreshSession = async () => {
    const success = await refreshSession();
    if (success) {
      alert('Session refreshed successfully!');
    } else {
      alert('Failed to refresh session');
    }
  };

  return (
    <div className="container mx-auto py-8 space-y-6">
      <SessionTimeoutDialog />
      
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Security Session Demo</h1>
        <SessionStatusIndicator />
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="h-5 w-5" />
              User Information
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <p><strong>Name:</strong> {user.displayName}</p>
              <p><strong>Email:</strong> {user.email}</p>
              <p><strong>Role:</strong> 
                <Badge variant="secondary" className="ml-2">
                  {user.role}
                </Badge>
              </p>
              <p><strong>Mode:</strong> 
                <Badge variant={isDemoMode ? "outline" : "default"} className="ml-2">
                  {isDemoMode ? "Demo" : "Live"}
                </Badge>
              </p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="h-5 w-5" />
              Session Status
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <p><strong>Session Valid:</strong> 
                <Badge variant={isValid ? "default" : "destructive"} className="ml-2">
                  {isValid ? "Yes" : "No"}
                </Badge>
              </p>
              <p><strong>Time Remaining:</strong> 
                <span className="ml-2 font-mono">{formatTimeRemaining()}</span>
              </p>
              {user.sessionData && (
                <>
                  <p><strong>Created:</strong> 
                    <span className="ml-2 text-sm">
                      {new Date(user.sessionData.createdAt).toLocaleString()}
                    </span>
                  </p>
                  <p><strong>Last Activity:</strong> 
                    <span className="ml-2 text-sm">
                      {new Date(user.sessionData.lastActivity).toLocaleString()}
                    </span>
                  </p>
                </>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Session Actions</CardTitle>
          <CardDescription>
            Test session management functionality
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4">
            <Button onClick={handleRefreshSession} variant="outline">
              <RefreshCw className="h-4 w-4 mr-2" />
              Refresh Session
            </Button>
            <Button onClick={signOut} variant="destructive">
              <LogOut className="h-4 w-4 mr-2" />
              Sign Out
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Security Features Implemented</CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="space-y-2 text-sm">
            <li className="flex items-center gap-2">
              <Shield className="h-4 w-4 text-green-500" />
              Route protection based on user roles
            </li>
            <li className="flex items-center gap-2">
              <Clock className="h-4 w-4 text-green-500" />
              Session timeout with automatic expiry
            </li>
            <li className="flex items-center gap-2">
              <RefreshCw className="h-4 w-4 text-green-500" />
              Session refresh capability
            </li>
            <li className="flex items-center gap-2">
              <User className="h-4 w-4 text-green-500" />
              Role-based access control (RBAC)
            </li>
            <li className="flex items-center gap-2">
              <Shield className="h-4 w-4 text-green-500" />
              Security headers (CSP, HSTS, XSS protection)
            </li>
            <li className="flex items-center gap-2">
              <Clock className="h-4 w-4 text-green-500" />
              Activity timeout detection
            </li>
          </ul>
        </CardContent>
      </Card>
    </div>
  );
}
