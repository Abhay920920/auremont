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
    <div className="grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 gap-3.5 sm:gap-6 md:gap-10">
      {products.map((product, idx) => {
        const isAboveFold = idx < 2;
        return (
          <motion.div
            key={product.id}
            initial={isAboveFold ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={isAboveFold ? { duration: 0.2 } : { duration: 0.5, delay: (idx - 1) * 0.04, ease: [0.16, 1, 0.3, 1] }}
          >
            <ProductCard product={product} priority={idx === 0} />
          </motion.div>
        );
      })}
    </div>
  );
}
