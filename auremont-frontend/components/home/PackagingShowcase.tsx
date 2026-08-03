"use client";

import Image from "next/image";
import { motion } from "framer-motion";

export default function PackagingShowcase() {
  return (
    <section className="w-full py-24 md:py-super bg-background relative overflow-hidden">
      <div className="max-w-[2000px] mx-auto px-6 md:px-12 text-center mb-16 md:mb-24">
        <h4 className="text-luxuryGold uppercase tracking-superwide text-xs mb-4">The Presentation</h4>
        <h2 className="text-4xl md:text-5xl font-serif text-primaryText">Designed for the Discerning</h2>
      </div>

      <div className="max-w-[2000px] mx-auto px-6 md:px-12 grid grid-cols-1 md:grid-cols-2 gap-4">
         <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="relative aspect-square md:aspect-[4/5] bg-secondaryBg border border-divider group overflow-hidden"
         >
           <Image 
             src="/images/royal-almonds-wooden-box.png" 
             alt="Signature Wooden Box" 
             fill 
             className="object-cover opacity-80 group-hover:opacity-100 group-hover:scale-105 transition-all duration-[2s]"
           />
           <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent flex flex-col justify-end p-12">
             <h3 className="font-serif text-3xl text-primaryText mb-3">Signature Wooden Box</h3>
             <p className="text-secondaryText font-light max-w-sm">Handcrafted mahogany finish, lined with velvet. A true statement of elegance.</p>
           </div>
         </motion.div>

         <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
            className="relative aspect-square md:aspect-[4/5] bg-secondaryBg border border-divider group overflow-hidden"
         >
           <Image 
             src="/images/roasted-almonds-jar.png" 
             alt="Classic Glass Jar" 
             fill 
             className="object-cover opacity-80 group-hover:opacity-100 group-hover:scale-105 transition-all duration-[2s]"
           />
           <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent flex flex-col justify-end p-12">
             <h3 className="font-serif text-3xl text-primaryText mb-3">The Classic Jar</h3>
             <p className="text-secondaryText font-light max-w-sm">Thick, UV-protected glass to preserve freshness and display the golden roast.</p>
           </div>
         </motion.div>
      </div>
    </section>
  );
}
