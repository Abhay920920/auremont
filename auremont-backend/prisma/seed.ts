import { PrismaClient, Role } from '@prisma/client';
import * as bcrypt from 'bcrypt';

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

  const catRaw = await prisma.category.upsert({
    where: { slug: 'raw' },
    update: {},
    create: {
      name: 'Raw Editions',
      slug: 'raw',
      description: 'Unprocessed Extra Large California Almonds',
    },
  });

  const catRoasted = await prisma.category.upsert({
    where: { slug: 'roasted' },
    update: {},
    create: {
      name: 'Roasted Editions',
      slug: 'roasted',
      description: 'Artisanal Slow-Roasted Almonds',
    },
  });

  const catGift = await prisma.category.upsert({
    where: { slug: 'gift' },
    update: {},
    create: {
      name: 'Gifting & Corporate',
      slug: 'gift',
      description: 'Handcrafted Mahogany Wooden Boxes & Velvet Packaging',
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
  await prisma.product.upsert({
    where: { sku: 'ALM-EV-250' },
    update: {},
    create: {
      categoryId: catRaw.id,
      collectionId: collEveryday.id,
      name: 'California Reserve Raw Almonds 250g',
      slug: 'california-reserve-raw',
      sku: 'ALM-EV-250',
      shortDescription: '100% natural, unpasteurized California raw almonds. High protein, extra crunch.',
      weightGrams: 250,
      price: 999.00,
      salePrice: 799.00,
      stockQty: 1000,
      thumbnailUrl: '/images/california-almonds-250g.png',
      isFeatured: true,
      nutritionJson: { protein: '21g', fiber: '12g', fats: '49g', energy: '579 kcal' }
    },
  });

  await prisma.product.upsert({
    where: { sku: 'ALM-SIG-500' },
    update: {},
    create: {
      categoryId: catRoasted.id,
      collectionId: collSignature.id,
      name: 'Slow-Roasted Sea Salt Almonds 500g',
      slug: 'roasted-sea-salt-almonds',
      sku: 'ALM-SIG-500',
      shortDescription: 'Masterfully roasted California almonds with artisanal sea salt in a thick UV-protected glass jar.',
      weightGrams: 500,
      price: 1499.00,
      salePrice: 1299.00,
      stockQty: 500,
      thumbnailUrl: '/images/roasted-almonds-jar.png',
      isFeatured: true,
      nutritionJson: { protein: '21g', fiber: '12g', fats: '49g', energy: '585 kcal' }
    },
  });

  await prisma.product.upsert({
    where: { sku: 'ALM-HER-1000' },
    update: {},
    create: {
      categoryId: catGift.id,
      collectionId: collHeritage.id,
      name: 'Heritage Royal Almonds Wooden Box 1kg',
      slug: 'royal-almonds-wooden-box',
      sku: 'ALM-HER-1000',
      shortDescription: 'The finest reserve of extra large California almonds in our velvet-lined handcrafted mahogany box.',
      weightGrams: 1000,
      price: 2999.00,
      salePrice: 2499.00,
      stockQty: 100,
      thumbnailUrl: '/images/royal-almonds-wooden-box.png',
      isFeatured: true,
      nutritionJson: { protein: '21g', fiber: '12g', fats: '49g', energy: '579 kcal' }
    },
  });

  // 4. Create Admin Account
  const hashedPassword = await bcrypt.hash('Admin@12345', 10);
  await prisma.user.upsert({
    where: { email: 'admin@auremont.com' },
    update: {
      passwordHash: hashedPassword,
      role: Role.admin,
    },
    create: {
      firstName: 'Auremont',
      lastName: 'Concierge',
      email: 'admin@auremont.com',
      passwordHash: hashedPassword,
      role: Role.admin,
      emailVerified: true,
    },
  });

  console.log('Seed completed successfully! Admin user created: admin@auremont.com');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
