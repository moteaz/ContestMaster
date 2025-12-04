'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { api, handleApiError } from '@/lib/api';
import { setAuth } from '@/lib/auth';
import type { AuthResponse, RegisterDto } from '@/types';
import Button from '@/components/shared/Button';
import Alert from '@/components/shared/Alert';

const registerSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  firstName: z.string().min(2, 'First name is required'),
  lastName: z.string().min(2, 'Last name is required'),
  role: z.enum(['ORGANIZER', 'CANDIDATE', 'JURY_MEMBER']),
  age: z.number().min(18, 'Must be at least 18 years old').optional(),
  institution: z.string().optional(),
});

export default function RegisterPage() {
  const router = useRouter();
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const { register, handleSubmit, formState: { errors } } = useForm<RegisterDto>({
    resolver: zodResolver(registerSchema),
  });

  const onSubmit = async (data: RegisterDto) => {
    setIsLoading(true);
    setError('');

    try {
      const response = await api.post<AuthResponse>('/auth/register', {
        ...data,
        age: data.age ? Number(data.age) : undefined,
      });
      setAuth(response.data.access_token, response.data.user);
      
      const roleRoutes = {
        ORGANIZER: '/organizer/dashboard',
        CANDIDATE: '/candidate/dashboard',
        JURY_MEMBER: '/jury/dashboard',
        ADMIN: '/admin/dashboard',
      };
      
      router.push(roleRoutes[response.data.user.role] || '/dashboard');
    } catch (err) {
      setError(handleApiError(err));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4 py-8">
      <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-primary-600">ContestMaster</h1>
          <p className="text-gray-600 mt-2">Create your account</p>
        </div>

        {error && <Alert type="error" message={error} className="mb-4" />}

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="label">First Name</label>
              <input {...register('firstName')} className="input" />
              {errors.firstName && <p className="error-text">{errors.firstName.message}</p>}
            </div>
            <div>
              <label className="label">Last Name</label>
              <input {...register('lastName')} className="input" />
              {errors.lastName && <p className="error-text">{errors.lastName.message}</p>}
            </div>
          </div>

          <div>
            <label className="label">Email</label>
            <input type="email" {...register('email')} className="input" />
            {errors.email && <p className="error-text">{errors.email.message}</p>}
          </div>

          <div>
            <label className="label">Password</label>
            <input type="password" {...register('password')} className="input" />
            {errors.password && <p className="error-text">{errors.password.message}</p>}
          </div>

          <div>
            <label className="label">Role</label>
            <select {...register('role')} className="input">
              <option value="">Select a role</option>
              <option value="ORGANIZER">Organizer</option>
              <option value="CANDIDATE">Candidate</option>
              <option value="JURY_MEMBER">Jury Member</option>
            </select>
            {errors.role && <p className="error-text">{errors.role.message}</p>}
          </div>

          <div>
            <label className="label">Age (Optional)</label>
            <input type="number" {...register('age', { valueAsNumber: true })} className="input" />
            {errors.age && <p className="error-text">{errors.age.message}</p>}
          </div>

          <div>
            <label className="label">Institution (Optional)</label>
            <input {...register('institution')} className="input" />
          </div>

          <Button type="submit" className="w-full" isLoading={isLoading}>
            Sign Up
          </Button>
        </form>

        <p className="text-center text-sm text-gray-600 mt-6">
          Already have an account?{' '}
          <Link href="/login" className="text-primary-600 hover:text-primary-700 font-medium">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
}
