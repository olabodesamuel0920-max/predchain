'use client';

import { useState, useEffect, Suspense, useRef } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { signup } from '@/app/actions/auth';
import { ShieldCheck, Zap, CheckCircle2, AlertCircle, Eye, EyeOff, ArrowRight } from 'lucide-react';

function SignupForm() {
  const searchParams = useSearchParams();
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [isPending, setIsPending] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [referralCode, setReferralCode] = useState('');

  const initialRefProcessed = useRef(false);
  useEffect(() => {
    if (initialRefProcessed.current) return;
    const ref = searchParams.get('ref');
    if (ref && !initialRefProcessed.current) {
      setTimeout(() => {
        setReferralCode(ref);
      }, 0);
      initialRefProcessed.current = true;
    }
  }, [searchParams]);

  const signupAction = async (formData: FormData) => {
    const password = formData.get('password') as string;
    const acceptTerms = formData.get('terms') === 'on';

    if (password.length < 8) {
      setErrorMsg('Security Protocol: Password must be at least 8 characters.');
      return;
    }

    if (!acceptTerms) {
      setErrorMsg('Policy Error: You must accept the terms of service.');
      return;
    }

    setIsPending(true);
    setErrorMsg(null);
    
    const res = await signup(formData);
    if (res?.error) {
      setErrorMsg(res.error);
      setIsPending(false);
    }
  };

  return (
    <div style={{ width: '100%', maxWidth: '440px', position: 'relative', zIndex: 1 }}>
      <div style={{ marginBottom: '40px', textAlign: 'center' }}>
        <h2 style={{ fontFamily: "var(--font-display)", fontSize: '2.25rem', fontWeight: 800, color: '#FFF', marginBottom: '12px', letterSpacing: '-0.02em' }}>Initialize Account</h2>
        <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', fontWeight: 500, opacity: 0.7 }}>Secure your node in the PredChain network.</p>
      </div>

      <form action={signupAction} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
        {errorMsg && (
          <div style={{ padding: '14px', background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.2)', borderRadius: '12px', color: '#FF4D4D', fontSize: '0.8125rem', display: 'flex', alignItems: 'center', gap: '10px' }}>
            <AlertCircle className="w-16 h-16 shrink-0" />
            <span style={{ fontWeight: 600 }}>{errorMsg}</span>
          </div>
        )}

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
          <div>
            <label style={labelStyle}>Full Name</label>
            <input name="full_name" type="text" required placeholder="John Doe" style={inputStyle} />
          </div>
          <div>
            <label style={labelStyle}>Username</label>
            <input name="username" type="text" required placeholder="striker_01" style={inputStyle} />
          </div>
        </div>

        <div>
          <label style={labelStyle}>Email Address</label>
          <input name="email" type="email" required placeholder="name@domain.com" style={inputStyle} />
        </div>

        <div>
          <label style={labelStyle}>Phone Number</label>
          <input name="phone" type="tel" required placeholder="+234..." style={inputStyle} />
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
          <div style={{ position: 'relative' }}>
            <label style={labelStyle}>Password</label>
            <input 
              name="password" 
              type={showPassword ? "text" : "password"} 
              required 
              placeholder="••••••••" 
              style={inputStyle} 
            />
            <button 
              type="button" 
              onClick={() => setShowPassword(!showPassword)}
              style={{ position: 'absolute', right: '12px', bottom: '12px', background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', padding: '4px' }}
            >
              {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
          </div>
          <div>
            <label style={labelStyle}>Referral Code</label>
            <input 
              name="referral_code" 
              type="text" 
              value={referralCode}
              onChange={(e) => setReferralCode(e.target.value)}
              placeholder="Optional" 
              style={inputStyle} 
            />
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px', marginTop: '8px' }}>
          <div style={{ position: 'relative', marginTop: '2px' }}>
            <input name="terms" type="checkbox" id="terms" style={{ opacity: 0, position: 'absolute' }} />
            <div 
              onClick={() => {
                const cb = document.getElementById('terms') as HTMLInputElement;
                cb.click();
              }}
              style={{ width: '18px', height: '18px', border: '2px solid var(--border)', borderRadius: '4px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
            >
               <CheckCircle2 style={{ width: '14px', height: '14px', color: 'var(--gold)', visibility: 'hidden' }} className="checkbox-icon" />
            </div>
          </div>
          <label htmlFor="terms" style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', lineHeight: 1.5, cursor: 'pointer' }}>
            I confirm that I am at least 18 years of age and agree to the <Link href="/terms" style={{ color: 'var(--gold)', fontWeight: 600 }}>Terms of Service</Link> and <Link href="/privacy" style={{ color: 'var(--gold)', fontWeight: 600 }}>Privacy Policy</Link>.
          </label>
        </div>

        <button type="submit" disabled={isPending} className="btn btn-primary" style={{ width: '100%', padding: '16px', fontSize: '0.875rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.1em', marginTop: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px' }}>
          {isPending ? 'Processing Encryption...' : <>Finalize Registration <ArrowRight size={16} /></>}
        </button>
      </form>

      <p style={{ textAlign: 'center', fontSize: '0.875rem', color: 'var(--text-secondary)', marginTop: '40px', fontWeight: 500 }}>
        Member already? <Link href="/login" style={{ color: 'var(--blue-electric)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Sign In</Link>
      </p>

      <style jsx>{`
        input:checked + div {
          border-color: var(--gold) !important;
          background: rgba(var(--gold-rgb), 0.1);
        }
        input:checked + div .checkbox-icon {
          visibility: visible !important;
        }
      `}</style>
    </div>
  );
}

export default function SignupPage() {
  return (
    <div style={{ minHeight: '100vh', display: 'flex', background: 'var(--bg-primary)', overflow: 'hidden' }}>
      
      {/* ──────────────────────── LEFT: CINEMATIC ART ──────────────────────── */}
      <div className="auth-pane-left">
        <div style={{ position: 'absolute', inset: 0, background: 'var(--bg-secondary)', zIndex: 0 }} />
        <div style={{ position: 'absolute', top: '5%', right: '5%', width: '80%', height: '80%', background: 'var(--grad-gold)', filter: 'blur(160px)', opacity: 0.15, borderRadius: '50%', zIndex: 1 }} />
        <div style={{ position: 'absolute', inset: 0, backgroundImage: 'linear-gradient(rgba(255,255,255,0.02) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.02) 1px, transparent 1px)', backgroundSize: '32px 32px', zIndex: 1 }} />

        <div style={{ position: 'relative', zIndex: 2, padding: '80px', maxWidth: '640px', height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
          <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '80px', width: 'fit-content' }}>
            <div style={{ width: '48px', height: '48px', background: 'linear-gradient(135deg, var(--gold), #FFF)', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#000', fontWeight: 900, fontSize: '1.25rem', boxShadow: '0 0 20px rgba(255,215,0,0.3)' }}>P</div>
            <span style={{ fontFamily: "var(--font-display)", fontSize: '1.75rem', fontWeight: 900, color: '#FFF', letterSpacing: '-0.03em' }}>PredChain</span>
          </Link>
          
          <div style={{ marginBottom: '60px' }}>
             <h1 style={{ fontFamily: "var(--font-display)", fontSize: 'clamp(2.5rem, 5vw, 4rem)', fontWeight: 900, color: '#FFF', lineHeight: 1.05, marginBottom: '32px', letterSpacing: '-0.04em' }}>
              Your Capital <br />
              <span className="text-gradient-gold">Multiplied 10X.</span>
            </h1>
            <p style={{ fontSize: '1.125rem', color: 'var(--text-secondary)', lineHeight: 1.6, fontWeight: 400, opacity: 0.8, maxWidth: '500px' }}>
              Join the only platform where football insights translate directly into verified financial growth through our atomic settlement protocol.
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '40px' }}>
             <div style={{ display: 'flex', gap: '16px' }}>
                <div style={{ marginTop: '4px', color: 'var(--gold)' }}><ShieldCheck size={20} /></div>
                <div>
                   <h4 style={{ color: '#FFF', fontSize: '0.875rem', fontWeight: 800, marginBottom: '4px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Atomic Security</h4>
                   <p style={{ color: 'var(--text-secondary)', fontSize: '0.75rem', lineHeight: 1.5 }}>Multi-sig wallet protection on every settlement.</p>
                </div>
             </div>
             <div style={{ display: 'flex', gap: '16px' }}>
                <div style={{ marginTop: '4px', color: 'var(--gold)' }}><Zap size={20} /></div>
                <div>
                   <h4 style={{ color: '#FFF', fontSize: '0.875rem', fontWeight: 800, marginBottom: '4px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Instant Payout</h4>
                   <p style={{ color: 'var(--text-secondary)', fontSize: '0.75rem', lineHeight: 1.5 }}>3/3 correct predictions settle in real-time.</p>
                </div>
             </div>
          </div>
        </div>
      </div>

      {/* ──────────────────────── RIGHT: AUTH FORM ──────────────────────── */}
      <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '80px 24px', position: 'relative', overflowY: 'auto' }}>
        <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', width: '600px', height: '600px', background: 'var(--grad-blue)', filter: 'blur(160px)', opacity: 0.05, pointerEvents: 'none' }} />
        
        <Suspense fallback={<div style={{ color: '#FFF', fontWeight: 900, fontFamily: 'var(--font-mono)' }}>INITIALIZING...</div>}>
           <SignupForm />
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
  marginBottom: '8px',
  opacity: 0.6
};

const inputStyle = {
  width: '100%', 
  padding: '14px 18px', 
  background: 'rgba(255,255,255,0.02)',
  border: '1px solid var(--border)', 
  borderRadius: '12px', 
  color: '#FFF',
  fontSize: '0.9375rem', 
  fontWeight: 500,
  outline: 'none', 
  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
  fontFamily: 'inherit',
  boxShadow: 'inset 0 2px 4px rgba(0,0,0,0.1)'
};
