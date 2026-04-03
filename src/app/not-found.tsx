import Link from 'next/link';

export default function NotFound() {
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
      <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', width: '600px', height: '600px', background: 'var(--grad-aurora)', filter: 'blur(160px)', opacity: 0.1, pointerEvents: 'none' }} />
      
      <div className="card" style={{ maxWidth: '480px', padding: '64px 32px' }}>
        <div style={{ fontSize: '5rem', fontWeight: 900, color: 'var(--gold)', marginBottom: '8px', opacity: 0.8, letterSpacing: '-0.05em' }}>
          404
        </div>
        <h1 className="font-display" style={{ fontSize: '2rem', fontWeight: 800, color: '#FFF', marginBottom: '16px' }}>
          Area Out of Bounds
        </h1>
        <p style={{ color: 'var(--text-secondary)', marginBottom: '32px', lineHeight: 1.6 }}>
          The page you're searching for doesn't exist in our arena. You might have taken a wrong turn or the link is broken.
        </p>
        
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <Link href="/dashboard" className="btn btn-primary" style={{ width: '100%' }}>
            Back to Dashboard
          </Link>
          <Link href="/" className="btn btn-ghost" style={{ width: '100%' }}>
            Main Entrance
          </Link>
        </div>
      </div>
    </div>
  );
}
