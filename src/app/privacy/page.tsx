import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Privacy Policy — PredChain',
  description: 'How we protect your elite data on the PredChain platform.',
};

export default function PrivacyPage() {
  return (
    <div style={{ paddingTop: '120px', paddingBottom: '80px', minHeight: '100vh', background: 'var(--bg-primary)' }}>
      <div className="container" style={{ maxWidth: '800px' }}>
        <h1 className="font-display text-4xl font-extrabold mb-32">Privacy Policy</h1>
        
        <div className="flex flex-col gap-32 text-secondary leading-relaxed">
          <section>
            <h2 className="text-white font-bold text-xl mb-12">1. Data Collection</h2>
            <p>We collect essential account details (Username, Email, Phone) and payment references to ensure secure challenge participation.</p>
          </section>

          <section>
             <h2 className="text-white font-bold text-xl mb-12">2. Usage</h2>
             <p>Your data is used strictly for authentication, reward verification, and support communication. We never sell your data to third parties.</p>
          </section>

          <section>
             <h2 className="text-white font-bold text-xl mb-12">3. Security</h2>
             <p>All data is hosted on secure cloud infrastructure with industry-standard encryption. Financial transactions are handled via Paystack and are never stored on our servers.</p>
          </section>

          <section>
             <h2 className="text-white font-bold text-xl mb-12">4. Cookies</h2>
             <p>We use essential cookies for session management. By using the platform, you agree to our minimum cookie requirements.</p>
          </section>
        </div>
      </div>
    </div>
  );
}
