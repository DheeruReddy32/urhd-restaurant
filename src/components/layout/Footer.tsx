'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  MapPin,
  Phone,
  Mail,
  Clock,
  Compass,
  Sparkles,
  Instagram,
  Twitter,
  Youtube,
  Send,
  Heart,
} from 'lucide-react';

export default function Footer() {
  const [newsletterEmail, setNewsletterEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (newsletterEmail) {
      setSubscribed(true);
      setNewsletterEmail('');
    }
  };

  return (
    <footer className="bg-brand-charcoal text-brand-beige-light border-t border-brand-charcoal-light relative overflow-hidden">
      {/* Subtle background glow */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-brand-orange/5 rounded-full blur-3xl pointer-events-none" />

      {/* Main Footer Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-12 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10">
          {/* Brand Info */}
          <div className="lg:col-span-2 space-y-4">
            <Link href="/" className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-brand-orange to-brand-orange-dark flex items-center justify-center text-white font-serif font-black text-xl shadow-md">
                U
              </div>
              <div className="flex flex-col">
                <span className="font-serif font-bold text-2xl tracking-tight text-white">
                  URHD
                </span>
                <span className="text-[10px] tracking-widest uppercase font-semibold text-brand-orange">
                  Unified Rustic Health Delights
                </span>
              </div>
            </Link>

            <p className="text-xs text-neutral-400 leading-relaxed max-w-sm">
              &quot;Where Rustic Tradition Meets Healthy Luxury.&quot; A modern café-cum-restaurant
              blending healthy culinary excellence, vibrant Gen Z lifestyle, and the adventurous spirit of
              the Grand Line.
            </p>

            {/* Anime Easter Egg Quote */}
            <div className="p-3.5 rounded-xl bg-brand-charcoal-light/60 border border-brand-orange/20 max-w-sm">
              <div className="flex items-center gap-1.5 text-brand-gold text-[11px] font-bold">
                <Compass className="w-3.5 h-3.5 text-brand-orange animate-spin-slow" />
                <span>Sanji&apos;s Grand Line Kitchen Oath:</span>
              </div>
              <p className="text-[11px] text-neutral-300 italic mt-1">
                &quot;I will never refuse a hungry soul, and every ingredient shall be honored to its peak.&quot;
              </p>
            </div>

            {/* Social Icons */}
            <div className="flex items-center space-x-3 pt-2">
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noreferrer"
                className="w-9 h-9 rounded-full bg-brand-charcoal-light hover:bg-brand-orange text-neutral-300 hover:text-white flex items-center justify-center transition-all"
                aria-label="Instagram"
              >
                <Instagram className="w-4 h-4" />
              </a>
              <a
                href="https://twitter.com"
                target="_blank"
                rel="noreferrer"
                className="w-9 h-9 rounded-full bg-brand-charcoal-light hover:bg-brand-orange text-neutral-300 hover:text-white flex items-center justify-center transition-all"
                aria-label="Twitter"
              >
                <Twitter className="w-4 h-4" />
              </a>
              <a
                href="https://youtube.com"
                target="_blank"
                rel="noreferrer"
                className="w-9 h-9 rounded-full bg-brand-charcoal-light hover:bg-brand-orange text-neutral-300 hover:text-white flex items-center justify-center transition-all"
                aria-label="YouTube"
              >
                <Youtube className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Quick Navigation Links */}
          <div className="space-y-3">
            <h4 className="font-serif font-bold text-sm text-white tracking-wide">
              Culinary Experience
            </h4>
            <ul className="space-y-2 text-xs text-neutral-400">
              <li>
                <Link href="/menu" className="hover:text-brand-orange transition-colors">
                  All Digital Menu
                </Link>
              </li>
              <li>
                <Link href="/anime" className="hover:text-brand-orange transition-colors flex items-center gap-1">
                  <span>Grand Line Specials</span>
                  <span className="text-[9px] bg-brand-orange text-white px-1 rounded font-bold">HOT</span>
                </Link>
              </li>
              <li>
                <Link href="/menu?category=healthy-bowls" className="hover:text-brand-orange transition-colors">
                  Nutri-Rich Healthy Bowls
                </Link>
              </li>
              <li>
                <Link href="/menu?category=woodfired-pizzas" className="hover:text-brand-orange transition-colors">
                  Woodfired Sourdough Pizzas
                </Link>
              </li>
              <li>
                <Link href="/menu?category=artisanal-coffee" className="hover:text-brand-orange transition-colors">
                  Specialty Single-Origin Coffee
                </Link>
              </li>
              <li>
                <Link href="/offers" className="hover:text-brand-orange transition-colors">
                  Loyalty Points & Offers
                </Link>
              </li>
            </ul>
          </div>

          {/* Corporate Workspace */}
          <div className="space-y-3">
            <h4 className="font-serif font-bold text-sm text-white tracking-wide">
              Work & Community
            </h4>
            <ul className="space-y-2 text-xs text-neutral-400">
              <li>
                <Link href="/workspace" className="hover:text-brand-orange transition-colors">
                  Corporate Workspace Hub
                </Link>
              </li>
              <li>
                <Link href="/workspace#packages" className="hover:text-brand-orange transition-colors">
                  Hourly & Daily Flex Passes
                </Link>
              </li>
              <li>
                <Link href="/workspace#boardroom" className="hover:text-brand-orange transition-colors">
                  Pirate King Boardroom (8 Pax)
                </Link>
              </li>
              <li>
                <Link href="/cart" className="hover:text-brand-orange transition-colors">
                  Dine-In QR Table Ordering
                </Link>
              </li>
              <li>
                <Link href="/profile" className="hover:text-brand-orange transition-colors">
                  Customer Account & Reorder
                </Link>
              </li>
            </ul>
          </div>

          {/* Visit & Connect */}
          <div className="space-y-3">
            <h4 className="font-serif font-bold text-sm text-white tracking-wide">
              Visit & Support
            </h4>
            <ul className="space-y-2.5 text-xs text-neutral-400">
              <li className="flex items-start gap-2">
                <MapPin className="w-4 h-4 text-brand-orange shrink-0 mt-0.5" />
                <span>#402, 100ft Road, Indiranagar, Bangalore 560038</span>
              </li>
              <li className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-brand-orange shrink-0" />
                <span>Mon – Sun: 8:00 AM – 11:30 PM</span>
              </li>
              <li className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-brand-orange shrink-0" />
                <a href="tel:+919876543210" className="hover:text-brand-orange">
                  +91 98765 43210
                </a>
              </li>
              <li className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-brand-orange shrink-0" />
                <a href="mailto:hello@urhd.com" className="hover:text-brand-orange">
                  concierge@urhd.com
                </a>
              </li>
            </ul>

            {/* Newsletter */}
            <div className="pt-2">
              <span className="text-[11px] font-semibold text-neutral-300 block mb-1.5">
                Join our Secret Tasting Club:
              </span>
              {subscribed ? (
                <div className="text-xs text-brand-orange font-semibold py-1">
                  ✓ Welcome aboard the culinary crew!
                </div>
              ) : (
                <form onSubmit={handleSubscribe} className="flex items-center gap-1">
                  <input
                    type="email"
                    value={newsletterEmail}
                    onChange={(e) => setNewsletterEmail(e.target.value)}
                    placeholder="Enter your email"
                    required
                    className="bg-brand-charcoal-light border border-neutral-700 rounded-lg px-2.5 py-1.5 text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-brand-orange flex-1"
                  />
                  <button
                    type="submit"
                    className="p-1.5 rounded-lg bg-brand-orange hover:bg-brand-orange-hover text-white transition-colors"
                    aria-label="Subscribe"
                  >
                    <Send className="w-3.5 h-3.5" />
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 pt-6 border-t border-brand-charcoal-light flex flex-col sm:flex-row items-center justify-between text-[11px] text-neutral-500 gap-3">
          <p>© {new Date().getFullYear()} URHD – Unified Rustic Health Delights. All Rights Reserved.</p>
          <div className="flex items-center gap-4">
            <span className="hover:text-neutral-400 cursor-pointer">Privacy Policy</span>
            <span>•</span>
            <span className="hover:text-neutral-400 cursor-pointer">Terms of Service</span>
            <span>•</span>
            <span className="flex items-center gap-1 text-neutral-400">
              Crafted with <Heart className="w-3 h-3 text-red-500 inline fill-red-500" /> for Food & Anime Lovers
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}
