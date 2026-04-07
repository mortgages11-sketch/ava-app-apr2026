import { redirect } from 'next/navigation';
import Link from 'next/link';
import { createClient } from '@/lib/supabase/server';
import Navbar from '@/components/layout/Navbar';

export default async function LibraryPage() {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect('/login');

  const { data: videos } = await supabase.from('video_tasks')
    .select('id, title, status, output_url, thumbnail_url, duration_seconds, created_at')
    .eq('user_id', user.id).eq('is_deleted', false).order('created_at', { ascending: false });

  return (
    <>
      <Navbar pageTitle="Video Library" pageDescription="All your generated videos in one place" />
      <main className="flex-1 p-6">
        {!videos || videos.length === 0 ? (
          <div className="bg-white rounded-2xl border-2 border-dashed border-slate-200 p-16 text-center">
            <div className="text-5xl mb-4">🎞️</div>
            <p className="font-bold text-slate-700 mb-1">No videos yet</p>
            <p className="text-slate-400 text-sm mb-4">Head to the Studio to generate your first video.</p>
            <Link href="/studio" className="inline-block bg-blue-600 text-white font-semibold text-sm px-5 py-2.5 rounded-lg hover:bg-blue-700 transition-colors">Open Studio →</Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
            {videos.map(video => (
              <div key={video.id} className="bg-white rounded-2xl border border-slate-100 shadow-card overflow-hidden">
                <div className="aspect-video bg-slate-100 relative flex items-center justify-center">
                  {video.thumbnail_url ? <img src={video.thumbnail_url} alt="" className="w-full h-full object-cover" /> : <span className="text-5xl opacity-40">🎞️</span>}
                  <div className={`absolute top-2 left-2 text-xs font-bold px-2.5 py-1 rounded-full border ${video.status === 'complete' ? 'bg-emerald-100 text-emerald-700 border-emerald-200' : video.status === 'processing' ? 'bg-blue-100 text-blue-700 border-blue-200' : 'bg-slate-100 text-slate-600 border-slate-200'}`}>
                    {video.status === 'complete' ? '✓ Ready' : video.status === 'processing' ? '⏳ Rendering' : video.status}
                  </div>
                </div>
                <div className="p-4">
                  <p className="font-bold text-slate-800 text-sm truncate">{video.title ?? 'Untitled Video'}</p>
                  <p className="text-slate-400 text-xs mt-0.5">{new Date(video.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</p>
                  {video.status === 'complete' && video.output_url && (
                    <div className="flex gap-2 mt-3">
                      <a href={video.output_url} download className="flex-1 text-center text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 py-2 rounded-lg transition-colors">⬇ Download</a>
                      <a href={video.output_url} target="_blank" rel="noopener noreferrer" className="text-xs font-semibold text-blue-600 border border-blue-200 bg-blue-50 hover:bg-blue-100 py-2 px-3 rounded-lg transition-colors">Share ↗</a>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </>
  );
}
