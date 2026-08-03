"use client";

import { motion } from "framer-motion";
import { HeartPulse, Brain, BatteryCharging } from "lucide-react";

export default function HealthHighlights() {
  const highlights = [
    {
      icon: <HeartPulse size={40} strokeWidth={1} />,
      title: "Heart Health",
      desc: "Rich in monounsaturated fats that support cardiovascular wellness."
    },
    {
      icon: <Brain size={40} strokeWidth={1} />,
      title: "Cognitive Function",
      desc: "High in Vitamin E and antioxidants to nourish brain cells."
    },
    {
      icon: <BatteryCharging size={40} strokeWidth={1} />,
      title: "Sustained Energy",
      desc: "Packed with protein and fiber for prolonged vitality."
    }
  ];

  return (
    <section className="w-full py-24 md:py-super px-6 md:px-12 bg-background">
      <div className="max-w-[1400px] mx-auto text-center">
        <h4 className="text-luxuryGold uppercase tracking-superwide text-xs mb-16">Nourishment</h4>
        <h2 className="text-4xl md:text-5xl font-serif text-primaryText mb-20">The Essence of Vitality</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 md:gap-8">
          {highlights.map((h, idx) => (
            <motion.div 
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.8, delay: idx * 0.2, ease: [0.16, 1, 0.3, 1] }}
              className="flex flex-col items-center p-8"
            >
              <div className="text-luxuryGold mb-6">
                {h.icon}
              </div>
              <h3 className="font-serif text-2xl text-primaryText mb-4">{h.title}</h3>
              <p className="text-secondaryText font-light">{h.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
