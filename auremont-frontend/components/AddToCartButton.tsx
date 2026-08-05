"use client";

import { useCartStore } from "@/store/cartStore";
import { useState } from "react";

export default function AddToCartButton({ productId, className }: { productId: string, className?: string }) {
  const addItem = useCartStore((state) => state.addItem);
  const loading = useCartStore((state) => state.loading);
  const [success, setSuccess] = useState(false);

  const handleAdd = async () => {
    await addItem(productId, 1);
    setSuccess(true);
    setTimeout(() => setSuccess(false), 2000);
  };

  const baseClass = className || "w-full h-14 text-lg btn-primary";

  return (
    <button 
      data-testid="add-to-cart-btn"
      onClick={handleAdd}
      disabled={loading}
      className={`${baseClass} transition-colors ${success ? 'bg-green-600 text-white border-green-600' : ''}`}
    >
      {loading ? 'Adding...' : success ? 'Added ✓' : 'Add to Cart'}
    </button>
  );
}
