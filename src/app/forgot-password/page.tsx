'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, Mail, CheckCircle2, AlertCircle, Loader2 } from 'lucide-react';
import { resetPassword } from '@/app/actions/auth';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [isPending, setIsPending] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsPending(true);
    setError(null);

    const formData = new FormData(e.currentTarget);
    const result = await resetPassword(formData);

    setIsPending(false);
    if (result?.error) {
      setError(result.error);
    } else {
      setSuccess(true);
    }
  };

  return (
    <div className="min-h-screen bg-[#030508] flex items-center justify-center p-6 relative overflow-hidden">
      {/* Background Glows */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gold/5 blur-[120px] pointer-events-none" />
      
      <div className="w-full max-w-[340px] relative z-10 py-12">
        <Link 
          href="/login" 
          className="flex items-center gap-2 text-muted hover:text-white transition-all mb-10 text-[9px] font-black uppercase tracking-[0.2em] group w-fit italic opacity-30 hover:opacity-100"
        >
          <ArrowLeft className="w-3.5 h-3.5 transition-transform group-hover:-translate-x-1" />
          Authorize Login
        </Link>

        <div className="card-elite !bg-black/60 p-8 md:p-10 border-white/5 shadow-2xl relative overflow-hidden">
          <div className="mb-10 text-center md:text-left">
            <h1 className="font-display text-3xl md:text-4xl font-black text-white italic uppercase tracking-tighter mb-3">
              Lost <span className="text-gradient-gold">Key?</span>
            </h1>
            <p className="text-muted text-[10px] font-black uppercase tracking-[0.2em] leading-relaxed opacity-30 italic">
              credential recovery sequence
            </p>
          </div>

          {!success ? (
            <form onSubmit={handleSubmit} className="flex flex-col gap-6">
              {error && (
                <div className="flex items-center gap-4 p-4 bg-danger/5 border border-danger/10 rounded-xl animate-shake">
                  <AlertCircle className="w-4 h-4 text-danger flex-shrink-0" />
                  <p className="text-danger text-[9px] font-black uppercase tracking-[0.2em] leading-tight italic">
                    {error}
                  </p>
                </div>
              )}

              <div className="flex flex-col gap-2.5">
                <label className="text-[9px] font-black text-muted uppercase tracking-[0.3em] ml-1 opacity-40 italic">
                  Registry Email
                </label>
                <div className="relative group">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted/20 group-focus-within:text-gold transition-colors" />
                  <input
                    type="email"
                    name="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="operator@arena.com"
                    className="w-full bg-white/[0.02] border border-white/5 rounded-xl py-4 pl-12 pr-5 text-white text-sm focus:outline-none focus:border-gold/30 focus:bg-white/[0.04] transition-all placeholder:text-white/10"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={isPending}
                className="btn btn-primary w-full py-4.5 italic text-[11px] shadow-2xl shadow-gold/5 flex items-center justify-center gap-3 group mt-4"
              >
                {isPending ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <>
                    Initialize Recovery
                    <ArrowLeft className="w-3.5 h-3.5 rotate-180 transition-transform group-hover:translate-x-1" />
                  </>
                )}
              </button>
            </form>
          ) : (
            <div className="flex flex-col items-center text-center py-6 animate-fade-in">
              <div className="w-16 h-16 rounded-2xl bg-success/5 border border-success/15 flex items-center justify-center mb-8 shadow-glow-success">
                <CheckCircle2 className="w-8 h-8 text-success" />
              </div>
              <h3 className="text-white font-black uppercase tracking-[0.2em] mb-4 text-xs italic">DISPATCHED</h3>
              <p className="text-muted text-[10px] font-black uppercase tracking-[0.2em] leading-relaxed max-w-[220px] italic opacity-30">
                Recovery link deployed to <br /><span className="text-white opacity-100">{email}</span>.
              </p>
              <Link 
                href="/login" 
                className="mt-10 btn btn-ghost w-full py-4 text-[11px] font-black uppercase tracking-[0.2em] border-white/5 italic"
              >
                BACK TO LOGIN
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
