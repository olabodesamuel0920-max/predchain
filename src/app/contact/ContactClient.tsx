'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  ArrowUpRight,
  Target,
  Trophy,
  Users,
  CreditCard,
  Lock,
  Headphones,
  CheckCircle2,
  ShieldCheck,
  Globe,
  Activity
} from 'lucide-react';
import { submitSupportTicket } from '@/app/actions/support';

const HELP_CATEGORIES = [
  { icon: Target, label: 'Challenge Rules', desc: 'Questions about predictions, rounds, and streak rules.' },
  { icon: Trophy, label: 'Reward Tiers', desc: 'How rewards are unlocked, verified, and paid.' },
  { icon: Users, label: 'Community', desc: 'How referrals work and how to earn bonuses.' },
  { icon: CreditCard, label: 'Account & Billing', desc: 'Account tiers, purchases, and account access.' },
  { icon: Activity, label: 'Rankings', desc: 'How rankings are determined and updated.' },
  { icon: Lock, label: 'Security & Integrity', desc: 'Anti-fraud policy, confirmation, and fair play.' },
];

export default function ContactClient() {
  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' });
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const result = await submitSupportTicket({
      subject: form.subject,
      message: `${form.message}\n\nFrom: ${form.name} (${form.email})`
    });

    if (result.success) {
      setSubmitted(true);
    } else {
      setError(result.error || 'Something went wrong.');
    }
    setLoading(false);
  };

  return (
    <div className="relative min-h-screen pt-32 pb-24 overflow-hidden">
      {/* Background Ambience */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute top-0 right-0 w-[1000px] h-[1000px] bg-gold-glow blur-[180px] opacity-[0.08]" />
        <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-blue-glow blur-[140px] opacity-[0.03]" />
      </div>

      <div className="container-tight relative z-10 px-6">
        {/* Header Section */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-center mb-32">
          <div className="lg:col-span-7">
             <motion.div 
               initial={{ opacity: 0, x: -10 }}
               animate={{ opacity: 1, x: 0 }}
               className="badge-luxury mb-8 px-6 py-2 bg-gold/5 border-gold/10 inline-flex items-center gap-3"
             >
                <Headphones className="w-4 h-4 text-gold" />
                <span className="font-black tracking-[0.2em] text-[9px] italic uppercase">Concierge Support</span>
             </motion.div>
             <motion.h1 
               initial={{ opacity: 0, y: 30 }}
               animate={{ opacity: 1, y: 0 }}
               className="mb-8 leading-[1.1] uppercase italic font-black tracking-tighter text-5xl sm:text-8xl text-white"
             >
               Arena <br /><span className="text-gradient-gold">Support Center.</span>
             </motion.h1>
             <motion.p 
               initial={{ opacity: 0 }}
               animate={{ opacity: 1 }}
               className="text-text-secondary text-lg font-medium opacity-60 max-w-xl mb-16 leading-relaxed italic"
             >
               Technical inquiries, account recovery, and identity confirmation. Our arena specialists are available to ensure your experience remains elite.
             </motion.p>
             
             <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 max-w-xl">
                <div className="card-luxury !p-8 bg-white/[0.02] border-white/5 flex flex-col gap-2 group hover:border-gold/30 transition-all duration-700">
                   <div className="text-[10px] font-black text-text-dim uppercase tracking-[0.4em] italic opacity-30 group-hover:opacity-100 transition-opacity">Priority Email</div>
                   <div className="text-xl font-black text-white italic tracking-tighter font-display uppercase">hq@predchain.io</div>
                </div>
                <div className="card-luxury !p-8 bg-white/[0.02] border-white/5 flex flex-col gap-2 group hover:border-emerald-500/30 transition-all duration-700">
                   <div className="text-[10px] font-black text-text-dim uppercase tracking-[0.4em] italic opacity-30 group-hover:opacity-100 transition-opacity">Response Window</div>
                   <div className="text-xl font-black text-emerald-500 italic tracking-tighter font-display uppercase">&lt; 24 HOURS</div>
                </div>
             </div>
          </div>

          <div className="lg:col-span-5">
             <motion.div 
               initial={{ opacity: 0, scale: 0.95 }}
               animate={{ opacity: 1, scale: 1 }}
               className="card-luxury !p-10 sm:!p-16 bg-[#07090e] border-white/10 shadow-[0_60px_120px_-40px_rgba(0,0,0,0.9)] relative overflow-hidden group depth-card"
             >
                <div className="absolute inset-0 bg-gradient-to-br from-gold/[0.03] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-1000" />
                
                {!submitted ? (
                  <>
                    <h2 className="text-2xl font-black text-white uppercase italic tracking-tighter mb-10 font-display">Submit <span className="text-gradient-gold">Ticket.</span></h2>
                    {error && <div className="p-4 bg-rose-500/10 border border-rose-500/20 text-rose-500 text-[10px] font-black uppercase tracking-widest mb-8 text-center italic rounded-xl">{error}</div>}
                    
                    <form onSubmit={handleSubmit} className="space-y-8">
                       <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                          <div className="space-y-3">
                             <label className="text-[10px] font-black text-text-dim uppercase tracking-[0.3em] ml-2 opacity-30 italic">Identity</label>
                             <input
                               type="text"
                               required
                               placeholder="FULL NAME"
                               value={form.name}
                               onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                               className="w-full bg-black/40 border border-white/5 rounded-2xl p-5 text-sm text-white font-black italic tracking-wide focus:border-gold/30 outline-none transition-all shadow-inner"
                             />
                          </div>
                          <div className="space-y-3">
                             <label className="text-[10px] font-black text-text-dim uppercase tracking-[0.3em] ml-2 opacity-30 italic">Direct Email</label>
                             <input
                               type="email"
                               required
                               placeholder="EMAIL@HQ.COM"
                               value={form.email}
                               onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
                               className="w-full bg-black/40 border border-white/5 rounded-2xl p-5 text-sm text-white font-black italic tracking-wide focus:border-gold/30 outline-none transition-all shadow-inner uppercase"
                             />
                          </div>
                       </div>
                       <div className="space-y-3">
                          <label className="text-[10px] font-black text-text-dim uppercase tracking-[0.3em] ml-2 opacity-30 italic">Subject Header</label>
                          <input
                            type="text"
                            required
                            placeholder="INQUIRY SUBJECT"
                            value={form.subject}
                            onChange={e => setForm(f => ({ ...f, subject: e.target.value }))}
                            className="w-full bg-black/40 border border-white/5 rounded-2xl p-5 text-sm text-white font-black italic tracking-wide focus:border-gold/30 outline-none transition-all shadow-inner uppercase"
                          />
                       </div>
                       <div className="space-y-3">
                          <label className="text-[10px] font-black text-text-dim uppercase tracking-[0.3em] ml-2 opacity-30 italic">Statement / Issue</label>
                          <textarea
                            required
                            rows={4}
                            placeholder="DETAILED DESCRIPTION..."
                            value={form.message}
                            onChange={e => setForm(f => ({ ...f, message: e.target.value }))}
                            className="w-full bg-black/40 border border-white/5 rounded-3xl p-8 text-sm text-white font-black italic tracking-wide focus:border-gold/30 outline-none transition-all shadow-inner uppercase resize-none leading-relaxed"
                          />
                       </div>
                       <button 
                         type="submit" 
                         disabled={loading}
                         className="btn-luxury btn-gold btn-premium-depth w-full !py-6 text-[12px] font-black italic tracking-[0.3em] shadow-2xl group uppercase"
                       >
                          {loading ? 'Processing...' : 'Submit Ticket'} <ArrowUpRight className="w-5 h-5 ml-4 transition-transform group-hover:translate-x-1 group-hover:-translate-y-1" />
                       </button>
                    </form>
                  </>
                ) : (
                  <div className="py-20 text-center space-y-10">
                     <div className="w-24 h-24 rounded-[2.5rem] bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-500 mx-auto shadow-inner group-hover:rotate-[360deg] transition-transform duration-1000">
                        <CheckCircle2 className="w-10 h-10" />
                     </div>
                     <div className="space-y-4">
                        <h2 className="text-3xl font-black text-white uppercase italic tracking-tighter font-display">Inquiry Received.</h2>
                        <p className="text-text-dim text-[11px] font-black uppercase tracking-[0.3em] opacity-30 italic leading-loose">
                           A specialist will review your request and contact you at <span className="text-gold">{form.email}</span> within our priority window.
                        </p>
                     </div>
                     <button
                       onClick={() => { setSubmitted(false); setForm({ name: '', email: '', subject: '', message: '' }); }}
                       className="btn-luxury btn-outline !py-4 !px-10 border-white/10 text-[10px] font-black italic tracking-[0.3em] uppercase"
                     >
                       Submit Another Ticket
                     </button>
                  </div>
                )}
             </motion.div>
          </div>
        </div>

        {/* Categories Section */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
           {HELP_CATEGORIES.map((cat, i) => (
             <motion.div 
               key={i} 
               initial={{ opacity: 0, y: 20 }}
               whileInView={{ opacity: 1, y: 0 }}
               viewport={{ once: true }}
               transition={{ delay: i * 0.05 }}
               className="card-luxury !p-10 bg-[#07090e] border-white/5 flex items-center gap-10 group hover:border-gold/30 transition-all duration-700 depth-card shadow-xl"
             >
                <div className="w-16 h-16 rounded-2xl bg-white/[0.03] border border-white/5 flex items-center justify-center text-gold/30 group-hover:bg-gold group-hover:text-black transition-all duration-700 shadow-inner group-hover:rotate-12">
                   <cat.icon className="w-7 h-7" />
                </div>
                <div className="flex-1 space-y-2">
                   <h3 className="text-sm font-black text-white uppercase italic tracking-tight font-display transition-colors group-hover:text-gold">{cat.label}</h3>
                   <p className="text-[10px] text-text-dim font-black uppercase tracking-[0.2em] opacity-30 group-hover:opacity-100 transition-opacity duration-700 italic leading-relaxed">{cat.desc}</p>
                </div>
             </motion.div>
           ))}
        </div>

        {/* Footer Accent */}
        <div className="mt-40 pt-16 border-t border-white/5 flex flex-wrap justify-center gap-16 opacity-20 grayscale hover:grayscale-0 hover:opacity-100 transition-all duration-1000">
           <div className="flex items-center gap-4">
              <ShieldCheck className="w-5 h-5 text-gold" />
              <span className="text-[10px] font-black uppercase tracking-[0.5em] italic text-white">Verified Security</span>
           </div>
           <div className="flex items-center gap-4">
              <Globe className="w-5 h-5 text-gold" />
              <span className="text-[10px] font-black uppercase tracking-[0.5em] italic text-white">Global Arena Support</span>
           </div>
           <div className="flex items-center gap-4">
              <Activity className="w-5 h-5 text-gold" />
              <span className="text-[10px] font-black uppercase tracking-[0.5em] italic text-white">Live System Sync</span>
           </div>
        </div>
      </div>
    </div>
  );
}
