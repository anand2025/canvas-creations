import React from 'react';
import Link from 'next/link';
import AuthLayout from "@/components/layout/AuthLayout";

export default function LoginPage() {
  return (
    <AuthLayout 
      title="Welcome Back to the World of Color."
      subtitle="Login to your account to manage your collection and discover new masterpieces."
      image="https://images.unsplash.com/photo-1541963463532-d68292c34b19?w=1200&auto=format&fit=crop&q=80"
    >
      <div className="space-y-8">
        <div>
          <h1 className="text-4xl font-black tracking-tight mb-2">LOGIN.</h1>
          <p className="text-foreground/50 font-medium">Don't have an account? <Link href="/register" className="text-vibrant-pink hover:underline">Create one for free</Link></p>
        </div>

        <form className="space-y-6">
          <div className="space-y-2">
            <label className="text-sm font-bold uppercase tracking-widest text-foreground/60 px-1">Email Address</label>
            <input 
              type="email" 
              placeholder="artist@canvas.com"
              className="w-full px-6 py-4 rounded-2xl bg-zinc-100 dark:bg-zinc-900 border-none focus:ring-2 ring-vibrant-pink outline-none font-medium transition-all shadow-sm"
            />
          </div>

          <div className="space-y-2">
            <div className="flex justify-between items-center px-1">
              <label className="text-sm font-bold uppercase tracking-widest text-foreground/60">Password</label>
              <Link href="#" className="text-xs font-bold text-vibrant-teal hover:underline">Forgot password?</Link>
            </div>
            <input 
              type="password" 
              placeholder="••••••••"
              className="w-full px-6 py-4 rounded-2xl bg-zinc-100 dark:bg-zinc-900 border-none focus:ring-2 ring-vibrant-teal outline-none font-medium transition-all shadow-sm"
            />
          </div>

          <div className="flex items-center gap-3 px-1">
            <input type="checkbox" id="remember" className="w-5 h-5 rounded-md accent-vibrant-pink" />
            <label htmlFor="remember" className="text-sm font-bold text-foreground/60 select-none">Remember me for 30 days</label>
          </div>

          <button className="w-full py-4 rounded-2xl bg-vibrant-gradient text-white font-black text-lg hover:shadow-[0_20px_40px_rgba(255,0,127,0.3)] hover:-translate-y-1 active:scale-[0.98] transition-all">
            Unlock your Canvas
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
