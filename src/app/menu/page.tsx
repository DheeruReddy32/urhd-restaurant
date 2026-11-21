'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import {
  Search,
  SlidersHorizontal,
  Flame,
  Clock,
  Star,
  Sparkles,
  Compass,
  X,
  Filter,
  RefreshCw,
} from 'lucide-react';
import { MenuItemData } from '@/lib/types';
import DishCard from '@/components/menu/DishCard';
import DishModal from '@/components/menu/DishModal';
import { CATEGORIES } from '@/data/categoriesData';

function MenuPageContent() {
  const searchParams = useSearchParams();
  const initialCategory = searchParams.get('category') || 'all';

  const [items, setItems] = useState<MenuItemData[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedDish, setSelectedDish] = useState<MenuItemData | null>(null);

  // Filters State
  const [selectedCategory, setSelectedCategory] = useState<string>(initialCategory);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [vegFilter, setVegFilter] = useState<'all' | 'veg' | 'nonveg'>('all');
  const [maxPrice, setMaxPrice] = useState<number>(1000);
  const [spiceLevel, setSpiceLevel] = useState<number | null>(null);
  const [animeOnly, setAnimeOnly] = useState<boolean>(false);
  const [chefOnly, setChefOnly] = useState<boolean>(false);
  const [sortBy, setSortBy] = useState<string>('rating');
  const [filterDrawerOpen, setFilterDrawerOpen] = useState<boolean>(false);

  // Fetch Dishes based on filter changes
  useEffect(() => {
    setLoading(true);
    const params = new URLSearchParams();
    if (selectedCategory && selectedCategory !== 'all') {
      params.set('category', selectedCategory);
    }
    if (searchQuery.trim()) {
      params.set('search', searchQuery.trim());
    }
    if (vegFilter === 'veg') {
      params.set('veg', 'true');
    } else if (vegFilter === 'nonveg') {
      params.set('nonveg', 'true');
    }
    if (maxPrice < 1000) {
      params.set('maxPrice', String(maxPrice));
    }
    if (spiceLevel !== null) {
      params.set('spice', String(spiceLevel));
    }
    if (animeOnly) {
      params.set('anime', 'true');
    }
    if (chefOnly) {
      params.set('chef', 'true');
    }
    if (sortBy) {
      params.set('sortBy', sortBy);
    }

    fetch(`/api/menu?${params.toString()}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.items) {
          setItems(data.items);
        }
      })
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, [selectedCategory, searchQuery, vegFilter, maxPrice, spiceLevel, animeOnly, chefOnly, sortBy]);

  const resetFilters = () => {
    setSelectedCategory('all');
    setSearchQuery('');
    setVegFilter('all');
    setMaxPrice(1000);
    setSpiceLevel(null);
    setAnimeOnly(false);
    setChefOnly(false);
    setSortBy('rating');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header & Page Title */}
      <div className="space-y-3 text-center sm:text-left">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-brand-orange/10 text-brand-orange text-xs font-bold">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Real-time Interactive Menu with Live Customizer</span>
        </div>
        <h1 className="font-serif text-3xl sm:text-5xl font-bold text-brand-charcoal">
          The URHD Digital Menu
        </h1>
        <p className="text-xs sm:text-sm text-neutral-600 max-w-2xl leading-relaxed">
          Explore artisanal dishes crafted with wholesome ingredients, rich culinary traditions, and the
          exhilarating energy of the Grand Line. Click any dish to experience video preparation and customize ingredients.
        </p>
      </div>

      {/* Search & Quick Controls Bar */}
      <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4 bg-white p-4 rounded-3xl border border-brand-beige-dark/60 shadow-xs">
        {/* Search Input */}
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-neutral-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by dish name, cuisine, ingredients (e.g. Truffle, Biryani, Onigiri, Burrata)..."
            className="w-full pl-10 pr-4 py-2.5 rounded-2xl bg-neutral-50 border border-neutral-200 text-xs text-brand-charcoal placeholder-neutral-400 focus:outline-none focus:border-brand-orange transition-all"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-neutral-600"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Quick Filter Buttons & Sorting */}
        <div className="flex items-center flex-wrap gap-2">
          {/* Veg / Non-Veg Toggle */}
          <div className="flex items-center bg-neutral-100 p-1 rounded-2xl border border-neutral-200 text-xs">
            <button
              onClick={() => setVegFilter('all')}
              className={`px-3 py-1.5 rounded-xl font-medium transition-all ${
                vegFilter === 'all'
                  ? 'bg-white shadow-xs font-bold text-brand-charcoal'
                  : 'text-neutral-600 hover:text-brand-charcoal'
              }`}
            >
              All
            </button>
            <button
              onClick={() => setVegFilter('veg')}
              className={`px-3 py-1.5 rounded-xl font-medium transition-all flex items-center gap-1 ${
                vegFilter === 'veg'
                  ? 'bg-emerald-600 text-white font-bold shadow-xs'
                  : 'text-emerald-700 hover:text-emerald-800'
              }`}
            >
              <span>● Pure Veg</span>
            </button>
            <button
              onClick={() => setVegFilter('nonveg')}
              className={`px-3 py-1.5 rounded-xl font-medium transition-all flex items-center gap-1 ${
                vegFilter === 'nonveg'
                  ? 'bg-red-600 text-white font-bold shadow-xs'
                  : 'text-red-700 hover:text-red-800'
              }`}
            >
              <span>▲ Non-Veg</span>
            </button>
          </div>

          {/* Anime Specials Quick Filter */}
          <button
            onClick={() => setAnimeOnly(!animeOnly)}
            className={`px-3 py-2 rounded-2xl text-xs font-bold flex items-center gap-1.5 border transition-all ${
              animeOnly
                ? 'bg-brand-ruby text-white border-brand-ruby shadow-xs'
                : 'bg-neutral-50 hover:bg-neutral-100 border-neutral-200 text-brand-charcoal'
            }`}
          >
            <Compass className="w-3.5 h-3.5 text-brand-gold animate-spin-slow" />
            <span>Grand Line Specials</span>
          </button>

          {/* Sort By Dropdown */}
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="px-3 py-2 rounded-2xl bg-neutral-50 border border-neutral-200 text-xs font-semibold text-brand-charcoal focus:outline-none focus:border-brand-orange"
          >
            <option value="rating">Top Rated (Default)</option>
            <option value="price_asc">Price: Low to High</option>
            <option value="price_desc">Price: High to Low</option>
            <option value="prep_time">Fastest Prep Time</option>
          </select>

          {/* More Filters Toggle */}
          <button
            onClick={() => setFilterDrawerOpen(!filterDrawerOpen)}
            className={`p-2.5 rounded-2xl border transition-all ${
              filterDrawerOpen || spiceLevel !== null || maxPrice < 1000 || chefOnly
                ? 'bg-brand-orange text-white border-brand-orange shadow-sm'
                : 'bg-neutral-50 hover:bg-neutral-100 border-neutral-200 text-neutral-700'
            }`}
            title="Advanced Filters"
          >
            <SlidersHorizontal className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Advanced Filters Expandable Drawer */}
      {filterDrawerOpen && (
        <div className="bg-brand-beige/50 p-6 rounded-3xl border border-brand-beige-dark space-y-6 animate-fadeIn">
          <div className="flex items-center justify-between pb-3 border-b border-brand-beige-dark">
            <h3 className="font-serif font-bold text-base text-brand-charcoal flex items-center gap-2">
              <Filter className="w-4 h-4 text-brand-orange" />
              Advanced Taste &amp; Nutritional Filters
            </h3>
            <button
              onClick={resetFilters}
              className="text-xs text-brand-orange hover:underline font-semibold flex items-center gap-1"
            >
              <RefreshCw className="w-3 h-3" />
              Reset All
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {/* Price Slider */}
            <div className="space-y-2">
              <div className="flex justify-between text-xs font-bold text-brand-charcoal">
                <span>Maximum Price</span>
                <span className="font-mono text-brand-orange">₹{maxPrice}</span>
              </div>
              <input
                type="range"
                min="200"
                max="1000"
                step="50"
                value={maxPrice}
                onChange={(e) => setMaxPrice(parseInt(e.target.value))}
                className="w-full accent-brand-orange cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-neutral-400">
                <span>₹200</span>
                <span>₹600</span>
                <span>₹1000+</span>
              </div>
            </div>

            {/* Spice Level Selector */}
            <div className="space-y-2">
              <label className="block text-xs font-bold text-brand-charcoal">Spice Level</label>
              <div className="flex items-center gap-2">
                {[
                  { label: 'Any', value: null },
                  { label: 'Mild (0)', value: 0 },
                  { label: 'Medium (1)', value: 1 },
                  { label: 'Hot (2)', value: 2 },
                  { label: 'Fiery (3)', value: 3 },
                ].map((s) => (
                  <button
                    key={String(s.value)}
                    onClick={() => setSpiceLevel(s.value)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-medium border transition-all ${
                      spiceLevel === s.value
                        ? 'bg-brand-orange text-white border-brand-orange font-bold'
                        : 'bg-white border-neutral-200 text-neutral-700 hover:bg-neutral-100'
                    }`}
                  >
                    {s.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Chef Specials Toggle */}
            <div className="space-y-2">
              <label className="block text-xs font-bold text-brand-charcoal">Curated Highlights</label>
              <button
                onClick={() => setChefOnly(!chefOnly)}
                className={`w-full py-2 px-3 rounded-xl text-xs font-bold border transition-all flex items-center justify-center gap-2 ${
                  chefOnly
                    ? 'bg-brand-gold text-brand-charcoal border-brand-gold shadow-sm'
                    : 'bg-white border-neutral-200 text-neutral-700 hover:bg-neutral-100'
                }`}
              >
                <Sparkles className="w-3.5 h-3.5 text-brand-orange" />
                <span>Chef&apos;s Signature Only</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Category Horizontal Scrolling Rail */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
        <button
          onClick={() => setSelectedCategory('all')}
          className={`px-4 py-2.5 rounded-2xl text-xs font-bold shrink-0 transition-all ${
            selectedCategory === 'all'
              ? 'bg-brand-charcoal text-white shadow-md'
              : 'bg-white hover:bg-brand-beige border border-brand-beige-dark text-neutral-700'
          }`}
        >
          All Dishes ({items.length})
        </button>

        {CATEGORIES.map((cat) => (
          <button
            key={cat.id}
            onClick={() => setSelectedCategory(cat.id)}
            className={`px-4 py-2.5 rounded-2xl text-xs font-bold shrink-0 transition-all ${
              selectedCategory === cat.id
                ? 'bg-brand-orange text-white shadow-md scale-105'
                : 'bg-white hover:bg-brand-beige border border-brand-beige-dark text-neutral-700'
            }`}
          >
            {cat.name}
          </button>
        ))}
      </div>

      {/* Dishes Grid */}
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 pt-4">
          {[...Array(6)].map((_, i) => (
            <div
              key={i}
              className="bg-white rounded-3xl h-96 p-4 border border-neutral-100 shadow-xs animate-pulse space-y-4"
            >
              <div className="w-full h-52 bg-neutral-200 rounded-2xl" />
              <div className="h-4 bg-neutral-200 rounded w-3/4" />
              <div className="h-3 bg-neutral-200 rounded w-1/2" />
              <div className="h-8 bg-neutral-200 rounded-xl mt-6" />
            </div>
          ))}
        </div>
      ) : items.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 pt-2">
          {items.map((dish) => (
            <DishCard
              key={dish.id}
              dish={dish}
              onSelect={(d) => setSelectedDish(d)}
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-20 bg-white rounded-3xl border border-brand-beige-dark p-8 space-y-4">
          <div className="w-16 h-16 rounded-full bg-brand-beige mx-auto flex items-center justify-center text-brand-orange">
            <Search className="w-8 h-8" />
          </div>
          <h3 className="font-serif font-bold text-xl text-brand-charcoal">No dishes found</h3>
          <p className="text-xs text-neutral-500 max-w-sm mx-auto">
            We couldn&apos;t find any items matching your selected filters. Try resetting the filters or searching for something else.
          </p>
          <button
            onClick={resetFilters}
            className="px-5 py-2.5 rounded-xl bg-brand-orange text-white text-xs font-bold shadow-md hover:bg-brand-orange-hover transition-colors"
          >
            Reset Filters
          </button>
        </div>
      )}

      {/* Interactive Customization and Video Modal */}
      {selectedDish && (
        <DishModal
          item={selectedDish}
          onClose={() => setSelectedDish(null)}
        />
      )}
    </div>
  );
}

export default function MenuPage() {
  return (
    <Suspense
      fallback={
        <div className="max-w-7xl mx-auto px-4 py-20 text-center text-xs text-neutral-500">
          Loading digital menu...
        </div>
      }
    >
      <MenuPageContent />
    </Suspense>
  );
}
