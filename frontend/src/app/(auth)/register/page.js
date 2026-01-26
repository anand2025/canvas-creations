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
      toast.success("Account created! Redirecting to login...", {
        duration: 3000,
        icon: '🎨',
      });
      setTimeout(() => router.push('/login'), 2000);
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
          <div className="p-4 bg-green-50 border border-green-200 text-green-600 rounded-xl text-sm font-medium">
            Account created successfully! Redirecting to login...
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
              className="w-full px-6 py-4 rounded-2xl bg-zinc-100 dark:bg-zinc-900 border-none focus:ring-2 ring-vibrant-teal outline-none font-medium transition-all shadow-sm text-black dark:text-white"
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
              className="w-full px-6 py-4 rounded-2xl bg-zinc-100 dark:bg-zinc-900 border-none focus:ring-2 ring-vibrant-purple outline-none font-medium transition-all shadow-sm text-black dark:text-white"
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
              className="w-full px-6 py-4 rounded-2xl bg-zinc-100 dark:bg-zinc-900 border-none focus:ring-2 ring-vibrant-orange outline-none font-medium transition-all shadow-sm text-black dark:text-white"
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
