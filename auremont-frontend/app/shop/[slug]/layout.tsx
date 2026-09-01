/* eslint-disable max-lines-per-function, complexity */
import { Metadata } from 'next';
import JsonLd from '@/components/JsonLd';

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://rarenuts.in';
const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

const CATEGORY_SEO_MAP: Record<string, { title: string; description: string; name: string }> = {
  almonds: {
    name: "California Almonds",
    title: "Premium California Almonds & Luxury Almond Gifts | RARE NUTS",
    description: "Discover premium California almonds from RARE NUTS — hand-selected raw kernels, slow-roasted sea salt almonds, and gold-embossed gift packaging.",
  },
  cashews: {
    name: "Artisanal Cashews",
    title: "Royal Mangalore Jumbo Cashews & Gourmet Gifting | RARE NUTS",
    description: "Indulge in King W180 Mangalore jumbo cashews — roasted to golden perfection with sea salt flakes, packaged in luxury airtight containers.",
  },
  pistachios: {
    name: "Persian Pistachios",
    title: "Persian Akbari Long Pistachios & Gourmet Gifts | RARE NUTS",
    description: "Explore RARE NUTS Persian Akbari long pistachios — naturally opened, lightly wood-fire roasted, and presented in luxury presentation boxes.",
  },
  walnuts: {
    name: "Kashmiri Snow Walnuts",
    title: "Kashmiri Snow-White Walnut Halves & Brain Health Nuts | RARE NUTS",
    description: "Savor unpasteurized, cold-cracked Kashmiri snow-white walnut halves. Extra rich in omega-3 alpha-linolenic acids and botanical nut oils.",
  },
  macadamias: {
    name: "Gourmet Macadamias",
    title: "Australian Style Roasted Macadamias & Luxury Nuts | RARE NUTS",
    description: "Extra buttery, slow-roasted whole macadamia nuts with Himalayan pink salt. The pinnacle of gourmet nut indulgence.",
  },
  'pine-nuts': {
    name: "Himalayan Pine Nuts",
    title: "Himalayan Wild Chilgoza Pine Nuts & Rare Harvest | RARE NUTS",
    description: "Wild-harvested Himalayan Chilgoza pine nuts from high-altitude alpine forests. Distinctive pine aroma and rich creamy texture.",
  },
  'truffle-cashews': {
    name: "Truffle Infused Nuts",
    title: "Black Truffle & Sea Salt Artisanal Cashews | RARE NUTS",
    description: "Jumbo King cashews infused with real Italian black summer truffles and hand-harvested Fleur de Sel sea salt crystals.",
  },
  raw: {
    name: "Raw Natural Nuts",
    title: "Raw California Almonds & Unpasteurized Nuts | RARE NUTS",
    description: "100% natural, unpasteurized California raw almonds and nuts. High protein, rich in essential oils, and uncompromised by high heat.",
  },
  roasted: {
    name: "Slow-Roasted Reserves",
    title: "Artisanal Slow-Roasted Almonds & Sea Salt Nuts | RARE NUTS",
    description: "Masterfully slow-roasted at low temperatures to preserve natural vitamin E and aromatic oils with an audible, crisp crunch.",
  },
  gift: {
    name: "Luxury Gift Boxes",
    title: "Luxury Mahogany Gift Chests & Bespoke Hampers | RARE NUTS",
    description: "Handcrafted mahogany gift chests and velvet packaging featuring RARE NUTS reserves with custom brass plate laser engraving.",
  },
};

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  
  if (CATEGORY_SEO_MAP[slug]) {
    const cat = CATEGORY_SEO_MAP[slug];
    return {
      title: cat.title,
      description: cat.description,
      alternates: { canonical: `${siteUrl}/shop/${slug}` },
      openGraph: {
        title: cat.title,
        description: cat.description,
        url: `${siteUrl}/shop/${slug}`,
        siteName: 'RARE NUTS',
        images: [{ url: '/images/og-rarenuts.png', width: 1200, height: 630, alt: cat.title }],
        type: 'website',
        locale: 'en_IN',
      },
      twitter: {
        card: 'summary_large_image',
        title: cat.title,
        description: cat.description,
        images: ['/images/og-rarenuts.png'],
      },
    };
  }

  try {
    const res = await fetch(`${apiUrl}/products/${slug}`, { next: { revalidate: 60 } });
    if (!res.ok) throw new Error('Product not found');
    const raw = await res.json();
    const product = raw.data || raw;
    
    const imageUrl = product.thumbnailUrl || product.images?.[0]?.imageUrl || '/images/og-rarenuts.png';
    const seoTitle = product.seoTitle || `${product.name} | RARE NUTS`;
    const seoDesc = product.seoDescription || product.shortDescription || product.description?.substring(0, 160) || `Buy ${product.name} at RARE NUTS.`;

    return {
      title: seoTitle,
      description: seoDesc,
      keywords: product.focusKeyword 
        ? [product.focusKeyword, 'luxury nuts', 'California almonds', 'gourmet dry fruits', 'premium gifts'] 
        : ['luxury nuts', 'California almonds', 'gourmet dry fruits', 'premium gifts'],
      alternates: {
        canonical: product.canonicalUrl || `${siteUrl}/shop/${slug}`,
      },
      robots: product.isIndexable === false ? { index: false, follow: false } : { index: true, follow: true },
      openGraph: {
        title: seoTitle,
        description: seoDesc,
        url: `${siteUrl}/shop/${slug}`,
        type: 'website',
        siteName: 'RARE NUTS',
        locale: 'en_IN',
        images: [
          {
            url: product.ogImageUrl || imageUrl,
            width: 1200,
            height: 630,
            alt: product.name,
          }
        ],
      },
      twitter: {
        card: 'summary_large_image',
        title: seoTitle,
        description: seoDesc,
        images: [product.ogImageUrl || imageUrl],
      }
    };
  } catch (error) {
    const formatted = slug ? slug.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ') : 'Product';
    return {
      title: `${formatted} | RARE NUTS`,
      description: 'Hand-selected gourmet nuts, slow-roasted to botanical perfection by RARE NUTS.',
      alternates: { canonical: `${siteUrl}/shop/${slug}` },
    };
  }
}

