const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function runFinancialReconciliation() {
  console.log('═════════════════════════════════════════════════════════════════');
  console.log('   RARE NUTS — ORDER & FINANCIAL LEDGER RECONCILIATION AUDITOR   ');
  console.log('═════════════════════════════════════════════════════════════════\n');

  await prisma.$connect();

  const orders = await prisma.order.findMany({
    include: {
      payment: true,
      items: true,
    },
    orderBy: { createdAt: 'desc' },
  });

  const payments = await prisma.payment.findMany({
    include: {
      order: true,
    },
  });

  console.log(`Auditing ${orders.length} total orders and ${payments.length} payment records in PostgreSQL...\n`);

  let discrepancies = 0;
  let paidOrdersAudited = 0;
  let totalFinancialVolumePaise = 0;

  // 1. Audit Orders against Payments
  for (const order of orders) {
    const isPaidOrder = order.paymentStatus === 'paid';
    const isConfirmed = ['confirmed', 'packed', 'shipped', 'delivered'].includes(order.orderStatus);

    if (isPaidOrder || isConfirmed) {
      paidOrdersAudited++;
      const orderTotalPaise = Math.round(Number(order.total) * 100);
      totalFinancialVolumePaise += orderTotalPaise;

      // Check 1: Must have a linked payment record
      if (!order.payment) {
        console.error(`❌ FINANCIAL DISCREPANCY: Paid/Confirmed order #${order.orderNumber} (ID: ${order.id}) has NO linked payment row!`);
        discrepancies++;
        continue;
      }

      // Check 2: Payment status must be captured/completed/paid
      const validPaymentStatuses = ['completed', 'captured', 'paid', 'success'];
      if (!validPaymentStatuses.includes(order.payment.status?.toLowerCase())) {
        console.error(`❌ FINANCIAL DISCREPANCY: Order #${order.orderNumber} is marked ${order.orderStatus}/${order.paymentStatus} but Payment status is '${order.payment.status}'!`);
        discrepancies++;
      }

      // Check 3: Verified amount exactness in integer paise
      const verifiedPaise = Math.round(Number(order.payment.verifiedAmount || order.payment.amount) * 100);
      if (verifiedPaise !== orderTotalPaise) {
        console.error(`❌ AMOUNT MISMATCH: Order #${order.orderNumber} total is ₹${Number(order.total)} (${orderTotalPaise}p) but Payment recorded ₹${Number(order.payment.verifiedAmount || order.payment.amount)} (${verifiedPaise}p)!`);
        discrepancies++;
      }

      // Check 4: Payment gateway reference exists
      if (!order.payment.transactionId && !order.payment.gatewayPaymentId) {
        console.error(`❌ REFERENCE MISSING: Order #${order.orderNumber} payment record has no transaction/gateway ID!`);
        discrepancies++;
      }
    } else {
      // Unpaid or pending orders
      if (order.payment && ['completed', 'captured', 'paid'].includes(order.payment.status?.toLowerCase())) {
        console.error(`❌ INCONSISTENT STATE: Order #${order.orderNumber} has paymentStatus='${order.paymentStatus}' but Payment row status='${order.payment.status}'!`);
        discrepancies++;
      }
    }
  }

  // 2. Audit Payments against Orders (Orphan Payments check)
  for (const pay of payments) {
    if (!pay.order) {
      console.error(`❌ ORPHAN PAYMENT: Payment ID ${pay.id} (${pay.transactionId || pay.gatewayPaymentId}) is not linked to any Order!`);
      discrepancies++;
    }
  }

  // 3. Duplicate Gateway Payment References Check
  const paymentRefs = new Map();
  for (const pay of payments) {
    const ref = pay.transactionId || pay.gatewayPaymentId;
    if (ref && !ref.startsWith('pay_mock_') && !ref.startsWith('pay_chaos_') && !ref.startsWith('pay_concurrent_')) {
      if (paymentRefs.has(ref)) {
        console.error(`❌ DUPLICATE GATEWAY ID: Payment ref '${ref}' used by multiple payment records: ${paymentRefs.get(ref)} and ${pay.id}!`);
        discrepancies++;
      } else {
        paymentRefs.set(ref, pay.id);
      }
    }
  }

  console.log('─────────────────────────────────────────────────────────────────');
  console.log('FINANCIAL RECONCILIATION SUMMARY:');
  console.log(`  Total Orders Checked      : ${orders.length}`);
  console.log(`  Paid/Confirmed Audited    : ${paidOrdersAudited}`);
  console.log(`  Total Payment Rows        : ${payments.length}`);
  console.log(`  Reconciled Revenue Volume : ₹${(totalFinancialVolumePaise / 100).toFixed(2)} (${totalFinancialVolumePaise} paise)`);
  console.log(`  Discrepancies / Anomalies : ${discrepancies}`);
  console.log('─────────────────────────────────────────────────────────────────\n');

  await prisma.$disconnect();

  if (discrepancies === 0) {
    console.log('FINANCIAL RECONCILIATION VERDICT: 🟢 PASS — ZERO FINANCIAL INCONSISTENCIES\n');
    process.exit(0);
  } else {
    console.error(`FINANCIAL RECONCILIATION VERDICT: 🔴 FAIL — ${discrepancies} FINANCIAL DISCREPANCIES DETECTED\n`);
    process.exit(1);
  }
}

runFinancialReconciliation().catch(err => {
  console.error('Fatal financial reconciliation error:', err);
  process.exit(1);
});
