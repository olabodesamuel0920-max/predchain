import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'How It Works — PredChain',
  description: 'Master the elite match prediction arena. Learn our high-performance 3-day winning methodology.',
};

export default function HowItWorksLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
