import { redirect } from 'next/navigation';
import Link from 'next/link';
import { createClient } from '@/lib/supabase/server';
import Navbar from '@/components/layout/Navbar';

export default async function StudioPage() {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect('/login');

  const [twinsRes, subRes] = await Promise.all([
    supabase.from('digital_twins').select('id, name, thumbnail_url, twin_status, voice_ready').eq('user_id', user.id).eq('is_deleted', false),
    supabase.from('subscriptions').select('credits_remaining, credits_monthly, plan_tier').eq('user_id', user.id).single(),
  ]);

  const twins = twinsRes.data ?? [];
  const sub = subRes.data;
  const twinReady = twins.some(t => t.twin_status === 'ready');
  const creditsRemaining = sub?.credits_remaining ?? 0;

  return (
    <>
      <Navbar pageTitle="Script-to-Video Studio" pageDescription="Type your script → Your Digital Twin delivers it" />
      <main className="flex-1 p-6 flex flex-col items-center">
        {!twinReady && (
          <div className="w-full max-w-3xl mb-6 bg-amber-50 border border-amber-200 rounded-xl px-5 py-4 flex items-center justify-between gap-4">
            <div>
              <p className="font-bold text-amber-800 text-sm">Digital Twin not ready yet</p>
              <p className="text-amber-700 text-xs">Set up your Digital Twin first to start generating videos.</p>
            </div>
            <Link href="/onboarding" className="flex-shrink-0 bg-amber-500 hover:bg-amber-600 text-white font-bold text-sm px-4 py-2 rounded-lg transition-colors">Set Up Twin →</Link>
          </div>
        )}
        {creditsRemaining === 0 && (
          <div className="w-full max-w-3xl mb-6 bg-red-50 border border-red-200 rounded-xl px-5 py-4 flex items-center justify-between gap-4">
            <div>
              <p className="font-bold text-red-800 text-sm">No video credits remaining</p>
              <p className="text-red-700 text-xs">Upgrade your plan to generate more videos this month.</p>
            </div>
            <Link href="/settings" className="flex-shrink-0 bg-red-500 hover:bg-red-600 text-white font-bold text-sm px-4 py-2 rounded-lg transition-colors">Upgrade Plan →</Link>
          </div>
        )}

        <div className="w-full max-w-3xl bg-white rounded-2xl shadow-lg border border-slate-200 overflow-hidden">
          <div className="bg-gradient-to-r from-slate-800 to-slate-700 px-6 py-5">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-blue-500 rounded-xl flex items-center justify-center shadow-md">
                <span className="text-xl">🎙️</span>
              </div>
              <div>
                <h2 className="text-white font-bold text-lg">Script-to-Video Studio</h2>
                <p className="text-slate-400 text-sm">Type your script → Your Digital Twin delivers it</p>
              </div>
            </div>
          </div>

          <div className="p-6 space-y-6">
            {/* Credit meter */}
            <div className="rounded-xl border-2 border-slate-200 bg-slate-50 p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-semibold text-slate-700">Video Credits</span>
                <span className="text-sm font-bold text-slate-800">{Math.floor(creditsRemaining / 60)}m {creditsRemaining % 60}s remaining</span>
              </div>
              <div className="w-full h-2.5 bg-slate-200 rounded-full overflow-hidden">
                <div className="h-full rounded-full bg-emerald-500 transition-all" style={{ width: `${sub && sub.credits_monthly > 0 ? Math.max(100 - Math.round(((sub.credits_monthly - creditsRemaining) / sub.credits_monthly) * 100), 0) : 0}%` }} />
              </div>
            </div>

            {/* Twin selector */}
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-3 uppercase tracking-wide">Your Digital Twin</label>
              {twins.length === 0 ? (
                <div className="border-2 border-dashed border-slate-200 rounded-xl p-6 text-center">
                  <p className="text-slate-500 text-sm mb-3">No Digital Twin set up yet.</p>
                  <Link href="/onboarding" className="inline-block bg-blue-600 text-white font-semibold text-sm px-5 py-2.5 rounded-lg hover:bg-blue-700 transition-colors">Set Up My Twin →</Link>
                </div>
              ) : (
                <div className="flex gap-3">
                  {twins.map(twin => (
                    <div key={twin.id} className={`flex flex-col items-center gap-2 p-3 rounded-xl border-2 ${twin.twin_status === 'ready' ? 'border-blue-600 bg-blue-50' : 'border-slate-200 opacity-50'}`}>
                      <div className="w-16 h-16 rounded-full bg-slate-200 flex items-center justify-center text-2xl">
                        {twin.thumbnail_url ? <img src={twin.thumbnail_url} alt={twin.name} className="w-full h-full rounded-full object-cover" /> : '👤'}
                      </div>
                      <span className="text-xs font-medium text-slate-700">{twin.name}</span>
                      {twin.twin_status !== 'ready' && <span className="text-[10px] text-amber-600">Training…</span>}
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Script textarea */}
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2 uppercase tracking-wide">Your Script</label>
              <textarea rows={8} placeholder={`Type your script here…\n\nExample: "Just listed! I'm excited to present this stunning 4-bedroom home at 123 Maple Street. Priced at $485,000 — call me today for a private showing."`}
                className="w-full px-4 py-3.5 rounded-xl border-2 border-slate-200 bg-white text-slate-800 text-base leading-relaxed placeholder:text-slate-400 resize-none focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-50 transition-all" />
            </div>

            {/* Generate button */}
            <button disabled={!twinReady || creditsRemaining === 0}
              className="w-full h-14 rounded-xl font-bold text-base transition-all flex items-center justify-center gap-3 bg-blue-600 hover:bg-blue-700 text-white shadow-lg shadow-blue-200 disabled:Bg-slate-100 disabled:text-slate-400 disabled:cursor-not-allowed disabled:shadow-none">
              🎬 Generate My Video
            </button>
          </div>
        </div>
      </main>
    </>
  );
}
