import { Metadata } from "next";
import { notFound } from "next/navigation";
import ProductDetailClient from "./ProductDetailClient";
import ProductSchema from "@/components/seo/ProductSchema";
import BreadcrumbSchema from "@/components/seo/BreadcrumbSchema";
import { CatalogProduct, FALLBACK_PRODUCTS } from "@/lib/productData";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://rarenuts.in';

async function getProduct(slug: string): Promise<CatalogProduct | null> {
  const localProduct = FALLBACK_PRODUCTS[slug] || null;
  const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

  try {
    const res = await fetch(`${apiUrl}/products/${slug}`, { 
      next: { revalidate: 60 },
      signal: AbortSignal.timeout(3000),
    });
    if (res.ok) {
      const data = await res.json();
      const product = (data && data.data && !Array.isArray(data.data)) ? data.data : data;
      if (product) {
        return {
          ...product,
          reviews: product.reviews || localProduct?.reviews || [],
        };
      }
    }
  } catch (error) {
    // Graceful fallback to local catalog dictionary
  }

  return localProduct;
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const product = await getProduct(slug);

  if (!product) {
    return {
      title: "Product Not Found | RARE NUTS",
      description: "The requested reserve product could not be located in our collection.",
      robots: { index: false, follow: false },
    };
  }

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

export default async function ProductDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const product = slug ? await getProduct(slug) : null;

  if (!product) {
    notFound();
  }

  const validReviews = Array.isArray(product.reviews) ? product.reviews : [];
  const reviewCount = validReviews.length;
  const ratingValue = reviewCount > 0
    ? validReviews.reduce((sum: number, r: any) => sum + (Number(r.rating) || 5), 0) / reviewCount
    : undefined;

  const breadcrumbs = [
    { name: "Home", url: "/" },
    { name: "Shop", url: "/shop" },
    ...(product.category?.name ? [{ name: product.category.name, url: `/shop?category=${product.category.slug || ''}` }] : []),
    { name: product.name || slug, url: `/shop/${slug}` },
  ];

  return (
    <>
      <ProductSchema
        name={product.name}
        description={product.shortDescription || product.description || product.name}
        sku={product.sku || slug}
        image={product.thumbnailUrl || '/images/og-rarenuts.png'}
        price={Number(product.salePrice || product.price || 0)}
        currency="INR"
        inStock={product.stockQty !== undefined ? product.stockQty > 0 : true}
        ratingValue={ratingValue}
        reviewCount={reviewCount > 0 ? reviewCount : undefined}
        slug={product.slug || slug}
      />
      <BreadcrumbSchema items={breadcrumbs} />
      <ProductDetailClient initialProduct={product} slug={slug} />
    </>
  );
}
