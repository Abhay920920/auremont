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
          <div className="site-container grid grid-cols-12 gap-8">
             <div className="col-span-3">
               <h4 className="text-[11px] uppercase tracking-widest text-luxuryGold font-medium mb-5">Nut Varieties</h4>
               <ul className="space-y-3">
                 <li><Link href="/shop?category=almonds" className="text-primaryText hover:text-luxuryGold transition-colors font-serif text-lg block">California Almonds</Link></li>
                 <li><Link href="/shop?category=cashews" className="text-primaryText hover:text-luxuryGold transition-colors font-serif text-lg block">Royal King Cashews</Link></li>
                 <li><Link href="/shop?category=pistachios" className="text-primaryText hover:text-luxuryGold transition-colors font-serif text-lg block">Imperial Pistachios</Link></li>
                 <li><Link href="/shop?category=walnuts" className="text-primaryText hover:text-luxuryGold transition-colors font-serif text-lg block">Kashmiri Walnuts</Link></li>
                 <li><Link href="/shop?category=macadamias" className="text-primaryText hover:text-luxuryGold transition-colors font-serif text-lg block">Queensland Macadamias</Link></li>
                 <li><Link href="/shop?category=pine-nuts" className="text-primaryText hover:text-luxuryGold transition-colors font-serif text-lg block">Himalayan Pine Nuts</Link></li>
               </ul>
             </div>
             <div className="col-span-3">
               <h4 className="text-[11px] uppercase tracking-widest text-luxuryGold font-medium mb-5">Editions & Assortments</h4>
               <ul className="space-y-3">
                 <li><Link href="/shop?category=assortments" className="text-primaryText hover:text-luxuryGold transition-colors font-serif text-lg block">Multi-Nut Royal Reserves</Link></li>
                 <li><Link href="/shop?category=raw" className="text-primaryText hover:text-luxuryGold transition-colors font-serif text-lg block">Raw Botanical Harvests</Link></li>
                 <li><Link href="/shop?category=roasted" className="text-primaryText hover:text-luxuryGold transition-colors font-serif text-lg block">Slow-Roasted Sea Salt</Link></li>
                 <li><Link href="/shop?category=gift" className="text-primaryText hover:text-luxuryGold transition-colors font-serif text-lg block">Mahogany Gift Chests</Link></li>
                 <li><Link href="/corporate-gifts" className="text-primaryText hover:text-luxuryGold transition-colors font-serif text-lg block">Corporate Gifting Suite</Link></li>
               </ul>
             </div>
             <div className="col-span-2">
               <h4 className="text-[11px] uppercase tracking-widest text-secondaryText mb-5">Bespoke & Story</h4>
               <ul className="space-y-3">
                 <li><Link href="/custom-gift-box" className="text-luxuryGold hover:underline transition-colors font-serif text-base block font-medium">Bespoke Box Builder</Link></li>
                 <li><Link href="/about" className="text-primaryText hover:text-luxuryGold transition-colors font-serif text-base block">Our Heritage</Link></li>
                 <li><Link href="/pairing" className="text-primaryText hover:text-luxuryGold transition-colors font-serif text-base block">Pairing Guide</Link></li>
                 <li><Link href="/journal" className="text-primaryText hover:text-luxuryGold transition-colors font-serif text-base block">Journal & Stories</Link></li>
               </ul>
             </div>
             <div className="col-span-4 flex gap-4">
               <Link href="/custom-gift-box" className="relative w-full aspect-[4/3] bg-background group overflow-hidden cursor-pointer block border border-divider">
                  <Image src="/images/royal-almonds-wooden-box.png" alt="Multi-Nut Gift Chest" fill className="object-cover group-hover:scale-105 transition-transform duration-700" />
                  <div className="absolute inset-0 bg-black/40 flex flex-col items-center justify-center p-4 text-center">
                     <span className="text-[10px] uppercase tracking-widest text-luxuryGold font-mono mb-1">Custom Gifting</span>
                     <span className="text-primaryText font-serif tracking-wider text-lg border-b border-luxuryGold pb-1 group-hover:text-luxuryGold transition-colors">Build 4-Nut Box</span>
                  </div>
               </Link>
             </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
