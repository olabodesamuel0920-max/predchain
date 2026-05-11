import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Arena Rules — PredChain',
  description: 'Understand the elite match methodology and our commitment to absolute performance integrity.',
};

export default function RulesPage() {
  return (
    <div className="relative pt-32 lg:pt-44 pb-20 min-h-screen overflow-hidden">
      {/* Background Ambience */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute top-0 right-0 w-full h-[1000px] bg-gold-glow blur-[180px] opacity-[0.05]" />
        <div className="absolute bottom-0 left-0 w-full h-[1000px] bg-blue-glow blur-[150px] opacity-[0.02]" />
      </div>

      <div className="container max-w-4xl px-6 relative z-10">
        <div className="text-center mb-24">
          <div className="badge-luxury mb-10 px-8 py-2 bg-white/[0.02] border-white/10 italic font-black uppercase tracking-[0.4em] text-[9px] text-gold mx-auto w-fit">
            MATCH RULES
          </div>
          <h1 className="font-display text-5xl md:text-9xl font-black text-white italic uppercase tracking-tighter mb-8 leading-none">
            Match <span className="text-gradient-gold">Rules.</span>
          </h1>
          <p className="text-lg md:text-xl font-medium text-text-secondary uppercase tracking-widest max-w-2xl mx-auto leading-relaxed italic opacity-40">
            Master the 3-day winning methodology and our commitment to absolute performance integrity.
          </p>
        </div>
        
        <div className="flex flex-col gap-10">
          <section className="card-luxury !p-12 md:!p-20 bg-[#07090e] border-white/10 shadow-2xl depth-card group relative overflow-hidden">
             <div className="absolute top-0 right-0 p-16 text-8xl font-black text-white/[0.01] italic leading-none pointer-events-none group-hover:text-gold/[0.03] transition-all duration-1000 uppercase select-none">STREAK</div>
             <h2 className="font-display text-3xl font-black text-white uppercase italic tracking-tighter mb-12 border-b border-white/5 pb-8">MATCH RULES</h2>
             <ul className="flex flex-col gap-10 text-base font-black text-text-dim uppercase tracking-[0.15em] leading-relaxed list-none">
               <li className="flex gap-8 items-start group/item">
                 <span className="text-gold font-black italic text-xl opacity-40 group-hover/item:opacity-100 transition-all">01.</span>
                 <span className="group-hover/item:text-white transition-colors">A "Winning Streak" consists of a 3-day window with verified elite fixtures.</span>
               </li>
               <li className="flex gap-8 items-start group/item">
                 <span className="text-gold font-black italic text-xl opacity-40 group-hover/item:opacity-100 transition-all">02.</span>
                 <span className="group-hover/item:text-white transition-colors">You must make exactly <strong className="text-gold italic">ONE</strong> correct match prediction every 24 hours.</span>
               </li>
               <li className="flex gap-8 items-start group/item">
                 <span className="text-gold font-black italic text-xl opacity-40 group-hover/item:opacity-100 transition-all">03.</span>
                 <span className="group-hover/item:text-white transition-colors">Match predictions are strictly 1X2 format: 
                    <div className="mt-8 grid grid-cols-3 gap-4 max-w-sm">
                       <div className="p-5 bg-black/60 border border-white/5 rounded-2xl text-center group-hover/item:border-gold/20 transition-all"><span className="text-gold font-black block mb-1">1</span> <span className="text-[9px] opacity-40">HOME</span></div>
                       <div className="p-5 bg-black/60 border border-white/5 rounded-2xl text-center group-hover/item:border-gold/20 transition-all"><span className="text-gold font-black block mb-1">X</span> <span className="text-[9px] opacity-40">DRAW</span></div>
                       <div className="p-5 bg-black/60 border border-white/5 rounded-2xl text-center group-hover/item:border-gold/20 transition-all"><span className="text-gold font-black block mb-1">2</span> <span className="text-[9px] opacity-40">AWAY</span></div>
                    </div>
                 </span>
               </li>
               <li className="flex gap-8 items-start group/item">
                 <span className="text-gold font-black italic text-xl opacity-40 group-hover/item:opacity-100 transition-all">04.</span>
                 <span className="group-hover/item:text-white transition-colors">Successful 3/3 accuracy triggers the confirmed <strong className="text-gold italic">10X STREAK PAYOUT</strong>.</span>
               </li>
               <li className="flex gap-8 items-start group/item">
                 <span className="text-gold font-black italic text-xl opacity-40 group-hover/item:opacity-100 transition-all">05.</span>
                 <span className="group-hover/item:text-white transition-colors">Failed predictions terminate the current streak immediately.</span>
               </li>
             </ul>
          </section>

          <section className="card-luxury !p-12 bg-gold/[0.02] border-gold/10 shadow-inner group transition-all duration-700 hover:bg-gold/[0.05]">
             <h2 className="font-display text-2xl font-black text-white uppercase italic tracking-tighter mb-6 group-hover:text-gold transition-colors">MATCH LOCK-IN</h2>
             <p className="text-[12px] font-black text-text-dim uppercase tracking-[0.3em] leading-loose opacity-40 italic group-hover:opacity-100 transition-opacity">
               All predictions must be submitted BEFORE official kickoff. Once a match starts, the prediction window is permanently locked.
             </p>
          </section>

          <section className="card-luxury !p-12 md:!p-20 bg-[#07090e] border-white/10 shadow-2xl depth-card group">
             <h2 className="font-display text-3xl font-black text-white uppercase italic tracking-tighter mb-10 border-b border-white/5 pb-8">DATA INTEGRITY</h2>
             <p className="text-[13px] font-black text-text-dim uppercase tracking-[0.4em] leading-relaxed mb-12 opacity-30 italic">
               To maintain arena trust levels, we employ advanced security verification:
             </p>
             <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {[
                  'ACCOUNT SAFETY',
                  'ANTI-BOT SHIELD',
                  'PAYOUT VERIFICATION',
                  'ZERO TOLERANCE'
                ].map((rule, i) => (
                  <div key={i} className="p-8 bg-black/60 border border-white/5 rounded-3xl flex items-center gap-6 hover:border-gold/30 transition-all duration-700 shadow-inner group/rule">
                    <div className="w-2.5 h-2.5 bg-gold rounded-full opacity-20 group-hover/rule:opacity-100 group-hover/rule:animate-pulse shadow-gold/50" />
                    <span className="text-[11px] font-black text-text-dim uppercase tracking-[0.3em] opacity-40 group-hover/rule:opacity-100 group-hover/rule:text-white transition-all">{rule}</span>
                  </div>
                ))}
             </div>
          </section>
        </div>
      </div>
    </div>
  );
}
