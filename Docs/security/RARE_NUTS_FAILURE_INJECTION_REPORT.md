# RARE NUTS — Failure Injection & Resiliency Test Report

This report documents verification of system recovery, database transaction rollbacks, outbox reliability, and error handling.

---

## 1. Failure Injection Matrix

| Failure Vector | Testing Strategy | Expected Behavior | Verification Status | Notes |
| :--- | :--- | :--- | :---: | :--- |
| **Mid-Tx Failure** | Inject error during address creation | Aborts transaction, rolls back changes | `TEST VERIFIED` | Checked in [failure_injection.spec.ts](file:///c:/Users/adts-/Desktop/almonds/tests/failure-injection/failure_injection.spec.ts). |
| **Payment Timeout** | Simulate timeout when calling Razorpay API | Saves order as pending, allows retry | `CODE VERIFIED` | Payment session handled outside transaction. |
| **Network Disconnect** | Simulate database connection failure | Aborts transaction, rolls back changes | `CODE VERIFIED` | DB transactions ensure consistency. |
| **Outbox Worker Crash** | Restart worker during event processing | Resumes processing from last event | `CODE VERIFIED` | Enforced by `OutboxEvent` table status checks. |

---

## 2. Technical Safeguards

### 2.1 Transaction Boundaries
- Database transactions use explicit timeouts to prevent connection pool exhaustion:
  ```typescript
  { maxWait: 5000, timeout: 10000 }
  ```

### 2.2 Error Sanitization
- Production error messages are sanitized to prevent details like stack traces or schema structures from leaking to the client.
- Complete error diagnostics are logged on the server for investigation.
