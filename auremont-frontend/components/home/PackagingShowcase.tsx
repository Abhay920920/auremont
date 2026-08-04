"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { ShieldCheck, Award } from "lucide-react";

export default function PackagingShowcase() {
  return (
    <section className="w-full py-20 md:py-32 bg-background relative overflow-hidden">
      {/* Section Header */}
      <div className="max-w-[2000px] mx-auto px-6 md:px-12 text-center mb-12 md:mb-20">
        <span className="text-[10px] uppercase tracking-ultra text-luxuryGold font-medium bg-luxuryGold/10 px-3.5 py-1 border border-luxuryGold/20 rounded-full inline-block mb-4">
          Bespoke Presentation
        </span>
        <h2 className="text-3xl sm:text-5xl font-serif text-primaryText tracking-tight">
          Designed for the Discerning
        </h2>
      </div>

      {/* Campaign Feature Grid */}
      <div className="max-w-[2000px] mx-auto px-6 md:px-12 grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-12">
         {/* Feature 1: Mahogany Box */}
         <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="relative aspect-[4/5] sm:aspect-[4/3] md:aspect-[4/5] bg-secondaryBg border border-luxuryGold/30 group overflow-hidden rounded-card shadow-[0_15px_50px_rgba(0,0,0,0.8)]"
         >
           <Image 
             src="/images/royal-almonds-wooden-box.png" 
             alt="Signature Wooden Box" 
             fill 
             className="object-cover opacity-85 group-hover:opacity-100 group-hover:scale-105 transition-all duration-[2s] filter brightness-105"
           />
           <div className="absolute inset-0 bg-gradient-to-t from-background via-background/40 to-transparent flex flex-col justify-end p-6 sm:p-10">
             <div className="flex items-center gap-2 text-luxuryGold mb-2">
               <Award size={16} />
               <span className="text-[9px] uppercase tracking-ultra font-medium">Mahogany Reserve Edition</span>
             </div>
             <h3 className="font-serif text-2xl sm:text-4xl text-primaryText mb-2">Signature Velvet Box</h3>
             <p className="text-secondaryText text-xs sm:text-sm font-light max-w-md leading-relaxed">
               Handcrafted solid mahogany with gold velvet lining. A heirloom statement vessel designed for luxury gifting.
             </p>
           </div>
         </motion.div>

         {/* Feature 2: Classic Jar */}
         <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
            className="relative aspect-[4/5] sm:aspect-[4/3] md:aspect-[4/5] bg-secondaryBg border border-luxuryGold/30 group overflow-hidden rounded-card shadow-[0_15px_50px_rgba(0,0,0,0.8)]"
         >
           <Image 
             src="/images/roasted-almonds-jar.png" 
             alt="Classic Glass Jar" 
             fill 
             className="object-cover opacity-85 group-hover:opacity-100 group-hover:scale-105 transition-all duration-[2s] filter brightness-105"
           />
           <div className="absolute inset-0 bg-gradient-to-t from-background via-background/40 to-transparent flex flex-col justify-end p-6 sm:p-10">
             <div className="flex items-center gap-2 text-luxuryGold mb-2">
               <ShieldCheck size={16} />
               <span className="text-[9px] uppercase tracking-ultra font-medium">UV-Preserved Vessel</span>
             </div>
             <h3 className="font-serif text-2xl sm:text-4xl text-primaryText mb-2">The Classic Reserve Jar</h3>
             <p className="text-secondaryText text-xs sm:text-sm font-light max-w-md leading-relaxed">
               Double-walled UV-protected glass to preserve natural aromatic oils and display the golden roast.
             </p>
           </div>
         </motion.div>
      </div>
    </section>
  );
}
