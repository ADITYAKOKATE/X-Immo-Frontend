'use client';

interface HeaderProps {
    user: any;
    isMobileMenuOpen: boolean;
    setIsMobileMenuOpen: (isOpen: boolean) => void;
}

export default function Header({ user, isMobileMenuOpen, setIsMobileMenuOpen }: HeaderProps) {
    return (
        <div className="fixed top-0 z-30 flex w-full items-center justify-between border-b border-white/10 bg-slate-950/80 px-4 py-3 backdrop-blur lg:hidden">
            <div className="flex items-center gap-3">
                <button
                    onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                    className="flex h-10 w-10 items-center justify-center rounded-lg border border-white/10 bg-white/5 text-xl"
                >
                    {isMobileMenuOpen ? '✕' : '☰'}
                </button>
                <span className="font-semibold text-white">X&apos;Immo</span>
            </div>
            <div className="h-8 w-8 rounded-full bg-indigo-500 flex items-center justify-center text-xs font-bold text-white">
                {user?.name?.charAt(0) || 'U'}
            </div>
        </div>
    );
}
