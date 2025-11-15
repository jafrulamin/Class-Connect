'use client';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/AuthContext';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requireVerified?: boolean;
}

export default function ProtectedRoute({ 
  children, 
  requireVerified = true 
}: ProtectedRouteProps) {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading) {
      // Not logged in - redirect to home
      if (!user) {
        router.push('/');
        return;
      }

      // TEMPORARILY DISABLED: Email verification check for testing
      // Allow all logged-in users to access protected routes
      // if (requireVerified && !user.emailVerified) {
      //   router.push('/verify-email');
      //   return;
      // }
    }
  }, [user, loading, requireVerified, router]);

  // Show loading state while checking authentication
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-linear-to-br from-blue-50 via-white to-indigo-50">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  // Don't render children if not authenticated
  // TEMPORARILY DISABLED: Email verification requirement for testing
  if (!user) {
    return null;
  }

  // User is authenticated - render the protected content
  return <>{children}</>;
}

