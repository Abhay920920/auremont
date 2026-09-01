# RARE NUTS — Data Validation Matrix

This document maps all frontend user input fields directly to their backend DTO validation constraints, ensuring zero-trust payload sanitization.

---

## 1. Storefront Inputs to Backend DTO Mapping

| Frontend Form | Field Name | Format Requirement | Backend DTO Constraint | Sanitization / Defense Handler |
| :--- | :--- | :--- | :--- | :--- |
| **User Registration** | `firstName` | Max 100 chars | `@IsString()`, `@MaxLength(100)` | Strips leading/trailing spaces. |
| | `lastName` | Max 100 chars | `@IsString()`, `@MaxLength(100)` | Strips leading/trailing spaces. |
| | `email` | RFC 5322 Email | `@IsEmail()`, `@MaxLength(255)` | Lowercased, trimmed. |
| | `password` | Min 8 characters | `@IsString()`, `@MinLength(8)` | Hashed immediately via `bcrypt`. |
| **Addresses** | `fullName` | Max 150 chars | `@IsString()`, `@MaxLength(150)` | Enforces required string. |
| | `phone` | Phone format | `@IsString()`, `@MaxLength(20)` | Validates number digits. |
| | `addressLine1` | Max 255 chars | `@IsString()`, `@MaxLength(255)` | Strips HTML tags. |
| | `city` | Max 100 chars | `@IsString()`, `@MaxLength(100)` | Enforces character set. |
| | `state` | Max 100 chars | `@IsString()`, `@MaxLength(100)` | Enforces character set. |
| | `postalCode` | Postal check | `@IsString()`, `@MaxLength(20)` | Removes formatting spaces. |
| | `country` | Max 100 chars | `@IsString()`, `@MaxLength(100)` | Whitelists target regions. |
| **Cart Operations** | `productId` | UUID format | `@IsString()`, Regex UUID check | Validates product presence. |
| | `quantity` | Positive integer | `@IsInt()`, `@Min(1)` | Rejects negative/decimal quantities. |
| **Checkout Coupon** | `code` | Coupon slug | `@IsString()`, `@MaxLength(50)` | Uppercased, trimmed. |
| **Product Reviews** | `rating` | Integer [1 to 5] | `@IsInt()`, `@Min(1)`, `@Max(5)` | Bounds input ratings. |
| | `title` | Max 150 chars | `@IsString()`, `@MaxLength(150)` | Escapes HTML markup. |
| | `review` | Standard text | `@IsString()`, `@IsOptional()` | Escapes script injections. |
| **Contact Message** | `name` | Max 150 chars | `@IsString()`, `@MaxLength(150)` | Enforced via `CreateContactDto`. |
| | `email` | RFC 5322 Email | `@IsEmail()`, `@MaxLength(255)` | Enforced via `CreateContactDto`. |
| | `subject` | Max 255 chars | `@IsString()`, `@MaxLength(255)` | Enforced via `CreateContactDto`. |
| | `message` | Max 5000 chars | `@IsString()`, `@MaxLength(5000)`| Prevents buffer overflows. |
| **Blog Post (Admin)**| `title` | Max 255 chars | `@IsString()`, `@MaxLength(255)` | Enforced via `CreateBlogDto`. |
| | `content` | HTML / MD | `@IsString()`, `@IsNotEmpty()` | Sanitized text area content. |

---

## 2. API Sanitization Architecture

The application enforces validation at three layers:
1. **Frontend Zod Schemas:** Validates forms (e.g., login, register, profile editing) on the client side before sending HTTP requests, improving user experience by displaying instant error messages.
2. **NestJS Validation Pipe:** Uses `ValidationPipe` with options `whitelist: true` and `forbidNonWhitelisted: true`. Any field not explicitly declared in the input DTO is removed from the payload or triggers a `400 Bad Request` response, preventing Mass Assignment vulnerabilities.
3. **Database Constraints:** PostgreSQL enforces strict data types, field lengths (`VarChar(255)`), and unique keys (`User.email`, `Order.orderNumber`, `CartItem.uniqueCartProduct`) as a final line of defense.
