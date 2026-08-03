import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('Starting seed...');

  // 1. Create Categories
  const catAlmonds = await prisma.category.upsert({
    where: { slug: 'almonds' },
    update: {},
    create: {
      name: 'Almonds',
      slug: 'almonds',
      description: 'Premium California Almonds',
    },
  });

  // 2. Create Collections
  const collEveryday = await prisma.collection.upsert({
    where: { slug: 'everyday-collection' },
    update: {},
    create: { name: 'Everyday Collection', slug: 'everyday-collection', description: 'Luxury you can enjoy every day.' },
  });

  const collSignature = await prisma.collection.upsert({
    where: { slug: 'signature-collection' },
    update: {},
    create: { name: 'Signature Collection', slug: 'signature-collection', description: 'Perfect for gifting your loved ones.' },
  });

  const collHeritage = await prisma.collection.upsert({
    where: { slug: 'heritage-collection' },
    update: {},
    create: { name: 'Heritage Collection', slug: 'heritage-collection', description: 'Timeless luxury crafted to perfection.' },
  });

  // 3. Create Products
  const prod1 = await prisma.product.upsert({
    where: { sku: 'ALM-EV-250' },
    update: {},
    create: {
      categoryId: catAlmonds.id,
      collectionId: collEveryday.id,
      name: 'California Almonds 250g',
      slug: 'california-almonds-250g',
      sku: 'ALM-EV-250',
      shortDescription: 'Premium hand selected California almonds. Rich in nutrients, high in protein and fiber. No preservatives. 100% natural.',
      weightGrams: 250,
      price: 599.00,
      stockQty: 1000,
      thumbnailUrl: '/images/california-almonds-250g.png',
      isFeatured: true,
      nutritionJson: { protein: '21g', fiber: '12g', fats: '49g' }
    },
  });

  const prod2 = await prisma.product.upsert({
    where: { sku: 'ALM-SIG-500' },
    update: {},
    create: {
      categoryId: catAlmonds.id,
      collectionId: collSignature.id,
      name: 'Signature Roasted Almonds 500g',
      slug: 'signature-roasted-almonds-500g',
      sku: 'ALM-SIG-500',
      shortDescription: 'Perfectly roasted California almonds packed in a premium glass jar.',
      weightGrams: 500,
      price: 1299.00,
      stockQty: 500,
      thumbnailUrl: '/images/roasted-almonds-jar.png',
      isFeatured: true,
      nutritionJson: { protein: '21g', fiber: '12g', fats: '49g' }
    },
  });

  const prod3 = await prisma.product.upsert({
    where: { sku: 'ALM-HER-1000' },
    update: {},
    create: {
      categoryId: catAlmonds.id,
      collectionId: collHeritage.id,
      name: 'Heritage Royal Almonds 1kg',
      slug: 'heritage-royal-almonds-1kg',
      sku: 'ALM-HER-1000',
      shortDescription: 'The finest reserve of large size almonds in our signature wooden box.',
      weightGrams: 1000,
      price: 2999.00,
      stockQty: 100,
      thumbnailUrl: '/images/royal-almonds-wooden-box.png',
      isFeatured: true,
      nutritionJson: { protein: '21g', fiber: '12g', fats: '49g' }
    },
  });

  console.log('Seed completed successfully!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
