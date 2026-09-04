"use client";

import { useCartStore } from "@/store/cartStore";
import { useState } from "react";

export default function AddToCartButton({ 
  productId, 
  product, 
  className,
  quantity = 1,
}: { 
  productId: string;
  product?: any;
  className?: string;
  quantity?: number;
}) {
  const addItem = useCartStore((state) => state.addItem);
  const [success, setSuccess] = useState(false);

  const handleAdd = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    // Instant 0ms visual confirmation
    setSuccess(true);
    setTimeout(() => setSuccess(false), 2000);

    try {
      await addItem(productId, quantity, product);
    } catch {
      setSuccess(false);
    }
  };

  const baseClass = className || "w-full h-14 text-lg btn-primary";

  return (
    <button 
      data-testid="add-to-cart-btn"
      onClick={handleAdd}
      className={`${baseClass} transition-all duration-200 ${success ? 'bg-emerald-700 text-white border-emerald-700 shadow-[0_0_20px_rgba(16,185,129,0.35)]' : ''}`}
    >
      {success ? 'Added to Bag ✓' : 'Add to Cart'}
    </button>
  );
}
