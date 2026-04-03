'use server';

import { createClient } from '@/lib/supabase/server';

export async function submitSupportTicket(formData: {
  subject: string;
  message: string;
}) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  // We allow anonymous/unlogged reports by email, but the schema has a user_id ref.
  // If user is logged in, we associate it.
  const { error } = await supabase.from('support_tickets').insert({
    user_id: user?.id || null,
    subject: formData.subject,
    message: formData.message,
    status: 'open',
  });

  if (error) {
    console.error('Support ticket error:', error);
    return { error: 'Failed to send message. Please try again.' };
  }

  return { success: true };
}
