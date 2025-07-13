
"use client";

import { useState, useEffect, useRef, useCallback } from "react";

const IDLE_TIMEOUT_MS = 15 * 60 * 1000; // 15 minutes
const COUNTDOWN_SECONDS = 30; // 30 seconds warning

interface UseSessionTimeoutProps {
  onLogout: () => void;
}

export const useSessionTimeout = ({ onLogout }: UseSessionTimeoutProps) => {
  const [isIdle, setIsIdle] = useState(false);
  const [countdown, setCountdown] = useState(COUNTDOWN_SECONDS);

  const idleTimerRef = useRef<NodeJS.Timeout>();
  const countdownTimerRef = useRef<NodeJS.Timeout>();

  const handleLogout = useCallback(async () => {
    try {
      await onLogout();
    } catch (error) {
      console.error('Session timeout logout error:', error);
    }
  }, [onLogout]);

  const resetTimers = useCallback(() => {
    clearTimeout(idleTimerRef.current);
    clearInterval(countdownTimerRef.current);

    idleTimerRef.current = setTimeout(() => {
      setIsIdle(true);
    }, IDLE_TIMEOUT_MS);
  }, []);
  
  const reset = useCallback(() => {
    setIsIdle(false);
    setCountdown(COUNTDOWN_SECONDS);
    resetTimers();
  }, [resetTimers]);

  useEffect(() => {
    const events = [
      "mousemove",
      "keydown",
      "click",
      "scroll",
      "touchstart",
    ];

    const eventHandler = () => {
      reset();
    };

    events.forEach((event) => {
      window.addEventListener(event, eventHandler);
    });

    reset(); // Initial setup

    return () => {
      events.forEach((event) => {
        window.removeEventListener(event, eventHandler);
      });
      clearTimeout(idleTimerRef.current);
      clearInterval(countdownTimerRef.current);
    };
  }, [reset]);

  useEffect(() => {
    if (isIdle) {
      countdownTimerRef.current = setInterval(() => {
        setCountdown((prev) => {
          if (prev <= 1) {
            clearInterval(countdownTimerRef.current);
            // Use setTimeout to avoid calling handleLogout during render
            setTimeout(() => handleLogout(), 0);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }

    return () => {
      clearInterval(countdownTimerRef.current);
    };
  }, [isIdle, handleLogout]);

  return { isIdle, countdown, reset };
};
