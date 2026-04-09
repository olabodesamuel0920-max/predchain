import { NextResponse } from 'next/server';
import crypto from 'crypto';
import { verifyPayment } from '@/app/actions/paystack';

const PAYSTACK_SECRET_KEY = process.env.PAYSTACK_SECRET_KEY;

export async function POST(req: Request) {
  const body = await req.text();
  const signature = req.headers.get('x-paystack-signature');

  if (!signature || !PAYSTACK_SECRET_KEY) {
    return new Response('Unauthorized', { status: 401 });
  }

  // 1. Verify Paystack Signature
  const hash = crypto
    .createHmac('sha512', PAYSTACK_SECRET_KEY)
    .update(body)
    .digest('hex');

  if (hash !== signature) {
    return new Response('Unauthorized', { status: 401 });
  }

  const event = JSON.parse(body);

  // 2. Handle successful charge
  if (event.event === 'charge.success') {
    const reference = event.data.reference;
    
    // We reuse the verifyPayment server action logic for consistency
    // It handles idempotency and tier validation
    try {
      const result = await verifyPayment(reference);
      if (result.success) {
        console.log(`Webhook processed successfully for ref: ${reference}`);
      } else {
        console.error(`Webhook failed for ref: ${reference}`, result.message);
      }
    } catch (err) {
      console.error('Webhook error:', err);
    }
  }

  return NextResponse.json({ status: 'ok' });
}
