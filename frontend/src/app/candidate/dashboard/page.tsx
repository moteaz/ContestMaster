'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Trophy, Clock, CheckCircle, XCircle } from 'lucide-react';
import { handleApiError } from '@/lib/api';
import { getCurrentUser } from '@/lib/auth';
import { contestsService } from '@/services/api';
import type { Contest } from '@/types';
import Button from '@/components/shared/Button';
import Badge from '@/components/shared/Badge';
import Alert from '@/components/shared/Alert';
import { formatDate } from '@/lib/utils';

export default function CandidateDashboard() {
  const [contests, setContests] = useState<Contest[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const user = getCurrentUser();

  useEffect(() => {
    fetchContests();
  }, []);

  const fetchContests = async () => {
    try {
      const response = await contestsService.getAll({ page: 1, limit: 20, isActive: true });
      setContests(response.data.data);
    } catch (err) {
      setError(handleApiError(err));
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  const activeContests = contests.filter(c => c.isActive && c.currentStepType === 'REGISTRATION');
  const ongoingContests = contests.filter(c => c.isActive && c.currentStepType !== 'REGISTRATION' && c.currentStepType !== 'RESULT');
  const completedContests = contests.filter(c => c.currentStepType === 'RESULT');

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Candidate Dashboard</h1>
        <p className="text-gray-600 mt-2">Welcome back, {user?.firstName}!</p>
      </div>

      {error && <Alert type="error" message={error} className="mb-6" />}

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Available Contests</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">{activeContests.length}</p>
            </div>
            <Trophy className="h-8 w-8 text-primary-600" />
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Ongoing</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">{ongoingContests.length}</p>
            </div>
            <Clock className="h-8 w-8 text-yellow-600" />
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Completed</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">{completedContests.length}</p>
            </div>
            <CheckCircle className="h-8 w-8 text-green-600" />
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Contests</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">{contests.length}</p>
            </div>
            <Trophy className="h-8 w-8 text-blue-600" />
          </div>
        </div>
      </div>

      {/* Available Contests */}
      <div className="bg-white rounded-lg shadow mb-8">
        <div className="px-6 py-4 border-b">
          <h2 className="text-lg font-semibold text-gray-900">Available Contests</h2>
        </div>
        <div className="p-6">
          {activeContests.length === 0 ? (
            <p className="text-center text-gray-500 py-8">No contests available for registration</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {activeContests.map((contest) => (
                <div key={contest.id} className="border rounded-lg p-6 hover:shadow-md transition-shadow">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">{contest.title}</h3>
                  <p className="text-sm text-gray-600 mb-4 line-clamp-2">{contest.description}</p>
                  <div className="flex items-center justify-between mb-4">
                    <Badge variant="success">Open for Registration</Badge>
                    <span className="text-sm text-gray-500">
                      {contest._count?.candidates || 0} / {contest.maxCandidates} registered
                    </span>
                  </div>
                  <div className="text-sm text-gray-600 mb-4">
                    <p>Start: {formatDate(contest.startDate)}</p>
                    <p>End: {formatDate(contest.endDate)}</p>
                  </div>
                  <Link href={`/candidate/contests/${contest.id}`}>
                    <Button className="w-full">View Details</Button>
                  </Link>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* My Contests */}
      <div className="bg-white rounded-lg shadow">
        <div className="px-6 py-4 border-b">
          <h2 className="text-lg font-semibold text-gray-900">My Contests</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Contest</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Step</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">End Date</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {ongoingContests.map((contest) => (
                <tr key={contest.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <div className="text-sm font-medium text-gray-900">{contest.title}</div>
                  </td>
                  <td className="px-6 py-4">
                    <Badge variant="info">In Progress</Badge>
                  </td>
                  <td className="px-6 py-4">
                    <Badge variant="warning">{contest.currentStepType.replace('_', ' ')}</Badge>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600">{formatDate(contest.endDate)}</td>
                  <td className="px-6 py-4">
                    <Link href={`/candidate/contests/${contest.id}`}>
                      <Button size="sm" variant="ghost">View</Button>
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {ongoingContests.length === 0 && (
            <div className="text-center py-12">
              <p className="text-gray-500">You haven't registered for any contests yet</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
