# RARE NUTS — Concurrency & Race Condition Test Report

This report documents verification of race conditions, concurrent checkouts, coupon usage counts, and webhook processing under load.

---

## 1. Concurrency Testing Matrix

| Concurrency Vector | Testing Strategy | Expected Behavior | Verification Status | Notes |
| :--- | :--- | :--- | :---: | :--- |
| **Simultaneous Checkout** | Send multiple checkout requests for the final stock unit | Exactly one succeeds, subsequent requests fail | `TEST VERIFIED` | Checked in [concurrency.spec.ts](file:///c:/Users/adts-/Desktop/almonds/tests/concurrency/concurrency.spec.ts). |
| **Coupon Limit** | Send concurrent coupon applications at the limit | Usage count is checked within transaction, rejects excess | `TEST VERIFIED` | Checked in [data_integrity.spec.ts](file:///c:/Users/adts-/Desktop/almonds/tests/integration/data_integrity.spec.ts). |
| **Idempotency Check** | Send identical checkout requests simultaneously | Second request returns the existing order | `CODE VERIFIED` | Enforced by `idempotencyKey` checks. |
| **Webhook Processing** | Send duplicate Razorpay webhooks for the same order | Processes event once, ignores duplicates | `CODE VERIFIED` | Enforced by `WebhookLog` checks. |

---

## 2. Technical Safeguards

### 2.1 Concurrency Locks
- Row-level database locks (`FOR UPDATE`) serialize access to product records, preventing concurrent checkout race conditions.

### 2.2 Webhook Idempotency
- Payment webhooks use the `WebhookLog` table to deduplicate events. Webhooks with identical event IDs return immediately, preventing duplicate payments or stock deductions.
