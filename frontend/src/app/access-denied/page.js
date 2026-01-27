"use client";
import React from 'react';
import Link from 'next/link';

export default function AccessDenied() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-zinc-950 px-4">
      <div className="text-center max-w-md w-full">
        <div className="mb-6 flex justify-center">
            <div className="h-24 w-24 bg-red-100 dark:bg-red-900/20 text-red-500 rounded-full flex items-center justify-center">
                <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"></path>
                </svg>
            </div>
        </div>
        <h1 className="text-3xl font-black text-gray-900 dark:text-white mb-2">Access Denied</h1>
        <p className="text-gray-500 dark:text-gray-400 mb-8">
          You do not have permission to view this page. This area is restricted to administrators only.
        </p>
        <Link 
          href="/"
          className="inline-flex items-center justify-center px-8 py-3 rounded-full font-bold text-white bg-vibrant-teal hover:bg-teal-600 transition-all shadow-lg shadow-teal-500/30"
        >
          Return Home
        </Link>
      </div>
    </div>
  );
}
