'use client';

import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';
import { useEffect, useState } from 'react';

export default function GetStartedButton() {
    const { user } = useAuth();
    const [mounted, setMounted] = useState(false);

    // Prevent hydration mismatch
    useEffect(() => {
        setMounted(true);
    }, []);

    if (!mounted) {
        // Render a default state (e.g. Signup) during SSR/hydration to avoid flickering mismatch
        // Or render a skeleton. For a button, safe default is expected action for guests.
        return (
            <Link
                href="/auth/signup"
                className="w-full rounded-full bg-gradient-to-r from-cyan-400 to-indigo-500 px-6 py-3 text-center text-sm font-semibold text-slate-950 shadow-xl shadow-cyan-500/30 transition hover:-translate-y-0.5 hover:shadow-indigo-500/30 sm:w-auto"
            >
                Get Started
            </Link>
        );
    }

    return (
        <Link
            href={user ? '/dashboard' : '/auth/signup'}
            className="w-full rounded-full bg-gradient-to-r from-cyan-400 to-indigo-500 px-6 py-3 text-center text-sm font-semibold text-slate-950 shadow-xl shadow-cyan-500/30 transition hover:-translate-y-0.5 hover:shadow-indigo-500/30 sm:w-auto"
        >
            {user ? 'Go to Dashboard' : 'Get Started'}
        </Link>
    );
}
