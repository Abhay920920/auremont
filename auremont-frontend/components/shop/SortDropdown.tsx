"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown } from "lucide-react";

export default function SortDropdown({ onSort }: { onSort: (val: string) => void }) {
  const [isOpen, setIsOpen] = useState(false);
  const [selected, setSelected] = useState("Recommended");

  const options = [
    { label: "Recommended", value: "recommended" },
    { label: "Price: Low to High", value: "price_asc" },
    { label: "Price: High to Low", value: "price_desc" },
    { label: "Newest Arrivals", value: "newest" }
  ];

  const handleSelect = (opt: any) => {
    setSelected(opt.label);
    onSort(opt.value);
    setIsOpen(false);
  };

  return (
    <div className="relative">
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 text-xs uppercase tracking-widest text-primaryText py-2 md:py-0 md:pb-1 border-b border-primaryText/30 hover:border-luxuryGold transition-colors"
      >
        <span>Sort by: {selected}</span>
        <ChevronDown size={14} className={`transform transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            className="absolute right-0 top-full mt-2 w-48 bg-secondaryBg border border-divider shadow-xl z-20 py-2"
          >
            {options.map((opt) => (
              <button
                key={opt.value}
                onClick={() => handleSelect(opt)}
                className={`block w-full text-left px-4 py-3 md:py-2 text-sm font-light hover:bg-background transition-colors ${selected === opt.label ? 'text-luxuryGold' : 'text-primaryText'}`}
              >
                {opt.label}
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
