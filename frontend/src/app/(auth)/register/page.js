"use client";
import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import AuthLayout from "@/components/layout/AuthLayout";
import { registerUser } from '@/services/api';
import { toast } from 'react-hot-toast';

export default function RegisterPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await registerUser({
        name: formData.name,
        email: formData.email,
        password: formData.password,
        role: "customer" // Default role
      });
      setSuccess(true);
      toast.success("Registration successful! Please check your email.", {
        duration: 5000,
        icon: '✉️',
      });
      // No automatic redirect, user needs to wait for email
    } catch (err) {
      setError(err.message || "Registration failed. Check your details.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout 
      title="Join the Creative Revolution."
      subtitle="Start your journey today and connect with a global community of artists and collectors."
      image="https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?w=1200&auto=format&fit=crop&q=80"
    >
      <div className="space-y-8">
        <div>
          <h1 className="text-4xl font-black tracking-tight mb-2">JOIN US.</h1>
          <p className="text-foreground/50 font-medium">Already have an account? <Link href="/login" className="text-vibrant-teal hover:underline">Login here</Link></p>
        </div>

        {error && (
          <div className="p-4 bg-red-50 border border-red-200 text-red-600 rounded-xl text-sm font-medium">
            {error}
          </div>
        )}

        {success && (
          <div className="p-8 bg-vibrant-teal/5 border-2 border-dashed border-vibrant-teal/30 rounded-[32px] text-center space-y-4 animate-in zoom-in duration-500">
            <div className="w-16 h-16 bg-vibrant-teal/20 rounded-full flex items-center justify-center mx-auto mb-4">
               <svg className="w-8 h-8 text-vibrant-teal" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path></svg>
            </div>
            <h3 className="text-xl font-black uppercase text-vibrant-teal">Verification Sent!</h3>
            <p className="text-foreground/60 font-bold text-sm leading-relaxed">
              We&apos;ve sent a magic link to your email. <br/>
              Please verify your account to start your creative journey.
            </p>
            <div className="pt-2">
              <Link href="/login" className="text-xs font-black uppercase tracking-widest text-foreground/40 hover:text-vibrant-teal underline transition-colors">
                Back to Login
              </Link>
            </div>
          </div>
        )}

        <form className="space-y-6" onSubmit={handleSubmit}>
          <div className="space-y-2">
            <label className="text-sm font-bold uppercase tracking-widest text-foreground/60 px-1">Full Name</label>
            <input 
              name="name"
              type="text" 
              required
              value={formData.name}
              onChange={handleChange}
              placeholder="Enter your name"
              className="w-full px-6 py-4 rounded-2xl bg-[var(--input-bg)] text-[var(--input-text)] border border-[var(--input-border)] focus:ring-2 ring-vibrant-teal/50 focus:border-vibrant-teal outline-none font-medium transition-all shadow-sm"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-bold uppercase tracking-widest text-foreground/60 px-1">Email Address</label>
            <input 
              name="email"
              type="email" 
              required
              value={formData.email}
              onChange={handleChange}
              placeholder="Enter your email"
              className="w-full px-6 py-4 rounded-2xl bg-[var(--input-bg)] text-[var(--input-text)] border border-[var(--input-border)] focus:ring-2 ring-vibrant-purple/50 focus:border-vibrant-purple outline-none font-medium transition-all shadow-sm"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-bold uppercase tracking-widest text-foreground/60 px-1">Password</label>
            <input 
              name="password"
              type="password" 
              required
              value={formData.password}
              onChange={handleChange}
              placeholder="••••••••"
              className="w-full px-6 py-4 rounded-2xl bg-[var(--input-bg)] text-[var(--input-text)] border border-[var(--input-border)] focus:ring-2 ring-vibrant-orange/50 focus:border-vibrant-orange outline-none font-medium transition-all shadow-sm"
            />
            <p className="text-[10px] text-foreground/40 px-1 font-medium italic mt-1">
              Must be at least 8 chars with uppercase, lowercase, number, and special character.
            </p>
          </div>

          <p className="text-[10px] text-foreground/40 px-1 font-medium italic">
            By signing up, you agree to our <Link href="#" className="underline">Terms of Service</Link> and <Link href="#" className="underline">Privacy Policy</Link>.
          </p>

          <button 
            type="submit"
            disabled={loading || success}
            className={`w-full py-4 rounded-2xl bg-cool-gradient text-white font-black text-lg hover:shadow-[0_20px_40px_rgba(0,210,255,0.3)] hover:-translate-y-1 active:scale-[0.98] transition-all ${loading ? 'opacity-70 cursor-not-allowed' : ''}`}
          >
            {loading ? 'Creating account...' : 'Create Your Account'}
          </button>
        </form>
      </div>
    </AuthLayout>
  );
}
