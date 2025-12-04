'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Play, Trash2, Users, Award, BarChart3 } from 'lucide-react';
import { api, handleApiError } from '@/lib/api';
import { getCurrentUser } from '@/lib/auth';
import type { Contest, ContestStatistics, TransitionDto, WorkflowStep } from '@/types';
import Button from '@/components/shared/Button';
import Badge from '@/components/shared/Badge';
import Alert from '@/components/shared/Alert';
import Modal from '@/components/shared/Modal';
import { formatDate } from '@/lib/utils';

export default function ContestDetailPage() {
  const params = useParams();
  const router = useRouter();
  const user = getCurrentUser();
  const contestId = params.id as string;

  const [contest, setContest] = useState<Contest | null>(null);
  const [statistics, setStatistics] = useState<ContestStatistics | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);

  useEffect(() => {
    fetchContest();
    fetchStatistics();
  }, [contestId]);

  const fetchContest = async () => {
    try {
      const response = await api.get<Contest>(`/contests/${contestId}`);
      setContest(response.data);
    } catch (err) {
      setError(handleApiError(err));
    } finally {
      setLoading(false);
    }
  };

  const fetchStatistics = async () => {
    try {
      const response = await api.get<ContestStatistics>(`/contests/${contestId}/statistics`);
      setStatistics(response.data);
    } catch (err) {
      console.error('Failed to fetch statistics:', err);
    }
  };

  const handleTransition = async (toStep: WorkflowStep) => {
    if (!user) return;
    setActionLoading(true);
    setError('');
    setSuccess('');

    try {
      const data: TransitionDto = { toStep, triggeredBy: user.id };
      await api.post(`/workflow/${contestId}/transition`, data);
      setSuccess(`Successfully transitioned to ${toStep}`);
      fetchContest();
      fetchStatistics();
    } catch (err) {
      setError(handleApiError(err));
    } finally {
      setActionLoading(false);
    }
  };

  const handleExecuteRules = async () => {
    if (!user) return;
    setActionLoading(true);
    setError('');
    setSuccess('');

    try {
      await api.post(`/rules/${contestId}/execute`, { executedBy: user.id });
      setSuccess('Rules executed successfully');
      fetchStatistics();
    } catch (err) {
      setError(handleApiError(err));
    } finally {
      setActionLoading(false);
    }
  };

  const handleAssignJury = async () => {
    setActionLoading(true);
    setError('');
    setSuccess('');

    try {
      await api.post(`/jury/${contestId}/assign`);
      setSuccess('Jury assigned successfully');
      fetchStatistics();
    } catch (err) {
      setError(handleApiError(err));
    } finally {
      setActionLoading(false);
    }
  };

  const handleCalculateScores = async () => {
    setActionLoading(true);
    setError('');
    setSuccess('');

    try {
      await api.post(`/scoring/${contestId}/calculate`);
      setSuccess('Scores calculated successfully');
      fetchStatistics();
    } catch (err) {
      setError(handleApiError(err));
    } finally {
      setActionLoading(false);
    }
  };

  const handleDelete = async () => {
    setActionLoading(true);
    try {
      await api.delete(`/contests/${contestId}`);
      router.push('/organizer/dashboard');
    } catch (err) {
      setError(handleApiError(err));
      setActionLoading(false);
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

  const workflowSteps: WorkflowStep[] = ['DRAFT', 'REGISTRATION', 'PRE_SELECTION', 'JURY_EVALUATION', 'RESULT'];
  const currentStepIndex = workflowSteps.indexOf(contest.currentStep);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">{contest.title}</h1>
            <p className="text-gray-600 mt-2">{contest.description}</p>
          </div>
          <Button variant="danger" onClick={() => setShowDeleteModal(true)}>
            <Trash2 className="h-4 w-4 mr-2" />
            Delete
          </Button>
        </div>
      </div>

      {error && <Alert type="error" message={error} className="mb-6" />}
      {success && <Alert type="success" message={success} className="mb-6" />}

      {/* Contest Info */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow p-6">
          <p className="text-sm text-gray-600">Current Step</p>
          <Badge variant="info" className="mt-2">{contest.currentStep.replace('_', ' ')}</Badge>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <p className="text-sm text-gray-600">Duration</p>
          <p className="text-lg font-semibold mt-1">
            {formatDate(contest.startDate)} - {formatDate(contest.endDate)}
          </p>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <p className="text-sm text-gray-600">Status</p>
          <Badge variant={contest.isActive ? 'success' : 'default'} className="mt-2">
            {contest.isActive ? 'Active' : 'Inactive'}
          </Badge>
        </div>
      </div>

      {/* Statistics */}
      {statistics && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Candidates</p>
                <p className="text-2xl font-bold mt-1">{statistics.statistics.totalCandidates}</p>
              </div>
              <Users className="h-8 w-8 text-blue-600" />
            </div>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Qualified</p>
                <p className="text-2xl font-bold mt-1">{statistics.statistics.qualifiedCandidates}</p>
              </div>
              <Award className="h-8 w-8 text-green-600" />
            </div>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Eliminated</p>
                <p className="text-2xl font-bold mt-1">{statistics.statistics.eliminatedCandidates}</p>
              </div>
              <BarChart3 className="h-8 w-8 text-red-600" />
            </div>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Jury Members</p>
                <p className="text-2xl font-bold mt-1">{statistics.statistics.activeJuryMembers}</p>
              </div>
              <Users className="h-8 w-8 text-purple-600" />
            </div>
          </div>
        </div>
      )}

      {/* Workflow Actions */}
      <div className="bg-white rounded-lg shadow p-6 mb-8">
        <h2 className="text-lg font-semibold mb-4">Workflow Management</h2>
        <div className="flex flex-wrap gap-3">
          {workflowSteps.map((step, index) => (
            <Button
              key={step}
              variant={index === currentStepIndex ? 'primary' : index < currentStepIndex ? 'secondary' : 'ghost'}
              onClick={() => handleTransition(step)}
              disabled={actionLoading || index <= currentStepIndex}
            >
              <Play className="h-4 w-4 mr-2" />
              {step.replace('_', ' ')}
            </Button>
          ))}
        </div>
      </div>

      {/* Contest Actions */}
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-lg font-semibold mb-4">Contest Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Button onClick={handleExecuteRules} disabled={actionLoading} variant="secondary">
            Execute Rules
          </Button>
          <Button onClick={handleAssignJury} disabled={actionLoading} variant="secondary">
            Assign Jury
          </Button>
          <Button onClick={handleCalculateScores} disabled={actionLoading} variant="secondary">
            Calculate Scores
          </Button>
          <Button
            onClick={() => router.push(`/organizer/contests/${contestId}/results`)}
            variant="secondary"
          >
            View Results
          </Button>
        </div>
      </div>

      {/* Delete Modal */}
      <Modal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        title="Delete Contest"
        footer={
          <>
            <Button variant="secondary" onClick={() => setShowDeleteModal(false)}>
              Cancel
            </Button>
            <Button variant="danger" onClick={handleDelete} isLoading={actionLoading}>
              Delete
            </Button>
          </>
        }
      >
        <p>Are you sure you want to delete this contest? This action cannot be undone.</p>
      </Modal>
    </div>
  );
}
