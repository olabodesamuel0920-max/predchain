"use client";

import { useState } from 'react';
import { 
  User, 
  Shield, 
  KeyRound, 
  Mail, 
  Phone, 
  Lock, 
  CheckCircle2, 
  AlertCircle, 
  Loader2, 
  LogOut, 
  Copy, 
  Calendar,
  Globe,
  Smartphone,
  CreditCard,
  FileCheck,
  Check,
  ShieldCheck
} from 'lucide-react';
import { updatePassword, updateProfile, logout } from '@/app/actions/auth';
import { requestPhoneOtp, verifyPhoneOtp, submitKycVerification, saveBankDetails } from '@/app/actions/wallet';
import { Profile } from '@/types';

interface SettingsClientProps {
  profile: Profile;
}

export default function SettingsClient({ profile }: SettingsClientProps) {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isPending, setIsPending] = useState(false);
  const [isProfilePending, setIsProfilePending] = useState(false);
  const [success, setSuccess] = useState(false);
  const [profileSuccess, setProfileSuccess] = useState(false);
  const [copySuccess, setCopySuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [profileError, setProfileError] = useState<string | null>(null);

  // Profile fields state
  const [fullName, setFullName] = useState(profile.full_name || '');
  const [username, setUsername] = useState(profile.username || '');

  // Phone OTP verification states
  const [phoneToVerify, setPhoneToVerify] = useState(profile.phone || '');
  const [otpSent, setOtpSent] = useState(false);
  const [otpCode, setOtpCode] = useState('');
  const [isOtpPending, setIsOtpPending] = useState(false);
  const [otpError, setOtpError] = useState<string | null>(null);
  const [otpSuccess, setOtpSuccess] = useState<string | null>(null);
  const [phoneVerifiedState, setPhoneVerifiedState] = useState(profile.phone_verified);

  // Bank states
  const [bankName, setBankName] = useState(profile.bank_name || '');
  const [bankAccountNumber, setBankAccountNumber] = useState(profile.bank_account_number || '');
  const [bankAccountName, setBankAccountName] = useState(profile.bank_account_name || '');
  const [isBankPending, setIsBankPending] = useState(false);
  const [bankError, setBankError] = useState<string | null>(null);
  const [bankSuccess, setBankSuccess] = useState<string | null>(null);
  const [bankFlaggedState, setBankFlaggedState] = useState(profile.bank_account_flagged);

  // KYC states
  const [kycLegalName, setKycLegalName] = useState(profile.identity_legal_name || '');
  const [kycDob, setKycDob] = useState(profile.identity_dob || '');
  const [kycIdType, setKycIdType] = useState(profile.identity_type || 'National ID');
  const [kycIdNumber, setKycIdNumber] = useState(profile.identity_number || '');
  const [isKycPending, setIsKycPending] = useState(false);
  const [kycError, setKycError] = useState<string | null>(null);
  const [kycSuccess, setKycSuccess] = useState<string | null>(null);
  const [kycStatusState, setKycStatusState] = useState(profile.identity_status || 'unverified');

  const handlePasswordUpdate = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsPending(true);
    setError(null);
    setSuccess(false);

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      setIsPending(false);
      return;
    }

    const formData = new FormData(e.currentTarget);
    const result = await updatePassword(formData);

    setIsPending(false);
    if (result?.error) {
      setError(result.error);
    } else {
      setSuccess(true);
      setPassword('');
      setConfirmPassword('');
      setTimeout(() => setSuccess(false), 5000);
    }
  };

  const handleProfileUpdate = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsProfilePending(true);
    setProfileError(null);
    setProfileSuccess(false);

    const formData = new FormData(e.currentTarget);
    // Keep standard email and phone read-only or pass them safely
    formData.append('phone', profile.phone || '');
    const result = await updateProfile(formData);

    setIsProfilePending(false);
    if (result?.error) {
      setProfileError(result.error);
    } else {
      setProfileSuccess(true);
      setTimeout(() => setProfileSuccess(false), 5000);
    }
  };

  const handleRequestOtp = async (e: React.MouseEvent) => {
    e.preventDefault();
    if (!phoneToVerify) {
      setOtpError('Phone number is required');
      return;
    }
    setIsOtpPending(true);
    setOtpError(null);
    setOtpSuccess(null);
    try {
      const result = await requestPhoneOtp(phoneToVerify);
      setOtpSuccess(result.message);
      setOtpSent(true);
    } catch (err: any) {
      setOtpError(err.message || 'Failed to send OTP.');
    } finally {
      setIsOtpPending(false);
    }
  };

  const handleVerifyOtp = async (e: React.MouseEvent) => {
    e.preventDefault();
    if (!otpCode) {
      setOtpError('Verification code is required');
      return;
    }
    setIsOtpPending(true);
    setOtpError(null);
    setOtpSuccess(null);
    try {
      const result = await verifyPhoneOtp(otpCode);
      setOtpSuccess(result.message);
      setOtpSent(false);
      setPhoneVerifiedState(true);
    } catch (err: any) {
      setOtpError(err.message || 'OTP verification failed.');
    } finally {
      setIsOtpPending(false);
    }
  };

  const handleBankSave = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsBankPending(true);
    setBankError(null);
    setBankSuccess(null);

    const formData = new FormData(e.currentTarget);
    try {
      const result = await saveBankDetails(formData);
      setBankSuccess(result.message);
      if (result.flagged) {
        setBankFlaggedState(true);
      } else {
        setBankFlaggedState(false);
      }
    } catch (err: any) {
      setBankError(err.message || 'Failed to save bank details.');
    } finally {
      setIsBankPending(false);
    }
  };

  const handleKycSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsKycPending(true);
    setKycError(null);
    setKycSuccess(null);

    const formData = new FormData(e.currentTarget);
    try {
      const result = await submitKycVerification(formData);
      setKycSuccess(result.message);
      setKycStatusState('pending');
    } catch (err: any) {
      setKycError(err.message || 'Failed to submit KYC.');
    } finally {
      setIsKycPending(false);
    }
  };

  const handleCopyReferral = () => {
    const link = `${window.location.origin}/signup?ref=${profile.username}`;
    navigator.clipboard.writeText(link);
    setCopySuccess(true);
    setTimeout(() => setCopySuccess(false), 2000);
  };

  const displayName = profile.full_name || (profile.username ? `@${profile.username}`.toUpperCase() : null) || profile.email?.split('@')[0] || 'Account';
  const initial = profile.full_name ? profile.full_name.charAt(0).toUpperCase() : (profile.username ? profile.username.charAt(0).toUpperCase() : 'A');

  const statusLabels = {
    active: { label: 'Active', color: 'success' },
    suspended: { label: 'Suspended', color: 'danger' },
    under_review: { label: 'Review', color: 'gold' },
    demo: { label: 'Demo', color: 'blue-electric' }
  };

  const status = statusLabels[profile.status as keyof typeof statusLabels] || statusLabels.active;
  const joinedDate = new Date(profile.created_at).toLocaleDateString(undefined, { 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric' 
  });

  return (
    <div className="container py-12 md:py-24 animate-fade-in max-w-6xl">
      <div className="flex flex-col gap-16 md:gap-24">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-16">
          <div>
            <h1 className="font-display text-3xl font-black text-white italic uppercase tracking-tight mb-4">
              Account <span className="text-gradient-gold">Center</span>
            </h1>
            <p className="text-muted text-[10px] font-bold uppercase tracking-[0.2em] opacity-60">
              Manage your profile and security settings
            </p>
          </div>
          
          <form action={logout}>
            <button type="submit" className="flex items-center gap-6 px-12 py-6 bg-danger/10 border border-danger/20 rounded-xl text-danger text-[9px] font-black uppercase tracking-widest hover:bg-danger/20 transition-all group">
              <LogOut className="w-3.5 h-3.5 opacity-70 group-hover:opacity-100" />
              Sign Out
            </button>
          </form>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-16 md:gap-24">
          {/* Identity Summary Card */}
          <div className="lg:col-span-1 flex flex-col gap-16 md:gap-20">
            <div className="card p-20 bg-white/[0.01] border-white/5 relative overflow-hidden group">
               <div className="absolute top-0 right-0 p-12 opacity-5 group-hover:opacity-10 transition-opacity">
                  <User className="w-16 h-16" />
               </div>
               
               <div className="flex flex-col items-center text-center mb-20 md:mb-24">
                  <div className="w-16 h-16 md:w-20 md:h-20 rounded-2xl bg-blue-electric/10 border border-blue-electric/20 flex items-center justify-center font-black text-2xl md:text-3xl text-blue-electric mb-12 md:mb-16 shadow-2xl shadow-blue-electric/10">
                    {initial}
                  </div>
                  <h2 className="text-lg md:text-xl font-black text-white uppercase italic tracking-tight leading-tight">{displayName}</h2>
                  {phoneVerifiedState && kycStatusState === 'verified' ? (
                    <span className="text-[9px] font-black text-emerald-500 uppercase tracking-widest mt-2 flex items-center gap-1.5">
                      <ShieldCheck className="w-3.5 h-3.5" /> Fully Verified
                    </span>
                  ) : (
                    <span className="text-[9px] font-black text-gold uppercase tracking-widest mt-2">Verification Needed</span>
                  )}
               </div>

               <div className="flex flex-col gap-8 md:gap-10">
                  <div className="flex items-center justify-between p-10 bg-black/40 border border-white/5 rounded-xl">
                     <span className="text-[8px] font-black text-muted uppercase tracking-[0.2em]">Username</span>
                     <span className="text-[10px] font-mono font-black text-white">@{profile.username}</span>
                  </div>
                  <div className="flex items-center justify-between p-10 bg-black/40 border border-white/5 rounded-xl">
                     <span className="text-[8px] font-black text-muted uppercase tracking-[0.2em]">Status</span>
                     <div className="flex items-center gap-6">
                        <div className={`w-1.5 h-1.5 rounded-full bg-${status.color} animate-pulse`} style={{ boxShadow: `0 0 4px var(--${status.color})` }} />
                        <span className={`text-[10px] font-black text-${status.color} uppercase tracking-widest`}>
                          {status.label}
                        </span>
                     </div>
                  </div>
                  <div className="flex items-center justify-between p-10 bg-black/40 border border-white/5 rounded-xl">
                     <span className="text-[8px] font-black text-muted uppercase tracking-[0.2em]">Access</span>
                     <span className="text-[10px] font-black text-gold uppercase tracking-widest">{profile.role}</span>
                  </div>
                  <div className="flex items-center justify-between p-10 bg-black/40 border border-white/5 rounded-xl">
                     <span className="text-[8px] font-black text-muted uppercase tracking-[0.2em]">Joined</span>
                     <div className="flex items-center gap-6">
                        <Calendar className="w-3 h-3 text-muted" />
                        <span className="text-[10px] font-black text-white/50 uppercase tracking-widest" suppressHydrationWarning>
                          {joinedDate}
                        </span>
                     </div>
                  </div>
               </div>
            </div>

            {/* Referral Info */}
            <div className="card p-16 border-blue-electric/10 bg-blue-electric/[0.02]">
               <div className="flex items-center gap-8 mb-8">
                  <Globe className="w-4 h-4 text-blue-electric" />
                  <h3 className="text-[9px] font-black text-white uppercase tracking-[0.2em]">Members Network</h3>
               </div>
               <p className="text-muted text-[10px] font-bold uppercase tracking-widest leading-relaxed opacity-60 mb-12">
                 Invite new members to PredChain and claim account rewards.
               </p>
               <button 
                 onClick={handleCopyReferral}
                 className="w-full flex items-center justify-between gap-12 p-10 bg-black/40 border border-white/10 rounded-xl hover:border-blue-electric/40 transition-all group"
               >
                 <span className="text-[9px] font-mono font-black text-blue-electric truncate">
                    {copySuccess ? 'Link Copied' : `predchain.com/ref=${profile.username}`}
                 </span>
                 <Copy className={`w-3.5 h-3.5 ${copySuccess ? 'text-success' : 'text-blue-electric'}`} />
               </button>
            </div>
            {/* Security Notice */}
            <div className="card p-16 bg-gold/[0.02] border-gold/10">
               <div className="flex items-center gap-8 mb-8">
                  <Shield className="w-4 h-4 text-gold" />
                  <h3 className="text-[9px] font-black text-white uppercase tracking-[0.2em]">Security</h3>
               </div>
               <p className="text-muted text-[10px] font-bold uppercase tracking-widest leading-relaxed opacity-60">
                 Ensure your account password is updated regularly to keep your assets secure.
               </p>
            </div>
          </div>

          {/* Settings Actions */}
          <div className="lg:col-span-2 flex flex-col gap-16 md:gap-24">
            
            {/* Profile Form */}
            <div className="card p-20 md:p-24 border-white/5">
               <div className="flex items-center gap-10 mb-20 md:mb-24 border-b border-white/5 pb-12 md:pb-16">
                  <User className="w-4.5 h-4.5 text-blue-electric" />
                  <h3 className="text-[11px] md:text-[12px] font-black text-white uppercase tracking-widest">Profile Details</h3>
               </div>
               
               <form onSubmit={handleProfileUpdate} className="flex flex-col gap-16 md:gap-20">
                  {profileSuccess && (
                    <div className="flex items-center gap-10 p-12 bg-success/10 border border-success/20 rounded-xl animate-fade-in">
                      <CheckCircle2 className="w-4 h-4 text-success flex-shrink-0" />
                      <p className="text-success text-[10px] font-black uppercase tracking-widest">Profile updated successfully.</p>
                    </div>
                  )}
                  
                  {profileError && (
                    <div className="flex items-center gap-10 p-12 bg-danger/10 border border-danger/20 rounded-xl animate-shake">
                      <AlertCircle className="w-4 h-4 text-danger flex-shrink-0" />
                      <p className="text-danger text-[10px] font-black uppercase tracking-widest">{profileError}</p>
                    </div>
                  )}

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-16 md:gap-20">
                    <div className="flex flex-col gap-6">
                       <label className="text-[9px] font-black text-muted uppercase tracking-[0.2em] ml-2">Full Name</label>
                       <input
                         type="text"
                         name="full_name"
                         value={fullName}
                         onChange={(e) => setFullName(e.target.value)}
                         className="w-full bg-black/40 border border-white/5 rounded-xl py-10 px-12 text-white font-mono text-sm focus:outline-none focus:border-blue-electric/40 transition-all focus:bg-black/60"
                       />
                    </div>
                    <div className="flex flex-col gap-6">
                       <label className="text-[9px] font-black text-muted uppercase tracking-[0.2em] ml-2">Username</label>
                       <div className="relative group">
                          <span className="absolute left-12 top-1/2 -translate-y-1/2 text-muted font-mono text-sm">@</span>
                          <input
                            type="text"
                            name="username"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            className="w-full bg-black/40 border border-white/5 rounded-xl py-10 pl-24 pr-12 text-white font-mono text-sm focus:outline-none focus:border-blue-electric/40 transition-all uppercase focus:bg-black/60"
                          />
                       </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-16 md:gap-20">
                    <div className="flex flex-col gap-6">
                       <label className="text-[9px] font-black text-muted uppercase tracking-[0.2em] ml-2">Email Address</label>
                       <div className="w-full bg-white/[0.01] border border-white/5 rounded-xl px-12 py-10 text-white/20 font-mono text-sm cursor-not-allowed">
                         {profile.email}
                       </div>
                    </div>
                    <div className="flex flex-col gap-6">
                       <label className="text-[9px] font-black text-muted uppercase tracking-[0.2em] ml-2">Phone Number</label>
                       <div className="w-full bg-white/[0.01] border border-white/5 rounded-xl px-12 py-10 text-white/45 font-mono text-sm cursor-not-allowed flex justify-between items-center">
                         <span>{profile.phone || 'No phone number registered'}</span>
                         {phoneVerifiedState ? (
                           <span className="text-[8px] font-black text-emerald-500 uppercase tracking-widest bg-emerald-500/5 px-2.5 py-0.5 rounded border border-emerald-500/20 flex items-center gap-1"><Check className="w-3 h-3" /> VERIFIED</span>
                         ) : (
                           <span className="text-[8px] font-black text-rose-500 uppercase tracking-widest bg-rose-500/5 px-2.5 py-0.5 rounded border border-rose-500/20">UNVERIFIED</span>
                         )}
                       </div>
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={isProfilePending}
                    className="btn btn-blue w-full md:w-fit px-24 py-11 font-black uppercase tracking-widest text-[10px] shadow-lg shadow-blue-electric/20 flex items-center justify-center gap-10 group mt-4"
                  >
                    {isProfilePending ? (
                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    ) : (
                      <>Save Changes</>
                    )}
                  </button>
               </form>
            </div>

            {/* Phone Activation terminal (OTP Flow) */}
            {!phoneVerifiedState && (
              <div className="card p-20 md:p-24 border-white/5 bg-[#030508]/60 relative">
                 <div className="flex items-center gap-10 mb-20 md:mb-24 border-b border-white/5 pb-12 md:pb-16">
                    <Smartphone className="w-4.5 h-4.5 text-gold" />
                    <h3 className="text-[11px] md:text-[12px] font-black text-white uppercase tracking-widest">Phone Verification</h3>
                 </div>
                 
                 <div className="flex flex-col gap-12">
                   {otpSuccess && (
                     <div className="flex items-center gap-10 p-12 bg-success/10 border border-success/20 rounded-xl">
                       <CheckCircle2 className="w-4 h-4 text-success flex-shrink-0" />
                       <p className="text-success text-[10px] font-black uppercase tracking-widest">{otpSuccess}</p>
                     </div>
                   )}
                   
                   {otpError && (
                     <div className="flex items-center gap-10 p-12 bg-danger/10 border border-danger/20 rounded-xl animate-shake">
                       <AlertCircle className="w-4 h-4 text-danger flex-shrink-0" />
                       <p className="text-danger text-[10px] font-black uppercase tracking-widest">{otpError}</p>
                     </div>
                   )}

                   {!otpSent ? (
                     <div className="flex flex-col sm:flex-row gap-4 items-end">
                       <div className="flex flex-col gap-6 flex-1 w-full">
                         <label className="text-[9px] font-black text-muted uppercase tracking-[0.2em] ml-2">Phone Number</label>
                         <input 
                           type="tel"
                           value={phoneToVerify}
                           onChange={(e) => setPhoneToVerify(e.target.value)}
                           placeholder="+234..."
                           className="w-full bg-black/40 border border-white/5 rounded-xl py-10 px-12 text-white font-mono text-sm focus:outline-none focus:border-gold/40 transition-all"
                         />
                       </div>
                       <button
                         onClick={handleRequestOtp}
                         disabled={isOtpPending}
                         className="btn btn-primary w-full sm:w-auto px-20 py-11 text-[10px] font-black uppercase tracking-widest flex items-center justify-center gap-2"
                       >
                         {isOtpPending ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : 'Get OTP'}
                       </button>
                     </div>
                   ) : (
                     <div className="flex flex-col gap-8">
                       <p className="text-secondary text-[10px] font-mono leading-relaxed uppercase opacity-60">
                         We have dispatched an activation OTP. Please enter the 6-digit key below.
                       </p>
                       <div className="flex flex-col sm:flex-row gap-4 items-end">
                         <div className="flex flex-col gap-6 flex-1 w-full">
                           <label className="text-[9px] font-black text-muted uppercase tracking-[0.2em] ml-2">6-Digit Verification Code</label>
                           <input 
                             type="text"
                             value={otpCode}
                             onChange={(e) => setOtpCode(e.target.value)}
                             placeholder="000000"
                             className="w-full bg-black/40 border border-white/5 rounded-xl py-10 px-12 text-white font-mono text-sm focus:outline-none focus:border-gold/40 transition-all text-center tracking-widest font-black"
                           />
                         </div>
                         <div className="flex gap-2 w-full sm:w-auto shrink-0">
                           <button
                             onClick={handleVerifyOtp}
                             disabled={isOtpPending}
                             className="btn btn-primary px-20 py-11 text-[10px] font-black uppercase tracking-widest flex items-center justify-center flex-1"
                           >
                             {isOtpPending ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : 'Verify'}
                           </button>
                           <button
                             onClick={() => setOtpSent(false)}
                             className="btn btn-outline border-white/10 hover:bg-white/5 px-12 py-11 text-[10px] font-black uppercase tracking-widest"
                           >
                             Back
                           </button>
                         </div>
                       </div>
                     </div>
                   )}
                 </div>
              </div>
            )}

            {/* KYC identity verification form */}
            <div className="card p-20 md:p-24 border-white/5 bg-[#030508]/60">
               <div className="flex items-center justify-between mb-20 md:mb-24 border-b border-white/5 pb-12 md:pb-16">
                  <div className="flex items-center gap-10">
                     <FileCheck className="w-4.5 h-4.5 text-blue-electric" />
                     <h3 className="text-[11px] md:text-[12px] font-black text-white uppercase tracking-widest">KYC Identity Node</h3>
                  </div>
                  
                  {kycStatusState === 'verified' && (
                    <span className="text-[8px] font-black text-emerald-500 uppercase tracking-widest bg-emerald-500/5 px-2.5 py-1 rounded border border-emerald-500/20 flex items-center gap-1.5 shadow">
                      <ShieldCheck className="w-4.5 h-4.5" /> VERIFIED
                    </span>
                  )}
                  {kycStatusState === 'pending' && (
                    <span className="text-[8px] font-black text-gold uppercase tracking-widest bg-gold/5 px-2.5 py-1 rounded border border-gold/20 animate-pulse">
                      PENDING REVIEW
                    </span>
                  )}
                  {kycStatusState === 'rejected' && (
                    <span className="text-[8px] font-black text-rose-500 uppercase tracking-widest bg-rose-500/5 px-2.5 py-1 rounded border border-rose-500/20">
                      REJECTED
                    </span>
                  )}
                  {kycStatusState === 'unverified' && (
                    <span className="text-[8px] font-black text-secondary/40 uppercase tracking-widest bg-white/[0.02] px-2.5 py-1 rounded border border-white/5">
                      UNVERIFIED
                    </span>
                  )}
               </div>

               {kycSuccess && (
                 <div className="flex items-center gap-10 p-12 bg-success/10 border border-success/20 rounded-xl mb-6">
                   <CheckCircle2 className="w-4 h-4 text-success flex-shrink-0" />
                   <p className="text-success text-[10px] font-black uppercase tracking-widest">{kycSuccess}</p>
                 </div>
               )}
               {kycError && (
                 <div className="flex items-center gap-10 p-12 bg-danger/10 border border-danger/20 rounded-xl mb-6 animate-shake">
                   <AlertCircle className="w-4 h-4 text-danger flex-shrink-0" />
                   <p className="text-danger text-[10px] font-black uppercase tracking-widest">{kycError}</p>
                 </div>
               )}

               {profile.identity_notes && kycStatusState === 'rejected' && (
                 <div className="p-4 bg-rose-500/5 border border-rose-500/10 rounded-xl text-[9.5px] text-rose-400 font-bold uppercase italic mb-6 leading-relaxed">
                   Rejection Reason: {profile.identity_notes}
                 </div>
               )}

               {kycStatusState === 'verified' || kycStatusState === 'pending' ? (
                 <div className="p-16 bg-black/40 border border-white/5 rounded-2xl space-y-4 text-[11px] font-mono text-secondary">
                   <div className="flex justify-between border-b border-white/5 pb-2">
                     <span className="uppercase text-[9px] text-muted">Legal Name</span>
                     <span className="text-white font-bold">{kycLegalName}</span>
                   </div>
                   <div className="flex justify-between border-b border-white/5 pb-2">
                     <span className="uppercase text-[9px] text-muted">Date of Birth</span>
                     <span className="text-white font-bold">{kycDob}</span>
                   </div>
                   <div className="flex justify-between border-b border-white/5 pb-2">
                     <span className="uppercase text-[9px] text-muted">Document Type</span>
                     <span className="text-white font-bold">{kycIdType}</span>
                   </div>
                   <div className="flex justify-between">
                     <span className="uppercase text-[9px] text-muted">Document Number</span>
                     <span className="text-white font-bold">{kycIdNumber}</span>
                   </div>
                 </div>
               ) : (
                 <form onSubmit={handleKycSubmit} className="flex flex-col gap-16 md:gap-20">
                   <div className="grid grid-cols-1 md:grid-cols-2 gap-16 md:gap-20">
                     <div className="flex flex-col gap-6">
                       <label className="text-[9px] font-black text-muted uppercase tracking-[0.2em] ml-2">Full Legal Name</label>
                       <input 
                         type="text"
                         name="legal_name"
                         required
                         value={kycLegalName}
                         onChange={(e) => setKycLegalName(e.target.value)}
                         className="w-full bg-black/40 border border-white/5 rounded-xl py-10 px-12 text-white font-mono text-sm focus:outline-none focus:border-blue-electric/40 focus:bg-black/60 uppercase"
                       />
                     </div>
                     <div className="flex flex-col gap-6">
                       <label className="text-[9px] font-black text-muted uppercase tracking-[0.2em] ml-2">Date of Birth</label>
                       <input 
                         type="date"
                         name="dob"
                         required
                         value={kycDob}
                         onChange={(e) => setKycDob(e.target.value)}
                         className="w-full bg-black/40 border border-white/5 rounded-xl py-10 px-12 text-white font-mono text-sm focus:outline-none focus:border-blue-electric/40 focus:bg-black/60"
                       />
                     </div>
                   </div>

                   <div className="grid grid-cols-1 md:grid-cols-2 gap-16 md:gap-20">
                     <div className="flex flex-col gap-6">
                       <label className="text-[9px] font-black text-muted uppercase tracking-[0.2em] ml-2">ID Document Type</label>
                       <select
                         name="id_type"
                         value={kycIdType}
                         onChange={(e) => setKycIdType(e.target.value)}
                         className="w-full bg-black/40 border border-white/5 rounded-xl py-10 px-12 text-white font-mono text-sm focus:outline-none focus:border-blue-electric/40 focus:bg-black/60"
                       >
                         <option value="National ID">National ID Card (NIN)</option>
                         <option value="Passport">International Passport</option>
                         <option value="Driver's License">Driver's License</option>
                         <option value="Voter's Card">Voter's Card</option>
                       </select>
                     </div>
                     <div className="flex flex-col gap-6">
                       <label className="text-[9px] font-black text-muted uppercase tracking-[0.2em] ml-2">Document Number</label>
                       <input 
                         type="text"
                         name="id_number"
                         required
                         value={kycIdNumber}
                         onChange={(e) => setKycIdNumber(e.target.value)}
                         placeholder="ID Number..."
                         className="w-full bg-black/40 border border-white/5 rounded-xl py-10 px-12 text-white font-mono text-sm focus:outline-none focus:border-blue-electric/40 focus:bg-black/60 uppercase"
                       />
                     </div>
                   </div>

                   <button
                     type="submit"
                     disabled={isKycPending}
                     className="btn btn-blue w-full md:w-fit px-24 py-11 font-black uppercase tracking-widest text-[10px] shadow-lg shadow-blue-electric/20 flex items-center justify-center gap-10 group mt-4"
                   >
                     {isKycPending ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : 'Submit KYC Documents'}
                   </button>
                 </form>
               )}
            </div>

            {/* Payout node details (Bank account details) */}
            <div className="card p-20 md:p-24 border-white/5 bg-[#030508]/60">
               <div className="flex items-center justify-between mb-20 md:mb-24 border-b border-white/5 pb-12 md:pb-16">
                  <div className="flex items-center gap-10">
                     <CreditCard className="w-4.5 h-4.5 text-gold" />
                     <h3 className="text-[11px] md:text-[12px] font-black text-white uppercase tracking-widest">Payout bank Details</h3>
                  </div>

                  {bankFlaggedState && (
                    <span className="text-[8px] font-black text-rose-500 uppercase tracking-widest bg-rose-500/5 px-2.5 py-1 rounded border border-rose-500/20 animate-pulse">
                      DUPLICATION FLAG
                    </span>
                  )}
               </div>

               {bankSuccess && (
                 <div className="flex items-center gap-10 p-12 bg-success/10 border border-success/20 rounded-xl mb-6">
                   <CheckCircle2 className="w-4 h-4 text-success flex-shrink-0" />
                   <p className="text-success text-[10px] font-black uppercase tracking-widest">{bankSuccess}</p>
                 </div>
               )}
               {bankError && (
                 <div className="flex items-center gap-10 p-12 bg-danger/10 border border-danger/20 rounded-xl mb-6 animate-shake">
                   <AlertCircle className="w-4 h-4 text-danger flex-shrink-0" />
                   <p className="text-danger text-[10px] font-black uppercase tracking-widest">{bankError}</p>
                 </div>
               )}

               {bankFlaggedState && (
                 <div className="p-4 bg-rose-500/5 border border-rose-500/10 rounded-xl text-[9.5px] text-rose-400 font-bold uppercase italic mb-6 leading-relaxed">
                   CRITICAL ALARM: Your bank details match another member node. Account payouts are locked. Contact Sentinel support.
                 </div>
               )}

               <form onSubmit={handleBankSave} className="flex flex-col gap-16 md:gap-20">
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-16 md:gap-20">
                   <div className="flex flex-col gap-6">
                     <label className="text-[9px] font-black text-muted uppercase tracking-[0.2em] ml-2">Bank Name</label>
                     <input 
                       type="text"
                       name="bank_name"
                       required
                       value={bankName}
                       onChange={(e) => setBankName(e.target.value)}
                       placeholder="e.g. GTBank"
                       className="w-full bg-black/40 border border-white/5 rounded-xl py-10 px-12 text-white font-mono text-sm focus:outline-none focus:border-gold/40 focus:bg-black/60 uppercase"
                     />
                   </div>
                   <div className="flex flex-col gap-6">
                     <label className="text-[9px] font-black text-muted uppercase tracking-[0.2em] ml-2">Account Name</label>
                     <input 
                       type="text"
                       name="bank_account_name"
                       required
                       value={bankAccountName}
                       onChange={(e) => setBankAccountName(e.target.value)}
                       placeholder="Legal name on account"
                       className="w-full bg-black/40 border border-white/5 rounded-xl py-10 px-12 text-white font-mono text-sm focus:outline-none focus:border-gold/40 focus:bg-black/60 uppercase"
                     />
                   </div>
                 </div>

                 <div className="flex flex-col gap-6 max-w-sm">
                   <label className="text-[9px] font-black text-muted uppercase tracking-[0.2em] ml-2">Account Number</label>
                   <input 
                     type="text"
                     name="bank_account_number"
                     required
                     value={bankAccountNumber}
                     onChange={(e) => setBankAccountNumber(e.target.value)}
                     placeholder="10-digit number"
                     maxLength={10}
                     className="w-full bg-black/40 border border-white/5 rounded-xl py-10 px-12 text-white font-mono text-sm focus:outline-none focus:border-gold/40 focus:bg-black/60"
                   />
                 </div>

                 <button
                   type="submit"
                   disabled={isBankPending}
                   className="btn btn-primary w-full md:w-fit px-24 py-11 font-black uppercase tracking-widest text-[10px] shadow-lg shadow-gold/20 flex items-center justify-center gap-10 group mt-4"
                 >
                   {isBankPending ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : 'Save bank details'}
                 </button>
               </form>
            </div>

            {/* Password Reset Form */}
            <div className="card p-20 md:p-24 border-white/5 bg-white/[0.01]">
               <div className="flex items-center gap-10 mb-20 md:mb-24 border-b border-white/5 pb-12 md:pb-16">
                  <KeyRound className="w-4.5 h-4.5 text-gold" />
                  <h3 className="text-[11px] md:text-[12px] font-black text-white uppercase tracking-widest">Change Password</h3>
               </div>

               <form onSubmit={handlePasswordUpdate} className="flex flex-col gap-16 md:gap-20 max-w-sm">
                 {success && (
                    <div className="flex items-center gap-10 p-12 bg-success/10 border border-success/20 rounded-xl animate-fade-in">
                      <CheckCircle2 className="w-4 h-4 text-success flex-shrink-0" />
                      <p className="text-success text-[10px] font-black uppercase tracking-widest">
                        Password updated successfully.
                      </p>
                    </div>
                 )}
                 
                 {error && (
                    <div className="flex items-center gap-10 p-12 bg-danger/10 border border-danger/20 rounded-xl animate-shake">
                      <AlertCircle className="w-4 h-4 text-danger flex-shrink-0" />
                      <p className="text-danger text-[10px] font-black uppercase tracking-widest">
                        {error}
                      </p>
                    </div>
                 )}

                 <div className="flex flex-col gap-6">
                   <label className="text-[9px] font-black text-muted uppercase tracking-[0.2em] ml-2">New Password</label>
                   <div className="relative group">
                     <Lock className="absolute left-16 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted group-focus-within:text-gold transition-colors" />
                     <input
                       type="password"
                       name="password"
                       required
                       value={password}
                       onChange={(e) => setPassword(e.target.value)}
                       placeholder="••••••••"
                       className="w-full bg-black/40 border border-white/5 rounded-xl py-10 pl-44 pr-16 text-white font-mono text-sm focus:outline-none focus:border-gold/40 transition-all focus:bg-black/60"
                     />
                   </div>
                 </div>

                 <div className="flex flex-col gap-6">
                   <label className="text-[9px] font-black text-muted uppercase tracking-[0.2em] ml-2">Confirm New Password</label>
                   <div className="relative group">
                     <Lock className="absolute left-16 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted group-focus-within:text-gold transition-colors" />
                     <input
                       type="password"
                       required
                       value={confirmPassword}
                       onChange={(e) => setConfirmPassword(e.target.value)}
                       placeholder="••••••••"
                       className="w-full bg-black/40 border border-white/5 rounded-xl py-10 pl-44 pr-16 text-white font-mono text-sm focus:outline-none focus:border-gold/40 transition-all focus:bg-black/60"
                     />
                   </div>
                 </div>

                 <button
                   type="submit"
                   disabled={isPending}
                   className="btn btn-blue w-full md:w-fit px-24 py-11 font-black uppercase tracking-widest text-[10px] shadow-lg shadow-blue-electric/20 flex items-center justify-center gap-10 group mt-4"
                 >
                   {isPending ? (
                     <Loader2 className="w-3.5 h-3.5 animate-spin" />
                   ) : (
                     <>Update Password</>
                   )}
                 </button>
               </form>
             </div>
          </div>
        </div>
      </div>
    </div>
  );
}
