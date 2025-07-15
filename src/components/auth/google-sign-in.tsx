"use client";

import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/lib/auth-context';
import { 
  signInWithGoogle, 
  signInWithGoogleRedirect, 
  handleGoogleRedirect,
  checkGoogleStatus 
} from '@/lib/google-auth';

interface GoogleSignInProps {
  onSuccess?: (result: any) => void;
  onError?: (error: Error) => void;
  className?: string;
  disabled?: boolean;
  size?: 'sm' | 'default' | 'lg';
  variant?: 'default' | 'outline' | 'ghost';
  redirectMode?: boolean; // Force redirect instead of popup
}

export function GoogleSignInButton({ 
  onSuccess, 
  onError, 
  className = '',
  disabled = false,
  size = 'default',
  variant = 'outline',
  redirectMode = false
}: GoogleSignInProps) {
  const [loading, setLoading] = useState(false);
  const [googleAvailable, setGoogleAvailable] = useState(true);
  const [statusMessage, setStatusMessage] = useState('');
  const { toast } = useToast();
  const { isDemoMode, signInWithGoogle } = useAuth();

  // Check Google provider status on mount
  useEffect(() => {
    checkGoogleProviderAvailability();
  }, []);

  // Handle redirect result on mount
  useEffect(() => {
    handleRedirectOnMount();
  }, []);

  const checkGoogleProviderAvailability = async () => {
    try {
      // In demo mode, Google auth is not available
      if (isDemoMode) {
        setGoogleAvailable(false);
        setStatusMessage('Google sign-in not available in demo mode');
        return;
      }
      
      const status = await checkGoogleStatus();
      setGoogleAvailable(status.available && status.configured);
      
      if (!status.available || !status.configured) {
        setStatusMessage(status.error || 'Google sign-in not available');
      }
    } catch (error) {
      console.error('Failed to check Google status:', error);
      setGoogleAvailable(false);
      setStatusMessage('Unable to verify Google sign-in availability');
    }
  };

  const handleRedirectOnMount = async () => {
    try {
      const result = await handleGoogleRedirect();
      if (result) {
        console.log('✅ Google redirect sign-in completed');
        
        // Convert to auth context User format
        const user = {
          uid: result.user.uid,
          email: result.user.email,
          displayName: result.user.displayName || result.user.email,
          role: result.profile?.role || 'student',
          photoURL: result.user.photoURL,
          createdAt: new Date(),
          lastLogin: new Date()
        };
        
        toast({
          title: "Welcome!",
          description: `Signed in successfully as ${user.displayName}`,
        });
        
        onSuccess?.(user);
      }
    } catch (error: any) {
      console.error('❌ Google redirect failed:', error);
      
      toast({
        title: "Sign-in Error",
        description: error.message,
        variant: "destructive",
      });
      
      onError?.(error);
    }
  };

  const handleGoogleSignIn = async () => {
    if (!googleAvailable) {
      toast({
        title: "Google Sign-in Unavailable",
        description: statusMessage || "Google authentication is not properly configured.",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);

    try {
      // Use the auth context's signInWithGoogle function
      const result = await signInWithGoogle();
      
      console.log('✅ Google sign-in successful:', result.email);
      
      toast({
        title: "Welcome!",
        description: `Signed in successfully as ${result.displayName}`,
      });
      
      // Call the onSuccess callback with the result
      onSuccess?.(result);

    } catch (error: any) {
      console.error('❌ Google sign-in failed:', error);
      
      // Handle enhanced error details
      const errorTitle = error.title || "Sign-in Failed";
      const errorMessage = error.message;
      
      toast({
        title: errorTitle,
        description: errorMessage,
        variant: "destructive",
      });
      
      onError?.(error);
      
    } finally {
      setLoading(false);
    }
  };

  // Don't render if Google is not available
  if (!googleAvailable) {
    return (
      <Button 
        variant="outline" 
        disabled 
        className={`w-full ${className}`}
        title={statusMessage}
      >
        <svg className="w-4 h-4 mr-2" viewBox="0 0 24 24">
          <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
          <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
          <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
          <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
        </svg>
        Google Sign-in Unavailable
      </Button>
    );
  }

  return (
    <Button
      type="button"
      variant={variant}
      size={size}
      onClick={handleGoogleSignIn}
      disabled={disabled || loading}
      className={`w-full ${className}`}
    >
      {loading ? (
        <>
          <div className="w-4 h-4 mr-2 animate-spin rounded-full border-2 border-gray-300 border-t-gray-600"></div>
          Signing in...
        </>
      ) : (
        <>
          <svg className="w-4 h-4 mr-2" viewBox="0 0 24 24">
            <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
            <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
            <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
            <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
          </svg>
          Continue with Google
        </>
      )}
    </Button>
  );
}

// Alternative compact version for smaller spaces
export function GoogleSignInIconButton({ 
  onSuccess, 
  onError, 
  className = '',
  disabled = false 
}: Omit<GoogleSignInProps, 'size' | 'variant'>) {
  return (
    <GoogleSignInButton
      onSuccess={onSuccess}
      onError={onError}
      className={className}
      disabled={disabled}
      size="sm"
      variant="ghost"
    />
  );
}
