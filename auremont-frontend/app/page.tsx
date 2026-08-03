import CinematicHero from "@/components/home/CinematicHero";
import FeaturedCollections from "@/components/home/FeaturedCollections";
import BestSellers from "@/components/home/BestSellers";
import WhyAuremont from "@/components/home/WhyAuremont";
import PackagingShowcase from "@/components/home/PackagingShowcase";
import BrandStory from "@/components/home/BrandStory";
import Testimonials from "@/components/home/Testimonials";
import CorporateGifting from "@/components/home/CorporateGifting";
import HealthHighlights from "@/components/home/HealthHighlights";
import LifestyleGallery from "@/components/home/LifestyleGallery";

// Fetch products from backend
async function getProducts() {
  try {
    const res = await fetch('http://localhost:3001/products', { cache: 'no-store' });
    if (!res.ok) return { data: [] };
    return await res.json();
  } catch (e: any) {
    console.error("Failed to fetch products:", e.message || e);
    return { data: [] };
  }
}

export default async function Home() {
  const response = await getProducts();
  const products = response?.data || [];

  return (
    <main className="w-full bg-background overflow-hidden">
      <CinematicHero />
      <FeaturedCollections products={products} />
      <WhyAuremont />
      <BestSellers products={products} />
      <BrandStory />
      <PackagingShowcase />
      <CorporateGifting />
      <HealthHighlights />
      <Testimonials />
      <LifestyleGallery />
    </main>
  );
}
