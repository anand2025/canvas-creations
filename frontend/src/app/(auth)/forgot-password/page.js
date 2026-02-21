"use client";
import React, { useState } from 'react';
import Link from 'next/link';
import { api } from '@/services/api';
import { toast } from 'react-hot-toast';

const ForgotPasswordPage = () => {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState({ type: '', message: '' });
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setStatus({ type: '', message: '' });
    const loadToast = toast.loading("Sending reset link...");

    try {
      const response = await api.post('/auth/forgot-password', { email });
      setStatus({ type: 'success', message: response.message });
      toast.success("Reset link sent to your email!", { id: loadToast });
    } catch (error) {
      const msg = error.message || "Something went wrong. Please try again.";
      setStatus({ type: 'error', message: msg });
      toast.error(msg, { id: loadToast });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-12">
      <div className="max-w-md w-full space-y-8 bg-card p-8 rounded-3xl shadow-2xl border border-[var(--border-color)] relative overflow-hidden">
        {/* Artistic Background Element */}
        <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-vibrant-pink/20 to-vibrant-orange/20 rounded-full -mr-16 -mt-16 blur-3xl"></div>
        <div className="absolute bottom-0 left-0 w-32 h-32 bg-gradient-to-tr from-vibrant-teal/20 to-vibrant-blue/20 rounded-full -ml-16 -mb-16 blur-3xl"></div>

        <div className="relative z-10 text-center">
          <h2 className="text-4xl font-black text-foreground tracking-tight">Forgot Password?</h2>
          <p className="mt-3 text-foreground/60 text-sm">
            No worries! Enter your email and we&apos;ll send you a link to reset your password.
          </p>
        </div>

        <form className="mt-8 space-y-6 relative z-10" onSubmit={handleSubmit}>
          <div>
            <label htmlFor="email" className="block text-sm font-bold text-foreground/70 ml-1 mb-2">
              Email Address
            </label>
            <input
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="appearance-none block w-full px-4 py-3 border border-[var(--border-color)] rounded-2xl bg-secondary-bg text-foreground placeholder-foreground/30 focus:outline-none focus:ring-2 focus:ring-vibrant-pink transition-all"
              placeholder="you@example.com"
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

          <div className="flex flex-col space-y-4">
            <button
              type="submit"
              disabled={isLoading}
              className="group relative w-full flex justify-center py-4 px-4 border border-transparent text-sm font-black rounded-2xl text-white bg-gradient-to-r from-vibrant-pink to-vibrant-orange hover:shadow-xl hover:scale-[1.02] active:scale-95 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
              ) : "Send Reset Link"}
            </button>

            <Link 
              href="/login" 
              className="text-center text-sm font-bold text-vibrant-pink hover:text-vibrant-orange transition-colors"
            >
              Back to Login
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ForgotPasswordPage;
