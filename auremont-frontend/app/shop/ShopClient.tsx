"use client";

import { useState, useCallback } from "react";
import api from "@/lib/axios";
import FilterSidebar from "@/components/shop/FilterSidebar";
import SortDropdown from "@/components/shop/SortDropdown";
import ProductGrid from "@/components/shop/ProductGrid";
import Pagination from "@/components/shop/Pagination";

interface ShopClientProps {
  initialProducts: any[];
  initialCategories: any[];
  initialMeta: { total: number; page: number; limit: number; lastPage: number };
}

export default function ShopClient({
  initialProducts,
  initialCategories,
  initialMeta,
}: ShopClientProps) {
  const [products, setProducts] = useState<any[]>(initialProducts);
  const [categories] = useState<any[]>(initialCategories);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const [sortBy, setSortBy] = useState<string>("recommended");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(initialMeta.lastPage);

  const productsPerPage = 9;

  const fetchProducts = useCallback(
    async (opts: { category: string | null; sort: string; page: number }) => {
      setLoading(true);
      setError(null);
      try {
        const res = await api.get("/products", {
          params: {
            categoryId: opts.category || undefined,
            sort: opts.sort,
            page: opts.page,
            limit: productsPerPage,
          },
        });
        setProducts(res.data?.data || []);
        setTotalPages(res.data?.meta?.lastPage || 1);
      } catch (err: any) {
        console.error("Failed to load products:", err?.message || err);
        setError("Unable to load products. Please check your connection.");
      } finally {
        setLoading(false);
      }
    },
    [],
  );

  const handleCategorySelect = (id: string | null) => {
    setActiveCategory(id);
    setCurrentPage(1);
    fetchProducts({ category: id, sort: sortBy, page: 1 });
  };

  const handleSort = (sort: string) => {
    setSortBy(sort);
    setCurrentPage(1);
    fetchProducts({ category: activeCategory, sort, page: 1 });
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    fetchProducts({ category: activeCategory, sort: sortBy, page });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="w-full bg-background pt-24 sm:pt-28 md:pt-32 pb-24 sm:pb-28 md:pb-super min-h-screen">
      {/* Header Section */}
      <div className="site-container mb-8 sm:mb-12 md:mb-16">
        <div className="flex flex-col items-center text-center max-w-3xl mx-auto">
          <h4 className="text-luxuryGold uppercase tracking-superwide text-xs mb-3 sm:mb-4">The Master Reserve</h4>
          <h1 className="text-3xl sm:text-5xl md:text-6xl font-serif text-primaryText mb-4 sm:mb-6">
            The Royal Botanical Collection
          </h1>
          <p className="text-zinc-300 text-sm sm:text-base md:text-lg font-light leading-relaxed max-w-2xl">
            Peruse our curated selection of the world&apos;s finest botanical nuts and artisanal reserves &mdash; from California Nonpareil Almonds and Mangalore King Cashews to Persian Akbari Pistachios, Kashmiri Walnuts, and Himalayan Chilgoza.
          </p>
        </div>
      </div>

      {/* Main Shop Area */}
      <div className="site-container flex flex-col lg:flex-row gap-6 lg:gap-12 xl:gap-16">
        {/* Desktop Sidebar */}
        <aside className="hidden lg:block w-64 flex-shrink-0">
          <div className="sticky top-32 space-y-8">
            <FilterSidebar
              categories={categories}
              activeCategory={activeCategory}
              onSelectCategory={handleCategorySelect}
            />
          </div>
        </aside>

        <div className="flex-grow">
          {/* Mobile Horizontal Category Pills */}
          <div className="lg:hidden mb-5 overflow-x-auto pb-2 scrollbar-hide -mx-2 px-2 flex items-center gap-2">
            <button
              onClick={() => handleCategorySelect(null)}
              className={`px-3.5 py-1.5 rounded-full text-xs font-mono uppercase tracking-wider whitespace-nowrap transition-all ${
                !activeCategory 
                  ? 'bg-luxuryGold text-background font-semibold shadow-[0_0_12px_rgba(212,175,55,0.4)]' 
                  : 'bg-secondaryBg text-zinc-300 border border-divider hover:border-luxuryGold'
              }`}
            >
              All Collections
            </button>
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => handleCategorySelect(cat.id)}
                className={`px-3.5 py-1.5 rounded-full text-xs font-mono uppercase tracking-wider whitespace-nowrap transition-all ${
                  activeCategory === cat.id
                    ? 'bg-luxuryGold text-background font-semibold shadow-[0_0_12px_rgba(212,175,55,0.4)]'
                    : 'bg-secondaryBg text-zinc-300 border border-divider hover:border-luxuryGold'
                }`}
              >
                {cat.name}
              </button>
            ))}
          </div>

          {/* Results Count & Sort Dropdown */}
          <div className="flex justify-between items-center mb-6 sm:mb-8 pb-3.5 border-b border-divider/80">
            <span className="text-xs sm:text-sm text-zinc-400 font-mono tracking-wider">
              {products.length} {products.length === 1 ? 'Creation' : 'Creations'}
            </span>
            <SortDropdown onSort={handleSort} />
          </div>

          {error && (
            <div className="text-error text-sm text-center py-12">{error}</div>
          )}

          {loading ? (
            <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-8 md:gap-12">
              {[1, 2, 3, 4, 5, 6].map(i => (
                <div key={i} className="flex flex-col animate-pulse">
                  <div className="w-full aspect-[4/5] bg-secondaryBg border border-divider mb-4 sm:mb-8 rounded-card"></div>
                  <div className="flex flex-col items-center space-y-2.5">
                    <div className="h-5 w-3/4 bg-divider rounded"></div>
                    <div className="h-3 w-1/4 bg-divider rounded"></div>
                    <div className="h-4 w-1/3 bg-divider rounded"></div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <>
              <ProductGrid products={products} />
              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={handlePageChange}
              />
            </>
          )}
        </div>
      </div>
    </div>
  );
}
