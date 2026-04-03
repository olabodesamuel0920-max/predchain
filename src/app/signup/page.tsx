'use client';

import { useState, Suspense } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { signup } from '@/app/actions/auth';

function SignupForm() {
  const searchParams = useSearchParams();
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [isPending, setIsPending] = useState(false);

  const signupAction = async (formData: FormData) => {
    setIsPending(true);
    setErrorMsg(null);
    
    // Add returnTo from search params
    const returnTo = searchParams.get('returnTo');
    if (returnTo) formData.append('returnTo', returnTo);
    
    const res = await signup(formData);
    if (res?.error) {
      setErrorMsg(res.error);
      setIsPending(false);
    }
  };

  const returnTo = searchParams.get('returnTo');
  const loginUrl = returnTo ? `/login?returnTo=${encodeURIComponent(returnTo)}` : '/login';

  return (
    <div style={{ width: '100%', maxWidth: '420px', position: 'relative', zIndex: 1 }}>
      <div style={{ marginBottom: '40px', textAlign: 'center' }}>
        <h2 style={{ fontFamily: "var(--font-display)", fontSize: '2rem', fontWeight: 700, color: '#FFF', marginBottom: '8px' }}>Create Account</h2>
        <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>Enter your details to get started.</p>
      </div>

      <form action={signupAction} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
        {errorMsg && (
          <div style={{ padding: '12px', background: 'rgba(220,38,38,0.1)', border: '1px solid rgba(220,38,38,0.3)', borderRadius: '8px', color: '#EF4444', fontSize: '0.875rem', textAlign: 'center' }}>
            {errorMsg}
          </div>
        )}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
          <div>
            <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-secondary)', textTransform: 'uppercase', marginBottom: '8px' }}>Full Name</label>
            <input name="full_name" type="text" required placeholder="John Doe" style={inputStyle} />
          </div>
          <div>
            <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-secondary)', textTransform: 'uppercase', marginBottom: '8px' }}>Username</label>
            <input name="username" type="text" required placeholder="striker1" style={inputStyle} />
          </div>
        </div>

        <div>
          <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-secondary)', textTransform: 'uppercase', marginBottom: '8px' }}>Email Address</label>
          <input name="email" type="email" required placeholder="john@example.com" style={inputStyle} />
        </div>

        <div>
          <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-secondary)', textTransform: 'uppercase', marginBottom: '8px' }}>Phone Number</label>
          <input name="phone" type="tel" required placeholder="+234..." style={inputStyle} />
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
          <div>
            <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-secondary)', textTransform: 'uppercase', marginBottom: '8px' }}>Password</label>
            <input name="password" type="password" required placeholder="••••••••" style={inputStyle} />
          </div>
          <div>
            <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-secondary)', textTransform: 'uppercase', marginBottom: '8px' }}>Referral Code</label>
            <input name="referral_code" type="text" placeholder="Optional" style={inputStyle} />
          </div>
        </div>

        <button type="submit" disabled={isPending} className="btn btn-primary" style={{ width: '100%', marginTop: '8px', opacity: isPending ? 0.7 : 1 }}>
          {isPending ? 'Creating Account...' : 'Create Account'}
        </button>
      </form>

      <p style={{ textAlign: 'center', fontSize: '0.8125rem', color: 'var(--text-secondary)', marginTop: '40px' }}>
        Already have an account? <Link href={loginUrl} style={{ color: 'var(--gold)', fontWeight: 600 }}>Sign In</Link>
      </p>
    </div>
  );
}

export default function SignupPage() {
  return (
    <div style={{ minHeight: '100vh', display: 'flex', background: 'var(--bg-primary)', overflow: 'hidden' }}>
      
      {/* LEFT: CINEMATIC ART */}
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
            Join the Elite <span className="text-gradient-gold">Circle.</span>
          </h1>
          <p style={{ fontSize: '1.125rem', color: 'var(--text-secondary)', lineHeight: 1.6, fontWeight: 300 }}>
            Create your account to start your prediction streak. High stakes, high rewards, and total control over your football insights.
          </p>
        </div>
      </div>

      {/* RIGHT: AUTH FORM */}
      <div style={{
        flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center',
        padding: '120px 24px 80px', position: 'relative'
      }}>
        <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', width: '500px', height: '500px', background: 'var(--grad-gold)', filter: 'blur(160px)', opacity: 0.1, pointerEvents: 'none' }} />
        
        <Suspense fallback={<div style={{ textAlign: 'center', color: 'var(--text-muted)', padding: '40px' }}>Loading form...</div>}>
          <SignupForm />
        </Suspense>
      </div>
    </div>
  );
}

const inputStyle = {
  width: '100%', padding: '14px 16px', background: 'rgba(255,255,255,0.03)',
  border: '1px solid var(--border)', borderRadius: '12px', color: '#FFF',
  fontSize: '0.9375rem', outline: 'none', transition: 'all 0.2s',
  fontFamily: 'inherit'
};
