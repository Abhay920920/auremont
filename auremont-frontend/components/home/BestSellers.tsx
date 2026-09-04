"use client";

import { useState, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Star, ChevronLeft, ChevronRight, Sparkles, Check, Flame } from "lucide-react";
import AddToCartButton from "@/components/AddToCartButton";
import { useCurrencyStore } from "@/store/currencyStore";

interface Product {
  id: string;
  name: string;
  slug: string;
  price: number;
  salePrice?: number;
  weightGrams?: number;
  thumbnailUrl?: string;
  shortDescription?: string;
  isBestseller?: boolean;
  category?: { name: string; slug: string };
  roastLevel?: string;
  origin?: string;
}

export default function BestSellers({ products = [] }: { products?: Product[] }) {
  const { formatPrice } = useCurrencyStore();
  const sliderRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  // Curate best sellers, fallback to provided products or default items
  const bestSellers = products.length > 0 ? products : [];

  const checkScroll = () => {
    if (sliderRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = sliderRef.current;
      setCanScrollLeft(scrollLeft > 10);
      setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 10);
    }
  };

  const scroll = (direction: 'left' | 'right') => {
    if (sliderRef.current) {
      const cardWidth = 340;
      const scrollAmount = direction === 'left' ? -cardWidth : cardWidth;
      sliderRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
      setTimeout(checkScroll, 350);
    }
  };

  return (
    <section className="w-full py-20 md:py-32 bg-secondaryBg/90 border-t border-divider relative overflow-hidden">
      {/* Decorative backdrop elements */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-luxuryGold/[0.03] rounded-full blur-3xl pointer-events-none" />

      <div className="site-container">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 md:mb-16 gap-6">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-luxuryGold/20 bg-luxuryGold/5 text-luxuryGold text-[10px] uppercase tracking-ultra mb-3 font-medium">
            <Sparkles size={11} />
            <span>The Reserve Editions</span>
          </div>
          <h2 className="text-3xl sm:text-5xl font-serif text-primaryText tracking-tight">
            Curated Best-Sellers
          </h2>
          <p className="text-secondaryText text-sm sm:text-base font-light mt-2 max-w-xl">
            Our most requested single-origin harvests and artisanal roasts, celebrated by connoisseurs for unmatched crunch and complexity.
          </p>
        </div>

        {/* Carousel Navigation Arrows */}
        <div className="flex items-center gap-3">
          <button 
            onClick={() => scroll('left')}
            disabled={!canScrollLeft}
            aria-label="Previous products"
            className="w-12 h-12 rounded-full border border-divider hover:border-luxuryGold/60 bg-surface flex items-center justify-center text-primaryText hover:text-luxuryGold disabled:opacity-30 disabled:pointer-events-none transition-all duration-300"
          >
            <ChevronLeft size={20} />
          </button>
          <button 
            onClick={() => scroll('right')}
            disabled={!canScrollRight}
            aria-label="Next products"
            className="w-12 h-12 rounded-full border border-divider hover:border-luxuryGold/60 bg-surface flex items-center justify-center text-primaryText hover:text-luxuryGold disabled:opacity-30 disabled:pointer-events-none transition-all duration-300"
          >
            <ChevronRight size={20} />
          </button>
        </div>
      </div>

      {/* Horizontal Scroll Track */}
      <div 
        ref={sliderRef}
        onScroll={checkScroll}
        className="flex gap-6 overflow-x-auto pb-8 pt-2 scrollbar-none snap-x snap-mandatory -mx-6 px-6 md:-mx-12 md:px-12"
        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
      >
        {bestSellers.map((product, idx) => {
          const discountPercent = product.salePrice && product.salePrice < product.price
            ? Math.round(((product.price - product.salePrice) / product.price) * 100)
            : null;

          return (
            <motion.div 
              key={product.id || idx}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: idx * 0.08 }}
              className="flex-shrink-0 w-[280px] sm:w-[320px] md:w-[340px] snap-start group flex flex-col justify-between bg-surface/70 hover:bg-surface border border-divider hover:border-luxuryGold/50 rounded-card p-4 transition-all duration-500 shadow-lg relative"
            >
              <div>
                {/* Image Container with Badges */}
                <div className="w-full aspect-[4/5] relative bg-secondaryBg overflow-hidden rounded-card mb-4 border border-divider/60">
                  <Link href={`/shop/${product.slug}`} className="relative block w-full h-full">
                    <Image 
                      src={product.thumbnailUrl || '/images/california-almonds-250g.png'} 
                      alt={product.name} 
                      fill 
                      className="object-cover group-hover:scale-105 transition-transform duration-[1.8s] filter brightness-105"
                      sizes="(max-width: 768px) 280px, 340px"
                    />
                  </Link>

                  {/* Floating Top Badges */}
                  <div className="absolute top-3 left-3 right-3 flex items-center justify-between pointer-events-none">
                    <span className="bg-background/90 backdrop-blur-md border border-luxuryGold/30 text-luxuryGold text-[9px] uppercase tracking-widest px-2.5 py-1 rounded font-medium">
                      Reserve
                    </span>
                    {discountPercent && (
                      <span className="bg-luxuryGold text-background text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded">
                        Save {discountPercent}%
                      </span>
                    )}
                  </div>

                  {/* Hover Quick-Add Overlay */}
                  <div className="absolute inset-0 bg-black/50 backdrop-blur-[2px] opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-4 pointer-events-none">
                    <div className="w-full pointer-events-auto">
                      <AddToCartButton 
                        productId={product.id} 
                        product={product}
                        className="w-full bg-luxuryGold hover:bg-goldHover text-background font-medium py-3 rounded text-xs uppercase tracking-widest transition-colors shadow-xl"
                      />
                    </div>
                  </div>
                </div>

                {/* Rating & Origin */}
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-1 text-luxuryGold">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} size={11} fill="currentColor" />
                    ))}
                    <span className="text-[10px] text-secondaryText ml-1 font-mono">5.0</span>
                  </div>
                  <span className="text-[10px] text-mutedText font-mono uppercase tracking-wider">
                    {product.weightGrams ? `${product.weightGrams}g Harvest` : "Single Origin"}
                  </span>
                </div>

                {/* Product Title */}
                <Link href={`/shop/${product.slug}`}>
                  <h3 className="font-serif text-lg text-primaryText group-hover:text-luxuryGold transition-colors line-clamp-1 mb-2">
                    {product.name}
                  </h3>
                </Link>

                {/* Short Descriptor */}
                <p className="text-secondaryText text-xs leading-relaxed line-clamp-2 font-light mb-4">
                  {product.shortDescription || "Slow-roasted artisanal California reserve almonds sealed for extraordinary flavor depth."}
                </p>
              </div>

              {/* Price & Action Footer */}
              <div className="pt-3 border-t border-divider/60 flex items-center justify-between">
                <div className="flex items-baseline gap-2">
                  <span suppressHydrationWarning className="font-serif text-lg sm:text-xl text-luxuryGold font-medium">
                    {formatPrice(product.salePrice || product.price)}
                  </span>
                  {product.salePrice && product.salePrice < product.price && (
                    <span suppressHydrationWarning className="text-xs text-mutedText line-through font-mono">
                      {formatPrice(product.price)}
                    </span>
                  )}
                </div>

                <Link 
                  href={`/shop/${product.slug}`}
                  className="text-[10px] uppercase tracking-widest text-secondaryText hover:text-luxuryGold transition-colors font-medium"
                >
                  Details &rarr;
                </Link>
              </div>
            </motion.div>
          );
        })}
      </div>

        <div className="mt-12 text-center">
          <Link 
            href="/shop" 
            className="inline-flex items-center gap-3 border border-luxuryGold/40 hover:border-luxuryGold text-luxuryGold px-8 py-3.5 rounded text-xs uppercase tracking-superwide font-medium transition-all duration-300 hover:bg-luxuryGold/10"
          >
            <span>Explore Complete Reserve Catalog</span>
            <span>&rarr;</span>
          </Link>
        </div>
      </div>
    </section>
  );
}
