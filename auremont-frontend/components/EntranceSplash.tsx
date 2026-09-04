"use client";

import { useEffect, useState } from "react";
import SquirrelLogo from "@/components/ui/SquirrelLogo";

export default function EntranceSplash() {
  const [visible, setVisible] = useState(false);
  const [fade, setFade] = useState(false);

  useEffect(() => {
    // Check if splash was already shown this session
    const hasSeenSplash = sessionStorage.getItem("rarenuts_splash") || sessionStorage.getItem("auremont_splash");
    
    if (!hasSeenSplash) {
      setVisible(true);
      // Mark as seen
      sessionStorage.setItem("rarenuts_splash", "true");

      const timer = setTimeout(() => {
        setFade(true);
        setTimeout(() => {
          setVisible(false);
        }, 300); // 300ms quick fade out
      }, 500); // Display for 500ms swift brand intro

      return () => clearTimeout(timer);
    }
  }, []);

  if (!visible) return null;

  return (
    <div 
      className={`fixed inset-0 z-[9999] bg-[#0A0A0A] flex flex-col items-center justify-center transition-opacity duration-1000 ease-in-out ${
        fade ? "opacity-0 pointer-events-none" : "opacity-100"
      }`}
    >
      <div className="flex flex-col items-center justify-center animate-fade-in space-y-4">
        <SquirrelLogo size={72} variant="full" />
        <div className="w-px h-12 bg-gradient-to-b from-luxuryGold to-transparent opacity-50"></div>
      </div>
    </div>
  );
}
