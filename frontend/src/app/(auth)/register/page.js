import React from 'react';
import Link from 'next/link';
import AuthLayout from "@/components/layout/AuthLayout";

export default function RegisterPage() {
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

        <form className="space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-bold uppercase tracking-widest text-foreground/60 px-1">First Name</label>
              <input 
                type="text" 
                placeholder="Claude"
                className="w-full px-6 py-4 rounded-2xl bg-zinc-100 dark:bg-zinc-900 border-none focus:ring-2 ring-vibrant-teal outline-none font-medium transition-all shadow-sm"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-bold uppercase tracking-widest text-foreground/60 px-1">Last Name</label>
              <input 
                type="text" 
                placeholder="Monet"
                className="w-full px-6 py-4 rounded-2xl bg-zinc-100 dark:bg-zinc-900 border-none focus:ring-2 ring-vibrant-pink outline-none font-medium transition-all shadow-sm"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-bold uppercase tracking-widest text-foreground/60 px-1">Email Address</label>
            <input 
              type="email" 
              placeholder="artist@canvas.com"
              className="w-full px-6 py-4 rounded-2xl bg-zinc-100 dark:bg-zinc-900 border-none focus:ring-2 ring-vibrant-purple outline-none font-medium transition-all shadow-sm"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-bold uppercase tracking-widest text-foreground/60 px-1">Password</label>
            <input 
              type="password" 
              placeholder="••••••••"
              className="w-full px-6 py-4 rounded-2xl bg-zinc-100 dark:bg-zinc-900 border-none focus:ring-2 ring-vibrant-orange outline-none font-medium transition-all shadow-sm"
            />
          </div>

          <p className="text-[10px] text-foreground/40 px-1 font-medium italic">
            By signing up, you agree to our <Link href="#" className="underline">Terms of Service</Link> and <Link href="#" className="underline">Privacy Policy</Link>.
          </p>

          <button className="w-full py-4 rounded-2xl bg-cool-gradient text-white font-black text-lg hover:shadow-[0_20px_40px_rgba(0,210,255,0.3)] hover:-translate-y-1 active:scale-[0.98] transition-all">
            Create Your Account
          </button>
        </form>
      </div>
    </AuthLayout>
  );
}
