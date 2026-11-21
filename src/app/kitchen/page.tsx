'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  ChefHat,
  Clock,
  QrCode,
  MapPin,
  CheckCircle2,
  AlertCircle,
  RefreshCw,
  Flame,
  Volume2,
  Utensils,
  ArrowRight,
} from 'lucide-react';
import { OrderData, OrderStatus } from '@/lib/types';
import { useAuth } from '@/context/AuthContext';

export default function KitchenDashboardPage() {
  const { user } = useAuth();
  const [orders, setOrders] = useState<OrderData[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterType, setFilterType] = useState<'ALL' | 'DINE_IN' | 'DELIVERY'>('ALL');
  const [lastSync, setLastSync] = useState<Date>(new Date());

  const fetchKitchenOrders = async () => {
    try {
      const res = await fetch('/api/orders');
      if (res.ok) {
        const data = await res.json();
        // Filter active tickets
        const activeTickets = data.orders.filter((o: OrderData) =>
          ['PLACED', 'CONFIRMED', 'PREPARING', 'READY'].includes(o.status)
        );
        setOrders(activeTickets);
        setLastSync(new Date());
      }
    } catch (err) {
      console.error('Kitchen orders fetch error:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchKitchenOrders();
    const interval = setInterval(fetchKitchenOrders, 5000); // Poll every 5s for tablet KDS
    return () => clearInterval(interval);
  }, []);

  const updateOrderStatus = async (orderId: string, newStatus: OrderStatus) => {
    try {
      const res = await fetch(`/api/orders/${orderId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      });
      if (res.ok) {
        fetchKitchenOrders();
      }
    } catch (err) {
      console.error('Failed to update status', err);
    }
  };

  const filteredOrders = orders.filter((o) => {
    if (filterType === 'ALL') return true;
    return o.orderType === filterType;
  });

  return (
    <div className="bg-neutral-900 text-white min-h-screen p-4 sm:p-6 lg:p-8 space-y-6">
      {/* KDS Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-neutral-800">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-brand-orange flex items-center justify-center text-white shadow-lg">
            <ChefHat className="w-7 h-7" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="font-serif font-bold text-2xl text-white">
                URHD Kitchen Display System (KDS)
              </h1>
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-red-600 text-white animate-pulse">
                LIVE
              </span>
            </div>
            <p className="text-xs text-neutral-400">
              Active kitchen cook tickets • Indiranagar Hub • Last synced at{' '}
              {lastSync.toLocaleTimeString()}
            </p>
          </div>
        </div>

        {/* Filters & Actions */}
        <div className="flex items-center gap-3">
          <div className="flex items-center bg-neutral-800 p-1 rounded-xl border border-neutral-700 text-xs">
            <button
              onClick={() => setFilterType('ALL')}
              className={`px-3 py-1.5 rounded-lg font-bold transition-all ${
                filterType === 'ALL' ? 'bg-brand-orange text-white' : 'text-neutral-400 hover:text-white'
              }`}
            >
              All ({orders.length})
            </button>
            <button
              onClick={() => setFilterType('DINE_IN')}
              className={`px-3 py-1.5 rounded-lg font-bold transition-all ${
                filterType === 'DINE_IN' ? 'bg-brand-orange text-white' : 'text-neutral-400 hover:text-white'
              }`}
            >
              Dine-In
            </button>
            <button
              onClick={() => setFilterType('DELIVERY')}
              className={`px-3 py-1.5 rounded-lg font-bold transition-all ${
                filterType === 'DELIVERY' ? 'bg-brand-orange text-white' : 'text-neutral-400 hover:text-white'
              }`}
            >
              Delivery
            </button>
          </div>

          <button
            onClick={fetchKitchenOrders}
            className="p-2 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-neutral-300 transition-colors"
            title="Refresh Tickets"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Ticket Cards Grid (Tablet Friendly) */}
      {loading ? (
        <div className="text-center py-20 text-neutral-500 text-sm">
          Loading active kitchen tickets...
        </div>
      ) : filteredOrders.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredOrders.map((order) => {
            const minutesElapsed = Math.floor(
              (Date.now() - new Date(order.createdAt).getTime()) / (1000 * 60)
            );
            const isLate = minutesElapsed > 25;

            return (
              <div
                key={order.id}
                className={`bg-neutral-800/90 rounded-3xl border-2 overflow-hidden shadow-xl flex flex-col justify-between transition-all ${
                  isLate
                    ? 'border-red-500 ring-2 ring-red-500/30'
                    : order.status === 'PREPARING'
                    ? 'border-brand-orange'
                    : order.status === 'READY'
                    ? 'border-emerald-500'
                    : 'border-neutral-700'
                }`}
              >
                {/* Ticket Header */}
                <div
                  className={`p-4 border-b flex items-center justify-between text-xs font-bold ${
                    order.orderType === 'DINE_IN'
                      ? 'bg-amber-950/60 text-amber-300 border-amber-800/40'
                      : 'bg-blue-950/60 text-blue-300 border-blue-800/40'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    {order.orderType === 'DINE_IN' ? (
                      <QrCode className="w-4 h-4 text-amber-400" />
                    ) : (
                      <MapPin className="w-4 h-4 text-blue-400" />
                    )}
                    <span className="text-sm font-black">
                      {order.orderType === 'DINE_IN'
                        ? `TABLE #${order.table?.number || '?'}`
                        : 'DELIVERY'}
                    </span>
                  </div>

                  <div className="flex items-center gap-1 font-mono">
                    <Clock className="w-3.5 h-3.5" />
                    <span className={isLate ? 'text-red-400 font-bold animate-pulse' : ''}>
                      {minutesElapsed}m ago
                    </span>
                  </div>
                </div>

                {/* Ticket Body: Items & Customizations */}
                <div className="p-4 space-y-4 flex-1">
                  <div className="flex items-center justify-between text-[11px] text-neutral-400">
                    <span className="font-mono">{order.orderNumber}</span>
                    <span
                      className={`px-2 py-0.5 rounded font-bold uppercase text-[10px] ${
                        order.status === 'PREPARING'
                          ? 'bg-brand-orange/20 text-brand-orange'
                          : order.status === 'READY'
                          ? 'bg-emerald-500/20 text-emerald-400'
                          : 'bg-neutral-700 text-white'
                      }`}
                    >
                      {order.status}
                    </span>
                  </div>

                  {/* Items List */}
                  <div className="space-y-3 divide-y divide-neutral-700/60">
                    {order.items.map((item) => {
                      const customizations = item.customizationsJson
                        ? JSON.parse(item.customizationsJson)
                        : [];

                      return (
                        <div key={item.id} className="pt-2 first:pt-0 space-y-1">
                          <div className="flex items-start justify-between gap-2">
                            <span className="font-bold text-sm text-white">
                              <span className="text-brand-orange font-black mr-1.5">
                                {item.quantity}x
                              </span>
                              {item.menuItem.name}
                            </span>
                            <span className="text-[10px] text-neutral-400 shrink-0">
                              {item.menuItem.prepTime}m
                            </span>
                          </div>

                          {/* Customization Details for Cook */}
                          {customizations.length > 0 && (
                            <div className="pl-4 space-y-0.5 text-xs text-amber-300">
                              {customizations.map((c: any, i: number) => (
                                <div key={i} className="flex items-center gap-1 font-medium">
                                  <span>↳</span>
                                  <span>{c.groupName}: <strong>{c.optionName}</strong></span>
                                </div>
                              ))}
                            </div>
                          )}

                          {item.specialNotes && (
                            <div className="pl-4 text-[11px] text-emerald-400 font-semibold italic">
                              Note: {item.specialNotes}
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>

                  {order.specialInstructions && (
                    <div className="p-2.5 rounded-xl bg-neutral-900 border border-neutral-700 text-[11px] text-neutral-300">
                      <span className="font-bold text-brand-orange block">Customer Note:</span>
                      {order.specialInstructions}
                    </div>
                  )}
                </div>

                {/* Status Action Buttons */}
                <div className="p-4 bg-neutral-900/80 border-t border-neutral-700 space-y-2">
                  {order.status === 'PLACED' && (
                    <button
                      onClick={() => updateOrderStatus(order.id, 'CONFIRMED')}
                      className="w-full py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs transition-colors"
                    >
                      Accept Ticket
                    </button>
                  )}

                  {order.status === 'CONFIRMED' && (
                    <button
                      onClick={() => updateOrderStatus(order.id, 'PREPARING')}
                      className="w-full py-2.5 rounded-xl bg-brand-orange hover:bg-brand-orange-hover text-white font-bold text-xs transition-colors flex items-center justify-center gap-1.5"
                    >
                      <Flame className="w-4 h-4 fill-white" />
                      <span>Start Cooking</span>
                    </button>
                  )}

                  {order.status === 'PREPARING' && (
                    <button
                      onClick={() => updateOrderStatus(order.id, 'READY')}
                      className="w-full py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs transition-colors flex items-center justify-center gap-1.5"
                    >
                      <CheckCircle2 className="w-4 h-4" />
                      <span>Mark Ready for Serving / Dispatch</span>
                    </button>
                  )}

                  {order.status === 'READY' && (
                    <button
                      onClick={() => updateOrderStatus(order.id, 'DELIVERED')}
                      className="w-full py-2.5 rounded-xl bg-neutral-700 hover:bg-neutral-600 text-white font-bold text-xs transition-colors"
                    >
                      Complete &amp; Archive Ticket
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="text-center py-24 bg-neutral-800/40 rounded-3xl border border-neutral-800 space-y-4">
          <ChefHat className="w-12 h-12 text-brand-orange mx-auto opacity-60" />
          <h3 className="font-serif font-bold text-xl text-neutral-300">All Orders Clear!</h3>
          <p className="text-xs text-neutral-500 max-w-sm mx-auto">
            No pending tickets in the kitchen. New orders placed by customers or dine-in tables will show up here instantly in real time.
          </p>
        </div>
      )}
    </div>
  );
}
