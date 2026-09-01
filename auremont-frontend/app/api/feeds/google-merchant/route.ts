import { NextResponse } from 'next/server';

const FALLBACK_MERCHANT_PRODUCTS = [
  {
    id: 'RN-CAL-RAW-250',
    title: 'California Reserve Raw Almonds 250g | RARE NUTS',
    description: 'Extra-large unpasteurized raw California Nonpareil almonds selected for high natural vitamin E and buttery natural flavor.',
    slug: 'california-reserve-raw',
    image: '/images/california-almonds-250g.png',
    price: '799.00 INR',
    availability: 'in_stock',
    category: 'Food, Beverages & Tobacco > Food Items > Nuts & Seeds',
    productType: 'Food > Nuts & Seeds > Almonds > Raw Almonds',
  },
  {
    id: 'RN-ALM-ROAST-500',
    title: 'Slow-Roasted Sea Salt Almonds 500g | RARE NUTS',
    description: 'Masterfully slow-roasted California almonds in a thick culinary glass jar seasoned with Fleur de Sel sea salt flakes.',
    slug: 'roasted-sea-salt-almonds',
    image: '/images/roasted-almonds-jar.png',
    price: '1299.00 INR',
    availability: 'in_stock',
    category: 'Food, Beverages & Tobacco > Food Items > Nuts & Seeds',
    productType: 'Food > Nuts & Seeds > Almonds > Roasted Almonds',
  },
  {
    id: 'RN-ROYAL-CHEST-1000',
    title: 'Royal Almonds Mahogany Gift Chest 1kg | RARE NUTS',
    description: 'Handcrafted solid mahogany presentation chest lined with gold velvet, filled with 1kg of California Reserve almonds.',
    slug: 'royal-almonds-wooden-box',
    image: '/images/royal-almonds-wooden-box.png',
    price: '2499.00 INR',
    availability: 'in_stock',
    category: 'Food, Beverages & Tobacco > Food Items > Food Gift Baskets',
    productType: 'Food > Gifts > Luxury Nut Hampers',
  },
  {
    id: 'RN-WIN-POUCH-250',
    title: 'Transparent Window Pouch Almonds 250g | RARE NUTS',
    description: 'Matte black stand-up zip pouch with gold foil squirrel seal and transparent window showcasing raw almonds.',
    slug: 'window-pouch-almonds-250g',
    image: '/images/almonds-pouch-window.png',
    price: '899.00 INR',
    availability: 'in_stock',
    category: 'Food, Beverages & Tobacco > Food Items > Nuts & Seeds',
    productType: 'Food > Nuts & Seeds > Almonds',
  },
  {
    id: 'RN-GRAND-UNBOX-1000',
    title: 'Grand Unboxing Luxury Gift Box 1kg | RARE NUTS',
    description: 'Hinged black gift box with gold velvet lining, pouch set, and handwritten gold thank-you card.',
    slug: 'grand-unboxing-luxury-box',
    image: '/images/luxury-gift-box-unboxing.png',
    price: '2999.00 INR',
    availability: 'in_stock',
    category: 'Food, Beverages & Tobacco > Food Items > Food Gift Baskets',
    productType: 'Food > Gifts > Luxury Nut Hampers',
  },
  {
    id: 'RN-MANGALORE-CASHEW-250',
    title: 'Royal Mangalore Jumbo Cashews 250g | RARE NUTS',
    description: 'King W180 Mangalore jumbo cashews roasted with mineral-rich sea salt flakes.',
    slug: 'royal-mangalore-jumbo-cashews-250g',
    image: '/images/cashews_matte_black.jpg',
    price: '899.00 INR',
    availability: 'in_stock',
    category: 'Food, Beverages & Tobacco > Food Items > Nuts & Seeds',
    productType: 'Food > Nuts & Seeds > Cashews',
  },
  {
    id: 'RN-AKBARI-PISTACHIO-250',
    title: 'Persian Akbari Salted Pistachios 250g | RARE NUTS',
    description: 'Authentic Persian Akbari long pistachios, naturally opened and lightly roasted.',
    slug: 'persian-akbari-salted-pistachios-250g',
    image: '/images/pistachios_matte_black.jpg',
    price: '949.00 INR',
    availability: 'in_stock',
    category: 'Food, Beverages & Tobacco > Food Items > Nuts & Seeds',
    productType: 'Food > Nuts & Seeds > Pistachios',
  },
  {
    id: 'RN-KASHMIRI-WALNUT-250',
    title: 'Kashmiri Snow Walnut Halves 250g | RARE NUTS',
    description: 'Unpasteurized snow-white walnut halves from the high-altitude valleys of Kashmir.',
    slug: 'kashmiri-snow-walnut-halves-250g',
    image: '/images/walnuts_matte_black.jpg',
    price: '799.00 INR',
    availability: 'in_stock',
    category: 'Food, Beverages & Tobacco > Food Items > Nuts & Seeds',
    productType: 'Food > Nuts & Seeds > Walnuts',
  },
  {
    id: 'RN-CHILGOZA-PINE-100',
    title: 'Himalayan Wild Chilgoza Pine Nuts 100g | RARE NUTS',
    description: 'Rare wild-harvested Himalayan Chilgoza pine nuts from high alpine forests.',
    slug: 'himalayan-wild-chilgoza-pine-nuts-100g',
    image: '/images/pinenuts_matte_black.jpg',
    price: '1499.00 INR',
    availability: 'in_stock',
    category: 'Food, Beverages & Tobacco > Food Items > Nuts & Seeds',
    productType: 'Food > Nuts & Seeds > Pine Nuts',
  },
  {
    id: 'RN-TRUFFLE-CASHEW-250',
    title: 'Black Truffle Sea Salt Cashews 250g | RARE NUTS',
    description: 'Jumbo cashews infused with real Italian black summer truffles and Fleur de Sel.',
    slug: 'black-truffle-sea-salt-cashews-250g',
    image: '/images/truffle_cashews_matte_black.jpg',
    price: '1299.00 INR',
    availability: 'in_stock',
    category: 'Food, Beverages & Tobacco > Food Items > Nuts & Seeds',
    productType: 'Food > Nuts & Seeds > Gourmet Flavored Nuts',
  },
];

