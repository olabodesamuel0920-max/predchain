'use server';

import { createClient, createAdminClient } from '@/lib/supabase/server';
import { revalidatePath } from 'next/cache';
import { verifyAdmin } from './admin';

export async function submitPrediction(formData: FormData) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) throw new Error('Unauthorized');

  const matchId = formData.get('matchId') as string;
  const entryId = formData.get('entryId') as string;
  const prediction = formData.get('prediction') as string; // '1', 'X', '2'

  // 1. Validate Ownership & Round-Match Integrity
  const { data: entry, error: entryError } = await supabase
    .from('challenge_entries')
    .select('user_id, round_id, is_winner')
    .eq('id', entryId)
    .single();

  if (entryError || !entry || entry.user_id !== user.id) {
    throw new Error('Unauthorized: You do not own this entry.');
  }

  if (entry.is_winner) {
    throw new Error('Entry already finalized as a winner.');
  }

  const { data: match, error: matchError } = await supabase
    .from('challenge_matches')
    .select('kickoff_time, status, round_id')
    .eq('id', matchId)
    .single();

  if (matchError || !match) throw new Error('Match not found');

  // Verify match belongs to the entry's round
  if (match.round_id !== entry.round_id) {
    throw new Error('Match does not belong to the selected challenge round.');
  }

  // Verify timing
  if (match.status !== 'scheduled' || new Date(match.kickoff_time) < new Date()) {
    throw new Error('This match is already locked or started.');
  }

  // 2. Insert/Update Prediction
  const { error: upsertError } = await supabase
    .from('predictions')
    .upsert({
      match_id: matchId,
      entry_id: entryId,
      prediction: prediction,
      is_locked: false,
    }, {
      onConflict: 'entry_id, match_id'
    });

  if (upsertError) throw upsertError;

  revalidatePath('/dashboard');
  return { success: true };
}

export async function settleMatchResult(matchId: string, homeScore: number, awayScore: number) {
  await verifyAdmin();
  const adminClient = await createAdminClient();

  const outcome = homeScore > awayScore ? '1' : homeScore < awayScore ? '2' : 'X';

  // 1. Update Match Status via Admin Client
  const { error: matchUpdateError } = await adminClient
    .from('challenge_matches')
    .update({ 
      home_score: homeScore, 
      away_score: awayScore, 
      status: 'finished' 
    })
    .eq('id', matchId);

  if (matchUpdateError) throw matchUpdateError;

  // 2. Update all predictions for this match
  const { data: predictions, error: predsError } = await adminClient
    .from('predictions')
    .select('id, prediction, entry_id, is_locked')
    .eq('match_id', matchId);

  if (predsError) throw predsError;

  for (const pred of predictions) {
    // skip if already settled or if match is not locked
    if (pred.is_locked) continue;

    const isCorrect = pred.prediction === outcome;
    await adminClient.from('predictions').update({ 
      is_correct: isCorrect, 
      is_locked: true 
    }).eq('id', pred.id);

    // If correct, increment streak in entry
    if (isCorrect) {
      const { data: entry } = await adminClient
        .from('challenge_entries')
        .select('streak_count')
        .eq('id', pred.entry_id)
        .single();

      if (entry) {
        const newStreak = entry.streak_count + 1;
        await adminClient.from('challenge_entries')
          .update({ streak_count: newStreak })
          .eq('id', pred.entry_id);

        // Check if won (3/3)
        if (newStreak === 3) {
          await markWinner(pred.entry_id);
        }
      }
    }
  }

  revalidatePath('/admin');
  revalidatePath('/dashboard');
}

async function markWinner(entryId: string) {
  const admin = await verifyAdmin();
  const adminClient = await createAdminClient();

  // Settle Round Winner Atomically via RPC
  const { error: rpcError } = await adminClient.rpc('settle_round_winner_atomic', {
    p_entry_id: entryId,
    p_admin_id: admin.id
  });

  if (rpcError) {
    console.error('Error settling winner:', rpcError);
  }
}

export async function updateMatchStatus(matchId: string, status: 'scheduled' | 'live' | 'finished') {
  await verifyAdmin();
  const adminClient = await createAdminClient();

  const { error } = await adminClient
    .from('challenge_matches')
    .update({ status })
    .eq('id', matchId);

  if (error) throw error;
  revalidatePath('/admin');
  revalidatePath('/dashboard');
}

export async function updateRoundStatus(roundId: string, status: 'upcoming' | 'active' | 'completed') {
  await verifyAdmin();
  const adminClient = await createAdminClient();

  const { error } = await adminClient
    .from('challenge_rounds')
    .update({ status })
    .eq('id', roundId);

  if (error) throw error;
  revalidatePath('/admin');
  revalidatePath('/dashboard');
}

export async function createMatch(data: {
  round_id: string;
  home_team: string;
  away_team: string;
  kickoff_time: string;
}) {
  await verifyAdmin();
  const adminClient = await createAdminClient();

  const { error } = await adminClient
    .from('challenge_matches')
    .insert({
      ...data,
      status: 'scheduled',
      home_score: 0,
      away_score: 0
    });

  if (error) throw error;
  revalidatePath('/admin');
  revalidatePath('/dashboard');
  return { success: true };
}

export async function createRound(data: {
  round_number: number;
  start_date: string;
  end_date: string;
}) {
  await verifyAdmin();
  const adminClient = await createAdminClient();

  const { error } = await adminClient
    .from('challenge_rounds')
    .insert({
      ...data,
      status: 'upcoming'
    });

  if (error) throw error;
  revalidatePath('/admin');
  revalidatePath('/dashboard');
  return { success: true };
}

