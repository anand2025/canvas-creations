"use client";

import React, { useState } from 'react';
import { apiRequest } from '@/services/api';

export default function NewsletterSection() {
    const [newsletterEmail, setNewsletterEmail] = useState("");
    const [subscribing, setSubscribing] = useState(false);
    const [subscribeStatus, setSubscribeStatus] = useState(null);

    const handleNewsletterSubscribe = async (e) => {
        e.preventDefault();
        if (!newsletterEmail) return;

        setSubscribing(true);
        setSubscribeStatus(null);

        try {
            await apiRequest('/newsletter/subscribe', {
                method: 'POST',
                body: JSON.stringify({ email: newsletterEmail }),
            });
            setSubscribeStatus({ type: 'success', message: "Thank you for subscribing!" });
            setNewsletterEmail("");
        } catch (error) {
            setSubscribeStatus({
                type: 'error',
                message: error.message || "Something went wrong. Please try again.",
            });
        } finally {
            setSubscribing(false);
        }
    };

    return (
        <section className="py-24 px-6">
            <div className="container mx-auto">
                <div className="relative rounded-[40px] bg-vibrant-gradient p-12 md:p-20 overflow-hidden shadow-[0_40px_80px_rgba(255,0,127,0.3)]">
                    <div className="relative z-10 max-w-2xl text-white">
                        <h2 className="text-4xl md:text-6xl font-black mb-6 leading-tight">
                            READY TO ADD SOME <br /><span className="text-vibrant-yellow italic">COLOR?</span>
                        </h2>
                        <p className="text-xl opacity-90 mb-10">
                            Join our newsletter and stay updated with our latest collections and offers.
                        </p>

                        <form onSubmit={handleNewsletterSubscribe} className="flex flex-col sm:flex-row gap-4">
                            <div className="flex-1 relative">
                                <input
                                    type="email"
                                    required
                                    value={newsletterEmail}
                                    onChange={(e) => setNewsletterEmail(e.target.value)}
                                    placeholder="Enter your email"
                                    className="w-full px-8 py-4 rounded-2xl bg-white/20 backdrop-blur-md border border-white/30 placeholder:text-white/60 focus:outline-none focus:ring-2 ring-vibrant-yellow font-medium"
                                    disabled={subscribing}
                                />
                            </div>
                            <button
                                type="submit"
                                disabled={subscribing}
                                className="px-10 py-4 rounded-2xl bg-white text-vibrant-pink font-black hover:scale-105 active:scale-95 transition-all disabled:opacity-50 disabled:scale-100"
                            >
                                {subscribing ? "Subscribing..." : "Subscribe"}
                            </button>
                        </form>

                        {subscribeStatus && (
                            <div className={`mt-6 p-4 rounded-xl backdrop-blur-md border ${
                                subscribeStatus.type === 'success'
                                    ? 'bg-green-500/20 border-green-500/30 text-white'
                                    : 'bg-red-500/20 border-red-500/30 text-white'
                            } animate-in fade-in slide-in-from-top-2 duration-300`}>
                                <p className="font-medium flex items-center gap-2">
                                    {subscribeStatus.type === 'success' ? (
                                        <svg className="w-5 h-5 text-green-400" fill="currentColor" viewBox="0 0 20 20">
                                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                        </svg>
                                    ) : (
                                        <svg className="w-5 h-5 text-red-400" fill="currentColor" viewBox="0 0 20 20">
                                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                                        </svg>
                                    )}
                                    {subscribeStatus.message}
                                </p>
                            </div>
                        )}
                    </div>

                    {/* Abstract shapes in CTA */}
                    <div className="absolute top-0 right-0 w-80 h-80 bg-vibrant-teal/30 blur-[60px] rounded-full translate-x-1/2 -translate-y-1/2"></div>
                    <div className="absolute bottom-0 right-1/4 w-40 h-40 bg-vibrant-yellow/30 blur-[40px] rounded-full translate-y-1/2"></div>
                </div>
            </div>
        </section>
    );
}
