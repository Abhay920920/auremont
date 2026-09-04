import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const INDEXES = [
  { name: 'addresses_user_id_idx', sql: 'CREATE INDEX IF NOT EXISTS "addresses_user_id_idx" ON "addresses"("user_id");' },
  { name: 'products_status_is_featured_idx', sql: 'CREATE INDEX IF NOT EXISTS "products_status_is_featured_idx" ON "products"("status", "is_featured");' },
  { name: 'products_status_price_idx', sql: 'CREATE INDEX IF NOT EXISTS "products_status_price_idx" ON "products"("status", "price");' },
  { name: 'product_images_product_id_idx', sql: 'CREATE INDEX IF NOT EXISTS "product_images_product_id_idx" ON "product_images"("product_id");' },
  { name: 'product_images_product_id_is_primary_idx', sql: 'CREATE INDEX IF NOT EXISTS "product_images_product_id_is_primary_idx" ON "product_images"("product_id", "is_primary");' },
  { name: 'product_attributes_product_id_idx', sql: 'CREATE INDEX IF NOT EXISTS "product_attributes_product_id_idx" ON "product_attributes"("product_id");' },
  { name: 'carts_user_id_status_idx', sql: 'CREATE INDEX IF NOT EXISTS "carts_user_id_status_idx" ON "carts"("user_id", "status");' },
  { name: 'orders_user_id_created_at_idx', sql: 'CREATE INDEX IF NOT EXISTS "orders_user_id_created_at_idx" ON "orders"("user_id", "created_at" DESC);' },
  { name: 'orders_payment_status_idx', sql: 'CREATE INDEX IF NOT EXISTS "orders_payment_status_idx" ON "orders"("payment_status");' },
  { name: 'inventory_logs_product_id_idx', sql: 'CREATE INDEX IF NOT EXISTS "inventory_logs_product_id_idx" ON "inventory_logs"("product_id");' },
  { name: 'inventory_logs_reference_id_idx', sql: 'CREATE INDEX IF NOT EXISTS "inventory_logs_reference_id_idx" ON "inventory_logs"("reference_id");' },
];

async function applyIndexes() {
  console.log('⚡ Applying optimized PostgreSQL indexes...');
  for (const idx of INDEXES) {
    const start = Date.now();
    try {
      await prisma.$executeRawUnsafe(idx.sql);
      console.log(`  ✓ ${idx.name} (${Date.now() - start}ms)`);
    } catch (err: any) {
      console.warn(`  ⚠ ${idx.name}: ${err?.message || err}`);
    }
  }
  console.log('✨ Indexes applied successfully.');
  await prisma.$disconnect();
}

applyIndexes().catch((e) => {
  console.error(e);
  process.exit(1);
});
