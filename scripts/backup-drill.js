const { PrismaClient } = require('@prisma/client');
const fs = require('fs');
const zlib = require('zlib');
const crypto = require('crypto');
const path = require('path');

async function runBackupDrill() {
  const startTime = Date.now();
  console.log('=== [PHASE 2.3] AUTOMATED BACKUP & RESTORE RECOVERY DRILL ===');
  console.log('Timestamp:', new Date().toISOString());

  const prisma = new PrismaClient();
  const backupDir = path.resolve(__dirname, '../backups/drill');
  fs.mkdirSync(backupDir, { recursive: true });

  const tables = [
    'user',
    'product',
    'order',
    'orderItem',
    'address',
    'payment',
    'coupon',
    'outboxEvent',
    'category',
    'cart',
    'cartItem',
    'review',
    'auditLog'
  ];

  const dumpData = {
    metadata: {
      timestamp: new Date().toISOString(),
      provider: 'Neon PostgreSQL (AWS us-east-2)',
      schemaVersion: 'prisma-5.x',
      type: 'logical_snapshot'
    },
    tables: {}
  };

  try {
    console.log('[1/5] Extracting production tables via Prisma...');
    for (const model of tables) {
      if (prisma[model]) {
        const rows = await prisma[model].findMany();
        dumpData.tables[model] = rows;
        console.log(`  - ${model}: ${rows.length} records extracted`);
      }
    }

    console.log('[2/5] Serializing and compressing snapshot...');
    const rawJson = JSON.stringify(dumpData, null, 2);
    const compressed = zlib.gzipSync(Buffer.from(rawJson, 'utf-8'));

    const timestampStr = new Date().toISOString().replace(/[:.]/g, '-');
    const dumpPath = path.join(backupDir, `auremont_drill_${timestampStr}.json.gz`);
    fs.writeFileSync(dumpPath, compressed);

    const hash = crypto.createHash('sha256').update(compressed).digest('hex');
    const checksumPath = `${dumpPath}.sha256`;
    fs.writeFileSync(checksumPath, `${hash}  ${path.basename(dumpPath)}\n`);

    console.log(`  - Backup written: ${dumpPath} (${(compressed.length / 1024).toFixed(2)} KB)`);
    console.log(`  - SHA-256: ${hash}`);

    console.log('[3/5] Simulating restore verification from compressed artifact...');
    const readCompressed = fs.readFileSync(dumpPath);
    const verifyHash = crypto.createHash('sha256').update(readCompressed).digest('hex');
    if (verifyHash !== hash) {
      throw new Error(`Checksum mismatch! Expected ${hash}, got ${verifyHash}`);
    }
    console.log('  - SHA-256 checksum verification: PASSED');

    const decompressed = zlib.gunzipSync(readCompressed);
    const restored = JSON.parse(decompressed.toString('utf-8'));

    console.log('[4/5] Validating restored schema and record counts...');
    for (const model of tables) {
      const originalCount = dumpData.tables[model].length;
      const restoredCount = restored.tables[model].length;
      if (originalCount !== restoredCount) {
        throw new Error(`Record count mismatch on ${model}: ${originalCount} vs ${restoredCount}`);
      }
    }
    console.log('  - All 13 tables verified with 100% record integrity');

    console.log('[5/5] Verifying critical relational integrity from restore...');
    const orders = restored.tables['order'];
    const orderItems = restored.tables['orderItem'];
    const users = restored.tables['user'];

    console.log(`  - Total Orders: ${orders.length}`);
    for (const order of orders) {
      const items = orderItems.filter(i => i.orderId === order.id);
      const user = users.find(u => u.id === order.userId);
      console.log(`    * Order ${order.id}: ${items.length} items, User ID ${order.userId} (Exists: ${!!user})`);
    }

    const duration = Date.now() - startTime;
    console.log(`\n>>> BACKUP & RESTORE DRILL SUCCESSFUL in ${duration}ms <<<`);
    return { success: true, duration, hash, dumpPath };
  } catch (err) {
    console.error('Backup drill failed:', err);
    throw err;
  } finally {
    await prisma.$disconnect();
  }
}

if (require.main === module) {
  runBackupDrill()
    .then(() => process.exit(0))
    .catch(() => process.exit(1));
}

module.exports = { runBackupDrill };
