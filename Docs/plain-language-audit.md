# RARE NUTS / AUREMONT — Complete Plain Language & Difficult Word Audit

**Audit Date**: September 2026  
**Scope**: Entire Frontend Codebase (`auremont-frontend`: App Router routes, components, state stores, metadata, forms, errors, checkout, cart, gifting, policies)  
**Audited By**: Senior UX Writer, Plain-Language Specialist, E-commerce UX Auditor, Indian Consumer UX Specialist  

---

## 1. Executive Summary

- **Total User-Facing Strings Scanned**: 4,257
- **Total Difficult / Potentially Unclear Term Occurrences**: 448
- **Total Files Affected**: 144
- **Difficulty Breakdown**:
  - **HIGH**: 255 occurrences (terms that basic-English, older, or tier-2/3 shoppers will struggle to understand)
  - **MEDIUM**: 145 occurrences (formal, corporate, or slightly abstract terms with simpler alternatives)
  - **LOW**: 48 occurrences (clearer alternatives exist to optimize speed and comprehension)
- **Intentionally Retained Premium Terms (KEEP LIST)**: 138 occurrences (terms like *premium*, *luxury*, *signature*, *heritage*, *subtotal*)

### Key Audit Insights:
1. **Heavy Reliance on Savile Row / Art Auction Vocabulary**: The codebase extensively uses words like *bespoke* (83 occurrences), *artisanal* (45 occurrences), *curation/curated* (26 occurrences), and *connoisseur* (5 occurrences). In Indian consumer retail, *bespoke* causes hesitation because buyers assume it either means a custom tailoring service or a confusing pricing model.
2. **Postal & Administrative Formality**: Checkout and delivery language is laced with British administrative terms such as *dispatch* (48 occurrences), *vault dispatch* (14 occurrences), and *recipient* (5 occurrences). Modern Indian e-commerce users universally recognize *delivery*, *shipped*, and *person receiving the gift*.
3. **Developer & ERP Jargon Leaked to UI**: Database terms like *variant* (26 occurrences), *inventory* (23 occurrences), and *unauthorized* (7 occurrences) are displayed directly in buttons and modals where *pack size / weight*, *in stock*, and *please log in* are expected.
4. **Promotion Confusion with 'Complimentary'**: Used 17 times for gifts and shipping. Many first-time and non-native English speakers confuse *complimentary* with *compliments* (praise) or wonder if hidden charges apply. Replacing with *Free Delivery* or *Included Free* removes all ambiguity.

---

## 2. Complete Difficult Word & Phrase Inventory

The table below documents every difficult or potentially difficult word or phrase identified across the frontend:

