# RARE NUTS — Integration Test Gaps & Database Boundary Report

**Purpose:** Identifies database, concurrency, and network boundary behaviors that **CANNOT** be proven solely with unit mocks and require real PostgreSQL integration testing.

---

## 🗄️ Database Boundary Behaviors Requiring Real PostgreSQL

### 1. PostgreSQL Row-Level Locking (`SELECT ... FOR UPDATE`)
- **Location**: [orders.service.ts](file:///c:/Users/adts-/Desktop/almonds/auremont-backend/src/orders/orders.service.ts#L109-L115)
- **Why Unit Mocks Are Insufficient**: Mocking `$queryRaw` simply returns predefined array fixtures. Unit tests cannot prove that PostgreSQL actually blocks concurrent execution or releases locks upon transaction rollback.
- **Integration Test Requirement**: Spin up a real PostgreSQL container (via Docker / Testcontainers) and issue simultaneous async checkouts targeting the same product row to verify lock queuing.

### 2. Transaction Rollback Atomicity
- **Location**: [orders.service.ts](file:///c:/Users/adts-/Desktop/almonds/auremont-backend/src/orders/orders.service.ts#L101-L267)
- **Why Unit Mocks Are Insufficient**: Prisma `$transaction` mock callbacks execute in JS memory. They do not test database constraint violations (e.g. foreign key failures, decimal precision truncation).
- **Integration Test Requirement**: Intentionally trigger a database constraint violation on `Address` creation and verify that `Product` stock levels remain untouched in PostgreSQL.

### 3. PostgreSQL Unique Index Constraints (`@@unique`)
- **Location**: `Wishlist(userId, productId)` & `CartItem(cartId, productId)` in `schema.prisma`.
- **Why Unit Mocks Are Insufficient**: Mock objects do not throw `PrismaClientKnownRequestError (P2002)` unless manually instructed.
- **Integration Test Requirement**: Assert that duplicate `CartItem` insertions trigger PostgreSQL database unique constraint exceptions.

---

## 🌐 External Network & Webhook Boundary Behaviors

### 1. Razorpay Payment Gateway Sandbox Verification
- **Location**: `PaymentsService.verifySignature`
- **Integration Requirement**: Issue test payments against Razorpay Test Mode keys (`rzp_test_...`) to verify real end-to-end webhook handshake.

### 2. Transactional Mail Provider SMTP Handshake
- **Location**: `CartRecoveryService` & `OutboxEvent` processor.
- **Integration Requirement**: Send test emails via Mailtrap / SendGrid Sandbox to verify HTML template parsing and header attachments.
