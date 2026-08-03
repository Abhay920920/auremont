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

  return (
    <div className="border-t border-b border-divider my-8 divide-y divide-divider">
      {/* Description Section */}
      {product.description && (
        <div className="py-6">
          <button 
            onClick={() => toggle('details')}
            className="flex w-full justify-between items-center text-left hover:text-luxuryGold transition-colors py-2"
          >
            <h3 className="font-serif text-2xl">The Details</h3>
            {openSection === 'details' ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
          </button>
          <AnimatePresence>
            {openSection === 'details' && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="overflow-hidden"
              >
                <div className="pt-6 text-secondaryText leading-loose text-base font-light whitespace-pre-line">
                  {product.description}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      )}

      {/* Specifications Section */}
      {product.attributes && product.attributes.length > 0 && (
        <div className="py-6">
          <button 
            onClick={() => toggle('specs')}
            className="flex w-full justify-between items-center text-left hover:text-luxuryGold transition-colors py-2"
          >
            <h3 className="font-serif text-2xl">Specifications</h3>
            {openSection === 'specs' ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
          </button>
          <AnimatePresence>
            {openSection === 'specs' && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="overflow-hidden"
              >
                <dl className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-6 text-sm pt-6">
                  {product.attributes.map((attr: any, i: number) => (
                    <div key={i} className="border-b border-divider/50 pb-3">
                      <dt className="text-mutedText text-xs uppercase tracking-widest mb-1">{attr.attributeName}</dt>
                      <dd className="font-medium text-primaryText text-base">{attr.attributeValue}</dd>
                    </div>
                  ))}
                </dl>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      )}

      {/* Shipping Section */}
      <div className="py-6">
        <button 
          onClick={() => toggle('shipping')}
          className="flex w-full justify-between items-center text-left hover:text-luxuryGold transition-colors py-2"
        >
          <h3 className="font-serif text-2xl">Shipping & Returns</h3>
          {openSection === 'shipping' ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
        </button>
        <AnimatePresence>
          {openSection === 'shipping' && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="overflow-hidden"
            >
              <div className="pt-6 text-secondaryText leading-relaxed text-sm font-light space-y-4">
                <p><strong className="text-primaryText font-medium">Complimentary Shipping:</strong> Enjoy free standard shipping on all orders over ₹2000. Delivered in pristine condition.</p>
                <p><strong className="text-primaryText font-medium">Global Fulfillment:</strong> We ship worldwide using express temperature-controlled logistics to ensure absolute freshness upon arrival.</p>
                <p><strong className="text-primaryText font-medium">Returns:</strong> For health and safety reasons, food items cannot be returned. If your order arrives damaged, our concierge team will immediately dispatch a replacement.</p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
