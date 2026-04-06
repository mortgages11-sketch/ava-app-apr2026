'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { formatCreditsAsMinutes } from '@/lib/stripe/plans';

interface SidebarProps {
  creditsRemaining: number;
  creditsMonthly: number;
  planTier: string;
  twinReady: boolean;
  userName: string;
}

const NAV = [
  { href: '/dashboard', label: 'Dashboard',     icon: '🏠', exact: true },
  { href: '/studio',    label: 'Studio',        icon: '🎬', exact: false },
  { href: '/library',   label: 'Video Library', icon: '🎞️',  exact: false },
  { href: '/onboarding',label: 'My Twin',       icon: '🎭', exact: false },
  { href: '/settings',  label: 'Settings',      icon: '⚙️',  exact: false },
];

export default function Sidebar({ creditsRemaining, creditsMonthly, planTier, twinReady, userName }: SidebarProps) {
  const pathname = usePathname();
  const usedPct = creditsMonthly > 0 ? Math.round(((creditsMonthly - creditsRemaining) / creditsMonthly) * 100) : 0;
  const isActive = (href: string, exact: boolean) => exact ? pathname === href : pathname.startsWith(href);

  return (
    <aside className="fixed left-0 top-0 h-full w-64 bg-slate-900 flex flex-col z-40">
      <div className="px-6 py-5 border-b border-slate-700/50">
        <Link href="/dashboard" className="flex items-center gap-2.5">
          <div className="w-9 h-9 bg-blue-500 rounded-xl flex items-center justify-center shadow-md flex-shrink-0">
            <span className="text-white font-extrabold text-sm">A</span>
          </div>
          <div>
            <p className="text-white font-extrabold leading-tight">AVA</p>
            <p className="text-slate-400 text-xs leading-tight">Agent Video Assistant</p>
          </div>
        </Link>
      </div>

      <nav className="flex-1 px-3 py-4 space-y-1">
        {NAV.map(item => {
          const active = isActive(item.href, item.exact);
          return (
            <Link key={item.href} href={item.href}
              className={`flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all ${active ? 'bg-blue-600 text-white shadow-md' : 'text-slate-400 hover:text-white hover:bg-slate-800'}`}>
              <span className="text-base w-5 text-center">{item.icon}</span>
              {item.label}
              {item.href === '/onboarding' && !twinReady && (
                <span className="ml-auto w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
              )}
            </Link>
          );
        })}
      </nav>

      <div className="mx-3 mb-3 bg-slate-800 rounded-xl p-4">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-semibold text-slate-400 uppercase tracking-wide">Credits</span>
          <span className="text-xs font-bold text-white">{formatCreditsAsMinutes(creditsRemaining)}</span>
        </div>
        <div className="w-full h-1.5 bg-slate-700 rounded-full overflow-hidden mb-2">
          <div className={`h-full rounded-full transition-all ${usedPct > 80 ? 'bg-amber-400' : 'bg-blue-500'}`}
            style={{ width: `${Math.max(100 - usedPct, 0)}%` }} />
        </div>
        <div className="flex items-center justify-between">
          <span className="text-xs text-slate-500">{usedPct}% used</span>
          <Link href="/settings" className="text-xs text-blue-400 font-semibold hover:text-blue-300 capitalize">{planTier}</Link>
        </div>
      </div>

      <div className="px-3 pb-4 border-t border-slate-700/50 pt-3">
        <div className="flex items-center gap-3 px-3 py-2">
          <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center text-white font-bold text-sm flex-shrink-0">
            {userName.charAt(0).toUpperCase()}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-white text-sm font-semibold truncate">{userName}</p>
            <p className="text-slate-500 text-xs capitalize">{planTier} plan</p>
          </div>
        </div>
      </div>
    </aside>
  );
}
