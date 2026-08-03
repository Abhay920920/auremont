"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";

export default function CorporateGifting() {
  return (
    <section className="w-full relative overflow-hidden bg-background">
      <div className="max-w-[2000px] mx-auto min-h-[80vh] grid grid-cols-1 md:grid-cols-2 border-y border-divider">
        
        <motion.div 
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1.5 }}
          className="relative h-[60vh] md:h-full w-full border-r border-divider"
        >
          <Image 
            src="/images/royal-almonds-wooden-box.png" 
            alt="Corporate Gifting" 
            fill 
            className="object-cover"
          />
        </motion.div>

        <div className="flex flex-col justify-center p-12 md:p-24 lg:p-32 bg-secondaryBg">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          >
            <h4 className="text-luxuryGold uppercase tracking-superwide text-xs mb-6">B2B & Bespoke</h4>
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-serif text-primaryText mb-8 leading-tight">
              Corporate <br/> Gifting
            </h2>
            <p className="text-secondaryText text-lg font-light leading-relaxed mb-12 max-w-md">
              Leave a lasting impression with clients and partners. Our concierge team offers bespoke curation, custom engraving, and global fulfillment for your corporate needs.
            </p>
            <Link href="/contact" className="luxury-button">
              Contact Concierge
            </Link>
          </motion.div>
        </div>

      </div>
    </section>
  );
}
