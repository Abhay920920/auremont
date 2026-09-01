"use client";

import { useEffect, useState } from 'react';
import api from '@/lib/axios';
import FilterSidebar from '@/components/shop/FilterSidebar';
import SortDropdown from '@/components/shop/SortDropdown';
import ProductGrid from '@/components/shop/ProductGrid';
import Pagination from '@/components/shop/Pagination';

export default function Shop() {
  const [products, setProducts] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Filter States
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const [sortBy, setSortBy] = useState<string>("recommended");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const productsPerPage = 9;

  // Fetch categories once on initial mount
  useEffect(() => {
    let isMounted = true;
    api.get('/categories')
      .then(res => {
        if (isMounted) setCategories(res.data?.data || res.data || []);
      })
      .catch(err => console.error("Failed to load categories:", err));
    return () => { isMounted = false; };
  }, []);

  // Fetch products whenever filters or pagination change
  useEffect(() => {
    let isMounted = true;
    const fetchProducts = async () => {
      setLoading(true);
      setError(null);
      try {
        const productsRes = await api.get('/products', {
          params: {
            categoryId: activeCategory || undefined,
            sort: sortBy,
            page: currentPage,
            limit: productsPerPage
          }
        });
        if (isMounted) {
          setProducts(productsRes.data?.data || []);
          setTotalPages(productsRes.data?.meta?.lastPage || 1);
        }
      } catch (err: any) {
        if (isMounted) {
          console.error("Failed to load products from database:", err?.message || err);
          setError("Unable to load products. Please ensure database and server are reachable.");
        }
      } finally {
        if (isMounted) setLoading(false);
      }
    };
    fetchProducts();
    return () => { isMounted = false; };
  }, [activeCategory, sortBy, currentPage]);

  const currentProducts = products;

  const handleCategorySelect = (id: string | null) => {
    setActiveCategory(id);
    setCurrentPage(1);
  };

  return (
    <div className="w-full bg-background pt-32 pb-16 md:pb-super min-h-screen">
      
      {/* Header Section */}
      <div className="max-w-[2000px] mx-auto px-6 md:px-12 mb-8 md:mb-24">
        <div className="flex flex-col items-center text-center max-w-3xl mx-auto">
          <h4 className="text-luxuryGold uppercase tracking-superwide text-xs mb-6">The Master Reserve</h4>
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-serif text-primaryText mb-8">
            The Royal Botanical Collection
          </h1>
          <p className="text-secondaryText text-lg font-light leading-relaxed">
            Peruse our curated selection of the world's finest botanical nuts and artisanal reserves — from California Nonpareil Almonds and Mangalore King Cashews to Persian Akbari Pistachios, Kashmiri Walnuts, and Himalayan Chilgoza.
          </p>
        </div>
      </div>

      {/* Main Shop Area */}
      <div className="max-w-[2000px] mx-auto px-6 md:px-12 flex flex-col lg:flex-row gap-8 md:gap-12 xl:gap-24">
        
        {/* Sticky Filters */}
        <aside className="w-full lg:w-64 flex-shrink-0">
          <div className="sticky top-32 space-y-12">
            <FilterSidebar 
              categories={categories} 
              activeCategory={activeCategory} 
              onSelectCategory={handleCategorySelect} 
            />
          </div>
        </aside>

        {/* Product Grid Area */}
        <div className="flex-grow">
          <div className="flex justify-between items-center mb-12 pb-4 border-b border-divider">
            <span className="text-sm text-secondaryText font-light">{products.length} Results</span>
            <SortDropdown onSort={setSortBy} />
          </div>

          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
              {[1, 2, 3, 4, 5, 6].map(i => (
                <div key={i} className="flex flex-col animate-pulse">
                  <div className="w-full aspect-[4/5] bg-secondaryBg border border-divider mb-8"></div>
                  <div className="flex flex-col items-center space-y-3">
                    <div className="h-6 w-3/4 bg-divider rounded"></div>
                    <div className="h-4 w-1/4 bg-divider rounded"></div>
                    <div className="h-5 w-1/3 bg-divider rounded"></div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <>
              <ProductGrid products={currentProducts} />
              <Pagination 
                currentPage={currentPage} 
                totalPages={totalPages} 
                onPageChange={setCurrentPage} 
              />
            </>
          )}
        </div>
        
      </div>
    </div>
  );
}
