'use client';

import { useState, Suspense } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { login } from '@/app/actions/auth';

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const message = searchParams.get('message');
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const loginAction = async (formData: FormData) => {
    setIsLoading(true);
    setErrorMsg(null);
    
    // Add returnTo from search params
    const returnTo = searchParams.get('returnTo');
    if (returnTo) formData.append('returnTo', returnTo);
    
    const res = await login(formData);
    if (res?.error) {
      setErrorMsg(res.error);
      setIsLoading(false);
    }
  };

  return (
    <form action={loginAction} style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      {message && (
        <div style={{ padding: '12px', background: 'rgba(0,194,255,0.1)', border: '1px solid rgba(0,194,255,0.3)', borderRadius: '8px', color: '#00C2FF', fontSize: '0.875rem', textAlign: 'center' }}>
          {message}
        </div>
      )}
      {errorMsg && (
        <div style={{ padding: '12px', background: 'rgba(220,38,38,0.1)', border: '1px solid rgba(220,38,38,0.3)', borderRadius: '8px', color: '#EF4444', fontSize: '0.875rem', textAlign: 'center' }}>
          {errorMsg}
        </div>
      )}
      <div>
        <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '8px' }}>Email Address</label>
        <input 
          type="email" 
          name="email"
          required
          autoComplete="email"
          value={email}
          onChange={e => setEmail(e.target.value)}
          placeholder="striker@example.com"
          style={inputStyle}
        />
      </div>

      <div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '8px' }}>
          <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Password</label>

        </div>
        <input 
          type="password" 
          name="password"
          required
          autoComplete="current-password"
          value={password}
          onChange={e => setPassword(e.target.value)}
          placeholder="••••••••"
          style={inputStyle}
        />
      </div>

      <button 
        type="submit" 
        className="btn btn-primary" 
        style={{ width: '100%', marginTop: '8px', opacity: isLoading ? 0.7 : 1, pointerEvents: isLoading ? 'none' : 'auto' }}
      >
        {isLoading ? 'Authenticating...' : 'Sign In'}
      </button>
    </form>
  );
}

export default function LoginPage() {
  return (
    <div style={{ minHeight: '100vh', display: 'flex', background: 'var(--bg-primary)', overflow: 'hidden' }}>
      
      {/* ──────────────────────── LEFT: CINEMATIC ART ──────────────────────── */}
      <div className="auth-pane-left">
        <div style={{ position: 'absolute', inset: 0, background: 'var(--bg-secondary)', zIndex: 0 }} />
        <div style={{ position: 'absolute', top: '10%', left: '10%', width: '600px', height: '600px', background: 'var(--grad-aurora)', filter: 'blur(120px)', opacity: 0.5, borderRadius: '50%', zIndex: 1 }} />
        <div style={{ position: 'absolute', inset: 0, backgroundImage: 'linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px)', backgroundSize: '40px 40px', zIndex: 1 }} />

        <div style={{ position: 'relative', zIndex: 2, padding: '60px', maxWidth: '600px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '40px' }}>
            <span style={{ width: '40px', height: '40px', background: 'linear-gradient(135deg, var(--gold), #FFF)', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#000', fontWeight: 800 }}>P</span>
            <span style={{ fontFamily: "var(--font-display)", fontSize: '1.5rem', fontWeight: 800, color: '#FFF' }}>PredChain</span>
          </div>
          
          <h1 style={{ fontFamily: "var(--font-display)", fontSize: 'clamp(2.5rem, 4vw, 3.5rem)', fontWeight: 800, color: '#FFF', lineHeight: 1.1, marginBottom: '24px' }}>
            Enter the <span className="text-gradient-gold">Arena.</span>
          </h1>
          <p style={{ fontSize: '1.125rem', color: 'var(--text-secondary)', lineHeight: 1.6, fontWeight: 300 }}>
            Log in to manage your active challenge streak, track leaderboard movements, and withdraw your 10X perfect prediction rewards.
          </p>
        </div>
      </div>

      {/* ──────────────────────── RIGHT: AUTH FORM ──────────────────────── */}
      <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '120px 24px 80px', position: 'relative' }}>
        <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', width: '500px', height: '500px', background: 'var(--grad-gold)', filter: 'blur(160px)', opacity: 0.1, pointerEvents: 'none' }} />
        
        <div style={{ width: '100%', maxWidth: '420px', position: 'relative', zIndex: 1 }}>
          <div style={{ marginBottom: '40px', textAlign: 'center' }}>
            <h2 style={{ fontFamily: "var(--font-display)", fontSize: '2rem', fontWeight: 700, color: '#FFF', marginBottom: '8px' }}>Welcome Back</h2>
            <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>Sign in to continue your streak.</p>
          </div>

          <Suspense fallback={<div style={{ textAlign: 'center', color: 'var(--text-muted)', padding: '40px' }}>Loading form...</div>}>
            <LoginForm />
          </Suspense>

          <div style={{ display: 'flex', alignItems: 'center', margin: '32px 0' }}>
            <div style={{ flex: 1, height: '1px', background: 'var(--border)' }} />
            <div style={{ padding: '0 16px', fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>OR</div>
            <div style={{ flex: 1, height: '1px', background: 'var(--border)' }} />
          </div>

          {/* Placeholder methods removed for launch focus */}

          <p style={{ textAlign: 'center', fontSize: '0.8125rem', color: 'var(--text-secondary)', marginTop: '40px' }}>
            Don&apos;t have an account? <Link href="/signup" style={{ color: '#00C2FF', fontWeight: 600 }}>Create one</Link>
          </p>
        </div>
      </div>
    </div>
  );
}

const inputStyle = {
  width: '100%', padding: '16px 20px', background: 'rgba(255,255,255,0.03)',
  border: '1px solid var(--border)', borderRadius: '12px', color: '#FFF',
  fontSize: '1rem', outline: 'none', transition: 'all 0.2s',
  fontFamily: 'inherit'
};
