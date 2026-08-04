"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { Briefcase, ArrowRight } from "lucide-react";

export default function CorporateGifting() {
  return (
    <section className="w-full relative overflow-hidden bg-background">
      <div className="max-w-[2000px] mx-auto min-h-[75vh] grid grid-cols-1 md:grid-cols-2 border-y border-divider">
        
        {/* Left Photo Hero */}
        <motion.div 
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1.2 }}
          className="relative h-[50vh] md:h-full w-full border-b md:border-b-0 md:border-r border-divider group overflow-hidden"
        >
          <Image 
            src="/images/royal-almonds-wooden-box.png" 
            alt="Auremont Executive Corporate Gifting" 
            fill 
            className="object-cover object-center group-hover:scale-105 transition-transform duration-[2s] filter brightness-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-background/90 via-background/20 to-transparent" />
          
          <div className="absolute bottom-8 left-8 right-8">
            <span className="text-[9px] uppercase tracking-ultra text-luxuryGold font-medium bg-background/80 px-3.5 py-1 border border-luxuryGold/30 rounded-full inline-block mb-2 backdrop-blur-md">
              Bespoke Engraving & Velvet Packaging
            </span>
            <p className="text-sm font-serif text-primaryText">The Heirloom Executive Collection</p>
          </div>
        </motion.div>

        {/* Right Narrative & Concierge CTA */}
        <div className="flex flex-col justify-center p-8 sm:p-14 lg:p-24 bg-secondaryBg">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="space-y-6"
          >
            <div className="flex items-center gap-2 text-luxuryGold">
              <Briefcase size={16} />
              <span className="text-[10px] uppercase tracking-ultra font-medium">B2B & Bespoke Executive Curations</span>
            </div>

            <h2 className="text-3xl sm:text-5xl lg:text-6xl font-serif text-primaryText leading-[1.05] tracking-tight">
              Executive <br className="hidden sm:inline" />
              <span className="text-luxuryGold italic font-light">Bespoke Gifting</span>
            </h2>

            <p className="text-secondaryText text-xs sm:text-base font-light leading-relaxed max-w-md">
              Leave a lasting mark of distinction with clients, executives, and partners. Our dedicated concierge team provides custom laser-engraved wooden vessels, velvet lining, and global fulfillment.
            </p>

            <div className="pt-4 flex flex-col sm:flex-row items-center gap-4">
              <Link href="/contact" className="luxury-button w-full sm:w-auto inline-flex items-center justify-center gap-3">
                <span>Inquire Concierge</span>
                <ArrowRight size={14} />
              </Link>
              <Link href="/corporate-gifts" className="luxury-button-outline w-full sm:w-auto text-center">
                Download Catalog
              </Link>
            </div>
          </motion.div>
        </div>

      </div>
    </section>
  );
}
