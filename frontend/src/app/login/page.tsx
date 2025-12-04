'use client';

import { useState } from 'react';
import Link from 'next/link';
import { api, handleApiError } from '@/lib/api';
import { setAuth } from '@/lib/auth';
import type { AuthResponse, LoginDto } from '@/types';
import Button from '@/components/shared/Button';
import Alert from '@/components/shared/Alert';

export default function LoginPage() {
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Form submitted');
    setIsLoading(true);
    setError('');

    const formData = new FormData(e.target as HTMLFormElement);
    const data = {
      email: formData.get('email') as string,
      password: formData.get('password') as string,
    };

    try {
      console.log('Calling API...');
      const response = await api.post<AuthResponse>('/auth/login', data);
      console.log('Login response:', response.data);
      setAuth(response.data.access_token, response.data.user);
      
      const roleRoutes = {
        ORGANIZER: '/organizer/dashboard',
        CANDIDATE: '/candidate/dashboard',
        JURY_MEMBER: '/jury/dashboard',
        ADMIN: '/admin/dashboard',
      };
      
      const redirectUrl = roleRoutes[response.data.user.role] || '/dashboard';
      console.log('Redirecting to:', redirectUrl);
      window.location.href = redirectUrl;
    } catch (err) {
      console.error('Login error:', err);
      setError(handleApiError(err));
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

        {error && <Alert type="error" message={error} className="mb-4" />}

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
