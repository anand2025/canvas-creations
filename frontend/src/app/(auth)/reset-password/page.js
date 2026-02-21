"use client";
import React, { useState, useEffect, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { api } from '@/services/api';
import { toast } from 'react-hot-toast';

const ResetPasswordContent = () => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const token = searchParams.get('token');

  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [status, setStatus] = useState({ type: '', message: '' });
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (!token) {
      setStatus({ type: 'error', message: 'Invalid or missing reset token.' });
    }
  }, [token]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      const msg = 'Passwords do not match.';
      toast.error(msg);
      return setStatus({ type: 'error', message: msg });
    }
    if (password.length < 8) {
      const msg = 'Password must be at least 8 characters long.';
      toast.error(msg);
      return setStatus({ type: 'error', message: msg });
    }

    setIsLoading(true);
    setStatus({ type: '', message: '' });
    const loadToast = toast.loading("Updating password...");

    try {
      await api.post('/auth/reset-password', { token, new_password: password });
      const successMsg = 'Password reset successfully! Redirecting to login...';
      setStatus({ type: 'success', message: successMsg });
      toast.success("Password updated! Logging you in...", { id: loadToast });
      setTimeout(() => router.push('/login'), 2000);
    } catch (error) {
      const errorMsg = error.message || "Failed to reset password. The link may have expired.";
      setStatus({ type: 'error', message: errorMsg });
      toast.error(errorMsg, { id: loadToast });
    } finally {
      setIsLoading(false);
    }
  };

  if (!token && status.type === 'error') {
    return (
      <div className="min-h-[80vh] flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-card p-8 rounded-3xl shadow-2xl border border-[var(--border-color)] text-center">
          <h2 className="text-2xl font-black text-red-500 mb-4">Error</h2>
          <p className="text-foreground/60 mb-6">{status.message}</p>
          <button 
             onClick={() => router.push('/forgot-password')}
             className="px-6 py-3 bg-vibrant-pink text-white rounded-xl font-bold"
          >
            Request New Link
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-12">
      <div className="max-w-md w-full space-y-8 bg-card p-8 rounded-3xl shadow-2xl border border-[var(--border-color)] relative overflow-hidden">
        <div className="absolute top-0 left-0 w-32 h-32 bg-gradient-to-br from-vibrant-teal/20 to-vibrant-blue/20 rounded-full -ml-16 -mt-16 blur-3xl"></div>
        
        <div className="relative z-10 text-center">
          <h2 className="text-4xl font-black text-foreground tracking-tight">Set New Password</h2>
          <p className="mt-3 text-foreground/60 text-sm">
            Choose a new secure password for your account.
          </p>
        </div>

        <form className="mt-8 space-y-5 relative z-10" onSubmit={handleSubmit}>
          <div>
            <label className="block text-sm font-bold text-foreground/70 ml-1 mb-2">
              New Password
            </label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="appearance-none block w-full px-4 py-3 border border-[var(--border-color)] rounded-2xl bg-secondary-bg text-foreground placeholder-foreground/30 focus:outline-none focus:ring-2 focus:ring-vibrant-teal transition-all"
              placeholder="••••••••"
            />
          </div>

          <div>
            <label className="block text-sm font-bold text-foreground/70 ml-1 mb-2">
              Confirm New Password
            </label>
            <input
              type="password"
              required
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="appearance-none block w-full px-4 py-3 border border-[var(--border-color)] rounded-2xl bg-secondary-bg text-foreground placeholder-foreground/30 focus:outline-none focus:ring-2 focus:ring-vibrant-teal transition-all"
              placeholder="••••••••"
            />
          </div>

          {status.message && (
            <div className={`p-4 rounded-2xl text-sm font-medium ${
              status.type === 'success' 
                ? 'bg-green-500/10 text-green-500 border border-green-500/20' 
                : 'bg-red-500/10 text-red-500 border border-red-500/20'
            }`}>
              {status.message}
            </div>
          )}

          <button
            type="submit"
            disabled={isLoading}
            className="w-full flex justify-center py-4 px-4 border border-transparent text-sm font-black rounded-2xl text-white bg-gradient-to-r from-vibrant-teal to-vibrant-blue hover:shadow-xl hover:scale-[1.02] active:scale-95 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? (
              <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
            ) : "Update Password"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default function ResetPasswordPage() {
  return (
    <Suspense fallback={
      <div className="min-h-[80vh] flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-vibrant-teal/20 border-t-vibrant-teal rounded-full animate-spin"></div>
      </div>
    }>
      <ResetPasswordContent />
    </Suspense>
  );
}
