'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { ClipboardList, Users, CheckCircle, Clock } from 'lucide-react';
import { handleApiError } from '@/lib/api';
import { getCurrentUser } from '@/lib/auth';
import { contestsService } from '@/services/api';
import type { Contest, JuryAssignment } from '@/types';
import Button from '@/components/shared/Button';
import Badge from '@/components/shared/Badge';
import Alert from '@/components/shared/Alert';

export default function JuryDashboard() {
  const [contests, setContests] = useState<Contest[]>([]);
  const [assignments, setAssignments] = useState<JuryAssignment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const user = getCurrentUser();

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const contestsResponse = await contestsService.getAll({ page: 1, limit: 20 });
      setContests(contestsResponse.data.data.filter(c => 
        c.currentStepType === 'JURY_EVALUATION' || c.currentStepType === 'RESULT'
      ));
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

  const activeEvaluations = contests.filter(c => c.currentStepType === 'JURY_EVALUATION');
  const completedEvaluations = contests.filter(c => c.currentStepType === 'RESULT');

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Jury Dashboard</h1>
        <p className="text-gray-600 mt-2">Welcome back, {user?.firstName}!</p>
      </div>

      {error && <Alert type="error" message={error} className="mb-6" />}

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Active Evaluations</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">{activeEvaluations.length}</p>
            </div>
            <ClipboardList className="h-8 w-8 text-primary-600" />
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Completed</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">{completedEvaluations.length}</p>
            </div>
            <CheckCircle className="h-8 w-8 text-green-600" />
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Pending</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">
                {activeEvaluations.reduce((sum, c) => sum + (c._count?.candidates || 0), 0)}
              </p>
            </div>
            <Clock className="h-8 w-8 text-yellow-600" />
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Contests</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">{contests.length}</p>
            </div>
            <Users className="h-8 w-8 text-blue-600" />
          </div>
        </div>
      </div>

      {/* Active Evaluations */}
      <div className="bg-white rounded-lg shadow mb-8">
        <div className="px-6 py-4 border-b">
          <h2 className="text-lg font-semibold text-gray-900">Active Evaluations</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Contest</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Candidates</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Organizer</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {activeEvaluations.map((contest) => (
                <tr key={contest.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <div className="text-sm font-medium text-gray-900">{contest.title}</div>
                    <div className="text-sm text-gray-500 line-clamp-1">{contest.description}</div>
                  </td>
                  <td className="px-6 py-4">
                    <Badge variant="warning">Evaluation Phase</Badge>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-900">
                    {contest._count?.candidates || 0}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600">
                    {contest.organizer?.firstName} {contest.organizer?.lastName}
                  </td>
                  <td className="px-6 py-4">
                    <Link href={`/jury/evaluations/${contest.id}`}>
                      <Button size="sm">Evaluate</Button>
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {activeEvaluations.length === 0 && (
            <div className="text-center py-12">
              <p className="text-gray-500">No active evaluations at the moment</p>
            </div>
          )}
        </div>
      </div>

      {/* Completed Evaluations */}
      <div className="bg-white rounded-lg shadow">
        <div className="px-6 py-4 border-b">
          <h2 className="text-lg font-semibold text-gray-900">Completed Evaluations</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Contest</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Candidates</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {completedEvaluations.map((contest) => (
                <tr key={contest.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <div className="text-sm font-medium text-gray-900">{contest.title}</div>
                  </td>
                  <td className="px-6 py-4">
                    <Badge variant="success">Completed</Badge>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-900">
                    {contest._count?.candidates || 0}
                  </td>
                  <td className="px-6 py-4">
                    <Link href={`/jury/evaluations/${contest.id}/results`}>
                      <Button size="sm" variant="ghost">View Results</Button>
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {completedEvaluations.length === 0 && (
            <div className="text-center py-12">
              <p className="text-gray-500">No completed evaluations yet</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