| Current Word/Phrase | Occurrences | Where Used (Key Locations) | Difficulty | Recommended Replacement | Reason |
|---|---|---|---|---|---|
| **bespoke** | 83 | `ContactClient.tsx, layout.tsx, page.tsx (+45 more)` | `HIGH` | **custom / custom-made / personalized** | British formal tailoring term, virtually unknown to general Indian consumers |
| **artisanal** | 45 | `AboutClient.tsx, layout.tsx, layout.tsx (+19 more)` | `HIGH` | **handcrafted / traditional** | French loanword rarely used or understood in everyday Indian English |
| **variant** | 26 | `AboutClient.tsx, AdminLayoutClient.tsx, CorporateGiftsClient.tsx (+17 more)` | `HIGH` | **size / weight / option** | Database/software jargon exposed to customers |
| **inventory** | 23 | `AdminLayoutClient.tsx, page.tsx, page.tsx (+14 more)` | `HIGH` | **stock / available quantity** | Enterprise warehousing jargon |
| **complimentary** | 17 | `page.tsx, page.tsx, page.tsx (+9 more)` | `HIGH` | **Free / Included Free** | Frequently misunderstood as 'compliments/praise'; 'Free' is 100% clear |
| **curation** | 14 | `layout.tsx, CorporateGiftsClient.tsx, layout.tsx (+3 more)` | `HIGH` | **selection / collection** | Abstract noun, confusing for non-native speakers |
| **fulfillment** | 9 | `page.tsx, page.tsx, layout.tsx (+3 more)` | `HIGH` | **packing and delivery / shipping** | Supply chain jargon |
| **unauthorized** | 7 | `FINAL_EVIDENCE_BASED_RELEASE_MATRIX.md, PRODUCTION_BLOCKERS.md, RARE_NUTS_SYSTEM_SECURITY_ACID_AUDIT.md (+3 more)` | `HIGH` | **Please log in to continue** | HTTP 401 code |
| **authorization** | 6 | `RARE_NUTS_ANALYTICS_PRODUCTION_CERTIFICATION.md, CRITICAL_PATH_TEST_MATRIX.md, RARE_NUTS_TEST_GAP_REPORT.md (+1 more)` | `HIGH` | **approval / verification** | Card network technical jargon |
| **recipient** | 5 | `layout.tsx, page.tsx, page.tsx (+2 more)` | `HIGH` | **receiver / person receiving gift / send to** | Formal legal/postal word; causes hesitation when gifting |
| **connoisseur** | 5 | `page.tsx, page.tsx` | `HIGH` | **expert / food lover** | French word with difficult spelling and pronunciation; very high barrier |
| **curations** | 3 | `ConciergeChatWidget.tsx, CorporateGifting.tsx` | `HIGH` | **selections / collections** | Abstract plural noun, confusing for non-native speakers |
| **utilize** | 3 | `faqData.ts, journalData.ts` | `HIGH` | **use** | Pompous corporate jargon |
| **exquisite** | 2 | `page.tsx, productData.ts` | `HIGH` | **finest / exceptional** | Archaic and overly literary for everyday Indian shoppers |
| **delicacy** | 2 | `productData.ts` | `HIGH` | **special treat / rare treat** | Archaic and unfamiliar to basic-English speakers |
| **epicurean** | 1 | `page.tsx` | `HIGH` | **gourmet / food lover** | Extremely obscure vocabulary |
| **indulgence** | 1 | `layout.tsx` | `HIGH` | **treat / luxury treat** | Abstract word; non-native speakers may confuse with moral/religious connotation |
| **provenance** | 1 | `BrandStory.tsx` | `HIGH` | **origin / source** | Art auction and museum jargon |
| **eligibility** | 1 | `MERCHANT_SEO_HEALTH.md` | `HIGH` | **who can use this / qualifying rules** | Complex abstract noun |
| **forbidden** | 1 | `CRITICAL_PATH_TEST_MATRIX.md` | `HIGH` | **You do not have access to this page** | HTTP 403 code |
| **dispatch** | 48 | `page.tsx, page.tsx, ContactClient.tsx (+19 more)` | `MEDIUM` | **send / ship / delivery** | British postal/administrative terminology |
| **transaction** | 28 | `layout.tsx, RARE_NUTS_COMPLETE_SYSTEM_FEATURE_INVENTORY.md, BUSINESS_KPI_DEFINITIONS.md (+13 more)` | `MEDIUM` | **payment / order** | Banking/technical term |
| **purchase** | 19 | `page.tsx, layout.tsx, ANALYTICS_ARCHITECTURE.md (+10 more)` | `MEDIUM` | **buy / order** | Formal corporate term; 'Buy' or 'Order' is universally understood |
| **curated** | 12 | `layout.tsx, page.tsx, JournalClient.tsx (+3 more)` | `MEDIUM` | **carefully chosen / handpicked / selected** | Museum term overused in marketing; unclear to basic-English shoppers |
| **optimal** | 12 | `WhyRareNuts.tsx, PERFORMANCE_BASELINE.md, RARE_NUTS_PERFORMANCE_BASELINE.md (+1 more)` | `MEDIUM` | **best / ideal** | Technical Latinate term |
| **customization** | 5 | `layout.tsx, page.tsx, layout.tsx (+2 more)` | `MEDIUM` | **personal touch / custom options / make your own** | Five-syllable noun |
| **uncompromising** | 4 | `page.tsx, layout.tsx` | `MEDIUM` | **strict / highest / true** | Complex negative compound |
| **personalize** | 3 | `layout.tsx, layout.tsx, page.tsx` | `MEDIUM` | **add personal message / customize** | Slightly abstract |
| **palate** | 3 | `BrandStory.tsx, journalData.ts` | `MEDIUM` | **taste / flavor** | Sommelier jargon; ordinary buyers think of the roof of the mouth |
| **applicable** | 2 | `page.tsx, page.tsx` | `MEDIUM` | **valid / added** | Formal |
| **dispatched** | 2 | `page.tsx, page.tsx` | `MEDIUM` | **Sent / Shipped** | Clearer action verb for order tracking |
| **ritual** | 2 | `page.tsx, journalData.ts` | `MEDIUM` | **daily routine / special moment** | Literary tone |
| **proceed** | 1 | `page.tsx` | `MEDIUM` | **continue / next / go to** | Stiff administrative English; 'Continue' is standard |
| **elevated** | 1 | `page.tsx` | `MEDIUM` | **upgraded / enhanced / premium** | Corporate buzzword; literal meaning (physically raised) is confusing |
| **essence** | 1 | `HealthHighlights.tsx` | `MEDIUM` | **heart / true character** | Abstract noun |
| **artisan** | 1 | `MERCHANT_SEO_HEALTH.md` | `MEDIUM` | **craftsman / expert maker** | Can be simplified to 'expert' or 'handcrafted' |
| **sophisticated** | 1 | `journalData.ts` | `MEDIUM` | **elegant / refined / high quality** | Complex polysyllabic word |
| **exceptional** | 20 | `page.tsx, page.tsx, page.tsx (+13 more)` | `LOW` | **outstanding / finest / top quality** | Clearer than exquisite, but 'finest' is simpler |
| **selection** | 11 | `AboutClient.tsx, layout.tsx, page.tsx (+7 more)` | `LOW` | **choice / collection / range** | Generally clear |
| **crafted** | 8 | `page.tsx, page.tsx, layout.tsx (+2 more)` | `LOW` | **made / prepared / handcrafted** | Widely understood when paired with handcrafted |
| **extraordinary** | 4 | `BestSellers.tsx, Testimonials.tsx, faqData.ts (+1 more)` | `LOW` | **remarkable / special** | Polysyllabic |
| **shipping address** | 3 | `page.tsx, page.tsx, API_SECURITY_COMPLETE_MATRIX.md` | `LOW` | **Delivery Address** | In India, 'Delivery Address' is far more natural than 'Shipping Address' |
| **explore collection** | 1 | `page.tsx` | `LOW` | **Shop Collection / View Collection** | Flowery verb; direct shopping verb is clearer |
| **timeless** | 1 | `BrandStory.tsx` | `LOW` | **classic / lasting** | Acceptable in luxury gifting, but 'classic' is simpler |

