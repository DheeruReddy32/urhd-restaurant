'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { MenuItemData, CartItemCustomization } from '@/lib/types';
import { useCart } from '@/context/CartContext';
import {
  X,
  Play,
  Pause,
  Volume2,
  VolumeX,
  Flame,
  Clock,
  Sparkles,
  Check,
  Plus,
  Minus,
  Utensils,
  AlertCircle,
  Film,
} from 'lucide-react';

interface DishModalProps {
  item: MenuItemData | null;
  onClose: () => void;
  onAddedToCart?: () => void;
}

export default function DishModal({ item, onClose, onAddedToCart }: DishModalProps) {
  const { addToCart } = useCart();
  const [activeTab, setActiveTab] = useState<'details' | 'video'>('details');
  const [isPlaying, setIsPlaying] = useState(true);
  const [isMuted, setIsMuted] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [specialInstructions, setSpecialInstructions] = useState('');
  const [selectedCustomizations, setSelectedCustomizations] = useState<CartItemCustomization[]>([]);

  // Initialize default customization choices whenever item opens
  useEffect(() => {
    if (!item) return;
    setQuantity(1);
    setSpecialInstructions('');
    setActiveTab(item.videoUrl ? 'video' : 'details');

    const initialSelections: CartItemCustomization[] = [];
    if (item.customizations) {
      item.customizations.forEach((group) => {
        // Find default option or pick first if required
        const defaultOpt = group.options.find((o) => o.isDefault) || (group.isRequired ? group.options[0] : null);
        if (defaultOpt) {
          initialSelections.push({
            groupId: group.id,
            groupName: group.name,
            optionId: defaultOpt.id,
            optionName: defaultOpt.name,
            price: defaultOpt.price,
          });
        }
      });
    }
    setSelectedCustomizations(initialSelections);
  }, [item]);

  if (!item) return null;

  // Calculate dynamic line total
  const extraCostPerUnit = selectedCustomizations.reduce((acc, curr) => acc + curr.price, 0);
  const unitPrice = item.price + extraCostPerUnit;
  const totalPrice = unitPrice * quantity;

  // Handle radio / multi option selection
  const handleOptionToggle = (
    groupId: string,
    groupName: string,
    optionId: string,
    optionName: string,
    price: number,
    maxSelect: number
  ) => {
    setSelectedCustomizations((prev) => {
      // If single select (radio)
      if (maxSelect === 1) {
        const filtered = prev.filter((s) => s.groupId !== groupId);
        return [
          ...filtered,
          {
            groupId,
            groupName,
            optionId,
            optionName,
            price,
          },
        ];
      }

      // If multi-select checkbox
      const isAlreadySelected = prev.some((s) => s.groupId === groupId && s.optionId === optionId);
      if (isAlreadySelected) {
        return prev.filter((s) => !(s.groupId === groupId && s.optionId === optionId));
      } else {
        const groupSelectedCount = prev.filter((s) => s.groupId === groupId).length;
        if (groupSelectedCount >= maxSelect) {
          // Replace oldest selection in group
          const nonGroup = prev.filter((s) => s.groupId !== groupId);
          const groupOnly = prev.filter((s) => s.groupId === groupId).slice(1);
          return [
            ...nonGroup,
            ...groupOnly,
            { groupId, groupName, optionId, optionName, price },
          ];
        }
        return [...prev, { groupId, groupName, optionId, optionName, price }];
      }
    });
  };

  const handleAddToCart = () => {
    addToCart(item, quantity, selectedCustomizations, specialInstructions);
    if (onAddedToCart) onAddedToCart();
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/75 backdrop-blur-sm animate-fadeIn">
      <div className="relative w-full max-w-3xl bg-brand-offwhite rounded-3xl overflow-hidden shadow-2xl border border-brand-beige-dark max-h-[92vh] flex flex-col animate-scaleUp">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-30 p-2 rounded-full bg-brand-charcoal/70 text-white hover:bg-brand-charcoal transition-all shadow-md"
          aria-label="Close modal"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Media Header (Image or Video) */}
        <div className="relative w-full h-64 sm:h-72 bg-neutral-900 shrink-0">
          {activeTab === 'video' && item.videoUrl ? (
            <div className="relative w-full h-full">
              <video
                src={item.videoUrl}
                autoPlay
                loop
                muted={isMuted}
                playsInline
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-brand-charcoal/80 via-transparent to-black/30 pointer-events-none" />

              {/* Video Controls Overlay */}
              <div className="absolute bottom-3 left-4 right-4 flex items-center justify-between text-white text-xs">
                <div className="flex items-center gap-2 bg-black/50 px-2.5 py-1 rounded-full backdrop-blur-md">
                  <Film className="w-3.5 h-3.5 text-brand-orange" />
                  <span className="font-semibold">Live Chef Prep Reel</span>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setIsMuted(!isMuted)}
                    className="p-1.5 rounded-full bg-black/60 hover:bg-brand-orange transition-colors"
                  >
                    {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
                  </button>
                  <button
                    onClick={() => setActiveTab('details')}
                    className="px-2.5 py-1 rounded-full bg-black/60 hover:bg-brand-orange transition-colors font-medium text-[11px]"
                  >
                    View Photo
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <div className="relative w-full h-full">
              <Image
                src={item.imageUrl}
                alt={item.name}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 800px"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-brand-charcoal/80 via-transparent to-black/20" />

              {item.videoUrl && (
                <button
                  onClick={() => setActiveTab('video')}
                  className="absolute bottom-3 right-4 flex items-center gap-1.5 bg-brand-orange hover:bg-brand-orange-hover text-white px-3 py-1.5 rounded-full text-xs font-bold shadow-lg transition-all"
                >
                  <Play className="w-3.5 h-3.5 fill-white" />
                  <span>Watch Preparation</span>
                </button>
              )}
            </div>
          )}

          {/* Badges on Top Left */}
          <div className="absolute top-4 left-4 flex flex-wrap gap-2 z-20">
            <span
              className={`px-2.5 py-0.5 rounded-full text-xs font-bold shadow-sm ${
                item.isVeg ? 'bg-emerald-600 text-white' : 'bg-red-600 text-white'
              }`}
            >
              {item.isVeg ? '● Pure Veg' : '▲ Non-Veg'}
            </span>
            {item.isChefSpecial && (
              <span className="bg-brand-gold text-brand-charcoal px-2.5 py-0.5 rounded-full text-xs font-bold flex items-center gap-1 shadow-sm">
                <Sparkles className="w-3 h-3" />
                Chef&apos;s Signature
              </span>
            )}
            {item.isAnimeSpecial && (
              <span className="bg-brand-ruby text-white px-2.5 py-0.5 rounded-full text-xs font-bold flex items-center gap-1 shadow-sm">
                🏴‍☠️ {item.animeTheme || 'Grand Line Special'}
              </span>
            )}
          </div>
        </div>

        {/* Modal Scrollable Body */}
        <div className="p-5 sm:p-6 overflow-y-auto space-y-6 flex-1">
          {/* Title & Price Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-brand-beige-dark pb-4">
            <div>
              <h2 className="font-serif font-bold text-2xl text-brand-charcoal">{item.name}</h2>
              <div className="flex items-center gap-3 text-xs text-brand-grey-dark mt-1">
                <span>{item.cuisine}</span>
                <span>•</span>
                <span className="flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5 text-brand-orange" />
                  {item.prepTime} mins
                </span>
                <span>•</span>
                <span className="flex items-center gap-0.5">
                  {[...Array(item.spiceLevel)].map((_, idx) => (
                    <Flame key={idx} className="w-3.5 h-3.5 text-red-500 fill-red-500" />
                  ))}
                  {item.spiceLevel === 0 && 'Non-Spicy'}
                </span>
                {item.calories && (
                  <>
                    <span>•</span>
                    <span>{item.calories} kcal</span>
                  </>
                )}
              </div>
            </div>

            <div className="text-right">
              <div className="text-xs text-neutral-500">Base Price</div>
              <div className="text-2xl font-serif font-black text-brand-orange">
                ₹{item.price}
              </div>
            </div>
          </div>

          {/* Description & Ingredients */}
          <div>
            <p className="text-xs sm:text-sm text-neutral-700 leading-relaxed">
              {item.description}
            </p>

            <div className="mt-3 p-3 bg-brand-beige/50 rounded-xl border border-brand-beige-dark/50 text-xs">
              <span className="font-bold text-brand-charcoal block mb-0.5">
                Fresh Ingredients:
              </span>
              <span className="text-neutral-600">{item.ingredients}</span>
              {item.allergens && (
                <div className="mt-1.5 flex items-center gap-1 text-[11px] text-amber-800">
                  <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                  <span>Contains allergens: {item.allergens}</span>
                </div>
              )}
            </div>
          </div>

          {/* Customization Options Engine */}
          {item.customizations && item.customizations.length > 0 && (
            <div className="space-y-5 pt-2">
              <div className="flex items-center justify-between">
                <h3 className="font-serif font-bold text-base text-brand-charcoal flex items-center gap-2">
                  <Utensils className="w-4 h-4 text-brand-orange" />
                  Customize Your Dish
                </h3>
                <span className="text-[11px] text-neutral-500 font-medium">
                  Dynamic Real-time Total
                </span>
              </div>

              {item.customizations.map((group) => {
                const groupSelected = selectedCustomizations.filter(
                  (s) => s.groupId === group.id
                );

                return (
                  <div
                    key={group.id}
                    className="p-4 bg-white rounded-2xl border border-neutral-200 shadow-sm space-y-3"
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-semibold text-xs sm:text-sm text-brand-charcoal">
                        {group.name}
                      </span>
                      <span className="text-[10px] text-neutral-400 font-medium">
                        {group.maxSelect === 1 ? 'Choose 1' : `Choose up to ${group.maxSelect}`}
                        {group.isRequired && ' • Required'}
                      </span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {group.options.map((opt) => {
                        const isChosen = groupSelected.some((s) => s.optionId === opt.id);

                        return (
                          <button
                            key={opt.id}
                            type="button"
                            onClick={() =>
                              handleOptionToggle(
                                group.id,
                                group.name,
                                opt.id,
                                opt.name,
                                opt.price,
                                group.maxSelect
                              )
                            }
                            className={`p-3 rounded-xl text-left border flex items-center justify-between transition-all ${
                              isChosen
                                ? 'bg-brand-orange/5 border-brand-orange text-brand-charcoal font-semibold shadow-xs'
                                : 'bg-neutral-50/50 hover:bg-neutral-100 border-neutral-200 text-neutral-700'
                            }`}
                          >
                            <div className="flex items-center gap-2">
                              <div
                                className={`w-4 h-4 rounded-full border flex items-center justify-center transition-all ${
                                  isChosen
                                    ? 'bg-brand-orange border-brand-orange text-white'
                                    : 'border-neutral-300'
                                }`}
                              >
                                {isChosen && <Check className="w-2.5 h-2.5 stroke-[3]" />}
                              </div>
                              <span className="text-xs">{opt.name}</span>
                            </div>

                            <span className="text-xs font-mono font-medium text-brand-grey-dark">
                              {opt.price > 0 ? `+₹${opt.price}` : 'Free'}
                            </span>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* Special Cooking Instructions */}
          <div className="space-y-1.5">
            <label className="block text-xs font-bold text-brand-charcoal">
              Special Chef Instructions (Optional)
            </label>
            <input
              type="text"
              value={specialInstructions}
              onChange={(e) => setSpecialInstructions(e.target.value)}
              placeholder="e.g. Extra crispy, less salt, dressing on the side..."
              className="w-full px-3.5 py-2.5 rounded-xl border border-neutral-200 bg-white text-xs text-brand-charcoal placeholder-neutral-400 focus:outline-none focus:border-brand-orange"
            />
          </div>
        </div>

        {/* Modal Sticky Bottom Actions Bar */}
        <div className="p-4 sm:p-5 bg-white border-t border-brand-beige-dark shrink-0 flex flex-col sm:flex-row items-center justify-between gap-4">
          {/* Quantity Controls */}
          <div className="flex items-center justify-between sm:justify-start gap-4 w-full sm:w-auto">
            <div className="flex items-center border border-neutral-200 rounded-xl bg-neutral-50 p-1">
              <button
                type="button"
                onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                className="w-8 h-8 rounded-lg flex items-center justify-center text-neutral-600 hover:bg-white transition-colors"
                aria-label="Decrease quantity"
              >
                <Minus className="w-4 h-4" />
              </button>
              <span className="w-10 text-center font-bold text-sm text-brand-charcoal">
                {quantity}
              </span>
              <button
                type="button"
                onClick={() => setQuantity((q) => q + 1)}
                className="w-8 h-8 rounded-lg flex items-center justify-center text-neutral-600 hover:bg-white transition-colors"
                aria-label="Increase quantity"
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>

            <div className="text-right sm:text-left">
              <span className="text-[10px] text-neutral-400 uppercase tracking-wider block">
                Total Dish Amount
              </span>
              <span className="font-serif font-black text-xl text-brand-orange">
                ₹{Math.round(totalPrice)}
              </span>
            </div>
          </div>

          {/* Add to Order Button */}
          <button
            type="button"
            onClick={handleAddToCart}
            className="w-full sm:w-auto flex-1 max-w-xs py-3 px-6 rounded-xl bg-brand-orange hover:bg-brand-orange-hover text-white font-bold text-sm shadow-md hover:shadow-orange-glow transition-all flex items-center justify-center gap-2"
          >
            <Utensils className="w-4 h-4" />
            <span>Add to Cart • ₹{Math.round(totalPrice)}</span>
          </button>
        </div>
      </div>
    </div>
  );
}
