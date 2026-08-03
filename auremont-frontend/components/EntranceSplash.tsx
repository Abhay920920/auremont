"use client";

import { useEffect, useState } from "react";

export default function EntranceSplash() {
  const [show, setShow] = useState(true);
  const [fade, setFade] = useState(false);

  useEffect(() => {
    // Determine if it's the first visit this session to avoid showing on every navigation
    const hasSeenSplash = sessionStorage.getItem("auremont_splash");
    
    if (hasSeenSplash) {
      setShow(false);
      return;
    }

    // Start fade out after 1.5s
    const fadeTimer = setTimeout(() => {
      setFade(true);
    }, 1500);

    // Completely remove after 2.5s
    const removeTimer = setTimeout(() => {
      setShow(false);
      sessionStorage.setItem("auremont_splash", "true");
    }, 2500);

    return () => {
      clearTimeout(fadeTimer);
      clearTimeout(removeTimer);
    };
  }, []);

  if (!show) return null;

  return (
    <div 
      className={`fixed inset-0 z-[100] flex items-center justify-center bg-[#050505] transition-opacity duration-1000 ease-[cubic-bezier(0.25,1,0.5,1)] ${
        fade ? "opacity-0 pointer-events-none" : "opacity-100"
      }`}
    >
      <div className="flex flex-col items-center justify-center animate-fade-in">
        <h1 className="text-4xl md:text-5xl font-serif text-luxuryGold tracking-[0.3em] uppercase drop-shadow-2xl">
          Auremont
        </h1>
        <div className="mt-8 w-px h-16 bg-gradient-to-b from-luxuryGold to-transparent opacity-50"></div>
      </div>
    </div>
  );
}
