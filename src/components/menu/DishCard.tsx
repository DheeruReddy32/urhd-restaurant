'use client';

import React from 'react';
import Image from 'next/image';
import { MenuItemData } from '@/lib/types';
import { Clock, Flame, Play, Plus, Star, Sparkles, Utensils } from 'lucide-react';

interface DishCardProps {
  dish: MenuItemData;
  onSelect: (dish: MenuItemData) => void;
  onQuickAdd?: (dish: MenuItemData) => void;
}

export default function DishCard({ dish, onSelect, onQuickAdd }: DishCardProps) {
  return (
    <div className="group bg-white rounded-3xl overflow-hidden border border-brand-beige-dark/50 hover:border-brand-orange/40 shadow-rustic hover:shadow-rustic-lg transition-all duration-300 flex flex-col h-full relative">
      {/* Dish Image Container */}
      <div
        onClick={() => onSelect(dish)}
        className="relative w-full h-52 sm:h-56 bg-neutral-100 overflow-hidden cursor-pointer"
      >
        <Image
          src={dish.imageUrl}
          alt={dish.name}
          fill
          className="object-cover group-hover:scale-105 transition-transform duration-500"
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/20" />

        {/* Veg/Non-Veg & Specialty Badges */}
        <div className="absolute top-3 left-3 flex flex-wrap gap-1.5 z-10">
          <span
            className={`px-2 py-0.5 rounded-full text-[10px] font-bold shadow-sm ${
              dish.isVeg ? 'bg-emerald-600 text-white' : 'bg-red-600 text-white'
            }`}
          >
            {dish.isVeg ? '● Pure Veg' : '▲ Non-Veg'}
          </span>

          {dish.isChefSpecial && (
            <span className="bg-brand-gold text-brand-charcoal px-2 py-0.5 rounded-full text-[10px] font-bold flex items-center gap-0.5 shadow-sm">
              <Sparkles className="w-2.5 h-2.5" />
              Chef Special
            </span>
          )}

          {dish.isAnimeSpecial && (
            <span className="bg-brand-ruby text-white px-2 py-0.5 rounded-full text-[10px] font-bold shadow-sm">
              🏴‍☠️ {dish.animeTheme ? dish.animeTheme.split(' ')[0] : 'Grand Line'}
            </span>
          )}
        </div>

        {/* Video Preview Badge if videoUrl is present */}
        {dish.videoUrl && (
          <div className="absolute bottom-3 left-3 bg-black/60 backdrop-blur-md px-2.5 py-1 rounded-full text-[10px] font-medium text-white flex items-center gap-1 group-hover:bg-brand-orange transition-colors">
            <Play className="w-2.5 h-2.5 fill-white" />
            <span>Prep Video</span>
          </div>
        )}

        {/* Star Rating Badge */}
        <div className="absolute bottom-3 right-3 bg-white/90 backdrop-blur-md px-2 py-0.5 rounded-full text-[10px] font-bold text-brand-charcoal flex items-center gap-1 shadow-sm">
          <Star className="w-3 h-3 text-amber-500 fill-amber-500" />
          <span>{dish.rating.toFixed(1)}</span>
        </div>
      </div>

      {/* Content */}
      <div className="p-5 flex flex-col flex-1 justify-between space-y-3">
        <div className="space-y-1.5">
          <div className="flex items-center justify-between text-[11px] text-brand-grey-dark">
            <span className="font-semibold uppercase tracking-wider text-[10px] text-brand-orange">
              {dish.cuisine}
            </span>
            <div className="flex items-center gap-2">
              <span className="flex items-center gap-0.5">
                <Clock className="w-3 h-3 text-neutral-400" />
                {dish.prepTime}m
              </span>
              {dish.spiceLevel > 0 && (
                <span className="flex items-center">
                  {[...Array(dish.spiceLevel)].map((_, i) => (
                    <Flame key={i} className="w-3 h-3 text-red-500 fill-red-500 -ml-0.5" />
                  ))}
                </span>
              )}
            </div>
          </div>

          <h3
            onClick={() => onSelect(dish)}
            className="font-serif font-bold text-lg text-brand-charcoal hover:text-brand-orange transition-colors line-clamp-1 cursor-pointer"
          >
            {dish.name}
          </h3>

          <p className="text-xs text-neutral-600 line-clamp-2 leading-relaxed">
            {dish.description}
          </p>
        </div>

        {/* Price & Action Row */}
        <div className="pt-2 border-t border-brand-beige-dark/40 flex items-center justify-between">
          <div>
            <span className="text-[10px] text-neutral-400 uppercase tracking-wider block">Price</span>
            <span className="font-serif font-bold text-xl text-brand-charcoal">
              ₹{dish.price}
            </span>
          </div>

          <button
            onClick={() => onSelect(dish)}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-brand-beige/80 hover:bg-brand-orange hover:text-white text-brand-charcoal text-xs font-bold transition-all shadow-xs group/btn"
          >
            <Utensils className="w-3.5 h-3.5 text-brand-orange group-hover/btn:text-white transition-colors" />
            <span>Customize & Add</span>
          </button>
        </div>
      </div>
    </div>
  );
}
