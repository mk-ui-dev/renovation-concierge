'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useState } from 'react';

interface SidebarProps {
  userRole: string;
}

export default function Sidebar({ userRole }: SidebarProps) {
  const pathname = usePathname();
  const router = useRouter();
  const [loggingOut, setLoggingOut] = useState(false);

  const handleLogout = async () => {
    setLoggingOut(true);
    try {
      await fetch('/api/auth/logout', { method: 'POST' });
      router.push('/login');
    } catch (error) {
      console.error('Logout error:', error);
      setLoggingOut(false);
    }
  };

  const adminLinks = [
    { href: '/dashboard', label: 'Dashboard', icon: '🏠' },
    { href: '/dashboard/projects', label: 'Projects', icon: '💼' },
    { href: '/dashboard/timeline', label: 'Timeline', icon: '📅' },
    { href: '/dashboard/defects', label: 'Defects', icon: '⚠️' },
    { href: '/dashboard/visits', label: 'Site Visits', icon: '🔍' },
    { href: '/dashboard/deliveries', label: 'Deliveries', icon: '🚚' },
    { href: '/dashboard/reports', label: 'Reports', icon: '📊' },
  ];

  const clientLinks = [
    { href: '/client', label: 'My Projects', icon: '🏠' },
    { href: '/client/timeline', label: 'Timeline', icon: '📅' },
    { href: '/client/defects', label: 'Defects', icon: '⚠️' },
    { href: '/client/reports', label: 'Reports', icon: '📊' },
  ];

  const links = userRole === 'admin' ? adminLinks : clientLinks;

  return (
    <div className="w-64 bg-gray-900 text-white min-h-screen flex flex-col">
      <div className="p-6">
        <h1 className="text-xl font-bold">Renovation Concierge</h1>
        <p className="text-sm text-gray-400 mt-1">
          {userRole === 'admin' ? 'Admin Panel' : 'Client Portal'}
        </p>
      </div>

      <nav className="flex-1 px-3">
        {links.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className={`block px-3 py-2 rounded mb-1 transition ${
              pathname === link.href
                ? 'bg-blue-600 text-white'
                : 'text-gray-300 hover:bg-gray-800'
            }`}
          >
            <span className="mr-2">{link.icon}</span>
            {link.label}
          </Link>
        ))}
      </nav>

      <div className="p-4 border-t border-gray-800">
        <button
          onClick={handleLogout}
          disabled={loggingOut}
          className="w-full px-3 py-2 bg-red-600 hover:bg-red-700 rounded text-sm disabled:opacity-50"
        >
          {loggingOut ? 'Logging out...' : '🚪 Logout'}
        </button>
      </div>
    </div>
  );
}
