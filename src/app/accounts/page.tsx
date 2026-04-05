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

  let walletBalance = 0;
  if (user) {
    const { data: wallet } = await supabase
      .from('wallets')
      .select('balance_ngn')
      .eq('user_id', user.id)
      .single();
    walletBalance = wallet?.balance_ngn || 0;
  }

  return <AccountsClient tiers={tiers || []} userId={user?.id} walletBalance={walletBalance} />
}
