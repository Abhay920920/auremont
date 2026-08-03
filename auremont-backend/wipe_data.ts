import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
  try {
    console.log('Deleting order items...');
    await prisma.orderItem.deleteMany({});
    
    console.log('Deleting inventory logs...');
    await prisma.inventoryLog.deleteMany({});

    console.log('Deleting orders...');
    await prisma.order.deleteMany({});

    console.log('Deleting cart items...');
    await prisma.cartItem.deleteMany({});

    console.log('Deleting carts...');
    await prisma.cart.deleteMany({});

    console.log('Deleting test customers...');
    await prisma.user.deleteMany({
      where: {
        role: 'customer'
      }
    });

    console.log('All test data wiped successfully!');
  } catch (err) {
    console.error('Failed to wipe data:', err);
  } finally {
    await prisma.$disconnect();
  }
}

main();
