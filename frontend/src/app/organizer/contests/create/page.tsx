'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { api, handleApiError } from '@/lib/api';
import { getCurrentUser } from '@/lib/auth';
import type { CreateContestDto, Contest } from '@/types';
import Button from '@/components/shared/Button';
import Alert from '@/components/shared/Alert';

const contestSchema = z.object({
  title: z.string().min(3, 'Title must be at least 3 characters'),
  description: z.string().min(10, 'Description must be at least 10 characters'),
  startDate: z.string().min(1, 'Start date is required'),
  endDate: z.string().min(1, 'End date is required'),
  maxCandidates: z.number().min(1, 'Must allow at least 1 candidate'),
  autoTransition: z.boolean().optional(),
});

type ContestFormData = Omit<CreateContestDto, 'organizerId'>;

export default function CreateContestPage() {
  const router = useRouter();
  const user = getCurrentUser();
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const { register, handleSubmit, formState: { errors } } = useForm<ContestFormData>({
    resolver: zodResolver(contestSchema),
    defaultValues: {
      autoTransition: true,
    },
  });

  const onSubmit = async (data: ContestFormData) => {
    if (!user) return;
    
    setIsLoading(true);
    setError('');

    try {
      const contestData: CreateContestDto = {
        ...data,
        maxCandidates: Number(data.maxCandidates),
        organizerId: user.id,
      };

      await api.post<Contest>('/contests', contestData);
      router.push('/organizer/dashboard');
    } catch (err) {
      setError(handleApiError(err));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Create New Contest</h1>
        <p className="text-gray-600 mt-2">Fill in the details to create a new contest</p>
      </div>

      {error && <Alert type="error" message={error} className="mb-6" />}

      <div className="bg-white rounded-lg shadow p-6">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div>
            <label className="label">Contest Title</label>
            <input
              {...register('title')}
              className="input"
              placeholder="Innovation Challenge 2024"
            />
            {errors.title && <p className="error-text">{errors.title.message}</p>}
          </div>

          <div>
            <label className="label">Description</label>
            <textarea
              {...register('description')}
              className="input"
              rows={4}
              placeholder="Describe your contest..."
            />
            {errors.description && <p className="error-text">{errors.description.message}</p>}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="label">Start Date</label>
              <input
                type="datetime-local"
                {...register('startDate')}
                className="input"
              />
              {errors.startDate && <p className="error-text">{errors.startDate.message}</p>}
            </div>

            <div>
              <label className="label">End Date</label>
              <input
                type="datetime-local"
                {...register('endDate')}
                className="input"
              />
              {errors.endDate && <p className="error-text">{errors.endDate.message}</p>}
            </div>
          </div>

          <div>
            <label className="label">Maximum Candidates</label>
            <input
              type="number"
              {...register('maxCandidates', { valueAsNumber: true })}
              className="input"
              placeholder="100"
            />
            {errors.maxCandidates && <p className="error-text">{errors.maxCandidates.message}</p>}
          </div>

          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              {...register('autoTransition')}
              id="autoTransition"
              className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
            />
            <label htmlFor="autoTransition" className="text-sm text-gray-700">
              Enable automatic workflow transitions
            </label>
          </div>

          <div className="flex gap-4 pt-4">
            <Button type="submit" isLoading={isLoading}>
              Create Contest
            </Button>
            <Button
              type="button"
              variant="secondary"
              onClick={() => router.back()}
            >
              Cancel
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
