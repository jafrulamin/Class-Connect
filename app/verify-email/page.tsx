'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/AuthContext';
import { resendVerificationEmail, checkEmailVerification } from '@/lib/authHelpers';

export default function VerifyEmailPage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [isResending, setIsResending] = useState(false);
  const [resendSuccess, setResendSuccess] = useState(false);
  const [resendError, setResendError] = useState('');
  const [isChecking, setIsChecking] = useState(false);

  useEffect(() => {
    // Redirect if not logged in
    if (!loading && !user) {
      router.push('/');
      return;
    }

    // Redirect if email is already verified
    if (user?.emailVerified) {
      router.push('/dashboard');
    }
  }, [user, loading, router]);

  const handleResendEmail = async () => {
    if (!user) return;

    setIsResending(true);
    setResendError('');
    setResendSuccess(false);

    try {
      await resendVerificationEmail(user);
      setResendSuccess(true);
      
      // Hide success message after 5 seconds
      setTimeout(() => {
        setResendSuccess(false);
      }, 5000);
    } catch (error: any) {
      if (error.code === 'auth/too-many-requests') {
        setResendError('Too many requests. Please wait a few minutes before trying again.');
      } else {
        setResendError('Failed to resend email. Please try again later.');
      }
    } finally {
      setIsResending(false);
    }
  };

  const handleCheckVerification = async () => {
    setIsChecking(true);
    setResendError('');

    try {
      const isVerified = await checkEmailVerification();
      
      if (isVerified) {
        router.push('/dashboard');
      } else {
        setResendError('Email not verified yet. Please check your inbox and click the verification link.');
      }
    } catch (error) {
      setResendError('Failed to check verification status. Please try again.');
    } finally {
      setIsChecking(false);
    }
  };

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

  return (
    <div className="min-h-screen flex items-center justify-center bg-linear-to-br from-blue-50 via-white to-indigo-50 p-4">
      <div className="max-w-md w-full">
        {/* Card */}
        <div className="bg-white rounded-2xl shadow-xl p-8">
          {/* Icon */}
          <div className="w-20 h-20 bg-linear-to-r from-blue-600 to-indigo-600 rounded-full flex items-center justify-center mx-auto mb-6">
            <span className="text-white text-4xl">📧</span>
          </div>

          {/* Title */}
          <h1 className="text-3xl font-bold text-gray-900 text-center mb-4">
            Verify Your Email
          </h1>

          {/* Description */}
          <p className="text-gray-600 text-center mb-6">
            We've sent a verification email to:
          </p>
          <p className="text-blue-600 font-semibold text-center mb-8">
            {user?.email}
          </p>

          {/* Instructions */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
            <p className="text-sm text-gray-700 mb-2">
              <strong>Next steps:</strong>
            </p>
            <ol className="text-sm text-gray-700 space-y-2 list-decimal list-inside">
              <li>Check your email inbox (and spam folder)</li>
              <li>Click the verification link in the email</li>
              <li>Return here and click "I've Verified My Email"</li>
            </ol>
          </div>

          {/* Success Message */}
          {resendSuccess && (
            <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-lg">
              <p className="text-sm text-green-600 flex items-center">
                <span className="mr-2">✅</span>
                Verification email sent! Check your inbox.
              </p>
            </div>
          )}

          {/* Error Message */}
          {resendError && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-sm text-red-600 flex items-center">
                <span className="mr-2">⚠️</span>
                {resendError}
              </p>
            </div>
          )}

          {/* Check Verification Button */}
          <button
            onClick={handleCheckVerification}
            disabled={isChecking}
            className="w-full bg-linear-to-r from-blue-600 to-indigo-600 text-white py-3 px-4 rounded-lg font-semibold hover:from-blue-700 hover:to-indigo-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl mb-3"
          >
            {isChecking ? (
              <div className="flex items-center justify-center">
                <div className="w-5 h-5 border-t-2 border-white border-solid rounded-full animate-spin mr-2"></div>
                Checking...
              </div>
            ) : (
              "I've Verified My Email"
            )}
          </button>

          {/* Resend Email Button */}
          <button
            onClick={handleResendEmail}
            disabled={isResending || resendSuccess}
            className="w-full bg-white text-gray-700 py-3 px-4 rounded-lg font-medium border border-gray-300 hover:bg-gray-50 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isResending ? (
              <div className="flex items-center justify-center">
                <div className="w-5 h-5 border-t-2 border-gray-700 border-solid rounded-full animate-spin mr-2"></div>
                Sending...
              </div>
            ) : (
              'Resend Verification Email'
            )}
          </button>

          {/* Back to Home */}
          <div className="mt-6 text-center">
            <button
              onClick={() => router.push('/')}
              className="text-sm text-gray-600 hover:text-gray-800"
            >
              ← Back to Home
            </button>
          </div>
        </div>

        {/* Help Text */}
        <div className="mt-6 text-center">
          <p className="text-sm text-gray-600">
            Having trouble? Make sure to check your spam folder.
          </p>
        </div>
      </div>
    </div>
  );
}

