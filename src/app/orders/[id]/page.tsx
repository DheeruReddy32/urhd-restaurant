'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import {
  CheckCircle2,
  Clock,
  MapPin,
  QrCode,
  Utensils,
  ChefHat,
  Bike,
  PackageCheck,
  RefreshCw,
  Phone,
  AlertCircle,
  FileText,
  ArrowLeft,
  Flame,
} from 'lucide-react';
import { OrderData, OrderStatus } from '@/lib/types';

const STATUS_STEPS: { key: OrderStatus; label: string; desc: string }[] = [
  { key: 'PLACED', label: 'Order Placed', desc: 'Received by URHD servers' },
  { key: 'CONFIRMED', label: 'Order Confirmed', desc: 'Kitchen accepted the ticket' },
  { key: 'PREPARING', label: 'Chef Cooking', desc: 'Pots sizzling in kitchen' },
  { key: 'READY', label: 'Ready / Out', desc: 'Packed or serving to table' },
  { key: 'DELIVERED', label: 'Delivered / Served', desc: 'Enjoy your meal!' },
];

export default function OrderTrackingPage() {
  const params = useParams();
  const orderId = params.id as string;

  const [order, setOrder] = useState<OrderData | null>(null);
  const [loading, setLoading] = useState(true);
  const [lastUpdated, setLastUpdated] = useState<Date>(new Date());

  const fetchOrder = async () => {
    try {
      const res = await fetch(`/api/orders/${orderId}`);
      if (res.ok) {
        const data = await res.json();
        setOrder(data.order);
        setLastUpdated(new Date());
      }
    } catch (err) {
      console.error('Tracking fetch error:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrder();
    // Poll every 5 seconds for real-time status updates
    const interval = setInterval(fetchOrder, 5000);
    return () => clearInterval(interval);
  }, [orderId]);

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20 text-center space-y-4">
        <RefreshCw className="w-8 h-8 text-brand-orange animate-spin mx-auto" />
        <p className="text-xs text-neutral-500 font-medium">Loading live order telemetry...</p>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="max-w-md mx-auto px-4 py-20 text-center space-y-4">
        <AlertCircle className="w-12 h-12 text-red-500 mx-auto" />
        <h2 className="font-serif font-bold text-2xl">Order Not Found</h2>
        <p className="text-xs text-neutral-500">
          We could not locate an order matching ID &quot;{orderId}&quot;. Please check the link or view your order history.
        </p>
        <Link
          href="/menu"
          className="inline-block px-6 py-2.5 rounded-xl bg-brand-orange text-white text-xs font-bold"
        >
          Return to Menu
        </Link>
      </div>
    );
  }

  const currentStepIndex = STATUS_STEPS.findIndex((s) => s.key === order.status);
  const isCancelled = order.status === 'CANCELLED';

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Top Bar with Order Number and Live Refresh Status */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-brand-beige-dark">
        <div className="space-y-1">
          <Link
            href="/profile"
            className="inline-flex items-center gap-1.5 text-xs text-neutral-500 hover:text-brand-orange transition-colors mb-1"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Order History</span>
          </Link>
          <div className="flex items-center gap-3">
            <h1 className="font-serif font-bold text-2xl sm:text-3xl text-brand-charcoal">
              Order {order.orderNumber}
            </h1>
            <span
              className={`px-3 py-1 rounded-full text-xs font-bold ${
                order.status === 'DELIVERED'
                  ? 'bg-emerald-100 text-emerald-800'
                  : order.status === 'CANCELLED'
                  ? 'bg-red-100 text-red-800'
                  : 'bg-brand-orange/15 text-brand-orange animate-pulse'
              }`}
            >
              ● {order.status}
            </span>
          </div>
          <p className="text-xs text-neutral-500">
            Placed on {new Date(order.createdAt).toLocaleDateString('en-IN', {
              day: 'numeric',
              month: 'short',
              hour: '2-digit',
              minute: '2-digit',
            })}
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={fetchOrder}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white border border-neutral-200 text-xs font-semibold text-neutral-600 hover:bg-neutral-50 shadow-xs"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Sync Status</span>
          </button>
          <button
            onClick={() => window.print()}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-brand-charcoal text-white text-xs font-semibold hover:bg-neutral-800 shadow-xs"
          >
            <FileText className="w-3.5 h-3.5" />
            <span>Print Receipt</span>
          </button>
        </div>
      </div>

      {/* Real-time Order Progress Timeline */}
      <div className="bg-white p-6 sm:p-8 rounded-3xl border border-brand-beige-dark shadow-rustic space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="font-serif font-bold text-lg text-brand-charcoal flex items-center gap-2">
            <Clock className="w-5 h-5 text-brand-orange" />
            <span>Live Kitchen &amp; Delivery Progress</span>
          </h2>

          <div className="text-right">
            <span className="text-[10px] text-neutral-400 block uppercase tracking-wider">
              Estimated Time
            </span>
            <span className="font-serif font-bold text-base text-brand-orange">
              {order.estimatedTime || (order.orderType === 'DINE_IN' ? '15-20 mins' : '30-40 mins')}
            </span>
          </div>
        </div>

        {isCancelled ? (
          <div className="p-4 rounded-2xl bg-red-50 border border-red-200 text-red-800 text-xs flex items-center gap-3">
            <AlertCircle className="w-6 h-6 shrink-0 text-red-600" />
            <div>
              <span className="font-bold text-sm block">Order Cancelled</span>
              <span>This order was cancelled. Any online payment has been initiated for refund.</span>
            </div>
          </div>
        ) : (
          <div className="relative pt-4 pb-2">
            {/* Timeline Progress Bar Line */}
            <div className="hidden md:block absolute top-1/2 left-8 right-8 h-1 bg-neutral-200 -translate-y-5 -z-0">
              <div
                className="h-full bg-brand-orange transition-all duration-700"
                style={{
                  width: `${(Math.max(0, currentStepIndex) / (STATUS_STEPS.length - 1)) * 100}%`,
                }}
              />
            </div>

            {/* Steps */}
            <div className="grid grid-cols-1 md:grid-cols-5 gap-4 relative z-10">
              {STATUS_STEPS.map((step, idx) => {
                const isPassed = currentStepIndex >= idx;
                const isCurrent = currentStepIndex === idx;

                return (
                  <div
                    key={step.key}
                    className="flex md:flex-col items-center md:text-center gap-3 md:gap-2"
                  >
                    <div
                      className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-xs shrink-0 transition-all ${
                        isCurrent
                          ? 'bg-brand-orange text-white shadow-orange-glow ring-4 ring-brand-orange/20 scale-110'
                          : isPassed
                          ? 'bg-emerald-600 text-white'
                          : 'bg-neutral-100 text-neutral-400 border border-neutral-200'
                      }`}
                    >
                      {isPassed && !isCurrent ? (
                        <CheckCircle2 className="w-5 h-5" />
                      ) : (
                        <span>{idx + 1}</span>
                      )}
                    </div>

                    <div>
                      <div
                        className={`text-xs font-bold ${
                          isCurrent
                            ? 'text-brand-orange'
                            : isPassed
                            ? 'text-brand-charcoal'
                            : 'text-neutral-400'
                        }`}
                      >
                        {step.label}
                      </div>
                      <div className="text-[10px] text-neutral-500 leading-tight">
                        {step.desc}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>

      {/* Order Details Grid */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
        {/* Left: Ordered Items Breakdown */}
        <div className="md:col-span-7 bg-white p-6 rounded-3xl border border-brand-beige-dark shadow-xs space-y-4">
          <h3 className="font-serif font-bold text-base text-brand-charcoal flex items-center gap-2">
            <Utensils className="w-4 h-4 text-brand-orange" />
            <span>Ordered Items &amp; Customizations</span>
          </h3>

          <div className="divide-y divide-neutral-100 space-y-3">
            {order.items.map((item) => {
              const customizations = item.customizationsJson
                ? JSON.parse(item.customizationsJson)
                : [];

              return (
                <div key={item.id} className="pt-3 first:pt-0 flex items-start gap-3">
                  <div className="relative w-14 h-14 rounded-xl overflow-hidden shrink-0 bg-neutral-100">
                    <Image
                      src={item.menuItem.imageUrl}
                      alt={item.menuItem.name}
                      fill
                      className="object-cover"
                      sizes="56px"
                    />
                  </div>

                  <div className="flex-1 space-y-0.5">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-xs text-brand-charcoal">
                        {item.quantity}x {item.menuItem.name}
                      </span>
                      <span className="font-mono text-xs font-bold text-brand-charcoal">
                        ₹{item.totalPrice}
                      </span>
                    </div>

                    {customizations.length > 0 && (
                      <div className="flex flex-wrap gap-1 pt-0.5">
                        {customizations.map((c: any, i: number) => (
                          <span
                            key={i}
                            className="text-[10px] bg-brand-beige text-brand-charcoal px-1.5 py-0.5 rounded"
                          >
                            {c.optionName} {c.price > 0 ? `(+₹${c.price})` : ''}
                          </span>
                        ))}
                      </div>
                    )}

                    {item.specialNotes && (
                      <p className="text-[10px] text-neutral-500 italic">
                        Chef Note: {item.specialNotes}
                      </p>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          {order.specialInstructions && (
            <div className="p-3 bg-neutral-50 rounded-xl text-xs text-neutral-600 border border-neutral-100">
              <span className="font-bold text-brand-charcoal block">Order Instructions:</span>
              <span>{order.specialInstructions}</span>
            </div>
          )}
        </div>

        {/* Right: Payment & Destination Info */}
        <div className="md:col-span-5 space-y-6">
          {/* Destination Card (Table or Delivery) */}
          <div className="bg-white p-6 rounded-3xl border border-brand-beige-dark shadow-xs space-y-3">
            <h3 className="font-serif font-bold text-sm text-brand-charcoal uppercase tracking-wider">
              Destination Details
            </h3>

            {order.orderType === 'DINE_IN' ? (
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-brand-orange font-bold text-base">
                  <QrCode className="w-5 h-5" />
                  <span>Dine-In Table #{order.table ? order.table.number : '4'}</span>
                </div>
                <p className="text-xs text-neutral-600">
                  Section: <strong>{order.table?.section || 'The Grand Line Anime Deck'}</strong>
                </p>
                <p className="text-[11px] text-neutral-500">
                  Kitchen staff will serve this order directly to your table.
                </p>
              </div>
            ) : (
              <div className="space-y-2 text-xs text-neutral-700">
                <div className="flex items-center gap-1.5 text-brand-orange font-bold">
                  <MapPin className="w-4 h-4" />
                  <span>Home Delivery Address</span>
                </div>
                <p className="font-medium">
                  {order.deliveryAddress?.street || 'Indiranagar 100ft Road, Bangalore 560038'}
                </p>
                {order.deliveryAddress?.landmark && (
                  <p className="text-neutral-500">
                    Landmark: {order.deliveryAddress.landmark}
                  </p>
                )}
              </div>
            )}

            <div className="pt-2 border-t border-neutral-100 text-xs text-neutral-600 space-y-1">
              <div>Guest: <strong>{order.customerName}</strong></div>
              <div>Phone: <strong>{order.customerPhone}</strong></div>
            </div>
          </div>

          {/* Payment Status Card */}
          <div className="bg-white p-6 rounded-3xl border border-brand-beige-dark shadow-xs space-y-3">
            <h3 className="font-serif font-bold text-sm text-brand-charcoal uppercase tracking-wider">
              Payment Summary
            </h3>

            <div className="space-y-1.5 text-xs text-neutral-600">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span>₹{order.subtotal}</span>
              </div>
              <div className="flex justify-between">
                <span>Taxes</span>
                <span>₹{order.tax}</span>
              </div>
              <div className="flex justify-between">
                <span>Delivery Fee</span>
                <span>₹{order.deliveryFee}</span>
              </div>
              {order.discount > 0 && (
                <div className="flex justify-between text-emerald-600 font-semibold">
                  <span>Discount</span>
                  <span>-₹{order.discount}</span>
                </div>
              )}
              <div className="pt-2 border-t border-neutral-200 flex justify-between font-bold text-sm text-brand-charcoal">
                <span>Total Amount</span>
                <span className="font-serif font-black text-lg text-brand-orange">
                  ₹{order.totalAmount}
                </span>
              </div>
            </div>

            <div className="pt-3 border-t border-neutral-100 flex items-center justify-between text-xs">
              <span className="text-neutral-500">
                Method: <strong>{order.payment?.paymentMethod || 'UPI'}</strong>
              </span>
              <span
                className={`font-bold px-2 py-0.5 rounded text-[11px] ${
                  order.payment?.paymentStatus === 'COMPLETED'
                    ? 'bg-emerald-100 text-emerald-800'
                    : 'bg-amber-100 text-amber-800'
                }`}
              >
                {order.payment?.paymentStatus === 'COMPLETED' ? 'PAID ✓' : 'PAYMENT PENDING'}
              </span>
            </div>

            {order.payment?.transactionId && (
              <div className="text-[10px] font-mono text-neutral-400">
                Txn ID: {order.payment.transactionId}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
