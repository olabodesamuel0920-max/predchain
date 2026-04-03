import { createClient } from '@/lib/supabase/server'
import WinnersClient from './WinnersClient'

export default async function WinnersPage() {
  const supabase = await createClient()

  // Fetch verified winners
  const { data: winners } = await supabase
    .from('winners')
    .select('*, profile:profiles(*), round:challenge_rounds(*)')
    .order('created_at', { ascending: false })

  return <WinnersClient winners={winners || []} />
}
