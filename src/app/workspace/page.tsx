'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import {
  Wifi,
  Coffee,
  BatteryCharging,
  Users,
  CheckCircle2,
  Calendar,
  Clock,
  Sparkles,
  ShieldCheck,
  ArrowRight,
  FileText,
  AlertCircle,
  Laptop,
} from 'lucide-react';
import { WorkspacePackageData, WorkspaceBookingData } from '@/lib/types';
import { useAuth } from '@/context/AuthContext';

export default function WorkspacePage() {
  const { user } = useAuth();
  const [packages, setPackages] = useState<WorkspacePackageData[]>([]);
  const [selectedPackageId, setSelectedPackageId] = useState<string>('half-day-sprint');
  const [date, setDate] = useState<string>('');
  const [startTime, setStartTime] = useState<string>('10:00 AM');
  const [seats, setSeats] = useState<number>(1);
  const [guestName, setGuestName] = useState<string>('');
  const [guestEmail, setGuestEmail] = useState<string>('');
  const [guestPhone, setGuestPhone] = useState<string>('');
  const [specialRequests, setSpecialRequests] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [bookingSuccess, setBookingSuccess] = useState<WorkspaceBookingData | null>(null);
  const [errorMsg, setErrorMsg] = useState<string>('');

  // Fetch workspace packages
  useEffect(() => {
    fetch('/api/workspace/packages')
      .then((res) => res.json())
      .then((data) => {
        if (data.packages) {
          setPackages(data.packages);
        }
      })
      .catch((err) => console.error(err));

    // Default date to tomorrow
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    setDate(tomorrow.toISOString().split('T')[0]);
  }, []);

  // Pre-fill user details if logged in
  useEffect(() => {
    if (user) {
      if (!guestName) setGuestName(user.name);
      if (!guestEmail) setGuestEmail(user.email);
      if (!guestPhone && user.phone) setGuestPhone(user.phone);
    }
  }, [user]);

  const selectedPackage = packages.find((p) => p.id === selectedPackageId);
  const calculatedTotal = selectedPackage ? selectedPackage.price * seats : 0;

  const handleBookingSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setIsSubmitting(true);

    try {
      const res = await fetch('/api/workspace/bookings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          packageId: selectedPackageId,
          guestName,
          guestEmail,
          guestPhone,
          date,
          startTime,
          seats,
          specialRequests,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        setErrorMsg(data.error || 'Failed to complete workspace booking');
      } else {
        setBookingSuccess(data.booking);
      }
    } catch (err: any) {
      setErrorMsg(err.message || 'Network error occurred');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-16 pb-20">
      {/* 1. Header Banner */}
      <section className="bg-brand-charcoal text-white pt-16 pb-20 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
        <div className="absolute top-0 right-10 w-96 h-96 bg-brand-orange/15 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-7xl mx-auto space-y-6 text-center relative z-10">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-brand-charcoal-light border border-neutral-700 text-brand-orange text-xs font-bold">
            <Laptop className="w-4 h-4 text-brand-orange" />
            <span>URHD EXECUTIVE WORKSPACE &amp; BOARDROOM</span>
          </div>

          <h1 className="font-serif text-4xl sm:text-6xl font-bold tracking-tight max-w-3xl mx-auto leading-tight">
            Work, Eat &amp; Relax: The Ultimate Creative Workspace.
          </h1>

          <p className="text-sm sm:text-base text-neutral-300 max-w-2xl mx-auto font-light leading-relaxed">
            Engineered for high-focus deep work, client presentations, and founder sprints.
            Enjoy optical 500Mbps fiber, single-origin coffee on tap, and silent ergonomic pods in Indiranagar.
          </p>

          <div className="pt-2">
            <a
              href="#booking-form"
              className="px-8 py-3.5 rounded-2xl bg-brand-orange hover:bg-brand-orange-hover text-white font-bold text-xs tracking-wider uppercase shadow-xl transition-all inline-flex items-center gap-2"
            >
              <span>Instant Desk Reservation</span>
              <ArrowRight className="w-4 h-4" />
            </a>
          </div>
        </div>
      </section>

      {/* 2. Key Amenities Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
          <div className="p-6 rounded-3xl bg-white border border-brand-beige-dark/60 shadow-xs space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-brand-orange/10 flex items-center justify-center text-brand-orange">
              <Wifi className="w-6 h-6" />
            </div>
            <h3 className="font-serif font-bold text-base text-brand-charcoal">500 Mbps Optical</h3>
            <p className="text-xs text-neutral-500 leading-relaxed">
              Redundant optical lease line Wi-Fi guaranteed for low latency video calls and uploads.
            </p>
          </div>

          <div className="p-6 rounded-3xl bg-white border border-brand-beige-dark/60 shadow-xs space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-brand-orange/10 flex items-center justify-center text-brand-orange">
              <Coffee className="w-6 h-6" />
            </div>
            <h3 className="font-serif font-bold text-base text-brand-charcoal">Artisan Coffee On Tap</h3>
            <p className="text-xs text-neutral-500 leading-relaxed">
              Complimentary Chikmagalur filter &amp; espresso coffee with passes, direct to your desk.
            </p>
          </div>

          <div className="p-6 rounded-3xl bg-white border border-brand-beige-dark/60 shadow-xs space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-brand-orange/10 flex items-center justify-center text-brand-orange">
              <BatteryCharging className="w-6 h-6" />
            </div>
            <h3 className="font-serif font-bold text-base text-brand-charcoal">Power at Every Desk</h3>
            <p className="text-xs text-neutral-500 leading-relaxed">
              Universal spike-busted power outlets, high-speed 65W Type-C fast charging at all stations.
            </p>
          </div>

          <div className="p-6 rounded-3xl bg-white border border-brand-beige-dark/60 shadow-xs space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-brand-orange/10 flex items-center justify-center text-brand-orange">
              <Users className="w-6 h-6" />
            </div>
            <h3 className="font-serif font-bold text-base text-brand-charcoal">Pirate Boardroom</h3>
            <p className="text-xs text-neutral-500 leading-relaxed">
              Acoustic 8-seater meeting room with 65-inch 4K screen and Polycom conference microphone.
            </p>
          </div>
        </div>
      </section>

      {/* 3. Package Cards Comparison */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="text-center space-y-2 max-w-xl mx-auto">
          <span className="text-xs font-bold uppercase tracking-widest text-brand-orange">
            Flexible Passes
          </span>
          <h2 className="font-serif text-3xl sm:text-4xl font-bold text-brand-charcoal">
            Choose Your Work Rhythm
          </h2>
          <p className="text-xs text-neutral-500">
            Select a pass to automatically populate your instant booking reservation form.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
          {packages.map((pkg) => {
            const isSelected = selectedPackageId === pkg.id;

            return (
              <div
                key={pkg.id}
                onClick={() => setSelectedPackageId(pkg.id)}
                className={`p-5 rounded-3xl cursor-pointer border transition-all flex flex-col justify-between relative ${
                  isSelected
                    ? 'bg-brand-charcoal text-white border-brand-orange shadow-xl scale-102 ring-2 ring-brand-orange/40'
                    : 'bg-white hover:bg-neutral-50 border-neutral-200 text-brand-charcoal shadow-xs'
                }`}
              >
                {pkg.popular && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-brand-orange text-white text-[10px] font-bold px-2.5 py-0.5 rounded-full shadow-sm">
                    MOST POPULAR
                  </div>
                )}

                <div className="space-y-3">
                  <div className="space-y-1">
                    <span
                      className={`text-[10px] uppercase font-bold tracking-wider ${
                        isSelected ? 'text-brand-orange' : 'text-neutral-500'
                      }`}
                    >
                      {pkg.duration}
                    </span>
                    <h3 className="font-serif font-bold text-base">{pkg.name}</h3>
                  </div>

                  <div className="flex items-baseline gap-1">
                    <span className="font-serif font-black text-2xl">₹{pkg.price}</span>
                    <span
                      className={`text-[10px] ${
                        isSelected ? 'text-neutral-400' : 'text-neutral-500'
                      }`}
                    >
                      / {pkg.duration}
                    </span>
                  </div>

                  <p
                    className={`text-xs leading-relaxed line-clamp-3 ${
                      isSelected ? 'text-neutral-300' : 'text-neutral-600'
                    }`}
                  >
                    {pkg.description}
                  </p>

                  {/* Features list */}
                  <div className="space-y-1.5 pt-2 border-t border-neutral-200/40 text-[11px]">
                    {pkg.features.slice(0, 3).map((feat, idx) => (
                      <div key={idx} className="flex items-start gap-1.5">
                        <CheckCircle2
                          className={`w-3.5 h-3.5 shrink-0 mt-0.5 ${
                            isSelected ? 'text-brand-orange' : 'text-emerald-600'
                          }`}
                        />
                        <span className="line-clamp-1">{feat}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="pt-4 mt-3">
                  <div
                    className={`w-full py-2 rounded-xl text-center text-xs font-bold transition-all ${
                      isSelected
                        ? 'bg-brand-orange text-white'
                        : 'bg-brand-beige/80 text-brand-charcoal hover:bg-brand-orange hover:text-white'
                    }`}
                  >
                    {isSelected ? '✓ Selected' : 'Choose Pass'}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* 4. Interactive Booking Form & Confirmation */}
      <section id="booking-form" className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-3xl p-6 sm:p-10 border border-brand-beige-dark shadow-rustic-lg">
          {bookingSuccess ? (
            <div className="text-center py-8 space-y-5 animate-scaleUp">
              <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 mx-auto flex items-center justify-center">
                <CheckCircle2 className="w-8 h-8" />
              </div>

              <div className="space-y-2">
                <h3 className="font-serif font-bold text-2xl text-brand-charcoal">
                  Workspace Booking Confirmed!
                </h3>
                <p className="text-xs sm:text-sm text-neutral-600 max-w-md mx-auto">
                  Thank you, <strong className="text-brand-charcoal">{bookingSuccess.guestName}</strong>! Your desk reservation
                  for <strong>{bookingSuccess.package?.name}</strong> on <strong>{bookingSuccess.date}</strong> at <strong>{bookingSuccess.startTime}</strong> is confirmed.
                </p>
              </div>

              <div className="p-4 bg-brand-beige/50 rounded-2xl border border-brand-beige-dark max-w-sm mx-auto text-xs space-y-1.5 text-left">
                <div className="flex justify-between">
                  <span className="text-neutral-500">Booking ID:</span>
                  <span className="font-mono font-bold text-brand-charcoal">{bookingSuccess.id.slice(0, 10).toUpperCase()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-neutral-500">Seats Reserved:</span>
                  <span className="font-bold text-brand-charcoal">{bookingSuccess.seats} Workstation(s)</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-neutral-500">Amount Due:</span>
                  <span className="font-bold text-brand-orange">₹{bookingSuccess.totalAmount} (Pay at Café Desk)</span>
                </div>
              </div>

              <div className="flex justify-center gap-3 pt-3">
                <button
                  onClick={() => setBookingSuccess(null)}
                  className="px-6 py-2.5 rounded-xl bg-brand-orange text-white text-xs font-bold hover:bg-brand-orange-hover"
                >
                  Book Another Pass
                </button>
                <Link
                  href="/menu"
                  className="px-6 py-2.5 rounded-xl border border-neutral-300 text-neutral-700 text-xs font-medium hover:bg-neutral-50"
                >
                  Explore Food Menu
                </Link>
              </div>
            </div>
          ) : (
            <form onSubmit={handleBookingSubmit} className="space-y-6">
              <div className="flex items-center justify-between pb-4 border-b border-neutral-100">
                <div>
                  <h3 className="font-serif font-bold text-xl text-brand-charcoal">
                    Workspace Reservation Form
                  </h3>
                  <p className="text-xs text-neutral-500">
                    Selected: <strong>{selectedPackage?.name}</strong> ({selectedPackage?.duration})
                  </p>
                </div>

                <div className="text-right">
                  <span className="text-[10px] text-neutral-400 uppercase tracking-wider block">Total Rate</span>
                  <span className="font-serif font-black text-2xl text-brand-orange">
                    ₹{calculatedTotal}
                  </span>
                </div>
              </div>

              {errorMsg && (
                <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{errorMsg}</span>
                </div>
              )}

              {/* Form Fields */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Date Selection */}
                <div className="space-y-1">
                  <label className="block text-xs font-bold text-neutral-700">Reservation Date</label>
                  <input
                    type="date"
                    required
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-neutral-200 text-xs text-brand-charcoal bg-white focus:outline-none focus:border-brand-orange"
                  />
                </div>

                {/* Time Selection */}
                <div className="space-y-1">
                  <label className="block text-xs font-bold text-neutral-700">Arrival Time</label>
                  <select
                    value={startTime}
                    onChange={(e) => setStartTime(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-neutral-200 text-xs text-brand-charcoal bg-white focus:outline-none focus:border-brand-orange"
                  >
                    <option value="08:00 AM">08:00 AM (Early Bird)</option>
                    <option value="09:00 AM">09:00 AM</option>
                    <option value="10:00 AM">10:00 AM (Standard Sprint)</option>
                    <option value="11:30 AM">11:30 AM</option>
                    <option value="01:00 PM">01:00 PM (Afternoon)</option>
                    <option value="02:30 PM">02:30 PM</option>
                    <option value="04:00 PM">04:00 PM (Evening Session)</option>
                    <option value="06:00 PM">06:00 PM</option>
                  </select>
                </div>

                {/* Seats / Persons */}
                <div className="space-y-1">
                  <label className="block text-xs font-bold text-neutral-700">Number of Workstations</label>
                  <select
                    value={seats}
                    onChange={(e) => setSeats(parseInt(e.target.value))}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-neutral-200 text-xs text-brand-charcoal bg-white focus:outline-none focus:border-brand-orange"
                  >
                    <option value={1}>1 Person (Solo Workstation)</option>
                    <option value={2}>2 Persons (Co-founders Desk)</option>
                    <option value={4}>4 Persons (Team Discussion Pod)</option>
                    <option value={8}>8 Persons (Full Pirate Boardroom)</option>
                  </select>
                </div>

                {/* Full Name */}
                <div className="space-y-1">
                  <label className="block text-xs font-bold text-neutral-700">Full Name</label>
                  <input
                    type="text"
                    required
                    value={guestName}
                    onChange={(e) => setGuestName(e.target.value)}
                    placeholder="e.g. Ananya Sharma"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-neutral-200 text-xs text-brand-charcoal bg-white focus:outline-none focus:border-brand-orange"
                  />
                </div>

                {/* Email Address */}
                <div className="space-y-1">
                  <label className="block text-xs font-bold text-neutral-700">Work Email</label>
                  <input
                    type="email"
                    required
                    value={guestEmail}
                    onChange={(e) => setGuestEmail(e.target.value)}
                    placeholder="e.g. ananya@company.com"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-neutral-200 text-xs text-brand-charcoal bg-white focus:outline-none focus:border-brand-orange"
                  />
                </div>

                {/* Phone Number */}
                <div className="space-y-1">
                  <label className="block text-xs font-bold text-neutral-700">Phone Number</label>
                  <input
                    type="tel"
                    required
                    value={guestPhone}
                    onChange={(e) => setGuestPhone(e.target.value)}
                    placeholder="e.g. +91 98765 43210"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-neutral-200 text-xs text-brand-charcoal bg-white focus:outline-none focus:border-brand-orange"
                  />
                </div>
              </div>

              {/* Special Requests */}
              <div className="space-y-1">
                <label className="block text-xs font-bold text-neutral-700">
                  Special Tech or Seating Requests (Optional)
                </label>
                <input
                  type="text"
                  value={specialRequests}
                  onChange={(e) => setSpecialRequests(e.target.value)}
                  placeholder="e.g. Need dual monitor loan, quietest corner, projector setup..."
                  className="w-full px-3.5 py-2.5 rounded-xl border border-neutral-200 text-xs text-brand-charcoal bg-white focus:outline-none focus:border-brand-orange"
                />
              </div>

              {/* Rules and Notice */}
              <div className="p-4 rounded-2xl bg-neutral-50 border border-neutral-200 text-[11px] text-neutral-600 space-y-1">
                <span className="font-bold text-brand-charcoal block">Workspace Etiquette &amp; Rules:</span>
                <p>• Quiet Zone: Please use the acoustic phone booths for phone calls exceeding 2 minutes.</p>
                <p>• Desk Dining: You can order food and drinks directly to your workstation via table QR ordering.</p>
                <p>• Payment: No advance payment required for day passes; you can pay at the café concierge on arrival.</p>
              </div>

              {/* Submit CTA */}
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-3.5 px-6 rounded-2xl bg-brand-orange hover:bg-brand-orange-hover text-white font-bold text-xs shadow-md hover:shadow-orange-glow transition-all flex items-center justify-center gap-2 disabled:opacity-50"
              >
                <span>
                  {isSubmitting ? 'Confirming Reservation...' : `Confirm Workspace Pass • ₹${calculatedTotal}`}
                </span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>
          )}
        </div>
      </section>
    </div>
  );
}
