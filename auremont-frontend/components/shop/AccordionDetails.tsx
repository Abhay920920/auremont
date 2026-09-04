"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";

export default function AccordionDetails({ product }: { product: any }) {
  const [openSection, setOpenSection] = useState<string>("details");

  const toggle = (sec: string) => {
    if (openSection === sec) setOpenSection("");
    else setOpenSection(sec);
  };

  const displayDescription = product.description || product.shortDescription;

  return (
    <div className="border-t border-b border-divider/80 my-6 sm:my-8 divide-y divide-divider/80">
      {/* Description Section */}
      {displayDescription && (
        <div className="py-5 sm:py-6">
          <button 
            onClick={() => toggle('details')}
            className="flex w-full justify-between items-center text-left hover:text-luxuryGold transition-colors py-1"
            aria-expanded={openSection === 'details'}
          >
            <h3 className="font-serif text-xl sm:text-2xl text-primaryText">The Details</h3>
            {openSection === 'details' ? <ChevronUp size={18} className="text-luxuryGold" /> : <ChevronDown size={18} className="text-zinc-400" />}
          </button>
          <AnimatePresence>
            {openSection === 'details' && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="overflow-hidden"
              >
                <div className="pt-4 sm:pt-6 text-zinc-300 leading-relaxed text-sm sm:text-base font-light whitespace-pre-line">
                  {displayDescription}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      )}

      {/* Specifications Section */}
      {product.attributes && product.attributes.length > 0 && (
        <div className="py-5 sm:py-6">
          <button 
            onClick={() => toggle('specs')}
            className="flex w-full justify-between items-center text-left hover:text-luxuryGold transition-colors py-1"
            aria-expanded={openSection === 'specs'}
          >
            <h3 className="font-serif text-xl sm:text-2xl text-primaryText">Specifications</h3>
            {openSection === 'specs' ? <ChevronUp size={18} className="text-luxuryGold" /> : <ChevronDown size={18} className="text-zinc-400" />}
          </button>
          <AnimatePresence>
            {openSection === 'specs' && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="overflow-hidden"
              >
                <dl className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-4 text-sm pt-4 sm:pt-6">
                  {product.attributes.map((attr: any, i: number) => (
                    <div key={i} className="border-b border-divider/50 pb-2.5">
                      <dt className="text-zinc-400 text-xs uppercase tracking-wider font-mono mb-1">{attr.attributeName}</dt>
                      <dd className="font-medium text-primaryText text-sm sm:text-base">{attr.attributeValue}</dd>
                    </div>
                  ))}
                </dl>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      )}

      {/* Shipping Section */}
      <div className="py-5 sm:py-6">
        <button 
          onClick={() => toggle('shipping')}
          className="flex w-full justify-between items-center text-left hover:text-luxuryGold transition-colors py-1"
          aria-expanded={openSection === 'shipping'}
        >
          <h3 className="font-serif text-xl sm:text-2xl text-primaryText">Shipping & Returns</h3>
          {openSection === 'shipping' ? <ChevronUp size={18} className="text-luxuryGold" /> : <ChevronDown size={18} className="text-zinc-400" />}
        </button>
        <AnimatePresence>
          {openSection === 'shipping' && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="overflow-hidden"
            >
              <div className="pt-4 sm:pt-6 text-zinc-300 leading-relaxed text-sm font-light space-y-3.5">
                <p><strong className="text-primaryText font-medium">Complimentary Shipping:</strong> Enjoy free express shipping on all orders over ₹2000. Delivered in sealed luxury climate-protected vaults.</p>
                <p><strong className="text-primaryText font-medium">Global Delivery:</strong> Express dispatch within 24 hours to guarantee absolute orchard freshness upon arrival.</p>
                <p><strong className="text-primaryText font-medium">Concierge Guarantee:</strong> In the rare event of transit damage or compromised seal, our concierge instantly arranges a replacement allocation.</p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
