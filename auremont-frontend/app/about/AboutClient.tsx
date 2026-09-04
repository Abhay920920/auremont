"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, useScroll, useTransform } from "framer-motion";
import SquirrelLogo from "@/components/ui/SquirrelLogo";
import { ShieldCheck, Sun, Droplets, Sparkles } from "lucide-react";

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: "easeOut" } }
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.2 } }
};

export default function AboutClient() {
  const { scrollYProgress } = useScroll();
  const yHero = useTransform(scrollYProgress, [0, 1], ["0%", "40%"]);

  return (
    <div className="w-full bg-background min-h-screen overflow-hidden text-primaryText">
      
      {/* Hero Section */}
      <section className="relative h-[85vh] sm:h-screen w-full flex items-center justify-center overflow-hidden">
        <motion.div 
          style={{ y: yHero }}
          className="absolute inset-0 w-full h-[120%] -top-[10%]"
        >
          <div className="absolute inset-0 bg-black/60 z-10" />
          <div className="relative w-full h-full">
            <Image 
              src="/images/our_story_orchard.png" 
              alt="RARE NUTS California Almond Orchards" 
              fill
              className="object-cover"
              priority
              sizes="100vw"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-background via-black/40 to-transparent z-10" />
          </div>
        </motion.div>

        <div className="relative z-20 text-center px-6 mt-16 max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8 }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-luxuryGold/30 bg-background/60 backdrop-blur-md text-luxuryGold text-xs uppercase tracking-ultra mb-6"
          >
            <Sparkles size={12} />
            <span>RARE NUTS · Terroir & Heritage</span>
          </motion.div>

          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.2 }}
            className="text-4xl sm:text-6xl md:text-7xl lg:text-8xl font-serif text-primaryText mb-6 tracking-wide drop-shadow-2xl"
          >
            The Pursuit of <br />
            <span className="text-luxuryGold italic">Botanical Perfection</span>
          </motion.h1>

          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 0.5 }}
            className="text-base sm:text-xl text-secondaryText max-w-2xl mx-auto font-light leading-relaxed"
          >
            From the sun-drenched alluvial soil of California to velvet-lined mahogany presentation chests, discover how RARE NUTS redefined the artisanal almond experience.
          </motion.p>
        </div>
        
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 1.1 }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20 flex flex-col items-center gap-2"
        >
          <span className="text-luxuryGold/70 text-[10px] uppercase tracking-widest font-mono">Scroll to Explore</span>
          <div className="w-[1px] h-10 bg-gradient-to-b from-luxuryGold to-transparent" />
        </motion.div>
      </section>

      {/* Core Body Container */}
      <div className="site-container py-20 md:py-32 space-y-28 md:space-y-40">
        
        {/* Section 1: The Origin & California Terroir */}
        <motion.section 
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={staggerContainer}
          className="grid md:grid-cols-2 gap-12 md:gap-16 items-center"
        >
          <motion.div variants={fadeUp} className="space-y-6 order-2 md:order-1">
            <div className="flex items-center gap-2 text-luxuryGold text-xs uppercase tracking-widest font-mono">
              <Sun size={14} />
              <span>Chapter I · The Terroir</span>
            </div>
            <h2 className="text-3xl md:text-5xl font-serif text-primaryText leading-tight">
              Rooted in the <br />
              <span className="text-luxuryGold italic">San Joaquin Alluvium</span>
            </h2>
            <div className="space-y-4 text-secondaryText text-sm sm:text-base leading-relaxed font-light">
              <p>
                Along California’s 36th parallel North lies one of the planet's rare Mediterranean agricultural microclimates. Here, rich alluvial soils deposited over millennia meet dry, radiant summer heat and pure snowmelt channeled directly from the High Sierra Nevada mountains.
              </p>
              <p>
                In these conditions, our orchards cultivate the celebrated <strong>Nonpareil varietal</strong>—widely regarded by horticulturists as the crown jewel of almonds. Yielding an extra-large, smooth kernel with delicate golden skin and concentrated natural sweetness, every harvest represents the top 1% of the global almond crop.
              </p>
            </div>
            <div className="pt-2 flex items-center gap-8 border-t border-divider/60">
              <div>
                <span className="block font-serif text-2xl text-luxuryGold">36°N</span>
                <span className="text-[10px] uppercase tracking-widest text-mutedText">Latitude Origin</span>
              </div>
              <div className="w-[1px] h-8 bg-divider" />
              <div>
                <span className="block font-serif text-2xl text-luxuryGold">100%</span>
                <span className="text-[10px] uppercase tracking-widest text-mutedText">Single-Origin Traceable</span>
              </div>
              <div className="w-[1px] h-8 bg-divider" />
              <div>
                <span className="block font-serif text-2xl text-luxuryGold">Top 1%</span>
                <span className="text-[10px] uppercase tracking-widest text-mutedText">Grade Selection</span>
              </div>
            </div>
          </motion.div>

          <motion.div variants={fadeUp} className="order-1 md:order-2">
            <div className="relative aspect-[4/5] w-full rounded-card overflow-hidden shadow-2xl border border-divider group">
              <Image 
                src="/images/our_story_orchard.png" 
                alt="California Almond Orchard under Mediterranean Sun" 
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-1000"
                sizes="(max-width: 768px) 100vw, 50vw"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-background/70 via-transparent to-transparent" />
              <div className="absolute bottom-6 left-6 right-6 p-4 bg-secondaryBg/90 backdrop-blur-md rounded border border-divider/80">
                <p className="text-xs text-secondaryText font-light italic">
                  &ldquo;San Joaquin Valley — where optimal diurnal temperature shifts concentrate the almond&apos;s natural volatile oils.&rdquo;
                </p>
              </div>
            </div>
          </motion.div>
        </motion.section>

        {/* Section 2: Craftsmanship & Wood Convection Roasting */}
        <motion.section 
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={staggerContainer}
          className="grid md:grid-cols-2 gap-12 md:gap-16 items-center"
        >
          <motion.div variants={fadeUp} className="order-1">
            <div className="relative aspect-[4/5] w-full rounded-card overflow-hidden shadow-2xl border border-divider group">
              <Image 
                src="/images/our_story_craftsmanship.png" 
                alt="Artisanal Convective Almond Roasting" 
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-1000"
                sizes="(max-width: 768px) 100vw, 50vw"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-background/70 via-transparent to-transparent" />
              <div className="absolute bottom-6 left-6 right-6 p-4 bg-secondaryBg/90 backdrop-blur-md rounded border border-divider/80">
                <p className="text-xs text-secondaryText font-light italic">
                  &ldquo;Gentle convection over cured almond-wood embers coaxes out buttery depths without scorching delicate botanical nutrients.&rdquo;
                </p>
              </div>
            </div>
          </motion.div>

          <motion.div variants={fadeUp} className="space-y-6 order-2">
            <div className="flex items-center gap-2 text-luxuryGold text-xs uppercase tracking-widest font-mono">
              <ShieldCheck size={14} />
              <span>Chapter II · The Atelier</span>
            </div>
            <h2 className="text-3xl md:text-5xl font-serif text-primaryText leading-tight">
              The Alchemy of the <br />
              <span className="text-luxuryGold italic">Artisanal Roast</span>
            </h2>
            <div className="space-y-4 text-secondaryText text-sm sm:text-base leading-relaxed font-light">
              <p>
                Industrial processors subject nuts to intense flash-frying in generic vegetable oils, destroying nutritional integrity and muting nuanced terroir. At RARE NUTS, our atelier practices an ancient discipline: gentle, small-batch convective roasting.
              </p>
              <p>
                Using cured prunings of reclaimed almond wood, our master roasters apply a calibrated temperature curve that takes three times longer than commercial methods. This patient heat activates subtle Maillard caramelization, creates an airy snap of crunch, and seals in essential omega fatty acids and vitamin E.
              </p>
              <p>
                Each batch is seasoned only after roasting, kissed with mineral-rich hand-harvested Fleur de Sel, Kashmiri saffron strands, or gentle rosemary smoke before vacuum sealing.
              </p>
            </div>
            <div className="pt-2">
              <Link href="/shop" className="luxury-button-outline text-xs px-6 py-3 tracking-widest uppercase">
                Discover The Roasts
              </Link>
            </div>
          </motion.div>
        </motion.section>

        {/* Section 3: Sustainability & Closed-Loop Stewardship */}
        <motion.section 
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={staggerContainer}
          className="grid md:grid-cols-2 gap-12 md:gap-16 items-center"
        >
          <motion.div variants={fadeUp} className="space-y-6 order-2 md:order-1">
            <div className="flex items-center gap-2 text-luxuryGold text-xs uppercase tracking-widest font-mono">
              <Droplets size={14} />
              <span>Chapter III · Responsibility</span>
            </div>
            <h2 className="text-3xl md:text-5xl font-serif text-primaryText leading-tight">
              A Living Pact with <br />
              <span className="text-luxuryGold italic">The Earth</span>
            </h2>
            <div className="space-y-4 text-secondaryText text-sm sm:text-base leading-relaxed font-light">
              <p>
                True luxury must leave the soil richer than it was found. Our orchards operate on a strict closed-loop sustainability paradigm:
              </p>
              <ul className="space-y-3 pt-2 text-sm">
                <li className="flex items-start gap-3">
                  <span className="text-luxuryGold mt-1">&#10003;</span>
                  <span><strong>Precision Micro-Drip Irrigation:</strong> Sensor-driven root hydration reduces water utilization by over 42% compared to conventional flooding.</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-luxuryGold mt-1">&#10003;</span>
                  <span><strong>100% Solar-Powered Operations:</strong> Roasting facilities and packaging ateliérs operate completely off on-site clean solar grids.</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-luxuryGold mt-1">&#10003;</span>
                  <span><strong>Zero Waste Biomass:</strong> Almond hulls are converted to organic dairy feed, while tree prunings replenish orchard soil or fuel the roasters.</span>
                </li>
              </ul>
            </div>
            <div className="pt-4">
              <Link href="/contact" className="text-xs uppercase tracking-widest text-secondaryText hover:text-luxuryGold transition-colors font-medium">
                Inquire About Our Sustainability Charter &rarr;
              </Link>
            </div>
          </motion.div>

          <motion.div variants={fadeUp} className="order-1 md:order-2">
            <div className="relative aspect-square w-full rounded-card overflow-hidden shadow-2xl border border-divider group">
              <Image 
                src="/images/our_story_sustainability.png" 
                alt="Sustainable Agroforestry and Solar Orchards" 
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-1000"
                sizes="(max-width: 768px) 100vw, 50vw"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-background/70 via-transparent to-transparent" />
            </div>
          </motion.div>
        </motion.section>

        {/* Section 4: Brand Seal & Heritage Emblem */}
        <motion.section
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={fadeUp}
          className="text-center py-16 border-t border-divider flex flex-col items-center justify-center space-y-6 bg-secondaryBg/40 rounded-card p-8 md:p-16 border"
        >
          <SquirrelLogo size={80} variant="full" />
          <div className="max-w-xl space-y-3">
            <h3 className="font-serif text-2xl sm:text-3xl text-primaryText">
              The Seal of RARE NUTS
            </h3>
            <p className="text-secondaryText text-sm sm:text-base font-light italic leading-relaxed">
              &ldquo;Every kernel that bears our emblem has passed through twenty hands, four sorting grades, and one unyielding standard: perfection or nothing.&rdquo;
            </p>
            <p className="text-luxuryGold text-xs uppercase tracking-ultra font-mono pt-2">
              California Reserve · Est. 2024
            </p>
          </div>
          <div className="pt-4 flex items-center gap-4">
            <Link href="/shop" className="luxury-button text-xs px-8 py-3.5 tracking-widest uppercase font-medium">
              Explore The Catalog
            </Link>
            <Link href="/corporate-gifts" className="luxury-button-outline text-xs px-8 py-3.5 tracking-widest uppercase font-medium">
              Corporate Gifting
            </Link>
          </div>
        </motion.section>

      </div>
    </div>
  );
}
