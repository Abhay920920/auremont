"use client";

import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import Image from "next/image";

export default function MegaNavigation({ isOpen, onMouseLeave }: { isOpen: boolean; onMouseLeave: () => void }) {
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.2 }}
          className="absolute top-full left-0 w-full bg-secondaryBg border-b border-divider shadow-2xl z-40 py-12"
          onMouseLeave={onMouseLeave}
        >
          <div className="max-w-[2000px] mx-auto px-6 md:px-12 grid grid-cols-12 gap-8">
             <div className="col-span-3">
               <h4 className="text-[11px] uppercase tracking-widest text-secondaryText mb-6">Collections</h4>
               <ul className="space-y-4">
                 <li><Link href="/shop?category=raw" className="text-primaryText hover:text-luxuryGold transition-colors font-serif text-xl">Raw Almonds</Link></li>
                 <li><Link href="/shop?category=roasted" className="text-primaryText hover:text-luxuryGold transition-colors font-serif text-xl">Roasted Almonds</Link></li>
                 <li><Link href="/shop?category=flavored" className="text-primaryText hover:text-luxuryGold transition-colors font-serif text-xl">Flavored Editions</Link></li>
                 <li><Link href="/shop?category=gift" className="text-primaryText hover:text-luxuryGold transition-colors font-serif text-xl">Gifting & Corporate</Link></li>
               </ul>
             </div>
             <div className="col-span-3">
               <h4 className="text-[11px] uppercase tracking-widest text-secondaryText mb-6">Explore</h4>
               <ul className="space-y-4">
                 <li><Link href="/custom-gift-box" className="text-luxuryGold hover:underline transition-colors font-serif text-xl">Bespoke Gift Builder</Link></li>
                 <li><Link href="/about" className="text-primaryText hover:text-luxuryGold transition-colors font-serif text-xl">Our Heritage</Link></li>
                 <li><Link href="/process" className="text-primaryText hover:text-luxuryGold transition-colors font-serif text-xl">The Craftsmanship</Link></li>
                 <li><Link href="/journal" className="text-primaryText hover:text-luxuryGold transition-colors font-serif text-xl">Journal</Link></li>
               </ul>
             </div>
             <div className="col-span-6 flex gap-6">
               <Link href="/shop?category=gift" className="relative w-full aspect-[16/9] bg-background group overflow-hidden cursor-pointer block">
                  <Image src="/images/royal-almonds-wooden-box.png" alt="Gift Box" fill className="object-cover group-hover:scale-105 transition-transform duration-700" />
                  <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
                     <span className="text-primaryText font-serif tracking-widest text-xl border border-primaryText px-6 py-2 group-hover:bg-primaryText group-hover:text-background transition-colors">Discover Gifting</span>
                  </div>
               </Link>
             </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
