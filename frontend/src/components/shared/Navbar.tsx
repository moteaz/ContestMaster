'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { LogOut, User } from 'lucide-react';
import { getCurrentUser, clearAuth } from '@/lib/auth';
import Button from './Button';

export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const user = typeof window !== 'undefined' ? getCurrentUser() : null;

  const handleLogout = () => {
    clearAuth();
    router.push('/login');
  };

  if (!user) return null;

  const roleLinks = {
    ORGANIZER: [
      { href: '/organizer/dashboard', label: 'Dashboard' },
      { href: '/organizer/contests', label: 'Contests' },
    ],
    CANDIDATE: [
      { href: '/candidate/dashboard', label: 'Dashboard' },
      { href: '/candidate/contests', label: 'My Contests' },
    ],
    JURY_MEMBER: [
      { href: '/jury/dashboard', label: 'Dashboard' },
      { href: '/jury/evaluations', label: 'Evaluations' },
    ],
    ADMIN: [
      { href: '/admin/dashboard', label: 'Dashboard' },
    ],
  };

  const links = roleLinks[user.role] || [];

  return (
    <nav className="bg-white shadow-sm border-b">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center gap-8">
            <Link href="/" className="text-xl font-bold text-primary-600">
              ContestMaster
            </Link>
            <div className="flex gap-4">
              {links.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                    pathname === link.href
                      ? 'bg-primary-100 text-primary-700'
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </div>
          
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 text-sm text-gray-700">
              <User className="h-4 w-4" />
              <span>{user.firstName} {user.lastName}</span>
              <span className="text-xs text-gray-500">({user.role})</span>
            </div>
            <Button variant="ghost" size="sm" onClick={handleLogout}>
              <LogOut className="h-4 w-4 mr-2" />
              Logout
            </Button>
          </div>
        </div>
      </div>
    </nav>
  );
}
