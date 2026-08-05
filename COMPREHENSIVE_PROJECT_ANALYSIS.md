# Comprehensive Auremont Architecture & Functionality Analysis

## Executive Summary
This document provides an exhaustive technical and functional breakdown of the **Auremont Luxury E-Commerce Platform**. Auremont is an ultra-premium artisanal e-commerce application designed for high-end gourmet almond products, bespoke gift boxes, and corporate gifting. 

The application features a decoupled architecture composed of:
1. **Frontend**: Next.js 14 App Router, TypeScript, React 18, TailwindCSS, Framer Motion, Zustand state management, and Axios.
2. **Backend**: NestJS, TypeScript, Prisma ORM, PostgreSQL database, JWT authentication, and modular REST micro-services.

---

## 1. System Architecture & Tech Stack Overview

### 1.1 Technical Stack Breakdown
| Tier | Technology / Library | Purpose |
| :--- | :--- | :--- |
| **Frontend Framework** | Next.js 14 (App Router) | Server-Side Rendering (SSR), Static Site Generation (SSG), Client Components |
| **Language** | TypeScript | Strict type safety across client and server |
| **Styling & UI** | Tailwind CSS, Framer Motion | Dynamic animations, glassmorphism, responsive luxury design |
| **Icons & Media** | Lucide React | Modern SVG icons |
| **Client State** | Zustand | Persistent lightweight stores (`useCartStore`, `useAuthStore`, `useWishlistStore`, `useCurrencyStore`) |
| **HTTP Client** | Axios | Interceptors, JWT token management, error handling |
| **Backend Framework** | NestJS | Enterprise modular Node.js architecture |
| **Database ORM** | Prisma ORM | Type-safe query engine and database migrations |
| **Database** | PostgreSQL | Relational storage for users, orders, products, and analytics |
| **Auth & Security** | JWT, Passport, Bcrypt | Bearer token authorization, password hashing |
| **Logging & Filtering**| Custom Exceptions Filter, Nest Logger | Centralized exception handling and audit logging |

---

## 2. Database Schema & Data Models (Prisma ORM)

The relational database schema defined in `auremont-backend/prisma/schema.prisma` comprises 24 entities:

### 2.1 Core Identity & Access Control
- **`User`**: Customer accounts (`id`, `firstName`, `lastName`, `email`, `phone`, `passwordHash`, `googleId`, `role`, `status`, `emailVerified`, `refreshToken`, `resetToken`, `createdAt`, `updatedAt`).
- **`AdminUser`**: Back-office admin accounts (`id`, `email`, `password`, `firstName`, `lastName`, `role`, `isActive`, `lastLogin`, `createdAt`). Enums: `SUPER_ADMIN`, `ADMIN`, `INVENTORY_MANAGER`, `MARKETING_MANAGER`, `SUPPORT`.
- **`AdminAuditLog`**: Audit trail for administrative actions (`id`, `adminId`, `action`, `entity`, `entityId`, `oldValue`, `newValue`, `ipAddress`, `createdAt`).
- **`Address`**: Saved customer addresses (`id`, `userId`, `fullName`, `phone`, `addressLine1`, `addressLine2`, `city`, `state`, `postalCode`, `country`, `isDefault`, `createdAt`).

### 2.2 Catalog & Product Engine
- **`Category`**: Product categorization (`id`, `name`, `slug`, `description`, `imageUrl`, SEO fields, `status`).
- **`Collection`**: Curated product groupings (`id`, `name`, `slug`, `description`, `bannerUrl`, SEO fields, `status`).
- **`Product`**: Main catalog model (`id`, `categoryId`, `collectionId`, `name`, `slug`, `sku`, `shortDescription`, `description`, `weightGrams`, `price`, `salePrice`, `stockQty`, `nutritionJson`, `thumbnailUrl`, `isFeatured`, `isIndexable`, `status`, `createdAt`, `updatedAt`).
- **`ProductImage`**: Multi-angle gallery images (`id`, `productId`, `imageUrl`, `altText`, `sortOrder`).
- **`ProductAttribute`**: Dynamic specs such as taste notes, roast intensity, origin (`id`, `productId`, `attributeName`, `attributeValue`).
- **`InventoryLog`**: Stock movements tracking (`id`, `productId`, `changeQty`, `type`, `reason`, `createdAt`).

