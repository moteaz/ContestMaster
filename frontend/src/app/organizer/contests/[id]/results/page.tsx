'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { Trophy } from 'lucide-react';
import { handleApiError } from '@/lib/api';
import { scoringService } from '@/services/api';
import type { ContestResultsResponse } from '@/types';
import Badge from '@/components/shared/Badge';
import Alert from '@/components/shared/Alert';

export default function ContestResultsPage() {
  const params = useParams();
  const contestId = params.id as string;
  const [results, setResults] = useState<ContestResultsResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchResults();
  }, [contestId]);

  const fetchResults = async () => {
    try {
      const response = await scoringService.getResults(contestId);
      setResults(response.data);
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

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Contest Results</h1>

      {error && <Alert type="error" message={error} className="mb-6" />}

      {results && results.rankings.length === 0 ? (
        <Alert type="info" message="No results available yet. Calculate scores first." />
      ) : (
        <div className="bg-white rounded-lg shadow">
          <div className="px-6 py-4 border-b">
            <h2 className="text-lg font-semibold text-gray-900">
              Final Rankings ({results?.totalResults} candidates)
            </h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Rank</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Candidate</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Score</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {results?.rankings.map((ranking) => (
                  <tr key={ranking.candidateId} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        {ranking.rank <= 3 && <Trophy className="h-5 w-5 text-yellow-500" />}
                        <span className="text-lg font-bold">#{ranking.rank}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 font-medium">{ranking.candidateName}</td>
                    <td className="px-6 py-4">
                      <Badge variant="success">{ranking.finalScore.toFixed(2)}</Badge>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">
                      {new Date(ranking.calculatedAt).toLocaleDateString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
