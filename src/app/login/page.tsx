'use client';

import { useState, Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { login } from '@/app/actions/auth';
import { Zap, AlertCircle, Eye, EyeOff, ArrowRight, Lock, Globe } from 'lucide-react';

function LoginForm() {
  const searchParams = useSearchParams();
  const message = searchParams.get('message');
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const loginAction = async (formData: FormData) => {
    setIsLoading(true);
    setErrorMsg(null);
    const res = await login(formData);
    if (res?.error) {
      setErrorMsg(res.error);
      setIsLoading(false);
    }
  };

  return (
    <div style={{ width: '100%', maxWidth: '400px', position: 'relative', zIndex: 1 }}>
      <div style={{ marginBottom: '40px', textAlign: 'center' }}>
        <h2 style={{ fontFamily: "var(--font-display)", fontSize: '2.25rem', fontWeight: 800, color: '#FFF', marginBottom: '12px', letterSpacing: '-0.02em' }}>Welcome Back</h2>
        <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', fontWeight: 500, opacity: 0.7 }}>Resume your prediction sequence.</p>
      </div>

      <form action={loginAction} style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
        {message && (
          <div style={{ padding: '14px', background: 'rgba(0,194,255,0.1)', border: '1px solid rgba(0,194,255,0.2)', borderRadius: '12px', color: '#00C2FF', fontSize: '0.8125rem', display: 'flex', alignItems: 'center', gap: '10px' }}>
            <Zap className="w-16 h-16 shrink-0" />
            <span style={{ fontWeight: 600 }}>{message}</span>
          </div>
        )}
        {errorMsg && (
          <div style={{ padding: '14px', background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.2)', borderRadius: '12px', color: '#FF4D4D', fontSize: '0.8125rem', display: 'flex', alignItems: 'center', gap: '10px' }}>
            <AlertCircle className="w-16 h-16 shrink-0" />
            <span style={{ fontWeight: 600 }}>{errorMsg}</span>
          </div>
        )}

        <div>
          <label style={labelStyle}>Email Address</label>
          <input 
            type="email" 
            name="email"
            required
            autoComplete="email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            placeholder="operator@predchain.com"
            style={inputStyle}
          />
        </div>

        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
            <label style={labelStyle}>Password</label>
            <Link href="#" style={{ fontSize: '0.7rem', color: 'var(--blue-electric)', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Forgot key?</Link>
          </div>
          <div style={{ position: 'relative' }}>
            <input 
              type={showPassword ? "text" : "password"} 
              name="password"
              required
              autoComplete="current-password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              placeholder="••••••••"
              style={inputStyle}
            />
            <button 
              type="button" 
              onClick={() => setShowPassword(!showPassword)}
              style={{ position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', padding: '4px' }}
            >
              {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
          </div>
        </div>

        <button 
          type="submit" 
          disabled={isLoading}
          className="btn btn-primary" 
          style={{ width: '100%', padding: '16px', fontSize: '0.875rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.1em', marginTop: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px', opacity: isLoading ? 0.7 : 1 }}
        >
          {isLoading ? 'Decrypting Access...' : <>Initialize Session <ArrowRight size={16} /></>}
        </button>
      </form>

      <p style={{ textAlign: 'center', fontSize: '0.875rem', color: 'var(--text-secondary)', marginTop: '40px', fontWeight: 500 }}>
        New Operative? <Link href="/signup" style={{ color: 'var(--gold)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Create Account</Link>
      </p>
    </div>
  );
}

export default function LoginPage() {
  return (
    <div style={{ minHeight: '100vh', display: 'flex', background: 'var(--bg-primary)', overflow: 'hidden' }}>
      
      {/* ──────────────────────── LEFT: CINEMATIC ART ──────────────────────── */}
      <div className="auth-pane-left">
        <div style={{ position: 'absolute', inset: 0, background: 'var(--bg-secondary)', zIndex: 0 }} />
        <div style={{ position: 'absolute', bottom: '5%', left: '5%', width: '80%', height: '80%', background: 'var(--grad-blue)', filter: 'blur(160px)', opacity: 0.1, borderRadius: '50%', zIndex: 1 }} />
        <div style={{ position: 'absolute', inset: 0, backgroundImage: 'linear-gradient(rgba(255,255,255,0.02) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.02) 1px, transparent 1px)', backgroundSize: '32px 32px', zIndex: 1 }} />

        <div style={{ position: 'relative', zIndex: 2, padding: '80px', maxWidth: '640px', height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
          <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '80px', width: 'fit-content' }}>
            <div style={{ width: '48px', height: '48px', background: 'linear-gradient(135deg, var(--gold), #FFF)', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#000', fontWeight: 900, fontSize: '1.25rem', boxShadow: '0 0 20px rgba(255,215,0,0.3)' }}>P</div>
            <span style={{ fontFamily: "var(--font-display)", fontSize: '1.75rem', fontWeight: 900, color: '#FFF', letterSpacing: '-0.03em' }}>PredChain</span>
          </Link>
          
          <div style={{ marginBottom: '60px' }}>
             <h1 style={{ fontFamily: "var(--font-display)", fontSize: 'clamp(2.5rem, 5vw, 4rem)', fontWeight: 900, color: '#FFF', lineHeight: 1.05, marginBottom: '32px', letterSpacing: '-0.04em' }}>
              Access Your <br />
              <span className="text-gradient-gold">Control Node.</span>
            </h1>
            <p style={{ fontSize: '1.125rem', color: 'var(--text-secondary)', lineHeight: 1.6, fontWeight: 400, opacity: 0.8, maxWidth: '500px' }}>
              Resume your strategic oversight of live challenges and manage your verified capital growth from your professional dashboard.
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '40px' }}>
             <div style={{ display: 'flex', gap: '16px' }}>
                <div style={{ marginTop: '4px', color: 'var(--gold)' }}><Lock size={20} /></div>
                <div>
                   <h4 style={{ color: '#FFF', fontSize: '0.875rem', fontWeight: 800, marginBottom: '4px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Secured Entry</h4>
                   <p style={{ color: 'var(--text-secondary)', fontSize: '0.75rem', lineHeight: 1.5 }}>Encrypted session management via Supabase Auth.</p>
                </div>
             </div>
             <div style={{ display: 'flex', gap: '16px' }}>
                <div style={{ marginTop: '4px', color: 'var(--gold)' }}><Globe size={20} /></div>
                <div>
                   <h4 style={{ color: '#FFF', fontSize: '0.875rem', fontWeight: 800, marginBottom: '4px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Global Sync</h4>
                   <p style={{ color: 'var(--text-secondary)', fontSize: '0.75rem', lineHeight: 1.5 }}>Multi-device synchronization for real-time tracking.</p>
                </div>
             </div>
          </div>
        </div>
      </div>

      {/* ──────────────────────── RIGHT: AUTH FORM ──────────────────────── */}
      <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '80px 24px', position: 'relative' }}>
         <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', width: '600px', height: '600px', background: 'var(--grad-gold)', filter: 'blur(160px)', opacity: 0.05, pointerEvents: 'none' }} />
        
        <Suspense fallback={<div style={{ color: '#FFF', fontWeight: 900, fontFamily: 'var(--font-mono)' }}>INITIALIZING...</div>}>
           <LoginForm />
        </Suspense>
      </div>
    </div>
  );
}

const labelStyle = {
  display: 'block', 
  fontSize: '0.7rem', 
  fontWeight: 800, 
  color: 'var(--text-secondary)', 
  textTransform: 'uppercase', 
  letterSpacing: '0.1em',
  opacity: 0.6
};

const inputStyle = {
  width: '100%', 
  padding: '16px 20px', 
  background: 'rgba(255,255,255,0.02)',
  border: '1px solid var(--border)', 
  borderRadius: '12px', 
  color: '#FFF',
  fontSize: '1rem', 
  fontWeight: 500,
  outline: 'none', 
  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
  fontFamily: 'inherit',
  boxShadow: 'inset 0 2px 4px rgba(0,0,0,0.1)'
};