### 2.3 Commerce, Cart & Orders
- **`Cart` & `CartItem`**: User shopping carts and line items (`id`, `userId`, `sessionId`, `productId`, `quantity`, `updatedAt`).
- **`Order`**: Order header (`id`, `orderNumber`, `userId`, `addressId`, `subtotal`, `taxAmount`, `shippingAmount`, `discountAmount`, `total`, `orderStatus`, `paymentStatus`, `giftMessage`, `createdAt`).
- **`OrderItem`**: Historical snapshot of purchased items (`id`, `orderId`, `productId`, `productName`, `unitPrice`, `quantity`, `totalPrice`).
- **`Payment`**: Payment transaction record (`id`, `orderId`, `provider`, `transactionId`, `amount`, `status`, `createdAt`).

### 2.4 Marketing, Content & Customer Engagement
- **`Coupon` & `CouponUsage`**: Discount promo engine (`id`, `code`, `discountType`, `discountValue`, `minOrderAmount`, `maxUses`, `usedCount`, `expiresAt`).
- **`Review`**: Customer ratings (`id`, `userId`, `productId`, `rating`, `title`, `comment`, `isApproved`, `createdAt`).
- **`Wishlist`**: Customer saved items (`id`, `userId`, `productId`, `createdAt`).
- **`BlogPost` & `BlogComment`**: Journal & editorial content (`id`, `title`, `slug`, `content`, `excerpt`, `author`, `publishedAt`).
- **`ContactMessage`**: Customer support inquiries (`id`, `name`, `email`, `phone`, `subject`, `message`, `status`).

---

## 3. Frontend Storefront: Pages, UI Sections & Functions

### 3.1 Homepage (`/` - `app/page.tsx`)
The homepage renders an immersive luxury storefront composed of 10 distinct UI sections:

1. **Header & Navigation Bar (`Header.tsx` & `MegaNavigation.tsx`)**:
   - *Functions*: Sticky blur navbar on scroll, search drawer trigger, currency switcher (INR/USD/EUR/GBP), cart drawer count badge, mobile drawer toggle.
2. **Announcement Bar (`AnnouncementBar.tsx`)**:
   - *Functions*: Rotating promotional announcements (e.g., free shipping on orders above ₹1,999).
3. **Cinematic Hero (`CinematicHero.tsx`)**:
   - *Functions*: Video background with luxury overlay, dual primary CTA ("Explore Catalog", "Custom Gifting"), floating highlight badges.
4. **Why Auremont (`WhyAuremont.tsx`)**:
   - *Functions*: Key differentiators showcase (Single-Origin Sourcing, Hand-Roasted Artisanal Craft, Eco Luxury Packaging).
5. **Best Sellers Carousel (`BestSellers.tsx`)**:
   - *Functions*: Interactive product slider featuring quick add to cart, rating stars, dynamic pricing in active currency.
6. **Featured Collections (`FeaturedCollections.tsx`)**:
   - *Functions*: Visual cards navigating to bespoke collections (Signature Roasted, Gourmet Flavored, Raw Organic).
7. **Brand Story (`BrandStory.tsx`)**:
   - *Functions*: Narrative timeline showcasing heritage, ethical sourcing, and hand-crafting process.
8. **Packaging Showcase (`PackagingShowcase.tsx`)**:
   - *Functions*: Highlighting luxury velvet embossed tins, gift boxes, and gift message customization.
9. **Corporate Gifting Teaser (`CorporateGifting.tsx`)**:
   - *Functions*: Direct inquiry form for bulk corporate orders and personalized corporate branding.
