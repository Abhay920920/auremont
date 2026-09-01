# RARE NUTS — Dependency & Package Security Audit

This document audits the npm packages, frameworks, and transitive overrides used in the RARE NUTS platform.

---

## 1. Frontend Dependency Profile

The dependencies for the frontend application are defined in [package.json](file:///c:/Users/adts-/Desktop/almonds/auremont-frontend/package.json).

### 1.1 Core Libraries
- **`next` (v15.1.7) & `react` (v19.0.0):** Standard frameworks.
- **`zod` (v3.22.0):** Enforces form validation and type checking on the frontend.
- **`react-hook-form` (v7.50.0) & `@hookform/resolvers`:** Binds forms to Zod validation schemas.
- **`zustand` (v5.0.14):** Lightweight client state management.
- **`axios` (v1.6.0):** HTTP client.

---

## 2. Backend Dependency Profile

The dependencies for the backend application are defined in [package.json](file:///c:/Users/adts-/Desktop/almonds/auremont-backend/package.json).

### 2.1 Core Security Libraries
- **`@nestjs/passport`, `passport`, `passport-jwt`:** Handles authentication.
- **`bcrypt` (v6.0.0):** Handles password hashing.
- **`class-validator` (v0.14.0) & `class-transformer`:** Handles input validation.
- **`helmet` (v8.0.0):** Sets security HTTP headers.
- **`@nestjs/throttler` (v6.0.0):** Handles API rate limiting.
- **`razorpay` (v2.9.8):** Handles payment gateway integration.

---

## 3. Transitive Dependency Overrides

To address vulnerabilities in nested dependencies, package lock overrides are configured in [package.json](file:///c:/Users/adts-/Desktop/almonds/auremont-backend/package.json#L93-L105):

```json
  "overrides": {
    "formidable": "3.5.3",
    "multer": "2.2.0",
    "file-type": "21.3.2",
    "qs": "6.15.2",
    "body-parser": "1.20.6",
    "glob": "10.5.0",
    "picomatch": "4.0.4",
    "tmp": "0.2.6",
    "ajv": "8.18.0",
    "webpack": "5.104.1",
    "postcss": "8.5.23"
  }
```

These overrides pin specific sub-dependency versions, resolving known vulnerabilities in build tools and request parsing libraries.

---

## 4. Maintenance Guidelines

1. **Run Audits Regularly:**
   - Execute package audits periodically to identify new vulnerabilities:
     ```bash
     npm audit
     ```
2. **Review Updates Carefully:**
   - Test dependency updates in staging environments to check for breaking changes before deploying to production.
