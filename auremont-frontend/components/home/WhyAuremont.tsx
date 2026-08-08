"use client";

import { motion } from "framer-motion";
import { ShieldCheck, Leaf, Hexagon } from "lucide-react";

export default function WhyAuremont() {
  const reasons = [
    {
      badge: "ORIGIN 36°N",
      icon: <Leaf size={28} strokeWidth={1} />,
      title: "100% California Sun-Drenched Harvest",
      description: "Cultivated in the rich soils of the Central Valley under optimal Mediterranean climate conditions, yielding Extra Large Nonpareil kernels."
    },
    {
      badge: "CRAFT ROAST",
      icon: <ShieldCheck size={28} strokeWidth={1} />,
      title: "Masterfully Slow-Roasting",
      description: "Our small-batch roasting preserves essential natural nutrient oils while developing crisp, buttery aromatic depth."
    },
    {
      badge: "VAULT SEAL",
      icon: <Hexagon size={28} strokeWidth={1} />,
      title: "Bespoke Heirloom Packaging",
      description: "Hermetically sealed in double-walled glass jars and velvet-lined mahogany boxes to lock in pristine garden freshness."
    }
  ];

  return (
    <section className="w-full py-20 md:py-32 px-6 md:px-12 bg-background border-y border-divider relative">
      <div className="max-w-[1400px] mx-auto">
        <div className="text-center mb-16">
          <span className="text-[10px] uppercase tracking-ultra text-luxuryGold font-medium bg-luxuryGold/10 px-3.5 py-1 border border-luxuryGold/20 rounded-full inline-block mb-3">
            Botanical Standards
          </span>
          <h2 className="text-3xl sm:text-5xl font-serif text-primaryText tracking-tight">
            The RARE NUTS Distinction
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12">
          {reasons.map((reason, idx) => (
            <motion.div 
              key={idx}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.8, delay: idx * 0.15, ease: [0.16, 1, 0.3, 1] }}
              className="flex flex-col items-center text-center p-8 bg-secondaryBg border border-luxuryGold/20 rounded-card shadow-[0_10px_35px_rgba(0,0,0,0.6)] group hover:border-luxuryGold/50 transition-all"
            >
              <span className="text-[9px] uppercase tracking-ultra text-luxuryGold font-medium mb-6">
                {reason.badge}
              </span>
              <div className="text-luxuryGold mb-6 group-hover:scale-110 transition-transform duration-500 bg-background/80 p-4 rounded-full border border-divider">
                {reason.icon}
              </div>
              <h3 className="font-serif text-xl sm:text-2xl text-primaryText mb-3">{reason.title}</h3>
              <p className="text-secondaryText text-xs sm:text-sm leading-relaxed font-light">
                {reason.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