export async function GET() {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://rarenuts.in';
  const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

  let itemsToRender: any[] = FALLBACK_MERCHANT_PRODUCTS;

  try {
    const res = await fetch(`${apiUrl}/products?limit=100`, { next: { revalidate: 3600 } });
    if (res.ok) {
      const json = await res.json();
      const dbProducts = json.data || [];
      if (Array.isArray(dbProducts) && dbProducts.length > 0) {
        itemsToRender = dbProducts
          .filter((p: any) => p.isIndexable !== false && p.status !== 'INACTIVE')
          .map((p: any) => {
            const priceVal = Number(p.salePrice || p.price || 999).toFixed(2);
            const imagePath = p.thumbnailUrl || p.images?.[0]?.imageUrl || '/images/california-almonds-250g.png';
            const fullImage = imagePath.startsWith('http') ? imagePath : `${baseUrl}${imagePath}`;
            const inStock = (p.stockQty ?? 10) > 0;
            return {
              id: p.sku || `RN-${p.slug.toUpperCase().substring(0, 12)}`,
              title: `${p.name} | RARE NUTS`,
              description: p.shortDescription || p.description?.substring(0, 200) || `${p.name} by RARE NUTS.`,
              slug: p.slug,
              image: fullImage,
              price: `${priceVal} INR`,
              availability: inStock ? 'in_stock' : 'out_of_stock',
              category: 'Food, Beverages & Tobacco > Food Items > Nuts & Seeds',
              productType: `Food > Nuts & Seeds > ${p.category?.name || 'Gourmet Nuts'}`,
            };
          });
      }
    }
  } catch {
    // Fallback to static items
  }

  const xmlItems = itemsToRender
    .map(
      (p) => `
    <item>
      <g:id>${p.id}</g:id>
      <g:title><![CDATA[${p.title}]]></g:title>
      <g:description><![CDATA[${p.description}]]></g:description>
      <g:link>${baseUrl}/shop/${p.slug}</g:link>
      <g:image_link>${p.image.startsWith('http') ? p.image : `${baseUrl}${p.image}`}</g:image_link>
      <g:availability>${p.availability}</g:availability>
      <g:price>${p.price}</g:price>
      <g:brand>RARE NUTS</g:brand>
      <g:condition>new</g:condition>
      <g:product_type><![CDATA[${p.productType}]]></g:product_type>
      <g:google_product_category><![CDATA[${p.category}]]></g:google_product_category>
      <g:shipping>
        <g:country>IN</g:country>
        <g:service>Standard White-Glove Delivery</g:service>
        <g:price>0.00 INR</g:price>
      </g:shipping>
    </item>`
    )
    .join('');

  const xmlFeed = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:g="http://base.google.com/ns/1.0">
  <channel>
    <title>RARE NUTS Official Google Merchant Product Feed</title>
    <link>${baseUrl}</link>
    <description>Live RSS 2.0 product catalog feed for Google Merchant Center.</description>
    ${xmlItems}
  </channel>
</rss>`;

  return new NextResponse(xmlFeed, {
    headers: {
      'Content-Type': 'application/xml; charset=utf-8',
      'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=86400',
    },
  });
}
