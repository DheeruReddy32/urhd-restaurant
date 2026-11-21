'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { User, Mail, Lock, Phone, ArrowRight, AlertCircle, Sparkles } from 'lucide-react';
import confetti from 'canvas-confetti';

export default function RegisterPage() {
  const router = useRouter();
  const { register } = useAuth();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [phone, setPhone] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setLoading(true);

    const res = await register(name, email, password, phone);
    if (res.success) {
      confetti({ particleCount: 60, spread: 60 });
      router.push('/profile');
    } else {
      setErrorMsg(res.error || 'Registration failed');
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
        <h1 className="font-serif font-bold text-3xl text-brand-charcoal">Join the URHD Crew</h1>
        <p className="text-xs text-neutral-500">
          Sign up to unlock 100 free welcome Pirate Berries, fast checkout &amp; saved addresses.
        </p>
      </div>

      <div className="bg-white p-6 sm:p-8 rounded-3xl border border-brand-beige-dark shadow-rustic space-y-5">
        <div className="p-3 bg-brand-gold/15 rounded-2xl border border-brand-gold/30 text-amber-900 text-xs flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-brand-orange shrink-0" />
          <span>
            <strong>100 Pirate Berries</strong> credited automatically on new signup!
          </span>
        </div>

        {errorMsg && (
          <div className="p-3 bg-red-50 border border-red-200 text-red-700 text-xs rounded-xl flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1">
            <label className="block text-xs font-bold text-neutral-700">Full Name</label>
            <div className="relative">
              <User className="w-4 h-4 text-neutral-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Monkey D. Luffy"
                className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-neutral-200 text-xs text-brand-charcoal focus:outline-none focus:border-brand-orange"
              />
            </div>
          </div>

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
            <label className="block text-xs font-bold text-neutral-700">Mobile Phone</label>
            <div className="relative">
              <Phone className="w-4 h-4 text-neutral-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="+91 98765 43210"
                className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-neutral-200 text-xs text-brand-charcoal focus:outline-none focus:border-brand-orange"
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="block text-xs font-bold text-neutral-700">Password</label>
            <div className="relative">
              <Lock className="w-4 h-4 text-neutral-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="At least 6 characters"
                className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-neutral-200 text-xs text-brand-charcoal focus:outline-none focus:border-brand-orange"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 rounded-xl bg-brand-orange hover:bg-brand-orange-hover text-white text-xs font-bold shadow-md hover:shadow-orange-glow transition-all flex items-center justify-center gap-2 disabled:opacity-50"
          >
            <span>{loading ? 'Creating Account...' : 'Register & Claim 100 Points'}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        <div className="text-center pt-2 text-xs text-neutral-500">
          <span>Already have an account? </span>
          <Link href="/auth/login" className="text-brand-orange font-bold hover:underline">
            Sign In here
          </Link>
        </div>
      </div>
    </div>
  );
}
