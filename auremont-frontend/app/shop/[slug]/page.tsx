import { Metadata } from "next";
import ProductDetailClient from "./ProductDetailClient";

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> | { slug: string } }): Promise<Metadata> {
  const resolvedParams = await params;
  const slug = resolvedParams?.slug;

  try {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 1000);
    const res = await fetch(`${apiUrl}/products/${slug}`, { signal: controller.signal }).catch(() => null);
    clearTimeout(timeoutId);

    if (res && res.ok) {
      const product = await res.json();
      return {
        title: `${product.name} | RARE NUTS`,
        description: product.shortDescription,
        openGraph: {
          title: product.name,
          description: product.shortDescription,
          images: product.thumbnailUrl ? [{ url: product.thumbnailUrl }] : [],
        },
      };
    }
  } catch (error) {
    // Graceful fallback
  }

  const formattedName = slug
    ? slug.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')
    : 'Product';

  return {
    title: `${formattedName} | RARE NUTS`,
    description: 'Curated California almonds, handcrafted for ultimate taste.',
  };
}

export default function ProductDetailPage() {
  return <ProductDetailClient />;
}
