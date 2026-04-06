// app/page.tsx — AVA Landing Page
import Link from 'next/link';

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Nav */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white/90 backdrop-blur border-b border-slate-100">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">A</span>
            </div>
            <span className="font-bold text-slate-800 text-lg">AVA</span>
          </div>
          <div className="flex items-center gap-4">
            <Link href="/login" className="text-slate-600 hover:text-slate-900 font-medium text-sm">Sign in</Link>
            <Link href="/signup" className="bg-blue-600 text-white font-semibold text-sm px-5 py-2 rounded-lg hover:bg-blue-700 transition-colors shadow-sm">
              Start Free Trial
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="pt-32 pb-20 px-6 bg-gradient-to-b from-slate-50 to-white">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 bg-blue-50 border border-blue-100 text-blue-700 text-sm font-semibold px-4 py-2 rounded-full mb-8">
            <span className="w-2 h-2 bg-blue-500 rounded-full animate-pulse" />
            Built for Real Estate Agents & Loan Officers
          </div>
          <h1 className="text-5xl md:text-6xl font-extrabold text-slate-900 leading-tight mb-6">
            Your Face. Your Voice.<br />
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600">
              Infinite Videos.
            </span>
          </h1>
          <p className="text-xl text-slate-500 max-w-2xl mx-auto mb-10 leading-relaxed">
            AVA creates photorealistic AI videos of you speaking from any script — listing announcements, rate alerts, market updates — without a camera, crew, or editing software.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/signup" className="bg-blue-600 text-white font-bold text-base px-8 py-4 rounded-xl hover:bg-blue-700 transition-all shadow-lg shadow-blue-200">
              Create My Digital Twin →
            </Link>
            <Link href="#how-it-works" className="bg-white text-slate-700 font-semibold text-base px-8 py-4 rounded-xl border-2 border-slate-200 hover:border-slate-300 transition-all">
              See How It Works
            </Link>
          </div>
          <p className="mt-4 text-sm text-slate-400">No credit card required · Cancel anytime</p>
        </div>
      </section>

      {/* Social Proof */}
      <section className="py-10 bg-slate-800">
        <div className="max-w-5xl mx-auto px-6 flex flex-wrap items-center justify-center gap-x-12 gap-y-4">
          {['RE/MAX', 'Keller Williams', 'Coldwell Banker', 'eXp Realty', 'Compass'].map(b => (
            <span key={b} className="text-slate-400 font-semibold text-sm tracking-widest uppercase">{b}</span>
          ))}
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="py-24 px-6">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-extrabold text-slate-900 mb-4">From Script to Published in Minutes</h2>
            <p className="text-slate-500 text-lg">Three steps. No tech skills required.</p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              { step: '01', title: 'Record Your Twin', desc: 'Film a 2-minute video on any phone. Upload once. Your digital twin is trained in under 24 hours.', icon: '📹' },
              { step: '02', title: 'Type Your Script', desc: 'Write your listing, market update, or rate alert in our studio. Or pick one of our realtor templates.', icon: '✍️' },
              { step: '03', title: 'Download & Share', desc: 'Your video is ready in minutes. Download HD or share directly to all your social platforms.', icon: '🚀' },
            ].map(item => (
              <div key={item.step} className="relative bg-white rounded-2xl p-8 border border-slate-100 shadow-card">
                <div className="absolute -top-3 left-6 bg-blue-600 text-white text-xs font-bold px-3 py-1 rounded-full">Step {item.step}</div>
                <div className="text-4xl mb-4 mt-2">{item.icon}</div>
                <h3 className="text-lg font-bold text-slate-800 mb-2">{item.title}</h3>
                <p className="text-slate-500 text-sm leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section className="py-24 px-6 bg-slate-50">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-extrabold text-slate-900 mb-4">Simple, Transparent Pricing</h2>
            <p className="text-slate-500 text-lg">One price per month. No per-video fees. No surprises.</p>
          </div>
          <div className="grid md:grid-cols-2 gap-8 max-w-2xl mx-auto">
            {[
              { name: 'Starter', price: '$99', period: '/mo', minutes: '10 min/mo', highlight: false, cta: 'Get Started', href: '/signup?plan=starter',
                features: ['10 minutes of video', '1 Digital Twin', 'HD 720p output', 'Voice clone', 'Video library & downloads'] },
              { name: 'Professional', price: '$249', period: '/mo', minutes: '30 min/mo', highlight: true, badge: 'Most Popular', cta: 'Go Professional', href: '/signup?plan=professional',
                features: ['30 minutes of video', '3 Digital Twins', 'HD 1080p output', 'Voice clone', 'Priority rendering', 'Social share links'] },
            ].map(plan => (
              <div key={plan.name} className={`relative rounded-2xl p-8 border-2 ${plan.highlight ? 'border-blue-500 bg-white shadow-xl shadow-blue-100' : 'border-slate-200 bg-white shadow-card'}`}>
                {plan.badge && (
                  <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 bg-blue-600 text-white text-xs font-bold px-4 py-1.5 rounded-full">{plan.badge}</div>
                )}
                <p className="text-slate-500 font-semibold text-sm mb-1">{plan.name}</p>
                <div className="flex items-end gap-1 mb-1">
                  <span className="text-4xl font-extrabold text-slate-900">{plan.price}</span>
                  <span className="text-slate-400 mb-1">{plan.period}</span>
                </div>
                <p className="text-blue-600 font-semibold text-sm mb-6">{plan.minutes}</p>
                <ul className="space-y-3 mb-8">
                  {plan.features.map(f => (
                    <li key={f} className="flex items-center gap-2.5 text-sm text-slate-700">
                      <span className="w-5 h-5 bg-emerald-50 rounded-full flex items-center justify-center flex-shrink-0 text-emerald-600 text-xs">✓</span>
                      {f}
                    </li>
                  ))}
                </ul>
                <Link href={plan.href} className={`block text-center font-bold py-3.5 rounded-xl transition-all ${plan.highlight ? 'bg-blue-600 text-white hover:bg-blue-700' : 'bw-slate-100 text-slate-800 hover:bg-slate-200'}`}>
                  {plan.cta}
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 px-6 bg-gradient-to-br from-slate-800 to-slate-900">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-4xl font-extrabold text-white mb-4">Your Competition Is Already Posting. Are You?</h2>
          <p className="text-slate-400 text-lg mb-10">Top-producing agents post 3–5 videos a week. AVA makes that possible without a film crew.</p>
          <Link href="/signup" className="inline-block bg-blue-500 hover:bg-blue-400 text-white font-bold text-lg px-10 py-5 rounded-xl transition-all shadow-lg">
            Create My Digital Twin — Free Setup →
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-10 px-6 border-t border-slate-100 bg-white">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 bg-blue-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-xs">A</span>
            </div>
            <span className="font-bold text-slate-700">AVA</span>
          </div>
          <p className="text-slate-400 text-sm">© {new Date().getFullYear()} AVA Technologies. All rights reserved.</p>
          <div className="flex items-center gap-6 text-sm text-slate-400">
            <a href="#" className="hover:text-slate-700">Privacy</a>
            <a href="#" className="hover:text-slate-700">Terms</a>
            <a href="mailto:support@ava.ai" className="hover:text-slate-700">Support</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
