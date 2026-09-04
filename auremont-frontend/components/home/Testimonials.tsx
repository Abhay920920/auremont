"use client";

import { motion } from "framer-motion";

export default function Testimonials() {
  const testimonials = [
    {
      quote: "Simply the finest almonds I've ever tasted. The presentation is unmatched and the crunch is extraordinary.",
      author: "Eleanor V.",
      title: "Executive Chef"
    },
    {
      quote: "RARE NUTS elevates the humble almond into a true luxury experience. The wooden box makes a perfect corporate gift.",
      author: "James T.",
      title: "CEO, TechVentures"
    },
    {
      quote: "From the moment you open the jar, the aroma of the perfect roast hits you. Absolutely exceptional quality.",
      author: "Sarah M.",
      title: "Food Critic"
    }
  ];

  return (
    <section className="w-full py-24 md:py-super bg-background border-y border-divider relative">
      <div className="site-container text-center">
        <h4 className="text-luxuryGold uppercase tracking-superwide text-xs mb-16">The Verdict</h4>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          {testimonials.map((t, idx) => (
            <motion.div 
              key={idx}
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.8, delay: idx * 0.2, ease: [0.16, 1, 0.3, 1] }}
              className="flex flex-col items-center p-8 bg-secondaryBg border border-divider hover:border-luxuryGold/50 transition-colors duration-500"
            >
              <span className="font-serif text-6xl text-luxuryGold opacity-50 mb-4 leading-none">"</span>
              <p className="text-primaryText font-serif text-xl italic leading-relaxed mb-8 flex-1">
                {t.quote}
              </p>
              <div>
                <h5 className="text-[11px] uppercase tracking-widest text-primaryText font-medium mb-1">{t.author}</h5>
                <p className="text-xs text-secondaryText">{t.title}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
