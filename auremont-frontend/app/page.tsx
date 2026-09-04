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
    name: "California Reserve Raw Almonds 250g",
    slug: "california-reserve-raw",
    price: 999,
    salePrice: 799,
    weightGrams: 250,
    thumbnailUrl: "/images/california-almonds-250g.png",
    shortDescription: "Signature matte black pouch with gold foil crown logo & botanical almond engraving.",
    isBestseller: true,
  },
  {
    id: "fb-2",
    name: "Slow-Roasted Sea Salt Almonds 500g",
    slug: "roasted-sea-salt-almonds",
    price: 1499,
    salePrice: 1299,
    weightGrams: 500,
    thumbnailUrl: "/images/roasted-almonds-jar.png",
    shortDescription: "Artisanal slow-roasted California almonds in a thick glass jar with metallic gold cap.",
    isBestseller: true,
  },
  {
    id: "fb-3",
    name: "Everyday Collection Rigid Gift Box 1kg",
    slug: "royal-almonds-wooden-box",
    price: 2999,
    salePrice: 2499,
    weightGrams: 1000,
    thumbnailUrl: "/images/royal-almonds-wooden-box.png",
    shortDescription: "Custom matte black rigid gift box with embossed gold lettering and gold edge trim.",
    isBestseller: true,
  },
  {
    id: "fb-4",
    name: "Transparent Window Pouch Edition 250g",
    slug: "window-pouch-almonds-250g",
    price: 1099,
    salePrice: 899,
    weightGrams: 250,
    thumbnailUrl: "/images/almonds-pouch-window.png",
    shortDescription: "Matte black stand-up pouch featuring a clear window displaying fresh California almonds.",
    isBestseller: false,
  },
  {
    id: "fb-5",
    name: "Grand Unboxing Luxury Gift Box",
    slug: "grand-unboxing-luxury-box",
    price: 3499,
    salePrice: 2999,
    weightGrams: 1000,
    thumbnailUrl: "/images/luxury-gift-box-unboxing.png",
    shortDescription: "Hinged black gift box with gold interior rim, gold-stamped pouch & thank you card.",
    isBestseller: true,
  }
];

// Fetch featured products from backend with ISR cache (30s revalidation) and 2s timeout guard
async function getProducts() {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';
  try {
    // Fetch only 8 recommended products with 2s timeout guard so SSR never hangs
    const res = await fetch(`${apiUrl}/products?sort=recommended&limit=8`, { 
      next: { revalidate: 30 },
      signal: AbortSignal.timeout(2000),
    });
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
