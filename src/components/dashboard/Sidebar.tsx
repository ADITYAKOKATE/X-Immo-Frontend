'use client';

import Link from 'next/link';

interface SidebarProps {
    navItems: { label: string; href: string; icon: string }[];
    pathname: string;
    user: any;
    isMobileMenuOpen: boolean;
    setIsMobileMenuOpen: (isOpen: boolean) => void;
}

export default function Sidebar({ navItems, pathname, user, isMobileMenuOpen, setIsMobileMenuOpen }: SidebarProps) {
    return (
        <aside className={`
      fixed inset-y-0 left-0 z-40 w-64 transform border-r border-white/10 bg-slate-900 transition-transform duration-300 ease-in-out lg:static lg:translate-x-0
      ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'}
    `}>
            <div className="flex h-full flex-col p-6">
                {/* Logo Area */}
                <div className="mb-8 flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-cyan-400 to-indigo-500 text-sm font-semibold text-slate-950">
                        XI
                    </div>
                    <div>
                        <p className="text-sm font-semibold text-white">X&apos;Immo</p>
                        <p className="text-xs text-slate-400">Dashboard</p>
                    </div>
                </div>

                {/* Navigation */}
                <nav className="flex-1 space-y-1">
                    {navItems.map((item) => {
                        const isActive = pathname === item.href || pathname?.startsWith(item.href + '/');
                        return (
                            <Link
                                key={item.href}
                                href={item.href}
                                onClick={() => setIsMobileMenuOpen(false)}
                                className={`flex items-center gap-3 rounded-lg px-4 py-3 text-sm font-medium transition ${isActive
                                    ? 'bg-cyan-500/15 text-cyan-200'
                                    : 'text-slate-300 hover:bg-white/5 hover:text-white'
                                    }`}
                            >
                                <span className="text-lg">{item.icon}</span>
                                <span>{item.label}</span>
                            </Link>
                        );
                    })}
                </nav>

                {/* User Info (Bottom) */}
                <div className="mt-8 rounded-lg border border-white/10 bg-white/5 p-4">
                    <p className="text-xs text-slate-400">Logged in as</p>
                    <p className="mt-1 text-sm font-semibold text-white truncate">{user?.name}</p>
                    <p className="text-xs text-slate-400 truncate">{user?.email}</p>
                    <Link href="/" className="mt-3 block text-xs text-cyan-400 hover:text-cyan-300">
                        Sign Out / Home
                    </Link>
                </div>
            </div>
        </aside>
    );
}
