import { Metadata } from "next";
import ProductDetailClient from "./ProductDetailClient";
import ProductSchema from "@/components/seo/ProductSchema";
import BreadcrumbSchema from "@/components/seo/BreadcrumbSchema";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://rarenuts.in';

async function getProduct(slug: string) {
  try {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';
    const res = await fetch(`${apiUrl}/products/${slug}`, { 
      next: { revalidate: 60 },
      signal: AbortSignal.timeout(3000),
    });
    if (res.ok) {
      const data = await res.json();
      return (data && data.data && !Array.isArray(data.data)) ? data.data : data;
    }
  } catch (error) {
    // Graceful fallback to client fetch
  }
  return null;
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const product = await getProduct(slug);

  if (product) {
    const title = `${product.name} | RARE NUTS`;
    const description = product.shortDescription || product.description || `Buy ${product.name} online from RARE NUTS. Premium reserve quality nuts and luxury gifting presentation.`;
    const image = product.thumbnailUrl || '/images/og-rarenuts.png';
    const imageUrl = image.startsWith('http') ? image : `${siteUrl}${image}`;
    const canonicalUrl = `${siteUrl}/shop/${product.slug || slug}`;

    return {
      title,
      description,
      alternates: {
        canonical: canonicalUrl,
      },
      openGraph: {
        title,
        description,
        url: canonicalUrl,
        siteName: 'RARE NUTS',
        images: [
          {
            url: imageUrl,
            width: 1200,
            height: 630,
            alt: product.name,
          },
        ],
        locale: 'en_US',
        type: 'website',
      },
      twitter: {
        card: 'summary_large_image',
        title,
        description,
        images: [imageUrl],
      },
    };
  }

  const formattedName = slug
    ? slug.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')
    : 'Product';
  const fallbackTitle = `${formattedName} | RARE NUTS`;
  const fallbackDesc = `Explore ${formattedName} from RARE NUTS — hand-selected premium dry fruits and exceptional confectionery reserves.`;

  return {
    title: fallbackTitle,
    description: fallbackDesc,
    alternates: {
      canonical: `${siteUrl}/shop/${slug}`,
    },
    openGraph: {
      title: fallbackTitle,
      description: fallbackDesc,
      url: `${siteUrl}/shop/${slug}`,
      siteName: 'RARE NUTS',
      images: [{ url: `${siteUrl}/images/og-rarenuts.png` }],
    },
    twitter: {
      card: 'summary_large_image',
      title: fallbackTitle,
      description: fallbackDesc,
      images: [`${siteUrl}/images/og-rarenuts.png`],
    },
  };
}

export default async function ProductDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const initialProduct = slug ? await getProduct(slug) : null;

  const validReviews = Array.isArray(initialProduct?.reviews) ? initialProduct.reviews : [];
  const reviewCount = validReviews.length;
  const ratingValue = reviewCount > 0
    ? validReviews.reduce((sum: number, r: any) => sum + (Number(r.rating) || 5), 0) / reviewCount
    : undefined;

  const breadcrumbs = [
    { name: "Home", url: "/" },
    { name: "Shop", url: "/shop" },
    ...(initialProduct?.category?.name ? [{ name: initialProduct.category.name, url: `/shop?category=${initialProduct.category.slug || ''}` }] : []),
    { name: initialProduct?.name || slug, url: `/shop/${slug}` },
  ];

  return (
    <>
      {initialProduct && (
        <ProductSchema
          name={initialProduct.name}
          description={initialProduct.shortDescription || initialProduct.description || initialProduct.name}
          sku={initialProduct.sku || slug}
          image={initialProduct.thumbnailUrl || '/images/og-rarenuts.png'}
          price={Number(initialProduct.salePrice || initialProduct.price || 0)}
          currency="INR"
          inStock={initialProduct.stockQty !== undefined ? initialProduct.stockQty > 0 : true}
          ratingValue={ratingValue}
          reviewCount={reviewCount > 0 ? reviewCount : undefined}
          slug={initialProduct.slug || slug}
        />
      )}
      <BreadcrumbSchema items={breadcrumbs} />
      <ProductDetailClient initialProduct={initialProduct} slug={slug} />
    </>
  );
}