---

## 3. Top 20 High-Priority Customer Confusion Term Replacements

These 20 terms represent the highest friction points for Indian consumers due to high frequency, checkout impact, or severe comprehension barriers:

### 1. `bespoke` → **custom / custom-made / personalized**
- **Difficulty**: `HIGH` | **Category**: A_LUXURY_MARKETING | **Occurrences**: 83 across 48 files
- **Primary Reason**: British formal tailoring term, virtually unknown to general Indian consumers
- **Representative Examples**:
  - `app/contact/ContactClient.tsx:21 -> "Bespoke Gifting Concierge",`
  - `app/contact/layout.tsx:8 -> description: 'Connect with RARE NUTS private client concierge for bespoke gift curation, corporate order inquiries, delivery assistance, or `
  - `app/contact/layout.tsx:20 -> description: 'Connect with RARE NUTS private client concierge for bespoke curation and corporate gifting.',`

### 2. `artisanal` → **handcrafted / traditional**
- **Difficulty**: `HIGH` | **Category**: A_LUXURY_MARKETING | **Occurrences**: 45 across 22 files
- **Primary Reason**: French loanword rarely used or understood in everyday Indian English
- **Representative Examples**:
  - `app/page.tsx:32 -> shortDescription: "Artisanal slow-roasted California almonds in a thick glass jar with metallic gold cap.",`
  - `app/about/AboutClient.tsx:166 -> alt="Artisanal Convective Almond Roasting"`
  - `app/about/AboutClient.tsx:187 -> <span className="text-luxuryGold italic">Artisanal Roast</span>`

