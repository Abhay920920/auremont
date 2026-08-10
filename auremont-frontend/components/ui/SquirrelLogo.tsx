"use client";

import React from "react";
import Image from "next/image";

interface SquirrelLogoProps {
  variant?: "badge" | "icon" | "full";
  className?: string;
  size?: number;
}

export default function SquirrelLogo({ variant = "full", className = "", size = 48 }: SquirrelLogoProps) {
  return (
    <div className={`inline-flex flex-col items-center select-none ${className}`}>
      {/* High-Resolution Metallic Gold Squirrel Emblem Logo */}
      <div 
        className="relative flex items-center justify-center rounded-full overflow-hidden transition-transform duration-300 hover:scale-105"
        style={{ width: size, height: size }}
      >
        <Image
          src="/images/rarenuts-gold-squirrel-logo.png"
          alt="RARE NUTS Metallic Gold Squirrel Emblem"
          width={size}
          height={size}
          className="object-contain filter brightness-110 contrast-125 drop-shadow-[0_2px_8px_rgba(212,175,55,0.3)]"
          priority
        />
      </div>

      {/* Brand Name & Tagline Text */}
      {variant !== "icon" && (
        <div className="text-center mt-0.5 md:mt-2">
          <span className="font-serif text-luxuryGold tracking-ultra uppercase block font-bold text-sm md:text-xl drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]">
            RARE NUTS
          </span>
          <span className="hidden md:block text-[9px] md:text-[11px] text-secondaryText tracking-widest uppercase font-light mt-0.5">
            Exceptional by Nature. Distinct by Choice.
          </span>
        </div>
      )}
    </div>
  );
}
