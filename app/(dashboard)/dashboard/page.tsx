import { redirect } from 'next/navigation';
import Link from 'next/link';
import { createClient } from '@/lib/supabase/server';
import Navbar from '@/components/layout/Navbar';
import { formatCreditsAsMinutes } from '@/lib/stripe/plans';

export default async function DashboardPage() {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect('/login');

  const [profileRes, subRes, videosRes] = await Promise.all([
    supabase.from('profiles').select('full_name, twin_status').eq('id', user.id).single(),
    supabase.from('subscriptions').select('credits_remaining, credits_monthly, plan_tier').eq('user_id', user.id).single(),
    supabase.from('video_tasks').select('id, title, status, output_url, thumbnail_url, duration_seconds, created_at')
      .eq('user_id', user.id).eq('is_deleted', false).order('created_at', { ascending: false }).limit(6),
  ]);

  const profile = profileRes.data;
  const sub = subRes.data;
  const videos = videosRes.data ?? [];
  const firstName = profile?.full_name?.split(' ')[0] ?? 'Agent';
  const twinReady = profile?.twin_status === 'ready';

  return (
    <>
      <Navbar pageTitle={`Good morning, ${firstName} 👋`} pageDescription="Here's your AVA overview" />
      <main className="flex-1 p-6 space-y-8">
        {!twinReady && (
          <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl p-6 flex items-center justify-between gap-4">
            <div>
              <h2 className="text-white font-bold text-lg mb-1">Set Up Your Digital Twin</h2>
              <p className="text-blue-100 text-sm">Record a 2-minute video and we'll create your AI avatar in under 24 hours.</p>
            </div>
            <Link href="/onboarding" className="flex-shrink-0 bg-white text-blue-700 font-bold text-sm px-6 py-3 rounded-xl hover:bg-blue-50 transition-colors">
              Start Setup →
            </Link>
          </div>
        )}

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { label: 'Videos Generated', value: videos.filter(v => v.status === 'complete').length, icon: '🎬', sub: 'this cycle', color: 'bg-blue-50 text-blue-600' },
            { label: 'Credits Remaining', value: formatCreditsAsMinutes(sub?.credits_remaining ?? 0), icon: '⏱️', sub: `of ${formatCreditsAsMinutes(sub?.credits_monthly ?? 0)}/mo`, color: 'bg-emerald-50 text-emerald-600' },
            { label: 'Digital Twin', value: twinReady ? 'Ready ✓' : 'Setup Needed', icon: '🎭', sub: twinReady ? 'Synced with HeyGen' : 'Upload your video', color: twinReady ? 'bg-emerald-50 text-emerald-600' : 'bg-amber-50 text-amber-600' },
            { label: 'Plan', value: sub?.plan_tier ?? 'Free', icon: '💎', sub: 'current plan', color: 'bg-purple-50 text-purple-600' },
          ].map(card => (
            <div key={card.label} className="bg-white rounded-2xl border border-slate-100 shadow-card p-5">
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-xl mb-3 ${card.color}`}>{card.icon}</div>
              <p className="text-2xl font-extrabold text-slate-900 leading-tight capitalize">{card.value}</p>
              <p className="text-xs font-semibold text-slate-500 mt-0.5">{card.label}</p>
              <p className="text-xs text-slate-400 mt-1">{card.sub}</p>
            </div>
          ))}
        </div>

        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-bold text-slate-800 text-sm uppercase tracking-wide">Recent Videos</h2>
            <Link href="/library" className="text-sm text-blue-600 font-semibold hover:text-blue-700">View All →</Link>
          </div>
          {videos.length === 0 ? (
            <div className="bg-white rounded-2xl border-2 border-dashed border-slate-200 p-12 text-center">
              <div className="text-5xl mb-4">🎬</div>
              <p className="text-slate-600 font-semibold mb-1">No videos yet</p>
              <p className="text-slate-400 text-sm mb-4">Generate your first video in the Studio</p>
              <Link href={twinReady ? '/studio' : '/onboarding'} className="inline-block bg-blue-600 text-white font-semibold text-sm px-5 py-2.5 rounded-lg hover:bg-blue-700 transition-colors">
                {twinReady ? 'Open Studio →' : 'Set Up My Twin First →'}
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {videos.map(video => (
                <div key={video.id} className="bg-white rounded-xl border border-slate-100 shadow-card overflow-hidden">
                  <div className="aspect-video bg-slate-100 relative flex items-center justify-center">
                    {video.thumbnail_url ? <img src={video.thumbnail_url} alt="" className="w-full h-full object-cover" /> : <span className="text-4xl">🎞️</span>}
                    <div className={`absolute top-2 right-2 text-xs font-bold px-2 py-0.5 rounded-full ${video.status === 'complete' ? 'bg-emerald-500 text-white' : video.status === 'processing' ? 'bg-blue-500 text-white' : 'bg-slate-500 text-white'}`}>
                      {video.status === 'complete' ? '✓ Ready' : video.status === 'processing' ? '⏳ Rendering' : video.status}
                    </div>
                  </div>
                  <div className="p-3">
                    <p className="font-semibold text-slate-800 text-sm truncate">{video.title ?? 'Untitled Video'}</p>
                    <p className="text-slate-400 text-xs mt-0.5">{new Date(video.created_at).toLocaleDateString()}</p>
                    {video.status === 'complete' && video.output_url && (
                      <a href={video.output_url} download className="mt-2 block text-center text-xs font-semibold text-blue-600 border border-blue-200 rounded-lg py-1.5 hover:bg-blue-50 transition-colors">Download</a>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
    </>
  );
}
