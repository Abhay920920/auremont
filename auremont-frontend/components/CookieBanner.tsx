"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";

export default function CookieBanner() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const consent = localStorage.getItem("rarenuts_cookie_consent") || localStorage.getItem("auremont_cookie_consent");
    if (!consent) {
      setTimeout(() => setIsVisible(true), 2000);
    }
  }, []);

  const accept = () => {
    localStorage.setItem("rarenuts_cookie_consent", "true");
    setIsVisible(false);
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div 
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          transition={{ type: "tween", ease: [0.25, 1, 0.5, 1], duration: 0.5 }}
          style={{ bottom: "calc(4.75rem + env(safe-area-inset-bottom, 0px))" }}
          className="fixed bottom-20 md:bottom-6 left-4 right-4 sm:left-6 sm:right-6 md:left-auto md:right-12 md:max-w-md bg-secondaryBg border border-luxuryGold/30 sm:border-divider p-5 sm:p-6 z-[60] shadow-[0_20px_50px_rgba(0,0,0,0.9)] rounded-card"
        >
          <h4 className="font-serif text-lg sm:text-xl text-primaryText mb-1.5 sm:mb-2">Cookie Preferences</h4>
          <p className="text-xs sm:text-sm text-secondaryText font-light leading-relaxed mb-4 sm:mb-6">
            We use cookies to enhance your experience, serve personalized content, and analyze our traffic. By clicking "Accept", you consent to our use of cookies.
          </p>
          <div className="flex gap-3 sm:gap-4">
            <button onClick={accept} className="luxury-button flex-1 text-center py-2.5 sm:py-2 text-[11px] sm:text-xs cursor-pointer">
              Accept All
            </button>
            <button onClick={accept} className="luxury-button-outline flex-1 text-center py-2.5 sm:py-2 text-[11px] sm:text-xs cursor-pointer">
              Essential Only
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
