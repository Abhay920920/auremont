"use client";

import { Minus, Plus } from "lucide-react";

export default function QuantityControl({
  quantity,
  onIncrease,
  onDecrease,
  min = 1,
  max = 10
}: {
  quantity: number;
  onIncrease: () => void;
  onDecrease: () => void;
  min?: number;
  max?: number;
}) {
  return (
    <div className="flex items-center border border-divider bg-surface/50 rounded-lg overflow-hidden h-8 sm:h-9 w-28 sm:w-32">
      <button 
        onClick={onDecrease}
        disabled={quantity <= min}
        className="w-8 sm:w-9 h-full flex items-center justify-center hover:bg-secondaryBg hover:text-luxuryGold transition-colors disabled:opacity-30 text-secondaryText active:scale-95"
        aria-label="Decrease quantity"
      >
        <Minus size={13} />
      </button>
      <div className="flex-1 flex items-center justify-center font-mono font-medium text-xs sm:text-sm text-primaryText select-none">
        {quantity}
      </div>
      <button 
        onClick={onIncrease}
        disabled={quantity >= max}
        className="w-8 sm:w-9 h-full flex items-center justify-center hover:bg-secondaryBg hover:text-luxuryGold transition-colors disabled:opacity-30 text-secondaryText active:scale-95"
        aria-label="Increase quantity"
      >
        <Plus size={13} />
      </button>
    </div>
  );
}
