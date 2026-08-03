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
    <div className="flex items-center border border-divider rounded-sm overflow-hidden h-11 md:h-10 w-36 md:w-32">
      <button 
        onClick={onDecrease}
        disabled={quantity <= min}
        className="w-11 md:w-10 h-full flex items-center justify-center hover:bg-secondaryBg transition-colors disabled:opacity-50 text-secondaryText hover:text-primaryText"
      >
        <Minus size={14} />
      </button>
      <div className="flex-1 flex items-center justify-center font-medium text-sm text-primaryText">
        {quantity}
      </div>
      <button 
        onClick={onIncrease}
        disabled={quantity >= max}
        className="w-11 md:w-10 h-full flex items-center justify-center hover:bg-secondaryBg transition-colors disabled:opacity-50 text-secondaryText hover:text-primaryText"
      >
        <Plus size={14} />
      </button>
    </div>
  );
}
