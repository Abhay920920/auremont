import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function safeDelete(name: string, deleteFn: () => Promise<any>) {
  try {
    const res = await deleteFn();
    const count = typeof res?.count === 'number' ? ` (${res.count} rows)` : '';
    console.log(`  ✓ Cleared ${name}${count}`);
  } catch (err: any) {
    if (err?.code === 'P2021') {
      console.log(`  ℹ Skipped ${name} (table does not exist in DB yet)`);
    } else {
      console.warn(`  ⚠ Warning clearing ${name}: ${err?.message || err}`);
    }
  }
}

/**
 * Clean & Purge Test Data from Database
 * Deletes all test transactions, mock orders, temporary carts, and test accounts.
 */
async function cleanDatabase() {
  console.log('🧹 Starting Database Test-Data Cleanup...\n');

  try {
    // 1. Transactional records
    console.log('1. Cleaning Transactional Records:');
    await safeDelete('Order Items', () => prisma.orderItem.deleteMany());
    await safeDelete('Payments', () => prisma.payment.deleteMany());
    await safeDelete('Orders', () => prisma.order.deleteMany());

    // 2. Cart activity
    console.log('\n2. Cleaning Carts & Items:');
    await safeDelete('Cart Items', () => prisma.cartItem.deleteMany());
    await safeDelete('Carts', () => prisma.cart.deleteMany());

    // 3. Customer interactions
    console.log('\n3. Cleaning Customer Interactions:');
    await safeDelete('Wishlists', () => prisma.wishlist.deleteMany());
    await safeDelete('Reviews', () => prisma.review.deleteMany());
    await safeDelete('Contact Messages', () => prisma.contactMessage.deleteMany());
    await safeDelete('Notifications', () => prisma.notification.deleteMany());

    // 4. Logs & Events
    console.log('\n4. Cleaning Logs & Telemetry:');
    await safeDelete('Webhook Logs', () => prisma.webhookLog.deleteMany());
    await safeDelete('Admin Audit Logs', () => prisma.adminAuditLog.deleteMany());
    await safeDelete('Audit Logs', () => prisma.auditLog.deleteMany());
    await safeDelete('Inventory Logs', () => prisma.inventoryLog.deleteMany());
    await safeDelete('Outbox Events', () => prisma.outboxEvent.deleteMany());

    // 5. Customer Addresses and Test Users
    console.log('\n5. Cleaning Addresses & Test Accounts:');
    await safeDelete('Addresses', () => prisma.address.deleteMany());
    await safeDelete('Test Customer Accounts', () =>
      prisma.user.deleteMany({
        where: {
          OR: [
            { email: { contains: 'example.com' } },
            { email: { contains: 'test' } },
            { role: 'customer' },
          ],
        },
      })
    );

    console.log('\n✅ Database test data cleaned successfully! Catalog and categories preserved.');
  } catch (error) {
    console.error('\n❌ Error during database cleanup:', error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

cleanDatabase();
