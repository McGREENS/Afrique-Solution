# Admin Dashboard Implementation Plan

## 🎯 Goal
Create admin pages to monitor payments and manage business WITHOUT disrupting existing working bot.

## ✅ Safety Rules
1. NO changes to existing bot code (professional-bot.js)
2. NO changes to existing API routes
3. Only ADD new admin pages
4. All new code in separate files

## 📊 Admin Pages to Create

### 1. PAYMENTS DASHBOARD (Priority 1)
**Route:** `/admin/payments`
**Features:**
- View all PawaPay deposits
- Filter by status (Completed, Failed, Submitted)
- Filter by country (Rwanda, DRC, Burundi)
- Filter by date range
- Search by phone number or deposit ID
- Export to CSV
- Real-time updates

**Data Source:** PawaPay API (GET /deposits)

### 2. ORDERS MANAGEMENT (Priority 2)
**Route:** `/admin/orders`
**Features:**
- View all customer orders from WhatsApp bot
- See order details (service, package, amount, phone)
- Track order status
- Manual order fulfillment
- Customer contact info

**Data Source:** Need to add order logging to bot

### 3. ANALYTICS DASHBOARD (Priority 3)
**Route:** `/admin/analytics`
**Features:**
- Total revenue (by day, week, month)
- Popular services (Canal+, DSTV, etc.)
- Popular countries
- Success rate
- Charts and graphs

**Data Source:** PawaPay API + Order logs

### 4. CUSTOMER DATABASE (Priority 4)
**Route:** `/admin/customers`
**Features:**
- List of all customers (phone numbers)
- Order history per customer
- Total spent per customer
- Last order date
- Customer segments

**Data Source:** Order logs

### 5. SETTINGS (Priority 5)
**Route:** `/admin/settings`
**Features:**
- Update pricing
- Enable/disable services
- Configure payment methods
- Manage API tokens
- System health check

## 🔧 Technical Implementation

### New Files to Create:
```
app/
  admin/
    payments/
      page.tsx          ← New payments dashboard
    orders/
      page.tsx          ← New orders page
    analytics/
      page.tsx          ← New analytics page
    customers/
      page.tsx          ← New customers page
    settings/
      page.tsx          ← New settings page
  api/
    admin/
      payments/
        route.ts        ← Fetch PawaPay deposits
      orders/
        route.ts        ← Fetch orders from database
      analytics/
        route.ts        ← Calculate analytics
```

### Database (Optional - for order tracking):
```
Option 1: Use Vercel Postgres (recommended)
Option 2: Use JSON file storage (simple)
Option 3: Use Supabase (free tier)
```

## 📝 Implementation Steps

### Step 1: Create Payments Dashboard (TODAY)
1. Create `/admin/payments` page
2. Create API route to fetch PawaPay deposits
3. Display deposits in a table
4. Add filters and search

### Step 2: Add Order Logging to Bot (TOMORROW)
1. Create database/storage for orders
2. Log every order from WhatsApp bot
3. Store: phone, service, package, amount, status, timestamp

### Step 3: Create Orders Dashboard
1. Create `/admin/orders` page
2. Display all orders
3. Add status management

### Step 4: Analytics & Customers
1. Calculate metrics from orders
2. Create charts
3. Customer segmentation

## 🚀 Let's Start

**Which should I create first?**
1. Payments Dashboard (see all PawaPay transactions)
2. Orders Management (track WhatsApp bot orders)
3. Both at the same time

**Choose and I'll implement it carefully without touching existing code!**
