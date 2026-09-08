"use client";

import Image from "next/image";
import { motion } from "framer-motion";

export default function LifestyleGallery() {
  const images = [
    { src: "/images/roasted-almonds-jar.png", alt: "RARE NUTS roasted almonds in a glass preserve jar" },
    { src: "/images/royal-almonds-wooden-box.png", alt: "RARE NUTS royal almonds presented in a wooden gift box" },
    { src: "/images/roasted-almonds-jar.png", alt: "Close-up of slow-roasted California almonds in signature jar" },
    { src: "/images/royal-almonds-wooden-box.png", alt: "RARE NUTS luxury wooden box lifestyle arrangement" },
  ];

  return (
    <section className="w-full py-24 md:py-super bg-secondaryBg border-t border-divider overflow-hidden">
      <div className="site-container mb-16 text-center">
        <p className="text-luxuryGold uppercase tracking-superwide text-xs mb-4">#RareNutsLifestyle</p>
        <h2 className="text-3xl md:text-4xl font-serif text-primaryText">Follow the Journey</h2>
      </div>

      <div className="flex w-full overflow-hidden space-x-4 px-4 pb-8">
        {images.map((item, idx) => (
          <motion.div 
            key={idx}
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: idx * 0.1, ease: [0.16, 1, 0.3, 1] }}
            className="relative min-w-[250px] md:min-w-[350px] aspect-square flex-shrink-0 group cursor-pointer overflow-hidden border border-divider/50 bg-secondaryBg"
          >
            <Image 
              src={item.src} 
              alt={item.alt} 
              fill 
              sizes="(max-width: 768px) 250px, 350px"
              className="object-cover group-hover:scale-105 transition-transform duration-700" 
            />
          </motion.div>
        ))}
      </div>
    </section>
  );
}
