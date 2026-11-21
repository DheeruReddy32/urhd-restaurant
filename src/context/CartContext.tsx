'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { CartItem, CartItemCustomization, MenuItemData, OrderType, AddressItem } from '@/lib/types';

interface AppliedCoupon {
  code: string;
  discountValue: number;
  discountType: 'PERCENTAGE' | 'FIXED';
  discountAmount: number;
}

interface CartContextType {
  items: CartItem[];
  orderType: OrderType;
  tableNumber: number | null;
  tableId: string | null;
  deliveryAddress: AddressItem | null;
  deliveryInstructions: string;
  appliedCoupon: AppliedCoupon | null;
  itemCount: number;
  subtotal: number;
  tax: number;
  deliveryFee: number;
  discount: number;
  totalAmount: number;
  addToCart: (
    item: MenuItemData,
    quantity: number,
    customizations?: CartItemCustomization[],
    specialInstructions?: string
  ) => void;
  removeFromCart: (cartItemId: string) => void;
  updateQuantity: (cartItemId: string, quantity: number) => void;
  clearCart: () => void;
  setOrderType: (type: OrderType) => void;
  setTable: (tableNumber: number | null, tableId?: string | null) => void;
  setDeliveryAddress: (address: AddressItem | null) => void;
  setDeliveryInstructions: (instructions: string) => void;
  applyCoupon: (code: string) => Promise<{ success: boolean; message: string }>;
  removeCoupon: () => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

const CART_STORAGE_KEY = 'urhd_cart_state_v1';

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [orderType, setOrderType] = useState<OrderType>('DELIVERY');
  const [tableNumber, setTableNumber] = useState<number | null>(null);
  const [tableId, setTableId] = useState<string | null>(null);
  const [deliveryAddress, setDeliveryAddress] = useState<AddressItem | null>(null);
  const [deliveryInstructions, setDeliveryInstructions] = useState<string>('');
  const [appliedCoupon, setAppliedCoupon] = useState<AppliedCoupon | null>(null);
  const [isInitialized, setIsInitialized] = useState(false);

  // Restore cart from localStorage on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem(CART_STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (parsed.items) setItems(parsed.items);
        if (parsed.orderType) setOrderType(parsed.orderType);
        if (parsed.tableNumber) setTableNumber(parsed.tableNumber);
        if (parsed.tableId) setTableId(parsed.tableId);
      }
    } catch (e) {
      console.error('Error loading cart from storage', e);
    } finally {
      setIsInitialized(true);
    }
  }, []);

  // Save cart to localStorage
  useEffect(() => {
    if (!isInitialized) return;
    try {
      localStorage.setItem(
        CART_STORAGE_KEY,
        JSON.stringify({
          items,
          orderType,
          tableNumber,
          tableId,
        })
      );
    } catch (e) {
      console.error('Error persisting cart', e);
    }
  }, [items, orderType, tableNumber, tableId, isInitialized]);

  const addToCart = (
    item: MenuItemData,
    quantity: number,
    customizations: CartItemCustomization[] = [],
    specialInstructions = ''
  ) => {
    const customKey = customizations
      .map((c) => `${c.groupId}:${c.optionId}`)
      .sort()
      .join('|');
    const cartItemId = `${item.id}-${customKey}-${specialInstructions.trim()}`;

    const customExtras = customizations.reduce((acc, curr) => acc + curr.price, 0);
    const unitPrice = item.price + customExtras;

    setItems((prev) => {
      const existing = prev.find((i) => i.cartItemId === cartItemId);
      if (existing) {
        const newQty = existing.quantity + quantity;
        return prev.map((i) =>
          i.cartItemId === cartItemId
            ? {
                ...i,
                quantity: newQty,
                itemTotalPrice: unitPrice * newQty,
              }
            : i
        );
      } else {
        return [
          ...prev,
          {
            cartItemId,
            menuItem: item,
            quantity,
            selectedCustomizations: customizations,
            specialInstructions,
            itemTotalPrice: unitPrice * quantity,
          },
        ];
      }
    });
  };

  const removeFromCart = (cartItemId: string) => {
    setItems((prev) => prev.filter((i) => i.cartItemId !== cartItemId));
  };

  const updateQuantity = (cartItemId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(cartItemId);
      return;
    }
    setItems((prev) =>
      prev.map((i) => {
        if (i.cartItemId === cartItemId) {
          const customExtras = i.selectedCustomizations.reduce((acc, curr) => acc + curr.price, 0);
          const unitPrice = i.menuItem.price + customExtras;
          return {
            ...i,
            quantity,
            itemTotalPrice: unitPrice * quantity,
          };
        }
        return i;
      })
    );
  };

  const clearCart = () => {
    setItems([]);
    setAppliedCoupon(null);
  };

  const setTable = (number: number | null, id: string | null = null) => {
    setTableNumber(number);
    setTableId(id);
    if (number) {
      setOrderType('DINE_IN');
    }
  };

  // Computations
  const itemCount = items.reduce((sum, item) => sum + item.quantity, 0);
  const subtotal = items.reduce((sum, item) => sum + item.itemTotalPrice, 0);
  const tax = Math.round(subtotal * 0.05 * 100) / 100; // 5% GST
  const deliveryFee = orderType === 'DELIVERY' && subtotal > 0 ? (subtotal >= 600 ? 0 : 40) : 0;

  let discount = 0;
  if (appliedCoupon) {
    if (appliedCoupon.discountType === 'PERCENTAGE') {
      discount = Math.round((subtotal * appliedCoupon.discountValue) / 100);
      if (appliedCoupon.discountAmount && discount > appliedCoupon.discountAmount) {
        discount = appliedCoupon.discountAmount;
      }
    } else {
      discount = appliedCoupon.discountValue;
    }
    if (discount > subtotal) discount = subtotal;
  }

  const totalAmount = Math.max(0, subtotal + tax + deliveryFee - discount);

  const applyCoupon = async (code: string) => {
    try {
      const res = await fetch('/api/coupons/apply', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code, subtotal }),
      });
      const data = await res.json();
      if (!res.ok) {
        return { success: false, message: data.error || 'Invalid coupon code' };
      }
      setAppliedCoupon({
        code: data.coupon.code,
        discountType: data.coupon.discountType,
        discountValue: data.coupon.discountValue,
        discountAmount: data.discountAmount,
      });
      return { success: true, message: `Coupon ${data.coupon.code} applied successfully!` };
    } catch (err: any) {
      return { success: false, message: err.message || 'Error applying coupon' };
    }
  };

  const removeCoupon = () => {
    setAppliedCoupon(null);
  };

  return (
    <CartContext.Provider
      value={{
        items,
        orderType,
        tableNumber,
        tableId,
        deliveryAddress,
        deliveryInstructions,
        appliedCoupon,
        itemCount,
        subtotal,
        tax,
        deliveryFee,
        discount,
        totalAmount,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        setOrderType,
        setTable,
        setDeliveryAddress,
        setDeliveryInstructions,
        applyCoupon,
        removeCoupon,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}
