"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import Link from "next/link";
import SquirrelLogo from "@/components/ui/SquirrelLogo";

export default function BrandStory() {
  return (
    <section className="w-full py-24 md:py-super bg-secondaryBg relative">
      <div className="max-w-[2000px] mx-auto px-6 md:px-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-24 items-center">
          
          <motion.div 
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
            className="lg:col-span-5 space-y-8 order-2 lg:order-1"
          >
            <h4 className="text-luxuryGold uppercase tracking-superwide text-xs">Our Heritage</h4>
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-serif text-primaryText leading-tight">
              A Legacy of <br /> Uncompromising <br/> Quality.
            </h2>
            <p className="text-secondaryText text-lg font-light leading-relaxed">
              We believe that true luxury lies in the details. From the fertile valleys of California to the bespoke wooden boxes that grace your table, every step of the RARE NUTS journey is defined by obsession and craftsmanship.
            </p>
            <p className="text-secondaryText text-lg font-light leading-relaxed">
              We don't simply sell nuts. We curate exceptional nuts for people who recognize quality. Rare by Nature, Chosen by Those Who Know the Difference.
            </p>
            <div className="pt-8">
              <Link href="/about" className="luxury-button-outline">
                Read Our Story
              </Link>
            </div>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
            className="lg:col-span-7 order-1 lg:order-2 relative"
          >
            <div className="w-full aspect-[4/3] relative border border-divider overflow-hidden group">
              <Image 
                src="/images/roasted-almonds-jar.png" 
                alt="RARE NUTS Craftsmanship" 
                fill 
                className="object-cover group-hover:scale-105 transition-transform duration-[2s]"
              />
            </div>
            <div className="absolute -bottom-12 -left-12 w-48 h-64 bg-background border border-luxuryGold/40 hidden lg:block overflow-hidden p-3 z-10 shadow-[0_20px_50px_rgba(0,0,0,0.8)]">
              <div className="w-full h-full border border-luxuryGold/30 flex flex-col items-center justify-center p-3 text-center bg-secondaryBg/80">
                <SquirrelLogo size={72} variant="icon" />
                <span className="font-serif text-luxuryGold tracking-[0.2em] text-[10px] uppercase font-bold mt-2">RARE NUTS</span>
                <span className="text-[8px] text-secondaryText tracking-widest uppercase font-mono mt-0.5">Est. 2024</span>
              </div>
            </div>
          </motion.div>
          
        </div>
      </div>
    </section>
  );
}
