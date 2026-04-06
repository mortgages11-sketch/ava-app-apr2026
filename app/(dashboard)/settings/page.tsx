import { redirect } from 'next/navigation';
import Link from 'next/link';
import { createClient } from '@/lib/supabase/server';
import Navbar from '@/components/layout/Navbar';
import { PLANS, formatCreditsAsMinutes } from '@/lib/stripe/plans';

export default async function SettingsPage() {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect('/login');

  const [profileRes, subRes] = await Promise.all([
    supabase.from('profiles').select('full_name, company_name, phone, role').eq('id', user.id).single(),
    supabase.from('subscriptions').select('*').eq('user_id', user.id).single(),
  ]);

  const profile = profileRes.data;
  const sub = subRes.data;
  const planKey = (sub?.plan_tier?.toUpperCase() ?? 'FREE') as keyof typeof PLANS;
  const currentPlan = PLANS[planKey] ?? PLANS.FREE;
  const usedPct = sub && sub.credits_monthly > 0 ? Math.round(((sub.credits_monthly - sub.credits_remaining) / sub.credits_monthly) * 100) : 0;

  return (
    <>
      <Navbar pageTitle="Settings & Billing" />
      <main className="flex-1 p-6 max-w-3xl space-y-6">
        <section className="bg-white rounded-2xl border border-slate-100 shadow-card p-6">
          <h2 className="font-bold text-slate-900 text-base mb-5 pb-4 border-b border-slate-100">Profile Information</h2>
          <div className="grid grid-cols-2 gap-4">
            {[
              { label: 'Full Name', value: profile?.full_name ?? '', placeholder: 'Your name' },
              { label: 'Company', value: profile?.company_name ?? '', placeholder: 'Your brokerage' },
              { label: 'Phone', value: profile?.phone ?? '', placeholder: '+1 (555) 000-0000' },
              { label: 'Email', value: user.email ?? '', placeholder: '', readOnly: true },
            ].map(f => (
              <div key={f.label}>
                <label className="block text-xs font-semibold text-slate-500 mb-1 uppercase tracking-wide">{f.label}</label>
                <input type="text" defaultValue={f.value} placeholder={f.placeholder} readOnly={f.readOnly}
                  className={`w-full h-10 px-3 rounded-lg border border-slate-200 text-sm text-slate-800 font-medium focus:outline-none focus:border-blue-400 transition-all ${f.readOnly ? 'bg-slate-50 text-slate-400 cursor-not-allowed' : 'bg-white'}`} />
              </div>
            ))}
          </div>
          <button className="mt-5 bg-slate-800 hover:bg-slate-900 text-white font-semibold text-sm px-5 py-2.5 rounded-xl transition-colors">Save Changes</button>
        </section>

        <section className="bg-white rounded-2xl border border-slate-100 shadow-card p-6">
          <div className="flex items-center justify-between mb-5 pb-4 border-b border-slate-100">
            <h2 className="font-bold text-slate-900 text-base">Subscription & Credits</h2>
            <span className={`text-xs font-bold px-3 py-1 rounded-full capitalize ${sub?.status === 'active' ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-100 text-slate-600'}`}>{sub?.status ?? 'free'}</span>
          </div>
          <div className="flex items-start justify-between mb-4">
            <div>
              <p className="text-2xl font-extrabold text-slate-900">{currentPlan.name}</p>
              <p className="text-slate-500 text-sm">{currentPlan.priceUSD > 0 ? `$${currentPlan.priceUSD}/month` : 'Free tier'}</p>
            </div>
            <div className="text-right">
              <p className="text-2xl font-extrabold text-blue-600">{formatCreditsAsMinutes(sub?.credits_remaining ?? 0)}</p>
              <p className="text-xs text-slate-400">remaining this month</p>
            </div>
          </div>
          <div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden mb-4">
            <div className={`h-full rounded-full ${usedPct > 80 ? 'bg-amber-400' : 'bg-blue-500'}`} style={{ width: `${usedPct}%` }} />
          </div>
          {sub?.plan_tier !== 'professional' && (
            <div className="bg-blue-50 border border-blue-100 rounded-xl p-4">
              <p className="font-bold text-blue-900 text-sm mb-1">🚀 Upgrade to Professional — $249/mo</p>
              <p className="text-blue-700 text-xs mb-3">Get 30 minutes/month, 3 Digital Twins, and 1080p HD video.</p>
              <a href="#" className="inline-block bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm px-5 py-2.5 rounded-lg transition-colors">Upgrade Now →</a>
            </div>
          )}
        </section>
      </main>
    </>
  );
}
