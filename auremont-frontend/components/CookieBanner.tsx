"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";

export default function CookieBanner() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const consent = localStorage.getItem("auremont_cookie_consent");
    if (!consent) {
      setTimeout(() => setIsVisible(true), 2000);
    }
  }, []);

  const accept = () => {
    localStorage.setItem("auremont_cookie_consent", "true");
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
          className="fixed bottom-6 left-6 right-6 md:left-auto md:right-12 md:max-w-md bg-secondaryBg border border-divider p-6 z-50 shadow-2xl"
        >
          <h4 className="font-serif text-xl text-primaryText mb-2">Cookie Preferences</h4>
          <p className="text-sm text-secondaryText font-light leading-relaxed mb-6">
            We use cookies to enhance your experience, serve personalized content, and analyze our traffic. By clicking "Accept", you consent to our use of cookies.
          </p>
          <div className="flex gap-4">
            <button onClick={accept} className="luxury-button flex-1 text-center py-2 text-xs">
              Accept All
            </button>
            <button onClick={accept} className="luxury-button-outline flex-1 text-center py-2 text-xs">
              Essential Only
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