10. **Health Highlights & Testimonials (`HealthHighlights.tsx`, `Testimonials.tsx`)**:
    - *Functions*: Nutritional benefits grid (Rich in Vitamin E, Keto Friendly) and customer reviews carousel.

### 3.2 Shop Catalog & Product Detail (`/shop` & `/shop/[slug]`)
- **Catalog Page (`app/shop/page.tsx`)**:
  - *Sections*: Hero catalog banner, sticky filter sidebar (`FilterSidebar.tsx`), sorting dropdown (`SortDropdown.tsx`), responsive product grid (`ProductGrid.tsx`, `ProductCard.tsx`), pagination (`Pagination.tsx`).
  - *Functions*: Multi-attribute filtering (Category, Price Range, Roast Level), sorting (Price Low-High, High-Low, Newest, Popularity), instant-search integration via `SearchDrawer.tsx`.
- **Product Detail Page (`app/shop/[slug]/page.tsx`)**:
  - *Sections*: Breadcrumbs, multi-angle image gallery (`ImageGallery.tsx`), 3D packaging viewer (`Packaging3DViewer.tsx`), flavor profile radar chart (`FlavorRadarChart.tsx`), product overview & price (`ProductInfo.tsx`), sticky purchase panel (`StickyPurchasePanel.tsx`), dynamic accordions for nutrition & origin (`AccordionDetails.tsx`), related products carousel (`RelatedProducts.tsx`).
  - *Functions*: Dynamic quantity selector, flavor profile visualization (Crunch, Sweetness, Saltiness, Spice, Smokiness), real-time stock availability, instant drawer opening upon add-to-cart.

### 3.3 Shopping Cart & Checkout (`/cart`, `/checkout`)
- **Cart Drawer & Page (`components/cart/CartDrawer.tsx`)**:
  - *Functions*: Slide-over drawer accessible from any page, quantity modifier (`QuantityControl.tsx`), gift wrap selector (`GiftOptions.tsx`), free shipping progress bar, promo code input, instant currency total calculation.
- **Multi-Step Checkout Page (`app/checkout/page.tsx`)**:
  - *Sections*: Step indicator (`ProgressIndicator.tsx`), Customer Info, Shipping Address (`CustomInput.tsx`), Delivery Options, Gift Message, Payment Gateway Selector.
  - *Functions*: Form validation, address auto-fill for logged-in users, coupon code validation against backend API, integration with payment gateways (Razorpay / Stripe), order summary panel.

### 3.4 Customer Account & Auth (`/account`, `/login`, `/register`)
- **Authentication Pages (`/login`, `/register`, `/forgot-password`, `/reset-password`)**:
  - *Functions*: Form validation, password visibility toggles, JWT token storage in localStorage/cookies, automatic redirect after login.
- **Account Dashboard (`/account/page.tsx`)**:
  - *Tab Sections*: Profile Info, Saved Addresses, Order History & Tracking, Wishlist, Security.
  - *Functions*: Address CRUD operations, order item listing with status timeline, order detail view, wishlist removal.

### 3.5 Editorial & Legal Pages
- **Journal/Blog (`app/journal`)**: Editorial articles with category tags and reading time.
- **Contact Us (`app/contact`)**: Customer inquiry form with subject category and message submission.
- **Corporate Gifts (`app/corporate-gifts`)**: Custom bulk order estimator and inquiry dispatch.
- **Info Pages (`/about`, `/faq`, `/terms`, `/privacy-policy`, `/returns`)**: Comprehensive brand info, legal policies, and interactive FAQ accordion.

---

## 4. Admin Portal: Pages, Operations & Analytics Reports

The administrative suite (`app/admin/*`) equips managers with real-time control and deep analytical reports.

### 4.1 Executive Dashboard (`/admin/page.tsx`)
Provides top-level business performance metrics computed by `AdminDashboardService`:

