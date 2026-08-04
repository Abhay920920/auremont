"use client";

import { InputHTMLAttributes, useState } from "react";

interface CustomInputProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
}

export default function CustomInput({ label, id, ...props }: CustomInputProps) {
  const [isFocused, setIsFocused] = useState(false);
  const inputId = id || props.name;

  return (
    <div className="relative w-full mt-2">
      <label 
        htmlFor={inputId}
        className={`absolute left-0 transition-all duration-300 pointer-events-none uppercase tracking-widest
          ${isFocused || props.value ? '-top-4 text-[10px] text-luxuryGold' : 'top-2.5 text-xs text-secondaryText'}
        `}
      >
        {label}
      </label>
      <input
        id={inputId}
        {...props}
        onFocus={(e) => {
          setIsFocused(true);
          props.onFocus?.(e);
        }}
        onBlur={(e) => {
          setIsFocused(false);
          props.onBlur?.(e);
        }}
        className={`w-full bg-transparent border-b h-11 pt-3 pb-1 text-sm md:text-base text-primaryText outline-none transition-colors duration-300
          ${isFocused ? 'border-luxuryGold' : 'border-divider hover:border-secondaryText'}
          ${props.className || ''}
        `}
      />
    </div>
  );
}
