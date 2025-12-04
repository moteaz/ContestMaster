'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { Calendar, Users, Award } from 'lucide-react';
import { handleApiError } from '@/lib/api';
import { contestsService } from '@/services/api';
import type { Contest } from '@/types';
import Badge from '@/components/shared/Badge';
import Alert from '@/components/shared/Alert';
import { formatDate } from '@/lib/utils';

export default function CandidateContestDetailPage() {
  const params = useParams();
  const contestId = params.id as string;
  const [contest, setContest] = useState<Contest | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchContest();
  }, [contestId]);

  const fetchContest = async () => {
    try {
      const response = await contestsService.getById(contestId);
      setContest(response.data);
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

  if (!contest) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-8">
        <Alert type="error" message="Contest not found" />
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">{contest.title}</h1>
        <p className="text-gray-600 mt-2">{contest.description}</p>
      </div>

      {error && <Alert type="error" message={error} className="mb-6" />}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center gap-3">
            <Calendar className="h-8 w-8 text-primary-600" />
            <div>
              <p className="text-sm text-gray-600">Duration</p>
              <p className="text-sm font-semibold mt-1">
                {formatDate(contest.startDate)} - {formatDate(contest.endDate)}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center gap-3">
            <Users className="h-8 w-8 text-blue-600" />
            <div>
              <p className="text-sm text-gray-600">Participants</p>
              <p className="text-lg font-bold mt-1">
                {contest._count?.candidates || 0} / {contest.maxCandidates}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center gap-3">
            <Award className="h-8 w-8 text-green-600" />
            <div>
              <p className="text-sm text-gray-600">Current Step</p>
              <Badge variant="info" className="mt-1">
                {contest.currentStepType.replace('_', ' ')}
              </Badge>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-lg font-semibold mb-4">Contest Information</h2>
        <div className="space-y-3">
          <div>
            <span className="text-sm font-medium text-gray-600">Status: </span>
            <Badge variant={contest.isActive ? 'success' : 'default'}>
              {contest.isActive ? 'Active' : 'Inactive'}
            </Badge>
          </div>
          <div>
            <span className="text-sm font-medium text-gray-600">Organizer: </span>
            <span className="text-sm text-gray-900">
              {contest.organizer?.firstName} {contest.organizer?.lastName}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
