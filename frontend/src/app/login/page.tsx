'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { api, handleApiError } from '@/lib/api';
import { setAuth } from '@/lib/auth';
import { useToast } from '@/hooks/useToast';
import type { AuthResponse } from '@/types';
import Button from '@/components/shared/Button';
import Toast from '@/components/shared/Toast';

export default function LoginPage() {
  const router = useRouter();
  const { toast, showToast, hideToast } = useToast();
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    // Check if already logged in
    const token = localStorage.getItem('access_token');
    const userStr = localStorage.getItem('user');
    if (token && userStr) {
      const user = JSON.parse(userStr);
      const roleRoutes: Record<string, string> = {
        ORGANIZER: '/organizer/dashboard',
        CANDIDATE: '/candidate/dashboard',
        JURY_MEMBER: '/jury/dashboard',
        ADMIN: '/admin/dashboard',
      };
      router.replace(roleRoutes[user.role] || '/dashboard');
    }
  }, [router]);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    const formData = new FormData(e.target as HTMLFormElement);
    const data = {
      email: formData.get('email') as string,
      password: formData.get('password') as string,
    };

    try {
      const response = await api.post<AuthResponse>('/auth/login', data);
      setAuth(response.data.access_token, response.data.user);
      
      showToast('success', 'Login successful! Redirecting...');
      
      const roleRoutes: Record<string, string> = {
        ORGANIZER: '/organizer/dashboard',
        CANDIDATE: '/candidate/dashboard',
        JURY_MEMBER: '/jury/dashboard',
        ADMIN: '/admin/dashboard',
      };
      
      const redirectUrl = roleRoutes[response.data.user.role] || '/dashboard';
      setTimeout(() => router.push(redirectUrl), 500);
    } catch (err) {
      showToast('error', handleApiError(err));
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-primary-600">ContestMaster</h1>
          <p className="text-gray-600 mt-2">Sign in to your account</p>
        </div>

        {toast.show && (
          <Toast
            type={toast.type}
            message={toast.message}
            onClose={hideToast}
          />
        )}

        <form onSubmit={onSubmit} className="space-y-4">
          <div>
            <label className="label">Email</label>
            <input
              type="email"
              name="email"
              className="input"
              placeholder="you@example.com"
              required
            />
          </div>

          <div>
            <label className="label">Password</label>
            <input
              type="password"
              name="password"
              className="input"
              placeholder="••••••••"
              required
            />
          </div>

          <Button type="submit" className="w-full" isLoading={isLoading}>
            Sign In
          </Button>
        </form>

        <p className="text-center text-sm text-gray-600 mt-6">
          Don't have an account?{' '}
          <Link href="/register" className="text-primary-600 hover:text-primary-700 font-medium">
            Sign up
          </Link>
        </p>
      </div>
    </div>
  );
}
