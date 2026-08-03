"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, Star } from "lucide-react";
import AddToCartButton from "@/components/AddToCartButton";

export default function BestSellers({ products }: { products: any[] }) {
  const bestSellers = products.slice(0, 4);
  
  return (
    <section className="w-full py-24 md:py-super px-6 md:px-12 max-w-[2000px] mx-auto bg-secondaryBg relative">
       <div className="flex flex-col items-center text-center mb-16 md:mb-24">
          <h4 className="text-luxuryGold uppercase tracking-superwide text-xs mb-4">Most Coveted</h4>
          <h2 className="text-4xl md:text-5xl font-serif text-primaryText">The Bestsellers</h2>
       </div>
       
       <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {bestSellers.length > 0 ? bestSellers.map((product: any, idx: number) => (
            <motion.div 
              key={product.id} 
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.6, delay: idx * 0.1, ease: [0.16, 1, 0.3, 1] }}
              className="group cursor-pointer flex flex-col"
            >
              <div className="w-full aspect-square relative bg-background overflow-hidden mb-6 border border-divider">
                <Link href={`/shop/${product.slug}`}>
                  <Image 
                    src={product.thumbnailUrl || '/images/california-almonds-250g.png'} 
                    alt={product.name} 
                    fill 
                    className="object-cover group-hover:scale-105 transition-transform duration-[1.5s]"
                  />
                </Link>
                <div className="absolute inset-0 bg-black/40 backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex items-center justify-center pointer-events-none">
                  <div className="pointer-events-auto">
                    <AddToCartButton productId={product.id} className="luxury-button-outline bg-background/50 backdrop-blur-md" />
                  </div>
                </div>
              </div>
              <div className="flex flex-col items-start">
                <div className="flex gap-1 text-luxuryGold mb-2">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} size={10} fill="currentColor" />
                  ))}
                </div>
                <Link href={`/shop/${product.slug}`} className="w-full">
                  <h3 className="font-serif text-xl text-primaryText mb-1 group-hover:text-luxuryGold transition-colors truncate w-full">{product.name}</h3>
                </Link>
                <span className="font-medium text-primaryText mt-2">₹{product.price}</span>
              </div>
            </motion.div>
          )) : (
            <p className="col-span-4 text-center text-mutedText py-12">No products available.</p>
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
