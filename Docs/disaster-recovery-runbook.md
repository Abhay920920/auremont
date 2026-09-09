# RARE NUTS / AUREMONT — DISASTER RECOVERY & PITR RUNBOOK

## 1. PURPOSE & CLASSIFICATION

This operational runbook defines the disaster recovery (DR) architecture, Point-in-Time Recovery (PITR) procedures, and validation steps for the RARE NUTS PostgreSQL database hosted on Neon serverless PostgreSQL.

* **DR Status**: `DR PROCEDURE READY — RESTORE DRILL PENDING`
* **Target RPO (Recovery Point Objective)**: `< 5 minutes` (continuous WAL streaming in Neon)
* **Target RTO (Recovery Time Objective)**: `< 15 minutes` (instantaneous copy-on-write branch creation + app reconnection)
* **Status**: Timing has not yet been verified via an operator-timed drill; values represent theoretical architectural targets.

---

## 2. RECOVERY ARCHITECTURE

Neon decouples compute from storage. Data pages and Write-Ahead Logs (WAL) are persistently streamed across three availability zones. 
This enables non-destructive, zero-copy Point-in-Time branching:
1. Production data remains completely untouched and online during recovery.
2. A recovery branch is created from an exact historical timestamp (e.g. `T - 15m`).
3. An isolated validation container connects to the recovery branch to verify schema integrity, order sequences, inventory balances, and outbox state.
4. Once verified, the production connection string can be updated or data extracted.

---

## 3. STEP-BY-STEP RECOVERY DRILL PROCEDURE

### Step 1: Identify Safe Restore Target
1. Open the [Neon Console](https://console.neon.tech/).
2. Select the `auremont` project.
3. Identify the recovery target timestamp (e.g., prior to an accidental migration, corruption event, or drill timestamp `T_target`).

### Step 2: Create a Recovery Branch
1. Navigate to **Branches** ➔ **Create Branch**.
2. Branch Name: `dr-drill-YYYYMMDD-HHMM`.
3. Parent Branch: `main`.
4. Point in time: Select **Past timestamp** and enter `T_target` (or choose LSN).
5. Click **Create Branch**.
6. Record execution start and finish time:
   * `Branch Creation Start: ________`
   * `Branch Ready: ________`
   * `Duration (ms): ________`

### Step 3: Extract Read-Only Connection String
1. From the new branch dashboard, copy the pooled connection string:
   `postgresql://[user]:[password]@[endpoint]-pooler.[region].aws.neon.tech/[dbname]?sslmode=require`
2. **NEVER** expose this connection string in public logs or commit it to git.

### Step 4: Run Application Connectivity & Data Validation Drill
1. In a secure validation terminal (or staging container):
   ```bash
   export DATABASE_URL="<DR_BRANCH_CONNECTION_STRING>"
   npx prisma validate
   ```
2. Execute data consistency check:
   ```bash
   node -e "
   const { PrismaClient } = require('@prisma/client');
   const prisma = new PrismaClient();
   async function verify() {
     const orderCount = await prisma.order.count();
     const productCount = await prisma.product.count();
     const outboxCount = await prisma.outboxEvent.count();
     const latestOrder = await prisma.order.findFirst({ orderBy: { createdAt: 'desc' } });
     console.log('DR Drill Validation Results:');
     console.log('  Total Orders:', orderCount);
     console.log('  Total Products:', productCount);
     console.log('  Total Outbox Events:', outboxCount);
     console.log('  Latest Order Number:', latestOrder?.orderNumber);
     await prisma.\$disconnect();
   }
   verify();
   "
   ```
3. Verify that:
   * Schema is intact (tables, enums, indexes present).
   * Order IDs and paymentRefs match pre-recovery records.
   * Stock quantities reflect expected inventory counts.

### Step 5: Clean Up Drill Resources
1. In the Neon Console, navigate to **Branches**.
2. Select `dr-drill-YYYYMMDD-HHMM`.
3. Click **Delete Branch** and confirm.
4. Production remains unaffected.

---

## 4. RESTORE DRILL LOG TEMPLATE

```text
Drill Date:                YYYY-MM-DD
Operator:                  [Principal SRE / Release Manager]
Neon Project:              auremont
Source Branch:             main
Target Timestamp:          YYYY-MM-DD HH:MM:SS UTC
Restore Branch Name:       dr-drill-YYYYMMDD

TIMING METRICS:
Restore Initiated:         HH:MM:SS.mmm
Branch Available:          HH:MM:SS.mmm
Application Connected:     HH:MM:SS.mmm
Validation Completed:      HH:MM:SS.mmm

RESULTS:
Total Restore Duration:    __ seconds
Measured RTO:              __ minutes
Measured RPO:              __ seconds
Data Integrity Check:      PASS / FAIL
Clean-up Verified:         YES / NO
```
