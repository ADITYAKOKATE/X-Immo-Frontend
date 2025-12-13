import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="border-t border-white/10 bg-slate-950/70">
      <div className="mx-auto flex max-w-6xl flex-col gap-4 px-6 py-8 text-sm text-slate-300 lg:flex-row lg:items-center lg:justify-between lg:px-0">
        <div className="flex items-center gap-2 text-white">
          <span className="font-semibold">X&apos;Immo</span>
          <span className="text-slate-500">•</span>
          <span className="text-slate-400">Smart Property Management</span>
        </div>
        <div className="flex flex-wrap items-center gap-4 text-sm font-semibold text-slate-200">
          <Link href="/" className="transition-colors hover:text-cyan-300">
            Home
          </Link>
          <Link href="/features" className="transition-colors hover:text-cyan-300">
            Features
          </Link>
          <Link href="/how-it-works" className="transition-colors hover:text-cyan-300">
            How It Works
          </Link>
          <Link href="/about" className="transition-colors hover:text-cyan-300">
            About
          </Link>
          <Link href="/contact" className="transition-colors hover:text-cyan-300">
            Contact
          </Link>
        </div>
        <p className="text-slate-500">© 2025 X&apos;Immo. All rights reserved.</p>
      </div>
    </footer>
  );
}

