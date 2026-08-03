"use client";

import Image from "next/image";
import { motion } from "framer-motion";

export default function LifestyleGallery() {
  const images = [
    "/images/roasted-almonds-jar.png",
    "/images/royal-almonds-wooden-box.png",
    "/images/roasted-almonds-jar.png",
    "/images/royal-almonds-wooden-box.png"
  ];

  return (
    <section className="w-full py-24 md:py-super bg-secondaryBg border-t border-divider overflow-hidden">
      <div className="max-w-[2000px] mx-auto px-6 md:px-12 mb-16 text-center">
        <h4 className="text-luxuryGold uppercase tracking-superwide text-xs mb-4">#AuremontLifestyle</h4>
        <h2 className="text-3xl md:text-4xl font-serif text-primaryText">Follow the Journey</h2>
      </div>

      <div className="flex w-full overflow-hidden space-x-4 px-4 pb-8">
        {images.map((src, idx) => (
          <motion.div 
            key={idx}
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: idx * 0.1, ease: [0.16, 1, 0.3, 1] }}
            className="relative min-w-[250px] md:min-w-[350px] aspect-square flex-shrink-0 group cursor-pointer"
          >
            <Image 
              src={src} 
              alt="Lifestyle Gallery" 
              fill 
              className="object-cover group-hover:scale-105 transition-transform duration-700" 
            />
            <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
              <span className="text-luxuryGold font-serif text-2xl">@Auremont</span>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
