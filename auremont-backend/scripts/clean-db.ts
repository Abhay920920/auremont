import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

/**
 * Main script execution
 */
async function main() {
  console.log('Cleaning up database...');

  // Delete all orders
  await prisma.orderItem.deleteMany({});
  await prisma.order.deleteMany({});

  // Delete all products except seeded ones or just delete all products
  await prisma.product.deleteMany({});
  
  // Delete all non-admin users
  await prisma.user.deleteMany({
    where: {
      role: { not: 'admin' },
    },
  });

  console.log('Database cleaned successfully.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  })
  .catch(console.error);
