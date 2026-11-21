export type Role = 'CUSTOMER' | 'ADMIN' | 'KITCHEN';

export type OrderType = 'DELIVERY' | 'DINE_IN' | 'PICKUP';

export type OrderStatus =
  | 'PLACED'
  | 'CONFIRMED'
  | 'PREPARING'
  | 'READY'
  | 'DELIVERED'
  | 'CANCELLED';

export type PaymentMethod = 'COD' | 'UPI_QR' | 'RAZORPAY';

export type PaymentStatus = 'PENDING' | 'COMPLETED' | 'FAILED' | 'REFUNDED';

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  phone?: string | null;
  role: Role;
  loyaltyPoints: number;
  avatar?: string | null;
}

export interface AddressItem {
  id: string;
  userId: string;
  label: string;
  street: string;
  landmark?: string | null;
  city: string;
  state: string;
  pincode: string;
  isDefault: boolean;
}

export interface CustomizationOptionItem {
  id: string;
  groupId: string;
  name: string;
  price: number;
  isDefault: boolean;
}

export interface CustomizationGroupItem {
  id: string;
  menuItemId: string;
  name: string;
  minSelect: number;
  maxSelect: number;
  isRequired: boolean;
  options: CustomizationOptionItem[];
}

export interface MenuItemData {
  id: string;
  name: string;
  slug: string;
  description: string;
  price: number;
  categoryId: string;
  category?: { id: string; name: string };
  imageUrl: string;
  videoUrl?: string | null;
  isVeg: boolean;
  spiceLevel: number; // 0: None, 1: Mild, 2: Medium, 3: Hot
  prepTime: number; // in mins
  calories?: number | null;
  cuisine: string;
  flavorProfile?: string | null;
  ingredients: string; // JSON or string
  allergens?: string | null;
  isChefSpecial: boolean;
  isAnimeSpecial: boolean;
  animeTheme?: string | null;
  rating: number;
  ratingCount: number;
  isAvailable: boolean;
  customizations?: CustomizationGroupItem[];
}

export interface CartItemCustomization {
  groupId: string;
  groupName: string;
  optionId: string;
  optionName: string;
  price: number;
}

export interface CartItem {
  cartItemId: string;
  menuItem: MenuItemData;
  quantity: number;
  selectedCustomizations: CartItemCustomization[];
  specialInstructions?: string;
  itemTotalPrice: number; // (basePrice + customizations) * quantity
}

export interface OrderItemData {
  id: string;
  orderId: string;
  menuItemId: string;
  menuItem: MenuItemData;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
  customizationsJson?: string | null;
  specialNotes?: string | null;
}

export interface OrderData {
  id: string;
  orderNumber: string;
  userId?: string | null;
  customerName: string;
  customerPhone: string;
  customerEmail?: string | null;
  orderType: OrderType;
  tableId?: string | null;
  table?: { number: number; section: string } | null;
  deliveryAddressId?: string | null;
  deliveryAddress?: AddressItem | null;
  status: OrderStatus;
  subtotal: number;
  tax: number;
  deliveryFee: number;
  discount: number;
  totalAmount: number;
  specialInstructions?: string | null;
  estimatedTime?: string | null;
  createdAt: string;
  updatedAt: string;
  items: OrderItemData[];
  payment?: {
    id: string;
    paymentMethod: PaymentMethod;
    paymentStatus: PaymentStatus;
    amount: number;
    transactionId?: string | null;
    paidAt?: string | null;
  } | null;
}

export interface WorkspacePackageData {
  id: string;
  name: string;
  duration: string;
  price: number;
  description: string;
  features: string[]; // parsed from JSON
  popular?: boolean;
}

export interface WorkspaceBookingData {
  id: string;
  userId?: string | null;
  guestName: string;
  guestEmail: string;
  guestPhone: string;
  packageId: string;
  package?: WorkspacePackageData;
  date: string;
  startTime: string;
  seats: number;
  totalAmount: number;
  status: 'CONFIRMED' | 'PENDING' | 'CANCELLED';
  paymentStatus: string;
  specialRequests?: string | null;
  createdAt: string;
}

export interface InventoryItemData {
  id: string;
  name: string;
  category: string;
  quantity: number;
  unit: string;
  reorderLevel: number;
  isLowStock: boolean;
  supplierName?: string | null;
  supplierPhone?: string | null;
  lastRestocked?: string | null;
}

export interface CouponData {
  id: string;
  code: string;
  discountType: 'PERCENTAGE' | 'FIXED';
  discountValue: number;
  minOrderAmount: number;
  maxDiscount?: number | null;
  validUntil: string;
  usageLimit: number;
  usedCount: number;
  isActive: boolean;
}
