import { useState, useCallback, useRef, useEffect } from 'react';

/**
 * Lightweight hook to manage temporary success and error feedback states.
 * Replaces fragmented setTimeout patterns in Admin and Dashboard views.
 * Uses a ref-tracked timeout to prevent overlap when multiple messages are sent.
 */
export function useFeedback(duration = 3000) {
  const [success, setSuccess] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const clear = useCallback(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
    setSuccess(null);
    setError(null);
  }, []);

  const showSuccess = useCallback((msg: string) => {
    clear();
    setSuccess(msg);
    timeoutRef.current = setTimeout(() => {
      setSuccess(null);
      timeoutRef.current = null;
    }, duration);
  }, [duration, clear]);

  const showError = useCallback((msg: string) => {
    clear();
    setError(msg);
    timeoutRef.current = setTimeout(() => {
      setError(null);
      timeoutRef.current = null;
    }, duration);
  }, [duration, clear]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, []);

  return { success, error, showSuccess, showError, clear };
}
