"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, useScroll, useTransform } from "framer-motion";

export default function AboutPage() {
  const [mounted, setMounted] = useState(false);
  
  useEffect(() => {
    setMounted(true);
  }, []);

  const { scrollYProgress } = useScroll();
  const yHero = useTransform(scrollYProgress, [0, 1], ["0%", "50%"]);

  const fadeUp = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: "easeOut" } }
  };

  const staggerContainer = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.2 } }
  };

  if (!mounted) return null;

  return (
    <div className="w-full bg-background min-h-screen overflow-hidden">
      
      {/* Hero Section */}
      <section className="relative h-screen w-full flex items-center justify-center overflow-hidden">
        <motion.div 
          style={{ y: yHero }}
          className="absolute inset-0 w-full h-[120%] -top-[10%]"
        >
          <div className="absolute inset-0 bg-black/40 z-10"></div>
          {/* Using the generated image path assuming user copies it, fallback to default style if missing */}
          <div className="relative w-full h-full">
            <Image 
              src="/images/our_story_orchard.png" 
              alt="Auremont Almond Orchard" 
              fill
              className="object-cover"
              priority
              sizes="100vw"
              onError={(e) => {
                // Fallback if image not found
                e.currentTarget.style.display = 'none';
              }}
            />
            {/* Fallback gradient if image fails to load */}
            <div className="absolute inset-0 bg-gradient-to-tr from-luxuryGold/20 to-background -z-10"></div>
          </div>
        </motion.div>

        <div className="relative z-20 text-center px-6 mt-16">
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.2 }}
            className="text-5xl md:text-7xl lg:text-8xl font-serif text-luxuryGold mb-6 tracking-wide uppercase drop-shadow-lg"
          >
            Our Heritage
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 0.6 }}
            className="text-xl md:text-2xl text-white max-w-2xl mx-auto font-light leading-relaxed drop-shadow-md"
          >
            Discover the legacy and uncompromising craftsmanship behind the world's finest California almonds.
          </motion.p>
        </div>
        
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 1.2 }}
          className="absolute bottom-10 left-1/2 -translate-x-1/2 z-20 flex flex-col items-center gap-2"
        >
          <span className="text-white/70 text-xs uppercase tracking-widest">Scroll</span>
          <div className="w-[1px] h-12 bg-gradient-to-b from-luxuryGold to-transparent"></div>
        </motion.div>
      </section>

      <div className="max-w-6xl mx-auto px-6 py-16 md:py-32 space-y-24 md:space-y-40">
        
        {/* Section 1: The Origin */}
        <motion.section 
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={staggerContainer}
          className="grid md:grid-cols-2 gap-16 items-center"
        >
          <motion.div variants={fadeUp} className="space-y-8 order-2 md:order-1">
            <h2 className="text-4xl md:text-5xl font-serif text-primaryText">Rooted in <span className="text-luxuryGold italic">California Soil</span></h2>
            <div className="space-y-6 text-secondaryText text-lg leading-relaxed font-light">
              <p>
                Founded in the sun-drenched valleys of California, Auremont began with a singular vision: to elevate the humble almond into an unparalleled luxury experience. For over three generations, our family-owned orchards have cultivated a rare varietal of almond, celebrated for its buttery texture, delicate sweetness, and immaculate profile.
              </p>
              <p>
                We believe that true luxury takes time. Our trees are nurtured slowly, watered by Sierra Nevada snowmelt, and harvested at the precise moment of peak maturity.
              </p>
            </div>
          </motion.div>
          <motion.div variants={fadeUp} className="order-1 md:order-2">
            <div className="relative aspect-[4/5] w-full rounded-2xl overflow-hidden shadow-2xl border border-divider">
              <Image 
                src="/images/our_story_orchard.png" 
                alt="California Almond Orchard" 
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 50vw"
              />
            </div>
          </motion.div>
        </motion.section>

        {/* Section 2: Craftsmanship */}
        <motion.section 
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={staggerContainer}
          className="grid md:grid-cols-2 gap-16 items-center"
        >
          <motion.div variants={fadeUp} className="order-1">
            <div className="relative aspect-[4/5] w-full rounded-2xl overflow-hidden shadow-2xl border border-divider">
              <Image 
                src="/images/our_story_craftsmanship.png" 
                alt="Artisanal Almond Roasting" 
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 50vw"
              />
            </div>
          </motion.div>
          <motion.div variants={fadeUp} className="space-y-8 order-2">
            <h2 className="text-4xl md:text-5xl font-serif text-primaryText">The Art of the <span className="text-luxuryGold italic">Roast</span></h2>
            <div className="space-y-6 text-secondaryText text-lg leading-relaxed font-light">
              <p>
                Sourcing the finest almonds is only the beginning. Our master roasters employ proprietary, small-batch roasting techniques passed down through generations. Each batch is roasted slowly over sustainably sourced almond wood, ensuring an even, golden perfection that preserves the nut's essential oils and natural vitality.
              </p>
              <p>
                From the initial sorting to the final dusting of artisanal sea salt, every step of the Auremont process is executed by hand. We reject automation in favor of human intuition and uncompromising craftsmanship.
              </p>
            </div>
          </motion.div>
        </motion.section>

        {/* Section 3: Sustainability */}
        <motion.section 
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={staggerContainer}
          className="grid md:grid-cols-2 gap-16 items-center"
        >
          <motion.div variants={fadeUp} className="space-y-8 order-2 md:order-1">
            <h2 className="text-4xl md:text-5xl font-serif text-primaryText">A Promise to the <span className="text-luxuryGold italic">Earth</span></h2>
            <div className="space-y-6 text-secondaryText text-lg leading-relaxed font-light">
              <p>
                Luxury should never come at the expense of our planet. Auremont operates on a closed-loop sustainability model. We utilize advanced micro-irrigation to conserve water, power our facilities with 100% renewable solar energy, and package our collections in fully recyclable, bespoke materials. 
              </p>
              <p>
                When you choose Auremont, you are choosing a brand that respects the earth as much as it respects the palate.
              </p>
            </div>
            <div className="pt-8">
              <Link href="/shop" className="inline-block border border-luxuryGold text-luxuryGold hover:bg-luxuryGold hover:text-background transition-colors duration-500 px-8 py-4 tracking-widest uppercase text-sm font-medium">
                Explore The Collection
              </Link>
            </div>
          </motion.div>
          <motion.div variants={fadeUp} className="order-1 md:order-2">
            <div className="relative aspect-square w-full rounded-full overflow-hidden shadow-2xl border-4 border-surface p-2 bg-secondaryBg">
              <div className="relative w-full h-full rounded-full overflow-hidden border border-divider">
                <Image 
                  src="/images/our_story_sustainability.png" 
                  alt="Sustainable Agriculture" 
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, 50vw"
                />
              </div>
            </div>
          </motion.div>
        </motion.section>

      </div>
    </div>
  );
}
