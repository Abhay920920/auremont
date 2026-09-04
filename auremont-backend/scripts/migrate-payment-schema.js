const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function migratePaymentSchema() {
  console.log('Migrating payments table schema changes...');
  try {
    // Add new enum values to PayStatus
    try {
      await prisma.$executeRawUnsafe(`ALTER TYPE "PayStatus" ADD VALUE IF NOT EXISTS 'processing';`);
      await prisma.$executeRawUnsafe(`ALTER TYPE "PayStatus" ADD VALUE IF NOT EXISTS 'cancelled';`);
      console.log('0. Added processing and cancelled to PayStatus enum.');
    } catch (e) {
      console.log('Enum values note:', e.message);
    }

    // Ensure inventory_logs table exists
    await prisma.$executeRawUnsafe(`
      CREATE TABLE IF NOT EXISTS "inventory_logs" (
        "id" UUID NOT NULL DEFAULT gen_random_uuid(),
        "product_id" UUID NOT NULL,
        "change_qty" INTEGER NOT NULL,
        "reason" VARCHAR(255) NOT NULL,
        "reference_id" UUID,
        "admin_id" UUID,
        "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
        CONSTRAINT "inventory_logs_pkey" PRIMARY KEY ("id")
      );
    `);
    console.log('0b. Ensured inventory_logs table exists.');

    // Ensure outbox_events table exists
    await prisma.$executeRawUnsafe(`
      CREATE TABLE IF NOT EXISTS "outbox_events" (
        "id" UUID NOT NULL DEFAULT gen_random_uuid(),
        "event_type" VARCHAR(100) NOT NULL,
        "payload" JSONB NOT NULL,
        "status" VARCHAR(50) NOT NULL DEFAULT 'pending',
        "retry_count" INTEGER NOT NULL DEFAULT 0,
        "error" TEXT,
        "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
        "processed_at" TIMESTAMP(3),
        CONSTRAINT "outbox_events_pkey" PRIMARY KEY ("id")
      );
    `);
    console.log('0c. Ensured outbox_events table exists.');
    await prisma.$executeRawUnsafe(`
      ALTER TABLE "payments" 
      ADD COLUMN IF NOT EXISTS "gateway_payment_id" VARCHAR(255),
      ADD COLUMN IF NOT EXISTS "verified_amount" DECIMAL(10,2),
      ADD COLUMN IF NOT EXISTS "failure_reason" VARCHAR(500),
      ADD COLUMN IF NOT EXISTS "verified_at" TIMESTAMP(3);
    `);
    console.log('1. Added gateway_payment_id, verified_amount, failure_reason, verified_at to payments.');

    // Create index on orderId if not exists
    await prisma.$executeRawUnsafe(`
      CREATE INDEX IF NOT EXISTS "payments_order_id_idx" ON "payments"("order_id");
    `);
    console.log('2. Created index on payments(order_id).');

    // Verify columns exist
    const cols = await prisma.$queryRaw`
      SELECT column_name, data_type 
      FROM information_schema.columns 
      WHERE table_name = 'payments' 
      ORDER BY column_name;
    `;
    console.log('PAYMENTS TABLE COLUMNS:', cols.map(c => c.column_name));
    
    console.log('Migration complete!');
  } catch (err) {
    console.error('Migration error:', err);
  } finally {
    await prisma.$disconnect();
  }
}

migratePaymentSchema();