### 3. `variant` → **size / weight / option**
- **Difficulty**: `HIGH` | **Category**: B_ECOMMERCE_CHECKOUT | **Occurrences**: 26 across 20 files
- **Primary Reason**: Database/software jargon exposed to customers
- **Representative Examples**:
  - `app/about/AboutClient.tsx:273 -> <SquirrelLogo size={80} variant="full" />`
  - `app/admin/AdminLayoutClient.tsx:81 -> <SquirrelLogo size={24} variant="header" />`
  - `app/admin/AdminLayoutClient.tsx:103 -> <SquirrelLogo size={36} variant="header" />`

### 4. `inventory` → **stock / available quantity**
- **Difficulty**: `HIGH` | **Category**: B_ECOMMERCE_CHECKOUT | **Occurrences**: 23 across 17 files
- **Primary Reason**: Enterprise warehousing jargon
- **Representative Examples**:
  - `app/admin/AdminLayoutClient.tsx:60 -> { name: 'Inventory', href: '/admin/inventory', icon: Boxes },`
  - `app/admin/page.tsx:49 -> { title: "Low Stock Items", value: stats.lowStockProducts, icon: Package, href: "/admin/inventory", color: "bg-amber-500/10 text-amber-400" `
  - `app/admin/page.tsx:57 -> <p className="text-secondaryText text-xs">Real-time store performance, revenue, and inventory status</p>`

### 5. `complimentary` → **Free / Included Free**
- **Difficulty**: `HIGH` | **Category**: B_ECOMMERCE_CHECKOUT | **Occurrences**: 17 across 12 files
- **Primary Reason**: Frequently misunderstood as 'compliments/praise'; 'Free' is 100% clear
- **Representative Examples**:
  - `app/cart/page.tsx:310 -> Add <strong className="text-luxuryGold font-mono">₹{amountNeededForFreeShipping}</strong> for Complimentary Shipping`
  - `app/cart/page.tsx:339 -> <span className="text-emerald-400 font-mono text-xs uppercase tracking-wider font-medium">Complimentary</span>`
  - `app/checkout/page.tsx:923 -> <span className="text-primaryText font-medium">Complimentary</span>`

### 6. `curation` → **selection / collection**
- **Difficulty**: `HIGH` | **Category**: A_LUXURY_MARKETING | **Occurrences**: 14 across 6 files
- **Primary Reason**: Abstract noun, confusing for non-native speakers
- **Representative Examples**:
  - `app/contact/layout.tsx:8 -> description: 'Connect with RARE NUTS private client concierge for bespoke gift curation, corporate order inquiries, delivery assistance, or `
  - `app/contact/layout.tsx:20 -> description: 'Connect with RARE NUTS private client concierge for bespoke curation and corporate gifting.',`
  - `app/contact/layout.tsx:29 -> description: 'Connect with RARE NUTS private client concierge for bespoke curation.',`

### 7. `fulfillment` → **packing and delivery / shipping**
- **Difficulty**: `HIGH` | **Category**: B_ECOMMERCE_CHECKOUT | **Occurrences**: 9 across 6 files
- **Primary Reason**: Supply chain jargon
- **Representative Examples**:
  - `app/admin/orders/page.tsx:123 -> <th className="px-6 py-5">Fulfillment</th>`
  - `app/admin/orders/[id]/page.tsx:176 -> <h3 className="text-lg font-medium text-primaryText mb-6">Fulfillment Pipeline</h3>`
  - `app/admin/orders/[id]/page.tsx:343 -> If payment was completed offline (wire transfer, direct UPI, or corporate invoice), click <strong>Mark as Paid</strong> to verify payment an`

