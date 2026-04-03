'use client';

import { useEffect } from 'react';
import Link from 'next/link';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error('Unhandled runtime error:', error);
  }, [error]);

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: 'var(--bg-primary)',
      padding: '24px',
      textAlign: 'center'
    }}>
      <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', width: '600px', height: '600px', background: 'var(--grad-gold)', filter: 'blur(160px)', opacity: 0.1, pointerEvents: 'none' }} />
      
      <div className="card" style={{ maxWidth: '480px', padding: '48px 32px' }}>
        <div style={{ width: '64px', height: '64px', borderRadius: '16px', background: 'rgba(255, 23, 68, 0.1)', border: '1px solid rgba(255, 23, 68, 0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '2rem', margin: '0 auto 24px' }}>
          ⚠️
        </div>
        <h1 className="font-display" style={{ fontSize: '2rem', fontWeight: 800, color: '#FFF', marginBottom: '16px' }}>
          Something went wrong.
        </h1>
        <p style={{ color: 'var(--text-secondary)', marginBottom: '32px', lineHeight: 1.6 }}>
          An unexpected error occurred in our command center. We've been notified and are working on it.
        </p>
        
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <button
            onClick={() => reset()}
            className="btn btn-primary"
            style={{ width: '100%' }}
          >
            Try Refreshing
          </button>
          <Link href="/" className="btn btn-ghost" style={{ width: '100%' }}>
            Return to Base
          </Link>
        </div>
        
        {process.env.NODE_ENV === 'development' && (
          <div style={{ marginTop: '32px', padding: '16px', background: 'rgba(0,0,0,0.3)', borderRadius: '8px', textAlign: 'left', overflow: 'auto', maxHeight: '200px' }}>
            <code style={{ fontSize: '0.75rem', color: 'var(--danger)', whiteSpace: 'pre-wrap' }}>{error.message}</code>
          </div>
        )}
      </div>
    </div>
  );
}
