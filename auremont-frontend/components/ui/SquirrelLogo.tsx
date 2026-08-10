"use client";

import React from "react";
import Image from "next/image";

interface SquirrelLogoProps {
  variant?: "badge" | "icon" | "full" | "header";
  className?: string;
  size?: number;
}

export default function SquirrelLogo({ variant = "header", className = "", size = 32 }: SquirrelLogoProps) {
  // Compact Header variant - emblem + single line brand name, no tagline
  if (variant === "header") {
    return (
      <div className={`inline-flex flex-col items-center justify-center select-none ${className}`}>
        <div 
          className="relative flex items-center justify-center rounded-full overflow-hidden transition-transform duration-300 hover:scale-105"
          style={{ width: size, height: size }}
        >
          <Image
            src="/images/rarenuts-gold-squirrel-logo.png"
            alt="RARE NUTS"
            width={size}
            height={size}
            className="object-contain filter brightness-110 contrast-125 drop-shadow-[0_2px_6px_rgba(212,175,55,0.3)]"
            priority
          />
        </div>
        <span className="font-serif text-luxuryGold tracking-[0.25em] uppercase font-bold text-[11px] md:text-xs whitespace-nowrap mt-1 drop-shadow-[0_1px_3px_rgba(0,0,0,0.9)]">
          RARE NUTS
        </span>
      </div>
    );
  }

  // Icon only
  if (variant === "icon") {
    return (
      <div className={`inline-flex items-center justify-center select-none ${className}`}>
        <div 
          className="relative flex items-center justify-center rounded-full overflow-hidden transition-transform duration-300 hover:scale-105"
          style={{ width: size, height: size }}
        >
          <Image
            src="/images/rarenuts-gold-squirrel-logo.png"
            alt="RARE NUTS"
            width={size}
            height={size}
            className="object-contain filter brightness-110 contrast-125 drop-shadow-[0_2px_6px_rgba(212,175,55,0.3)]"
            priority
          />
        </div>
      </div>
    );
  }

  // Full variant (Emblem + Brand Name + Tagline) for Splash, Footer, Hero
  return (
    <div className={`inline-flex flex-col items-center select-none ${className}`}>
      <div 
        className="relative flex items-center justify-center rounded-full overflow-hidden transition-transform duration-300 hover:scale-105"
        style={{ width: size, height: size }}
      >
        <Image
          src="/images/rarenuts-gold-squirrel-logo.png"
          alt="RARE NUTS"
          width={size}
          height={size}
          className="object-contain filter brightness-110 contrast-125 drop-shadow-[0_2px_8px_rgba(212,175,55,0.3)]"
          priority
        />
      </div>

      <div className="text-center mt-2">
        <span className="font-serif text-luxuryGold tracking-[0.25em] uppercase block font-bold text-base md:text-xl whitespace-nowrap drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]">
          RARE NUTS
        </span>
        <span className="text-[9px] md:text-[11px] text-secondaryText tracking-widest uppercase block font-light mt-0.5 whitespace-nowrap">
          Exceptional by Nature. Distinct by Choice.
        </span>
      </div>
    </div>
  );
}