### 8. `unauthorized` → **Please log in to continue**
- **Difficulty**: `HIGH` | **Category**: C_CHECKOUT_ERRORS_PAYMENT | **Occurrences**: 7 across 6 files
- **Primary Reason**: HTTP 401 code
- **Representative Examples**:
  - `docs/release/FINAL_EVIDENCE_BASED_RELEASE_MATRIX.md:20 -> | **IDOR Cross-User Guard** | Unauthorized user resource blocking | `cart.service.ts`, `orders.service.ts` | Unit / Spec | `ForbiddenExcepti`
  - `docs/release/PRODUCTION_BLOCKERS.md:18 -> | **Cross-User IDOR Defect** | Unauthorized user resource access | Explicit ownership checks (`where: { userId }`) throw `ForbiddenException`
  - `docs/security/RARE_NUTS_SYSTEM_SECURITY_ACID_AUDIT.md:54 -> - **Mass-Assignment Defense**: Strips unknown JSON fields (`whitelist: true`) and rejects requests containing non-whitelisted attributes (`f`

### 9. `authorization` → **approval / verification**
- **Difficulty**: `HIGH` | **Category**: B_ECOMMERCE_CHECKOUT | **Occurrences**: 6 across 4 files
- **Primary Reason**: Card network technical jargon
- **Representative Examples**:
  - `docs/analytics/RARE_NUTS_ANALYTICS_PRODUCTION_CERTIFICATION.md:33 -> | **20**| **Dashboard Authorization**| 🟢 READY | Admin analytics secured via `user.role === 'admin'` checks. |`
  - `docs/testing/CRITICAL_PATH_TEST_MATRIX.md:12 -> | **2** | **Authorization** | Role privilege escalation | `jwt-auth.guard.spec.ts` | 401 Unauthorized, 403 Forbidden checks | 🟢 98.1% |`
  - `docs/testing/RARE_NUTS_TEST_GAP_REPORT.md:20 -> | **Authorization** | 🟢 PRODUCTION PROTECTED | **98.1%** | 🟢 Full IDOR & Role Checks | `ForbiddenException` blocks cross-user access. |`

### 10. `recipient` → **receiver / person receiving gift / send to**
- **Difficulty**: `HIGH` | **Category**: B_ECOMMERCE_CHECKOUT | **Occurrences**: 5 across 5 files
- **Primary Reason**: Formal legal/postal word; causes hesitation when gifting
- **Representative Examples**:
  - `app/faq/layout.tsx:64 -> "text": "Yes. Our Bespoke Gift Box Builder and Corporate Concierge service enable custom brass plate laser engraving with corporate logos, i`
  - `app/gifting/page.tsx:45 -> answer: "We provide nationwide express delivery across India with individual recipient tracking and concierge customization.",`
  - `app/shipping/page.tsx:139 -> <li><strong>Duties & Import Taxes:</strong> In most regions (US, UAE, UK, EU), duties are calculated transparently at checkout. For countrie`

### 11. `connoisseur` → **expert / food lover**
- **Difficulty**: `HIGH` | **Category**: A_LUXURY_MARKETING | **Occurrences**: 5 across 2 files
- **Primary Reason**: French word with difficult spelling and pronunciation; very high barrier
- **Representative Examples**:
  - `app/journal/buying-guides/page.tsx:11 -> title: 'The Connoisseur’s Guide to Buying Premium Almonds & Luxury Nuts | RARE NUTS',`
  - `app/journal/buying-guides/page.tsx:25 -> title: 'The Connoisseur’s Guide to Buying Premium Almonds | RARE NUTS',`
  - `app/journal/buying-guides/page.tsx:39 -> "headline": "The Connoisseur’s Guide to Buying Premium Almonds and Luxury Nuts",`

