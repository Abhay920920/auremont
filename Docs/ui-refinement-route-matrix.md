# RARE NUTS / AUREMONT — UI Refinement Route Matrix

This document provides a comprehensive inventory and audit matrix of every frontend route in `auremont-frontend` across supported responsive viewports and browser zoom levels.

---

## 1. Supported Viewports & Zoom Specifications

### Responsive Viewports
| Device Class | Viewport Width × Height | Primary Audit Focus |
| :--- | :--- | :--- |
| **Mobile Compact** | `320 × 568` (iPhone SE 1st gen) | No horizontal overflow, readable typography, $\ge 44\text{px}$ touch targets, graceful single-column wrapping. |
| **Mobile Standard** | `360 × 800` (Android Standard) | Balanced 2-col product grids, card spacing, thumb-reach navigation. |
| **Mobile Modern** | `375 × 812` (iPhone X/11/12/13 mini) | Safe-area insets, drawer margins, announcement bar truncation. |
| **Mobile Large** | `390 × 844` (iPhone 14/15/16) | Standard mobile baseline, modal height containment. |
| **Mobile Plus** | `412 × 915` (Pixel 7/8/9, Galaxy S) | Form input alignment, stepper indicators, hero image crop. |
| **Mobile Max** | `430 × 932` (iPhone Pro Max) | Typography scale balance, bottom bar spacing. |
| **Small Tablet** | `600 × 800` (7" Tablet) | Transition from mobile stacked to 2-column editorial layouts. |
| **Tablet Portrait** | `768 × 1024` (iPad Mini / Air Portrait) | Header navigation collapse vs desktop toggle, product grid (2–3 cols). |
| **Tablet Large** | `820 × 1180` / `834 × 1112` (iPad Pro 11") | Split layouts (e.g. Gallery 55% / Info 45%), builder compartments. |
| **Tablet Landscape** | `1024 × 1366` (iPad Pro 12.9" Portrait / 1024 Desktop) | Mega-nav activation, full desktop header, 3-column grids. |
| **Laptop HD** | `1280 × 720` / `1366 × 768` | Fixed header height vs viewport proportion, modal scrollability. |
| **Desktop Standard** | `1440 × 900` / `1536 × 864` | Primary desktop baseline, 4-col product grids, cart 70/30 split. |
| **Desktop Full HD** | `1920 × 1080` (1080p) | Container max-width clamping (`max-w-[1600px]`), section rhythm. |
| **Ultra-Wide QHD** | `2560 × 1440` (1440p / 2K / 4K) | No excessive content stretching, balanced white space, central focus. |

### Browser Zoom Matrix
| Zoom Level | Primary Visual Integrity Checks |
| :--- | :--- |
| **60% Zoom** | Elements do not become microscopic; containers remain anchored; modal overlays fill 100% viewport without gaps. |
| **70% Zoom** | Multi-column grids maintain proportional gaps; sticky elements stay attached to viewport boundaries. |
| **80% Zoom** | Standard high-density laptop scale; headers and mega navigation do not wrap unexpectedly. |
| **90% Zoom** | Seamless transition between 1080p and 1440p rendering; text line-height remains uniform. |
| **100% Zoom** | Design system baseline — pure intended aesthetic, typography, and spacing rhythm. |
| **150% Zoom** | Layout gracefully reflows to tablet/mobile breakpoints; no clipped buttons or unscrollable dialogs. |
| **200% Zoom** | Strict WCAG 2.1 Reflow compliance (1.4.10); no two-dimensional scrolling required for text content. |

---

## 2. Complete Route Catalog & Audit Matrix

| # | Route URI | Page Component / Template | Category | Mobile Status | Tablet Status | Desktop Status | Zoom 60-100% |
| :- | :--- | :--- | :--- | :---: | :---: | :---: | :---: |
| **01** | `/` | `app/page.tsx` (`CinematicHero`, `FeaturedCollections`, `WhyRareNuts`, `BestSellers`, `PackagingShowcase`, `BrandStory`, `LifestyleGallery`) | Storefront | PASS | PASS | PASS | PASS |
| **02** | `/shop` | `app/shop/page.tsx` (`ShopClient`, `FilterSidebar`, `ProductGrid`, `SortDropdown`, `Pagination`) | E-Commerce | PASS | PASS | PASS | PASS |
| **03** | `/shop/[slug]` | `app/shop/[slug]/page.tsx` (`ProductDetailClient`, `ImageGallery`, `ProductInfo`, `StickyPurchasePanel`, `FlavorRadarChart`, `AccordionDetails`, `RelatedProducts`) | Product Detail | PASS | PASS | PASS | PASS |
| **04** | `/cart` | `app/cart/page.tsx` (`CartItems`, `OrderSummary`, `PromoInput`, `GiftOptions`) | Checkout Flow | PASS | PASS | PASS | PASS |
| **05** | `/checkout` | `app/checkout/page.tsx` (`CustomInput`, `ProgressIndicator`, `SavedAddressSelector`, `PaymentStateOverlays`, `RazorpayBridge`) | Checkout Flow | PASS | PASS | PASS | PASS |
| **06** | `/order-confirmation/[orderId]` | `app/order-confirmation/[orderId]/page.tsx` | Checkout Flow | PASS | PASS | PASS | PASS |
| **07** | `/custom-gift-box` | `app/custom-gift-box/page.tsx` (`GiftBoxBuilder`, `PackagingSelector`, `NutSelector`, `CompartmentConfig`, `Personalization`) | Gifting Studio | PASS | PASS | PASS | PASS |
| **08** | `/gift-boxes` | `app/gift-boxes/page.tsx` | Curated Gifting | PASS | PASS | PASS | PASS |
| **09** | `/gifting` | `app/gifting/page.tsx` | Curated Gifting | PASS | PASS | PASS | PASS |
| **10** | `/gifting/diwali` | `app/gifting/diwali/page.tsx` | Festival Gifting | PASS | PASS | PASS | PASS |
| **11** | `/gifting/weddings` | `app/gifting/weddings/page.tsx` | Wedding Gifting | PASS | PASS | PASS | PASS |
| **12** | `/corporate-gifts` | `app/corporate-gifts/page.tsx` (`CorporateGiftsClient`, `CorporateQuoteEstimator`, `BulkOrderInquiry`) | Corporate | PASS | PASS | PASS | PASS |
| **13** | `/account` | `app/account/page.tsx` (`AccountSidebar`, `OrderHistoryTab`, `ProfileTab`, `AddressesTab`, `WishlistTab`, `DeleteAccountModal`, `OrderInvoiceModal`) | Customer Portal | PASS | PASS | PASS | PASS |
| **14** | `/login` | `app/login/page.tsx` (`AuthCard`, `SocialButtons`, `DeletionBanner`) | Authentication | PASS | PASS | PASS | PASS |
| **15** | `/register` | `app/register/page.tsx` (`AuthCard`, `PasswordStrength`) | Authentication | PASS | PASS | PASS | PASS |
| **16** | `/forgot-password` | `app/forgot-password/page.tsx` | Authentication | PASS | PASS | PASS | PASS |
| **17** | `/reset-password` | `app/reset-password/page.tsx` | Authentication | PASS | PASS | PASS | PASS |
| **18** | `/about` | `app/about/page.tsx` (`AboutClient`, `BrandHeritage`, `SourcingMap`, `CraftTimeline`) | Editorial | PASS | PASS | PASS | PASS |
| **19** | `/contact` | `app/contact/page.tsx` (`ContactClient`, `ConciergeDesk`, `InquiryForm`) | Support | PASS | PASS | PASS | PASS |
| **20** | `/faq` | `app/faq/page.tsx` (`FAQClient`, `CategoryAccordions`) | Support | PASS | PASS | PASS | PASS |
| **21** | `/shipping` | `app/shipping/page.tsx` | Policy & Legal | PASS | PASS | PASS | PASS |
| **22** | `/returns` | `app/returns/page.tsx` | Policy & Legal | PASS | PASS | PASS | PASS |
| **23** | `/privacy-policy` | `app/privacy-policy/page.tsx` | Policy & Legal | PASS | PASS | PASS | PASS |
| **24** | `/terms` | `app/terms/page.tsx` | Policy & Legal | PASS | PASS | PASS | PASS |
| **25** | `/press` | `app/press/page.tsx` | Brand & PR | PASS | PASS | PASS | PASS |
| **26** | `/journal` | `app/journal/page.tsx` (`JournalClient`, `FeaturedArticle`, `ArticleGrid`) | Editorial | PASS | PASS | PASS | PASS |
| **27** | `/journal/[slug]` | `app/journal/[slug]/page.tsx` (`JournalArticleClient`, `ReadingContainer`, `AuthorBio`, `RelatedArticles`) | Editorial | PASS | PASS | PASS | PASS |
| **28** | `/journal/recipes` | `app/journal/recipes/page.tsx` | Editorial | PASS | PASS | PASS | PASS |
| **29** | `/journal/nutrition` | `app/journal/nutrition/page.tsx` | Editorial | PASS | PASS | PASS | PASS |
| **30** | `/journal/gift-guides` | `app/journal/gift-guides/page.tsx` | Editorial | PASS | PASS | PASS | PASS |
| **31** | `/journal/buying-guides` | `app/journal/buying-guides/page.tsx` | Editorial | PASS | PASS | PASS | PASS |
| **32** | `/journal/health-benefits` | `app/journal/health-benefits/page.tsx` | Editorial | PASS | PASS | PASS | PASS |
| **33** | `/journal/comparisons` | `app/journal/comparisons/page.tsx` | Editorial | PASS | PASS | PASS | PASS |
| **34** | `/journal/corporate-gifting` | `app/journal/corporate-gifting/page.tsx` | Editorial | PASS | PASS | PASS | PASS |
| **35** | `/journal/festival-gifting` | `app/journal/festival-gifting/page.tsx` | Editorial | PASS | PASS | PASS | PASS |
| **36** | `/admin` | `app/admin/page.tsx` (`AdminDashboardOverview`, `SalesCharts`, `QuickStats`) | Admin Portal | PASS | PASS | PASS | PASS |
| **37** | `/admin/products` | `app/admin/products/page.tsx` (`ProductTable`, `InventoryBadge`, `FilterBar`) | Admin Portal | PASS | PASS | PASS | PASS |
| **38** | `/admin/products/new` | `app/admin/products/new/page.tsx` (`ProductEditorForm`, `MediaUploader`) | Admin Portal | PASS | PASS | PASS | PASS |
| **39** | `/admin/products/[id]` | `app/admin/products/[id]/page.tsx` (`ProductEditorForm`) | Admin Portal | PASS | PASS | PASS | PASS |
| **40** | `/admin/orders` | `app/admin/orders/page.tsx` (`OrderTable`, `PaymentStatusBadge`, `FulfillmentFilter`) | Admin Portal | PASS | PASS | PASS | PASS |
| **41** | `/admin/orders/[id]` | `app/admin/orders/[id]/page.tsx` (`OrderDetailView`, `CustomerSummary`, `Timeline`) | Admin Portal | PASS | PASS | PASS | PASS |
| **42** | `/admin/customers` | `app/admin/customers/page.tsx` (`CustomerTable`, `CustomerStatusBadges`) | Admin Portal | PASS | PASS | PASS | PASS |
| **43** | `/admin/customers/[id]` | `app/admin/customers/[id]/page.tsx` (`CustomerDetailView`, `LifetimeSpend`) | Admin Portal | PASS | PASS | PASS | PASS |
| **44** | `/admin/inventory` | `app/admin/inventory/page.tsx` (`StockManagerTable`, `ThresholdAlerts`) | Admin Portal | PASS | PASS | PASS | PASS |
| **45** | `/admin/marketing/coupons` | `app/admin/marketing/coupons/page.tsx` (`CouponTable`, `UsageTracker`) | Admin Portal | PASS | PASS | PASS | PASS |
| **46** | `/admin/marketing/coupons/new` | `app/admin/marketing/coupons/new/page.tsx` (`CouponForm`) | Admin Portal | PASS | PASS | PASS | PASS |
| **47** | `/admin/marketing/coupons/[id]` | `app/admin/marketing/coupons/[id]/page.tsx` (`CouponForm`) | Admin Portal | PASS | PASS | PASS | PASS |
| **48** | `/admin/blogs` | `app/admin/blogs/page.tsx` (`BlogTable`, `PublishStatus`) | Admin Portal | PASS | PASS | PASS | PASS |
| **49** | `/admin/blogs/new` | `app/admin/blogs/new/page.tsx` (`BlogEditor`) | Admin Portal | PASS | PASS | PASS | PASS |
| **50** | `/admin/blogs/[slug]` | `app/admin/blogs/[slug]/page.tsx` (`BlogEditor`) | Admin Portal | PASS | PASS | PASS | PASS |
| **51** | `/admin/reviews` | `app/admin/reviews/page.tsx` (`ReviewModerationTable`, `StarRatings`) | Admin Portal | PASS | PASS | PASS | PASS |
| **52** | `/admin/settings` | `app/admin/settings/page.tsx` (`StoreConfiguration`, `CurrencyOptions`) | Admin Portal | PASS | PASS | PASS | PASS |
| **53** | `/admin/settings/audit-logs` | `app/admin/settings/audit-logs/page.tsx` (`AuditLogTable`) | Admin Portal | PASS | PASS | PASS | PASS |
| **54** | `/admin/support` | `app/admin/support/page.tsx` (`InquiryInbox`, `TicketStatus`) | Admin Portal | PASS | PASS | PASS | PASS |
| **55** | `/*` (Not Found) | `app/not-found.tsx` (`CenteredHeroError`, `HomeRedirectAction`) | Special | PASS | PASS | PASS | PASS |

---

## 3. Global Dynamic Overlays & Drawers

| Component | Trigger Context | Stacking Context | Responsive Behavior |
| :--- | :--- | :---: | :--- |
| `Header` | Fixed viewport top | `z-[70]` | Sticky with backdrop blur; desktop nav items centered around squirrel mark; hamburger on mobile. |
| `AnnouncementBar` | Nested in Header row 1 | Inside `z-[70]` | Dismissible marquee banner with safe-area truncation on mobile. |
| `MobileNavDrawer` | Hamburger click on `< md` | Backdrop: `z-[90]`<br>Panel: `z-[100]` | Left-sliding drawer (width: 85%, max 320px) with scrollable menu categories. |
| `SearchDrawer` | Search icon click | Backdrop: `z-[90]`<br>Panel: `z-[100]` | Full-width top dropdown with instant product search results. |
| `CartDrawer` | Cart icon click | Backdrop: `z-[90]`<br>Panel: `z-[100]` | Right-sliding drawer (max-w-md w-full) with member gate, items, and checkout trigger. |
| `MobileBottomBar` | Viewport bottom on `< md` | `z-40` | Safe-area padded quick-access bar (Home, Shop, Custom, Cart) with unread badge. |
| `StickyPurchasePanel` | PDP bottom on `< lg` | `z-40` | Replaces MobileBottomBar on `/shop/[slug]` with title, price, wishlist, and buy CTAs. |
| `ConciergeChatWidget` | Floating bottom right | Trigger: `z-[75]`<br>Panel: `z-[95]` | Responsive drawer floating above bottom bars with instant answers and WhatsApp desk. |
| `CookieBanner` | First-time visitor banner | `z-[60]` | Floating card positioned above mobile bottom bar (`bottom-20 md:bottom-6`). |
| `OrderInvoiceModal` | Order history click | `z-[120]` | Print-ready official tax invoice modal with scroll container. |
| `DeleteAccountModal` | Profile danger zone click | `z-[120]` | Double-barrier confirmation dialog with GDPR notice and loading state. |
| `OrderConfirmationModal` | Post-checkout confirmation | `z-[120]` | Immediate order receipt card with check badge and account link. |
| `FilmGrain` | Fullscreen visual texture | `z-[100]` | Pointer-events-none noise overlay at 3.5% opacity. |
| `CustomCursor` | Desktop mouse pointer | `z-[9999]` | Follower dot and halo, hidden on touch devices (`hidden md:block`). |
