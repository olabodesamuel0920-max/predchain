'use client';

import { useState } from 'react';
import { Shield, KeyRound, CheckCircle2, AlertCircle, Loader2, ArrowLeft } from 'lucide-react';
import { updatePassword } from '@/app/actions/auth';

export default function UpdatePasswordPage() {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isPending, setIsPending] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsPending(true);
    setError(null);

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      setIsPending(false);
      return;
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters');
      setIsPending(false);
      return;
    }

    const formData = new FormData(e.currentTarget);
    const result = await updatePassword(formData);

    if (result?.error) {
      setError(result.error);
      setIsPending(false);
    } else {
      setSuccess(true);
      setIsPending(false);
    }
  };

  if (success) {
    return (
      <div className="min-h-screen bg-[#030508] flex items-center justify-center p-6 relative overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-emerald-500/5 blur-[120px] pointer-events-none" />
        <div className="w-full max-w-[340px] relative z-10">
          <div className="card-elite !bg-black/60 p-8 md:p-10 border-white/5 shadow-2xl text-center">
            <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center mb-8 mx-auto shadow-glow-emerald">
              <CheckCircle2 className="w-6 h-6 text-emerald-500" />
            </div>
            <h1 className="font-display text-2xl font-black text-white italic uppercase tracking-tighter mb-4">
              Access <span className="text-emerald-500">Restored</span>
            </h1>
            <p className="text-muted text-[10px] font-black uppercase tracking-[0.2em] leading-relaxed mb-8 opacity-40 italic">
              your security protocol has been successfully refreshed
            </p>
            <a href="/login" className="btn btn-blue w-full py-4 uppercase text-[10px] items-center justify-center flex gap-2">
              <ArrowLeft className="w-3.5 h-3.5" /> Return to Login
            </a>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#030508] flex items-center justify-center p-6 relative overflow-hidden">
      {/* Background Glows */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-blue-electric/5 blur-[120px] pointer-events-none" />
      
      <div className="w-full max-w-[340px] relative z-10 py-12">
        <div className="card-elite !bg-black/60 p-8 md:p-10 border-white/5 shadow-2xl relative overflow-hidden">
          <div className="mb-10 text-center md:text-left">
            <div className="w-10 h-10 rounded-xl bg-blue-electric/10 border border-blue-electric/20 flex items-center justify-center mb-6 shadow-glow-blue">
              <Shield className="w-5 h-5 text-blue-electric" />
            </div>
            <h1 className="font-display text-3xl md:text-4xl font-black text-white italic uppercase tracking-tighter mb-3">
              Update <span className="text-gradient-blue">Access</span>
            </h1>
            <p className="text-muted text-[10px] font-black uppercase tracking-[0.2em] leading-relaxed opacity-30 italic">
              credential update protocol
            </p>
          </div>

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
                New Access Key
              </label>
              <div className="relative group">
                <KeyRound className="absolute left-4 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted/20 group-focus-within:text-blue-electric transition-colors" />
                <input
                  type="password"
                  name="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full bg-white/[0.02] border border-white/5 rounded-xl py-4 pl-12 pr-5 text-white text-sm focus:outline-none focus:border-blue-electric/30 focus:bg-white/[0.04] transition-all placeholder:text-white/10"
                />
              </div>
            </div>

            <div className="flex flex-col gap-2.5">
              <label className="text-[9px] font-black text-muted uppercase tracking-[0.3em] ml-1 opacity-40 italic">
                Confirm Access Key
              </label>
              <div className="relative group">
                <KeyRound className="absolute left-4 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted/20 group-focus-within:text-blue-electric transition-colors" />
                <input
                  type="password"
                  required
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full bg-white/[0.02] border border-white/5 rounded-xl py-4 pl-12 pr-5 text-white text-sm focus:outline-none focus:border-blue-electric/30 focus:bg-white/[0.04] transition-all placeholder:text-white/10"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isPending}
              className="btn btn-blue w-full py-4.5 italic text-[11px] shadow-2xl shadow-blue-electric/5 flex items-center justify-center gap-3 group mt-4"
            >
              {isPending ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <>
                  Secure Credentials
                  <ArrowLeft className="w-3.5 h-3.5 rotate-180 transition-transform group-hover:translate-x-1" />
                </>
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
