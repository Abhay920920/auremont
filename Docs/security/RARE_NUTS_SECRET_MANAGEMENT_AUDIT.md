# RARE NUTS — Secret Management & Environment Variables Audit

This document reviews how the RARE NUTS platform manages cryptographic keys, database credentials, and payment gateway secrets.

---

## 1. Secrets and Keys Inventory

The system relies on environment variables to manage sensitive keys.

| Secret Name | Purpose | Scope | Storage Location | Exposure Risk |
| :--- | :--- | :--- | :--- | :--- |
| `DATABASE_URL` | PostgreSQL connection string | Backend | `.env` | **CRITICAL** |
| `JWT_SECRET` | Signing JWT Access Tokens | Backend | `.env` | **CRITICAL** |
| `JWT_REFRESH_SECRET` | Signing JWT Refresh Tokens | Backend | `.env` | **CRITICAL** |
| `RAZORPAY_KEY_ID` | Payment gateway API key | Backend | `.env` | **HIGH** |
| `RAZORPAY_KEY_SECRET` | Payment gateway API secret | Backend | `.env` | **CRITICAL** |
| `RAZORPAY_WEBHOOK_SECRET`| Verifying payment webhooks | Backend | `.env` | **HIGH** |
| `NEXT_PUBLIC_API_URL` | Public backend API URL | Frontend | `.env.local` / config | **LOW** |

---

## 2. Security Guidelines & Controls

### 2.1 Git Ignored Environment Files
- Environment files (`.env`, `.env.local`, `.env.production`) are excluded from version control using the configuration in [.gitignore](file:///c:/Users/adts-/Desktop/almonds/.gitignore).
- Environment variables are supplied to production containers via deployment platform configs (Vercel and Render).

### 2.2 Frontend Environment Variables
- Next.js restricts environment variables from being bundled into client-side code unless they are prefixed with `NEXT_PUBLIC_`.
- Public variables, such as `NEXT_PUBLIC_API_URL`, do not contain credentials or secret keys.

### 2.3 Web Server Configuration
- Web server configurations do not hardcode credentials.
- Nginx proxy configurations forward requests to backend containers securely, keeping the actual backend ports inaccessible to the public network.

---

## 3. Recommendations & Remediation Plan

1. **Verify Default Keys in Development:**
   - Ensure development environments do not use production credentials.
   - Use mock modes when no API keys are present to prevent backend crashes in local setups.
2. **Implement Secret Rotation:**
   - Establish a policy to rotate JWT secrets and API keys periodically.
3. **Database Credentials Isolation:**
   - Keep database ports closed to the public network, routing all database queries through private networks (e.g., Docker private bridges or VPNs).
