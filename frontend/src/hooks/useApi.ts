import { useState, useCallback } from 'react';
import { handleApiError } from '@/lib/api';

export function useApi<T, P extends any[] = []>(
  apiFunc: (...args: P) => Promise<{ data: T }>
) {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const execute = useCallback(async (...args: P) => {
    setLoading(true);
    setError('');
    try {
      const response = await apiFunc(...args);
      setData(response.data);
      return response.data;
    } catch (err) {
      const errorMsg = handleApiError(err);
      setError(errorMsg);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [apiFunc]);

  const reset = useCallback(() => {
    setData(null);
    setError('');
    setLoading(false);
  }, []);

  return { data, loading, error, execute, reset };
}