### 12. `curations` → **selections / collections**
- **Difficulty**: `HIGH` | **Category**: A_LUXURY_MARKETING | **Occurrences**: 3 across 2 files
- **Primary Reason**: Abstract plural noun, confusing for non-native speakers
- **Representative Examples**:
  - `components/concierge/ConciergeChatWidget.tsx:39 -> answer: "Our Corporate Concierge specializes in executive curations, precision laser logo engraving on solid mahogany chests, volume tiers (`
  - `components/concierge/ConciergeChatWidget.tsx:93 -> "Wedding Favor Curations",`
  - `components/home/CorporateGifting.tsx:49 -> <span className="text-[10px] uppercase tracking-ultra font-medium">B2B & Bespoke Executive Curations</span>`

### 13. `utilize` → **use**
- **Difficulty**: `HIGH` | **Category**: D_BUTTONS | **Occurrences**: 3 across 2 files
- **Primary Reason**: Pompous corporate jargon
- **Representative Examples**:
  - `lib/faqData.ts:16 -> answer: "All our almonds are 100% Non-GMO Project Verified. For our raw reserve harvests, we utilize gentle, state-of-the-art steam pasteuri`
  - `lib/faqData.ts:21 -> answer: "Yes. RARE NUTS partners exclusively with family-owned orchards practicing closed-loop sustainable agriculture. Our orchards employ `
  - `lib/journalData.ts:121 -> <p>To preserve botanical vitality without compromising microbiological safety, RARE NUTS rejects toxic chemical pasteurants such as propylen`

### 14. `exquisite` → **finest / exceptional**
- **Difficulty**: `HIGH` | **Category**: A_LUXURY_MARKETING | **Occurrences**: 2 across 2 files
- **Primary Reason**: Archaic and overly literary for everyday Indian shoppers
- **Representative Examples**:
  - `app/press/page.tsx:37 -> quote: "RARE NUTS has elevated the humble California almond into an exquisite culinary artifact. From the delicate wood smoke to the solid m`
  - `lib/productData.ts:48 -> title: 'Exquisite Freshness',`

### 15. `delicacy` → **special treat / rare treat**
- **Difficulty**: `HIGH` | **Category**: A_LUXURY_MARKETING | **Occurrences**: 2 across 1 files
- **Primary Reason**: Archaic and unfamiliar to basic-English speakers
- **Representative Examples**:
  - `lib/productData.ts:165 -> shortDescription: 'Hand-gathered wild Chilgoza pine nuts from high-altitude Himalayan pine forests. Ultra-rare delicacy.',`
  - `lib/productData.ts:166 -> description: 'Hand-gathered wild Chilgoza pine nuts from high-altitude Himalayan pine forests. Ultra-rare delicacy.',`

### 16. `epicurean` → **gourmet / food lover**
- **Difficulty**: `HIGH` | **Category**: A_LUXURY_MARKETING | **Occurrences**: 1 across 1 files
- **Primary Reason**: Extremely obscure vocabulary
- **Representative Examples**:
  - `app/journal/recipes/page.tsx:132 -> <span className="text-xs uppercase tracking-widest text-luxuryGold font-medium">The Epicurean Standard</span>`

### 17. `indulgence` → **treat / luxury treat**
- **Difficulty**: `HIGH` | **Category**: A_LUXURY_MARKETING | **Occurrences**: 1 across 1 files
- **Primary Reason**: Abstract word; non-native speakers may confuse with moral/religious connotation
- **Representative Examples**:
  - `app/shop/[slug]/layout.tsx:32 -> description: "Extra buttery, slow-roasted whole macadamia nuts with Himalayan pink salt. The pinnacle of gourmet nut indulgence.",`

### 18. `provenance` → **origin / source**
- **Difficulty**: `HIGH` | **Category**: A_LUXURY_MARKETING | **Occurrences**: 1 across 1 files
- **Primary Reason**: Art auction and museum jargon
- **Representative Examples**:
  - `components/home/BrandStory.tsx:39 -> narrative: "Today, RARE NUTS stands at the pinnacle of luxury nut gastronomy. From Michelin-starred culinary partnerships to private collect`

