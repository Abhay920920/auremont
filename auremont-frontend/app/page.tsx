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

const FALLBACK_PRODUCTS = [
  {
    id: "fb-1",
    name: "Royal Golden Almonds",
    slug: "royal-golden-almonds",
    price: 1499,
    salePrice: 1299,
    thumbnailUrl: "/images/royal-almonds-wooden-box.png",
    shortDescription: "Signature California raw almonds in velvet-lined oak box.",
    isBestseller: true,
  },
  {
    id: "fb-2",
    name: "Slow-Roasted Sea Salt Almonds",
    slug: "roasted-sea-salt-almonds",
    price: 1199,
    thumbnailUrl: "/images/roasted-almonds-jar.png",
    shortDescription: "Slow roasted with artisanal sea salt crystals.",
    isBestseller: true,
  },
  {
    id: "fb-3",
    name: "California Reserve Raw Almonds",
    slug: "california-reserve-raw",
    price: 999,
    thumbnailUrl: "/images/california-almonds-250g.png",
    shortDescription: "Unprocessed organic California almonds, extra large grade.",
    isBestseller: false,
  }
];

// Fetch products from backend with build safety fallback
async function getProducts() {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';
  try {
    const res = await fetch(`${apiUrl}/products`, { cache: 'no-store' });
    if (!res.ok) return FALLBACK_PRODUCTS;
    const json = await res.json();
    return json.data && json.data.length > 0 ? json.data : FALLBACK_PRODUCTS;
  } catch (e) {
    return FALLBACK_PRODUCTS;
  }
}

export default async function Home() {
  const products = await getProducts();

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
