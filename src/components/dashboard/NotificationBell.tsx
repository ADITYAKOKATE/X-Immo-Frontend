
'use client';

import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import useSWR from 'swr';
import { fetcher } from '@/lib/fetcher';

interface Notification {
    id: string;
    type: 'alert' | 'warning' | 'info';
    title: string;
    message: string;
    href: string;
    date: string;
}

export default function NotificationBell() {
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);
    const { data: notifications, error } = useSWR<Notification[]>('/api/v1/notifications', fetcher, {
        refreshInterval: 60000 // Check every minute
    });

    // Close dropdown when clicking outside
    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        }
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const count = notifications?.length || 0;

    return (
        <div className="relative" ref={dropdownRef}>
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="relative p-2 text-slate-300 hover:text-white transition rounded-full hover:bg-white/5"
            >
                <span className="text-xl">🔔</span>
                {count > 0 && (
                    <span className="absolute top-1 right-1 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[10px] font-bold text-white shadow-lg animate-pulse">
                        {count}
                    </span>
                )}
            </button>

            {isOpen && (
                <div className="absolute right-0 mt-2 w-80 rounded-xl border border-white/10 bg-slate-900 shadow-2xl overflow-hidden z-50">
                    <div className="px-4 py-3 border-b border-white/10 bg-white/5">
                        <h3 className="text-sm font-semibold text-white">Notifications ({count})</h3>
                    </div>

                    <div className="max-h-96 overflow-y-auto">
                        {!notifications || notifications.length === 0 ? (
                            <div className="p-8 text-center">
                                <span className="text-2xl opacity-50 block mb-2">✨</span>
                                <p className="text-sm text-slate-400">All caught up!</p>
                            </div>
                        ) : (
                            <div className="divide-y divide-white/5">
                                {notifications.map((n) => (
                                    <Link
                                        key={n.id}
                                        href={n.href}
                                        onClick={() => setIsOpen(false)}
                                        className="block p-4 hover:bg-white/5 transition group"
                                    >
                                        <div className="flex gap-3">
                                            <div className={`mt-1 h-2 w-2 rounded-full shrink-0 
                                                ${n.type === 'alert' ? 'bg-red-500' :
                                                    n.type === 'warning' ? 'bg-amber-500' : 'bg-blue-500'}`}
                                            />
                                            <div>
                                                <p className="text-sm font-medium text-slate-200 group-hover:text-white transition">{n.title}</p>
                                                <p className="text-xs text-slate-400 mt-1">{n.message}</p>
                                                <p className="text-[10px] text-slate-500 mt-2">
                                                    {new Date(n.date).toLocaleDateString()}
                                                </p>
                                            </div>
                                        </div>
                                    </Link>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}
