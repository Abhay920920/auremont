"use client";

import { motion } from "framer-motion";
import { ShieldCheck, Leaf, Hexagon, Sparkles, Award } from "lucide-react";

export default function WhyAuremont() {
  const pillars = [
    {
      badge: "ORIGIN 36°N · CENTRAL VALLEY",
      icon: <Leaf size={28} strokeWidth={1.2} />,
      title: "Single-Origin California Reserve",
      description: "Cultivated in the sun-drenched alluvial soils of California's Central Valley, irrigated by pure Sierra Nevada snowmelt. We harvest exclusively Extra Large Nonpareil kernels recognized for their silky skin, uniform golden hue, and delicate natural sweetness.",
      metric: "Top 1% Global Crop"
    },
    {
      badge: "ARTISANAL SLOW ROAST",
      icon: <ShieldCheck size={28} strokeWidth={1.2} />,
      title: "Cured Almond-Wood Slow Roast",
      description: "Our roasting atelier employs slow convective roasting over reclaimed almond-wood embers. By avoiding flash-roasting, we preserve volatile aromatic nutrient oils while cultivating an unmatched, buttery crunch that resonates with every kernel.",
      metric: "Small-Batch Micro Roasts"
    },
    {
      badge: "VAULT SEAL · ZERO AIR EXPOSURE",
      icon: <Hexagon size={28} strokeWidth={1.2} />,
      title: "Bespoke Heirloom Packaging",
      description: "Hermetically sealed in UV-filtering double-walled amber glass jars, velvet-lined solid mahogany chests, and nitrogen-flushed embossed matte pouches to lock in garden-fresh vitality and prevent oxidative flavor degradation.",
      metric: "100% Aroma Locked"
    }
  ];

  const certifications = [
    "Certified Non-GMO Project",
    "Zero Artificial Additives",
    "100% Traceable Single-Origin",
    "Fair Farm Stewardship",
    "USDA Botanical Grade 1"
  ];

  return (
    <section className="w-full py-20 md:py-32 bg-background border-y border-divider relative overflow-hidden">
      {/* Subtle background glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] bg-luxuryGold/[0.02] rounded-full blur-3xl pointer-events-none" />

      <div className="site-container relative z-10">
        <div className="text-center mb-16 md:mb-20">
          <span className="text-[10px] uppercase tracking-ultra text-luxuryGold font-medium bg-luxuryGold/10 px-4 py-1.5 border border-luxuryGold/20 rounded-full inline-block mb-4">
            Botanical Standards & Terroir
          </span>
          <h2 className="text-3xl sm:text-5xl lg:text-6xl font-serif text-primaryText tracking-tight mb-4">
            The RARE NUTS Distinction
          </h2>
          <p className="text-secondaryText text-sm sm:text-base max-w-2xl mx-auto font-light leading-relaxed">
            Where ancestral orchard mastery meets uncompromising modern refinement. Every almond is a testament to patient terroir and master confectionery craft.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-10 mb-16">
          {pillars.map((pillar, idx) => (
            <motion.div 
              key={idx}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.8, delay: idx * 0.15, ease: [0.16, 1, 0.3, 1] }}
              className="flex flex-col justify-between p-8 md:p-10 bg-secondaryBg/80 backdrop-blur-sm border border-divider hover:border-luxuryGold/50 rounded-card shadow-[0_10px_35px_rgba(0,0,0,0.6)] group transition-all duration-500 relative"
            >
              <div>
                <div className="flex items-center justify-between mb-8">
                  <span className="text-[9px] uppercase tracking-widest text-luxuryGold font-medium">
                    {pillar.badge}
                  </span>
                  <span className="text-[9px] uppercase tracking-wider text-mutedText border border-divider px-2.5 py-0.5 rounded-full">
                    {pillar.metric}
                  </span>
                </div>

                <div className="text-luxuryGold mb-6 group-hover:scale-110 transition-transform duration-500 bg-surface w-16 h-16 rounded-full flex items-center justify-center border border-divider group-hover:border-luxuryGold/40">
                  {pillar.icon}
                </div>

                <h3 className="font-serif text-xl sm:text-2xl text-primaryText mb-4 group-hover:text-luxuryGold transition-colors">
                  {pillar.title}
                </h3>

                <p className="text-secondaryText text-xs sm:text-sm leading-relaxed font-light">
                  {pillar.description}
                </p>
              </div>

              <div className="mt-8 pt-6 border-t border-divider/60 flex items-center gap-2 text-luxuryGold text-xs font-mono">
                <Sparkles size={12} />
                <span className="tracking-widest uppercase text-[10px]">RARE NUTS Certified</span>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Certifications ticker / ribbon */}
        <div className="border border-divider/60 bg-surface/50 rounded-card py-6 px-6 sm:px-12 flex flex-wrap items-center justify-center gap-6 sm:gap-12">
          {certifications.map((item, i) => (
            <div key={i} className="flex items-center gap-2 text-secondaryText text-xs font-light tracking-wide">
              <Award size={14} className="text-luxuryGold flex-shrink-0" />
              <span>{item}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
