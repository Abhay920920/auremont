"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowRight, ChevronDown, Sparkles } from "lucide-react";
import { motion } from "framer-motion";

export default function CinematicHero() {
  return (
    <section className="relative w-full h-[100dvh] flex flex-col justify-between overflow-hidden bg-background">
      {/* Background Lighting & Radial Vignette */}
      <div className="absolute inset-0 w-full h-full -z-10 bg-[#050505] overflow-hidden">
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[450px] sm:w-[600px] h-[450px] sm:h-[600px] bg-luxuryGold/15 rounded-full blur-[150px] pointer-events-none animate-pulse-glow" />
        <div className="absolute inset-0 bg-gradient-to-b from-background/90 via-transparent to-background pointer-events-none" />
      </div>

      {/* Top Mobile Magazine Header Bar */}
      <div className="pt-28 px-6 text-center max-w-xl mx-auto z-10 animate-fade-in">
        <motion.div 
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full border border-luxuryGold/40 bg-background/80 backdrop-blur-md mb-3"
        >
          <Sparkles size={12} className="text-luxuryGold" />
          <span className="text-[9px] uppercase tracking-ultra text-luxuryGold font-medium">
            California Reserve Harvest 2026
          </span>
        </motion.div>
        
        <h1 className="text-3xl sm:text-5xl md:text-7xl font-serif text-primaryText tracking-tight leading-[1.05]">
          The Art of <span className="text-luxuryGold italic font-light">Botanical Craft</span>
        </h1>
      </div>

      {/* CENTER: Product Photography Focal Point (70% mobile height focus) */}
      <div className="relative w-full flex-grow flex items-center justify-center my-4 z-10 px-4">
        <motion.div 
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
          className="relative w-full max-w-[340px] sm:max-w-md aspect-[4/5] rounded-card border border-luxuryGold/30 bg-surface/40 backdrop-blur-sm overflow-hidden shadow-[0_20px_60px_rgba(0,0,0,0.8)]"
        >
          <Image 
            src="/images/royal-almonds-wooden-box.png" 
            alt="Auremont Royal Almonds Wooden Vessel" 
            fill 
            priority
            className="object-cover object-center filter brightness-105 contrast-105 transition-transform duration-[2s] hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent opacity-80" />
          
          <div className="absolute bottom-4 left-4 right-4 flex justify-between items-end text-left">
            <div>
              <p className="text-[9px] uppercase tracking-ultra text-luxuryGold font-medium">Limited Edition</p>
              <p className="text-sm font-serif text-primaryText">Velvet Oak Reserve Vessel</p>
            </div>
            <span className="text-xs font-serif text-luxuryGold">₹1,499</span>
          </div>
        </motion.div>
      </div>

      {/* Bottom CTA & Scroll Controls */}
      <div className="pb-8 px-6 text-center z-10 flex flex-col items-center gap-4">
        <Link 
          href="/shop" 
          className="luxury-button w-full sm:w-auto inline-flex items-center justify-center gap-3 px-8 py-4 text-xs tracking-ultra shadow-[0_0_25px_rgba(212,175,55,0.25)] hover:shadow-[0_0_40px_rgba(212,175,55,0.45)] transition-all"
        >
          <span>Explore The Campaign</span>
          <ArrowRight size={14} />
        </Link>

        <div className="flex items-center gap-2 text-[9px] uppercase tracking-ultra text-mutedText pt-2">
          <span>Scroll To Discover</span>
          <ChevronDown size={12} className="text-luxuryGold animate-bounce" />
        </div>
      </div>
    </section>
  );
}
