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
    <div className="min-h-screen bg-[#030508] flex items-center justify-center p-12 md:p-24 overflow-y-auto">
      {/* Background Glows (Subtle on mobile) */}
      <div className="absolute top-1/4 left-1/4 w-[300px] h-[300px] bg-blue-electric/5 blur-[120px] pointer-events-none hidden md:block" />
      <div className="absolute bottom-1/4 right-1/4 w-[300px] h-[300px] bg-gold/5 blur-[120px] pointer-events-none hidden md:block" />

      <div className="w-full max-w-sm relative z-10 py-24">
        <Link 
          href="/login" 
          className="flex items-center gap-2 text-muted/40 hover:text-white transition-colors mb-12 text-[10px] font-bold uppercase tracking-widest group w-fit italic"
        >
          <ArrowLeft className="w-3.5 h-3.5 transition-transform group-hover:-translate-x-1" />
          Authorize Login
        </Link>

        <div className="card p-8 md:p-10 border-white/5 bg-white/[0.015] backdrop-blur-xl shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-[2px] bg-grad-gold opacity-30" />
          
          <div className="mb-12">
            <h1 className="font-display text-2xl font-bold text-white italic uppercase tracking-tighter mb-4">
              Reset <span className="text-gradient-gold">Access</span>
            </h1>
            <p className="text-muted/40 text-[10px] font-bold uppercase tracking-widest leading-relaxed italic">
              Enter your credential to receive a secure recovery link.
            </p>
          </div>

          {!success ? (
            <form onSubmit={handleSubmit} className="flex flex-col gap-8">
              {error && (
                <div className="flex items-center gap-4 p-4 bg-danger/5 border border-danger/20 rounded-xl animate-shake">
                  <AlertCircle className="w-4 h-4 text-danger flex-shrink-0" />
                  <p className="text-danger text-[9px] font-bold uppercase tracking-widest leading-tight italic">
                    {error}
                  </p>
                </div>
              )}

              <div className="flex flex-col gap-2">
                <label className="text-[10px] font-bold text-muted/40 uppercase tracking-widest ml-1 italic">
                  Node Identifier (Email)
                </label>
                <div className="relative group">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted/20 group-focus-within:text-blue-electric transition-colors" />
                  <input
                    type="email"
                    name="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="name@email.com"
                    className="w-full bg-black/40 border border-white/5 rounded-xl py-3 pl-12 pr-4 text-white font-mono text-xs focus:outline-none focus:border-blue-electric/40 transition-all placeholder:text-white/10"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={isPending}
                className="btn btn-blue w-full py-3.5 font-bold uppercase tracking-widest text-[10px] shadow-2xl shadow-blue-electric/10 flex items-center justify-center gap-4 group"
              >
                {isPending ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <>
                    Request Recovery
                    <ArrowLeft className="w-3.5 h-3.5 rotate-180 transition-transform group-hover:translate-x-1" />
                  </>
                )}
              </button>
            </form>
          ) : (
            <div className="flex flex-col items-center text-center py-10 animate-fade-in">
              <div className="w-16 h-16 rounded-full bg-success/5 border border-success/15 flex items-center justify-center mb-8 relative">
                <div className="absolute inset-0 bg-success/10 blur-xl rounded-full opacity-40 text-success" />
                <CheckCircle2 className="w-8 h-8 text-success relative z-10" />
              </div>
              <h3 className="text-white font-bold uppercase tracking-widest mb-4 text-sm italic">Transmission Successful</h3>
              <p className="text-muted/40 text-[10px] font-bold uppercase tracking-widest leading-relaxed max-w-[240px] italic">
                A secure recovery link has been dispatched to <span className="text-white">{email}</span>.
              </p>
              <Link 
                href="/login" 
                className="mt-12 btn btn-ghost w-full py-3.5 text-[10px] font-bold uppercase tracking-widest border-white/5"
              >
                Authorize Login
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
