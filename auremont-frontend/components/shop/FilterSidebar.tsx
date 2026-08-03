"use client";

import { ChevronDown, ChevronUp, Check } from "lucide-react";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function FilterSidebar({ 
  categories, 
  activeCategory, 
  onSelectCategory 
}: { 
  categories: any[]; 
  activeCategory: string | null; 
  onSelectCategory: (id: string | null) => void;
}) {
  const [isOpen, setIsOpen] = useState(true);

  return (
    <div className="w-full">
      <h3 className="text-[11px] uppercase tracking-widest text-primaryText font-medium mb-8 pb-4 border-b border-divider">Filters</h3>
      
      <div className="mb-8">
        <button 
          onClick={() => setIsOpen(!isOpen)}
          className="flex w-full justify-between items-center text-primaryText mb-4 py-2"
        >
          <span className="font-serif text-xl">Collection</span>
          {isOpen ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
        </button>
        
        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="overflow-hidden"
            >
              <ul className="space-y-3 mt-4">
                <li>
                  <button 
                    onClick={() => onSelectCategory(null)}
                    className="flex items-center gap-3 py-2 text-secondaryText hover:text-primaryText transition-colors group w-full text-left"
                  >
                    <div className={`w-4 h-4 border ${!activeCategory ? 'border-luxuryGold bg-luxuryGold' : 'border-divider group-hover:border-luxuryGold'} flex items-center justify-center transition-colors`}>
                      {!activeCategory && <Check size={12} className="text-background" />}
                    </div>
                    <span className="font-light text-sm">All Collections</span>
                  </button>
                </li>
                {categories.map(cat => (
                  <li key={cat.id}>
                    <button 
                      onClick={() => onSelectCategory(cat.id)}
                      className="flex items-center gap-3 py-2 text-secondaryText hover:text-primaryText transition-colors group w-full text-left"
                    >
                      <div className={`w-4 h-4 border ${activeCategory === cat.id ? 'border-luxuryGold bg-luxuryGold' : 'border-divider group-hover:border-luxuryGold'} flex items-center justify-center transition-colors`}>
                        {activeCategory === cat.id && <Check size={12} className="text-background" />}
                      </div>
                      <span className="font-light text-sm">{cat.name}</span>
                    </button>
                  </li>
                ))}
              </ul>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
