'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { useCart } from '@/context/CartContext';
import {
  User,
  ShoppingBag,
  MapPin,
  Sparkles,
  Laptop,
  LogOut,
  Plus,
  Trash2,
  Clock,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  Coins,
  QrCode,
  Flame,
} from 'lucide-react';
import { OrderData, AddressItem, WorkspaceBookingData } from '@/lib/types';

export default function ProfilePage() {
  const router = useRouter();
  const { user, loading: authLoading, logout } = useAuth();
  const { addToCart } = useCart();

  const [activeTab, setActiveTab] = useState<'orders' | 'addresses' | 'loyalty' | 'workspace'>('orders');
  const [orders, setOrders] = useState<OrderData[]>([]);
  const [addresses, setAddresses] = useState<AddressItem[]>([]);
  const [bookings, setBookings] = useState<WorkspaceBookingData[]>([]);
  const [loading, setLoading] = useState(true);

  // New Address Modal
  const [addressModalOpen, setAddressModalOpen] = useState(false);
  const [newLabel, setNewLabel] = useState('Home');
  const [newStreet, setNewStreet] = useState('');
  const [newLandmark, setNewLandmark] = useState('');
  const [newPincode, setNewPincode] = useState('560038');

  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/auth/login');
      return;
    }

    if (user) {
      // Fetch user's orders
      fetch('/api/orders')
        .then((res) => res.json())
        .then((data) => {
          if (data.orders) setOrders(data.orders);
        })
        .catch(console.error);

      // Fetch user profile details with addresses
      fetch('/api/auth/me')
        .then((res) => res.json())
        .then((data) => {
          if (data.user?.addresses) setAddresses(data.user.addresses);
        })
        .catch(console.error);

      // Fetch workspace bookings
      fetch('/api/workspace/bookings')
        .then((res) => res.json())
        .then((data) => {
          if (data.bookings) setBookings(data.bookings);
        })
        .catch(console.error)
        .finally(() => setLoading(false));
    }
  }, [user, authLoading, router]);

  const handleReorder = (order: OrderData) => {
    order.items.forEach((item) => {
      addToCart(item.menuItem, item.quantity);
    });
    router.push('/cart');
  };

  const handleAddAddress = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newStreet || !newPincode) return;

    // Simulated address addition
    const newAddr: AddressItem = {
      id: `addr_${Date.now()}`,
      userId: user?.id || 'uid',
      label: newLabel,
      street: newStreet,
      landmark: newLandmark,
      city: 'Bangalore',
      state: 'Karnataka',
      pincode: newPincode,
      isDefault: addresses.length === 0,
    };

    setAddresses((prev) => [newAddr, ...prev]);
    setAddressModalOpen(false);
    setNewStreet('');
    setNewLandmark('');
  };

  if (authLoading || (!user && loading)) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20 text-center text-xs text-neutral-500">
        Loading customer profile...
      </div>
    );
  }

  if (!user) return null;

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Profile Overview Card */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-brand-beige-dark shadow-rustic flex flex-col sm:flex-row items-center sm:items-start justify-between gap-6">
        <div className="flex flex-col sm:flex-row items-center gap-5 text-center sm:text-left">
          <div className="w-20 h-20 rounded-full bg-gradient-to-tr from-brand-orange to-brand-gold text-white font-serif font-black text-3xl flex items-center justify-center shadow-lg border-4 border-white">
            {user.name.charAt(0)}
          </div>

          <div className="space-y-1">
            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
              <h1 className="font-serif font-bold text-2xl text-brand-charcoal">{user.name}</h1>
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-brand-orange/15 text-brand-orange">
                {user.role}
              </span>
            </div>
            <p className="text-xs text-neutral-500 font-mono">{user.email}</p>
            {user.phone && <p className="text-xs text-neutral-500">{user.phone}</p>}
          </div>
        </div>

        {/* Pirate Berries Balance Box */}
        <div className="p-4 rounded-2xl bg-brand-charcoal text-white flex items-center gap-4 shadow-md w-full sm:w-auto justify-between sm:justify-start">
          <div className="w-10 h-10 rounded-xl bg-brand-gold/20 flex items-center justify-center text-brand-gold">
            <Coins className="w-6 h-6" />
          </div>
          <div>
            <div className="text-[10px] uppercase tracking-wider text-neutral-400 font-bold">
              Pirate Berries Loyalty
            </div>
            <div className="font-serif font-black text-2xl text-brand-gold">
              {user.loyaltyPoints || 340} <span className="text-xs font-sans font-normal text-neutral-300">Berries</span>
            </div>
          </div>
          <button
            onClick={() => setActiveTab('loyalty')}
            className="text-xs text-brand-orange hover:underline font-semibold"
          >
            Redeem →
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 border-b border-neutral-200 text-xs font-bold">
        {[
          { key: 'orders', label: `My Orders (${orders.length})`, icon: ShoppingBag },
          { key: 'addresses', label: `Saved Addresses (${addresses.length})`, icon: MapPin },
          { key: 'loyalty', label: 'Loyalty & Rewards', icon: Sparkles },
          { key: 'workspace', label: `Workspace Passes (${bookings.length})`, icon: Laptop },
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.key;
          return (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key as any)}
              className={`px-4 py-2.5 rounded-2xl flex items-center gap-2 transition-all shrink-0 ${
                isActive
                  ? 'bg-brand-charcoal text-white shadow-md'
                  : 'bg-white hover:bg-brand-beige text-neutral-600 border border-neutral-200'
              }`}
            >
              <Icon className="w-4 h-4 text-brand-orange" />
              <span>{tab.label}</span>
            </button>
          );
        })}

        <button
          onClick={logout}
          className="ml-auto px-4 py-2.5 rounded-2xl text-red-600 hover:bg-red-50 flex items-center gap-1.5 transition-colors shrink-0"
        >
          <LogOut className="w-4 h-4" />
          <span>Sign Out</span>
        </button>
      </div>

      {/* TAB 1: ORDER HISTORY */}
      {activeTab === 'orders' && (
        <div className="space-y-4 animate-fadeIn">
          {orders.length > 0 ? (
            orders.map((order) => (
              <div
                key={order.id}
                className="bg-white p-5 rounded-3xl border border-brand-beige-dark shadow-xs space-y-4"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-neutral-100">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-mono font-bold text-sm text-brand-charcoal">
                        {order.orderNumber}
                      </span>
                      <span
                        className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                          order.status === 'DELIVERED'
                            ? 'bg-emerald-100 text-emerald-800'
                            : 'bg-brand-orange/20 text-brand-orange'
                        }`}
                      >
                        {order.status}
                      </span>
                    </div>
                    <span className="text-[11px] text-neutral-400">
                      {new Date(order.createdAt).toLocaleDateString('en-IN', {
                        day: 'numeric',
                        month: 'short',
                        year: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </span>
                  </div>

                  <div className="flex items-center gap-3">
                    <span className="font-serif font-black text-lg text-brand-charcoal">
                      ₹{Math.round(order.totalAmount)}
                    </span>
                    <button
                      onClick={() => handleReorder(order)}
                      className="px-3.5 py-1.5 rounded-xl bg-brand-orange hover:bg-brand-orange-hover text-white text-xs font-bold transition-all shadow-xs"
                    >
                      Reorder
                    </button>
                    <Link
                      href={`/orders/${order.orderNumber}`}
                      className="px-3.5 py-1.5 rounded-xl border border-neutral-200 hover:bg-neutral-50 text-neutral-700 text-xs font-medium"
                    >
                      Live Track →
                    </Link>
                  </div>
                </div>

                {/* Items */}
                <div className="text-xs text-neutral-600 space-y-1">
                  {order.items.map((i) => (
                    <div key={i.id} className="flex justify-between">
                      <span>
                        {i.quantity}x {i.menuItem.name}
                      </span>
                      <span className="font-mono font-semibold">₹{i.totalPrice}</span>
                    </div>
                  ))}
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-16 bg-white rounded-3xl border border-brand-beige-dark p-6 space-y-3">
              <ShoppingBag className="w-10 h-10 text-neutral-400 mx-auto" />
              <h3 className="font-serif font-bold text-lg">No orders yet</h3>
              <p className="text-xs text-neutral-500">Discover delicious meals from our digital menu.</p>
              <Link
                href="/menu"
                className="inline-block px-5 py-2 rounded-xl bg-brand-orange text-white text-xs font-bold"
              >
                Explore Menu
              </Link>
            </div>
          )}
        </div>
      )}

      {/* TAB 2: SAVED ADDRESSES */}
      {activeTab === 'addresses' && (
        <div className="space-y-4 animate-fadeIn">
          <div className="flex justify-between items-center">
            <h3 className="font-serif font-bold text-lg text-brand-charcoal">Delivery Locations</h3>
            <button
              onClick={() => setAddressModalOpen(true)}
              className="px-4 py-2 rounded-xl bg-brand-orange text-white text-xs font-bold flex items-center gap-1.5 shadow-sm"
            >
              <Plus className="w-4 h-4" />
              <span>Add New Address</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {addresses.map((addr) => (
              <div
                key={addr.id}
                className="bg-white p-5 rounded-2xl border border-brand-beige-dark shadow-xs space-y-2 relative"
              >
                <div className="flex items-center justify-between">
                  <span className="font-bold text-xs bg-brand-beige px-2 py-0.5 rounded text-brand-charcoal">
                    {addr.label}
                  </span>
                  {addr.isDefault && (
                    <span className="text-[10px] text-emerald-600 font-bold bg-emerald-50 px-2 py-0.5 rounded">
                      Default Delivery
                    </span>
                  )}
                </div>
                <p className="text-xs text-neutral-700 leading-relaxed font-medium">
                  {addr.street}
                </p>
                {addr.landmark && (
                  <p className="text-[11px] text-neutral-400">Landmark: {addr.landmark}</p>
                )}
                <p className="text-[11px] text-neutral-500 font-mono">
                  {addr.city}, {addr.state} - {addr.pincode}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 3: LOYALTY PROGRAM */}
      {activeTab === 'loyalty' && (
        <div className="bg-white rounded-3xl border border-brand-beige-dark p-6 sm:p-8 space-y-6 animate-fadeIn">
          <div className="space-y-1">
            <h3 className="font-serif font-bold text-xl text-brand-charcoal">
              Pirate Berries &amp; Rustic Gold Tiers
            </h3>
            <p className="text-xs text-neutral-500">
              Earn 1 Berry for every ₹20 spent. Redeem for instant discounts and complimentary culinary rewards.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-5 rounded-2xl bg-amber-50 border border-amber-200 space-y-2">
              <span className="text-[10px] uppercase font-bold text-amber-800">Tier 1</span>
              <h4 className="font-serif font-bold text-base text-amber-900">Cabin Boy (0 - 500 B)</h4>
              <p className="text-xs text-amber-800">
                • 100 Welcome Points on Signup
                <br />• Free Baratie Bread Basket with orders &gt; ₹600
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-brand-orange/10 border border-brand-orange/30 space-y-2 ring-1 ring-brand-orange">
              <span className="text-[10px] uppercase font-bold text-brand-orange">Tier 2 (Current)</span>
              <h4 className="font-serif font-bold text-base text-brand-charcoal">Supernova (500 - 1500 B)</h4>
              <p className="text-xs text-neutral-700">
                • 10% Flat Discount on all Dine-In visits
                <br />• 1 Free Artisanal Cold Drip Coffee / month
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-neutral-900 text-white space-y-2">
              <span className="text-[10px] uppercase font-bold text-brand-gold">Tier 3</span>
              <h4 className="font-serif font-bold text-base text-white">Pirate King (1500+ B)</h4>
              <p className="text-xs text-neutral-300">
                • 20% Flat Discount on food &amp; workspace
                <br />• Secret off-menu tastings with Chef Sanji
              </p>
            </div>
          </div>
        </div>
      )}

      {/* TAB 4: WORKSPACE BOOKINGS */}
      {activeTab === 'workspace' && (
        <div className="space-y-4 animate-fadeIn">
          {bookings.length > 0 ? (
            bookings.map((b) => (
              <div
                key={b.id}
                className="bg-white p-5 rounded-3xl border border-brand-beige-dark shadow-xs space-y-3"
              >
                <div className="flex items-center justify-between pb-2 border-b border-neutral-100">
                  <span className="font-serif font-bold text-base text-brand-charcoal">
                    {b.package?.name || 'Workspace Pass'}
                  </span>
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800">
                    {b.status}
                  </span>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
                  <div>
                    <span className="text-neutral-400 block text-[10px]">Date</span>
                    <span className="font-bold">{b.date}</span>
                  </div>
                  <div>
                    <span className="text-neutral-400 block text-[10px]">Arrival Time</span>
                    <span className="font-bold">{b.startTime}</span>
                  </div>
                  <div>
                    <span className="text-neutral-400 block text-[10px]">Workstations</span>
                    <span className="font-bold">{b.seats} Person(s)</span>
                  </div>
                  <div>
                    <span className="text-neutral-400 block text-[10px]">Rate</span>
                    <span className="font-bold text-brand-orange">₹{b.totalAmount}</span>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-16 bg-white rounded-3xl border border-brand-beige-dark p-6 space-y-3">
              <Laptop className="w-10 h-10 text-neutral-400 mx-auto" />
              <h3 className="font-serif font-bold text-lg">No workspace reservations</h3>
              <p className="text-xs text-neutral-500">Book high-focus desks with 500Mbps fiber in Indiranagar.</p>
              <Link
                href="/workspace"
                className="inline-block px-5 py-2 rounded-xl bg-brand-orange text-white text-xs font-bold"
              >
                Explore Workspace Passes
              </Link>
            </div>
          )}
        </div>
      )}

      {/* Address Modal */}
      {addressModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-neutral-200 space-y-4">
            <h3 className="font-serif font-bold text-lg text-brand-charcoal">Add Delivery Address</h3>
            <form onSubmit={handleAddAddress} className="space-y-3 text-xs">
              <div>
                <label className="block font-bold mb-1">Address Label</label>
                <div className="flex gap-2">
                  {['Home', 'Work', 'Studio'].map((lbl) => (
                    <button
                      key={lbl}
                      type="button"
                      onClick={() => setNewLabel(lbl)}
                      className={`px-3 py-1.5 rounded-lg border font-bold ${
                        newLabel === lbl ? 'bg-brand-orange text-white border-brand-orange' : 'bg-neutral-50'
                      }`}
                    >
                      {lbl}
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <label className="block font-bold mb-1">Street Address</label>
                <input
                  type="text"
                  required
                  value={newStreet}
                  onChange={(e) => setNewStreet(e.target.value)}
                  placeholder="Flat/House, Building, Street..."
                  className="w-full px-3 py-2 rounded-xl border border-neutral-200"
                />
              </div>
              <div>
                <label className="block font-bold mb-1">Landmark</label>
                <input
                  type="text"
                  value={newLandmark}
                  onChange={(e) => setNewLandmark(e.target.value)}
                  placeholder="Near Metro..."
                  className="w-full px-3 py-2 rounded-xl border border-neutral-200"
                />
              </div>
              <div>
                <label className="block font-bold mb-1">Pincode</label>
                <input
                  type="text"
                  required
                  value={newPincode}
                  onChange={(e) => setNewPincode(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-neutral-200"
                />
              </div>
              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setAddressModalOpen(false)}
                  className="px-4 py-2 rounded-xl border"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-brand-orange text-white font-bold"
                >
                  Save Address
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
