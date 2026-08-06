import { Metadata } from 'next';

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';
const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  
  try {
    const res = await fetch(`${apiUrl}/products/${slug}`, { next: { revalidate: 60 } });
    if (!res.ok) throw new Error('Product not found');
    const product = await res.json();
    
    const imageUrl = product.thumbnailUrl || product.images?.[0]?.imageUrl || '/images/og-auremont.png';

    return {
      title: product.seoTitle || product.name,
      description: product.seoDescription || product.shortDescription || product.description?.substring(0, 160) || `Buy ${product.name} at Auremont.`,
      keywords: product.focusKeyword ? [product.focusKeyword, 'luxury almonds', 'premium gifts', 'healthy snacks', 'nutrition'] : ['luxury almonds', 'premium gifts', 'healthy snacks', 'nutrition'],
      alternates: {
        canonical: product.canonicalUrl || `${siteUrl}/shop/${slug}`,
      },
      robots: product.isIndexable === false ? { index: false, follow: false } : { index: true, follow: true },
      openGraph: {
        title: product.seoTitle || product.name,
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
        title: product.seoTitle || product.name,
        description: product.seoDescription || product.shortDescription || product.description?.substring(0, 160),
        images: [product.ogImageUrl || imageUrl],
      }
    };
  } catch (error) {
    return {
      title: 'Product Not Found',
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
      const imageUrl = product.thumbnailUrl || product.images?.[0]?.imageUrl || `${siteUrl}/images/og-auremont.png`;
      const price = product.salePrice ? product.salePrice : product.price;
      
      let aggregateRating = undefined;
      let reviewSchema = undefined;

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
          "name": "Auremont"
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
