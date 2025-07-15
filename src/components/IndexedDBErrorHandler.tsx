"use client";

import { useEffect } from 'react';
import { isIndexedDBCorruption, handleIndexedDBCorruption } from '@/lib/firebase-indexeddb-handler';

export function IndexedDBErrorHandler() {
  useEffect(() => {
    // Global error handler for unhandled IndexedDB errors
    const handleError = (event: ErrorEvent) => {
      if (isIndexedDBCorruption(event.error)) {
        console.warn('🚨 Unhandled IndexedDB error detected:', event.error);
        event.preventDefault(); // Prevent default error handling
        handleIndexedDBCorruption();
      }
    };

    // Global unhandled rejection handler
    const handleUnhandledRejection = (event: PromiseRejectionEvent) => {
      if (isIndexedDBCorruption(event.reason)) {
        console.warn('🚨 Unhandled IndexedDB promise rejection:', event.reason);
        event.preventDefault(); // Prevent default error handling
        handleIndexedDBCorruption();
      }
    };

    // Add event listeners
    window.addEventListener('error', handleError);
    window.addEventListener('unhandledrejection', handleUnhandledRejection);

    // Cleanup
    return () => {
      window.removeEventListener('error', handleError);
      window.removeEventListener('unhandledrejection', handleUnhandledRejection);
    };
  }, []);

  return null; // This component doesn't render anything
}

// Hook to manually handle IndexedDB errors
export function useIndexedDBErrorHandler() {
  return {
    handleError: (error: any) => {
      if (isIndexedDBCorruption(error)) {
        handleIndexedDBCorruption();
        return true; // Indicates error was handled
      }
      return false; // Indicates error was not handled
    },
    isIndexedDBError: isIndexedDBCorruption,
  };
}
