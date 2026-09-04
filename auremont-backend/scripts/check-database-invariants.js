const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function runDatabaseInvariantAudit() {
  console.log('═════════════════════════════════════════════════════════════════');
  console.log('   RARE NUTS — DATABASE INVARIANT & DATA INTEGRITY AUDITOR       ');
  console.log('═════════════════════════════════════════════════════════════════\n');

  let violations = [];

  // 1. Check for Confirmed orders that are NOT Paid
  const unverifiedConfirmedOrders = await prisma.order.findMany({
    where: {
      orderStatus: 'confirmed',
      paymentStatus: { not: 'paid' },
    },
    select: { id: true, orderNumber: true, orderStatus: true, paymentStatus: true },
  });
  if (unverifiedConfirmedOrders.length > 0) {
    violations.push({
      category: 'PAYMENT_AUTHORITATIVE_VIOLATION',
      count: unverifiedConfirmedOrders.length,
      details: unverifiedConfirmedOrders,
    });
    console.log(`❌ VIOLATION: Found ${unverifiedConfirmedOrders.length} confirmed orders with non-paid paymentStatus.`);
  } else {
    console.log('✅ INVARIANT 1: All confirmed orders have authoritative paymentStatus = paid.');
  }

  // 2. Check for Paid orders without a matching captured/successful Payment record
  const paidOrders = await prisma.order.findMany({
    where: { paymentStatus: 'paid' },
    include: { payment: true },
  });
  const paidWithoutPaymentRecord = paidOrders.filter(
    (o) => !o.payment || !['captured', 'paid', 'success', 'completed'].includes(o.payment.status)
  );
  if (paidWithoutPaymentRecord.length > 0) {
    violations.push({
      category: 'PAID_ORDER_MISSING_PAYMENT_RECORD',
      count: paidWithoutPaymentRecord.length,
      details: paidWithoutPaymentRecord.map((o) => ({ id: o.id, orderNumber: o.orderNumber, paymentStatus: o.paymentStatus, pStatus: o.payment?.status })),
    });
    console.log(`❌ VIOLATION: Found ${paidWithoutPaymentRecord.length} paid orders lacking a captured/paid payment record.`);
  } else {
    console.log('✅ INVARIANT 2: All paid orders have corresponding captured/paid payment records in DB.');
  }

  // 3. Check for Negative Inventory on Products
  const negativeStockProducts = await prisma.product.findMany({
    where: { stockQty: { lt: 0 } },
    select: { id: true, name: true, stockQty: true },
  });
  if (negativeStockProducts.length > 0) {
    violations.push({
      category: 'NEGATIVE_INVENTORY_VIOLATION',
      count: negativeStockProducts.length,
      details: negativeStockProducts,
    });
    console.log(`❌ VIOLATION: Found ${negativeStockProducts.length} products with negative stock.`);
  } else {
    console.log('✅ INVARIANT 3: Product inventory stockQty >= 0 strictly preserved across all records.');
  }

  // 4. Check for Orphaned Order Items (items referencing non-existent order)
  const allOrderItems = await prisma.orderItem.findMany({
    select: { id: true, orderId: true },
  });
  const allOrderIds = new Set((await prisma.order.findMany({ select: { id: true } })).map((o) => o.id));
  const orphanedOrderItems = allOrderItems.filter((item) => !allOrderIds.has(item.orderId));
  if (orphanedOrderItems.length > 0) {
    violations.push({
      category: 'ORPHANED_ORDER_ITEMS',
      count: orphanedOrderItems.length,
    });
    console.log(`❌ VIOLATION: Found ${orphanedOrderItems.length} orphaned order items.`);
  } else {
    console.log('✅ INVARIANT 4: Zero orphaned order items found.');
  }

  // 5. Check for Orphaned Payments (payments referencing non-existent order)
  const allPayments = await prisma.payment.findMany({
    select: { id: true, orderId: true },
  });
  const orphanedPayments = allPayments.filter((p) => !allOrderIds.has(p.orderId));
  if (orphanedPayments.length > 0) {
    violations.push({
      category: 'ORPHANED_PAYMENTS',
      count: orphanedPayments.length,
    });
    console.log(`❌ VIOLATION: Found ${orphanedPayments.length} orphaned payment records.`);
  } else {
    console.log('✅ INVARIANT 5: Zero orphaned payment records found.');
  }

  // 6. Check for Duplicate Order Numbers
  const duplicateOrderNumbers = await prisma.$queryRaw`
    SELECT "order_number", COUNT(*) as count 
    FROM "orders" 
    GROUP BY "order_number" 
    HAVING COUNT(*) > 1
  `;
  if (duplicateOrderNumbers.length > 0) {
    violations.push({
      category: 'DUPLICATE_ORDER_NUMBERS',
      details: duplicateOrderNumbers,
    });
    console.log(`❌ VIOLATION: Found duplicate order numbers in DB.`);
  } else {
    console.log('✅ INVARIANT 6: All order numbers are strictly unique.');
  }

  // 7. Check for Duplicate Gateway Payment IDs
  const duplicatePaymentRefs = await prisma.$queryRaw`
    SELECT "gateway_payment_id", COUNT(*) as count 
    FROM "payments" 
    WHERE "gateway_payment_id" IS NOT NULL
    GROUP BY "gateway_payment_id" 
    HAVING COUNT(*) > 1
  `;
  if (duplicatePaymentRefs.length > 0) {
    violations.push({
      category: 'DUPLICATE_PAYMENT_REFS',
      details: duplicatePaymentRefs,
    });
    console.log(`❌ VIOLATION: Found duplicate payment gateway references.`);
  } else {
    console.log('✅ INVARIANT 7: All payment gateway transaction references are unique.');
  }

  // 8. Check for Duplicate Webhook Event Processing
  const duplicateWebhooks = await prisma.$queryRaw`
    SELECT "provider", "event_id", COUNT(*) as count
    FROM "webhook_logs"
    GROUP BY "provider", "event_id"
    HAVING COUNT(*) > 1
  `;
  if (duplicateWebhooks.length > 0) {
    violations.push({
      category: 'DUPLICATE_WEBHOOK_EVENTS',
      details: duplicateWebhooks,
    });
    console.log(`❌ VIOLATION: Found duplicate processed webhook events in log.`);
  } else {
    console.log('✅ INVARIANT 8: Zero duplicate webhook logs (Unique constraint verified).');
  }

  // 9. Summary
  console.log('\n═════════════════════════════════════════════════════════════════');
  if (violations.length === 0) {
    console.log('  AUDIT VERDICT: 🟢 PASS — ZERO DATABASE INVARIANT VIOLATIONS');
  } else {
    console.log(`  AUDIT VERDICT: 🔴 FAIL — ${violations.length} INVARIANT VIOLATIONS DETECTED`);
  }
  console.log('═════════════════════════════════════════════════════════════════\n');

  await prisma.$disconnect();
  return violations.length === 0;
}

runDatabaseInvariantAudit()
  .then((success) => {
    process.exit(success ? 0 : 1);
  })
  .catch((err) => {
    console.error('Audit failed with execution error:', err);
    process.exit(1);
  });
