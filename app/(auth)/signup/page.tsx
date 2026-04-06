'use client';
import { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { createClient } from '@/lib/supabase/client';

export default function SignupPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const plan = searchParams.get('plan') ?? 'starter';
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('realtor');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const supabase = createClient();

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (password.length < 8) { setError('Password must be at least 8 characters.'); return; }
    setLoading(true);
    const { error: err } = await supabase.auth.signUp({
      email, password,
      options: { data: { full_name: fullName, role }, emailRedirectTo: `${window.location.origin}/dashboard` },
    });
    if (err) { setError(err.message); setLoading(false); return; }
    router.push('/onboarding'); router.refresh();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-2 mb-4">
            <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center shadow-md">
              <span className="text-white font-bold">A</span>
            </div>
            <span className="font-extrabold text-slate-800 text-xl">AVA</span>
          </Link>
          <h1 className="text-2xl font-bold text-slate-900">Create your account</h1>
          <p className="text-slate-500 text-sm mt-1">Setting up <span className="text-blue-600 font-semibold capitalize">{plan}</span> plan</p>
        </div>
        <div className="bg-white rounded-2xl shadow-card border border-slate-100 p-8">
          <form onSubmit={handleSignup} className="space-y-5">
            {error && <div className="bg-red-50 border border-red-200 rounded-xl px-4 py-3 text-red-700 text-sm font-medium">⚠ {error}</div>}
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1.5">Full Name</label>
              <input type="text" value={fullName} onChange={e => setFullName(e.target.value)} placeholder="Sarah Johnson" required
                className="w-full h-11 px-4 rounded-xl border-2 border-slate-200 text-slate-800 font-medium focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-50 transition-all" />
            </div>
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1.5">I am a…</label>
              <select value={role} onChange={e => setRole(e.target.value)}
                className="w-full h-11 px-4 rounded-xl border-2 border-slate-200 text-slate-800 font-medium focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-50 transition-all">
                <option value="realtor">Real Estate Agent / Realtor</option>
                <option value="loan_officer">Loan Officer / Mortgage Broker</option>
                <option value="team_admin">Team Lead / Broker</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1.5">Work Email</label>
              <input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="you@yourbrokerage.com" required
                className="w-full h-11 px-4 rounded-xl border-2 border-slate-200 text-slate-800 font-medium focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-50 transition-all" />
            </div>
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1.5">Password</label>
              <input type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="Min. 8 characters" required minLength={8}
                className="w-full h-11 px-4 rounded-xl border-2 border-slate-200 text-slate-800 font-medium focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-50 transition-all" />
            </div>
            <button type="submit" disabled={loading}
              className="w-full h-12 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-bold rounded-xl transition-all shadow-lg shadow-blue-200 flex items-center justify-center gap-2">
              {loading ? <><div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />Creating account…</> : 'Create My Account →'}
            </button>
          </form>
        </div>
        <p className="text-center mt-6 text-sm text-slate-500">
          Already have an account? <Link href="/login" className="text-blue-600 font-semibold hover:text-blue-700">Sign in</Link>
        </p>
      </div>
    </div>
  );
}
