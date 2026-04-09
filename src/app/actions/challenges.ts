'use server';

import { createClient } from '@/lib/supabase/server';
import { revalidatePath } from 'next/cache';

/**
 * Initializes a challenge entry for the user in the specified round.
 * Requires the user to have an active, purchased tier.
 */
export async function initializeRoundEntry(roundId: string) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) throw new Error('Unauthorized');

  // 1. Check if user already has an entry for this round
  const { data: existingEntry } = await supabase
    .from('challenge_entries')
    .select('id')
    .eq('user_id', user.id)
    .eq('round_id', roundId)
    .single();

  if (existingEntry) return { success: true, entryId: existingEntry.id };

  // 2. Find the user's latest active tier purchase
  const { data: purchase, error: purchaseError } = await supabase
    .from('account_purchases')
    .select('tier_id')
    .eq('user_id', user.id)
    .eq('status', 'completed')
    .order('verified_at', { ascending: false })
    .limit(1)
    .single();

  if (purchaseError || !purchase) {
    throw new Error('No active tier found. Please visit Account Tiers to initialize a node.');
  }

  // 3. Create the entry
  const { data: newEntry, error: insertError } = await supabase
    .from('challenge_entries')
    .insert({
      user_id: user.id,
      round_id: roundId,
      tier_id: purchase.tier_id,
      streak_count: 0,
      is_winner: false
    })
    .select('id')
    .single();

  if (insertError) throw insertError;

  revalidatePath('/live-challenges');
  revalidatePath('/dashboard');

  return { success: true, entryId: newEntry.id };
}
