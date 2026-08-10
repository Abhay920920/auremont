# RARE NUTS — Regression Test Policy & Bug Prevention Protocol

This policy governs the mandatory process for handling production bugs, regression prevention, and test suite maintenance for **RARE NUTS**.

---

## 📜 Mandatory 3-Step Regression Fix Protocol

Whenever a production bug, edge-case failure, or API defect is identified, engineers MUST follow this exact 3-step workflow before merging a fix:

```
[1. REPRODUCE WITH FAILING TEST] ──► Write a unit/integration test that reproduces the bug (Test MUST FAIL).
                │
                ▼
[2. IMPLEMENT CODE FIX]          ──► Modify business logic until the regression test passes cleanly.
                │
                ▼
[3. PERMANENT COMMIT]            ──► Commit the regression test permanently to prevent future regressions.
```

---

## 🚫 Prohibited Practices
1. **Never Delete Failing Tests**: If a test fails in CI/CD, engineers MUST fix the underlying business code or update outdated test specifications. Deleting or skipping (`it.skip`) failing tests is strictly prohibited.
2. **Never Mask Errors with Try/Catch Suppressions**: Never resolve a unit test failure by wrapping assertions in empty `try {} catch {}` blocks.
3. **No Hardcoded Mocks for Calculations**: Subtotal, tax, discount, and stock calculations MUST be evaluated using realistic mathematical inputs.

---

## 📋 Historical Regression Log Ledger

| Bug Ref | Issue Description | Root Cause | Permanent Unit Test Added | Status |
| :--- | :--- | :--- | :--- | :--- |
| **REG-001** | Product slug lookup threw 500 error when UUID product ID was passed to `/shop/[slug]` route. | Parameter missing UUID vs slug fallback. | `products.service.spec.ts` (`findBySlug finds by UUID or slug`) | ✅ RESOLVED |
| **REG-002** | Unauthenticated guest visitors logged 401 errors in console when visiting homepage. | Header and Notification components invoked `/wishlists` & `/notifications/me` without token check. | `Header.tsx` & `NotificationDropdown.tsx` token guards | ✅ RESOLVED |
| **REG-003** | `crypto.randomUUID()` error in non-secure HTTP dev environments. | Unsafe call to `crypto.randomUUID()`. | `checkout/page.tsx` (`randomUuid` fallback test) | ✅ RESOLVED |
