
'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import ProtectedRoute from '@/components/ProtectedRoute';
import { useAuth } from '@/contexts/AuthContext';
import Sidebar from '@/components/dashboard/Sidebar';
import Header from '@/components/dashboard/Header';
import NotificationBell from '@/components/dashboard/NotificationBell';
import CopilotWidget from '@/components/dashboard/CopilotWidget';

const navItems = [
  { label: 'Dashboard', href: '/dashboard', icon: '📊' },
  { label: 'Properties', href: '/dashboard/properties', icon: '🏠' },
  { label: 'Tenants', href: '/dashboard/tenants', icon: '👥' },
  { label: 'Rent', href: '/dashboard/rent', icon: '💰' },
  { label: 'Tickets', href: '/dashboard/tickets', icon: '🎫' },
];

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { user } = useAuth();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-slate-950 relative">
        <Header
          user={user}
          isMobileMenuOpen={isMobileMenuOpen}
          setIsMobileMenuOpen={setIsMobileMenuOpen}
        />

        {/* Desktop Notification Bell (Absolute Top Right) */}
        <div className="hidden lg:block absolute top-6 right-8 z-50">
          <NotificationBell />
        </div>

        <div className="flex">
          <Sidebar
            navItems={navItems}
            pathname={pathname}
            user={user}
            isMobileMenuOpen={isMobileMenuOpen}
            setIsMobileMenuOpen={setIsMobileMenuOpen}
          />

          {/* Overlay for mobile when menu is open */}
          {isMobileMenuOpen && (
            <div
              className="fixed inset-0 z-30 bg-black/50 backdrop-blur-sm lg:hidden"
              onClick={() => setIsMobileMenuOpen(false)}
            />
          )}

          {/* Main content */}
          <main className="flex-1 min-w-0 pt-16 lg:pt-0">
            {children}
          </main>
        </div>
      </div>
      <CopilotWidget />
    </ProtectedRoute>
  );
}
