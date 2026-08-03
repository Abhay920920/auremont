# Advanced QA Test Report

**Total Passed:** 27
**Total Failed:** 0

### Category Totals
- **Authentication Security:** 5 Passed, 0 Failed
- **Authorization:** 4 Passed, 0 Failed
- **Cart Security:** 2 Passed, 0 Failed
- **Financial Integrity:** 2 Passed, 0 Failed
- **Inventory:** 2 Passed, 0 Failed
- **Concurrency:** 2 Passed, 0 Failed
- **Idempotency:** 2 Passed, 0 Failed
- **Coupons:** 5 Passed, 0 Failed
- **Transactions:** 1 Passed, 0 Failed
- **Database Constraints:** 1 Passed, 0 Failed
- **Rate Limiting:** 1 Passed, 0 Failed

### Detailed Results
| Section | Test | Expected | Actual | Result |
|---|---|---|---|---|
| Authentication Security | POST /orders without JWT | 401 | 401 | ✅ PASS |
| Authentication Security | POST /orders with malformed JWT | 401 | 401 | ✅ PASS |
| Authentication Security | POST /orders with invalid/expired JWT | 401 | 401 | ✅ PASS |
| Authentication Security | UserId spoofing ignored | UserId A or 400 | Passed | ✅ PASS |
| Cart Security | User A checkout User B cart | 403 | 403 | ✅ PASS |
| Cart Security | User A modify User B cart | 403 | 403 | ✅ PASS |
| Financial Integrity | Backend ignores client financial values | 1000 or 400 | Passed | ✅ PASS |
| Inventory | Invalid quantities rejected | 400 | Rejected/Clean | ✅ PASS |
| Inventory | Insufficient stock during checkout | 409 | 409 | ✅ PASS |
| Concurrency | Concurrent last-item checkout | 1 success 1 conflict 0 stock | 1s 1c 0stk | ✅ PASS |
| Idempotency | Idempotent request retry | Same logical order | Same order | ✅ PASS |
| Idempotency | Idempotency key collision prevention | No new order | Prevented | ✅ PASS |
| Coupons | Flat coupon calculation | 100 | 100 | ✅ PASS |
| Coupons | Percentage coupon calculation | 100 | 100 | ✅ PASS |
| Coupons | Percentage maxDiscount calculation | 50 | 50 | ✅ PASS |
| Coupons | Expired coupon rejected | 400 | 400 | ✅ PASS |
| Coupons | Minimum order not reached | 400 | 400 | ✅ PASS |
| Concurrency | Coupon concurrency limit | <=1 success | 1 success | ✅ PASS |
| Financial Integrity | Decimal/Rounding logic | No JS precision crash | Success | ✅ PASS |
| Transactions | Transaction rollback on Address constraint failure | No partial data | Rollback OK | ✅ PASS |
| Authorization | User B cannot fetch User A order | 403/404 | 403 | ✅ PASS |
| Authorization | Cancel unauthorized order rejected | 403/404/401 | 404 | ✅ PASS |
| Authorization | Wishlist userId spoofing ignored | Ignored/403/404 | Passed | ✅ PASS |
| Authorization | Review invalid rating rejected | 400/404 | 400 | ✅ PASS |
| Authentication Security | Mass assignment blocked | 201(stripped)/400 | 201 | ✅ PASS |
| Database Constraints | Duplicate user email rejected | 409/400/500 | 409 | ✅ PASS |
| Rate Limiting | Rate limiting (429) active | 429 triggered | Yes | ✅ PASS |