export default async function ProductLayout({ children, params }: { children: React.ReactNode, params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  let schemaNodes: any[] = [];
  
  // 1. Check if category page
  if (CATEGORY_SEO_MAP[slug]) {
    const cat = CATEGORY_SEO_MAP[slug];
    schemaNodes.push({
      "@context": "https://schema.org",
      "@type": "CollectionPage",
      "@id": `${siteUrl}/shop/${slug}#collection`,
      "name": cat.title,
      "description": cat.description,
      "url": `${siteUrl}/shop/${slug}`,
      "isPartOf": {
        "@type": "WebSite",
        "@id": `${siteUrl}/#website`,
        "name": "RARE NUTS",
        "url": siteUrl
      }
    });

    schemaNodes.push({
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      "itemListElement": [
        { "@type": "ListItem", "position": 1, "name": "Home", "item": `${siteUrl}/` },
        { "@type": "ListItem", "position": 2, "name": "Shop", "item": `${siteUrl}/shop` },
        { "@type": "ListItem", "position": 3, "name": cat.name, "item": `${siteUrl}/shop/${slug}` }
      ]
    });
  } else {
    // 2. Fetch product data
    try {
      const res = await fetch(`${apiUrl}/products/${slug}`, { next: { revalidate: 60 } });
      if (res.ok) {
        const raw = await res.json();
        const product = raw.data || raw;
        const imageUrl = product.thumbnailUrl || product.images?.[0]?.imageUrl || `${siteUrl}/images/og-rarenuts.png`;
        const price = product.salePrice ? Number(product.salePrice) : Number(product.price);
        const categoryName = product.category?.name || "Luxury Nuts";
        
        let aggregateRating;
        let reviewSchema;

        // ONLY render AggregateRating and Reviews if genuine reviews exist in the database
        if (product.reviews && Array.isArray(product.reviews) && product.reviews.length > 0) {
          const ratingSum = product.reviews.reduce((acc: number, r: any) => acc + (Number(r.rating) || 5), 0);
          const avgRating = (ratingSum / product.reviews.length).toFixed(1);
          aggregateRating = {
            "@type": "AggregateRating",
            "ratingValue": avgRating,
            "reviewCount": product.reviews.length,
            "bestRating": "5",
            "worstRating": "1"
          };
          reviewSchema = product.reviews.slice(0, 5).map((r: any) => ({
            "@type": "Review",
            "reviewRating": {
              "@type": "Rating",
              "ratingValue": r.rating,
              "bestRating": "5"
            },
            "author": {
              "@type": "Person",
              "name": r.user?.firstName ? `${r.user.firstName} ${r.user.lastName || ''}`.trim() : "Verified Customer"
            },
            "reviewBody": r.comment || r.title || "Exceptional quality and freshness."
          }));
        }

        const productSchema: any = {
          "@context": "https://schema.org/",
          "@type": "Product",
          "@id": `${siteUrl}/shop/${slug}#product`,
          "name": product.name,
          "image": [product.ogImageUrl || imageUrl],
          "description": product.seoDescription || product.shortDescription || product.description?.substring(0, 200),
          "sku": product.sku || `RN-${slug.toUpperCase().substring(0, 10)}`,
          "brand": {
            "@type": "Brand",
            "name": "RARE NUTS"
          },
          "offers": {
            "@type": "Offer",
            "url": product.canonicalUrl || `${siteUrl}/shop/${slug}`,
            "priceCurrency": "INR",
            "price": price,
            "priceValidUntil": new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
            "availability": (product.stockQty ?? 10) > 0 ? "https://schema.org/InStock" : "https://schema.org/OutOfStock",
            "itemCondition": "https://schema.org/NewCondition",
            "seller": {
              "@type": "Organization",
              "name": "RARE NUTS"
            }
          }
        };

        if (aggregateRating) {
          productSchema.aggregateRating = aggregateRating;
        }
        if (reviewSchema && reviewSchema.length > 0) {
          productSchema.review = reviewSchema;
        }

        schemaNodes.push(productSchema);

        // Breadcrumbs for Product
        schemaNodes.push({
          "@context": "https://schema.org",
          "@type": "BreadcrumbList",
          "itemListElement": [
            { "@type": "ListItem", "position": 1, "name": "Home", "item": `${siteUrl}/` },
            { "@type": "ListItem", "position": 2, "name": "Shop", "item": `${siteUrl}/shop` },
            { "@type": "ListItem", "position": 3, "name": categoryName, "item": `${siteUrl}/shop` },
            { "@type": "ListItem", "position": 4, "name": product.name, "item": `${siteUrl}/shop/${slug}` }
          ]
        });
      }
    } catch (e) {
      // Silently continue without schema if fetch fails
    }
  }

  return (
    <>
      {schemaNodes.map((s, idx) => (
        <JsonLd key={idx} data={s} />
      ))}
      {children}
    </>
  );
}
