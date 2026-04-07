import { createClient } from '@/lib/supabase/server';
import { verifyPayment } from '@/app/actions/paystack';
import { redirect } from 'next/navigation';
import { NextRequest } from 'next/server';

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const reference = searchParams.get('reference');

  if (!reference) {
    redirect('/dashboard?error=Missing payment reference');
  }

  try {
    const result = await verifyPayment(reference);
    
    if (result.success) {
      redirect('/dashboard?success=Payment verified successfully');
    } else {
      redirect(`/dashboard?error=${encodeURIComponent(result.message || 'Verification failed')}`);
    }
  } catch (err: any) {
    // Re-throw internal Next.js redirect errors
    if (err && (err.message === 'NEXT_REDIRECT' || err.digest?.startsWith('NEXT_REDIRECT'))) {
      throw err;
    }
    console.error('Payment callback error:', err);
    redirect(`/dashboard?error=${encodeURIComponent(err.message || 'Internal payment error')}`);
  }
}
