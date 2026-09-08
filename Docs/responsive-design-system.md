# RARE NUTS / AUREMONT — Responsive Design System Specification

This document establishes the authoritative design system tokens, responsive breakpoints, container widths, rhythm spacing, touch target metrics, and z-index stacking layers for the **RARE NUTS / AUREMONT** luxury e-commerce platform.

---

## 1. Responsive Breakpoint System

The application uses Tailwind CSS enhanced with an extra-compact `xs` breakpoint to gracefully support legacy 320px–360px smartphones through 4K ultra-wide workstations:

| Token | Min Width | Target Devices / Viewports | Strategic Layout Behavior |
| :--- | :--- | :--- | :--- |
| **`default`** | `< 360px` | 320px–359px (iPhone SE 1st gen, Galaxy Fold closed) | Single-column product flow, condensed pill badges, full-width stacked action buttons. |
| **`xs`** | `360px` | 360px–639px (Standard modern smartphones) | Balanced 2-column product grid with 14px gutters, compact floating widgets. |
| **`sm`** | `640px` | 640px–767px (Large phones, Phablets, 7" Small Tablets) | 2-column editorial grids, side-by-side modal action buttons. |
| **`md`** | `768px` | 768px–1023px (Standard iPad, Tablets in Portrait) | Desktop navigation links activate, mobile bottom bar unmounts, sidebar layouts engage. |
| **`lg`** | `1024px` | 1024px–1279px (iPad Pro, Small Laptops) | 3-column product catalog, 50/50 split PDP hero (Gallery / Info), Filter sidebar sticky. |
| **`xl`** | `1280px` | 1280px–1535px (Standard Desktop & Laptops) | 4-column product grid, 70/30 checkout split, extended narrative typography. |
| **`2xl`** | `1536px` | 1536px–1919px (Large Workstations, High-Res Laptops) | Maximum editorial breathing room, clamped hero photography showcase. |
| **`ultra`** | `1920px+` | 1920px–2560px+ (4K Monitors, Ultra-wide Displays) | Clamped containers (`max-w-[1600px]` / `max-w-[1720px]`), balanced ambient margins. |

---

## 2. Container Hierarchy & Gutters

To prevent content from bleeding into viewport edges or stretching infinitely on ultra-wide screens, every page strictly adheres to one of four standardized containers:

```text
Viewport (100vw)
└── Container (Centered, Max-Width Clamped)
    └── Responsive Gutters (Mobile: 16px | Tablet: 24px–40px | Desktop: 48px)
```

| Container Utility | Max Width | Applied Routes / Sections |
| :--- | :--- | :--- |
| **`.site-container`** | `1600px` | Primary storefront, product catalog, category hero, account dashboard, checkout flow. |
| **`.site-container-wide`** | `1720px` | Cinematic hero, visual packaging showcase, full-bleed lifestyle galleries. |
| **`.site-container-editorial`**| `1400px` | Brand story, our heritage, corporate gifting overview, wedding services. |
| **`.site-container-reading`**  | `5xl` (`1024px`) | Journal articles, recipes, legal policies (Privacy, Terms, Shipping), FAQ. |

### Responsive Horizontal Padding
- **Mobile (`< 640px`)**: `px-4` (`16px`)
- **Small Tablet (`640px–767px`)**: `px-6` (`24px`)
- **Tablet (`768px–1023px`)**: `px-8` to `px-10` (`32px–40px`)
- **Desktop (`1024px+`)**: `px-12` (`48px`)

---

## 3. Authoritative Z-Index Stacking Architecture

To eliminate layer collisions (such as fixed headers overlaying dialogs or bottom bars obscuring cookie consent buttons), all fixed, absolute, and interactive overlays follow this strict hierarchy:

| Layer Level | Z-Index Class | Components & UI Elements |
| :--- | :---: | :--- |
| **0. Canvas / Ambient** | `z-0` to `z-10` | Section backgrounds, parallax lighting blobs, background video/imagery. |
| **1. In-Flow Content** | `z-20` to `z-30` | Product card tags, wishlist buttons, table sticky column headers. |
| **2. Mobile Fixed Bars** | `z-40` | `MobileBottomBar` (Navigation), `StickyPurchasePanel` (PDP Buy Bar). |
| **3. Floating Notices** | `z-[60]` | `CookieBanner` (positioned `bottom-[calc(4.75rem+env(safe-area-inset-bottom,0px))] md:bottom-6`). |
| **4. Fixed Store Header** | `z-[70]` | `Header` (Main Nav, Announcement Bar, Currency Selector, Mega Menu). |
| **5. Concierge Trigger** | `z-[75]` | Floating Concierge Chat circular trigger button. |
| **6. Interactive Drawers** | Backdrop: `z-[90]`<br>Panel: `z-[100]` | `SearchDrawer`, `CartDrawer`, `MobileNavDrawer`. |
| **7. Ambient Texture** | `z-[100]` | `FilmGrain` (`pointer-events-none`, non-blocking). |
| **8. Critical Dialogs** | Backdrop: `z-[110]`<br>Modal: `z-[120]` | `DeleteAccountModal`, `OrderInvoiceModal`, `OrderConfirmationModal`, `ReviewModal`. |
| **9. System Overlays** | `z-[130]` | Gateway payment transitions (`Verifying`, `Confirmed`), System Toasts. |
| **10. Desktop Cursor** | `z-[9999]` | `CustomCursor` (`hidden md:block`, pointer-events-none). |

---

## 4. Typography Scale & Editorial Rhythm

The typography utilizes **Cormorant Garamond** for editorial, evocative serif headings and **Inter** for crisp, highly readable numbers, metadata, and body copy.

| Element | Mobile Style | Tablet Style | Desktop Style | Tracking | Line Height |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **H1 Hero** | `text-4xl` (`36px`) | `text-6xl` (`60px`) | `text-7xl`–`text-[80px]` | `-0.02em` (`tracking-tight`) | `0.98` |
| **H2 Section** | `text-2xl` (`24px`) | `text-3xl` (`30px`) | `text-4xl`–`text-5xl` | `-0.01em` (`tracking-tight`) | `1.15` |
| **H3 Card** | `text-lg` (`18px`) | `text-xl` (`20px`) | `text-2xl` (`24px`) | `normal` | `1.25` |
| **Eyebrow / Sub** | `text-[10px]` (`10px`)| `text-xs` (`12px`) | `text-xs` (`12px`) | `0.35em` (`tracking-superwide`)| `1.4` |
| **Body Primary** | `text-xs` (`12px`) | `text-sm` (`14px`) | `text-base` (`16px`) | `normal` | `1.65` |
| **Meta / Price** | `text-xs` (`12px`) | `text-sm` (`14px`) | `text-base` (`16px`) | `0.05em` (font-mono) | `1.0` |

---

## 5. Spacing Rhythm & Vertical Cadence

To ensure intentional breathing room rather than random jumps:

```text
Section Spacing Cadence:
Mobile:  py-14 sm:py-18 (56px–72px)
Tablet:  py-20 md:py-24 (80px–96px)
Desktop: py-28 lg:py-32 (112px–128px)
```

- **Card Internal Padding**: `p-4 sm:p-6 md:p-8`
- **Grid Gaps**: `gap-3.5 sm:gap-6 md:gap-8 lg:gap-10`
- **Form Stack Gap**: `space-y-4 sm:space-y-5 md:space-y-6`

---

## 6. Button & Interactive Control Standards

Every interactive element conforms to strict ergonomic dimensions:
- **Mobile Touch Target**: $\ge 44 \times 44\text{px}$ (`min-h-[44px] min-w-[44px]`)
- **Primary Luxury Button**: Height $44\text{px}$–$56\text{px}$, font-size `text-xs`, tracking `tracking-ultra` (`0.45em`), radius `rounded-btn` (`2px`), uppercase bold.
- **Secondary Outline Button**: Border `border-divider`, hover `border-luxuryGold text-luxuryGold`.
- **Destructive Button**: Background `bg-red-950/40`, border `border-red-500/40`, text `text-red-300`.
- **Input Fields**: Height $44\text{px}$ (`h-11`), border-b transition, floating labels, Webkit autofill fix for dark mode.
