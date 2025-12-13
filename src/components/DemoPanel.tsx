
import React from 'react';

const DemoPanel = () => {
    return (
        <div className="flex flex-col justify-center space-y-6 lg:space-y-8 rounded-3xl border border-white/10 bg-gradient-to-br from-cyan-500/10 to-indigo-500/10 p-6 sm:p-8 lg:p-10 backdrop-blur-sm">
            <div className="space-y-4">
                <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-emerald-500/10 px-3 py-1 text-xs font-semibold text-emerald-400">
                    <span className="relative flex h-2 w-2">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                    </span>
                    Live Demo Environment
                </div>
                <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold text-white leading-tight">
                    Experience the Future of <br className="hidden xl:block" />
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-300 to-indigo-300">
                        Property Management
                    </span>
                </h2>
                <p className="hidden sm:block text-slate-300 text-sm sm:text-lg leading-relaxed">
                    This website is fully functional in real-time. Feel free to create your own account to manage properties,
                    or explore the platform instantly with our demo credentials.
                </p>
            </div>

            <div className="rounded-2xl bg-slate-950/50 p-6 border border-white/5 space-y-4 shadow-xl">
                <div className="flex items-center gap-3 mb-2">
                    <div className="p-2 rounded-lg bg-indigo-500/20 text-indigo-300">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                        </svg>
                    </div>
                    <span className="text-sm font-semibold text-slate-400 uppercase tracking-wider">Demo Admin</span>
                </div>

                <div className="space-y-3">
                    <div className="group flex items-center justify-between rounded-xl bg-white/5 p-3 transition hover:bg-white/10 border border-transparent hover:border-white/5">
                        <div>
                            <p className="text-xs text-slate-500 font-medium mb-0.5">Email</p>
                            <p className="text-sm font-mono text-cyan-200">admin@gmail.com</p>
                        </div>
                        <button
                            onClick={() => navigator.clipboard.writeText('admin@gmail.com')}
                            className="text-slate-500 hover:text-white transition opacity-100 sm:opacity-0 sm:group-hover:opacity-100"
                            title="Copy Email"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                            </svg>
                        </button>
                    </div>

                    <div className="group flex items-center justify-between rounded-xl bg-white/5 p-3 transition hover:bg-white/10 border border-transparent hover:border-white/5">
                        <div>
                            <p className="text-xs text-slate-500 font-medium mb-0.5">Password</p>
                            <p className="text-sm font-mono text-cyan-200">admin123</p>
                        </div>
                        <button
                            onClick={() => navigator.clipboard.writeText('admin123')}
                            className="text-slate-500 hover:text-white transition opacity-100 sm:opacity-0 sm:group-hover:opacity-100"
                            title="Copy Password"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                            </svg>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DemoPanel;