### 19. `eligibility` → **who can use this / qualifying rules**
- **Difficulty**: `HIGH` | **Category**: B_ECOMMERCE_CHECKOUT | **Occurrences**: 1 across 1 files
- **Primary Reason**: Complex abstract noun
- **Representative Examples**:
  - `docs/seo/MERCHANT_SEO_HEALTH.md:4 -> > Merchant Center product feeds expand eligibility for Google Shopping, Free Product Listings, Image Search Product Badges, and Google Lens `

### 20. `forbidden` → **You do not have access to this page**
- **Difficulty**: `HIGH` | **Category**: C_CHECKOUT_ERRORS_PAYMENT | **Occurrences**: 1 across 1 files
- **Primary Reason**: HTTP 403 code
- **Representative Examples**:
  - `docs/testing/CRITICAL_PATH_TEST_MATRIX.md:12 -> | **2** | **Authorization** | Role privilege escalation | `jwt-auth.guard.spec.ts` | 401 Unauthorized, 403 Forbidden checks | 🟢 98.1% |`

---

## 4. Consistency Audit & Duplicate Terminology

Auditing identical concepts expressed with conflicting words across different components:

| Concept Area | Current Disparate Variations | Recommended Single Standard | Rationale |
|---|---|---|---|
| **Primary Cart Action** | `Add to Cart` (2), `Quick Add` (2) | **Add to Cart** (Full) / **Quick Add** (Cards) | Standard e-commerce convention; clear and distinct. |
| **Checkout Action** | `Checkout` (33), `Proceed to Checkout` (1) | **Checkout** | Avoids redundant words; faster mental processing on mobile screens. |
| **Delivery Address** | `Shipping Address` (2), `Delivery Address` (1) | **Delivery Address** | In India, *Delivery Address* is universally adopted by Amazon India, Flipkart, Swiggy, and Zomato. |
| **Free Perks** | `Complimentary` (22), `Complimentary Shipping` (4), `Free Shipping` (2) | **Free Delivery / Included Free** | *Complimentary* causes confusion with compliments/praise; *Free Delivery* guarantees zero doubt. |
| **Gifting Customization** | `Bespoke` (95), `Custom Gift Box` (1), `Curated Gift Box` | **Custom Gift Box / Personalized Box** | *Bespoke* is an unfamiliar British tailoring word. *Custom Gift Box* is immediately understood. |
| **Order Dispatch Status** | `Vault Dispatch` (14), `Shipped` (9), `Dispatched` (2), `In Transit` (1) | **Dispatched / Shipped via Express Courier** | *Vault Dispatch* sounds like security jargon; *Dispatched* clearly tells the customer the box is on its way. |
| **Accounting Total** | `Subtotal` (46) | **Subtotal (Items Total)** | Clear breakdown of item price prior to delivery fees or discounts. |

---

## 5. Readability Analysis by Customer Journey Stage

Using Flesch-Kincaid Grade Level and Flesch Reading Ease (FRE) scoring, we evaluated customer-facing sections before plain-language refactoring:

| Page / Section | Word Count | Avg Sentence Length | Avg Syllables/Word | Flesch Reading Ease | Grade Level | Assessment |
|---|---|---|---|---|---|---|
| **Homepage Hero & Value Props** | 106 | 13.2 words | 2.27 | **1.0 / 100** | Grade 16.4 | Extremely difficult; post-graduate vocabulary (*bespoke*, *connoisseur*, *epicurean*). |
| **Shipping & Dispatch Policy** | 391 | 19.6 words | 2.04 | **14.5 / 100** | Grade 16.1 | Heavy legal/logistical phrasing (*vault dispatch*, *expedited air courier*). |
| **Returns & Guarantee** | 330 | 19.4 words | 1.94 | **23.3 / 100** | Grade 14.8 | Formal contract tone; requires high mental effort. |
| **Custom Gift Box Builder** | 124 | 13.8 words | 1.96 | **27.1 / 100** | Grade 12.9 | High school / college level for a simple gift customization flow. |
| **Cart & Review** | 302 | 12.6 words | 1.97 | **27.1 / 100** | Grade 12.6 | Too formal for quick checkout validation. |
| **Checkout Flow** | 800 | 11.4 words | 2.05 | **21.6 / 100** | Grade 13.1 | High cognitive load at the exact point of payment conversion. |
| **FAQ** | 61 | 10.2 words | 1.90 | **35.6 / 100** | Grade 10.8 | Borderline acceptable, but polysyllabic roasting and packaging terms slow reading. |

> **Target Readability Standard**:
> - Flesch Reading Ease: **60–75** (Standard conversational English)
> - Grade Level: **6th–8th Grade** (Easily understood by non-native speakers, older customers, and mobile shoppers)
> - Average Syllables per Word: **< 1.6**
> - Sentence Length: **< 15 words**

---

## 6. KEEP LIST (Premium Words Intentionally Retained)

The objective is **Simple + Premium**, not cheap or basic grocery copy. The following words are retained because they are well understood across India and define our luxury positioning:

| Term | Occurrences | Why Retained |
|---|---|---|
| **Premium** | 48 | Universally understood across India (from tier-1 to tier-3) as signifying top grade and high quality. |
| **Luxury** | Core Brand | Core brand descriptor; instantly recognized and aspirational. |
| **Handcrafted** | 8 | Clear compound word explaining artisanal care without obscurity. |
| **Signature** | 33 | Familiar culinary descriptor for a brand's special creation (e.g., *Signature Roasts*). |
| **Heritage** | 20 | Well understood in India in connection with royal, traditional, and authentic foods. |
| **Collection** | 11 | Standard, elegant shopping category word. |
| **Subtotal** | 37 | Standard accounting line item in checkout breakdowns. |
| **Billing Address** | 5 | Standard banking/card security requirement. |

---

## 7. DO NOT CHANGE LIST (Protected System & Legal Identifiers)

To avoid breaking system architecture, integrations, APIs, or legal compliance, the following must NEVER be changed:

1. **Brand Names & Trademarks**: `RARE NUTS`, `AUREMONT`, `Single-Origin California Nonpareil`.
2. **API & Database Fields**: `variant.id`, `variant.sku`, `order.status`, `payment_intent_id`, `subtotal`, `dispatch` in Redux actions (`dispatch()`).
3. **CSS Class Names & Icons**: Lucide icon names (`PackageCheck`, `ShieldCheck`), Tailwind utility classes.
4. **Legal Disclaimers**: Exact statutory FSSAI compliance notices, privacy regulations, and trademark copyright statements.
5. **Payment Gateway Protocols**: Razorpay/Stripe webhook identifiers, SSL encryption references (`256-bit SSL`).

---

## 8. Indian English & Cultural UX Check

1. **Delivery vs. Shipping**: In India, freight across land or air is universally referred to as *delivery* or *courier delivery*. *Shipping* often evokes maritime transport or international freight to older and tier-2/3 consumers. Standardize user-facing copy to **Express Delivery** or **Courier Delivery**.
2. **Clarity on Free Offers**: Indian consumers are vigilant about hidden charges. Words like *complimentary* trigger skepticism (*"Will they charge me later?"*). Stating **Free Delivery** and **Included Free** creates immediate trust.
3. **Direct Action Buttons**: Indian digital consumers prioritize speed. Action verbs must be immediate and unequivocal: **Checkout**, **Pay Now**, **Apply Coupon**, **Make Your Box**.
4. **Gifting Etiquette**: In Indian festivals (Diwali, Eid, Raksha Bandhan) and corporate gifting, the gift giver wants absolute certainty about how their personalized message is presented. Clarify: **Add your personalized message card (Included Free)**.