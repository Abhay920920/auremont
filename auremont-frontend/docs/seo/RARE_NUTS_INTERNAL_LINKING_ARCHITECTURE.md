# RARE NUTS — Topical Silo & Internal Linking Architecture

**Brand:** RARE NUTS  
**Official Domain:** https://rarenuts.in  

---

## 🏗️ Topical Silo Hierarchy

```
                                    ┌──────────────┐
                                    │   HOMEPAGE   │
                                    │ rarenuts.in  │
                                    └──────┬───────┘
                                           │
         ┌─────────────────────────────────┼─────────────────────────────────┐
         ▼                                 ▼                                 ▼
┌─────────────────┐               ┌─────────────────┐               ┌─────────────────┐
│   STOREFRONT    │               │     GIFTING     │               │     JOURNAL     │
│   (/shop)       │               │ (/corporate)    │               │   (/journal)    │
└────────┬────────┘               └────────┬────────┘               └────────┬────────┘
         │                                 │                                 │
         ▼                                 ▼                                 ▼
┌─────────────────┐               ┌─────────────────┐               ┌─────────────────┐
│ PRODUCT PAGES   │               │ BESPOKE BUILDER │               │ STORAGE GUIDES  │
│ (/shop/[slug])  │               │ (/custom-gift)  │               │ (/journal/[s])  │
└─────────────────┘               └─────────────────┘               └─────────────────┘
```

---

## 🔗 Internal Link Anchor Text Rules

- **Product Page Links**: Contextual anchors (e.g. *"explore our California Reserve raw almonds selection"*).
- **Gifting Page Links**: Value-driven anchors (e.g. *"configure bespoke corporate gift boxes"*).
- **Breadcrumb Navigation**: Hierarchical BreadcrumbList JSON-LD metadata rendered on all sub-routes.
