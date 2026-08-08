/* eslint-disable max-lines-per-function, complexity */
import { Metadata } from 'next';

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';
const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

const CATEGORY_SEO_MAP: Record<string, { title: string; description: string }> = {
  almonds: {
    title: "Premium Almonds & Luxury Almond Gifts | RARE NUTS",
    description: "Discover premium California almonds from RARE NUTS — hand-selected raw kernels and slow-roasted sea salt almonds curated for refined everyday indulgence and luxury gifting.",
  },
  pistachios: {
    title: "Premium Pistachios & Gourmet Pistachio Gifts | RARE NUTS",
    description: "Explore RARE NUTS premium pistachios — masterfully roasted, lightly salted, and presented in luxury gold-embossed presentation boxes.",
  },
  walnuts: {
    title: "Premium California Walnuts & Gourmet Nuts | RARE NUTS",
    description: "Indulge in extra-large California walnut halves from RARE NUTS. Rich in omega-3s, unpasteurized, and curated for executive gifting.",
  },
  cashews: {
    title: "Premium Artisanal Cashews & Luxury Gifting | RARE NUTS",
    description: "Savor jumbo whole cashews roasted to golden perfection. RARE NUTS brings supreme botanical quality to gourmet cashew gifting.",
  },
  hazelnuts: {
    title: "Premium Roasted Hazelnuts & Gourmet Nuts | RARE NUTS",
    description: "Hand-selected slow-roasted hazelnuts with deep aromatic notes, packaged in velvet-lined mahogany presentation chests.",
  },
  pecans: {
    title: "Premium Roasted Pecans & Luxury Gourmet Nuts | RARE NUTS",
    description: "Extra-large buttery pecan halves, expertly roasted for an unmatched crunch. Crafted for luxury food gifts and corporate occasions.",
  },
  raw: {
    title: "Raw California Almonds & Unprocessed Nuts | RARE NUTS",
    description: "100% natural, unpasteurized California raw almonds. High protein, rich in essential nutrient oils, and curated for healthy living.",
  },
  roasted: {
    title: "Artisanal Slow-Roasted Almonds & Sea Salt Nuts | RARE NUTS",
    description: "Masterfully slow-roasted at low temperatures to preserve aromatic vitamin E and natural nut oils. Crisp, buttery crunch.",
  },
  gift: {
    title: "Luxury Gift Boxes & Bespoke Gifting Packages | RARE NUTS",
    description: "Handcrafted mahogany gift chests and gold velvet packaging featuring RARE NUTS extra-large almonds and custom brass plate laser engraving.",
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
        images: [{ url: '/images/og-rarenuts.png', width: 1200, height: 630, alt: cat.title }],
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
    const product = await res.json();
    
    const imageUrl = product.thumbnailUrl || product.images?.[0]?.imageUrl || '/images/og-rarenuts.png';

    return {
      title: product.seoTitle || `${product.name} | RARE NUTS`,
      description: product.seoDescription || product.shortDescription || product.description?.substring(0, 160) || `Buy ${product.name} at RARE NUTS.`,
      keywords: product.focusKeyword ? [product.focusKeyword, 'luxury almonds', 'premium gifts', 'healthy snacks', 'nutrition'] : ['luxury almonds', 'premium gifts', 'healthy snacks', 'nutrition'],
      alternates: {
        canonical: product.canonicalUrl || `${siteUrl}/shop/${slug}`,
      },
      robots: product.isIndexable === false ? { index: false, follow: false } : { index: true, follow: true },
      openGraph: {
        title: product.seoTitle || `${product.name} | RARE NUTS`,
        description: product.seoDescription || product.shortDescription || product.description?.substring(0, 160),
        url: `${siteUrl}/shop/${slug}`,
        type: 'website',
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
        title: product.seoTitle || `${product.name} | RARE NUTS`,
        description: product.seoDescription || product.shortDescription || product.description?.substring(0, 160),
        images: [product.ogImageUrl || imageUrl],
      }
    };
  } catch (error) {
    return {
      title: 'RARE NUTS | Premium Gourmet Collection',
    };
  }
}

import JsonLd from '@/components/JsonLd';

export default async function ProductLayout({ children, params }: { children: React.ReactNode, params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  let productJsonLd = null;
  
  try {
    const res = await fetch(`${apiUrl}/products/${slug}`, { next: { revalidate: 60 } });
    if (res.ok) {
      const product = await res.json();
      const imageUrl = product.thumbnailUrl || product.images?.[0]?.imageUrl || `${siteUrl}/images/og-rarenuts.png`;
      const price = product.salePrice ? product.salePrice : product.price;
      
      let aggregateRating;
      let reviewSchema;

      if (product.reviews && product.reviews.length > 0) {
        const ratingSum = product.reviews.reduce((acc: number, r: any) => acc + r.rating, 0);
        aggregateRating = {
          "@type": "AggregateRating",
          "ratingValue": (ratingSum / product.reviews.length).toFixed(1),
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
            "name": r.user?.firstName || "Anonymous"
          }
        }));
      }

      productJsonLd = {
        "@context": "https://schema.org/",
        "@type": "Product",
        "name": product.seoTitle || product.name,
        "image": product.ogImageUrl || imageUrl,
        "description": product.seoDescription || product.shortDescription || product.description?.substring(0, 160),
        "sku": product.sku,
        "brand": {
          "@type": "Brand",
          "name": "RARE NUTS"
        },
        "offers": {
          "@type": "Offer",
          "url": product.canonicalUrl || `${siteUrl}/shop/${slug}`,
          "priceCurrency": "INR",
          "price": price,
          "availability": product.stockQty > 0 ? "https://schema.org/InStock" : "https://schema.org/OutOfStock",
          "itemCondition": "https://schema.org/NewCondition"
        },
        "aggregateRating": aggregateRating,
        "review": reviewSchema
      };

      if (product.schemaOverride) {
        productJsonLd = { ...productJsonLd, ...product.schemaOverride };
      }
    }
  } catch (e) {
    // silently fail JSON-LD on error
  }

  return (
    <>
      {productJsonLd && <JsonLd data={productJsonLd} />}
      {children}
    </>
  );
}
