import { PrismaClient, Role } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

/**
 * Main database seeding function
 */
async function main() {
  console.log('Starting seed...');

  // 1. Create Categories for All Nut Families
  const catAlmonds = await prisma.category.upsert({
    where: { slug: 'almonds' },
    update: { name: 'Almonds', description: 'California Reserve & Heirloom Nonpareil Almonds' },
    create: {
      name: 'Almonds',
      slug: 'almonds',
      description: 'California Reserve & Heirloom Nonpareil Almonds',
    },
  });

  const catCashews = await prisma.category.upsert({
    where: { slug: 'cashews' },
    update: { name: 'Cashews', description: 'Royal Mangalore Jumbo W180 King Cashews' },
    create: {
      name: 'Cashews',
      slug: 'cashews',
      description: 'Royal Mangalore Jumbo W180 King Cashews',
    },
  });

  const catPistachios = await prisma.category.upsert({
    where: { slug: 'pistachios' },
    update: { name: 'Pistachios', description: 'Imperial Iranian Akbari & California Long Pistachios' },
    create: {
      name: 'Pistachios',
      slug: 'pistachios',
      description: 'Imperial Iranian Akbari & California Long Pistachios',
    },
  });

  const catWalnuts = await prisma.category.upsert({
    where: { slug: 'walnuts' },
    update: { name: 'Walnuts', description: 'Kashmiri Snow White & Chilean Light Amber Halves' },
    create: {
      name: 'Walnuts',
      slug: 'walnuts',
      description: 'Kashmiri Snow White & Chilean Light Amber Halves',
    },
  });

  const catMacadamias = await prisma.category.upsert({
    where: { slug: 'macadamias' },
    update: { name: 'Macadamias', description: 'Queensland Slow-Roasted Whole Kernel Macadamias' },
    create: {
      name: 'Macadamias',
      slug: 'macadamias',
      description: 'Queensland Slow-Roasted Whole Kernel Macadamias',
    },
  });

  const catHazelnuts = await prisma.category.upsert({
    where: { slug: 'hazelnuts' },
    update: { name: 'Hazelnuts', description: 'Piedmontese IGP Roasted Botanical Hazelnuts' },
    create: {
      name: 'Hazelnuts',
      slug: 'hazelnuts',
      description: 'Piedmontese IGP Roasted Botanical Hazelnuts',
    },
  });

  const catPecans = await prisma.category.upsert({
    where: { slug: 'pecans' },
    update: { name: 'Pecans', description: 'Georgia Mammoth Extra Large Halves' },
    create: {
      name: 'Pecans',
      slug: 'pecans',
      description: 'Georgia Mammoth Extra Large Halves',
    },
  });

  const catPineNuts = await prisma.category.upsert({
    where: { slug: 'pine-nuts' },
    update: { name: 'Pine Nuts (Chilgoza)', description: 'Himalayan High-Altitude Wild Chilgoza Kernels' },
    create: {
      name: 'Pine Nuts (Chilgoza)',
      slug: 'pine-nuts',
      description: 'Himalayan High-Altitude Wild Chilgoza Kernels',
    },
  });

  const catAssortments = await prisma.category.upsert({
    where: { slug: 'assortments' },
    update: { name: 'Royal Assortments', description: 'Curated Multi-Nut Reserves & Heritage Chests' },
    create: {
      name: 'Royal Assortments',
      slug: 'assortments',
      description: 'Curated Multi-Nut Reserves & Heritage Chests',
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

  // 3. Create Multi-Nut Products
  // ── Almonds ──
  await prisma.product.upsert({
    where: { sku: 'ALM-EV-250' },
    update: {
      thumbnailUrl: '/images/california-almonds-250g.png',
      name: 'California Reserve Raw Almonds 250g',
      price: 999.00,
      salePrice: 799.00,
      shortDescription: '100% natural, unpasteurized California raw almonds. High protein, extra crunch.',
      isFeatured: true,
      categoryId: catAlmonds.id,
    },
    create: {
      categoryId: catAlmonds.id,
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
      categoryId: catAlmonds.id,
    },
    create: {
      categoryId: catAlmonds.id,
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

  // ── Cashews ──
  await prisma.product.upsert({
    where: { sku: 'CSH-ROY-250' },
    update: {
      name: 'Royal Mangalore Jumbo King Cashews W180 250g',
      price: 1299.00,
      salePrice: 999.00,
      shortDescription: 'Hand-sorted Jumbo W180 grade king cashews from coastal Mangalore with buttery, creamy sweetness.',
      isFeatured: true,
      categoryId: catCashews.id,
      thumbnailUrl: '/images/cashews-matte-black.png',
    },
    create: {
      categoryId: catCashews.id,
      collectionId: collEveryday.id,
      name: 'Royal Mangalore Jumbo King Cashews W180 250g',
      slug: 'royal-mangalore-jumbo-cashews-250g',
      sku: 'CSH-ROY-250',
      shortDescription: 'Hand-sorted Jumbo W180 grade king cashews from coastal Mangalore with buttery, creamy sweetness.',
      weightGrams: 250,
      price: 1299.00,
      salePrice: 999.00,
      stockQty: 800,
      thumbnailUrl: '/images/cashews-matte-black.png',
      isFeatured: true,
      nutritionJson: { protein: '18g', fiber: '3.3g', fats: '44g', energy: '553 kcal' }
    },
  });

  await prisma.product.upsert({
    where: { sku: 'CSH-TRF-500' },
    update: {
      name: 'Black Truffle & Sea Salt Roasted Cashews 500g',
      price: 1899.00,
      salePrice: 1599.00,
      shortDescription: 'Artisanal slow-roasted king cashews dusted with Italian black winter truffle and Himalayan pink salt.',
      isFeatured: true,
      categoryId: catCashews.id,
      thumbnailUrl: '/images/truffle-cashews-matte-black.png',
    },
    create: {
      categoryId: catCashews.id,
      collectionId: collSignature.id,
      name: 'Black Truffle & Sea Salt Roasted Cashews 500g',
      slug: 'black-truffle-roasted-cashews-500g',
      sku: 'CSH-TRF-500',
      shortDescription: 'Artisanal slow-roasted king cashews dusted with Italian black winter truffle and Himalayan pink salt.',
      weightGrams: 500,
      price: 1899.00,
      salePrice: 1599.00,
      stockQty: 400,
      thumbnailUrl: '/images/truffle-cashews-matte-black.png',
      isFeatured: true,
      nutritionJson: { protein: '18g', fiber: '3.3g', fats: '46g', energy: '568 kcal' }
    },
  });

  // ── Pistachios ──
  await prisma.product.upsert({
    where: { sku: 'PST-AKB-250' },
    update: {
      name: 'Imperial Iranian Akbari Long Pistachios 250g',
      price: 1399.00,
      salePrice: 1099.00,
      shortDescription: 'Prized Persian Akbari super-long pistachios roasted with saffron threads and light Mediterranean sea salt.',
      isFeatured: true,
      categoryId: catPistachios.id,
      thumbnailUrl: '/images/pistachios-matte-black.png',
    },
    create: {
      categoryId: catPistachios.id,
      collectionId: collSignature.id,
      name: 'Imperial Iranian Akbari Long Pistachios 250g',
      slug: 'imperial-iranian-akbari-pistachios-250g',
      sku: 'PST-AKB-250',
      shortDescription: 'Prized Persian Akbari super-long pistachios roasted with saffron threads and light Mediterranean sea salt.',
      weightGrams: 250,
      price: 1399.00,
      salePrice: 1099.00,
      stockQty: 600,
      thumbnailUrl: '/images/pistachios-matte-black.png',
      isFeatured: true,
      nutritionJson: { protein: '20g', fiber: '10.6g', fats: '45g', energy: '562 kcal' }
    },
  });

  // ── Walnuts ──
  await prisma.product.upsert({
    where: { sku: 'WAL-KSH-500' },
    update: {
      name: 'Kashmiri Snow White Walnut Halves 500g',
      price: 1599.00,
      salePrice: 1299.00,
      shortDescription: 'Extra-light, organic snow-white walnut halves harvested from high-altitude Kashmiri orchards. Zero bitterness.',
      isFeatured: true,
      categoryId: catWalnuts.id,
      thumbnailUrl: '/images/walnuts-matte-black.png',
    },
    create: {
      categoryId: catWalnuts.id,
      collectionId: collEveryday.id,
      name: 'Kashmiri Snow White Walnut Halves 500g',
      slug: 'kashmiri-snow-white-walnut-halves-500g',
      sku: 'WAL-KSH-500',
      shortDescription: 'Extra-light, organic snow-white walnut halves harvested from high-altitude Kashmiri orchards. Zero bitterness.',
      weightGrams: 500,
      price: 1599.00,
      salePrice: 1299.00,
      stockQty: 450,
      thumbnailUrl: '/images/walnuts-matte-black.png',
      isFeatured: true,
      nutritionJson: { protein: '15g', fiber: '6.7g', fats: '65g', energy: '654 kcal' }
    },
  });

  // ── Macadamias & Hazelnuts ──
  await prisma.product.upsert({
    where: { sku: 'MAC-QLD-250' },
    update: {
      name: 'Queensland Reserve Whole Macadamias 250g',
      price: 1699.00,
      salePrice: 1399.00,
      shortDescription: 'Crisp, velvety whole macadamia kernels from subtropical Queensland, lightly roasted to golden perfection.',
      isFeatured: true,
      categoryId: catMacadamias.id,
      thumbnailUrl: '/images/macadamias-matte-black.png',
    },
    create: {
      categoryId: catMacadamias.id,
      collectionId: collSignature.id,
      name: 'Queensland Reserve Whole Macadamias 250g',
      slug: 'queensland-reserve-whole-macadamias-250g',
      sku: 'MAC-QLD-250',
      shortDescription: 'Crisp, velvety whole macadamia kernels from subtropical Queensland, lightly roasted to golden perfection.',
      weightGrams: 250,
      price: 1699.00,
      salePrice: 1399.00,
      stockQty: 300,
      thumbnailUrl: '/images/macadamias-matte-black.png',
      isFeatured: true,
      nutritionJson: { protein: '8g', fiber: '8.6g', fats: '76g', energy: '718 kcal' }
    },
  });

  await prisma.product.upsert({
    where: { sku: 'PNE-CHL-200' },
    update: {
      name: 'Himalayan Wild Chilgoza Pine Nuts 200g',
      price: 2499.00,
      salePrice: 2199.00,
      shortDescription: 'Hand-gathered wild Chilgoza pine nuts from high-altitude Himalayan pine forests. Ultra-rare delicacy.',
      isFeatured: true,
      categoryId: catPineNuts.id,
      thumbnailUrl: '/images/pine-nuts-matte-black.png',
    },
    create: {
      categoryId: catPineNuts.id,
      collectionId: collHeritage.id,
      name: 'Himalayan Wild Chilgoza Pine Nuts 200g',
      slug: 'himalayan-wild-chilgoza-pine-nuts-200g',
      sku: 'PNE-CHL-200',
      shortDescription: 'Hand-gathered wild Chilgoza pine nuts from high-altitude Himalayan pine forests. Ultra-rare delicacy.',
      weightGrams: 200,
      price: 2499.00,
      salePrice: 2199.00,
      stockQty: 150,
      thumbnailUrl: '/images/pine-nuts-matte-black.png',
      isFeatured: true,
      nutritionJson: { protein: '14g', fiber: '3.7g', fats: '68g', energy: '673 kcal' }
    },
  });

  // ── Assortments & Gift Boxes ──
  await prisma.product.upsert({
    where: { sku: 'ALM-HER-1000' },
    update: {
      thumbnailUrl: '/images/royal-almonds-wooden-box.png',
      name: 'Quad Reserve 4-Compartment Wooden Gift Chest 1kg',
      price: 3499.00,
      salePrice: 2999.00,
      shortDescription: 'Solid mahogany handcrafted chest with 4 velvet sections: Almonds, King Cashews, Iranian Pistachios & Kashmiri Walnuts.',
      isFeatured: true,
      categoryId: catAssortments.id,
    },
    create: {
      categoryId: catAssortments.id,
      collectionId: collHeritage.id,
      name: 'Quad Reserve 4-Compartment Wooden Gift Chest 1kg',
      slug: 'royal-almonds-wooden-box',
      sku: 'ALM-HER-1000',
      shortDescription: 'Solid mahogany handcrafted chest with 4 velvet sections: Almonds, King Cashews, Iranian Pistachios & Kashmiri Walnuts.',
      weightGrams: 1000,
      price: 3499.00,
      salePrice: 2999.00,
      stockQty: 100,
      thumbnailUrl: '/images/royal-almonds-wooden-box.png',
      isFeatured: true,
      nutritionJson: { protein: '19g', fiber: '9g', fats: '54g', energy: '610 kcal' }
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
      categoryId: catAlmonds.id,
    },
    create: {
      categoryId: catAlmonds.id,
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
      name: 'Grand Royal Multi-Nut Unboxing Reserve 1kg',
      price: 3999.00,
      salePrice: 3499.00,
      shortDescription: 'Hinged luxury gift box featuring curated California Almonds, Jumbo Cashews, Persian Pistachios, and Chilgoza with gold thank you card.',
      isFeatured: true,
      categoryId: catAssortments.id,
    },
    create: {
      categoryId: catAssortments.id,
      collectionId: collHeritage.id,
      name: 'Grand Royal Multi-Nut Unboxing Reserve 1kg',
      slug: 'grand-unboxing-luxury-box',
      sku: 'ALM-UNB-1000',
      shortDescription: 'Hinged luxury gift box featuring curated California Almonds, Jumbo Cashews, Persian Pistachios, and Chilgoza with gold thank you card.',
      weightGrams: 1000,
      price: 3999.00,
      salePrice: 3499.00,
      stockQty: 75,
      thumbnailUrl: '/images/luxury-gift-box-unboxing.png',
      isFeatured: true,
      nutritionJson: { protein: '20g', fiber: '10g', fats: '55g', energy: '620 kcal' }
    },
  });

  // Populate ProductImage records for all products
  const allProds = await prisma.product.findMany();
  await Promise.all(
    allProds
      .filter((p) => p.thumbnailUrl)
      .map(async (p) => {
        await prisma.productImage.deleteMany({ where: { productId: p.id } });
        await prisma.productImage.create({
          data: {
            productId: p.id,
            imageUrl: p.thumbnailUrl!,
            sortOrder: 0,
            isPrimary: true,
          },
        });
      })
  );

  // 4. Create Luxury Journal Blogs
  await prisma.blog.upsert({
    where: { slug: 'art-of-slow-roasting' },
    update: { published: true, publishedAt: new Date() },
    create: {
      title: 'The Art of Slow Roasting: Preserving Aromatic Oils',
      slug: 'art-of-slow-roasting',
      content: 'True luxury requires patience. Unlike high-heat industrial processing, RARE NUTS slow-roasts our Nonpareil California almonds at low temperatures. This gentle technique locks in essential vitamin E and natural nut oils while developing a crisp, buttery aromatic crunch.',
      authorName: 'RARE NUTS Botanical Masters',
      authorRole: 'Master Roaster',
      coverImage: '/images/roasted-almonds-jar.png',
      published: true,
      publishedAt: new Date(),
    }
  });

  await prisma.blog.upsert({
    where: { slug: 'heritage-of-rarenuts-unboxing' },
    update: { published: true, publishedAt: new Date() },
    create: {
      title: 'Handcrafted Mahogany & Velvet: The Heritage Unboxing',
      slug: 'heritage-of-rarenuts-unboxing',
      content: 'A gift from RARE NUTS is designed to leave a lasting impression. Every wooden box is carved from solid mahogany wood, polished with natural oils, and lined with custom gold velvet to protect our extra-large almonds.',
      authorName: 'RARE NUTS Design Studio',
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
      content: 'Elevate your sensory experience. Our sommelier shares why RARE NUTS slow-roasted sea salt almonds complement Blanc de Blancs Champagne, vintage Chardonnay, and aged artisanal cheeses.',
      authorName: 'RARE NUTS Sommelier',
      authorRole: 'Culinary Advisor',
      coverImage: '/images/roasted-almonds-jar.png',
      published: true,
      publishedAt: new Date(),
    }
  });

  // 5. Create Test and Admin Accounts (Dev/Staging Only)
  if (process.env.NODE_ENV !== 'production') {
    const adminPassword = await bcrypt.hash('Admin@12345', 10);
    const testPassword = await bcrypt.hash('password123', 10);

    await prisma.user.upsert({
      where: { email: 'admin@rarenuts.com' },
      update: {
        passwordHash: adminPassword,
        role: Role.admin,
      },
      create: {
        firstName: 'RARE NUTS',
        lastName: 'Concierge',
        email: 'admin@rarenuts.com',
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
  }

  // 6. Create Coupons
  await prisma.coupon.upsert({
    where: { code: 'AUREMONT10' },
    update: { status: true, startDate: new Date('2025-01-01'), endDate: new Date('2030-12-31') },
    create: {
      code: 'AUREMONT10',
      type: 'percentage',
      value: 10,
      minimumOrder: 500,
      maxDiscount: 500,
      startDate: new Date('2025-01-01'),
      endDate: new Date('2030-12-31'),
      status: true,
    },
  });

  await prisma.coupon.upsert({
    where: { code: 'LUXURY500' },
    update: { status: true, startDate: new Date('2025-01-01'), endDate: new Date('2030-12-31') },
    create: {
      code: 'LUXURY500',
      type: 'flat',
      value: 500,
      minimumOrder: 2000,
      maxDiscount: 500,
      startDate: new Date('2025-01-01'),
      endDate: new Date('2030-12-31'),
      status: true,
    },
  });

  console.log('Seed completed successfully! Test users & coupons created.');
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
