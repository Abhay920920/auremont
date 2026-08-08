"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { ShieldCheck, Award, Box, Sparkles, PackageCheck } from "lucide-react";

const PACKAGING_EDITIONS = [
  {
    title: "Matte Black Stand-up Pouch",
    subtitle: "Everyday 250g Pouch",
    description: "Resealable triple-layer barrier pouch with metallic gold foil crown logo and botanical almond engraving.",
    image: "/images/california-almonds-250g.png",
    badge: "Air-Tight Foil Barrier",
    icon: PackageCheck
  },
  {
    title: "Glass Preserve Jar",
    subtitle: "Signature 500g Jar",
    description: "Thick clear glass jar with metallic gold screw cap and tactile matte black gold-stamped label.",
    image: "/images/roasted-almonds-jar.png",
    badge: "UV-Protected Vessel",
    icon: ShieldCheck
  },
  {
    title: "Rigid Matte Gift Box",
    subtitle: "Everyday Collection 1kg Box",
    description: "Heavyweight rigid black box featuring debossed gold foil typography and custom interior tray.",
    image: "/images/royal-almonds-wooden-box.png",
    badge: "Rigid Presentation",
    icon: Award
  },
  {
    title: "Transparent Window Pouch",
    subtitle: "Window Edition 250g",
    description: "Features a clear view oval window at the base so you can admire the extra-large California almonds.",
    image: "/images/almonds-pouch-window.png",
    badge: "Clear Sight Window",
    icon: Box
  },
  {
    title: "Grand Luxury Unboxing Box",
    subtitle: "Gift Unboxing Experience",
    description: "Opened magnetic hinged gift box with gold foil lid inscription, black pouch & gold thank-you card.",
    image: "/images/luxury-gift-box-unboxing.png",
    badge: "Unboxing Masterpiece",
    icon: Sparkles
  }
];

export default function PackagingShowcase() {
  return (
    <section className="w-full py-20 md:py-32 bg-background relative overflow-hidden border-t border-b border-divider">
      {/* Section Header */}
      <div className="max-w-[2000px] mx-auto px-6 md:px-12 text-center mb-12 md:mb-20">
        <span className="text-[10px] uppercase tracking-ultra text-luxuryGold font-medium bg-luxuryGold/10 px-3.5 py-1 border border-luxuryGold/20 rounded-full inline-block mb-4">
          Visual Packaging Suite
        </span>
        <h2 className="text-3xl sm:text-5xl font-serif text-primaryText tracking-tight mb-4">
          Crafted for the Discerning
        </h2>
        <p className="text-secondaryText text-sm sm:text-base max-w-2xl mx-auto font-light leading-relaxed">
          Explore our signature matte black and gold foil packaging range—engineered to preserve peak freshness while making an unforgettably luxurious statement.
        </p>
      </div>

      {/* Grid of Packaging Editions */}
      <div className="max-w-[2000px] mx-auto px-6 md:px-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
        {PACKAGING_EDITIONS.map((item, idx) => {
          const IconComp = item.icon;
          return (
            <motion.div 
              key={idx}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.6, delay: idx * 0.1, ease: [0.16, 1, 0.3, 1] }}
              className="relative aspect-[4/5] bg-secondaryBg border border-luxuryGold/30 group overflow-hidden rounded-card shadow-[0_15px_50px_rgba(0,0,0,0.6)]"
            >
              <Image 
                src={item.image} 
                alt={item.title} 
                fill 
                className="object-cover opacity-90 group-hover:opacity-100 group-hover:scale-105 transition-all duration-[1.5s] filter brightness-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-background via-background/40 to-transparent flex flex-col justify-end p-6 sm:p-8">
                <div className="flex items-center gap-2 text-luxuryGold mb-2">
                  <IconComp size={16} />
                  <span className="text-[9px] uppercase tracking-ultra font-medium">{item.badge}</span>
                </div>
                <h3 className="font-serif text-xl sm:text-2xl text-primaryText mb-1">{item.title}</h3>
                <p className="text-[11px] uppercase tracking-wider text-luxuryGold font-mono mb-2">{item.subtitle}</p>
                <p className="text-secondaryText text-xs font-light leading-relaxed line-clamp-3">
                  {item.description}
                </p>
              </div>
            </motion.div>
          );
        })}

        {/* 6th Card: Full Collection Overview Banner */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{ duration: 0.6, delay: 0.5, ease: [0.16, 1, 0.3, 1] }}
          className="relative aspect-[4/5] bg-secondaryBg border border-luxuryGold/50 group overflow-hidden rounded-card shadow-[0_15px_50px_rgba(0,0,0,0.6)]"
        >
          <Image 
            src="/images/rarenuts-packaging-showcase.png" 
            alt="RARE NUTS Packaging Suite Showcase" 
            fill 
            className="object-cover opacity-80 group-hover:opacity-100 group-hover:scale-105 transition-all duration-[1.5s] filter brightness-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-background via-background/60 to-transparent flex flex-col justify-end p-6 sm:p-8">
            <div className="flex items-center gap-2 text-luxuryGold mb-2">
              <Sparkles size={16} />
              <span className="text-[9px] uppercase tracking-ultra font-medium">Complete Brand Vision</span>
            </div>
            <h3 className="font-serif text-xl sm:text-2xl text-primaryText mb-1">RARE NUTS Packaging Suite</h3>
            <p className="text-[11px] uppercase tracking-wider text-luxuryGold font-mono mb-2">10-Shot Photography Collage</p>
            <p className="text-secondaryText text-xs font-light leading-relaxed">
              Every detail—from the tactile dewy texture to the custom gold foil leaf work—reflects our commitment to uncompromising elegance.
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

