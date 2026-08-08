"use client";

import { motion } from "framer-motion";
import { ShieldCheck, Leaf, Hexagon } from "lucide-react";

export default function WhyRareNuts() {
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
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: idx * 0.15 }}
              className="p-8 md:p-10 rounded-card bg-secondaryBg/40 border border-luxuryGold/20 hover:border-luxuryGold/50 transition-all duration-300 flex flex-col items-center text-center group"
            >
              <div className="w-16 h-16 rounded-full bg-luxuryGold/10 border border-luxuryGold/30 flex items-center justify-center text-luxuryGold mb-6 group-hover:scale-110 transition-transform duration-300">
                {reason.icon}
              </div>
              <span className="text-[9px] uppercase tracking-widest text-luxuryGold font-medium mb-2">
                {reason.badge}
              </span>
              <h3 className="text-xl font-serif text-primaryText mb-3">
                {reason.title}
              </h3>
              <p className="text-secondaryText text-sm font-light leading-relaxed">
                {reason.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
