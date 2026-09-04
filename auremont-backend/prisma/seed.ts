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

  // 7. Create Production Journal Blogs
  const blogsData = [
    {
      slug: 'the-art-of-slow-roasting',
      title: 'The Art of Slow Roasting: Perfection in Every Kernel',
      authorName: 'Chef Jean-Paul Laurent',
      authorRole: 'Master Roaster & Confectioner',
      coverImage: '/images/roasted-almonds-jar.png',
      seoTitle: 'The Art of Slow Roasting | RARE NUTS Journal',
      seoDescription: 'Discover how RARE NUTS master artisans slowly roast hand-selected California almonds in micro-batches over cured almond wood to unlock deep aromatic depth and an airy, resonant crunch.',
      published: true,
      publishedAt: new Date('2025-01-15T09:00:00Z'),
      content: `<h2>The Philosophy of Patient Heat</h2>
<p>In an industrial food landscape dominated by flash-frying in generic vegetable oils, true confectionery artistry is an act of deliberate resistance. At RARE NUTS, we believe that an almond's soul cannot be rushed. It must be coaxed into revealing its deepest nuances through patient, calibrated heat.</p>

<h3>Almond-Wood Convection</h3>
<p>Unlike commercial rotary roasters that subject kernels to aggressive direct flame, our atelier roasts exclusively with convective air currents scented by seasoned, cured prunings of reclaimed California almond wood. This closed-circulation thermal environment ensures that each kernel heats uniformly from perimeter to core.</p>
<blockquote>"The secret is honoring the nut's inherent moisture curve. When roasting slowly between 145°C and 155°C, moisture departs gently, preventing the cellular collapse that produces tough, oily nuts."</blockquote>

<h3>The Maillard Transformation & Natural Crunch</h3>
<p>Over a 42-minute roasting cycle—nearly four times longer than commercial standards—the natural amino acids and reducing sugars within the kernel engage in gentle Maillard reactions. Subtle nuances of warm brioche, spun honey, and sweet toast emerge naturally without synthetic flavorings.</p>
<p>The result is what sommeliers refer to as the <em>Auremont Snap</em>: a delicate, airy crunch that dissolves gracefully on the palate rather than splintering into hard grit.</p>

<h3>The Seasoning Ritual</h3>
<p>Once cooled on marble tables under ambient humidity controls, our roasted almonds are gently tumbled with hand-harvested Fleur de Sel from coastal salt pans. The crystals adhere to the kernel's natural oils without need for binding sprays, producing a balanced, mineral-rich finish that honors three generations of California orchard mastery.</p>`
    },
    {
      slug: 'the-california-terroir',
      title: 'California Sourcing: The 36th Parallel Terroir',
      authorName: 'Elena Vance',
      authorRole: 'Botanical Agronomist',
      coverImage: '/images/california-almonds-250g.png',
      seoTitle: 'The California Terroir: Why 36°N Yields Supreme Almonds | RARE NUTS',
      seoDescription: 'Journey to the alluvial soils of California’s San Joaquin Valley where Sierra Nevada snowmelt and Mediterranean sun create the supreme Nonpareil reserve.',
      published: true,
      publishedAt: new Date('2025-01-28T11:30:00Z'),
      content: `<h2>Terroir Along the 36th Parallel</h2>
<p>Much like grand cru vineyards in Burgundy or olive groves along the Aegean, almond trees are acutely expressive of the soil in which their taproots run deep. Along California's 36th parallel North in the San Joaquin Valley, an extraordinary confluence of geography and meteorology creates the world's most coveted botanical microclimate.</p>

<h3>Alluvial Loam & Sierra Snowmelt</h3>
<p>Over tens of thousands of years, runoff from the High Sierra Nevada mountains deposited mineral-rich alluvial loam across the valley floor. In spring, pure snowmelt—rich in dissolved silicates and essential trace elements—is captured through precision micro-drip networks to hydrate root systems without eroding delicate topsoil.</p>
<p>The intense summer sun provides continuous photosynthetic energy, while cool evening breezes drifting through coastal gaps trigger dramatic diurnal temperature shifts. This nocturnal cooling allows trees to rest and channel concentrated starches into sweet, monounsaturated kernel oils.</p>

<h3>The Extra Large Nonpareil Standard</h3>
<p>Among more than thirty cultivated almond varietals, RARE NUTS selects exclusively Extra Large Nonpareil. Prized for its symmetrical tear-drop geometry, paper-thin golden outer skin, and lack of woody bitterness, it represents the absolute apex of California botanical agriculture.</p>
<p>Less than 1% of the annual harvest fulfills our grading protocol for kernel diameter, moisture balance, and zero optical blemish—ensuring that every tin bearing the RARE NUTS seal is nothing less than reserve quality.</p>`
    },
    {
      slug: 'mastering-the-fine-nut-pairing',
      title: 'Mastering the Fine Nut Pairing: From Grand Cru to Vintage Tea',
      authorName: 'Sommelier Marcus Thorne',
      authorRole: 'Cellar Master & Sensory Director',
      coverImage: '/images/luxury-gift-box-unboxing.png',
      seoTitle: 'Artisanal Almond Pairings: Wine, Whisky & Vintage Tea | RARE NUTS',
      seoDescription: 'Elevate your tasting salon with our curated guide pairing slow-roasted sea salt almonds with Blanc de Blancs Champagne, peated single malts, and first-flush Darjeeling.',
      published: true,
      publishedAt: new Date('2025-02-10T14:00:00Z'),
      content: `<h2>The Gastronomy of the Nut</h2>
<p>For centuries, the service of fine almonds has been a staple of aristocratic salons and state dinners across Europe and the East. Yet when paired with thoughtful intention, a high-grade roasted almond has the power to unlock unexpected flavor dimensions in fine wines, single-origin spirits, and artisanal infusions.</p>

<h3>1. Blanc de Blancs Champagne & Raw Reserve Almonds</h3>
<p>The razor-sharp acidity, brioche notes, and fine effervescence of 100% Chardonnay Champagne (such as a vintage Côte des Blancs) slice cleanly through the creamy lipid profile of our California Raw Reserve almonds. The subtle sweetness of the raw kernel rounds off the wine's citrus minerality, creating a harmonious textural duet.</p>

<h3>2. Cask-Strength Islay Whisky & Smoked Sea Salt Roast</h3>
<p>Pairing a peated Scotch from Islay with our Slow-Roasted Sea Salt Almonds is a study in complementary aromatics. The cured almond-wood smoke within the nut mirrors the maritime peat smoke of the dram, while the Fleur de Sel elevates the hidden vanilla and dried-fruit esters of the charred oak barrel.</p>

<h3>3. First-Flush Castleton Darjeeling & Saffron Spiced Almonds</h3>
<p>For non-alcoholic hospitality, nothing rivals a delicate first-flush Darjeeling tea harvested at high altitude in the Himalayas. The tea’s muscatel, floral bouquet provides an ethereal backdrop for our Royal Kashmiri Saffron almonds, allowing the warm, earthy saffron strands to blossom across the palate without overwhelming delicate palate receptors.</p>`
    },
    {
      slug: 'heirloom-packaging-and-the-art-of-gifting',
      title: 'Heirloom Presentation & The Architecture of Bespoke Gifting',
      authorName: 'Claire DeWitt',
      authorRole: 'Creative Director of Presentation',
      coverImage: '/images/royal-almonds-wooden-box.png',
      seoTitle: 'Heirloom Gifting Architecture: Solid Mahogany & Velvet | RARE NUTS',
      seoDescription: 'An inside look at our handcrafted solid mahogany presentation cases, mortise-and-tenon joints, and midnight velvet inlays designed for lifetime keepsake display.',
      published: true,
      publishedAt: new Date('2025-02-18T16:45:00Z'),
      content: `<h2>Tactility Before Taste</h2>
<p>In true luxury, the culinary journey begins long before the first kernel meets the tongue. It begins with the weight of solid wood in the palm, the resistance of a hand-tied grosgrain ribbon, and the muffled sound of a precision-fitted lid parting from its base.</p>

<h3>Craftsmanship of the Solid Mahogany Chest</h3>
<p>Our flagship Everyday and Royal presentation cases are constructed from sustainably harvested solid mahogany. Master woodworkers employ traditional mortise-and-tenon joinery—completely eschewing cheap staples or plastic adhesives. Each box is hand-sanded across five grit grades and sealed with organic tung oil to accentuate the natural grain ribbons of the timber.</p>

<h3>Midnight Velvet & Gold Foil Accents</h3>
<p>Inside, bespoke compartments are lined in plush, non-abrasive midnight velvet that cradles our hermetically sealed glass jars and embossed pouches. The exterior lid features deep brass-plate hot stamping using 24-karat gold leaf foil, bearing the RARE NUTS squirrel crest.</p>
<p>These presentation cases are consciously engineered as permanent keepsakes: intended to serve as watch boxes, jewelry valets, or desk centerpieces long after the almonds have been savored.</p>

<h3>The Calligraphic Wax Seal</h3>
<p>Every customized gift order includes a personal message composed on 300gsm heavy cotton cardstock, stamped with custom brass dies and sealed with warm gold wax. It is our conviction that in a digitized world, tangible craftsmanship remains the ultimate expression of human respect and gratitude.</p>`
    },
    {
      slug: 'nutritional-supremacy-of-unprocessed-almonds',
      title: 'Botanical Vitality: The Science Behind Raw Reserve Almonds',
      authorName: 'Dr. Aris Thorne',
      authorRole: 'Nutritional Biochemist',
      coverImage: '/images/almonds-pouch-window.png',
      seoTitle: 'Nutritional Biochemistry of Raw Almonds | RARE NUTS Journal',
      seoDescription: 'Clinical insights into alpha-tocopherol Vitamin E, polyphenols, heart-healthy monounsaturates, and non-chemical pasteurization in California almonds.',
      published: true,
      publishedAt: new Date('2025-02-25T10:15:00Z'),
      content: `<h2>The Plant-Based Nutrient Powerhouse</h2>
<p>While celebrated globally for their culinary elegance, single-origin California almonds represent one of the most chemically sophisticated nutrient reservoirs found in the plant kingdom. Packed within each Nonpareil kernel is a calibrated matrix of micronutrients, antioxidants, and bioactive polyphenols.</p>

<h3>Alpha-Tocopherol (Vitamin E) & Cellular Longevity</h3>
<p>Almonds are among nature's richest whole-food sources of alpha-tocopherol—the most biologically active isomer of Vitamin E. A single 30-gram serving delivers over 50% of the recommended daily intake. Acting as a potent fat-soluble antioxidant, Vitamin E neutralizes oxidative free radicals, protects cell membranes, and supports dermal hydration and elasticity from within.</p>

<h3>Cardiovascular Lipids & Plant Protein</h3>
<p>Over 65% of the almond's lipid profile consists of oleic acid—the same heart-healthy monounsaturated fatty acid that forms the cornerstone of the Mediterranean diet. Clinical research demonstrates that regular consumption of unprocessed almonds actively helps maintain healthy LDL/HDL cholesterol ratios while promoting vascular endothelial elasticity.</p>

<h3>The Non-Chemical Pasteurization Standard</h3>
<p>To preserve botanical vitality without compromising microbiological safety, RARE NUTS rejects toxic chemical pasteurants such as propylene oxide (PPO). We utilize ultra-short, pure steam pasteurization that respects raw food standards, maintaining living enzymes and sensitive phytochemicals in their pristine natural equilibrium.</p>`
    }
  ];

  for (const blog of blogsData) {
    await prisma.blog.upsert({
      where: { slug: blog.slug },
      update: {
        title: blog.title,
        content: blog.content,
        coverImage: blog.coverImage,
        seoTitle: blog.seoTitle,
        seoDescription: blog.seoDescription,
        authorName: blog.authorName,
        authorRole: blog.authorRole,
        published: blog.published,
        publishedAt: blog.publishedAt,
      },
      create: blog,
    });
  }

  console.log('Seed completed successfully! Test users, coupons, and production journal blogs created.');
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
