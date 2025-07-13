
"use client";

import React, { useEffect, useState } from 'react';
import { useAuth } from '@/lib/auth-context';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Progress } from "@/components/ui/progress";
import { LogOut, Timer, Clock, AlertTriangle } from "lucide-react";

interface SessionTimeoutDialogProps {
  warningThreshold?: number; // minutes before expiry to show warning
}

export function SessionTimeoutDialog({ warningThreshold = 5 }: SessionTimeoutDialogProps) {
  const { user, isSessionValid, getSessionTimeRemaining, refreshSession, signOut } = useAuth();
  const [showWarning, setShowWarning] = useState(false);
  const [timeRemaining, setTimeRemaining] = useState(0);

  useEffect(() => {
    if (!user) return;

    const checkSession = () => {
      const remaining = getSessionTimeRemaining();
      setTimeRemaining(remaining);

      const warningTime = warningThreshold * 60 * 1000; // Convert to milliseconds
      
      if (remaining > 0 && remaining <= warningTime && isSessionValid()) {
        setShowWarning(true);
      } else {
        setShowWarning(false);
      }

      // Auto sign out if session is no longer valid
      if (!isSessionValid() && remaining <= 0) {
        signOut();
      }
    };

    // Check immediately
    checkSession();

    // Check every 30 seconds
    const interval = setInterval(checkSession, 30000);

    return () => clearInterval(interval);
  }, [user, warningThreshold, isSessionValid, getSessionTimeRemaining, signOut]);

  const handleExtendSession = async () => {
    const success = await refreshSession();
    if (success) {
      setShowWarning(false);
      setTimeRemaining(getSessionTimeRemaining());
    }
  };

  const handleSignOut = () => {
    signOut();
    setShowWarning(false);
  };

  const formatTime = (milliseconds: number): string => {
    const minutes = Math.floor(milliseconds / (1000 * 60));
    const seconds = Math.floor((milliseconds % (1000 * 60)) / 1000);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  const getProgressValue = (): number => {
    const warningTime = warningThreshold * 60 * 1000;
    return Math.max(0, (timeRemaining / warningTime) * 100);
  };

  if (!showWarning) return null;

  return (
    <AlertDialog open={showWarning}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-orange-500" />
            Session Expiring Soon
          </AlertDialogTitle>
          <AlertDialogDescription>
            Your session will expire in {formatTime(timeRemaining)}. Would you like to extend it?
          </AlertDialogDescription>
        </AlertDialogHeader>
        
        <div className="space-y-4">
          <div className="space-y-2">
            <Progress 
              value={getProgressValue()} 
              className="h-2"
            />
            <p className="text-xs text-muted-foreground text-center">
              Session timeout warning
            </p>
          </div>
        </div>

        <AlertDialogFooter>
          <AlertDialogCancel onClick={handleSignOut}>
            <LogOut className="mr-2 h-4 w-4" />
            Sign Out
          </AlertDialogCancel>
          <AlertDialogAction onClick={handleExtendSession}>
            <Timer className="mr-2 h-4 w-4" />
            Extend Session
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

// Session status indicator component
export function SessionStatusIndicator() {
  const { user, isSessionValid, getSessionTimeRemaining } = useAuth();
  const [timeRemaining, setTimeRemaining] = useState(0);

  useEffect(() => {
    if (!user) return;

    const updateTime = () => {
      setTimeRemaining(getSessionTimeRemaining());
    };

    updateTime();
    const interval = setInterval(updateTime, 1000); // Update every second

    return () => clearInterval(interval);
  }, [user, getSessionTimeRemaining]);

  if (!user || !isSessionValid()) return null;

  const minutes = Math.floor(timeRemaining / (1000 * 60));
  const hours = Math.floor(minutes / 60);
  const displayMinutes = minutes % 60;

  const getStatusColor = () => {
    if (minutes <= 5) return 'text-red-500';
    if (minutes <= 15) return 'text-orange-500';
    return 'text-green-500';
  };

  const getStatusText = () => {
    if (hours > 0) {
      return `${hours}h ${displayMinutes}m`;
    }
    return `${minutes}m`;
  };

  return (
    <div className="flex items-center gap-1 text-xs">
      <Clock className={`h-3 w-3 ${getStatusColor()}`} />
      <span className={`${getStatusColor()} font-medium`}>
        {getStatusText()}
      </span>
    </div>
  );
}
