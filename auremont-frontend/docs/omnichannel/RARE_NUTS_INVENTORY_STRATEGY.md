# RARE NUTS — Unified Inventory Allocation & Protection Strategy

**Brand:** RARE NUTS  
**Official Domain:** https://rarenuts.in  

---

## 🔒 Master Stock Allocation Rules

```
Total Physical Inventory: 2,000 Units
 ├── Website Direct Allocation: 800 Units (40%) [Website-First Priority]
 ├── Amazon Channel Allocation: 500 Units (25%)
 ├── Blinkit Channel Allocation: 400 Units (20%)
 └── Zepto Channel Allocation: 300 Units (15%)
```

- **Row-Level Locking Protection**: All stock decrements pass through `SELECT ... FOR UPDATE` transactions in NestJS `OrdersService`.
- **Overselling Defense**: If physical stock drops below threshold buffers (e.g. < 50 units remaining), marketplace allocations dynamically scale down to protect owned D2C website fulfillment.
