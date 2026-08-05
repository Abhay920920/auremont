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
  
  // Filter States
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const [sortBy, setSortBy] = useState<string>("recommended");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const productsPerPage = 9;

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const [productsRes, categoriesRes] = await Promise.all([
          api.get('/products', {
            params: {
              categoryId: activeCategory || undefined,
              sort: sortBy,
              page: currentPage,
              limit: productsPerPage
            }
          }),
          api.get('/categories').catch(() => ({ data: { data: [
            { id: '1', name: 'Raw Almonds' },
            { id: '2', name: 'Roasted Almonds' },
            { id: '3', name: 'Flavored Editions' },
            { id: '4', name: 'Gift Boxes' }
          ]}}))
        ]);
        
        const fetchedProducts = productsRes.data?.data || [];
        
        setProducts(fetchedProducts);
        setTotalPages(productsRes.data?.meta?.lastPage || 1);
        setCategories(categoriesRes.data?.data || []);
      } catch (err) {
        console.error("Failed to load products");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [activeCategory, sortBy, currentPage]);

  const currentProducts = products;

  const handleCategorySelect = (id: string | null) => {
    setActiveCategory(id);
    setCurrentPage(1);
  };

  return (
    <div className="w-full bg-background pt-24 md:pt-32 pb-16 md:pb-super min-h-screen">
      
      {/* Header Section */}
      <div className="max-w-[2000px] mx-auto px-6 md:px-12 mb-8 md:mb-24">
        <div className="flex flex-col items-center text-center max-w-3xl mx-auto">
          <h4 className="text-luxuryGold uppercase tracking-superwide text-xs mb-6">The Collection</h4>
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-serif text-primaryText mb-8">
            California's Finest
          </h1>
          <p className="text-secondaryText text-lg font-light leading-relaxed">
            Peruse our curated selection of premium almonds. Each harvest is subjected to rigorous quality control to ensure only the absolute finest nuts reach our bespoke packaging.
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
