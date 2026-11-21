'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import {
  TrendingUp,
  DollarSign,
  ShoppingBag,
  Clock,
  AlertTriangle,
  Users,
  Utensils,
  Boxes,
  Tag,
  Plus,
  Trash2,
  Edit3,
  CheckCircle2,
  XCircle,
  RefreshCw,
  Search,
  Check,
  X,
  Play,
  Film,
  Eye,
  Sliders,
} from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { OrderData, MenuItemData, InventoryItemData, CouponData } from '@/lib/types';

export default function AdminDashboardPage() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<'overview' | 'orders' | 'menu' | 'inventory' | 'offers'>('overview');

  // Metrics Data
  const [metrics, setMetrics] = useState<any>(null);
  const [bestSellers, setBestSellers] = useState<any[]>([]);
  const [lowStockItems, setLowStockItems] = useState<any[]>([]);
  const [orders, setOrders] = useState<OrderData[]>([]);
  const [menuItems, setMenuItems] = useState<MenuItemData[]>([]);
  const [inventory, setInventory] = useState<InventoryItemData[]>([]);
  const [loading, setLoading] = useState(true);

  // New Dish Modal State
  const [dishModalOpen, setDishModalOpen] = useState(false);
  const [editingDish, setEditingDish] = useState<MenuItemData | null>(null);
  const [newDishName, setNewDishName] = useState('');
  const [newDishPrice, setNewDishPrice] = useState('');
  const [newDishCategory, setNewDishCategory] = useState('grand-line-specials');
  const [newDishDescription, setNewDishDescription] = useState('');
  const [newDishImage, setNewDishImage] = useState('');
  const [newDishVideo, setNewDishVideo] = useState('');
  const [newDishVeg, setNewDishVeg] = useState(true);
  const [newDishPrepTime, setNewDishPrepTime] = useState('15');
  const [newDishCalories, setNewDishCalories] = useState('450');
  const [newDishIngredients, setNewDishIngredients] = useState('');

  // Fetch Dashboard Metrics & Orders
  const loadDashboardData = async () => {
    setLoading(true);
    try {
      // Metrics
      const mRes = await fetch('/api/admin/metrics');
      if (mRes.ok) {
        const mData = await mRes.json();
        setMetrics(mData.metrics);
        setBestSellers(mData.bestSellers || []);
        setLowStockItems(mData.lowStockItems || []);
      }

      // Orders
      const oRes = await fetch('/api/orders');
      if (oRes.ok) {
        const oData = await oRes.json();
        setOrders(oData.orders || []);
      }

      // Menu
      const menuRes = await fetch('/api/menu');
      if (menuRes.ok) {
        const menuData = await menuRes.json();
        setMenuItems(menuData.items || []);
      }

      // Inventory
      const invRes = await fetch('/api/admin/inventory');
      if (invRes.ok) {
        const invData = await invRes.json();
        setInventory(invData.items || []);
      }
    } catch (err) {
      console.error('Error fetching admin data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDashboardData();
  }, []);

  const handleUpdateOrderStatus = async (orderId: string, status: string) => {
    try {
      await fetch(`/api/orders/${orderId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status }),
      });
      loadDashboardData();
    } catch (err) {
      console.error(err);
    }
  };

  const handleToggleDishAvailability = async (dish: MenuItemData) => {
    try {
      await fetch(`/api/menu/${dish.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isAvailable: !dish.isAvailable }),
      });
      loadDashboardData();
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeleteDish = async (dishId: string) => {
    if (!confirm('Are you sure you want to remove this dish from the menu?')) return;
    try {
      await fetch(`/api/menu/${dishId}`, { method: 'DELETE' });
      loadDashboardData();
    } catch (err) {
      console.error(err);
    }
  };

  const handleSaveDish = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const payload = {
        name: newDishName,
        price: parseFloat(newDishPrice),
        categoryId: newDishCategory,
        description: newDishDescription,
        imageUrl: newDishImage,
        videoUrl: newDishVideo || null,
        isVeg: newDishVeg,
        prepTime: parseInt(newDishPrepTime),
        calories: parseInt(newDishCalories),
        ingredients: newDishIngredients,
      };

      if (editingDish) {
        await fetch(`/api/menu/${editingDish.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });
      } else {
        await fetch('/api/menu', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });
      }

      setDishModalOpen(false);
      setEditingDish(null);
      loadDashboardData();
    } catch (err) {
      console.error(err);
    }
  };

  const handleStockUpdate = async (item: InventoryItemData, delta: number) => {
    try {
      const newQty = Math.max(0, item.quantity + delta);
      await fetch('/api/admin/inventory', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: item.id, quantity: newQty }),
      });
      loadDashboardData();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-brand-beige-dark">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/10 text-amber-800 text-xs font-bold mb-1">
            <span>👑 URHD Executive Management Console</span>
          </div>
          <h1 className="font-serif font-bold text-3xl text-brand-charcoal">
            Restaurant Owner Dashboard
          </h1>
          <p className="text-xs text-neutral-500">
            Control center for Indiranagar flagship café: Revenue, live kitchen tickets, menu catalog, and inventory.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={loadDashboardData}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-white border border-neutral-200 text-xs font-semibold text-neutral-700 hover:bg-neutral-50 shadow-xs"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Refresh Analytics</span>
          </button>

          <Link
            href="/kitchen"
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-neutral-900 text-white text-xs font-semibold hover:bg-neutral-800 shadow-xs"
          >
            <span>Kitchen Display (KDS) →</span>
          </Link>
        </div>
      </div>

      {/* Tabs Navigation */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 border-b border-neutral-200 text-xs font-bold">
        {[
          { key: 'overview', label: 'Overview & Metrics', icon: TrendingUp },
          { key: 'orders', label: `Orders (${orders.length})`, icon: ShoppingBag },
          { key: 'menu', label: `Menu Catalog (${menuItems.length})`, icon: Utensils },
          { key: 'inventory', label: `Inventory Stock (${inventory.length})`, icon: Boxes },
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
      </div>

      {/* TAB 1: OVERVIEW & ANALYTICS */}
      {activeTab === 'overview' && (
        <div className="space-y-8 animate-fadeIn">
          {/* KPI Cards Row */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
            <div className="bg-white p-5 rounded-3xl border border-brand-beige-dark shadow-xs space-y-2">
              <div className="flex items-center justify-between text-neutral-500 text-xs">
                <span>Total Gross Sales</span>
                <DollarSign className="w-4 h-4 text-emerald-600" />
              </div>
              <div className="font-serif font-black text-2xl text-brand-charcoal">
                ₹{metrics?.totalRevenue ? Math.round(metrics.totalRevenue) : '0'}
              </div>
              <div className="text-[10px] text-emerald-600 font-semibold">
                ● Live calculated revenue
              </div>
            </div>

            <div className="bg-white p-5 rounded-3xl border border-brand-beige-dark shadow-xs space-y-2">
              <div className="flex items-center justify-between text-neutral-500 text-xs">
                <span>Today&apos;s Sales</span>
                <TrendingUp className="w-4 h-4 text-brand-orange" />
              </div>
              <div className="font-serif font-black text-2xl text-brand-orange">
                ₹{metrics?.todayRevenue ? Math.round(metrics.todayRevenue) : '0'}
              </div>
              <div className="text-[10px] text-neutral-500">From midnight to present</div>
            </div>

            <div className="bg-white p-5 rounded-3xl border border-brand-beige-dark shadow-xs space-y-2">
              <div className="flex items-center justify-between text-neutral-500 text-xs">
                <span>Total Orders</span>
                <ShoppingBag className="w-4 h-4 text-blue-600" />
              </div>
              <div className="font-serif font-black text-2xl text-brand-charcoal">
                {metrics?.totalOrdersCount || orders.length}
              </div>
              <div className="text-[10px] text-neutral-500">
                Pending: {metrics?.pendingOrdersCount || 0}
              </div>
            </div>

            <div className="bg-white p-5 rounded-3xl border border-brand-beige-dark shadow-xs space-y-2">
              <div className="flex items-center justify-between text-neutral-500 text-xs">
                <span>Avg Order Value (AOV)</span>
                <Clock className="w-4 h-4 text-purple-600" />
              </div>
              <div className="font-serif font-black text-2xl text-brand-charcoal">
                ₹{metrics?.averageOrderValue || '820'}
              </div>
              <div className="text-[10px] text-neutral-500">Healthy guest basket size</div>
            </div>
          </div>

          {/* Best Sellers and Inventory Alerts Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* Best Sellers */}
            <div className="lg:col-span-7 bg-white p-6 rounded-3xl border border-brand-beige-dark shadow-xs space-y-4">
              <h3 className="font-serif font-bold text-lg text-brand-charcoal flex items-center gap-2">
                <Utensils className="w-4 h-4 text-brand-orange" />
                <span>Top Selling Dishes</span>
              </h3>

              <div className="space-y-3">
                {bestSellers.length > 0 ? (
                  bestSellers.map((item, idx) => (
                    <div
                      key={item.id}
                      className="p-3 bg-neutral-50 rounded-2xl flex items-center justify-between"
                    >
                      <div className="flex items-center gap-3">
                        <span className="w-6 h-6 rounded-full bg-brand-orange/10 text-brand-orange font-bold text-xs flex items-center justify-center">
                          {idx + 1}
                        </span>
                        <div>
                          <div className="font-bold text-xs text-brand-charcoal">{item.name}</div>
                          <div className="text-[10px] text-neutral-500 font-mono">
                            Price: ₹{item.price}
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <span className="font-bold text-xs text-brand-orange">
                          {item.soldCount} portions
                        </span>
                        <div className="text-[10px] text-neutral-500">
                          ₹{item.revenueGenerated}
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-xs text-neutral-500">No order sales registered yet.</p>
                )}
              </div>
            </div>

            {/* Low Stock Alerts */}
            <div className="lg:col-span-5 bg-white p-6 rounded-3xl border border-brand-beige-dark shadow-xs space-y-4">
              <h3 className="font-serif font-bold text-lg text-brand-charcoal flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-amber-600" />
                <span>Inventory Alerts</span>
              </h3>

              <div className="space-y-3">
                {lowStockItems.length > 0 ? (
                  lowStockItems.map((item) => (
                    <div
                      key={item.id}
                      className="p-3 bg-amber-50 rounded-2xl border border-amber-200 flex items-center justify-between text-xs"
                    >
                      <div>
                        <div className="font-bold text-amber-900">{item.name}</div>
                        <div className="text-[10px] text-amber-700">
                          Remaining: {item.quantity} {item.unit} (Reorder threshold: {item.reorderLevel})
                        </div>
                      </div>
                      <span className="px-2 py-0.5 rounded bg-amber-200 text-amber-900 font-bold text-[10px]">
                        Low Stock
                      </span>
                    </div>
                  ))
                ) : (
                  <div className="p-4 bg-emerald-50 rounded-2xl text-emerald-800 text-xs">
                    ✓ All inventory stocks are healthy above reorder thresholds.
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: ORDERS MANAGEMENT */}
      {activeTab === 'orders' && (
        <div className="bg-white rounded-3xl border border-brand-beige-dark shadow-xs p-6 space-y-4 animate-fadeIn">
          <div className="flex items-center justify-between pb-3 border-b border-neutral-100">
            <h3 className="font-serif font-bold text-lg text-brand-charcoal">
              Live &amp; Historical Order Management
            </h3>
            <span className="text-xs text-neutral-500 font-mono">
              Total {orders.length} orders recorded
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-neutral-200 text-neutral-400 font-mono uppercase tracking-wider text-[10px]">
                  <th className="py-3 px-3">Order ID</th>
                  <th className="py-3 px-3">Type / Destination</th>
                  <th className="py-3 px-3">Customer</th>
                  <th className="py-3 px-3">Items</th>
                  <th className="py-3 px-3">Amount</th>
                  <th className="py-3 px-3">Status</th>
                  <th className="py-3 px-3">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-100">
                {orders.map((o) => (
                  <tr key={o.id} className="hover:bg-neutral-50/80 transition-colors">
                    <td className="py-3 px-3 font-mono font-bold text-brand-charcoal">
                      <Link href={`/orders/${o.orderNumber}`} className="hover:underline text-brand-orange">
                        {o.orderNumber}
                      </Link>
                    </td>

                    <td className="py-3 px-3">
                      <span
                        className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                          o.orderType === 'DINE_IN'
                            ? 'bg-amber-100 text-amber-800'
                            : 'bg-blue-100 text-blue-800'
                        }`}
                      >
                        {o.orderType === 'DINE_IN' ? `Table #${o.table?.number || 4}` : 'Delivery'}
                      </span>
                    </td>

                    <td className="py-3 px-3">
                      <div className="font-bold text-brand-charcoal">{o.customerName}</div>
                      <div className="text-[10px] text-neutral-400 font-mono">{o.customerPhone}</div>
                    </td>

                    <td className="py-3 px-3">
                      <div className="line-clamp-1 font-medium">
                        {o.items.map((i) => `${i.quantity}x ${i.menuItem.name}`).join(', ')}
                      </div>
                    </td>

                    <td className="py-3 px-3 font-serif font-bold text-brand-charcoal">
                      ₹{Math.round(o.totalAmount)}
                    </td>

                    <td className="py-3 px-3">
                      <span
                        className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                          o.status === 'DELIVERED'
                            ? 'bg-emerald-100 text-emerald-800'
                            : o.status === 'CANCELLED'
                            ? 'bg-red-100 text-red-800'
                            : 'bg-brand-orange/20 text-brand-orange'
                        }`}
                      >
                        {o.status}
                      </span>
                    </td>

                    <td className="py-3 px-3">
                      <select
                        value={o.status}
                        onChange={(e) => handleUpdateOrderStatus(o.id, e.target.value)}
                        className="px-2 py-1 bg-white border border-neutral-200 rounded-lg text-xs font-semibold focus:outline-none focus:border-brand-orange"
                      >
                        <option value="PLACED">Placed</option>
                        <option value="CONFIRMED">Confirmed</option>
                        <option value="PREPARING">Preparing</option>
                        <option value="READY">Ready</option>
                        <option value="DELIVERED">Delivered</option>
                        <option value="CANCELLED">Cancelled</option>
                      </select>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 3: MENU MANAGEMENT */}
      {activeTab === 'menu' && (
        <div className="bg-white rounded-3xl border border-brand-beige-dark shadow-xs p-6 space-y-6 animate-fadeIn">
          <div className="flex items-center justify-between pb-3 border-b border-neutral-100">
            <div>
              <h3 className="font-serif font-bold text-lg text-brand-charcoal">
                Menu Catalog &amp; Dish Control
              </h3>
              <p className="text-xs text-neutral-500">
                Update prices, ingredients, prep videos, and toggle availability.
              </p>
            </div>

            <button
              onClick={() => {
                setEditingDish(null);
                setNewDishName('');
                setNewDishPrice('');
                setNewDishDescription('');
                setNewDishImage('https://images.unsplash.com/photo-1544025162-d76694265947?q=80&w=1000&auto=format&fit=crop');
                setNewDishVideo('');
                setNewDishIngredients('');
                setDishModalOpen(true);
              }}
              className="px-4 py-2 rounded-xl bg-brand-orange hover:bg-brand-orange-hover text-white text-xs font-bold shadow-md transition-all flex items-center gap-1.5"
            >
              <Plus className="w-4 h-4" />
              <span>Add New Dish</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {menuItems.map((dish) => (
              <div
                key={dish.id}
                className="bg-neutral-50 p-4 rounded-2xl border border-neutral-200 space-y-3 flex flex-col justify-between"
              >
                <div className="flex items-start gap-3">
                  <div className="relative w-16 h-16 rounded-xl overflow-hidden shrink-0 bg-neutral-200">
                    <Image src={dish.imageUrl} alt={dish.name} fill className="object-cover" sizes="64px" />
                  </div>
                  <div className="flex-1 space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-xs text-brand-charcoal line-clamp-1">
                        {dish.name}
                      </span>
                      <span className="font-mono text-xs font-bold text-brand-orange">
                        ₹{dish.price}
                      </span>
                    </div>
                    <p className="text-[11px] text-neutral-500 line-clamp-2">
                      {dish.description}
                    </p>
                  </div>
                </div>

                <div className="pt-2 border-t border-neutral-200 flex items-center justify-between text-xs">
                  <button
                    onClick={() => handleToggleDishAvailability(dish)}
                    className={`px-2.5 py-1 rounded-lg text-[10px] font-bold ${
                      dish.isAvailable
                        ? 'bg-emerald-100 text-emerald-800'
                        : 'bg-red-100 text-red-800'
                    }`}
                  >
                    {dish.isAvailable ? '✓ In Stock' : '✗ Disabled'}
                  </button>

                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={() => {
                        setEditingDish(dish);
                        setNewDishName(dish.name);
                        setNewDishPrice(String(dish.price));
                        setNewDishCategory(dish.categoryId);
                        setNewDishDescription(dish.description);
                        setNewDishImage(dish.imageUrl);
                        setNewDishVideo(dish.videoUrl || '');
                        setNewDishPrepTime(String(dish.prepTime));
                        setNewDishIngredients(dish.ingredients);
                        setDishModalOpen(true);
                      }}
                      className="p-1.5 rounded-lg bg-neutral-200 hover:bg-neutral-300 text-neutral-700"
                      title="Edit Dish"
                    >
                      <Edit3 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => handleDeleteDish(dish.id)}
                      className="p-1.5 rounded-lg bg-red-100 hover:bg-red-200 text-red-700"
                      title="Delete Dish"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 4: INVENTORY MANAGEMENT */}
      {activeTab === 'inventory' && (
        <div className="bg-white rounded-3xl border border-brand-beige-dark shadow-xs p-6 space-y-4 animate-fadeIn">
          <div className="flex items-center justify-between pb-3 border-b border-neutral-100">
            <div>
              <h3 className="font-serif font-bold text-lg text-brand-charcoal">
                Kitchen Ingredient &amp; Packaging Inventory
              </h3>
              <p className="text-xs text-neutral-500">
                Real-time stock quantities, reorder thresholds, and one-click supplier restock adjustments.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {inventory.map((inv) => (
              <div
                key={inv.id}
                className="p-4 rounded-2xl border bg-neutral-50 border-neutral-200 space-y-3"
              >
                <div className="flex items-center justify-between">
                  <span className="font-bold text-xs text-brand-charcoal">{inv.name}</span>
                  <span
                    className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                      inv.isLowStock
                        ? 'bg-red-100 text-red-800 animate-pulse'
                        : 'bg-emerald-100 text-emerald-800'
                    }`}
                  >
                    {inv.isLowStock ? 'Low Stock' : 'Optimal'}
                  </span>
                </div>

                <div className="flex items-baseline justify-between">
                  <span className="text-[10px] text-neutral-500 uppercase tracking-wider">Available</span>
                  <span className="font-mono font-bold text-lg text-brand-charcoal">
                    {inv.quantity} {inv.unit}
                  </span>
                </div>

                <div className="text-[10px] text-neutral-500">
                  Supplier: {inv.supplierName || 'Organic Supplier'} ({inv.supplierPhone})
                </div>

                <div className="pt-2 border-t border-neutral-200 flex items-center justify-between">
                  <span className="text-[10px] text-neutral-400">Quick Restock:</span>
                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={() => handleStockUpdate(inv, -5)}
                      className="px-2 py-1 rounded bg-neutral-200 hover:bg-neutral-300 text-xs font-bold"
                    >
                      -5
                    </button>
                    <button
                      onClick={() => handleStockUpdate(inv, +10)}
                      className="px-2 py-1 rounded bg-brand-orange text-white hover:bg-brand-orange-hover text-xs font-bold"
                    >
                      +10 {inv.unit}
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Add / Edit Dish Modal */}
      {dishModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
          <div className="bg-white rounded-3xl max-w-xl w-full p-6 shadow-2xl border border-neutral-200 max-h-[90vh] overflow-y-auto space-y-4 animate-scaleUp">
            <div className="flex items-center justify-between pb-3 border-b border-neutral-100">
              <h3 className="font-serif font-bold text-lg text-brand-charcoal">
                {editingDish ? 'Edit Dish Details' : 'Add New Dish to URHD Menu'}
              </h3>
              <button
                onClick={() => setDishModalOpen(false)}
                className="p-1 rounded-full text-neutral-400 hover:bg-neutral-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveDish} className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="block text-xs font-bold text-neutral-700">Dish Name</label>
                  <input
                    type="text"
                    required
                    value={newDishName}
                    onChange={(e) => setNewDishName(e.target.value)}
                    placeholder="e.g. Saffron Risotto"
                    className="w-full px-3 py-2 rounded-xl border border-neutral-200 text-xs"
                  />
                </div>

                <div className="space-y-1">
                  <label className="block text-xs font-bold text-neutral-700">Price (INR)</label>
                  <input
                    type="number"
                    required
                    value={newDishPrice}
                    onChange={(e) => setNewDishPrice(e.target.value)}
                    placeholder="e.g. 540"
                    className="w-full px-3 py-2 rounded-xl border border-neutral-200 text-xs"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="block text-xs font-bold text-neutral-700">Category</label>
                <select
                  value={newDishCategory}
                  onChange={(e) => setNewDishCategory(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-neutral-200 text-xs"
                >
                  <option value="grand-line-specials">The Grand Line Specials 🏴‍☠️</option>
                  <option value="rustic-starters">Rustic Starters</option>
                  <option value="healthy-bowls">Healthy Bowls</option>
                  <option value="gourmet-burgers">Gourmet Burgers</option>
                  <option value="woodfired-pizzas">Woodfired Pizzas</option>
                  <option value="rustic-mains">Rustic Mains</option>
                  <option value="artisanal-coffee">Artisanal Coffee</option>
                  <option value="shakes-mocktails">Smoothies &amp; Mocktails</option>
                  <option value="decadent-desserts">Decadent Desserts</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="block text-xs font-bold text-neutral-700">Description</label>
                <textarea
                  rows={2}
                  value={newDishDescription}
                  onChange={(e) => setNewDishDescription(e.target.value)}
                  placeholder="Rich sensory description..."
                  className="w-full px-3 py-2 rounded-xl border border-neutral-200 text-xs"
                />
              </div>

              <div className="space-y-1">
                <label className="block text-xs font-bold text-neutral-700">High-Res Image URL</label>
                <input
                  type="url"
                  required
                  value={newDishImage}
                  onChange={(e) => setNewDishImage(e.target.value)}
                  placeholder="https://images.unsplash.com/..."
                  className="w-full px-3 py-2 rounded-xl border border-neutral-200 text-xs"
                />
              </div>

              <div className="space-y-1">
                <label className="block text-xs font-bold text-neutral-700">
                  Preparation Video URL (.mp4 preview reel)
                </label>
                <input
                  type="url"
                  value={newDishVideo}
                  onChange={(e) => setNewDishVideo(e.target.value)}
                  placeholder="https://assets.mixkit.co/videos/preview/..."
                  className="w-full px-3 py-2 rounded-xl border border-neutral-200 text-xs"
                />
              </div>

              <div className="space-y-1">
                <label className="block text-xs font-bold text-neutral-700">Ingredients</label>
                <input
                  type="text"
                  value={newDishIngredients}
                  onChange={(e) => setNewDishIngredients(e.target.value)}
                  placeholder="e.g. Saffron, Arborio rice, Parmigiano..."
                  className="w-full px-3 py-2 rounded-xl border border-neutral-200 text-xs"
                />
              </div>

              <div className="flex items-center gap-4">
                <label className="flex items-center gap-2 text-xs font-semibold">
                  <input
                    type="checkbox"
                    checked={newDishVeg}
                    onChange={(e) => setNewDishVeg(e.target.checked)}
                    className="accent-brand-orange"
                  />
                  <span>Pure Vegetarian</span>
                </label>
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-neutral-100">
                <button
                  type="button"
                  onClick={() => setDishModalOpen(false)}
                  className="px-4 py-2 rounded-xl border border-neutral-200 text-neutral-600 text-xs"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 rounded-xl bg-brand-orange text-white text-xs font-bold hover:bg-brand-orange-hover"
                >
                  Save Dish
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
