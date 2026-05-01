import { useState, useCallback } from 'react';

/**
 * Lightweight hook to manage temporary success and error feedback states.
 * Replaces fragmented setTimeout patterns in Admin and Dashboard views.
 */
export function useFeedback(duration = 3000) {
  const [success, setSuccess] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const showSuccess = useCallback((msg: string) => {
    setSuccess(msg);
    setTimeout(() => setSuccess(null), duration);
  }, [duration]);

  const showError = useCallback((msg: string) => {
    setError(msg);
    setTimeout(() => setError(null), duration);
  }, [duration]);

  const clear = useCallback(() => {
    setSuccess(null);
    setError(null);
  }, []);

  return { success, error, showSuccess, showError, clear };
}
