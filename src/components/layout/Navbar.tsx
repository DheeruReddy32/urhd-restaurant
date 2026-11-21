'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useCart } from '@/context/CartContext';
import { useAuth } from '@/context/AuthContext';
import {
  ShoppingBag,
  User as UserIcon,
  Menu as MenuIcon,
  X,
  Compass,
  Briefcase,
  Flame,
  QrCode,
  ShieldAlert,
  ChefHat,
} from 'lucide-react';

export default function Navbar() {
  const pathname = usePathname();
  const { itemCount, totalAmount, orderType, tableNumber, setTable, setOrderType } = useCart();
  const { user, logout } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [tableModalOpen, setTableModalOpen] = useState(false);
  const [selectedTableInput, setSelectedTableInput] = useState(tableNumber ? String(tableNumber) : '4');

  const navLinks = [
    { name: 'Home', href: '/' },
    { name: 'Digital Menu', href: '/menu', badge: 'Hot' },
    { name: 'The Grand Line Café 🏴‍☠️', href: '/anime', highlight: true },
    { name: 'Corporate Workspace', href: '/workspace' },
    { name: 'Offers & Loyalty', href: '/offers' },
    { name: 'Our Story', href: '/#story' },
    { name: 'Contact', href: '/#contact' },
  ];

  const handleTableSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const num = parseInt(selectedTableInput);
    if (num > 0 && num <= 12) {
      setTable(num);
      setTableModalOpen(false);
    }
  };

  return (
    <>
      {/* Top Banner Notice */}
      <div className="bg-brand-charcoal text-brand-beige py-1.5 px-4 text-xs font-medium border-b border-brand-charcoal-light">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold bg-brand-orange text-white">
              NEW
            </span>
            <span>Where Rustic Tradition Meets Healthy Luxury • Indiranagar, Bangalore</span>
          </div>

          <div className="flex items-center gap-4 text-xs">
            {/* Dashboard links for logged-in roles */}
            {user?.role === 'ADMIN' && (
              <Link href="/admin" className="text-amber-400 hover:underline flex items-center gap-1 font-semibold">
                <ShieldAlert className="w-3.5 h-3.5" />
                Owner Portal
              </Link>
            )}
            {user?.role === 'KITCHEN' && (
              <Link href="/kitchen" className="text-red-400 hover:underline flex items-center gap-1 font-semibold">
                <ChefHat className="w-3.5 h-3.5" />
                Kitchen Display
              </Link>
            )}
          </div>
        </div>
      </div>

      {/* Main Navbar */}
      <header className="sticky top-0 z-40 bg-brand-offwhite/95 backdrop-blur-md border-b border-brand-beige-dark/40 shadow-sm transition-all">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3 group">
            <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-brand-orange to-brand-orange-dark flex items-center justify-center text-white font-serif font-black text-xl shadow-md group-hover:scale-105 transition-transform">
              U
            </div>
            <div className="flex flex-col">
              <span className="font-serif font-bold text-2xl tracking-tight text-brand-charcoal group-hover:text-brand-orange transition-colors">
                URHD
              </span>
              <span className="text-[10px] tracking-widest uppercase font-semibold text-brand-grey-dark">
                Rustic Health Delights
              </span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center space-x-1">
            {navLinks.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.name}
                  href={link.href}
                  className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors relative flex items-center gap-1.5 ${
                    isActive
                      ? 'text-brand-orange font-semibold bg-brand-orange/10'
                      : link.highlight
                      ? 'text-brand-charcoal font-semibold hover:text-brand-orange hover:bg-brand-beige/60'
                      : 'text-brand-charcoal/80 hover:text-brand-orange hover:bg-brand-beige/50'
                  }`}
                >
                  {link.highlight && <Compass className="w-4 h-4 text-brand-orange animate-spin-slow" />}
                  <span>{link.name}</span>
                  {link.badge && (
                    <span className="text-[10px] bg-brand-orange text-white px-1.5 py-0.2 rounded-full font-bold">
                      {link.badge}
                    </span>
                  )}
                </Link>
              );
            })}
          </nav>

          {/* Action Icons */}
          <div className="flex items-center space-x-3">
            {/* Table Number Selector (Dine-in) */}
            <button
              onClick={() => setTableModalOpen(true)}
              className={`hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all ${
                orderType === 'DINE_IN' && tableNumber
                  ? 'bg-amber-500/10 border-amber-500/40 text-amber-800'
                  : 'bg-brand-beige/60 hover:bg-brand-beige border-brand-beige-dark text-brand-charcoal'
              }`}
              title="Select Dine-in Table or Home Delivery"
            >
              <QrCode className="w-4 h-4 text-brand-orange" />
              <span>
                {orderType === 'DINE_IN' && tableNumber ? `Table #${tableNumber}` : 'Dine-In / Table'}
              </span>
            </button>

            {/* Cart Button */}
            <Link
              href="/cart"
              className="relative p-2.5 rounded-xl bg-brand-orange text-white hover:bg-brand-orange-hover shadow-md hover:shadow-orange-glow transition-all flex items-center gap-2 group"
            >
              <ShoppingBag className="w-5 h-5 group-hover:scale-110 transition-transform" />
              {itemCount > 0 && (
                <span className="font-bold text-xs bg-white text-brand-orange px-1.5 py-0.5 rounded-full shadow-sm">
                  {itemCount}
                </span>
              )}
              {totalAmount > 0 && (
                <span className="hidden md:inline-block font-semibold text-xs border-l border-white/30 pl-2">
                  ₹{Math.round(totalAmount)}
                </span>
              )}
            </Link>

            {/* Profile / Auth Button */}
            {user ? (
              <div className="relative group">
                <Link
                  href="/profile"
                  className="flex items-center gap-2 p-1.5 rounded-xl hover:bg-brand-beige/60 transition-colors"
                >
                  <div className="w-9 h-9 rounded-full bg-brand-beige-dark text-brand-charcoal font-bold flex items-center justify-center border border-brand-orange/40 text-sm">
                    {user.name.charAt(0)}
                  </div>
                  <span className="hidden md:inline-block text-xs font-semibold text-brand-charcoal max-w-[100px] truncate">
                    {user.name.split(' ')[0]}
                  </span>
                </Link>
              </div>
            ) : (
              <Link
                href="/auth/login"
                className="hidden sm:flex items-center gap-1.5 px-4 py-2 rounded-xl border border-brand-charcoal text-brand-charcoal hover:bg-brand-charcoal hover:text-white font-medium text-xs transition-colors"
              >
                <UserIcon className="w-4 h-4" />
                <span>Sign In</span>
              </Link>
            )}

            {/* Mobile Hamburger Toggle */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 rounded-lg text-brand-charcoal hover:bg-brand-beige"
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <MenuIcon className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation Drawer */}
        {mobileMenuOpen && (
          <div className="lg:hidden bg-brand-offwhite border-b border-brand-beige-dark px-4 pt-2 pb-6 space-y-2 shadow-xl animate-fadeIn">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className="block px-3 py-2.5 rounded-lg text-base font-medium text-brand-charcoal hover:bg-brand-beige hover:text-brand-orange"
              >
                {link.name}
              </Link>
            ))}

            <div className="pt-3 border-t border-brand-beige-dark flex flex-col gap-2">
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  setTableModalOpen(true);
                }}
                className="w-full text-left px-3 py-2.5 rounded-lg text-sm font-semibold bg-brand-beige flex items-center gap-2"
              >
                <QrCode className="w-4 h-4 text-brand-orange" />
                <span>{tableNumber ? `Dine-In: Table #${tableNumber}` : 'Select Dine-In Table'}</span>
              </button>

              {user ? (
                <>
                  <Link
                    href="/profile"
                    onClick={() => setMobileMenuOpen(false)}
                    className="block px-3 py-2 rounded-lg text-sm font-medium text-brand-charcoal hover:bg-brand-beige"
                  >
                    My Profile & Saved Orders
                  </Link>
                  <button
                    onClick={() => {
                      setMobileMenuOpen(false);
                      logout();
                    }}
                    className="w-full text-left px-3 py-2 text-sm text-red-600 font-medium"
                  >
                    Sign Out
                  </button>
                </>
              ) : (
                <Link
                  href="/auth/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-full text-center py-2.5 rounded-lg bg-brand-charcoal text-white font-medium text-sm"
                >
                  Sign In / Register
                </Link>
              )}
            </div>
          </div>
        )}
      </header>

      {/* Dine-in Table Selection Modal */}
      {tableModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-brand-beige-dark animate-scaleUp">
            <div className="flex items-center justify-between pb-3 border-b border-neutral-100">
              <div className="flex items-center gap-2">
                <QrCode className="w-5 h-5 text-brand-orange" />
                <h3 className="font-serif font-bold text-lg text-brand-charcoal">
                  Dine-In Table Ordering
                </h3>
              </div>
              <button
                onClick={() => setTableModalOpen(false)}
                className="p-1 rounded-full text-neutral-400 hover:bg-neutral-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <p className="text-xs text-neutral-600 mt-3 leading-relaxed">
              Visiting URHD physically? Enter your table number or select one below. Your order will be sent directly to the kitchen chefs!
            </p>

            <form onSubmit={handleTableSubmit} className="mt-4 space-y-4">
              <div>
                <label className="block text-xs font-semibold text-neutral-700 mb-1">
                  Choose Table Number (1 - 12)
                </label>
                <div className="grid grid-cols-4 gap-2">
                  {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map((num) => (
                    <button
                      key={num}
                      type="button"
                      onClick={() => setSelectedTableInput(String(num))}
                      className={`py-2 rounded-lg text-sm font-bold border transition-all ${
                        selectedTableInput === String(num)
                          ? 'bg-brand-orange text-white border-brand-orange shadow-sm scale-105'
                          : 'bg-neutral-50 hover:bg-brand-beige/50 border-neutral-200 text-brand-charcoal'
                      }`}
                    >
                      T-{num}
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex items-center gap-2 pt-2">
                <button
                  type="submit"
                  className="flex-1 py-2.5 rounded-xl bg-brand-orange hover:bg-brand-orange-hover text-white text-xs font-bold shadow-md transition-all"
                >
                  Confirm Table #{selectedTableInput}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setTable(null);
                    setOrderType('DELIVERY');
                    setTableModalOpen(false);
                  }}
                  className="px-4 py-2.5 rounded-xl border border-neutral-200 text-neutral-600 hover:bg-neutral-100 text-xs font-medium"
                >
                  Switch to Delivery
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
