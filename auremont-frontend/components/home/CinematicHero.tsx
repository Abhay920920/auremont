"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { motion } from "framer-motion";

export default function CinematicHero() {
  return (
    <section className="relative w-full h-[100vh] flex items-center justify-center overflow-hidden">
      {/* Parallax Background */}
      <div className="absolute inset-0 w-full h-[120%] -top-[10%] -z-10 bg-[#050505]">
        <Image 
          src="/images/royal-almonds-wooden-box.png" 
          alt="Auremont Royal Almonds" 
          fill 
          priority
          className="object-cover opacity-40 animate-image-scale"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/40 to-transparent"></div>
      </div>

      <div className="z-10 flex flex-col items-center text-center px-6 mt-20">
        <div className="overflow-hidden pb-2">
          <motion.h1 
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="text-3xl sm:text-5xl md:text-7xl lg:text-8xl font-serif text-primaryText tracking-tight leading-tight"
          >
            The Art of <span className="text-luxuryGold italic pr-4">Craftsmanship</span>
          </motion.h1>
        </div>
        <div className="overflow-hidden mt-6 mb-12">
          <motion.p 
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            transition={{ duration: 0.8, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
            className="text-lg md:text-xl text-secondaryText max-w-2xl font-light leading-relaxed"
          >
            Discover California's most prestigious almonds. Hand-selected, perfectly roasted, and presented with unparalleled elegance.
          </motion.p>
        </div>
        <div className="overflow-hidden">
          <motion.div
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            transition={{ duration: 0.8, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
          >
            <Link href="/shop" className="luxury-button inline-flex items-center gap-3 group">
              Explore The Collection
              <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
            </Link>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
