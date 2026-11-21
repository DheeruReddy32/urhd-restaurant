# URHD – Unified Rustic Health Delights 🍽️🏴‍☠️
> *"Where Rustic Tradition Meets Healthy Luxury."*

**URHD** is a production-ready, full-stack digital restaurant experience and operations management platform designed for the flagship café-cum-restaurant in Indiranagar, Bangalore. It seamlessly integrates customer online ordering, QR-based dine-in table ordering, an interactive dish customizer with preparation video reels, the **Grand Line Anime Café Experience**, an executive **Corporate Workspace Hub**, a **Tablet Kitchen Display System (KDS)**, and a **Restaurant Owner Analytics Dashboard**.

---

## 🌟 Key Highlights & Systems

### 1. Digital Menu & Interactive Customization Engine
- **30+ Handcrafted Dishes** across 9 categories (Grand Line Specials, Rustic Starters, Nutri-Rich Healthy Bowls, Gourmet Brioche Burgers, Woodfired Sourdough Pizzas, Heritage Mains, Specialty Coffee, Smoothies & Mocktails, Artisan Desserts).
- **Interactive Dish Customizer Modal**: Real-time ingredient and portion adjustments (bun choice, patty choice, cheese levels, spice heat, beverage milk/sweetness/ice, special chef notes) with dynamic line-total recalculation.
- **Short Preparation Video Reels**: Embedded live cooking previews, ingredient transparency, calorie counters, and allergen alerts.
- **Advanced Multi-Filters**: Filter dishes simultaneously by price range, dietary preference (Pure Veg / Non-Veg), spice fire level (0-3), cuisine, chef signatures, and sorting.

### 2. Dual-Mode Ordering & Real-Time Tracking
- **Home Delivery**: Street address capture, landmark, pincode, rider instructions, dynamic delivery fee (Free > ₹600).
- **Dine-In Table Ordering**: Table selector (Tables 1 to 12) with immediate kitchen routing, eliminating waiter dependency.
- **Real-Time Telemetry Tracking**: Step-by-step progress timeline (*Order Placed* → *Order Confirmed* → *Chef Cooking* → *Ready for Pickup / Out for Delivery* → *Delivered / Served*) with 5-second live polling.

### 3. Payment Integration
- **Instant UPI QR**: Scan & pay with 12-digit UTR transaction reference verification.
- **Razorpay Payment Gateway**: Test/Sandbox and Live production-ready architecture with server-side HMAC SHA256 signature verification and duplicate payment prevention.
- **Cash on Delivery / Pay at Counter**: Convenient on-premise settlement.

### 4. The Grand Line Café Experience 🏴‍☠️
- Inspired by One Piece lore and pirate adventure aesthetics.
- Featured dishes:
  - *Luffy's Gigant Bone-in Roast Platter* (Smoked BBQ with Gear 5 chili glaze)
  - *Sanji's All-Blue Seafood Truffle Risotto* (Bisque broth, king prawns, black winter truffle)
  - *Zoro's Santoryu High-Protein Onigiri Trio* (Nori onigiri with teriyaki tofu & edamame)
  - *Dr. Chopper's Sakura Cotton Candy Berry Frappe*
  - *Nami's Belle-mère Tangerine Sparkling Elixir*
- **Pirate Berries Loyalty Program**: Earn 1 Berry for every ₹20 spent; tier progression from *Cabin Boy* to *Supernova* and *Pirate King*.

### 5. Corporate Workspace: "Work, Eat & Relax"
- High-speed 500 Mbps redundant optical fiber Wi-Fi.
- Universal spike-protected power & 65W USB-C charging at every station.
- Flexible passes:
  - *Hourly Flex Pass* (₹150)
  - *Half-Day Sprint Pass* (₹499)
  - *Full-Day Executive Pass* (₹899)
  - *Monthly Resident Desk* (₹12,999)
  - *Pirate King Boardroom* (8-seater with 65-inch 4K screen, ₹1,200/hr)
- Interactive reservation booking calendar with instant confirmation.

### 6. Kitchen Display System (KDS) (`/kitchen`)
- Purpose-built for tablets and kitchen touchscreens.
- High-contrast visual tickets showing Table # vs Delivery, timer elapsed since order, item customizers, and one-click status transitions (*Accept* → *Start Cooking* → *Mark Ready* → *Complete*).

### 7. Restaurant Owner / Admin Dashboard (`/admin`)
- **Executive KPIs**: Real-time Gross Sales, Today's Revenue, Total Orders, Average Order Value (AOV).
- **Menu Management**: Add/Edit/Delete dishes, adjust prices, upload image/video links, toggle item availability.
- **Order Management**: Status overrides, cancellation handling, customer details, invoice views.
- **Inventory Tracking**: Stock monitoring with low-stock alerts and quick reorder adjustments.

---

## 🔑 Demo Access Credentials

The platform features a **One-Click Instant Role Switcher** in the top navigation bar. You can also sign in directly:

| Role | Email | Password | Access Privileges |
| :--- | :--- | :--- | :--- |
| **Restaurant Owner (Admin)** | `owner@urhd.com` | `admin123` | Full access to `/admin`, menu editing, metrics, inventory |
| **Head Chef (Kitchen)** | `kitchen@urhd.com` | `chef123` | Full access to `/kitchen` (KDS Cook Station) |
| **Customer (Luffy)** | `luffy@grandline.com` | `pirate123` | 340 Pirate Berries, saved delivery addresses, order history |

---

## 🚀 Quickstart & Local Setup

### 1. Prerequisites
- Node.js 18+ (tested on Node v20/v24)
- npm

### 2. Environment Variables
Create a `.env` file (copied from `.env.example`):
```env
DATABASE_URL="file:./dev.db"
JWT_SECRET="urhd_super_secure_jwt_secret_token_98765_rustic_delight"
NEXT_PUBLIC_RAZORPAY_KEY_ID="rzp_test_urhd88192mock"
RAZORPAY_KEY_SECRET="mock_secret_urhd_9921_safe"
NEXT_PUBLIC_APP_URL="http://localhost:3000"
```

### 3. Database Initialization & Seeding
```bash
# Push Prisma schema to SQLite
node ".\node_modules\prisma\build\index.js" db push

# Seed 30+ dishes, tables, packages, coupons & demo users
node prisma/seed.js
```

### 4. Running the Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

### 5. Running the Production Build
```bash
npm run build
npm start
```

### 6. Running End-to-End Test Suite
```bash
node test-e2e.js
```
Runs an automated 10-step verification of menu loading, registration, coupons, table ordering, payment verification, kitchen ticket updates, and owner analytics.

---

## 🎨 Color Palette & Design System

- **Primary**: Warm Orange (`#E86328` / `#FF7D45`)
- **Secondary**: Warm Beige (`#F5EBE1` / `#E8D8C8`)
- **Background**: Rustic Off-White (`#FAF7F2`)
- **Contrast**: Charcoal Black (`#181512` / `#282420`)
- **Supporting**: Warm Grey (`#6E6B65`)
- **Anime Accents**: Pirate Gold (`#D4AF37`) & Crimson Ruby (`#B91C1C`)
