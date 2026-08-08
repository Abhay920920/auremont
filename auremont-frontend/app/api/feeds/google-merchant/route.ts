import { NextResponse } from 'next/server';

export async function GET() {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://rarenuts.in';

  const products = [
    {
      id: 'ALM-EV-250',
      title: 'California Reserve Raw Almonds 250g | RARE NUTS',
      description: 'Extra-large unpasteurized raw California almonds selected for high nutrient oil content and buttery natural flavor.',
      slug: 'california-reserve-raw',
      image: `${baseUrl}/images/california-almonds-250g.png`,
      price: '850.00 INR',
      availability: 'in_stock',
      category: 'Food, Beverages & Tobacco > Food Items > Nuts & Seeds',
    },
    {
      id: 'ALM-SIG-500',
      title: 'Slow-Roasted Sea Salt Almonds 500g | RARE NUTS',
      description: 'Masterfully slow-roasted California almonds lightly seasoned with mineral-rich sea salt flakes.',
      slug: 'roasted-sea-salt-almonds',
      image: `${baseUrl}/images/roasted-almonds-jar.png`,
      price: '1650.00 INR',
      availability: 'in_stock',
      category: 'Food, Beverages & Tobacco > Food Items > Nuts & Seeds',
    },
    {
      id: 'ALM-HER-1000',
      title: 'Royal Almonds Mahogany Gift Chest 1kg | RARE NUTS',
      description: 'Handcrafted solid mahogany presentation chest lined with gold velvet, filled with 1kg of California Reserve almonds.',
      slug: 'royal-almonds-wooden-box',
      image: `${baseUrl}/images/royal-almonds-wooden-box.png`,
      price: '3450.00 INR',
      availability: 'in_stock',
      category: 'Food, Beverages & Tobacco > Food Items > Nuts & Seeds',
    },
    {
      id: 'ALM-WIN-250',
      title: 'Transparent Window Pouch Almonds 250g | RARE NUTS',
      description: 'Matte black stand-up zip pouch with gold foil squirrel seal and transparent window showcasing raw almonds.',
      slug: 'window-pouch-almonds-250g',
      image: `${baseUrl}/images/almonds-pouch-window.png`,
      price: '790.00 INR',
      availability: 'in_stock',
      category: 'Food, Beverages & Tobacco > Food Items > Nuts & Seeds',
    },
    {
      id: 'ALM-UNB-1000',
      title: 'Grand Unboxing Luxury Gift Box 1kg | RARE NUTS',
      description: 'Hinged black gift box with gold velvet lining, pouch set, and handwritten gold thank-you card.',
      slug: 'grand-unboxing-luxury-box',
      image: `${baseUrl}/images/luxury-gift-box-unboxing.png`,
      price: '3950.00 INR',
      availability: 'in_stock',
      category: 'Food, Beverages & Tobacco > Food Items > Nuts & Seeds',
    },
  ];

  const xmlItems = products
    .map(
      (p) => `
    <item>
      <g:id>${p.id}</g:id>
      <g:title><![CDATA[${p.title}]]></g:title>
      <g:description><![CDATA[${p.description}]]></g:description>
      <g:link>${baseUrl}/shop/${p.slug}</g:link>
      <g:image_link>${p.image}</g:image_link>
      <g:availability>${p.availability}</g:availability>
      <g:price>${p.price}</g:price>
      <g:brand>RARE NUTS</g:brand>
      <g:condition>new</g:condition>
      <g:product_type>Food > Nuts &amp; Seeds > Almonds</g:product_type>
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
    <title>RARE NUTS Product Feed</title>
    <link>${baseUrl}</link>
    <description>Official Google Merchant Center RSS 2.0 product feed for RARE NUTS luxury almonds and gifting.</description>
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
