# RARE NUTS — Unified Order Management System (OMS) Architecture

**Brand:** RARE NUTS  
**Official Domain:** https://rarenuts.in  

---

## 📦 Master Order Model Attributes

```typescript
interface UnifiedOrder {
  internalOrderId: string;   // RARE NUTS Order UUID (e.g. ORD-2026-XXXX)
  channel: 'WEBSITE' | 'AMAZON' | 'BLINKIT' | 'ZEPTO';
  externalOrderId?: string;  // Channel-specific Order ID
  status: 'PENDING' | 'CONFIRMED' | 'PACKING' | 'SHIPPED' | 'DELIVERED' | 'CANCELLED';
  subtotal: Decimal;
  taxableValue: Decimal;
  cgst: Decimal;
  sgst: Decimal;
  total: Decimal;
  paymentStatus: 'pending' | 'paid' | 'failed' | 'refunded';
  idempotencyKey?: string;
  createdAt: Date;
}
```

- **Idempotent Ingestion**: Checked via composite unique key `(channel, externalOrderId)`. Replayed webhook or API payloads skip creating duplicate internal orders.
