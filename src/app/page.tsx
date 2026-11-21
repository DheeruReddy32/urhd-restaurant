'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import {
  Compass,
  ArrowRight,
  Sparkles,
  Utensils,
  Clock,
  Flame,
  Star,
  MapPin,
  Phone,
  Mail,
  CheckCircle2,
  Wifi,
  Coffee,
  BatteryCharging,
  Users,
  ChevronRight,
  ShieldCheck,
  Play,
  Award,
} from 'lucide-react';
import { MenuItemData } from '@/lib/types';
import DishModal from '@/components/menu/DishModal';
import { ANIME_SPECIALS, PIRATE_QUOTES } from '@/data/animeData';
import { CATEGORIES } from '@/data/categoriesData';

export default function HomePage() {
  const [featuredDishes, setFeaturedDishes] = useState<MenuItemData[]>([]);
  const [selectedDish, setSelectedDish] = useState<MenuItemData | null>(null);
  const [activeCategoryTab, setActiveCategoryTab] = useState<string>('all');
  const [activeQuoteIndex, setActiveQuoteIndex] = useState(0);

  // Fetch featured dishes
  useEffect(() => {
    fetch('/api/menu?chef=true')
      .then((res) => res.json())
      .then((data) => {
        if (data.items) setFeaturedDishes(data.items);
      })
      .catch((err) => console.error(err));
  }, []);

  // Rotate pirate quotes
  useEffect(() => {
    const interval = setInterval(() => {
      setActiveQuoteIndex((prev) => (prev + 1) % PIRATE_QUOTES.length);
    }, 6000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="space-y-24 sm:space-y-32 pb-20 overflow-hidden">
      {/* 1. HERO SECTION */}
      <section className="relative min-h-[92vh] flex items-center justify-center pt-8 pb-16 px-4 sm:px-6 lg:px-8 overflow-hidden rustic-pattern">
        {/* Ambient Gradient Glows */}
        <div className="absolute top-10 left-1/2 -translate-x-1/2 w-[700px] h-[400px] bg-gradient-to-tr from-brand-orange/20 via-brand-beige/50 to-brand-gold/15 blur-[120px] rounded-full pointer-events-none -z-10" />

        <div className="max-w-7xl mx-auto w-full grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Hero Left Content */}
          <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
            {/* Pill Badge */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-brand-beige border border-brand-orange/30 text-brand-charcoal text-xs font-semibold shadow-xs">
              <span className="w-2 h-2 rounded-full bg-brand-orange animate-ping" />
              <span>Café • Healthy Dining • One Piece Anime Deck • Workspace</span>
            </div>

            <div className="space-y-2">
              <h1 className="font-serif text-4xl sm:text-6xl lg:text-7xl font-bold tracking-tight text-brand-charcoal leading-[1.08]">
                Where <span className="italic font-normal text-brand-orange">Rustic Tradition</span> Meets Healthy Luxury.
              </h1>
              <p className="font-mono text-xs uppercase tracking-widest text-brand-grey-dark font-medium pt-1">
                Unified Rustic Health Delights — Indiranagar, Bangalore
              </p>
            </div>

            <p className="text-base sm:text-lg text-neutral-600 max-w-xl mx-auto lg:mx-0 leading-relaxed font-light">
              Experience artisanal woodfired dining, nutrient-dense superfood bowls, single-origin brews,
              and the legendary energy of <strong className="text-brand-charcoal font-semibold">The Grand Line Anime Deck</strong> alongside a quiet executive workspace.
            </p>

            {/* Hero CTA Buttons */}
            <div className="flex flex-wrap items-center justify-center lg:justify-start gap-3.5 pt-2">
              <Link
                href="/menu"
                className="px-7 py-4 rounded-2xl bg-brand-orange hover:bg-brand-orange-hover text-white font-bold text-sm shadow-rustic-lg hover:shadow-orange-glow transition-all flex items-center gap-2 group"
              >
                <span>Explore Digital Menu</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>

              <Link
                href="/cart"
                className="px-6 py-4 rounded-2xl bg-brand-charcoal hover:bg-neutral-800 text-white font-semibold text-sm transition-all shadow-md flex items-center gap-2"
              >
                <Utensils className="w-4 h-4 text-brand-orange" />
                <span>Order Online / Table</span>
              </Link>

              <Link
                href="/workspace"
                className="px-6 py-4 rounded-2xl bg-white hover:bg-brand-beige border border-brand-beige-dark text-brand-charcoal font-semibold text-sm transition-all flex items-center gap-2"
              >
                <Coffee className="w-4 h-4 text-brand-orange" />
                <span>Book Workspace</span>
              </Link>
            </div>

            {/* Quick Metrics Bar */}
            <div className="pt-6 grid grid-cols-3 gap-4 border-t border-brand-beige-dark/60 max-w-lg mx-auto lg:mx-0 text-center lg:text-left">
              <div>
                <div className="font-serif font-black text-2xl text-brand-charcoal">100%</div>
                <div className="text-[11px] text-neutral-500 font-medium">Organic & Whole Foods</div>
              </div>
              <div>
                <div className="font-serif font-black text-2xl text-brand-orange">4.9 ★</div>
                <div className="text-[11px] text-neutral-500 font-medium">Over 2,400+ Reviews</div>
              </div>
              <div>
                <div className="font-serif font-black text-2xl text-brand-charcoal">500 Mbps</div>
                <div className="text-[11px] text-neutral-500 font-medium">Silent Fiber Coworking</div>
              </div>
            </div>
          </div>

          {/* Hero Right Visuals Carousel */}
          <div className="lg:col-span-5 relative">
            <div className="relative mx-auto w-full max-w-md aspect-[4/5] rounded-3xl overflow-hidden shadow-2xl border-4 border-white">
              <Image
                src="https://images.unsplash.com/photo-1544025162-d76694265947?q=80&w=1000&auto=format&fit=crop"
                alt="Luffy's Gigant Roasted Meat Platter at URHD"
                fill
                priority
                className="object-cover hover:scale-105 transition-transform duration-700"
                sizes="(max-width: 1024px) 100vw, 500px"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

              {/* Floating Chef Highlight Card */}
              <div className="absolute top-4 right-4 bg-white/95 backdrop-blur-md px-3.5 py-2 rounded-2xl shadow-lg border border-neutral-200 flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
                <span className="text-xs font-bold text-brand-charcoal">Kitchen Live Now</span>
              </div>

              {/* Floating Bottom Card */}
              <div className="absolute bottom-6 left-6 right-6 p-4 rounded-2xl bg-brand-charcoal/90 backdrop-blur-md border border-white/20 text-white space-y-1.5">
                <div className="flex items-center justify-between text-xs text-brand-gold font-bold">
                  <span className="flex items-center gap-1">
                    <Sparkles className="w-3.5 h-3.5 text-brand-orange" />
                    Grand Line Signature
                  </span>
                  <span>₹890</span>
                </div>
                <h4 className="font-serif font-bold text-lg">Luffy&apos;s Gigant Bone-in Roast</h4>
                <p className="text-[11px] text-neutral-300 line-clamp-1">
                  Smoked prime roast glazed with Gear 5 paprika BBQ &amp; charred sweet corn.
                </p>
                <div className="pt-1 flex items-center justify-between">
                  <span className="text-[10px] text-emerald-400 font-medium">● Free Baratie bread basket</span>
                  <Link
                    href="/menu"
                    className="text-xs font-bold text-brand-orange hover:underline flex items-center gap-1"
                  >
                    Order Dish →
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. OUR STORY & PHILOSOPHY */}
      <section id="story" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-brand-beige/60 rounded-3xl p-8 sm:p-14 border border-brand-beige-dark/60 grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          <div className="lg:col-span-6 space-y-5">
            <span className="text-xs font-bold uppercase tracking-widest text-brand-orange">
              Our Culinary Philosophy
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl font-bold text-brand-charcoal">
              A Haven Crafted for Modern Souls, Dreamers, and Food Aficionados.
            </h2>
            <p className="text-sm text-neutral-700 leading-relaxed">
              At URHD (Unified Rustic Health Delights), we set out to dissolve the boundary between
              healthy nourishment and deep, soul-satisfying flavor. We believe nobody should have to choose
              between eating wholesome, clean food and having an unforgettable dining experience.
            </p>
            <p className="text-sm text-neutral-700 leading-relaxed">
              Our kitchen bridges authentic Indian heritage techniques with European woodfired traditions,
              Japanese precision, and the boundless passion of the anime world. Whether you are fueling your
              deep-work sprints at our quiet workstations or gathering with friends over Luffy&apos;s giant meat
              platter, URHD is your home.
            </p>

            <div className="grid grid-cols-2 gap-4 pt-2">
              <div className="flex items-start gap-2.5">
                <CheckCircle2 className="w-5 h-5 text-brand-orange shrink-0 mt-0.5" />
                <span className="text-xs text-brand-charcoal font-semibold">Zero Refined Sugars in Artisan Bowls</span>
              </div>
              <div className="flex items-start gap-2.5">
                <CheckCircle2 className="w-5 h-5 text-brand-orange shrink-0 mt-0.5" />
                <span className="text-xs text-brand-charcoal font-semibold">48-Hr Slow Fermented Sourdough</span>
              </div>
              <div className="flex items-start gap-2.5">
                <CheckCircle2 className="w-5 h-5 text-brand-orange shrink-0 mt-0.5" />
                <span className="text-xs text-brand-charcoal font-semibold">Single-Origin Chikmagalur Estate Coffee</span>
              </div>
              <div className="flex items-start gap-2.5">
                <CheckCircle2 className="w-5 h-5 text-brand-orange shrink-0 mt-0.5" />
                <span className="text-xs text-brand-charcoal font-semibold">Dedicated Ergonomic Coworking Pods</span>
              </div>
            </div>
          </div>

          <div className="lg:col-span-6 grid grid-cols-2 gap-4">
            <div className="relative aspect-[3/4] rounded-2xl overflow-hidden shadow-md">
              <Image
                src="https://images.unsplash.com/photo-1554118811-1e0d58224f24?q=80&w=600&auto=format&fit=crop"
                alt="Rustic Cafe Ambiance at URHD"
                fill
                className="object-cover"
                sizes="(max-width: 768px) 50vw, 300px"
              />
            </div>
            <div className="relative aspect-[3/4] rounded-2xl overflow-hidden shadow-md mt-6">
              <Image
                src="https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?q=80&w=600&auto=format&fit=crop"
                alt="Artisanal Spanish Cortado Brew"
                fill
                className="object-cover"
                sizes="(max-width: 768px) 50vw, 300px"
              />
            </div>
          </div>
        </div>
      </section>

      {/* 3. POPULAR CATEGORIES DISCOVERY */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="text-center space-y-2 max-w-2xl mx-auto">
          <span className="text-xs font-bold uppercase tracking-widest text-brand-orange">
            Explore the Menu
          </span>
          <h2 className="font-serif text-3xl sm:text-4xl font-bold text-brand-charcoal">
            Crafted for Every Palate
          </h2>
          <p className="text-xs sm:text-sm text-neutral-600">
            From energizing healthy bowls to anime-inspired celebratory feasts and single-origin coffee.
          </p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
          {CATEGORIES.slice(0, 8).map((cat) => (
            <Link
              key={cat.id}
              href={`/menu?category=${cat.id}`}
              className="p-5 rounded-3xl bg-white hover:bg-brand-orange/5 border border-brand-beige-dark/50 hover:border-brand-orange shadow-xs hover:shadow-rustic transition-all group flex flex-col justify-between"
            >
              <div className="space-y-3">
                <div className="w-12 h-12 rounded-2xl bg-brand-beige flex items-center justify-center text-brand-orange group-hover:bg-brand-orange group-hover:text-white transition-colors">
                  <Utensils className="w-6 h-6" />
                </div>
                <h3 className="font-serif font-bold text-base text-brand-charcoal group-hover:text-brand-orange transition-colors">
                  {cat.name}
                </h3>
                <p className="text-xs text-neutral-500 line-clamp-2 leading-relaxed">
                  {cat.description}
                </p>
              </div>

              <div className="pt-4 flex items-center justify-between text-xs font-semibold text-brand-orange">
                <span>Browse Category</span>
                <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* 4. CHEF'S RECOMMENDATIONS (FEATURED DISHES) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div className="space-y-1">
            <span className="text-xs font-bold uppercase tracking-widest text-brand-orange">
              Curated by Chef Vikramaditya &amp; Sanji
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl font-bold text-brand-charcoal">
              Chef&apos;s Signature Recommendations
            </h2>
            <p className="text-xs sm:text-sm text-neutral-600">
              Each dish features short video preparation reels, high nutritional value, and custom options.
            </p>
          </div>

          <Link
            href="/menu"
            className="inline-flex items-center gap-1.5 text-xs font-bold text-brand-orange hover:underline self-start sm:self-auto"
          >
            <span>View All 30+ Dishes</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {/* Dishes Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {featuredDishes.slice(0, 6).map((dish) => (
            <div
              key={dish.id}
              className="bg-white rounded-3xl overflow-hidden border border-brand-beige-dark/60 shadow-rustic hover:shadow-rustic-lg transition-all group flex flex-col justify-between"
            >
              {/* Image & Video Button */}
              <div
                onClick={() => setSelectedDish(dish)}
                className="relative w-full h-56 bg-neutral-100 cursor-pointer overflow-hidden"
              >
                <Image
                  src={dish.imageUrl}
                  alt={dish.name}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                  sizes="(max-width: 768px) 100vw, 400px"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/20" />

                <div className="absolute top-3 left-3 flex gap-1.5">
                  <span
                    className={`px-2 py-0.5 rounded-full text-[10px] font-bold text-white ${
                      dish.isVeg ? 'bg-emerald-600' : 'bg-red-600'
                    }`}
                  >
                    {dish.isVeg ? '● Pure Veg' : '▲ Non-Veg'}
                  </span>
                  {dish.isAnimeSpecial && (
                    <span className="bg-brand-ruby text-white px-2 py-0.5 rounded-full text-[10px] font-bold">
                      🏴‍☠️ Anime Special
                    </span>
                  )}
                </div>

                {dish.videoUrl && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedDish(dish);
                    }}
                    className="absolute bottom-3 left-3 bg-black/60 backdrop-blur-md px-2.5 py-1 rounded-full text-[10px] font-medium text-white flex items-center gap-1 hover:bg-brand-orange transition-colors"
                  >
                    <Play className="w-3 h-3 fill-white" />
                    <span>Prep Video</span>
                  </button>
                )}

                <div className="absolute bottom-3 right-3 bg-white/90 px-2 py-0.5 rounded-full text-[10px] font-bold text-brand-charcoal flex items-center gap-1 shadow-sm">
                  <Star className="w-3 h-3 text-amber-500 fill-amber-500" />
                  <span>{dish.rating.toFixed(1)}</span>
                </div>
              </div>

              {/* Body */}
              <div className="p-5 space-y-3 flex-1 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between text-[11px] text-neutral-500 mb-1">
                    <span className="font-semibold text-brand-orange uppercase">{dish.cuisine}</span>
                    <span className="flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {dish.prepTime} mins
                    </span>
                  </div>
                  <h3
                    onClick={() => setSelectedDish(dish)}
                    className="font-serif font-bold text-lg text-brand-charcoal hover:text-brand-orange transition-colors line-clamp-1 cursor-pointer"
                  >
                    {dish.name}
                  </h3>
                  <p className="text-xs text-neutral-600 line-clamp-2 leading-relaxed mt-1">
                    {dish.description}
                  </p>
                </div>

                <div className="pt-3 border-t border-brand-beige-dark/40 flex items-center justify-between">
                  <div>
                    <span className="text-[10px] text-neutral-400 block">Price</span>
                    <span className="font-serif font-bold text-xl text-brand-charcoal">
                      ₹{dish.price}
                    </span>
                  </div>

                  <button
                    onClick={() => setSelectedDish(dish)}
                    className="px-4 py-2 rounded-xl bg-brand-orange hover:bg-brand-orange-hover text-white text-xs font-bold transition-all shadow-xs flex items-center gap-1.5"
                  >
                    <Utensils className="w-3.5 h-3.5" />
                    <span>Customize &amp; Order</span>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 5. THE GRAND LINE CAFÉ EXPERIENCE (ONE PIECE ANIME SHOWCASE) */}
      <section className="relative bg-brand-charcoal text-white py-20 px-4 sm:px-6 lg:px-8 overflow-hidden rounded-3xl mx-4 sm:mx-8 border border-brand-orange/30 shadow-2xl">
        <div className="max-w-7xl mx-auto relative z-10 space-y-12">
          {/* Header */}
          <div className="text-center space-y-3 max-w-3xl mx-auto">
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-brand-ruby/30 border border-brand-ruby text-red-300 text-xs font-bold">
              <Compass className="w-3.5 h-3.5 animate-spin-slow text-brand-gold" />
              <span>偉大なる航路カフェ • THE GRAND LINE EXPERIENCE</span>
            </div>

            <h2 className="font-serif text-3xl sm:text-5xl font-extrabold tracking-tight text-white">
              Feast Like a Pirate King.
            </h2>
            <p className="text-sm sm:text-base text-neutral-300 leading-relaxed font-light">
              Step onto the Straw Hat deck at URHD. Original pirate adventure inspired culinary creations,
              character-themed power bowls, giant bone roasts, and the unbreakable bond of camaraderie.
            </p>
          </div>

          {/* Pirate Specials Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {ANIME_SPECIALS.slice(0, 3).map((item) => (
              <div
                key={item.id}
                className="bg-brand-charcoal-light/70 border border-brand-orange/20 rounded-3xl overflow-hidden hover:border-brand-orange transition-all p-5 flex flex-col justify-between space-y-4"
              >
                <div className="relative aspect-[4/3] rounded-2xl overflow-hidden">
                  <Image
                    src={item.image}
                    alt={item.name}
                    fill
                    className="object-cover hover:scale-105 transition-transform duration-500"
                    sizes="(max-width: 768px) 100vw, 350px"
                  />
                  <div className="absolute top-3 left-3 bg-brand-ruby text-white text-[10px] font-bold px-2.5 py-0.5 rounded-full shadow-sm">
                    {item.badge}
                  </div>
                  <div className="absolute bottom-3 right-3 bg-black/75 px-2 py-0.5 rounded-full text-xs font-bold text-brand-gold">
                    ₹{item.price}
                  </div>
                </div>

                <div className="space-y-1.5">
                  <div className="text-[10px] font-mono text-brand-orange font-bold uppercase tracking-wider">
                    {item.characterInspiration}
                  </div>
                  <h3 className="font-serif font-bold text-lg text-white">{item.name}</h3>
                  <p className="text-xs text-neutral-400 line-clamp-2 leading-relaxed">
                    {item.description}
                  </p>
                </div>

                <div className="pt-2 border-t border-neutral-800 flex items-center justify-between">
                  <span className="text-[10px] text-brand-gold font-semibold">
                    {item.specialPerk}
                  </span>
                  <Link
                    href="/anime"
                    className="text-xs font-bold text-brand-orange hover:underline flex items-center gap-1"
                  >
                    <span>Grand Line View</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            ))}
          </div>

          {/* Interactive Pirate Quotes Banner */}
          <div className="p-6 rounded-2xl bg-black/40 border border-brand-orange/30 text-center max-w-2xl mx-auto space-y-2">
            <p className="italic text-sm sm:text-base text-brand-beige font-serif">
              &quot;{PIRATE_QUOTES[activeQuoteIndex].quote}&quot;
            </p>
            <div className="text-xs text-brand-orange font-semibold">
              — {PIRATE_QUOTES[activeQuoteIndex].character} ({PIRATE_QUOTES[activeQuoteIndex].role})
            </div>
          </div>

          {/* Explore Grand Line Button */}
          <div className="text-center pt-2">
            <Link
              href="/anime"
              className="inline-flex items-center gap-2 px-8 py-4 rounded-2xl bg-gradient-to-r from-brand-orange to-brand-ruby hover:opacity-90 text-white font-bold text-sm shadow-xl transition-all"
            >
              <Compass className="w-4 h-4 animate-spin-slow" />
              <span>Explore The Full Grand Line Café Deck</span>
            </Link>
          </div>
        </div>
      </section>

      {/* 6. CORPORATE WORKSPACE – WORK, EAT & RELAX */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          <div className="lg:col-span-6 space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 border border-blue-200 text-blue-700 text-xs font-semibold">
              <Users className="w-3.5 h-3.5" />
              <span>Executive Workspace &amp; Meeting Rooms</span>
            </div>

            <h2 className="font-serif text-3xl sm:text-4xl font-bold text-brand-charcoal leading-tight">
              Work, Eat &amp; Relax: Your Productive Oasis in Bangalore.
            </h2>

            <p className="text-sm text-neutral-600 leading-relaxed font-light">
              Tired of noisy cafés with erratic Wi-Fi and hard seating? URHD features an acoustically buffered
              corporate workspace zone designed for engineers, founders, creators, and teams. Enjoy ultra-fast
              fiber Wi-Fi, Herman Miller style seating, power sockets at every desk, and seamless food service delivered
              right to your seat without disrupting your flow.
            </p>

            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 rounded-2xl bg-white border border-neutral-200 shadow-xs space-y-1">
                <Wifi className="w-5 h-5 text-brand-orange" />
                <h4 className="font-bold text-xs text-brand-charcoal">500 Mbps Fiber</h4>
                <p className="text-[11px] text-neutral-500">Uninterrupted dual-band optical Wi-Fi</p>
              </div>

              <div className="p-4 rounded-2xl bg-white border border-neutral-200 shadow-xs space-y-1">
                <Coffee className="w-5 h-5 text-brand-orange" />
                <h4 className="font-bold text-xs text-brand-charcoal">Artisanal Brews</h4>
                <p className="text-[11px] text-neutral-500">Continuous coffee &amp; tea service</p>
              </div>

              <div className="p-4 rounded-2xl bg-white border border-neutral-200 shadow-xs space-y-1">
                <BatteryCharging className="w-5 h-5 text-brand-orange" />
                <h4 className="font-bold text-xs text-brand-charcoal">Power at Every Desk</h4>
                <p className="text-[11px] text-neutral-500">Universal AC &amp; USB-C fast charging</p>
              </div>

              <div className="p-4 rounded-2xl bg-white border border-neutral-200 shadow-xs space-y-1">
                <Users className="w-5 h-5 text-brand-orange" />
                <h4 className="font-bold text-xs text-brand-charcoal">Boardroom for 8</h4>
                <p className="text-[11px] text-neutral-500">4K screen &amp; conference camera</p>
              </div>
            </div>

            <div className="pt-2">
              <Link
                href="/workspace"
                className="inline-flex items-center gap-2 px-6 py-3.5 rounded-2xl bg-brand-charcoal hover:bg-neutral-800 text-white font-bold text-xs transition-all shadow-md"
              >
                <span>Reserve a Work Desk from ₹150/hr</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>

          <div className="lg:col-span-6 relative">
            <div className="aspect-[4/3] rounded-3xl overflow-hidden shadow-2xl border-4 border-white relative">
              <Image
                src="https://images.unsplash.com/photo-1527192491265-7e15c55b1ed2?q=80&w=800&auto=format&fit=crop"
                alt="Corporate Workspace at URHD"
                fill
                className="object-cover"
                sizes="(max-width: 1024px) 100vw, 600px"
              />
            </div>
          </div>
        </div>
      </section>

      {/* 7. CUSTOMER REVIEWS & COMMUNITY LOVE */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="text-center space-y-2 max-w-xl mx-auto">
          <span className="text-xs font-bold uppercase tracking-widest text-brand-orange">
            Community Voices
          </span>
          <h2 className="font-serif text-3xl sm:text-4xl font-bold text-brand-charcoal">
            Loved by Foodies, Creators &amp; Anime Fans
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-6 rounded-3xl bg-white border border-brand-beige-dark/60 shadow-rustic space-y-4">
            <div className="flex items-center gap-1 text-amber-500">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-4 h-4 fill-amber-500" />
              ))}
            </div>
            <p className="text-xs text-neutral-700 italic leading-relaxed">
              &quot;The truffle burger with the brioche bun was easily the best burger I&apos;ve had in Bangalore.
              And when I saw the Gear 5 meat platter served on a literal bone, my inner One Piece fan screamed. 10/10!&quot;
            </p>
            <div className="pt-2 border-t border-neutral-100 flex items-center justify-between">
              <div>
                <span className="font-bold text-xs text-brand-charcoal block">Rohan Mehra</span>
                <span className="text-[10px] text-neutral-400">Software Architect &amp; Anime Enthusiast</span>
              </div>
              <span className="text-[10px] text-emerald-600 font-semibold bg-emerald-50 px-2 py-0.5 rounded">
                Verified Dine-In
              </span>
            </div>
          </div>

          <div className="p-6 rounded-3xl bg-white border border-brand-beige-dark/60 shadow-rustic space-y-4">
            <div className="flex items-center gap-1 text-amber-500">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-4 h-4 fill-amber-500" />
              ))}
            </div>
            <p className="text-xs text-neutral-700 italic leading-relaxed">
              &quot;I booked the Half-Day Sprint workspace pass. The high-speed internet never flinched during my
              client video calls, and the Spanish Saffron Cortado with the nourish bowl kept me energized all day.&quot;
            </p>
            <div className="pt-2 border-t border-neutral-100 flex items-center justify-between">
              <div>
                <span className="font-bold text-xs text-brand-charcoal block">Priya Nambiar</span>
                <span className="text-[10px] text-neutral-400">Product Designer @ Fintech</span>
              </div>
              <span className="text-[10px] text-blue-600 font-semibold bg-blue-50 px-2 py-0.5 rounded">
                Workspace Member
              </span>
            </div>
          </div>

          <div className="p-6 rounded-3xl bg-white border border-brand-beige-dark/60 shadow-rustic space-y-4">
            <div className="flex items-center gap-1 text-amber-500">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-4 h-4 fill-amber-500" />
              ))}
            </div>
            <p className="text-xs text-neutral-700 italic leading-relaxed">
              &quot;Ordering from the table via QR code was instantaneous. Our food arrived in 14 minutes, piping hot,
              and exactly customized with our preferred sauces and spice levels. Exceptional hospitality!&quot;
            </p>
            <div className="pt-2 border-t border-neutral-100 flex items-center justify-between">
              <div>
                <span className="font-bold text-xs text-brand-charcoal block">Dr. Karthik Rao</span>
                <span className="text-[10px] text-neutral-400">Bangalore University</span>
              </div>
              <span className="text-[10px] text-emerald-600 font-semibold bg-emerald-50 px-2 py-0.5 rounded">
                Table #4 Guest
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* 8. VISIT & RESERVATION CALL-TO-ACTION */}
      <section id="contact" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-brand-charcoal text-white rounded-3xl p-8 sm:p-14 border border-brand-orange/30 shadow-2xl grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          <div className="lg:col-span-7 space-y-4">
            <span className="text-xs font-bold uppercase tracking-widest text-brand-orange">
              Reservations &amp; Delivery
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl font-bold">
              Ready to Taste the Luxury of Rustic Tradition?
            </h2>
            <p className="text-xs sm:text-sm text-neutral-300 leading-relaxed max-w-lg">
              Visit us in the heart of Indiranagar, order home delivery with live real-time tracking,
              or scan your table QR code for instant kitchen ordering.
            </p>

            <div className="flex flex-wrap gap-3 pt-2">
              <Link
                href="/menu"
                className="px-6 py-3.5 rounded-xl bg-brand-orange hover:bg-brand-orange-hover text-white text-xs font-bold transition-all shadow-md"
              >
                Order Online Now
              </Link>
              <Link
                href="/workspace"
                className="px-6 py-3.5 rounded-xl bg-brand-charcoal-light hover:bg-neutral-800 text-white border border-neutral-700 text-xs font-semibold transition-all"
              >
                Book Workspace Pass
              </Link>
              <a
                href="https://wa.me/919876543210"
                target="_blank"
                rel="noreferrer"
                className="px-6 py-3.5 rounded-xl bg-emerald-700 hover:bg-emerald-600 text-white text-xs font-semibold transition-all"
              >
                WhatsApp Concierge
              </a>
            </div>
          </div>

          <div className="lg:col-span-5 p-6 rounded-2xl bg-brand-charcoal-light/70 border border-neutral-700 space-y-3 text-xs text-neutral-300">
            <h4 className="font-serif font-bold text-base text-white">Location &amp; Hours</h4>
            <div className="flex items-start gap-2">
              <MapPin className="w-4 h-4 text-brand-orange shrink-0 mt-0.5" />
              <span>#402, 100ft Road, Indiranagar, Bangalore 560038</span>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-brand-orange shrink-0" />
              <span>Monday – Sunday: 8:00 AM – 11:30 PM</span>
            </div>
            <div className="flex items-center gap-2">
              <Phone className="w-4 h-4 text-brand-orange shrink-0" />
              <span>+91 98765 43210</span>
            </div>
            <div className="flex items-center gap-2">
              <Mail className="w-4 h-4 text-brand-orange shrink-0" />
              <span>concierge@urhd.com</span>
            </div>
          </div>
        </div>
      </section>

      {/* Interactive Food Customization & Video Modal */}
      {selectedDish && (
        <DishModal
          item={selectedDish}
          onClose={() => setSelectedDish(null)}
          onAddedToCart={() => {
            // Can show a toast or feedback
          }}
        />
      )}
    </div>
  );
}
