"use client";

import { useEffect, useState } from "react";
import api from "@/lib/axios";
import ProductCard from "@/components/ProductCard";

export default function RelatedProducts({ categoryId, currentProductId }: { categoryId?: string, currentProductId: string }) {
  const [products, setProducts] = useState<any[]>([]);

  useEffect(() => {
    const fetchRelated = async () => {
      try {
        const res = await api.get('/products');
        let allProducts = res.data?.data || [];
        // filter out current
        allProducts = allProducts.filter((p: any) => p.id !== currentProductId);
        // prefer same category
        if (categoryId) {
          const sameCat = allProducts.filter((p: any) => p.categoryId === categoryId);
          if (sameCat.length > 0) {
            allProducts = [...sameCat, ...allProducts.filter((p: any) => p.categoryId !== categoryId)];
          }
        }
        setProducts(allProducts.slice(0, 3));
      } catch (e) {
        console.error(e);
      }
    };
    fetchRelated();
  }, [categoryId, currentProductId]);

  if (products.length === 0) return null;

  return (
    <section className="w-full py-16 mt-16 border-t border-divider">
      <div className="flex flex-col items-center text-center mb-12">
        <h4 className="text-luxuryGold uppercase tracking-superwide text-xs mb-4">Complementary</h4>
        <h2 className="text-3xl md:text-4xl font-serif text-primaryText">You May Also Like</h2>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {products.map((p) => (
          <ProductCard key={p.id} product={p} />
        ))}
      </div>
    </section>
  );
}
