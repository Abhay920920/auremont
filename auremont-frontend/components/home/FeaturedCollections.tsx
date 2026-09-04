"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import AddToCartButton from "@/components/AddToCartButton";
import { useCurrencyStore } from "@/store/currencyStore";
import { ArrowRight } from "lucide-react";

export default function FeaturedCollections({ products }: { products?: any[] }) {
  const featured = (products || []).slice(0, 3);
  const { formatPrice } = useCurrencyStore();
  
  return (
    <section className="w-full py-16 sm:py-20 md:py-32 bg-background relative z-10">
      <div className="site-container">
        {/* Section Header: Clean Left-Aligned on Mobile, Spaced on Desktop */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4 mb-10 md:mb-16">
          <div className="max-w-xl text-left">
            <h4 className="text-luxuryGold uppercase tracking-superwide text-xs mb-2.5 sm:mb-3">
              Curated Selection
            </h4>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-serif text-primaryText tracking-tight">
              Signature Creations
            </h2>
          </div>
          <Link href="/shop" className="hidden md:inline-flex luxury-link text-xs tracking-superwide uppercase text-primaryText pb-1">
            View Entire Collection
          </Link>
        </div>
       
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12">
          {featured.length > 0 ? featured.map((product: any, idx: number) => (
            <motion.div 
              key={product.id} 
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.7, delay: idx * 0.1, ease: [0.16, 1, 0.3, 1] }}
              className="group cursor-pointer flex flex-col"
            >
              <div className="w-full aspect-[4/5] relative bg-secondaryBg overflow-hidden mb-6 sm:mb-8 border border-divider">
                <Link href={`/shop/${product.slug}`} className="relative block w-full h-full">
                  <Image 
                    src={product.thumbnailUrl || '/images/california-almonds-250g.png'} 
                    alt={product.name} 
                    fill 
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 33vw, 33vw"
                    className="object-cover group-hover:scale-105 transition-transform duration-[1.2s] ease-[cubic-bezier(0.25,1,0.5,1)]"
                  />
                </Link>
                <div className="absolute inset-0 bg-black/40 backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center pointer-events-none">
                  <div className="pointer-events-auto">
                    <AddToCartButton productId={product.id} product={product} className="luxury-button-outline bg-background/50 backdrop-blur-md" />
                  </div>
                </div>
              </div>
              <div className="flex flex-col items-center text-center">
                <Link href={`/shop/${product.slug}`}>
                  <h3 className="font-serif text-xl sm:text-2xl text-primaryText mb-1.5 group-hover:text-luxuryGold transition-colors">{product.name}</h3>
                </Link>
                <p className="text-xs text-secondaryText tracking-superwide uppercase mb-3">{product.weightGrams || 250}G</p>
                <span suppressHydrationWarning className="font-medium text-primaryText">{formatPrice(product.price)}</span>
              </div>
            </motion.div>
          )) : (
            <p className="col-span-3 text-center text-mutedText py-12">Products will appear here once connected to the backend.</p>
          )}
        </div>

        {/* Mobile-Only CTA to View Full Collection */}
        <div className="mt-10 text-center md:hidden">
          <Link href="/shop" className="luxury-button text-xs py-3.5 px-8 inline-flex items-center justify-center gap-2 w-full sm:w-auto">
            <span>Explore All Creations</span>
            <ArrowRight size={14} />
          </Link>
        </div>
      </div>
    </section>
  );
}
