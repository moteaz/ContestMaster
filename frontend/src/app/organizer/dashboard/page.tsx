'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Plus, TrendingUp, Users, Award, AlertCircle } from 'lucide-react';
import { api, handleApiError } from '@/lib/api';
import { getCurrentUser } from '@/lib/auth';
import type { Contest, PaginatedResponse } from '@/types';
import Button from '@/components/shared/Button';
import Badge from '@/components/shared/Badge';
import Alert from '@/components/shared/Alert';
import { formatDate } from '@/lib/utils';

export default function OrganizerDashboard() {
  const [contests, setContests] = useState<Contest[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const user = getCurrentUser();

  useEffect(() => {
    fetchContests();
  }, []);

  const fetchContests = async () => {
    try {
      const response = await api.get<PaginatedResponse<Contest>>('/contests', {
        params: { page: 1, limit: 10 }
      });
      setContests(response.data.data);
    } catch (err) {
      setError(handleApiError(err));
    } finally {
      setLoading(false);
    }
  };

  const getStepBadge = (step: string) => {
    const variants: Record<string, 'default' | 'info' | 'warning' | 'success'> = {
      DRAFT: 'default',
      REGISTRATION: 'info',
      PRE_SELECTION: 'warning',
      JURY_EVALUATION: 'warning',
      RESULT: 'success',
    };
    return <Badge variant={variants[step] || 'default'}>{step.replace('_', ' ')}</Badge>;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-600 mt-1">Welcome back, {user?.firstName}!</p>
        </div>
        <Link href="/organizer/contests/create">
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Create Contest
          </Button>
        </Link>
      </div>

      {error && <Alert type="error" message={error} className="mb-6" />}

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Contests</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">{contests.length}</p>
            </div>
            <TrendingUp className="h-8 w-8 text-primary-600" />
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Active Contests</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">
                {contests.filter(c => c.isActive).length}
              </p>
            </div>
            <Award className="h-8 w-8 text-green-600" />
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Candidates</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">
                {contests.reduce((sum, c) => sum + (c._count?.candidates || 0), 0)}
              </p>
            </div>
            <Users className="h-8 w-8 text-blue-600" />
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Jury Members</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">
                {contests.reduce((sum, c) => sum + (c._count?.juryMembers || 0), 0)}
              </p>
            </div>
            <AlertCircle className="h-8 w-8 text-yellow-600" />
          </div>
        </div>
      </div>

      {/* Contests Table */}
      <div className="bg-white rounded-lg shadow">
        <div className="px-6 py-4 border-b">
          <h2 className="text-lg font-semibold text-gray-900">Recent Contests</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Title</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Step</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Candidates</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Start Date</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {contests.map((contest) => (
                <tr key={contest.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <div className="text-sm font-medium text-gray-900">{contest.title}</div>
                  </td>
                  <td className="px-6 py-4">
                    <Badge variant={contest.isActive ? 'success' : 'default'}>
                      {contest.isActive ? 'Active' : 'Inactive'}
                    </Badge>
                  </td>
                  <td className="px-6 py-4">{getStepBadge(contest.currentStep)}</td>
                  <td className="px-6 py-4 text-sm text-gray-900">
                    {contest._count?.candidates || 0} / {contest.maxCandidates}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600">{formatDate(contest.startDate)}</td>
                  <td className="px-6 py-4">
                    <Link href={`/organizer/contests/${contest.id}`}>
                      <Button size="sm" variant="ghost">View</Button>
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {contests.length === 0 && (
            <div className="text-center py-12">
              <p className="text-gray-500">No contests yet. Create your first contest!</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
