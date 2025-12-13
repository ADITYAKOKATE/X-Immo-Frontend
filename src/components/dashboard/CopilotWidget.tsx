'use client';

import { useState, useRef, useEffect } from 'react';

type Message = {
    role: 'user' | 'assistant';
    content: string;
};

export default function CopilotWidget() {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState<Message[]>([
        { role: 'assistant', content: "Hi! I'm X'Immo Copilot. Ask me about your portfolio, tenants, or properties." }
    ]);
    const [input, setInput] = useState('');
    const [loading, setLoading] = useState(false);
    const scrollRef = useRef<HTMLDivElement>(null);

    // Auto-scroll to bottom
    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [messages, isOpen]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!input.trim() || loading) return;

        const userMessage: Message = { role: 'user', content: input };
        setMessages(prev => [...prev, userMessage]);
        setInput('');
        setLoading(true);

        try {
            const res = await fetch('/api/copilot', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ prompt: userMessage.content }),
            });

            const data = await res.json();

            if (data.error) {
                setMessages(prev => [...prev, { role: 'assistant', content: "Sorry, I encountered an error. Please try again." }]);
            } else {
                setMessages(prev => [...prev, { role: 'assistant', content: data.message }]);
            }
        } catch (err) {
            console.error(err);
            setMessages(prev => [...prev, { role: 'assistant', content: "Connection failed. Please check your network." }]);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-4">

            {/* Chat Window */}
            {isOpen && (
                <div className="w-[360px] h-[500px] flex flex-col rounded-3xl border border-white/10 bg-slate-900/90 backdrop-blur-xl shadow-2xl shadow-indigo-500/20 overflow-hidden transform transition-all duration-300 origin-bottom-right animate-in fade-in slide-in-from-bottom-10">

                    {/* Header */}
                    <div className="flex items-center justify-between px-6 py-4 border-b border-white/5 bg-white/5">
                        <div className="flex items-center gap-2">
                            <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                            <span className="font-semibold text-white">X&apos;Immo Copilot</span>
                        </div>
                        <button
                            onClick={() => setIsOpen(false)}
                            className="text-slate-400 hover:text-white transition"
                        >
                            ✕
                        </button>
                    </div>

                    {/* Messages */}
                    <div ref={scrollRef} className="flex-1 overflow-y-auto p-6 space-y-4">
                        {messages.map((m, i) => (
                            <div
                                key={i}
                                className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}
                            >
                                <div
                                    className={`
                    max-w-[85%] px-4 py-3 rounded-2xl text-sm leading-relaxed whitespace-pre-wrap
                    ${m.role === 'user'
                                            ? 'bg-gradient-to-br from-cyan-500 to-indigo-500 text-white rounded-tr-sm'
                                            : 'bg-white/10 text-slate-200 rounded-tl-sm border border-white/5'}
                  `}
                                >
                                    {m.content}
                                </div>
                            </div>
                        ))}
                        {loading && (
                            <div className="flex justify-start">
                                <div className="bg-white/5 px-4 py-3 rounded-2xl rounded-tl-sm border border-white/5 flex gap-1">
                                    <span className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce [animation-delay:-0.3s]" />
                                    <span className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce [animation-delay:-0.15s]" />
                                    <span className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce" />
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Input */}
                    <form onSubmit={handleSubmit} className="p-4 border-t border-white/5 bg-white/5">
                        <div className="relative">
                            <input
                                type="text"
                                value={input}
                                onChange={(e) => setInput(e.target.value)}
                                placeholder="Ask about your portfolio..."
                                className="w-full bg-slate-950/50 border border-white/10 rounded-full py-3 pl-5 pr-12 text-sm text-white placeholder:text-slate-500 focus:outline-none focus:border-cyan-400/50 focus:ring-1 focus:ring-cyan-400/20 transition"
                            />
                            <button
                                type="submit"
                                disabled={!input.trim() || loading}
                                className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 rounded-full bg-cyan-500/10 text-cyan-400 hover:bg-cyan-500/20 hover:text-cyan-300 disabled:opacity-30 disabled:hover:bg-transparent transition"
                            >
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 12h14M12 5l7 7-7 7" />
                                </svg>
                            </button>
                        </div>
                    </form>

                </div>
            )}

            {/* Launcher Button */}
            <button
                onClick={() => setIsOpen(!isOpen)}
                className={`
          flex items-center justify-center w-14 h-14 rounded-full shadow-2xl transition-all duration-300
          ${isOpen ? 'bg-slate-800 text-white rotate-90 scale-0 opacity-0' : 'bg-gradient-to-br from-cyan-400 to-indigo-600 text-white scale-100 hover:scale-110 hover:shadow-cyan-500/50'}
        `}
            >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
            </button>

            {/* Close/Toggle button that appears when open (overlaps to handle the transition logic if desired, but simplest is to just rely on the modal close or toggle logic) */}
            {/* Simplified: The main button hides when open for cleaner UI, ensuring focus on the chat. */}
            {isOpen && (
                <button
                    onClick={() => setIsOpen(false)}
                    className="absolute bottom-0 right-0 w-14 h-14 rounded-full bg-slate-800 text-slate-400 hover:text-white flex items-center justify-center shadow-xl border border-white/10 transition hover:bg-slate-700"
                >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                </button>
            )}

        </div>
    );
}
