/* eslint-disable */
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const updates = [
  {
    sku: 'ALM-EV-250',
    thumbnailUrl: '/images/california-almonds-250g.png',
  },
  {
    sku: 'ALM-SIG-500',
    thumbnailUrl: '/images/roasted-almonds-jar.png',
  },
  {
    sku: 'ALM-HER-1000',
    thumbnailUrl: '/images/royal-almonds-wooden-box.png',
  },
  {
    sku: 'ALM-WIN-250',
    thumbnailUrl: '/images/almonds-pouch-window.png',
  },
  {
    sku: 'ALM-UNB-1000',
    thumbnailUrl: '/images/luxury-gift-box-unboxing.png',
  },
];

async function main() {
  console.log('Updating product image URLs in database...');
  await Promise.all(updates.map(async (item) => {
    const res = await prisma.product.updateMany({
      where: { sku: item.sku },
      data: { thumbnailUrl: item.thumbnailUrl },
    });
    console.log(`Updated ${item.sku} -> ${item.thumbnailUrl} (Count: ${res.count})`);
  }));

  // Also update any products by slug if SKU differs
  await prisma.product.updateMany({
    where: { slug: 'california-reserve-raw' },
    data: { thumbnailUrl: '/images/california-almonds-250g.png' },
  });
  await prisma.product.updateMany({
    where: { slug: 'roasted-sea-salt-almonds' },
    data: { thumbnailUrl: '/images/roasted-almonds-jar.png' },
  });
  await prisma.product.updateMany({
    where: { slug: 'royal-almonds-wooden-box' },
    data: { thumbnailUrl: '/images/royal-almonds-wooden-box.png' },
  });
  await prisma.product.updateMany({
    where: { slug: 'window-pouch-almonds-250g' },
    data: { thumbnailUrl: '/images/almonds-pouch-window.png' },
  });
  await prisma.product.updateMany({
    where: { slug: 'grand-unboxing-luxury-box' },
    data: { thumbnailUrl: '/images/luxury-gift-box-unboxing.png' },
  });

  // Ensure ProductImage records exist for all products
  const allProds = await prisma.product.findMany();
  await Promise.all(
    allProds
      .filter((p) => p.thumbnailUrl)
      .map(async (p) => {
        await prisma.productImage.deleteMany({ where: { productId: p.id } });
        await prisma.productImage.create({
          data: {
            productId: p.id,
            imageUrl: p.thumbnailUrl,
            sortOrder: 0,
            isPrimary: true,
          },
        });
      })
  );

  // Print updated products with images
  const products = await prisma.product.findMany({
    select: { id: true, name: true, sku: true, thumbnailUrl: true, images: true },
  });
  console.log('ALL DB PRODUCTS NOW:', JSON.stringify(products, null, 2));
}

main()
  .catch(console.error)
  .finally(async () => {
    await prisma.$disconnect();
  })
  .catch(console.error);
