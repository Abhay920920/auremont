"use client";

import { motion } from "framer-motion";
import ProductCard from "@/components/ProductCard";

export default function ProductGrid({ products }: { products: any[] }) {
  if (products.length === 0) {
    return (
      <div className="w-full flex flex-col items-center justify-center py-32 text-center">
        <h3 className="font-serif text-3xl text-primaryText mb-4">No creations found.</h3>
        <p className="text-secondaryText font-light">Please try adjusting your filters or search terms.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-8 md:gap-12">
      {products.map((product, idx) => (
        <motion.div
          key={product.id}
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: idx * 0.05, ease: [0.16, 1, 0.3, 1] }}
        >
          <ProductCard product={product} />
        </motion.div>
      ))}
    </div>
  );
}
