"use client"

import { useEffect, ReactNode } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth-context';
import { BookOpenCheck } from 'lucide-react';

interface ProtectedRouteProps {
  children: ReactNode;
  requiredRole?: 'student' | 'teacher' | 'admin';
}

export default function ProtectedRoute({ children, requiredRole }: ProtectedRouteProps) {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading) {
      if (!user) {
        // User is not authenticated, redirect to login
        router.push('/login');
        return;
      }

      if (requiredRole && user?.role !== requiredRole) {
        // User doesn't have the required role, redirect to dashboard
        router.push('/dashboard');
        return;
      }
    }
  }, [user, loading, requiredRole, router]);

  // Show loading while checking authentication
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-background">
        <div className="text-center">
          <BookOpenCheck className="h-12 w-12 text-primary mx-auto mb-4 animate-pulse" />
          <p>Loading...</p>
        </div>
      </div>
    );
  }

  // Don't render children if user is not authenticated
  if (!user) {
    return null;
  }

  // Don't render children if user doesn't have required role
  if (requiredRole && user?.role !== requiredRole) {
    return null;
  }

  return <>{children}</>;
}
