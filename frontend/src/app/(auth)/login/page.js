"use client";
import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import AuthLayout from "@/components/layout/AuthLayout";
import { loginUser } from '@/services/api';
import { useAuth } from '@/context/AuthContext';
import { toast } from 'react-hot-toast';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const { login } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const data = await loginUser(email, password);
      // Pass the full response data to AuthContext login
      login(data);
      toast.success("Welcome back!", {
        icon: '👋',
      });
      router.push('/');
    } catch (err) {
      setError(err.message || "Invalid credentials. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout 
      title="Welcome Back to the World of Color."
      subtitle="Login to your account to manage your collection and discover new masterpieces."
      image="https://images.unsplash.com/photo-1541963463532-d68292c34b19?w=1200&auto=format&fit=crop&q=80"
    >
      <div className="space-y-8">
        <div>
          <h1 className="text-4xl font-black tracking-tight mb-2">LOGIN.</h1>
          <p className="text-foreground/50 font-medium">Don&apos;t have an account? <Link href="/register" className="text-vibrant-pink hover:underline">Create your account</Link></p>
        </div>

        {error && (
          <div className="p-4 bg-red-50 border border-red-200 text-red-600 rounded-xl text-sm font-medium">
            {error}
          </div>
        )}

        <form className="space-y-6" onSubmit={handleSubmit}>
          <div className="space-y-2">
            <label className="text-sm font-bold uppercase tracking-widest text-foreground/60 px-1">Email Address</label>
            <input 
              type="email" 
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              className="w-full px-6 py-4 rounded-2xl bg-zinc-100 dark:bg-zinc-900 border-none focus:ring-2 ring-vibrant-pink outline-none font-medium transition-all shadow-sm text-black dark:text-white"
            />
          </div>

          <div className="space-y-2">
            <div className="flex justify-between items-center px-1">
              <label className="text-sm font-bold uppercase tracking-widest text-foreground/60">Password</label>
              <Link href="#" className="text-xs font-bold text-vibrant-teal hover:underline">Forgot password?</Link>
            </div>
            <input 
              type="password" 
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full px-6 py-4 rounded-2xl bg-zinc-100 dark:bg-zinc-900 border-none focus:ring-2 ring-vibrant-teal outline-none font-medium transition-all shadow-sm text-black dark:text-white"
            />
          </div>

          <button 
            type="submit"
            disabled={loading}
            className={`w-full py-4 rounded-2xl bg-vibrant-gradient text-white font-black text-lg hover:shadow-[0_20px_40px_rgba(255,0,127,0.3)] hover:-translate-y-1 active:scale-[0.98] transition-all ${loading ? 'opacity-70 cursor-not-allowed' : ''}`}
          >
            {loading ? 'Authenticating...' : 'Login'}
          </button>
        </form>

        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-zinc-100 dark:border-zinc-900"></div>
          </div>
        </div>
      </div>
    </AuthLayout>
  );
}
