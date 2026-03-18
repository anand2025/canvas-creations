"use client";
import React, { useState, useEffect, useRef } from 'react';
import { api } from '@/services/api';

const AiAssistant = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState([
        { role: 'model', content: "Hi! I'm Aria, your Art Assistant. ✨ How can I help you find the perfect piece today?" }
    ]);
    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const messagesEndRef = useRef(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const handleSend = async (e) => {
        e.preventDefault();
        if (!input.trim() || isLoading) return;

        const userMsg = { role: 'user', content: input };
        setMessages(prev => [...prev, userMsg]);
        setInput('');
        setIsLoading(true);

        try {
            const res = await api.post('/api/ai/chat', {
                message: input,
                history: messages.slice(-5) // Send last 5 messages for context
            });
            setMessages(prev => [...prev, { role: 'model', content: res.response }]);
        } catch (err) {
            console.error("Chat failed:", err);
            setMessages(prev => [...prev, { role: 'model', content: "I'm sorry, I'm having a bit of trouble connecting to the art studio. Please try again in a moment!" }]);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="fixed bottom-6 right-6 z-[9999] font-sans">
            {/* Toggle Button */}
            <button 
                onClick={() => setIsOpen(!isOpen)}
                className={`w-14 h-14 rounded-full shadow-2xl flex items-center justify-center transition-all duration-500 transform hover:scale-110 active:scale-95 ${isOpen ? 'bg-vibrant-pink rotate-90' : 'bg-vibrant-teal rotate-0'} text-white`}
            >
                {isOpen ? (
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
                ) : (
                    <div className="relative">
                        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"></path></svg>
                        <span className="absolute -top-1 -right-1 w-3 h-3 bg-vibrant-pink rounded-full border-2 border-white animate-pulse"></span>
                    </div>
                )}
            </button>

            {/* Chat Window */}
            <div className={`absolute bottom-20 right-0 w-[350px] md:w-[400px] h-[500px] rounded-3xl overflow-hidden transition-all duration-500 origin-bottom-right transform ${isOpen ? 'scale-100 opacity-100 translate-y-0' : 'scale-75 opacity-0 translate-y-10 pointer-events-none'}`}>
                <div className="h-full flex flex-col backdrop-blur-xl bg-white/80 dark:bg-zinc-900/80 border border-white/20 shadow-[0_20px_50px_rgba(0,0,0,0.15)]">
                    
                    {/* Header */}
                    <div className="p-5 bg-gradient-to-r from-vibrant-teal to-blue-500 text-white flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center text-xl">✨</div>
                        <div>
                            <h3 className="font-bold text-lg leading-none">Aria</h3>
                            <p className="text-xs text-white/70 mt-1">AI Art Assistant</p>
                        </div>
                    </div>

                    {/* Messages Area */}
                    <div className="flex-1 overflow-y-auto p-5 space-y-4 scroll-smooth">
                        {messages.map((msg, idx) => (
                            <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                                <div className={`max-w-[85%] px-4 py-3 rounded-2xl text-sm font-medium leading-relaxed ${
                                    msg.role === 'user' 
                                    ? 'bg-vibrant-pink text-white rounded-tr-none shadow-md' 
                                    : 'bg-secondary-bg text-foreground rounded-tl-none border border-gray-100 dark:border-zinc-800'
                                } animate-in slide-in-from-bottom-2 duration-300`}>
                                    {msg.content}
                                </div>
                            </div>
                        ))}
                        {isLoading && (
                            <div className="flex justify-start">
                                <div className="bg-secondary-bg px-4 py-3 rounded-2xl rounded-tl-none flex items-center gap-1">
                                    <div className="w-1.5 h-1.5 bg-vibrant-teal rounded-full animate-bounce"></div>
                                    <div className="w-1.5 h-1.5 bg-vibrant-teal rounded-full animate-bounce [animation-delay:-0.15s]"></div>
                                    <div className="w-1.5 h-1.5 bg-vibrant-teal rounded-full animate-bounce [animation-delay:-0.3s]"></div>
                                </div>
                            </div>
                        )}
                        <div ref={messagesEndRef} />
                    </div>

                    {/* Input Area */}
                    <form onSubmit={handleSend} className="p-4 bg-white/50 dark:bg-zinc-800/50 border-t border-gray-100 dark:border-zinc-800">
                        <div className="relative flex items-center">
                            <input 
                                type="text"
                                value={input}
                                onChange={(e) => setInput(e.target.value)}
                                placeholder="Type your message..."
                                className="w-full pl-4 pr-12 py-3 rounded-xl bg-secondary-bg border-none focus:ring-1 focus:ring-vibrant-teal text-foreground text-sm font-medium transition-all"
                            />
                            <button 
                                type="submit"
                                disabled={!input.trim() || isLoading}
                                className="absolute right-2 text-vibrant-teal hover:text-vibrant-pink transition-colors disabled:opacity-30"
                            >
                                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z"></path></svg>
                            </button>
                        </div>
                        <p className="text-[10px] text-center text-gray-400 mt-2">Powered by Gemini AI</p>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default AiAssistant;
