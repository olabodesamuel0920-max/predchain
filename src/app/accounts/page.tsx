import { createClient } from '@/lib/supabase/server'
import AccountsClient from './AccountsClient'

export default async function AccountsPage() {
  const supabase = await createClient()

  // Fetch account tiers from the database
  const { data: tiers } = await supabase
    .from('account_tiers')
    .select('*')
    .order('price_ngn', { ascending: true })

  const { data: { user } } = await supabase.auth.getUser()

  return <AccountsClient tiers={tiers || []} userId={user?.id} />
}
