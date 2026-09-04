"use client";

import { useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import SquirrelLogo from "@/components/ui/SquirrelLogo";
import { Clock, ShieldCheck, Sparkles, Compass } from "lucide-react";

export default function BrandStory() {
  const [activeMilestone, setActiveMilestone] = useState(0);

  const timeline = [
    {
      year: "1988",
      title: "The Orchard Roots",
      subtitle: "San Joaquin Valley, California",
      narrative: "Our journey began along the 36th parallel North in California's fertile Central Valley. Blessed with rich alluvial loam and nurtured by Sierra Nevada snowmelt, our founders dedicated three generations to cultivating the elusive Nonpareil kernel—celebrated for its uniform geometry, paper-thin skin, and naturally sweet, buttery finish.",
      highlight: "Single-Origin Terroir"
    },
    {
      year: "2004",
      title: "The Roasting Vault",
      subtitle: "Artisanal Wood Convection",
      narrative: "Rejecting industrial gas roasting, our master roasters pioneered a low-temperature convection method utilizing cured, reclaimed almond wood. This patient micro-batch discipline gently coaxes out delicate caramelized nuances while locking in essential botanical oils and heart-healthy antioxidants.",
      highlight: "Micro-Batch Craft"
    },
    {
      year: "2018",
      title: "Haute Gifting & Presentation",
      subtitle: "Heirloom Chests & Velvet Liners",
      narrative: "Believing that true luxury engages all five senses, RARE NUTS unveiled its signature presentation suite. Solid polished mahogany boxes, brass mortise-and-tenon joints, and midnight velvet inlays turned fine almond confectionery into the premier host gift and corporate gesture.",
      highlight: "Bespoke Packaging"
    },
    {
      year: "Present",
      title: "The Global Distinction",
      subtitle: "From Orchard to Palate",
      narrative: "Today, RARE NUTS stands at the pinnacle of luxury nut gastronomy. From Michelin-starred culinary partnerships to private collectors across Mumbai, London, Dubai, and New York, our commitment remains unbroken: unhurried provenance, pure ingredients, and timeless elegance.",
      highlight: "RARE NUTS"
    }
  ];

  return (
    <section className="w-full py-24 md:py-32 bg-secondaryBg relative overflow-hidden border-t border-divider">
      {/* Subtle radial ambient glow */}
      <div className="absolute top-1/2 left-0 w-96 h-96 bg-luxuryGold/[0.02] rounded-full blur-3xl pointer-events-none" />

      <div className="site-container">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-20 items-center">
          
          {/* Left Column: Narrative & Interactive Timeline */}
          <motion.div 
            initial={{ opacity: 0, x: -40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
            className="lg:col-span-6 space-y-8 order-2 lg:order-1"
          >
            <div>
              <span className="text-luxuryGold uppercase tracking-ultra text-[10px] font-medium bg-luxuryGold/10 px-3.5 py-1.5 border border-luxuryGold/20 rounded-full inline-block mb-4">
                The Heritage Timeline
              </span>
              <h2 className="text-3xl sm:text-5xl lg:text-6xl font-serif text-primaryText leading-tight">
                A Legacy of Terroir <br />
                <span className="text-luxuryGold italic">& Unhurried Mastery.</span>
              </h2>
            </div>

            {/* Timeline Selector Tabs */}
            <div className="grid grid-cols-4 gap-2 border-b border-divider pb-4 pt-2">
              {timeline.map((item, idx) => (
                <button
                  key={item.year}
                  onClick={() => setActiveMilestone(idx)}
                  className={`text-left p-2 rounded transition-all duration-300 ${
                    activeMilestone === idx 
                      ? "border-b-2 border-luxuryGold bg-surface/80" 
                      : "opacity-60 hover:opacity-100"
                  }`}
                >
                  <span className={`block font-serif text-lg md:text-xl ${activeMilestone === idx ? "text-luxuryGold font-medium" : "text-secondaryText"}`}>
                    {item.year}
                  </span>
                  <span className="block text-[9px] uppercase tracking-wider text-mutedText truncate">
                    {item.highlight}
                  </span>
                </button>
              ))}
            </div>

            {/* Active Milestone Content */}
            <AnimatePresence mode="wait">
              <motion.div
                key={activeMilestone}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -12 }}
                transition={{ duration: 0.4 }}
                className="space-y-4 bg-surface/50 border border-divider/60 rounded-card p-6 md:p-8"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs uppercase tracking-widest text-luxuryGold font-medium">
                    {timeline[activeMilestone].subtitle}
                  </span>
                  <span className="font-mono text-xs text-mutedText flex items-center gap-1.5">
                    <Clock size={12} />
                    {timeline[activeMilestone].year}
                  </span>
                </div>

                <h3 className="text-2xl font-serif text-primaryText">
                  {timeline[activeMilestone].title}
                </h3>

                <p className="text-secondaryText text-sm sm:text-base font-light leading-relaxed">
                  {timeline[activeMilestone].narrative}
                </p>
              </motion.div>
            </AnimatePresence>

            <div className="pt-2 flex flex-wrap items-center gap-4">
              <Link href="/about" className="luxury-button-outline text-xs px-6 py-3 tracking-widest uppercase">
                Explore Full Heritage & Terroir
              </Link>
              <Link href="/shop" className="text-xs uppercase tracking-widest text-secondaryText hover:text-luxuryGold transition-colors font-medium">
                Taste The Harvest &rarr;
              </Link>
            </div>
          </motion.div>

          {/* Right Column: Imagery & Auremont Seal */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 1.1, ease: [0.16, 1, 0.3, 1] }}
            className="lg:col-span-6 order-1 lg:order-2 relative"
          >
            <div className="w-full aspect-[4/3] relative rounded-card border border-divider overflow-hidden group shadow-2xl">
              <Image 
                src="/images/roasted-almonds-jar.png" 
                alt="RARE NUTS Artisanal Roasting Atelier" 
                fill 
                sizes="(max-width: 1024px) 100vw, 50vw"
                className="object-cover group-hover:scale-105 transition-transform duration-[2.5s]"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-background/80 via-transparent to-transparent" />
            </div>

            {/* Floating RARE NUTS Heritage Badge */}
            <div className="absolute -bottom-8 -left-6 md:-left-10 w-48 md:w-56 bg-background/95 backdrop-blur-md border border-luxuryGold/40 rounded-card overflow-hidden p-4 z-10 shadow-[0_20px_50px_rgba(0,0,0,0.8)]">
              <div className="w-full h-full border border-luxuryGold/30 flex flex-col items-center justify-center p-4 text-center bg-secondaryBg/80 rounded">
                <SquirrelLogo size={60} variant="icon" />
                <span className="font-serif text-luxuryGold tracking-[0.25em] text-xs uppercase font-bold mt-3">
                  RARE NUTS
                </span>
                <span className="text-[9px] text-secondaryText tracking-widest uppercase font-mono mt-1">
                  California Reserve · Est. 2024
                </span>
              </div>
            </div>
          </motion.div>
          
        </div>
      </div>
    </section>
  );
}
