'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { Lock, Mail, ArrowRight, AlertCircle, Sparkles, User, ShieldAlert, ChefHat } from 'lucide-react';

export default function LoginPage() {
  const router = useRouter();
  const { login, quickLoginAs } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setLoading(true);

    const res = await login(email, password);
    if (res.success) {
      router.push('/profile');
    } else {
      setErrorMsg(res.error || 'Login failed');
    }
    setLoading(false);
  };

  return (
    <div className="max-w-md mx-auto px-4 py-16 space-y-8">
      {/* Brand Header */}
      <div className="text-center space-y-2">
        <div className="w-12 h-12 rounded-2xl bg-brand-orange text-white font-serif font-black text-2xl mx-auto flex items-center justify-center shadow-lg">
          U
        </div>
        <h1 className="font-serif font-bold text-3xl text-brand-charcoal">Sign In to URHD</h1>
        <p className="text-xs text-neutral-500">
          Access your saved addresses, track live orders, and check Pirate Berries.
        </p>
      </div>

      {/* Quick Demo Switcher Tabs */}
      <div className="p-4 bg-brand-beige/60 rounded-3xl border border-brand-beige-dark space-y-2.5">
        <span className="text-[10px] font-bold uppercase tracking-wider text-neutral-500 block text-center">
          ⚡ One-Click Instant Demo Login:
        </span>
        <div className="grid grid-cols-3 gap-2">
          <button
            type="button"
            onClick={async () => {
              await quickLoginAs('CUSTOMER');
              router.push('/profile');
            }}
            className="p-2.5 rounded-xl bg-white hover:bg-neutral-50 border border-neutral-200 text-center text-xs font-bold text-brand-charcoal transition-all shadow-xs flex flex-col items-center gap-1"
          >
            <User className="w-4 h-4 text-brand-orange" />
            <span>Customer</span>
          </button>

          <button
            type="button"
            onClick={async () => {
              await quickLoginAs('ADMIN');
              router.push('/admin');
            }}
            className="p-2.5 rounded-xl bg-white hover:bg-neutral-50 border border-neutral-200 text-center text-xs font-bold text-brand-charcoal transition-all shadow-xs flex flex-col items-center gap-1"
          >
            <ShieldAlert className="w-4 h-4 text-amber-600" />
            <span>Owner</span>
          </button>

          <button
            type="button"
            onClick={async () => {
              await quickLoginAs('KITCHEN');
              router.push('/kitchen');
            }}
            className="p-2.5 rounded-xl bg-white hover:bg-neutral-50 border border-neutral-200 text-center text-xs font-bold text-brand-charcoal transition-all shadow-xs flex flex-col items-center gap-1"
          >
            <ChefHat className="w-4 h-4 text-red-600" />
            <span>Kitchen</span>
          </button>
        </div>
      </div>

      {/* Standard Email / Password Form */}
      <div className="bg-white p-6 sm:p-8 rounded-3xl border border-brand-beige-dark shadow-rustic space-y-5">
        {errorMsg && (
          <div className="p-3 bg-red-50 border border-red-200 text-red-700 text-xs rounded-xl flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1">
            <label className="block text-xs font-bold text-neutral-700">Email Address</label>
            <div className="relative">
              <Mail className="w-4 h-4 text-neutral-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@domain.com"
                className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-neutral-200 text-xs text-brand-charcoal focus:outline-none focus:border-brand-orange"
              />
            </div>
          </div>

          <div className="space-y-1">
            <div className="flex justify-between items-center">
              <label className="block text-xs font-bold text-neutral-700">Password</label>
              <span className="text-[10px] text-brand-orange cursor-pointer hover:underline">
                Forgot password?
              </span>
            </div>
            <div className="relative">
              <Lock className="w-4 h-4 text-neutral-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-neutral-200 text-xs text-brand-charcoal focus:outline-none focus:border-brand-orange"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 rounded-xl bg-brand-orange hover:bg-brand-orange-hover text-white text-xs font-bold shadow-md hover:shadow-orange-glow transition-all flex items-center justify-center gap-2 disabled:opacity-50"
          >
            <span>{loading ? 'Authenticating...' : 'Sign In'}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        <div className="text-center pt-2 text-xs text-neutral-500">
          <span>First time dining with us? </span>
          <Link href="/auth/register" className="text-brand-orange font-bold hover:underline">
            Create an Account (+100 Bounty)
          </Link>
        </div>
      </div>
    </div>
  );
}
