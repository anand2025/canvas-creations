"use client";
import React, { useState } from 'react';
import { apiRequest } from '@/services/api';
import toast from 'react-hot-toast';

const NewsletterAdminPage = () => {
    const [subject, setSubject] = useState('');
    const [body, setBody] = useState('');
    const [isSending, setIsSending] = useState(false);

    const handleSendNewsletter = async (e) => {
        e.preventDefault();
        
        if (!subject || !body) {
            toast.error("Please provide both a subject and a message body.");
            return;
        }

        if (!confirm("Are you sure you want to send this email to ALL newsletter subscribers?")) {
            return;
        }

        setIsSending(true);
        try {
            const data = await apiRequest('/admin/newsletter/send', {
                method: 'POST',
                body: JSON.stringify({ subject, body })
            });
            
            toast.success(data.message || "Newsletter sending initiated!");
            setSubject('');
            setBody('');
        } catch (error) {
            console.error("Failed to send newsletter:", error);
            toast.error(error.message || "Failed to initiate newsletter sending.");
        } finally {
            setIsSending(false);
        }
    };

    return (
        <div className="max-w-4xl mx-auto">
            <div className="mb-8">
                <h1 className="text-3xl font-black mb-2 text-foreground uppercase tracking-tight">NEWSLETTER <span className="text-vibrant-pink italic">MANAGEMENT.</span></h1>
                <p className="text-foreground/50 font-medium">Compose and send updates to all your subscribers at once.</p>
            </div>

            <div className="bg-card rounded-[32px] p-8 md:p-12 shadow-xl border border-[var(--border-color)] transition-colors duration-500">
                <form onSubmit={handleSendNewsletter} className="space-y-8">
                    {/* Subject Line */}
                    <div className="space-y-3">
                        <label className="text-sm font-black uppercase tracking-widest text-vibrant-teal ml-1">
                            Email Subject
                        </label>
                        <input
                            type="text"
                            value={subject}
                            onChange={(e) => setSubject(e.target.value)}
                            placeholder="e.g. New Collection Arrival! 🎨"
                            className="w-full px-6 py-4 rounded-2xl bg-secondary-bg border-none focus:ring-2 ring-vibrant-pink text-lg font-medium transition-all text-foreground"
                            required
                        />
                    </div>

                    {/* Email Body */}
                    <div className="space-y-3">
                        <label className="text-sm font-black uppercase tracking-widest text-vibrant-orange ml-1">
                            Message Body (HTML Supported)
                        </label>
                        <textarea
                            value={body}
                            onChange={(e) => setBody(e.target.value)}
                            rows={12}
                            placeholder="Write your email content here... You can use HTML tags for formatting."
                            className="w-full px-6 py-4 rounded-2xl bg-secondary-bg border-none focus:ring-2 ring-vibrant-orange text-lg font-medium transition-all resize-none text-foreground"
                            required
                        ></textarea>
                        <p className="text-xs text-gray-400 font-medium ml-1">
                            Tip: You can use HTML tags like &lt;b&gt;, &lt;i&gt;, &lt;a href="..."&gt;, or &lt;div&gt; to style your email.
                        </p>
                    </div>

                    {/* Submit Button */}
                    <div className="flex justify-end pt-4">
                        <button
                            type="submit"
                            disabled={isSending}
                            className={`px-10 py-5 rounded-2xl bg-vibrant-gradient text-white font-black text-lg hover:scale-[1.02] active:scale-[0.98] transition-all shadow-lg hover:shadow-vibrant-pink/25 flex items-center gap-3 ${isSending ? 'opacity-70 cursor-not-allowed' : ''}`}
                        >
                            {isSending ? (
                                <>
                                    <svg className="animate-spin h-6 w-6 text-white" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                    </svg>
                                    Initiating Send...
                                </>
                            ) : (
                                <>
                                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"></path>
                                    </svg>
                                    Send to All Subscribers
                                </>
                            )}
                        </button>
                    </div>
                </form>
            </div>

            {/* Preview Section */}
            <div className="mt-12">
                <div className="flex items-center justify-between mb-4 px-1">
                    <h2 className="text-sm font-black uppercase tracking-widest text-gray-400">Live Preview Helper</h2>
                    <span className="text-[10px] font-bold px-2 py-1 bg-gray-100 dark:bg-zinc-800 rounded-md text-gray-500">DESKTOP VIEW</span>
                </div>
                
                <div className="bg-background rounded-[32px] border-2 border-dashed border-[var(--border-color)] overflow-hidden transition-all">
                    {/* Fake Browser/Email Header */}
                    <div className="bg-card px-6 py-4 border-b border-[var(--border-color)] flex flex-col gap-1">
                        <div className="flex items-center justify-between">
                            <span className="text-xs font-bold text-gray-400">From: <span className="text-gray-900 dark:text-gray-100">CanvasCreations &lt;noreply@canvascreations.com&gt;</span></span>
                            <div className="flex gap-1.5">
                                <div className="w-2.5 h-2.5 rounded-full bg-red-400/20"></div>
                                <div className="w-2.5 h-2.5 rounded-full bg-yellow-400/20"></div>
                                <div className="w-2.5 h-2.5 rounded-full bg-green-400/20"></div>
                            </div>
                        </div>
                        <span className="text-sm font-black text-gray-900 dark:text-gray-100 mt-1">
                            {subject || "Email Subject Placeholder"}
                        </span>
                    </div>

                    {/* Rendered HTML Body */}
                    <div className="p-8 md:p-12 h-[500px] overflow-y-auto bg-white dark:bg-white text-gray-900 email-preview-container">
                        {body ? (
                            <div 
                                className="prose prose-pink max-w-none"
                                dangerouslySetInnerHTML={{ __html: body }} 
                            />
                        ) : (
                            <div className="h-full flex flex-col items-center justify-center text-gray-300 gap-4">
                                <svg className="w-16 h-16 opacity-20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path>
                                </svg>
                                <p className="font-medium italic">Start typing your message to see the preview here...</p>
                            </div>
                        )}
                    </div>
                </div>

                {/* Styling for preview container to reset some component leaking */}
                <style jsx global>{`
                    .email-preview-container {
                        all: unset;
                        display: block;
                        background: white;
                        color: #1a1a1a;
                        font-family: Arial, sans-serif;
                        padding: 40px;
                        height: 500px;
                        overflow-y: auto;
                    }
                    .email-preview-container * {
                        max-width: 100%;
                    }
                    .email-preview-container a {
                        color: #FF007F;
                        text-decoration: underline;
                    }
                    .email-preview-container h1, .email-preview-container h2, .email-preview-container h3 {
                        margin-top: 1.5em;
                        margin-bottom: 0.5em;
                        font-weight: 800;
                    }
                `}</style>
            </div>
        </div>
    );
};

export default NewsletterAdminPage;
