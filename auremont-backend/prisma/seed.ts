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
    update: {
      thumbnailUrl: '/images/california-almonds-250g.png',
      name: 'California Reserve Raw Almonds 250g',
      price: 999.00,
      salePrice: 799.00,
      shortDescription: '100% natural, unpasteurized California raw almonds. High protein, extra crunch.',
      isFeatured: true,
    },
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
    update: {
      thumbnailUrl: '/images/roasted-almonds-jar.png',
      name: 'Slow-Roasted Sea Salt Almonds 500g',
      price: 1499.00,
      salePrice: 1299.00,
      shortDescription: 'Masterfully roasted California almonds with artisanal sea salt in a thick UV-protected glass jar.',
      isFeatured: true,
    },
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
    update: {
      thumbnailUrl: '/images/royal-almonds-wooden-box.png',
      name: 'Everyday Collection Rigid Gift Box 1kg',
      price: 2999.00,
      salePrice: 2499.00,
      shortDescription: 'Custom matte black rigid gift box with embossed gold lettering and gold edge trim.',
      isFeatured: true,
    },
    create: {
      categoryId: catGift.id,
      collectionId: collHeritage.id,
      name: 'Everyday Collection Rigid Gift Box 1kg',
      slug: 'royal-almonds-wooden-box',
      sku: 'ALM-HER-1000',
      shortDescription: 'Custom matte black rigid gift box with embossed gold lettering and gold edge trim.',
      weightGrams: 1000,
      price: 2999.00,
      salePrice: 2499.00,
      stockQty: 100,
      thumbnailUrl: '/images/royal-almonds-wooden-box.png',
      isFeatured: true,
      nutritionJson: { protein: '21g', fiber: '12g', fats: '49g', energy: '579 kcal' }
    },
  });

  await prisma.product.upsert({
    where: { sku: 'ALM-WIN-250' },
    update: {
      thumbnailUrl: '/images/almonds-pouch-window.png',
      name: 'Transparent Window Pouch Edition 250g',
      price: 1099.00,
      salePrice: 899.00,
      shortDescription: 'Matte black stand-up pouch featuring a clear window displaying fresh California almonds.',
      isFeatured: true,
    },
    create: {
      categoryId: catRaw.id,
      collectionId: collEveryday.id,
      name: 'Transparent Window Pouch Edition 250g',
      slug: 'window-pouch-almonds-250g',
      sku: 'ALM-WIN-250',
      shortDescription: 'Matte black stand-up pouch featuring a clear window displaying fresh California almonds.',
      weightGrams: 250,
      price: 1099.00,
      salePrice: 899.00,
      stockQty: 500,
      thumbnailUrl: '/images/almonds-pouch-window.png',
      isFeatured: true,
      nutritionJson: { protein: '21g', fiber: '12g', fats: '49g', energy: '579 kcal' }
    },
  });

  await prisma.product.upsert({
    where: { sku: 'ALM-UNB-1000' },
    update: {
      thumbnailUrl: '/images/luxury-gift-box-unboxing.png',
      name: 'Grand Unboxing Luxury Gift Box',
      price: 3499.00,
      salePrice: 2999.00,
      shortDescription: 'Hinged black gift box with gold interior rim, gold-stamped pouch & thank you card.',
      isFeatured: true,
    },
    create: {
      categoryId: catGift.id,
      collectionId: collHeritage.id,
      name: 'Grand Unboxing Luxury Gift Box',
      slug: 'grand-unboxing-luxury-box',
      sku: 'ALM-UNB-1000',
      shortDescription: 'Hinged black gift box with gold interior rim, gold-stamped pouch & thank you card.',
      weightGrams: 1000,
      price: 3499.00,
      salePrice: 2999.00,
      stockQty: 75,
      thumbnailUrl: '/images/luxury-gift-box-unboxing.png',
      isFeatured: true,
      nutritionJson: { protein: '21g', fiber: '12g', fats: '49g', energy: '579 kcal' }
    },
  });

  // Populate ProductImage records for all products
  const allProds = await prisma.product.findMany();
  for (const p of allProds) {
    if (p.thumbnailUrl) {
      await prisma.productImage.deleteMany({ where: { productId: p.id } });
      await prisma.productImage.create({
        data: {
          productId: p.id,
          imageUrl: p.thumbnailUrl,
          sortOrder: 0,
          isPrimary: true,
        },
      });
    }
  }

  // 4. Create Luxury Journal Blogs
  await prisma.blog.upsert({
    where: { slug: 'art-of-slow-roasting' },
    update: { published: true, publishedAt: new Date() },
    create: {
      title: 'The Art of Slow Roasting: Preserving Aromatic Oils',
      slug: 'art-of-slow-roasting',
      content: 'True luxury requires patience. Unlike high-heat industrial processing, Auremont slow-roasts our Nonpareil California almonds at low temperatures. This gentle technique locks in essential vitamin E and natural nut oils while developing a crisp, buttery aromatic crunch.',
      authorName: 'Auremont Botanical Masters',
      authorRole: 'Master Roaster',
      coverImage: '/images/roasted-almonds-jar.png',
      published: true,
      publishedAt: new Date(),
    }
  });

  await prisma.blog.upsert({
    where: { slug: 'heritage-of-auremont-unboxing' },
    update: { published: true, publishedAt: new Date() },
    create: {
      title: 'Handcrafted Mahogany & Velvet: The Heritage Unboxing',
      slug: 'heritage-of-auremont-unboxing',
      content: 'A gift from Auremont is designed to leave a lasting impression. Every wooden box is carved from solid mahogany wood, polished with natural oils, and lined with custom gold velvet to protect our extra-large almonds.',
      authorName: 'Auremont Design Studio',
      authorRole: 'Creative Director',
      coverImage: '/images/royal-almonds-wooden-box.png',
      published: true,
      publishedAt: new Date(),
    }
  });

  await prisma.blog.upsert({
    where: { slug: 'california-valley-terroir' },
    update: { published: true, publishedAt: new Date() },
    create: {
      title: 'California Valley Terroir: Why Geography Defines Excellence',
      slug: 'california-valley-terroir',
      content: 'Situated along the 36th parallel north, California’s Central Valley offers the world’s ideal microclimate for almond cultivation. Deep alluvial soils and Mediterranean sun combine to produce kernels of unprecedented size and rich flavor.',
      authorName: 'Master Agronomist',
      authorRole: 'Orchard Director',
      coverImage: '/images/california-almonds-250g.png',
      published: true,
      publishedAt: new Date(),
    }
  });

  await prisma.blog.upsert({
    where: { slug: 'bespoke-pairing-guide' },
    update: { published: true, publishedAt: new Date() },
    create: {
      title: 'Bespoke Pairing: Reserve Almonds with Vintage Champagne',
      slug: 'bespoke-pairing-guide',
      content: 'Elevate your sensory experience. Our sommelier shares why Auremont slow-roasted sea salt almonds complement Blanc de Blancs Champagne, vintage Chardonnay, and aged artisanal cheeses.',
      authorName: 'Auremont Sommelier',
      authorRole: 'Culinary Advisor',
      coverImage: '/images/roasted-almonds-jar.png',
      published: true,
      publishedAt: new Date(),
    }
  });

  // 5. Create Test and Admin Accounts
  const adminPassword = await bcrypt.hash('Admin@12345', 10);
  const testPassword = await bcrypt.hash('password123', 10);

  await prisma.user.upsert({
    where: { email: 'admin@auremont.com' },
    update: {
      passwordHash: adminPassword,
      role: Role.admin,
    },
    create: {
      firstName: 'Auremont',
      lastName: 'Concierge',
      email: 'admin@auremont.com',
      passwordHash: adminPassword,
      role: Role.admin,
      emailVerified: true,
    },
  });

  await prisma.user.upsert({
    where: { email: 'admin@example.com' },
    update: {
      passwordHash: testPassword,
      role: Role.admin,
    },
    create: {
      firstName: 'Admin',
      lastName: 'User',
      email: 'admin@example.com',
      passwordHash: testPassword,
      role: Role.admin,
      emailVerified: true,
    },
  });

  await prisma.user.upsert({
    where: { email: 'example@gmail.com' },
    update: {
      passwordHash: testPassword,
      role: Role.customer,
    },
    create: {
      firstName: 'Test',
      lastName: 'Customer',
      email: 'example@gmail.com',
      passwordHash: testPassword,
      role: Role.customer,
      emailVerified: true,
    },
  });

  console.log('Seed completed successfully! Test users created: example@gmail.com, admin@example.com, admin@auremont.com');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
