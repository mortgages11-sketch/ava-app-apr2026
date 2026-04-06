export const PLANS = {
  FREE:         { id: 'free' as const,         name: 'Free',         priceUSD: 0,   priceId: null,                                           monthlyCredits: 0,    monthlyMinutes: 0,  features: ['Community support'] },
  STARTER:      { id: 'starter' as const,      name: 'Starter',      priceUSD: 99,  priceId: process.env.STRIPE_STARTER_PRICE_ID ?? '',      monthlyCredits: 600,  monthlyMinutes: 10, features: ['10 minutes/mo', '1 Digital Twin', 'HD 720p', 'Voice clone', 'Video library'] },
  PROFESSIONAL: { id: 'professional' as const, name: 'Professional', priceUSD: 249, priceId: process.env.STRIPE_PRO_PRICE_ID ?? '',          monthlyCredits: 1800, monthlyMinutes: 30, features: ['30 minutes/mo', '3 Digital Twins', 'HD 1080p', 'Voice clone', 'Priority rendering', 'Social share'] },
} as const;

export type PlanTier = 'free' | 'starter' | 'professional';

export function getPlanByPriceId(priceId: string) {
  return Object.values(PLANS).find(p => p.priceId === priceId) ?? PLANS.FREE;
}
export function formatCreditsAsMinutes(seconds: number): string {
  const m = Math.floor(seconds / 60); const s = seconds % 60;
  if (m === 0) return `${s}s`; if (s === 0) return `${m}m`; return `${m}m ${s}s`;
}
