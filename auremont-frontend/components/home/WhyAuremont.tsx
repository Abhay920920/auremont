"use client";

import { motion } from "framer-motion";
import { ShieldCheck, Leaf, Hexagon } from "lucide-react";

export default function WhyAuremont() {
  const reasons = [
    {
      icon: <Leaf size={32} strokeWidth={1} />,
      title: "100% Californian",
      description: "Sourced directly from the finest orchards in California, ensuring unmatched size, taste, and crunch."
    },
    {
      icon: <ShieldCheck size={32} strokeWidth={1} />,
      title: "Masterfully Roasted",
      description: "Our proprietary roasting technique preserves natural oils while enhancing the deep, nutty flavor profile."
    },
    {
      icon: <Hexagon size={32} strokeWidth={1} />,
      title: "Pristine Packaging",
      description: "Sealed in bespoke jars and wooden boxes to maintain absolute freshness and offer a premium unboxing experience."
    }
  ];

  return (
    <section className="w-full py-24 md:py-super px-6 md:px-12 bg-background border-y border-divider">
      <div className="max-w-[1400px] mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-16 md:gap-8">
          {reasons.map((reason, idx) => (
            <motion.div 
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.8, delay: idx * 0.2, ease: [0.16, 1, 0.3, 1] }}
              className="flex flex-col items-center text-center group"
            >
              <div className="text-luxuryGold mb-8 group-hover:scale-110 transition-transform duration-500">
                {reason.icon}
              </div>
              <h3 className="font-serif text-2xl text-primaryText mb-4">{reason.title}</h3>
              <p className="text-secondaryText leading-relaxed font-light max-w-sm">
                {reason.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