#### Executive Metrics Cards:
1. **Today's Sales**: Aggregate revenue generated from midnight to current time for paid orders.
2. **Monthly Sales**: Aggregate revenue for the current calendar month.
3. **Today's Orders**: Total count of orders placed today.
4. **Monthly Orders**: Total order volume for the current month.
5. **Pending Orders**: Count of orders in `placed` state requiring fulfillment.
6. **Total Customers**: Total registered customer user count.
7. **Low Stock Alerts**: Count of products with stock quantity below threshold (`< 10`).

#### Visual Analytics & Reports:
- **Revenue Trend Graph**: Visual representation of daily revenue over the last 30 days.
- **Order Status Distribution Chart**: Breakdown of orders by status (`placed`, `processing`, `shipped`, `delivered`, `cancelled`).
- **Recent Orders Table**: Real-time log of incoming orders with customer email, total, status, and view action.

### 4.2 Product & Catalog Management (`/admin/products/page.tsx`)
- *Functions*: Data table of all products with search & filter by category/stock state, product editor modal (Name, SKU, Price, Sale Price, Stock, Description, Nutrition JSON), image uploader, status toggle (Active/Inactive), SEO metadata override fields.

### 4.3 Inventory & Stock Control (`/admin/inventory/page.tsx`)
- *Reports & Actions*: Real-time stock audit list, low stock highlighting, manual inventory stock adjustments with audit log generation (`InventoryLog`), reorder point alerts.

### 4.4 Order Processing & Fulfillment (`/admin/orders/page.tsx`)
- *Functions*: Filterable order master table by status (`placed`, `processing`, `shipped`, `delivered`, `cancelled`), order detail modal with line items and customer shipping details, status updating with automated notifications, invoice generator trigger.

### 4.5 Customer CRM (`/admin/customers/page.tsx`)
- *Reports & Actions*: Customer directory with cumulative lifetime spend metrics, order counts, account status (Active, Inactive, Blocked), account block/unblock actions, customer detail drawer.

### 4.6 Content Management (`/admin/blogs/page.tsx`)
- *Functions*: Blog post creation and editing, cover image URL specification, excerpt & rich text content editor, publishing toggle.

### 4.7 Review Moderation (`/admin/reviews/page.tsx`)
- *Reports & Actions*: Moderation queue for user-submitted product reviews, rating breakdown, action buttons to Approve, Reject, or Delete reviews.

### 4.8 Marketing & Discounts (`/admin/marketing/page.tsx`)
- *Functions*: Promo coupon generator (Code, Discount Percentage or Fixed Amount, Minimum Order Requirement, Expiration Date, Max Uses limit), existing coupon management.

### 4.9 Support Desk (`/admin/support/page.tsx`)
- *Functions*: Contact form inquiry inbox, status markers (New, In Progress, Resolved), inquiry message expander.

### 4.10 System Settings & Audit Logs (`/admin/settings/page.tsx`)
- *Reports & Actions*: Admin team user management, role assignments (`SUPER_ADMIN`, `ADMIN`, `INVENTORY_MANAGER`, `MARKETING_MANAGER`, `SUPPORT`), system config parameters, audit log view (`AdminAuditLog`).

---

## 5. Client State Management (Zustand Stores)

Auremont utilizes four central Zustand stores located in `auremont-frontend/store`:

1. **`useCartStore` (`cartStore.ts`)**:
   - *State*: `items: CartItem[]`, `isOpen: boolean`, `appliedCoupon: Coupon | null`, `giftWrap: boolean`, `giftMessage: string`.
   - *Functions*: `addItem()`, `removeItem()`, `updateQuantity()`, `clearCart()`, `toggleDrawer()`, `applyCoupon()`, `removeCoupon()`, `setGiftOptions()`, `getSubtotal()`, `getDiscountAmount()`, `getTotal()`.
