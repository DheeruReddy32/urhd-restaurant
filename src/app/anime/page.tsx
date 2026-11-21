'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import {
  Compass,
  Sparkles,
  Flame,
  Award,
  Clock,
  Play,
  Volume2,
  VolumeX,
  ArrowRight,
  ShieldAlert,
  Coins,
  Crown,
} from 'lucide-react';
import { ANIME_HERO_BANNER, ANIME_SPECIALS, PIRATE_QUOTES } from '@/data/animeData';
import DishModal from '@/components/menu/DishModal';
import { MenuItemData } from '@/lib/types';

export default function AnimeCafePage() {
  const [selectedDish, setSelectedDish] = useState<MenuItemData | null>(null);

  const openDishModal = (special: (typeof ANIME_SPECIALS)[0]) => {
    // Map anime special to MenuItemData
    const mapped: MenuItemData = {
      id: special.id,
      name: special.name,
      slug: special.id,
      description: special.description,
      price: special.price,
      categoryId: 'grand-line-specials',
      imageUrl: special.image,
      videoUrl: special.videoUrl || null,
      isVeg: special.isVeg,
      spiceLevel: special.spiceLevel,
      prepTime: special.prepTime,
      calories: special.calories,
      cuisine: 'Grand Line Cuisine',
      flavorProfile: special.theme,
      ingredients: 'Organic fresh ingredients, herbs, spices and pirate secret glaze',
      allergens: null,
      isChefSpecial: true,
      isAnimeSpecial: true,
      animeTheme: special.characterInspiration,
      rating: 4.9,
      ratingCount: 88,
      isAvailable: true,
      customizations: [
        {
          id: 'gl-portion',
          menuItemId: special.id,
          name: 'Pirate Appetite Portion',
          minSelect: 1,
          maxSelect: 1,
          isRequired: true,
          options: [
            { id: 'opt-reg', groupId: 'gl-portion', name: 'Straw Hat Crew Standard', price: 0, isDefault: true },
            { id: 'opt-king', groupId: 'gl-portion', name: 'Pirate King Double Portion', price: 150, isDefault: false },
          ],
        },
      ],
    };
    setSelectedDish(mapped);
  };

  return (
    <div className="space-y-20 pb-20 overflow-hidden bg-brand-charcoal text-white min-h-screen">
      {/* 1. Grand Line Cinematic Header */}
      <section className="relative pt-12 pb-24 px-4 sm:px-6 lg:px-8 border-b border-brand-orange/30 overflow-hidden">
        {/* Background Ambient Glows */}
        <div className="absolute top-0 right-1/4 w-[600px] h-[400px] bg-brand-ruby/20 rounded-full blur-[140px] pointer-events-none" />
        <div className="absolute top-20 left-10 w-[400px] h-[300px] bg-brand-gold/15 rounded-full blur-[100px] pointer-events-none" />

        <div className="max-w-7xl mx-auto text-center space-y-6 relative z-10">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-brand-ruby/40 border border-brand-ruby text-red-300 text-xs font-bold tracking-wider">
            <Compass className="w-4 h-4 text-brand-gold animate-spin-slow" />
            <span>{ANIME_HERO_BANNER.japaneseSubtitle} • THE GRAND LINE EXPERIENCE</span>
          </div>

          <h1 className="font-serif text-4xl sm:text-6xl lg:text-7xl font-black tracking-tight text-white leading-tight">
            {ANIME_HERO_BANNER.title}
          </h1>

          <p className="text-base sm:text-xl text-neutral-300 max-w-2xl mx-auto font-light leading-relaxed">
            {ANIME_HERO_BANNER.subtitle}
          </p>

          <div className="p-4 rounded-2xl bg-black/50 border border-brand-orange/30 max-w-xl mx-auto text-brand-gold italic font-serif text-sm">
            &quot;{ANIME_HERO_BANNER.quote}&quot; — <span className="font-sans font-bold text-brand-orange not-italic">{ANIME_HERO_BANNER.author}</span>
          </div>

          <div className="flex flex-wrap justify-center gap-4 pt-4">
            <a
              href="#specials"
              className="px-8 py-3.5 rounded-2xl bg-gradient-to-r from-brand-orange to-brand-ruby hover:opacity-90 text-white font-bold text-xs tracking-wider uppercase shadow-xl transition-all"
            >
              Explore Character Feasts
            </a>
            <Link
              href="/cart"
              className="px-6 py-3.5 rounded-2xl bg-brand-charcoal-light hover:bg-neutral-800 border border-neutral-700 text-white font-semibold text-xs tracking-wide transition-all"
            >
              Order to Table # or Home
            </Link>
          </div>
        </div>
      </section>

      {/* 2. Character Feasts & Signature Creations */}
      <section id="specials" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        <div className="text-center space-y-2 max-w-2xl mx-auto">
          <span className="text-xs font-mono font-bold uppercase tracking-widest text-brand-orange">
            Straw Hat Crew Specials
          </span>
          <h2 className="font-serif text-3xl sm:text-4xl font-bold text-white">
            Legendary Dishes Inspired by The Thousand Sunny Crew
          </h2>
          <p className="text-xs sm:text-sm text-neutral-400">
            Each feast is crafted with premium organic proteins, vibrant botanicals, and high-energy stamina boosters.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {ANIME_SPECIALS.map((dish) => (
            <div
              key={dish.id}
              className="bg-brand-charcoal-light rounded-3xl overflow-hidden border border-brand-orange/30 hover:border-brand-orange shadow-2xl transition-all duration-300 flex flex-col justify-between group"
            >
              {/* Image & Video Tag */}
              <div
                onClick={() => openDishModal(dish)}
                className="relative aspect-[4/3] bg-neutral-900 cursor-pointer overflow-hidden"
              >
                <Image
                  src={dish.image}
                  alt={dish.name}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-700"
                  sizes="(max-width: 768px) 100vw, 400px"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/30" />

                {/* Character Inspiration Pill */}
                <div className="absolute top-3 left-3 bg-brand-ruby/90 backdrop-blur-md text-white text-[10px] font-bold px-3 py-1 rounded-full shadow-md">
                  {dish.badge}
                </div>

                {dish.videoUrl && (
                  <div className="absolute bottom-3 left-3 bg-black/60 backdrop-blur-md px-2.5 py-1 rounded-full text-[10px] font-medium text-white flex items-center gap-1 group-hover:bg-brand-orange transition-colors">
                    <Play className="w-3 h-3 fill-white" />
                    <span>Prep Video</span>
                  </div>
                )}

                <div className="absolute bottom-3 right-3 bg-black/80 px-2.5 py-1 rounded-full text-xs font-bold text-brand-gold">
                  ₹{dish.price}
                </div>
              </div>

              {/* Content */}
              <div className="p-6 space-y-4 flex-1 flex flex-col justify-between">
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-[11px]">
                    <span className="font-mono text-brand-orange font-bold uppercase tracking-wider">
                      {dish.characterInspiration}
                    </span>
                    <span className="text-neutral-400 flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {dish.prepTime} mins
                    </span>
                  </div>

                  <h3
                    onClick={() => openDishModal(dish)}
                    className="font-serif font-bold text-xl text-white group-hover:text-brand-orange transition-colors cursor-pointer"
                  >
                    {dish.name}
                  </h3>

                  <p className="text-xs text-neutral-300 leading-relaxed line-clamp-3 font-light">
                    {dish.description}
                  </p>
                </div>

                <div className="pt-4 border-t border-neutral-800 space-y-3">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-[11px] text-brand-gold font-medium">
                      ★ {dish.specialPerk}
                    </span>
                    <span className="text-[11px] text-neutral-400">{dish.calories} kcal</span>
                  </div>

                  <button
                    onClick={() => openDishModal(dish)}
                    className="w-full py-2.5 px-4 rounded-xl bg-brand-orange hover:bg-brand-orange-hover text-white font-bold text-xs transition-all shadow-md flex items-center justify-center gap-2"
                  >
                    <span>Customize &amp; Order Feast • ₹{dish.price}</span>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 3. Pirate Berries Loyalty Program */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-gradient-to-br from-brand-charcoal-light to-neutral-900 rounded-3xl p-8 sm:p-14 border border-brand-gold/30 shadow-2xl grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          <div className="lg:col-span-8 space-y-4">
            <div className="inline-flex items-center gap-2 text-brand-gold font-bold text-xs uppercase tracking-wider">
              <Crown className="w-4 h-4 text-brand-gold" />
              <span>Straw Hat Bounty &amp; Loyalty Rewards</span>
            </div>
            <h2 className="font-serif text-3xl sm:text-4xl font-bold text-white">
              Earn Pirate Berries with Every Feast.
            </h2>
            <p className="text-xs sm:text-sm text-neutral-300 leading-relaxed font-light">
              Every order at URHD unlocks <strong className="text-brand-gold">Pirate Berries</strong> (1 Berry for every ₹20 spent).
              Climb the ranks from <em>Cabin Boy</em> to <em>Supernova</em> and crowned <em>Pirate King</em> to unlock secret off-menu tastings,
              complimentary artisanal coffees, and priority seating on the Anime Deck!
            </p>

            <div className="grid grid-cols-3 gap-4 pt-2">
              <div className="p-3 bg-black/40 rounded-xl border border-neutral-800 text-center">
                <div className="text-brand-gold font-serif font-black text-xl">100 B</div>
                <div className="text-[10px] text-neutral-400">Welcome Bounty on Signup</div>
              </div>
              <div className="p-3 bg-black/40 rounded-xl border border-neutral-800 text-center">
                <div className="text-brand-gold font-serif font-black text-xl">5% Back</div>
                <div className="text-[10px] text-neutral-400">Earned on all meals</div>
              </div>
              <div className="p-3 bg-black/40 rounded-xl border border-neutral-800 text-center">
                <div className="text-brand-gold font-serif font-black text-xl">Free Desserts</div>
                <div className="text-[10px] text-neutral-400">At Pirate King Tier</div>
              </div>
            </div>
          </div>

          <div className="lg:col-span-4 text-center p-6 bg-black/60 rounded-2xl border border-brand-orange/40 space-y-3">
            <Coins className="w-12 h-12 text-brand-gold mx-auto" />
            <h4 className="font-serif font-bold text-lg text-white">Check Your Bounty</h4>
            <p className="text-xs text-neutral-400">
              Sign in to view your current Pirate Berries balance and redeem discount codes.
            </p>
            <Link
              href="/profile"
              className="inline-block w-full py-2.5 rounded-xl bg-brand-orange hover:bg-brand-orange-hover text-white text-xs font-bold transition-all shadow-md"
            >
              View My Bounty Points
            </Link>
          </div>
        </div>
      </section>

      {/* Dish Modal */}
      {selectedDish && (
        <DishModal
          item={selectedDish}
          onClose={() => setSelectedDish(null)}
        />
      )}
    </div>
  );
}
