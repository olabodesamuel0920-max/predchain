import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Privacy Policy — PredChain',
  description: 'How we protect your elite data on the PredChain platform.',
};

export default function PrivacyPage() {
  return (
    <div className="pt-24 lg:pt-32 pb-20 min-h-screen bg-primary px-6">
      <div className="container max-w-3xl">
        <div className="text-center mb-24">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/5 border border-white/10 rounded-full mb-6">
            <span className="text-[10px] font-bold text-muted uppercase tracking-widest italic opacity-40">Privacy Framework</span>
          </div>
          <h1 className="font-display text-4xl md:text-7xl font-bold text-white italic uppercase tracking-tighter mb-4 leading-none">
            Privacy <span className="text-gradient-gold italic">Policy</span>
          </h1>
          <p className="text-[11px] font-bold text-secondary uppercase tracking-widest max-w-lg mx-auto leading-relaxed italic opacity-40">
            How we protect your elite data on the PredChain platform.
          </p>
        </div>
        
        <div className="flex flex-col gap-12">
          {[
            { 
              title: '1. Data Collection Protocol', 
              text: 'We collect essential account details (Username, Email, Phone) and payment verification to ensure secure challenge participation.' 
            },
            { 
              title: '2. Usage Protocol', 
              text: 'Your data is used strictly for authentication, reward verification, and support communication. We never sell your data to third-party networks.' 
            },
            { 
              title: '3. Security System', 
              text: 'All data is hosted on secure cloud infrastructure with industry-standard encryption. Financial transactions are handled via Paystack and are never stored on our servers.' 
            },
            { 
              title: '4. Cookies Hub', 
              text: 'We use essential cookies for session management. By using the platform, you agree to our minimum cookie requirements for platform integrity.' 
            },
          ].map((item, i) => (
             <section key={i} className="card p-8 md:p-10 bg-white/[0.015] border-white/5 hover:border-white/10 transition-all shadow-xl group">
               <div className="flex items-center gap-3 mb-8">
                  <div className="w-1.5 h-1.5 bg-gold rounded-full opacity-40 group-hover:bg-blue-electric transition-colors" />
                  <h2 className="text-white font-bold text-sm md:text-lg uppercase italic tracking-tighter">{item.title}</h2>
               </div>
               <p className="text-xs md:text-sm font-medium text-secondary uppercase tracking-wide leading-relaxed opacity-60">
                 {item.text}
               </p>
             </section>
          ))}
        </div>
      </div>
    </div>
  );
}