2. **`useAuthStore` (`authStore.ts`)**:
   - *State*: `user: User | null`, `accessToken: string | null`, `isAuthenticated: boolean`.
   - *Functions*: `login(user, token)`, `logout()`, `updateUser(userData)`.
3. **`useWishlistStore` (`wishlistStore.ts`)**:
   - *State*: `items: Product[]`.
   - *Functions*: `addToWishlist(product)`, `removeFromWishlist(productId)`, `isInWishlist(productId)`, `fetchWishlist()`.
4. **`useCurrencyStore` (`currencyStore.ts`)**:
   - *State*: `currency: 'INR' | 'USD' | 'EUR' | 'GBP'`, `exchangeRates: Record<string, number>`.
   - *Functions*: `setCurrency(code)`, `formatPrice(priceInINR)`.

---

## 6. Backend API Services & Controllers (NestJS)

The NestJS backend in `auremont-backend/src` exposes modular endpoints:

| Module | Primary Controller | Key Endpoints & Functions |
| :--- | :--- | :--- |
| **Auth** | `AuthController` | `POST /auth/register`, `POST /auth/login`, `POST /auth/refresh`, `POST /auth/forgot-password`, `POST /auth/reset-password` |
| **Users** | `UsersController` | `GET /users/me`, `PUT /users/me`, `GET /users/me/addresses`, `POST /users/me/addresses` |
| **Admin** | `AdminController` | `GET /admin/dashboard/metrics`, `GET /admin/users`, `POST /admin/users`, `GET /admin/audit-logs` |
| **Products** | `ProductsController` | `GET /products`, `GET /products/:slug`, `POST /products` (Admin), `PUT /products/:id` (Admin), `DELETE /products/:id` (Admin) |
| **Categories** | `CategoriesController` | `GET /categories`, `GET /categories/:slug`, `POST /categories` (Admin) |
| **Cart** | `CartController` | `GET /cart`, `POST /cart/items`, `PUT /cart/items/:id`, `DELETE /cart/items/:id`, `DELETE /cart` |
| **Orders** | `OrdersController` | `POST /orders`, `GET /orders/my-orders`, `GET /orders/:id`, `PATCH /orders/:id/status` (Admin) |
| **Payments** | `PaymentsController` | `POST /payments/create-intent`, `POST /payments/verify` |
| **Coupons** | `CouponsController` | `POST /coupons/validate`, `GET /coupons` (Admin), `POST /coupons` (Admin) |
| **Reviews** | `ReviewsController` | `GET /reviews/product/:productId`, `POST /reviews`, `PATCH /reviews/:id/approve` (Admin) |
| **Blogs** | `BlogsController` | `GET /blogs`, `GET /blogs/:slug`, `POST /blogs` (Admin) |
| **Contact** | `ContactController` | `POST /contact`, `GET /contact` (Admin), `PATCH /contact/:id/status` (Admin) |
| **Wishlist** | `WishlistController` | `GET /wishlist`, `POST /wishlist/:productId`, `DELETE /wishlist/:productId` |
| **Audit** | `AuditService` | Internal service capturing administrative entity mutations |

---

## 7. Cross-Cutting Utilities & Security Controls

1. **Axios Token Interceptor (`lib/axios.ts`)**:
   - Automatically attaches `Authorization: Bearer <token>` header to outbound requests.
   - Catches `401 Unauthorized` responses and automatically executes token refresh routines.
2. **Global Exception Filter (`all-exceptions.filter.ts`)**:
   - Intercepts all HTTP exceptions, normalizes error response bodies, and logs errors with context.
3. **Role Guards & JWT Guards**:
   - Protects sensitive backend endpoints based on user permissions (`customer` vs `admin` roles).
4. **Validation Pipelines**:
   - Uses `class-validator` and `class-transformer` DTOs to validate input request payloads.

---

## Conclusion
The Auremont codebase represents an enterprise luxury e-commerce platform. It balances high-end aesthetics and rich customer interactivity on the frontend with robust database modeling, administrative analytics, and modular API design on the backend.
