"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, Star } from "lucide-react";
import AddToCartButton from "@/components/AddToCartButton";
import { useCurrencyStore } from "@/store/currencyStore";

export default function BestSellers({ products }: { products: any[] }) {
  const bestSellers = products.slice(0, 4);
  const formatPrice = useCurrencyStore((state) => state.formatPrice);
  
  return (
    <section className="w-full py-20 md:py-32 px-6 md:px-12 max-w-[2000px] mx-auto bg-secondaryBg border-t border-divider relative">
       <div className="flex flex-col items-center text-center mb-12 md:mb-20">
          <span className="text-[10px] uppercase tracking-ultra text-luxuryGold font-medium bg-luxuryGold/10 px-3.5 py-1 border border-luxuryGold/20 rounded-full inline-block mb-3">
            Most Coveted
          </span>
          <h2 className="text-3xl sm:text-5xl font-serif text-primaryText tracking-tight">The Reserve Editions</h2>
       </div>
       
       <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-8">
          {bestSellers.length > 0 ? bestSellers.map((product: any, idx: number) => (
            <motion.div 
              key={product.id} 
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.6, delay: idx * 0.1, ease: [0.16, 1, 0.3, 1] }}
              className="group cursor-pointer flex flex-col h-full bg-background border border-divider hover:border-luxuryGold/40 transition-all rounded-card p-3"
            >
              <div className="w-full aspect-[4/5] relative bg-secondaryBg overflow-hidden mb-3 border border-divider">
                <Link href={`/shop/${product.slug}`}>
                  <Image 
                    src={product.thumbnailUrl || '/images/california-almonds-250g.png'} 
                    alt={product.name} 
                    fill 
                    className="object-cover group-hover:scale-105 transition-transform duration-[1.5s] filter brightness-105"
                  />
                </Link>
                <div className="absolute inset-0 bg-black/40 backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex items-center justify-center pointer-events-none">
                  <div className="pointer-events-auto">
                    <AddToCartButton productId={product.id} className="luxury-button-outline bg-background/50 backdrop-blur-md text-[10px] px-4 py-2" />
                  </div>
                </div>
              </div>
              <div className="flex flex-col flex-grow justify-between text-left">
                <div>
                  <div className="flex gap-0.5 text-luxuryGold mb-1">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} size={10} fill="currentColor" />
                    ))}
                  </div>
                  <Link href={`/shop/${product.slug}`}>
                    <h3 className="font-serif text-sm sm:text-xl text-primaryText mb-1 group-hover:text-luxuryGold transition-colors line-clamp-2">{product.name}</h3>
                  </Link>
                </div>
                
                <div className="pt-2 border-t border-divider/60 flex items-center justify-between mt-2">
                  <span suppressHydrationWarning className="font-medium text-xs sm:text-base text-primaryText">{formatPrice(product.price)}</span>
                  <span className="text-[9px] uppercase tracking-wider text-luxuryGold">Bestseller</span>
                </div>
              </div>
            </motion.div>
          )) : (
            <p className="col-span-4 text-center text-mutedText py-12 text-xs">No products available.</p>
          )}
       </div>

       <div className="mt-16 flex justify-center">
         <Link href="/shop?sort=bestselling" className="luxury-button-outline">
           View All Bestsellers
         </Link>
       </div>
    </section>
  );
}
