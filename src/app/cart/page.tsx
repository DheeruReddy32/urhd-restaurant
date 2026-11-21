'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useCart } from '@/context/CartContext';
import { useAuth } from '@/context/AuthContext';
import {
  ShoppingBag,
  Trash2,
  Plus,
  Minus,
  QrCode,
  MapPin,
  Utensils,
  CreditCard,
  Banknote,
  CheckCircle2,
  AlertCircle,
  Tag,
  ArrowRight,
  Sparkles,
  Phone,
  ShieldCheck,
} from 'lucide-react';
import confetti from 'canvas-confetti';

export default function CartCheckoutPage() {
  const router = useRouter();
  const {
    items,
    orderType,
    tableNumber,
    deliveryAddress,
    deliveryInstructions,
    appliedCoupon,
    itemCount,
    subtotal,
    tax,
    deliveryFee,
    discount,
    totalAmount,
    removeFromCart,
    updateQuantity,
    clearCart,
    setOrderType,
    setTable,
    setDeliveryAddress,
    setDeliveryInstructions,
    applyCoupon,
    removeCoupon,
  } = useCart();

  const { user } = useAuth();

  // Checkout Form State
  const [customerName, setCustomerName] = useState(user?.name || 'Monkey D. Luffy');
  const [customerPhone, setCustomerPhone] = useState(user?.phone || '+91 98111 22233');
  const [customerEmail, setCustomerEmail] = useState(user?.email || 'luffy@grandline.com');
  const [selectedTable, setSelectedTable] = useState<number>(tableNumber || 4);

  // Address for Delivery
  const [streetAddress, setStreetAddress] = useState(
    deliveryAddress?.street || 'Flat 402, Thousand Sunny Heights, Indiranagar 100ft Rd'
  );
  const [pincode, setPincode] = useState(deliveryAddress?.pincode || '560038');
  const [landmark, setLandmark] = useState(deliveryAddress?.landmark || 'Near Grand Line Blvd');

  // Coupon Input
  const [couponInput, setCouponInput] = useState('');
  const [couponError, setCouponError] = useState('');
  const [couponSuccess, setCouponSuccess] = useState('');

  // Payment Method Selection
  const [paymentMethod, setPaymentMethod] = useState<'COD' | 'UPI_QR' | 'RAZORPAY'>('UPI_QR');
  const [upiRefNumber, setUpiRefNumber] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState('');

  const handleApplyCoupon = async (e: React.FormEvent) => {
    e.preventDefault();
    setCouponError('');
    setCouponSuccess('');
    if (!couponInput.trim()) return;

    const res = await applyCoupon(couponInput.trim());
    if (res.success) {
      setCouponSuccess(res.message);
      setCouponInput('');
    } else {
      setCouponError(res.message);
    }
  };

  const handlePlaceOrder = async () => {
    if (items.length === 0) return;
    setSubmitError('');
    setIsSubmitting(true);

    try {
      if (orderType === 'DINE_IN' && !selectedTable) {
        throw new Error('Please select a valid dining table number');
      }

      if (orderType === 'DELIVERY' && (!streetAddress || !pincode)) {
        throw new Error('Please provide your complete delivery street address and pincode');
      }

      if (paymentMethod === 'UPI_QR' && (!upiRefNumber || upiRefNumber.trim().length < 4)) {
        throw new Error('Please enter the 12-digit UPI UTR / Transaction Reference number');
      }

      // Step 1: Create Order in database
      const orderPayload = {
        customerName,
        customerPhone,
        customerEmail,
        orderType,
        tableNumber: orderType === 'DINE_IN' ? selectedTable : null,
        deliveryAddressId: deliveryAddress?.id || null,
        newDeliveryAddress:
          orderType === 'DELIVERY' && !deliveryAddress?.id
            ? {
                label: 'Home',
                street: streetAddress,
                landmark,
                city: 'Bangalore',
                state: 'Karnataka',
                pincode,
              }
            : null,
        specialInstructions: deliveryInstructions,
        paymentMethod,
        items,
        couponCode: appliedCoupon?.code || null,
      };

      const orderRes = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(orderPayload),
      });

      const orderData = await orderRes.json();
      if (!orderRes.ok) {
        throw new Error(orderData.error || 'Failed to place order');
      }

      const createdOrder = orderData.order;

      // Step 2: Payment Verification
      if (paymentMethod === 'RAZORPAY') {
        // Create Razorpay payment token
        const rzpRes = await fetch('/api/payments/create-razorpay', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ orderId: createdOrder.id }),
        });
        const rzpData = await rzpRes.json();

        // Server-side verify payment
        const verifyRes = await fetch('/api/payments/verify', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            orderId: createdOrder.id,
            razorpayOrderId: rzpData.razorpayOrderId,
            razorpayPaymentId: `pay_test_${Date.now()}`,
            razorpaySignature: `test_sig_${Date.now()}`,
            paymentMethod: 'RAZORPAY',
          }),
        });
        if (!verifyRes.ok) {
          throw new Error('Payment verification failed');
        }
      } else if (paymentMethod === 'UPI_QR') {
        // Verify UPI transaction ID
        const verifyRes = await fetch('/api/payments/verify', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            orderId: createdOrder.id,
            paymentMethod: 'UPI_QR',
            upiTransactionId: upiRefNumber.trim(),
          }),
        });
        if (!verifyRes.ok) {
          throw new Error('UPI reference verification failed');
        }
      }

      // Confetti celebration!
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 },
      });

      clearCart();
      router.push(`/orders/${createdOrder.orderNumber}`);
    } catch (err: any) {
      console.error('Order placement error:', err);
      setSubmitError(err.message || 'Error processing order');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (items.length === 0) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20 text-center space-y-6">
        <div className="w-20 h-20 rounded-full bg-brand-beige mx-auto flex items-center justify-center text-brand-orange shadow-inner">
          <ShoppingBag className="w-10 h-10" />
        </div>
        <div className="space-y-2">
          <h1 className="font-serif font-bold text-3xl text-brand-charcoal">Your Cart is Empty</h1>
          <p className="text-xs sm:text-sm text-neutral-500 max-w-sm mx-auto">
            Discover our artisanal dishes, superfood bowls, and Grand Line anime creations.
          </p>
        </div>
        <Link
          href="/menu"
          className="inline-flex items-center gap-2 px-8 py-3.5 rounded-2xl bg-brand-orange hover:bg-brand-orange-hover text-white font-bold text-xs shadow-md transition-all"
        >
          <span>Explore Digital Menu</span>
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Page Title */}
      <div className="space-y-1">
        <h1 className="font-serif font-bold text-3xl sm:text-4xl text-brand-charcoal">
          Order Review &amp; Checkout
        </h1>
        <p className="text-xs text-neutral-500">
          Seamless ordering for Home Delivery or Dine-In Table Ordering.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: Cart Items & Order Mode Details */}
        <div className="lg:col-span-7 space-y-6">
          {/* Order Mode Toggle (Delivery vs Dine-In) */}
          <div className="bg-white p-5 rounded-3xl border border-brand-beige-dark shadow-xs space-y-4">
            <label className="block text-xs font-bold text-brand-charcoal uppercase tracking-wider">
              1. Select Order Type
            </label>

            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setOrderType('DELIVERY')}
                className={`p-4 rounded-2xl border text-left flex items-start gap-3 transition-all ${
                  orderType === 'DELIVERY'
                    ? 'bg-brand-orange/5 border-brand-orange ring-1 ring-brand-orange text-brand-charcoal'
                    : 'bg-neutral-50 border-neutral-200 text-neutral-600 hover:bg-neutral-100'
                }`}
              >
                <div
                  className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${
                    orderType === 'DELIVERY'
                      ? 'bg-brand-orange text-white'
                      : 'bg-neutral-200 text-neutral-600'
                  }`}
                >
                  <MapPin className="w-5 h-5" />
                </div>
                <div>
                  <div className="font-bold text-sm">Home Delivery</div>
                  <div className="text-[11px] text-neutral-500 mt-0.5">
                    Fast 30-45 mins doorstep delivery
                  </div>
                </div>
              </button>

              <button
                type="button"
                onClick={() => {
                  setOrderType('DINE_IN');
                  setTable(selectedTable);
                }}
                className={`p-4 rounded-2xl border text-left flex items-start gap-3 transition-all ${
                  orderType === 'DINE_IN'
                    ? 'bg-brand-orange/5 border-brand-orange ring-1 ring-brand-orange text-brand-charcoal'
                    : 'bg-neutral-50 border-neutral-200 text-neutral-600 hover:bg-neutral-100'
                }`}
              >
                <div
                  className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${
                    orderType === 'DINE_IN'
                      ? 'bg-brand-orange text-white'
                      : 'bg-neutral-200 text-neutral-600'
                  }`}
                >
                  <QrCode className="w-5 h-5" />
                </div>
                <div>
                  <div className="font-bold text-sm">Dine-In Table Order</div>
                  <div className="text-[11px] text-neutral-500 mt-0.5">
                    Direct routing to kitchen chefs
                  </div>
                </div>
              </button>
            </div>

            {/* Mode Specific Inputs */}
            {orderType === 'DINE_IN' ? (
              <div className="p-4 bg-amber-500/10 rounded-2xl border border-amber-500/20 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-xs text-amber-900">
                    Select Your Table Number:
                  </span>
                  <span className="text-[10px] text-amber-800 font-mono">
                    Current: Table #{selectedTable}
                  </span>
                </div>
                <div className="grid grid-cols-6 gap-2">
                  {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map((num) => (
                    <button
                      key={num}
                      type="button"
                      onClick={() => {
                        setSelectedTable(num);
                        setTable(num);
                      }}
                      className={`py-2 rounded-xl text-xs font-bold border transition-all ${
                        selectedTable === num
                          ? 'bg-brand-orange text-white border-brand-orange shadow-sm scale-105'
                          : 'bg-white border-neutral-200 text-neutral-700 hover:bg-neutral-100'
                      }`}
                    >
                      T-{num}
                    </button>
                  ))}
                </div>
                <p className="text-[10px] text-amber-800 italic">
                  * Note: Table 4, 5, 6 are in The Grand Line Anime Deck!
                </p>
              </div>
            ) : (
              <div className="space-y-3 pt-2">
                <div className="space-y-1">
                  <label className="block text-xs font-bold text-neutral-700">
                    Delivery Street Address
                  </label>
                  <input
                    type="text"
                    value={streetAddress}
                    onChange={(e) => setStreetAddress(e.target.value)}
                    placeholder="House/Flat number, Building, Street..."
                    className="w-full px-3.5 py-2.5 rounded-xl border border-neutral-200 text-xs text-brand-charcoal bg-white focus:outline-none focus:border-brand-orange"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="block text-xs font-bold text-neutral-700">Landmark</label>
                    <input
                      type="text"
                      value={landmark}
                      onChange={(e) => setLandmark(e.target.value)}
                      placeholder="e.g. Near Indiranagar Metro"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-neutral-200 text-xs text-brand-charcoal bg-white focus:outline-none focus:border-brand-orange"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="block text-xs font-bold text-neutral-700">Pincode</label>
                    <input
                      type="text"
                      value={pincode}
                      onChange={(e) => setPincode(e.target.value)}
                      placeholder="560038"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-neutral-200 text-xs text-brand-charcoal bg-white focus:outline-none focus:border-brand-orange"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="block text-xs font-bold text-neutral-700">
                    Delivery Rider Instructions
                  </label>
                  <input
                    type="text"
                    value={deliveryInstructions}
                    onChange={(e) => setDeliveryInstructions(e.target.value)}
                    placeholder="e.g. Leave with security, ring door bell twice..."
                    className="w-full px-3.5 py-2.5 rounded-xl border border-neutral-200 text-xs text-brand-charcoal bg-white focus:outline-none focus:border-brand-orange"
                  />
                </div>
              </div>
            )}
          </div>

          {/* Cart Items List */}
          <div className="bg-white p-5 rounded-3xl border border-brand-beige-dark shadow-xs space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-neutral-100">
              <h3 className="font-serif font-bold text-lg text-brand-charcoal flex items-center gap-2">
                <ShoppingBag className="w-4 h-4 text-brand-orange" />
                <span>Your Selected Delights ({itemCount})</span>
              </h3>
              <button
                onClick={clearCart}
                className="text-xs text-red-500 hover:underline font-medium"
              >
                Clear Cart
              </button>
            </div>

            <div className="divide-y divide-neutral-100 space-y-4">
              {items.map((item) => (
                <div
                  key={item.cartItemId}
                  className="pt-4 first:pt-0 flex items-start justify-between gap-4"
                >
                  {/* Dish Thumbnail */}
                  <div className="relative w-16 h-16 rounded-xl overflow-hidden shrink-0 bg-neutral-100">
                    <Image
                      src={item.menuItem.imageUrl}
                      alt={item.menuItem.name}
                      fill
                      className="object-cover"
                      sizes="64px"
                    />
                  </div>

                  {/* Details */}
                  <div className="flex-1 space-y-1">
                    <div className="flex items-center gap-1.5">
                      <span
                        className={`w-2 h-2 rounded-full ${
                          item.menuItem.isVeg ? 'bg-emerald-600' : 'bg-red-600'
                        }`}
                      />
                      <h4 className="font-bold text-xs sm:text-sm text-brand-charcoal">
                        {item.menuItem.name}
                      </h4>
                    </div>

                    {/* Selected Customizations Badges */}
                    {item.selectedCustomizations && item.selectedCustomizations.length > 0 && (
                      <div className="flex flex-wrap gap-1 pt-0.5">
                        {item.selectedCustomizations.map((c, i) => (
                          <span
                            key={i}
                            className="bg-brand-beige px-2 py-0.5 rounded text-[10px] text-brand-charcoal font-medium"
                          >
                            {c.optionName} {c.price > 0 ? `(+₹${c.price})` : ''}
                          </span>
                        ))}
                      </div>
                    )}

                    {item.specialInstructions && (
                      <p className="text-[10px] text-neutral-500 italic">
                        Note: &quot;{item.specialInstructions}&quot;
                      </p>
                    )}

                    <div className="font-mono text-xs font-bold text-brand-orange pt-1">
                      ₹{Math.round(item.itemTotalPrice)}
                    </div>
                  </div>

                  {/* Quantity Actions */}
                  <div className="flex items-center border border-neutral-200 rounded-xl bg-neutral-50 p-1 shrink-0">
                    <button
                      onClick={() => updateQuantity(item.cartItemId, item.quantity - 1)}
                      className="w-7 h-7 rounded-lg flex items-center justify-center text-neutral-600 hover:bg-white"
                      aria-label="Decrease"
                    >
                      {item.quantity === 1 ? <Trash2 className="w-3.5 h-3.5 text-red-500" /> : <Minus className="w-3.5 h-3.5" />}
                    </button>
                    <span className="w-8 text-center font-bold text-xs text-brand-charcoal">
                      {item.quantity}
                    </span>
                    <button
                      onClick={() => updateQuantity(item.cartItemId, item.quantity + 1)}
                      className="w-7 h-7 rounded-lg flex items-center justify-center text-neutral-600 hover:bg-white"
                      aria-label="Increase"
                    >
                      <Plus className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column: Bill Breakdown, Coupon, Payment & Place Order */}
        <div className="lg:col-span-5 space-y-6">
          {/* Coupon Code Card */}
          <div className="bg-white p-5 rounded-3xl border border-brand-beige-dark shadow-xs space-y-3">
            <div className="flex items-center gap-2 text-xs font-bold text-brand-charcoal">
              <Tag className="w-4 h-4 text-brand-orange" />
              <span>Apply Promo Coupon</span>
            </div>

            {appliedCoupon ? (
              <div className="p-3 rounded-2xl bg-emerald-50 border border-emerald-200 flex items-center justify-between text-xs">
                <div>
                  <span className="font-bold text-emerald-800">{appliedCoupon.code}</span>
                  <span className="text-emerald-700 block text-[11px]">
                    Saved ₹{Math.round(discount)} on this order
                  </span>
                </div>
                <button
                  onClick={removeCoupon}
                  className="text-xs text-red-600 font-semibold hover:underline"
                >
                  Remove
                </button>
              </div>
            ) : (
              <form onSubmit={handleApplyCoupon} className="flex gap-2">
                <input
                  type="text"
                  value={couponInput}
                  onChange={(e) => setCouponInput(e.target.value.toUpperCase())}
                  placeholder="e.g. WELCOME50, GRANDLINE20"
                  className="flex-1 px-3.5 py-2 rounded-xl border border-neutral-200 text-xs uppercase font-mono tracking-wider focus:outline-none focus:border-brand-orange"
                />
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-brand-charcoal text-white text-xs font-bold hover:bg-neutral-800 transition-colors"
                >
                  Apply
                </button>
              </form>
            )}

            {couponError && <p className="text-[11px] text-red-600">{couponError}</p>}
            {couponSuccess && <p className="text-[11px] text-emerald-600">{couponSuccess}</p>}

            <div className="pt-1 flex flex-wrap gap-1.5 text-[10px]">
              <span
                onClick={() => setCouponInput('WELCOME50')}
                className="cursor-pointer bg-neutral-100 hover:bg-neutral-200 text-neutral-600 px-2 py-0.5 rounded font-mono"
              >
                WELCOME50
              </span>
              <span
                onClick={() => setCouponInput('GRANDLINE20')}
                className="cursor-pointer bg-neutral-100 hover:bg-neutral-200 text-neutral-600 px-2 py-0.5 rounded font-mono"
              >
                GRANDLINE20
              </span>
              <span
                onClick={() => setCouponInput('RUSTIC100')}
                className="cursor-pointer bg-neutral-100 hover:bg-neutral-200 text-neutral-600 px-2 py-0.5 rounded font-mono"
              >
                RUSTIC100
              </span>
            </div>
          </div>

          {/* Payment Method Selector */}
          <div className="bg-white p-5 rounded-3xl border border-brand-beige-dark shadow-xs space-y-3">
            <label className="block text-xs font-bold text-brand-charcoal uppercase tracking-wider">
              2. Payment Options
            </label>

            <div className="space-y-2">
              {/* Instant UPI QR */}
              <div
                onClick={() => setPaymentMethod('UPI_QR')}
                className={`p-3.5 rounded-2xl border cursor-pointer transition-all ${
                  paymentMethod === 'UPI_QR'
                    ? 'bg-brand-orange/5 border-brand-orange ring-1 ring-brand-orange'
                    : 'bg-neutral-50 border-neutral-200 hover:bg-neutral-100'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <QrCode className="w-5 h-5 text-brand-orange" />
                    <div>
                      <span className="font-bold text-xs text-brand-charcoal block">
                        Instant UPI Payment (GPay / PhonePe / Paytm)
                      </span>
                      <span className="text-[10px] text-neutral-500">
                        Scan QR code &amp; enter UTR reference
                      </span>
                    </div>
                  </div>
                  <span className="text-[10px] bg-emerald-100 text-emerald-800 font-bold px-1.5 py-0.5 rounded">
                    0% Fee
                  </span>
                </div>

                {paymentMethod === 'UPI_QR' && (
                  <div className="mt-3 p-3 bg-white rounded-xl border border-neutral-200 space-y-2 animate-fadeIn">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-mono text-neutral-600">VPA: urhd@okaxis</span>
                      <span className="font-bold text-brand-orange">₹{Math.round(totalAmount)}</span>
                    </div>
                    <input
                      type="text"
                      value={upiRefNumber}
                      onChange={(e) => setUpiRefNumber(e.target.value)}
                      placeholder="Enter 12-digit UPI UTR / Ref (e.g. 402918239012)"
                      className="w-full px-3 py-1.5 rounded-lg border border-neutral-200 text-xs font-mono focus:outline-none focus:border-brand-orange"
                    />
                  </div>
                )}
              </div>

              {/* Razorpay Online */}
              <div
                onClick={() => setPaymentMethod('RAZORPAY')}
                className={`p-3.5 rounded-2xl border cursor-pointer transition-all ${
                  paymentMethod === 'RAZORPAY'
                    ? 'bg-brand-orange/5 border-brand-orange ring-1 ring-brand-orange'
                    : 'bg-neutral-50 border-neutral-200 hover:bg-neutral-100'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <CreditCard className="w-5 h-5 text-blue-600" />
                    <div>
                      <span className="font-bold text-xs text-brand-charcoal block">
                        Razorpay Gateway (Cards / NetBanking / UPI)
                      </span>
                      <span className="text-[10px] text-neutral-500">
                        Secure Sandbox &amp; Live Indian payment rails
                      </span>
                    </div>
                  </div>
                  <ShieldCheck className="w-4 h-4 text-emerald-600" />
                </div>
              </div>

              {/* Cash On Delivery / Pay At Counter */}
              <div
                onClick={() => setPaymentMethod('COD')}
                className={`p-3.5 rounded-2xl border cursor-pointer transition-all ${
                  paymentMethod === 'COD'
                    ? 'bg-brand-orange/5 border-brand-orange ring-1 ring-brand-orange'
                    : 'bg-neutral-50 border-neutral-200 hover:bg-neutral-100'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <Banknote className="w-5 h-5 text-neutral-600" />
                  <div>
                    <span className="font-bold text-xs text-brand-charcoal block">
                      {orderType === 'DINE_IN' ? 'Pay at Counter / Table' : 'Cash on Delivery (COD)'}
                    </span>
                    <span className="text-[10px] text-neutral-500">
                      Pay upon receiving your meal
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Bill Summary Breakdown */}
          <div className="bg-white p-5 rounded-3xl border border-brand-beige-dark shadow-xs space-y-3">
            <h3 className="font-serif font-bold text-base text-brand-charcoal">
              Order Total Summary
            </h3>

            <div className="space-y-2 text-xs text-neutral-600">
              <div className="flex justify-between">
                <span>Subtotal ({itemCount} items)</span>
                <span className="font-mono">₹{Math.round(subtotal)}</span>
              </div>

              <div className="flex justify-between">
                <span>GST (5%)</span>
                <span className="font-mono">₹{tax}</span>
              </div>

              <div className="flex justify-between">
                <span>Delivery Fee</span>
                <span className="font-mono">
                  {orderType === 'DINE_IN'
                    ? 'Free (Dine-In)'
                    : deliveryFee === 0
                    ? 'FREE (Orders > ₹600)'
                    : `₹${deliveryFee}`}
                </span>
              </div>

              {discount > 0 && (
                <div className="flex justify-between text-emerald-600 font-semibold">
                  <span>Coupon Discount</span>
                  <span className="font-mono">-₹{Math.round(discount)}</span>
                </div>
              )}

              <div className="pt-3 border-t border-neutral-200 flex justify-between items-baseline font-bold text-brand-charcoal">
                <span className="text-sm">Final Amount Payable</span>
                <span className="font-serif font-black text-2xl text-brand-orange">
                  ₹{Math.round(totalAmount)}
                </span>
              </div>
            </div>

            {/* Loyalty Points Earning Badge */}
            <div className="p-2.5 bg-brand-gold/10 rounded-xl border border-brand-gold/30 text-[11px] text-amber-900 flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-brand-orange shrink-0" />
              <span>
                You will earn{' '}
                <strong className="text-brand-charcoal">
                  +{Math.floor(totalAmount / 20)} Pirate Berries
                </strong>{' '}
                loyalty points with this order!
              </span>
            </div>

            {submitError && (
              <div className="p-3 bg-red-50 border border-red-200 text-red-700 text-xs rounded-xl flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{submitError}</span>
              </div>
            )}

            {/* Place Order Button */}
            <button
              onClick={handlePlaceOrder}
              disabled={isSubmitting}
              className="w-full py-4 rounded-2xl bg-brand-orange hover:bg-brand-orange-hover text-white font-bold text-sm shadow-md hover:shadow-orange-glow transition-all flex items-center justify-center gap-2 disabled:opacity-50"
            >
              <span>
                {isSubmitting
                  ? 'Confirming Order...'
                  : `Place Order • ₹${Math.round(totalAmount)}`}
              </span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
