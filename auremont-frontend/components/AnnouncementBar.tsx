"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import { X } from "lucide-react";

export default function AnnouncementBar() {
  const [isVisible, setIsVisible] = useState(true);

  if (!isVisible) return null;

  return (
    <AnimatePresence>
      <motion.div 
        initial={{ height: 0, opacity: 0 }}
        animate={{ height: "auto", opacity: 1 }}
        exit={{ height: 0, opacity: 0 }}
        transition={{ duration: 0.3 }}
        className="w-full bg-secondaryBg border-b border-divider flex items-center justify-center py-2 px-4 relative z-[65] announcement-bar"
      >
        <p className="text-[11px] uppercase tracking-widest text-primaryText font-medium text-center">
          Complimentary shipping on all orders over ₹2000
        </p>
        <button 
          onClick={() => setIsVisible(false)}
          className="absolute right-2 md:right-4 top-1/2 -translate-y-1/2 w-11 h-11 flex items-center justify-center text-secondaryText hover:text-primaryText transition-colors"
          aria-label="Close announcement"
        >
          <X size={14} />
        </button>
      </motion.div>
    </AnimatePresence>
  );
}
