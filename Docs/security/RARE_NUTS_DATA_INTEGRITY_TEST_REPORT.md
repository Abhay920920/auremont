# RARE NUTS — Data Integrity Test Report

This document records the verification of data consistency, transaction rollbacks, unique constraints, and financial precision math.

---

## 1. Database Reliability Verification Matrix

| Integrity Vector | Testing Strategy | Expected Behavior | Verification Status | Notes |
| :--- | :--- | :--- | :---: | :--- |
| **Transaction Rollback**| Inject a database failure after stock decrement | Rollback all database modifications | `TEST VERIFIED` | Checked in [failure_injection.spec.ts](file:///c:/Users/adts-/Desktop/almonds/tests/failure-injection/failure_injection.spec.ts). |
| **Unique Constraints** | Send concurrent additions to duplicate cart items | Quantities merge, no duplicate rows created | `CODE VERIFIED` | Enforced by `CartItem` unique index. |
| **Monetary Precision** | Verify subtotal calculations for products | Exclude float math, use decimals | `CODE VERIFIED` | Enforced by `Decimal` types. |
| **Orphan Protection** | Attempt to delete an address linked to historical orders | DB restricts delete, throws validation error | `CODE VERIFIED` | Restricts deletes on active addresses. |

---

## 2. Technical Findings

### 2.1 Decimals for Financial Calculations
- Financial fields (`price`, `subtotal`, `shipping`, `tax`, `total`) use PostgreSQL's `Decimal(10,2)` type, preventing rounding errors.
- Pricing logic is calculated server-side, ignoring client-side values.

### 2.2 Relational Integrity
- Addresses used in orders cannot be modified or deleted, preserving historical order records.
- User deletions are restricted if orders exist, preventing orphan records.
