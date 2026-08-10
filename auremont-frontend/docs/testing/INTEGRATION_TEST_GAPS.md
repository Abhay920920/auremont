# RARE NUTS — Integration Test Gap & Boundary Report

**Purpose:** Documents database, payment sandbox, and infrastructure boundary behaviors that require real container or sandbox integration environments.

---

## 🗄️ Database & Concurrency Integration Gaps

1. **PostgreSQL Row-Level Locking (`SELECT * FROM "products" ... FOR UPDATE`)**:
   - *Unit Limitation*: Jest unit tests mock `tx.$queryRaw`. They cannot test whether PostgreSQL actually locks product rows or prevents concurrent transaction updates.
   - *Integration Test Requirement*: Multi-threaded concurrent order placement against PostgreSQL container.

2. **Prisma Transaction Rollback (`$transaction`)**:
   - *Unit Limitation*: Mock transactions execute in JS memory. They do not simulate SQL constraint rollbacks.
   - *Integration Test Requirement*: Trigger constraint errors during `Address` creation and assert PostgreSQL rolls back `Product` stock decrements.

3. **Razorpay Webhook Handshake**:
   - *Unit Limitation*: Unit tests mock HMAC signatures with static secret strings.
   - *Integration Test Requirement*: Issue test payments against Razorpay Test Sandbox (`rzp_test_...`).
