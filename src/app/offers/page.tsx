'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  Tag,
  Sparkles,
  Copy,
  Check,
  Gift,
  Coins,
  ArrowRight,
  Crown,
  Percent,
  Flame,
} from 'lucide-react';

export default function OffersPage() {
  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  const coupons = [
    {
      code: 'WELCOME50',
      title: 'First Voyage Welcome Gift',
      discount: '20% OFF (Up to ₹150)',
      minOrder: '₹399',
      description: 'Exclusive welcome bonus for new guests on their first delivery or table order.',
      expiry: 'Valid for next 90 days',
      badge: 'FIRST ORDER',
    },
    {
      code: 'GRANDLINE20',
      title: 'Straw Hat Pirate Feast Promo',
      discount: '20% OFF (Up to ₹200)',
      minOrder: '₹699',
      description: 'Applicable on all Grand Line anime specials, giant bone roasts, and seafood risottos.',
      expiry: 'Valid on orders > ₹699',
      badge: 'ANIME SPECIAL',
    },
    {
      code: 'RUSTIC100',
      title: 'Healthy Luxury Flat Discount',
      discount: 'Flat ₹100 OFF',
      minOrder: '₹500',
      description: 'Enjoy clean, organic nourishment with ₹100 flat savings on nourish bowls and pizzas.',
      expiry: 'Valid this week',
      badge: 'LIMITED TIME',
    },
    {
      code: 'GENZFLAVOR',
      title: 'College & Student Sprints',
      discount: '15% OFF (Up to ₹100)',
      minOrder: '₹299',
      description: 'Quick afternoon coffee, burgers, and study session snacks.',
      expiry: 'Valid daily 2:00 PM - 6:00 PM',
      badge: 'GEN Z SPECIAL',
    },
  ];

  const handleCopy = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(code);
    setTimeout(() => setCopiedCode(null), 2500);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-12">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-brand-charcoal to-neutral-900 text-white rounded-3xl p-8 sm:p-14 border border-brand-orange/30 shadow-2xl relative overflow-hidden">
        <div className="space-y-4 max-w-2xl relative z-10">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-brand-orange/20 border border-brand-orange text-brand-orange text-xs font-bold">
            <Sparkles className="w-3.5 h-3.5" />
            <span>URHD PROMOTIONS &amp; LOYALTY</span>
          </div>

          <h1 className="font-serif text-3xl sm:text-5xl font-bold tracking-tight">
            Special Offers &amp; Pirate Berries Loyalty
          </h1>

          <p className="text-xs sm:text-sm text-neutral-300 leading-relaxed font-light">
            Claim verified discount promo coupons for home delivery and dine-in visits.
            Plus, learn how you can unlock free desserts and off-menu chef tastings with Pirate Berries.
          </p>
        </div>
      </div>

      {/* Available Coupons Grid */}
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="font-serif font-bold text-2xl text-brand-charcoal flex items-center gap-2">
            <Tag className="w-5 h-5 text-brand-orange" />
            <span>Active Discount Codes</span>
          </h2>
          <span className="text-xs text-neutral-500">Click any code to copy to clipboard</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {coupons.map((coupon) => (
            <div
              key={coupon.code}
              className="bg-white rounded-3xl p-6 border border-brand-beige-dark shadow-rustic flex flex-col justify-between space-y-4 relative overflow-hidden group hover:border-brand-orange transition-all"
            >
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] bg-brand-orange text-white font-bold px-2.5 py-0.5 rounded-full">
                    {coupon.badge}
                  </span>
                  <span className="text-xs text-neutral-400 font-mono">{coupon.expiry}</span>
                </div>

                <h3 className="font-serif font-bold text-lg text-brand-charcoal">{coupon.title}</h3>
                <div className="font-serif font-black text-2xl text-brand-orange">
                  {coupon.discount}
                </div>
                <p className="text-xs text-neutral-600 leading-relaxed">{coupon.description}</p>
              </div>

              <div className="pt-4 border-t border-neutral-100 flex items-center justify-between">
                <div className="text-[11px] text-neutral-500">
                  Min Order: <strong>{coupon.minOrder}</strong>
                </div>

                <button
                  onClick={() => handleCopy(coupon.code)}
                  className={`px-4 py-2 rounded-xl text-xs font-mono font-bold flex items-center gap-1.5 transition-all ${
                    copiedCode === coupon.code
                      ? 'bg-emerald-600 text-white'
                      : 'bg-brand-beige text-brand-charcoal hover:bg-brand-orange hover:text-white'
                  }`}
                >
                  {copiedCode === coupon.code ? (
                    <>
                      <Check className="w-3.5 h-3.5" />
                      <span>COPIED!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5" />
                      <span>{coupon.code}</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Loyalty Bounty Tiers */}
      <div className="bg-brand-charcoal text-white rounded-3xl p-8 sm:p-12 border border-brand-gold/30 shadow-2xl space-y-8">
        <div className="text-center space-y-2 max-w-xl mx-auto">
          <div className="inline-flex items-center gap-1.5 text-brand-gold font-bold text-xs uppercase tracking-wider">
            <Crown className="w-4 h-4" />
            <span>Loyalty Bounty Rewards</span>
          </div>
          <h2 className="font-serif text-3xl font-bold">The Three Ranks of Flavor</h2>
          <p className="text-xs text-neutral-400">
            Earn 1 Berry for every ₹20 spent across dine-in, delivery, and workspace passes.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-6 bg-brand-charcoal-light rounded-2xl border border-neutral-800 space-y-3">
            <span className="text-[10px] uppercase font-bold text-neutral-400">Tier 1</span>
            <h3 className="font-serif font-bold text-xl text-brand-beige">Cabin Boy</h3>
            <p className="text-xs text-neutral-400 font-mono">0 - 499 Berries</p>
            <ul className="text-xs text-neutral-300 space-y-1.5 pt-2 border-t border-neutral-800">
              <li>• 100 Welcome Points on account signup</li>
              <li>• Free bread basket with orders &gt; ₹600</li>
              <li>• Exclusive seasonal menu notifications</li>
            </ul>
          </div>

          <div className="p-6 bg-brand-charcoal-light rounded-2xl border border-brand-orange/40 space-y-3 ring-1 ring-brand-orange">
            <span className="text-[10px] uppercase font-bold text-brand-orange">Tier 2</span>
            <h3 className="font-serif font-bold text-xl text-brand-orange">Supernova</h3>
            <p className="text-xs text-neutral-400 font-mono">500 - 1,499 Berries</p>
            <ul className="text-xs text-neutral-300 space-y-1.5 pt-2 border-t border-neutral-800">
              <li>• 10% Flat discount on all Dine-In visits</li>
              <li>• 1 Free Specialty Cold Drip Coffee / month</li>
              <li>• Priority table reservations on weekends</li>
            </ul>
          </div>

          <div className="p-6 bg-brand-charcoal-light rounded-2xl border border-brand-gold/40 space-y-3">
            <span className="text-[10px] uppercase font-bold text-brand-gold">Tier 3</span>
            <h3 className="font-serif font-bold text-xl text-brand-gold">Pirate King</h3>
            <p className="text-xs text-neutral-400 font-mono">1,500+ Berries</p>
            <ul className="text-xs text-neutral-300 space-y-1.5 pt-2 border-t border-neutral-800">
              <li>• 20% Flat discount on entire food &amp; workspace bill</li>
              <li>• Secret off-menu tastings with the Chef</li>
              <li>• Free entry to One Piece Anime Movie Nights</li>
            </ul>
          </div>
        </div>

        <div className="text-center pt-2">
          <Link
            href="/menu"
            className="inline-flex items-center gap-2 px-8 py-3.5 rounded-2xl bg-brand-orange hover:bg-brand-orange-hover text-white font-bold text-xs shadow-md transition-all"
          >
            <span>Start Feasting &amp; Earning Berries</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </div>
  );
}
