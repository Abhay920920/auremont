"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowRight, ChevronDown } from "lucide-react";
import { motion } from "framer-motion";

export default function CinematicHero() {
  return (
    <section className="relative w-full h-[100dvh] flex items-center justify-center overflow-hidden bg-background">
      {/* Background Product Lighting & Ambient Glow */}
      <div className="absolute inset-0 w-full h-full -z-10 bg-[#050505] overflow-hidden">
        {/* Subtle Ambient Gold Lighting Spheres */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[500px] h-[500px] bg-luxuryGold/10 rounded-full blur-[140px] pointer-events-none animate-pulse-glow" />
        <div className="absolute bottom-10 right-1/4 w-[350px] h-[350px] bg-goldDark/10 rounded-full blur-[120px] pointer-events-none" />

        {/* Hero Background Image */}
        <Image 
          src="/images/royal-almonds-wooden-box.png" 
          alt="Auremont Royal Almonds Reserve Edition" 
          fill 
          priority
          className="object-cover object-center opacity-30 animate-image-scale scale-105 filter brightness-[0.85] contrast-[1.1]"
        />

        {/* Multi-layered Vignette Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/40 to-background/60" />
        <div className="absolute inset-0 bg-radial-vignette opacity-70 pointer-events-none" />
      </div>

      {/* Main Editorial Hero Content */}
      <div className="z-10 flex flex-col items-center text-center px-6 max-w-5xl mx-auto mt-12">
        {/* Prestige Heritage Badge */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
          className="inline-flex items-center gap-3 px-4 py-1.5 rounded-full border border-luxuryGold/30 bg-background/60 backdrop-blur-md mb-8"
        >
          <span className="w-1.5 h-1.5 rounded-full bg-luxuryGold animate-ping" />
          <span className="text-[10px] uppercase tracking-ultra text-luxuryGold font-medium">
            California Reserve 2026 · Limited Harvest
          </span>
        </motion.div>

        {/* Headline */}
        <div className="overflow-hidden pb-2 mb-6">
          <motion.h1 
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            transition={{ duration: 1, ease: [0.16, 1, 0.3, 1], delay: 0.1 }}
            className="text-4xl sm:text-6xl md:text-8xl lg:text-[100px] font-serif text-primaryText tracking-tight leading-[0.95] drop-shadow-2xl"
          >
            The Pinnacle of <br className="hidden sm:inline" />
            <span className="text-luxuryGold italic font-light pr-2">Botanical Craft</span>
          </motion.h1>
        </div>

        {/* Supporting Copy */}
        <div className="overflow-hidden mb-12">
          <motion.p 
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            transition={{ duration: 1, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
            className="text-sm sm:text-base md:text-lg text-secondaryText max-w-xl font-light leading-relaxed tracking-wide"
          >
            Hand-selected Extra Large California Almonds, slow-roasted to peak crispness and presented in bespoke handcrafted wooden vessels.
          </motion.p>
        </div>

        {/* Primary Luxury CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
          className="flex flex-col sm:flex-row items-center gap-4"
        >
          <Link 
            href="/shop" 
            className="luxury-button inline-flex items-center gap-4 group px-10 py-5 text-xs tracking-ultra shadow-[0_0_30px_rgba(212,175,55,0.2)] hover:shadow-[0_0_45px_rgba(212,175,55,0.4)] transition-all"
          >
            <span>Explore The Collection</span>
            <ArrowRight size={15} className="group-hover:translate-x-1.5 transition-transform duration-300" />
          </Link>
        </motion.div>
      </div>

      {/* Scroll Down Indicator */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.8, duration: 1 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 cursor-pointer z-10"
      >
        <span className="text-[9px] uppercase tracking-ultra text-mutedText font-light">Scroll to Discover</span>
        <ChevronDown size={14} className="text-luxuryGold animate-bounce" />
      </motion.div>
    </section>
  );
}
