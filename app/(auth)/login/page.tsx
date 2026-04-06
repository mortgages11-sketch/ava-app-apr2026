'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { createClient } from '@/lib/supabase/client';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const supabase = createClient();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(''); setLoading(true);
    const { error: err } = await supabase.auth.signInWithPassword({ email, password });
    if (err) { setError('Email or password is incorrect.'); setLoading(false); return; }
    router.push('/dashboard'); router.refresh();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-2 mb-4">
            <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center shadow-md">
              <span className="text-white font-bold">A</span>
            </div>
            <span className="font-extrabold text-slate-800 text-xl">AVA</span>
          </Link>
          <h1 className="text-2xl font-bold text-slate-900">Welcome back</h1>
        </div>
        <div className="bg-white rounded-2xl shadow-card border border-slate-100 p-8">
          <form onSubmit={handleLogin} className="space-y-5">
            {error && <div className="bg-red-50 border border-red-200 rounded-xl px-4 py-3 text-red-700 text-sm font-medium">⚠ {error}</div>}
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1.5">Email Address</label>
              <input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="you@example.com" required
                className="w-full h-11 px-4 rounded-xl border-2 border-slate-200 text-slate-800 font-medium focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-50 transition-all" />
            </div>
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1.5">Password</label>
              <input type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="••••••••" required
                className="w-full h-11 px-4 rounded-xl border-2 border-slate-200 text-slate-800 font-medium focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-50 transition-all" />
            </div>
            <button type="submit" disabled={loading}
              className="w-full h-12 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-bold rounded-xl transition-all shadow-lg shadow-blue-200 flex items-center justify-center gap-2">
              {loading ? <><div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />Signing in…</> : 'Sign In'}
            </button>
          </form>
        </div>
        <p className="text-center mt-6 text-sm text-slate-500">
          Don't have an account? <Link href="/signup" className="text-blue-600 font-semibold hover:text-blue-700">Create one free</Link>
        </p>
      </div>
    </div>
  );
}
