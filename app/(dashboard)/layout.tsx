import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import Sidebar from '@/components/layout/Sidebar';

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect('/login');

  const [profileRes, subRes] = await Promise.all([
    supabase.from('profiles').select('full_name, twin_status').eq('id', user.id).single(),
    supabase.from('subscriptions').select('credits_remaining, credits_monthly, plan_tier').eq('user_id', user.id).single(),
  ]);

  return (
    <div className="flex min-h-screen bg-slate-50">
      <Sidebar
        creditsRemaining={subRes.data?.credits_remaining ?? 0}
        creditsMonthly={subRes.data?.credits_monthly ?? 0}
        planTier={subRes.data?.plan_tier ?? 'free'}
        twinReady={profileRes.data?.twin_status === 'ready'}
        userName={profileRes.data?.full_name ?? user.email ?? 'Agent'}
      />
      <div className="ml-64 flex-1 flex flex-col min-h-screen">{children}</div>
    </div>
  );
}
