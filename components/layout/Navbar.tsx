'use client';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';

export default function Navbar({ pageTitle, pageDescription }: { pageTitle: string; pageDescription?: string }) {
  const router = useRouter();
  const supabase = createClient();
  const signOut = async () => { await supabase.auth.signOut(); router.push('/login'); router.refresh(); };

  return (
    <header className="h-16 bg-white border-b border-slate-100 flex items-center justify-between px-6 sticky top-0 z-30">
      <div>
        <h1 className="font-bold text-slate-900 text-lg leading-tight">{pageTitle}</h1>
        {pageDescription && <p className="text-slate-400 text-xs mt-0.5">{pageDescription}</p>}
      </div>
      <div className="flex items-center gap-3">
        <a href="/studio" className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold text-sm px-4 py-2 rounded-lg transition-colors">
          🎬 New Video
        </a>
        <button onClick={signOut} className="text-slate-400 hover:text-slate-700 text-sm font-medium transition-colors">Sign out</button>
      </div>
    </header>
  );
}
