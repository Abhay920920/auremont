export interface CatalogProduct {
  id?: string;
  name: string;
  slug: string;
  sku: string;
  price: number;
  salePrice?: number;
  weightGrams?: number;
  stockQty?: number;
  thumbnailUrl?: string;
  shortDescription?: string;
  description?: string;
  isFeatured?: boolean;
  category?: {
    id?: string;
    name: string;
    slug: string;
  };
  reviews?: Array<{
    id: string;
    rating: number;
    title?: string;
    review?: string;
    createdAt?: string;
    user?: { firstName?: string; lastName?: string };
  }>;
}

export const FALLBACK_PRODUCTS: Record<string, CatalogProduct> = {
  'california-reserve-raw': {
    id: 'prod-alm-01',
    name: 'California Reserve Raw Almonds 250g',
    slug: 'california-reserve-raw',
    sku: 'ALM-EV-250',
    price: 999,
    salePrice: 799,
    weightGrams: 250,
    stockQty: 1000,
    thumbnailUrl: '/images/california-almonds-250g.png',
    shortDescription: '100% natural, unpasteurized California raw almonds. High protein, extra crunch.',
    description: '100% natural, unpasteurized California raw almonds. High protein, extra crunch with living enzymes intact.',
    isFeatured: true,
    category: { name: 'Almonds', slug: 'almonds' },
    reviews: [
      {
        id: 'rev-01',
        rating: 5,
        title: 'Exquisite Freshness',
        review: 'Incomparable crunch and buttery flavor without any chemical aftertaste.',
        createdAt: '2025-01-20T10:00:00Z',
        user: { firstName: 'Alexander', lastName: 'Vance' },
      },
    ],
  },
  'roasted-sea-salt-almonds': {
    id: 'prod-alm-02',
    name: 'Slow-Roasted Sea Salt Almonds 500g',
    slug: 'roasted-sea-salt-almonds',
    sku: 'ALM-SIG-500',
    price: 1499,
    salePrice: 1299,
    weightGrams: 500,
    stockQty: 500,
    thumbnailUrl: '/images/roasted-almonds-jar.png',
    shortDescription: 'Masterfully roasted California almonds with artisanal sea salt in a thick UV-protected glass jar.',
    description: 'Masterfully roasted California almonds with artisanal sea salt in a thick UV-protected glass jar.',
    isFeatured: true,
    category: { name: 'Almonds', slug: 'almonds' },
    reviews: [
      {
        id: 'rev-02',
        rating: 5,
        title: 'Perfection in Every Bite',
        review: 'The slow-roast flavor and Fleur de Sel balance is unmatched.',
        createdAt: '2025-02-01T12:00:00Z',
        user: { firstName: 'Claire', lastName: 'Laurent' },
      },
    ],
  },
  'royal-mangalore-jumbo-cashews-250g': {
    id: 'prod-csh-01',
    name: 'Royal Mangalore Jumbo King Cashews W180 250g',
    slug: 'royal-mangalore-jumbo-cashews-250g',
    sku: 'CSH-ROY-250',
    price: 1299,
    salePrice: 999,
    weightGrams: 250,
    stockQty: 800,
    thumbnailUrl: '/images/cashews-matte-black.png',
    shortDescription: 'Hand-sorted Jumbo W180 grade king cashews from coastal Mangalore with buttery, creamy sweetness.',
    description: 'Hand-sorted Jumbo W180 grade king cashews from coastal Mangalore with buttery, creamy sweetness.',
    isFeatured: true,
    category: { name: 'Cashews', slug: 'cashews' },
  },
  'black-truffle-roasted-cashews-500g': {
    id: 'prod-csh-02',
    name: 'Black Truffle & Sea Salt Roasted Cashews 500g',
    slug: 'black-truffle-roasted-cashews-500g',
    sku: 'CSH-TRF-500',
    price: 1899,
    salePrice: 1599,
    weightGrams: 500,
    stockQty: 400,
    thumbnailUrl: '/images/truffle-cashews-matte-black.png',
    shortDescription: 'Artisanal slow-roasted king cashews dusted with Italian black winter truffle and Himalayan pink salt.',
    description: 'Artisanal slow-roasted king cashews dusted with Italian black winter truffle and Himalayan pink salt.',
    isFeatured: true,
    category: { name: 'Cashews', slug: 'cashews' },
  },
  'imperial-iranian-akbari-pistachios-250g': {
    id: 'prod-pst-01',
    name: 'Imperial Iranian Akbari Long Pistachios 250g',
    slug: 'imperial-iranian-akbari-pistachios-250g',
    sku: 'PST-AKB-250',
    price: 1399,
    salePrice: 1099,
    weightGrams: 250,
    stockQty: 600,
    thumbnailUrl: '/images/pistachios-matte-black.png',
    shortDescription: 'Prized Persian Akbari super-long pistachios roasted with saffron threads and light Mediterranean sea salt.',
    description: 'Prized Persian Akbari super-long pistachios roasted with saffron threads and light Mediterranean sea salt.',
    isFeatured: true,
    category: { name: 'Pistachios', slug: 'pistachios' },
  },
  'kashmiri-snow-white-walnut-halves-500g': {
    id: 'prod-wal-01',
    name: 'Kashmiri Snow White Walnut Halves 500g',
    slug: 'kashmiri-snow-white-walnut-halves-500g',
    sku: 'WAL-KSH-500',
    price: 1599,
    salePrice: 1299,
    weightGrams: 500,
    stockQty: 450,
    thumbnailUrl: '/images/walnuts-matte-black.png',
    shortDescription: 'Extra-light, organic snow-white walnut halves harvested from high-altitude Kashmiri orchards. Zero bitterness.',
    description: 'Extra-light, organic snow-white walnut halves harvested from high-altitude Kashmiri orchards. Zero bitterness.',
    isFeatured: true,
    category: { name: 'Walnuts', slug: 'walnuts' },
  },
  'queensland-reserve-whole-macadamias-250g': {
    id: 'prod-mac-01',
    name: 'Queensland Reserve Whole Macadamias 250g',
    slug: 'queensland-reserve-whole-macadamias-250g',
    sku: 'MAC-QLD-250',
    price: 1699,
    salePrice: 1399,
    weightGrams: 250,
    stockQty: 300,
    thumbnailUrl: '/images/macadamias-matte-black.png',
    shortDescription: 'Crisp, velvety whole macadamia kernels from subtropical Queensland, lightly roasted to golden perfection.',
    description: 'Crisp, velvety whole macadamia kernels from subtropical Queensland, lightly roasted to golden perfection.',
    isFeatured: true,
    category: { name: 'Macadamias', slug: 'macadamias' },
  },
  'himalayan-wild-chilgoza-pine-nuts-200g': {
    id: 'prod-pne-01',
    name: 'Himalayan Wild Chilgoza Pine Nuts 200g',
    slug: 'himalayan-wild-chilgoza-pine-nuts-200g',
    sku: 'PNE-CHL-200',
    price: 2499,
    salePrice: 2199,
    weightGrams: 200,
    stockQty: 150,
    thumbnailUrl: '/images/pine-nuts-matte-black.png',
    shortDescription: 'Hand-gathered wild Chilgoza pine nuts from high-altitude Himalayan pine forests. Ultra-rare delicacy.',
    description: 'Hand-gathered wild Chilgoza pine nuts from high-altitude Himalayan pine forests. Ultra-rare delicacy.',
    isFeatured: true,
    category: { name: 'Pine Nuts', slug: 'pine-nuts' },
  },
  'royal-almonds-wooden-box': {
    id: 'prod-box-01',
    name: 'Quad Reserve 4-Compartment Wooden Gift Chest 1kg',
    slug: 'royal-almonds-wooden-box',
    sku: 'ALM-HER-1000',
    price: 3499,
    salePrice: 2999,
    weightGrams: 1000,
    stockQty: 100,
    thumbnailUrl: '/images/royal-almonds-wooden-box.png',
    shortDescription: 'Solid mahogany handcrafted chest with 4 velvet sections: Almonds, King Cashews, Iranian Pistachios & Kashmiri Walnuts.',
    description: 'Solid mahogany handcrafted chest with 4 velvet sections: Almonds, King Cashews, Iranian Pistachios & Kashmiri Walnuts.',
    isFeatured: true,
    category: { name: 'Gift Sets', slug: 'gift' },
  },
  'window-pouch-almonds-250g': {
    id: 'prod-box-02',
    name: 'Transparent Window Pouch Edition 250g',
    slug: 'window-pouch-almonds-250g',
    sku: 'ALM-WIN-250',
    price: 1099,
    salePrice: 899,
    weightGrams: 250,
    stockQty: 500,
    thumbnailUrl: '/images/almonds-pouch-window.png',
    shortDescription: 'Matte black stand-up pouch featuring a clear window displaying fresh California almonds.',
    description: 'Matte black stand-up pouch featuring a clear window displaying fresh California almonds.',
    isFeatured: true,
    category: { name: 'Almonds', slug: 'almonds' },
  },
  'grand-unboxing-luxury-box': {
    id: 'prod-box-03',
    name: 'Grand Royal Multi-Nut Unboxing Reserve 1kg',
    slug: 'grand-unboxing-luxury-box',
    sku: 'ALM-UNB-1000',
    price: 3999,
    salePrice: 3499,
    weightGrams: 1000,
    stockQty: 75,
    thumbnailUrl: '/images/luxury-gift-box-unboxing.png',
    shortDescription: 'Hinged luxury gift box featuring curated California Almonds, Jumbo Cashews, Persian Pistachios, and Chilgoza with gold thank you card.',
    description: 'Hinged luxury gift box featuring curated California Almonds, Jumbo Cashews, Persian Pistachios, and Chilgoza with gold thank you card.',
    isFeatured: true,
    category: { name: 'Gift Sets', slug: 'gift' },
  },
};
