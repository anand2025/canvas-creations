"use client";
import React, { useEffect, useState, useRef, Suspense, useCallback } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import AuthLayout from "@/components/layout/AuthLayout";
import { api } from '@/services/api';
import { toast } from 'react-hot-toast';
import Link from 'next/link';

function VerifyEmailContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const token = searchParams.get('token');
  const [status, setStatus] = useState('verifying'); // verifying, success, error
  const [message, setMessage] = useState('');
  const verificationStarted = useRef(false);

  const handleVerification = useCallback(async () => {
    try {
      const response = await api.post('/auth/verify-email', { token });
      setStatus('success');
      setMessage(response.message || 'Email verified successfully!');
      toast.success("Account activated! Redirecting to login...", {
          icon: '✨',
          duration: 3000
      });
      setTimeout(() => router.push('/login'), 4000);
    } catch (err) {
      setStatus('error');
      setMessage(err.message || 'Verification failed. The link might be expired or invalid.');
      toast.error("Verification failed");
    }
  }, [token, router]);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (token && !verificationStarted.current) {
          verificationStarted.current = true;
          handleVerification();
      } else if (!token && !verificationStarted.current) {
          verificationStarted.current = true;
          setStatus('error');
          setMessage('No verification token found. Please check your link.');
      }
    }, 0);
    return () => clearTimeout(timer);
  }, [token, handleVerification]);

  return (
    <AuthLayout 
      title="Finalizing Your Account."
      subtitle="Just a moment as we verify your credentials and prepare your artistic canvas."
      image="https://images.unsplash.com/photo-1541963463532-d68292c34b19?w=1200&auto=format&fit=crop&q=80"
    >
      <div className="flex flex-col items-center justify-center text-center space-y-8 animate-in fade-in zoom-in duration-700">
        
        {status === 'verifying' && (
          <div className="space-y-6">
            <div className="w-20 h-20 border-4 border-vibrant-teal/20 border-t-vibrant-teal rounded-full animate-spin mx-auto"></div>
            <h1 className="text-3xl font-black uppercase tracking-tighter">Verifying Your Email...</h1>
            <p className="text-foreground/50 font-bold uppercase tracking-widest text-xs">Connecting to the art server</p>
          </div>
        )}

        {status === 'success' && (
          <div className="space-y-6">
             <div className="w-24 h-24 bg-vibrant-teal/10 rounded-full flex items-center justify-center mx-auto mb-4 border-2 border-dashed border-vibrant-teal/30 scale-110">
               <svg className="w-12 h-12 text-vibrant-teal" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7"></path></svg>
            </div>
            <h1 className="text-4xl font-black uppercase tracking-tighter text-vibrant-teal">ACCOUNT ACTIVATED!</h1>
            <p className="text-foreground/60 font-bold leading-relaxed max-w-xs mx-auto">
              Your email has been successfully verified. Welcome to the CanvasCreations family!
            </p>
            <div className="pt-4">
              <Link href="/login" className="px-10 py-4 rounded-2xl bg-vibrant-teal text-white font-black uppercase tracking-widest hover:shadow-[0_15px_30px_rgba(45,212,191,0.3)] hover:-translate-y-1 transition-all block">
                Go to Login
              </Link>
            </div>
          </div>
        )}

        {status === 'error' && (
          <div className="space-y-6">
             <div className="w-24 h-24 bg-rose-500/10 rounded-full flex items-center justify-center mx-auto mb-4 border-2 border-dashed border-rose-500/30">
               <svg className="w-12 h-12 text-rose-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M6 18L18 6M6 6l12 12"></path></svg>
            </div>
            <h1 className="text-4xl font-black uppercase tracking-tighter text-rose-500">LINK EXPIRED.</h1>
            <p className="text-foreground/60 font-bold leading-relaxed max-w-xs mx-auto">
              {message}
            </p>
            <div className="pt-4 flex flex-col gap-4">
              <Link href="/register" className="px-10 py-4 rounded-2xl bg-rose-500 text-white font-black uppercase tracking-widest hover:shadow-[0_15px_30px_rgba(244,63,94,0.3)] hover:-translate-y-1 transition-all block">
                Try Registering Again
              </Link>
               <Link href="/login" className="text-xs font-black uppercase tracking-widest text-foreground/40 hover:text-vibrant-teal underline transition-colors">
                Return to Login
              </Link>
            </div>
          </div>
        )}

      </div>
    </AuthLayout>
  );
}

export default function VerifyEmailPage() {
    return (
        <Suspense fallback={
            <div className="min-h-screen flex items-center justify-center bg-background">
                <div className="w-20 h-20 border-4 border-vibrant-teal/20 border-t-vibrant-teal rounded-full animate-spin"></div>
            </div>
        }>
            <VerifyEmailContent />
        </Suspense>
    );
}
