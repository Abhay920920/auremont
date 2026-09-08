# RARE NUTS / AUREMONT — Customer Account Deletion Policy

**Document Version:** 1.0.0  
**Effective Date:** September 8, 2026  
**Audience:** Engineering, Customer Experience, Security, Legal & Compliance  
**Classification:** Internal System & Privacy Governance  

---

## 1. Executive Summary & Core Principle

At RARE NUTS / AUREMONT, we uphold the utmost respect for customer privacy and individual data autonomy under global privacy regulations (including GDPR, CCPA, and India DPDP Act). Customers must have an accessible, transparent, secure, and permanent method to delete their personal account and associated data.

Simultaneously, the integrity of commercial transactions, financial ledgers, tax compliance filings, and historical fulfillment records must remain immutable and uncorrupted. 

Therefore, account deletion operates on a dual-track policy:
1. **Full Purge**: Complete deletion of personal credentials, active sessions, carts, wishlists, preferences, notifications, and standalone addresses.
2. **Anonymization with Record Preservation**: Permanent scrubbing of personal identifiable information (PII) from order, payment, and audit records, preserving only the non-identifiable commercial and fiscal history required by statutory law.

---

## 2. Data Entity Retention & Disposal Matrix

| Data Entity | Action | Retention / Anonymization Details |
| :--- | :--- | :--- |
| **User Identity & Profile** (0 past orders) | **HARD DELETE** | The user record is completely removed from the database (`tx.user.delete`). |
| **User Identity & Profile** (has past orders) | **ANONYMIZED** | Retained strictly to satisfy database referential integrity (`orders.user_id`).<br>• Name replaced with `"Deleted Customer"`<br>• Email scrambled to `deleted_<userId>@anonymized.invalid`<br>• Phone, password hash, OAuth IDs set to `null`<br>• Account status set to `inactive`<br>• Tokens & secrets permanently cleared |
| **Credentials & Secrets** | **IMMEDIATE PURGE** | `passwordHash`, `refreshToken`, `resetToken`, `resetTokenExpiry`, `googleId` are permanently wiped or deleted. |
| **Active Sessions & Tokens** | **IMMEDIATE REVOCATION** | Refresh token hash is removed from DB. Access tokens are invalidated by client state purge and inability to refresh or query profile. |
| **Standalone Addresses** | **HARD DELETE** | Any saved address not bound to a historical order is permanently deleted (`tx.address.deleteMany`). |
| **Order-Linked Addresses** | **ANONYMIZED** | Preserved solely as historical shipping snapshot.<br>• Recipient name replaced with `"Deleted Customer"`<br>• Phone replaced with `"0000000000"`<br>• Street lines replaced with `"[Redacted for Privacy]"`<br>• State, city, postal code retained for regional taxation and sales reporting |
| **Cart & Cart Items** | **HARD DELETE** | All active shopping carts and cart items are deleted immediately (`tx.cart.deleteMany`). |
| **Wishlist Items** | **HARD DELETE** | All saved wishlist relations are deleted immediately (`tx.wishlist.deleteMany`). |
| **Notifications** | **HARD DELETE** | All user notifications are deleted immediately (`tx.notification.deleteMany`). |
| **Product Reviews** | **POLICY CHOICE: ANONYMIZED** | Product rating and review content are preserved to prevent skewing collective product scores; the author relationship points to the anonymized `"Deleted Customer"`. (Unapproved/pending reviews from users with 0 orders are deleted). |
| **Orders & Order Items** | **RETAINED IMMUTABLE** | Order numbers, purchased SKUs, unit prices, tax, totals, discounts, and timestamps are preserved in full for statutory accounting and fulfillment reconciliation. |
| **Payment Records** | **RETAINED IMMUTABLE** | Gateway transaction IDs, verified amounts, currency, and payment timestamps remain intact for payment dispute defense and financial auditing. |
| **Audit Logs** | **DISASSOCIATED** | Historical audit logs have `userId` set to `null`. A single neutral audit event (`ACCOUNT_DELETED`) is logged without any personal data or credentials. |

---

## 3. Active Financial Operations & Pending Order Guard

Account deletion is **strictly blocked** if the customer has any active or pending financial operation:
- Order status is `placed`, `confirmed`, `packed`, or `shipped`.
- Payment status is `pending` or `processing`.

### Rationale:
Allowing account removal during fulfillment risks lost shipments, inability to deliver courier updates, dispute handling failures, and payment discrepancies.

### Customer Feedback:
When blocked, the system issues a clear, polite explanation:
> *"You cannot delete your account while you have active orders or in-progress payments. Please wait until your orders are delivered or contact customer concierge."*

Once all orders reach terminal states (`delivered` or `cancelled`), deletion is immediately accessible.

---

## 4. Re-Authentication & Confirmation Protocol

To prevent accidental deletions, session hijacking attacks, or malicious third-party manipulation:

1. **Authentication Requirement**: The endpoint requires an active, valid Bearer JWT (`JwtAuthGuard`).
2. **Re-Authentication (Password)**:
   - Customers with password credentials must enter their current password.
   - The password is authenticated against the database hash via `bcrypt.compare`.
   - Passwords are **never logged**, traced, or stored in plaintext.
3. **OAuth Exception**:
   - Customers who registered via Google OAuth (without password hash) verify identity through active session proof and explicit confirmation.
4. **Explicit Confirmation**:
   - The customer must supply the explicit string `"DELETE"` (case-insensitive) in the confirmation payload.
5. **Rate Limiting**:
   - The deletion endpoint is rate-limited via NestJS Throttler (`@Throttle({ default: { limit: 5, ttl: 60000 } })`) to prevent brute-forcing of passwords.

---

## 5. Authorization & BOLA / IDOR Protection

- The customer's identity is derived **exclusively** from the validated JWT token (`req.user.id`).
- The endpoint does not accept an arbitrary `userId` or route parameter. No customer can request or trigger the deletion of any other account.
- **Administrative Guard**: Administrative accounts (`role === 'admin'`) are blocked from self-deletion through the customer self-service endpoint to prevent accidental lockout of platform administrators.

---

## 6. Post-Deletion Behavior & Lifecycle Rules

Upon successful account deletion:
1. **Session Termination**: The frontend immediately clears all tokens, client storage, cart items, and redirects to the public storefront.
2. **Login Rejection**: Attempting to log in with the deleted email will fail with `Invalid credentials` or `User not found`.
3. **Token Refresh Rejection**: Attempting to use a previously held refresh token fails with `401 Unauthorized` (`Invalid refresh token`).
4. **Password Reset Neutrality**: Submitting the deleted email to the forgot-password flow yields the standard generic response without generating any reset token or dispatching emails.
5. **Re-Registration Allowed**: Because the old email is freed (or scrambled), the customer may register a new account under their original email in the future, starting with a completely fresh profile.

---

## 7. Error Handling & Idempotency

- If an account is already deleted or inactive, subsequent requests return `401 Unauthorized` or `404 Not Found`.
- All database mutations are wrapped in a single database transaction (`prisma.$transaction`) with a 15-second timeout, guaranteeing that an account deletion is either 100% complete or fully rolled back.
