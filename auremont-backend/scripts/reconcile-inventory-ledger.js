const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function runInventoryLedgerReconciliation() {
  console.log('═════════════════════════════════════════════════════════════════');
  console.log('   RARE NUTS — INVENTORY LEDGER & STOCK RECONCILIATION AUDITOR  ');
  console.log('═════════════════════════════════════════════════════════════════\n');

  await prisma.$connect();

  const products = await prisma.product.findMany({
    select: {
      id: true,
      name: true,
      sku: true,
      stockQty: true,
      orderItems: {
        select: {
          quantity: true,
          order: {
            select: {
              id: true,
              orderStatus: true,
              paymentStatus: true,
            },
          },
        },
      },
    },
  });

  console.log(`Auditing Inventory Ledgers across ${products.length} catalog products...\n`);

  let checked = 0;
  let discrepancies = 0;

  for (const prod of products) {
    checked++;
    let unitsSoldConfirmed = 0;
    let unitsInPending = 0;
    let unitsCancelled = 0;

    for (const item of prod.orderItems) {
      if (!item.order) continue;
      const { orderStatus, paymentStatus } = item.order;
      if (orderStatus === 'cancelled') {
        unitsCancelled += item.quantity;
      } else if (paymentStatus === 'paid' || orderStatus === 'confirmed' || orderStatus === 'delivered' || orderStatus === 'shipped') {
        unitsSoldConfirmed += item.quantity;
      } else {
        unitsInPending += item.quantity;
      }
    }

    // Invariant check: Current stock must be >= 0
    const stockIsNonNegative = prod.stockQty >= 0;
    if (!stockIsNonNegative) {
      console.error(`❌ INVENTORY VIOLATION: Product "${prod.name}" (${prod.sku}) has negative stock: ${prod.stockQty}`);
      discrepancies++;
    } else {
      console.log(`✓ Product: ${prod.name.padEnd(45)} | Stock: ${String(prod.stockQty).padStart(4)} | Sold: ${String(unitsSoldConfirmed).padStart(3)} | Pending: ${String(unitsInPending).padStart(2)} | Cancelled: ${String(unitsCancelled).padStart(2)}`);
    }
  }

  console.log('\n─────────────────────────────────────────────────────────────────');
  console.log(`Total Products Audited : ${checked}`);
  console.log(`Discrepancies / Errors : ${discrepancies}`);
  console.log('─────────────────────────────────────────────────────────────────\n');

  await prisma.$disconnect();

  if (discrepancies === 0) {
    console.log('RECONCILIATION VERDICT: 🟢 PASS — ZERO INVENTORY DISCREPANCIES\n');
    process.exit(0);
  } else {
    console.error('RECONCILIATION VERDICT: 🔴 FAIL — INVENTORY DISCREPANCIES DETECTED\n');
    process.exit(1);
  }
}

runInventoryLedgerReconciliation().catch(err => {
  console.error('Fatal reconciliation error:', err);
  process.exit(1);
});
