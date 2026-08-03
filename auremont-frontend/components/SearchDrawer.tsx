"use client";

import { motion, AnimatePresence } from "framer-motion";
import { Search, X, Loader2 } from "lucide-react";
import { useState, useRef, useEffect, useMemo } from "react";
import Link from "next/link";
import Image from "next/image";
import api from "@/lib/axios";

export default function SearchDrawer({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [query, setQuery] = useState("");
  const [products, setProducts] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [hasFetched, setHasFetched] = useState(false);

  useEffect(() => {
    if (isOpen && inputRef.current) {
      setTimeout(() => inputRef.current?.focus(), 100);
      setQuery("");
    }
  }, [isOpen]);

  useEffect(() => {
    // Only fetch once when they first type something
    if (query.trim().length > 0 && !hasFetched && !isLoading) {
      setIsLoading(true);
      api.get('/products?limit=50').then(res => {
        setProducts(res.data.data || []);
        setHasFetched(true);
        setIsLoading(false);
      }).catch(err => {
        console.error("Failed to load products for search", err);
        setIsLoading(false);
      });
    }
  }, [query, hasFetched, isLoading]);

  const filteredProducts = useMemo(() => {
    if (!query.trim()) return [];
    const lowerQuery = query.toLowerCase();
    return products.filter(p => 
      p.name.toLowerCase().includes(lowerQuery) || 
      (p.shortDescription && p.shortDescription.toLowerCase().includes(lowerQuery))
    ).slice(0, 4); // Limit to top 4 results for the visual layout
  }, [query, products]);

  const isSearching = query.trim().length > 0;
  const noResults = isSearching && hasFetched && filteredProducts.length === 0;

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[70]"
            onClick={onClose}
          />
          <motion.div 
            initial={{ y: "-100%" }}
            animate={{ y: 0 }}
            exit={{ y: "-100%" }}
            transition={{ type: "tween", ease: [0.25, 1, 0.5, 1], duration: 0.5 }}
            className="fixed top-0 left-0 w-full bg-background border-b border-divider z-[80] shadow-2xl pt-safe-top pb-8 px-6 md:px-12 max-h-[90vh] overflow-y-auto custom-scrollbar"
          >
            <div className="max-w-[1200px] mx-auto relative mt-8">
              <button 
                onClick={onClose}
                aria-label="Close search"
                className="absolute -top-6 right-0 w-11 h-11 flex items-center justify-center text-secondaryText hover:text-primaryText transition-colors -mr-2"
              >
                <X size={24} />
              </button>
              
              <div className="flex items-center border-b border-divider pb-4 mt-8">
                <Search size={24} className="text-secondaryText mr-4" />
                <input 
                  ref={inputRef}
                  type="text"
                  placeholder="Search products, collections, articles..."
                  className="w-full bg-transparent text-xl md:text-3xl font-serif text-primaryText outline-none placeholder:text-mutedText"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                />
                {isLoading && <Loader2 size={20} className="text-luxuryGold animate-spin ml-4" />}
              </div>

              <div className="mt-12 pb-8 min-h-[300px]">
                <AnimatePresence mode="wait">
                  {!isSearching ? (
                    <motion.div 
                      key="default"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="grid grid-cols-1 md:grid-cols-2 gap-12"
                    >
                       <div>
                          <h4 className="text-[11px] uppercase tracking-widest text-secondaryText mb-6">Popular Searches</h4>
                          <ul className="space-y-4">
                            <li><button onClick={() => setQuery("Roasted")} className="text-primaryText hover:text-luxuryGold transition-colors text-lg font-serif">Roasted Almonds</button></li>
                            <li><button onClick={() => setQuery("Raw")} className="text-primaryText hover:text-luxuryGold transition-colors text-lg font-serif">Raw California Almonds</button></li>
                            <li><button onClick={() => setQuery("Gift")} className="text-primaryText hover:text-luxuryGold transition-colors text-lg font-serif">Gift Boxes</button></li>
                          </ul>
                       </div>
                       <div>
                          <h4 className="text-[11px] uppercase tracking-widest text-secondaryText mb-6">Featured</h4>
                          <Link href="/shop/royal-almonds-wooden-box" onClick={onClose} className="flex gap-4 items-center group cursor-pointer w-max">
                            <div className="w-20 h-20 bg-secondaryBg relative overflow-hidden">
                              <Image src="/images/royal-almonds-wooden-box.png" alt="Featured" fill className="object-cover group-hover:scale-105 transition-transform duration-500" />
                            </div>
                            <div>
                              <h5 className="font-serif text-lg text-primaryText group-hover:text-luxuryGold transition-colors">Royal Almonds Wooden Box</h5>
                              <p className="text-sm text-secondaryText">₹2500</p>
                            </div>
                          </Link>
                       </div>
                    </motion.div>
                  ) : noResults ? (
                    <motion.div 
                      key="no-results"
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0 }}
                      className="flex flex-col items-center justify-center py-12 text-center"
                    >
                       <Search size={48} strokeWidth={1} className="text-mutedText mb-4" />
                       <h3 className="font-serif text-2xl text-primaryText mb-2">No results found for "{query}"</h3>
                       <p className="text-secondaryText mb-6">Try checking your spelling or using more general terms.</p>
                       <button onClick={() => { setQuery(""); onClose(); }} className="luxury-button-outline">
                         Explore All Products
                       </button>
                    </motion.div>
                  ) : (
                    <motion.div 
                      key="results"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                    >
                      <h4 className="text-[11px] uppercase tracking-widest text-secondaryText mb-6 border-b border-divider pb-4">
                        Results for "{query}"
                      </h4>
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                        {filteredProducts.map((product, index) => (
                          <motion.div
                            key={product.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.1 }}
                          >
                            <Link href={`/shop/${product.slug}`} onClick={onClose} className="group block space-y-4">
                              <div className="aspect-[4/5] bg-secondaryBg relative overflow-hidden">
                                {product.primaryImage ? (
                                  <Image 
                                    src={product.primaryImage} 
                                    alt={product.name} 
                                    fill 
                                    className="object-cover object-center group-hover:scale-105 transition-transform duration-700 ease-out"
                                  />
                                ) : (
                                  <div className="w-full h-full flex items-center justify-center text-mutedText text-sm font-serif">No Image</div>
                                )}
                              </div>
                              <div>
                                <h3 className="font-serif text-lg text-primaryText group-hover:text-luxuryGold transition-colors line-clamp-1">{product.name}</h3>
                                <p className="text-sm text-secondaryText">
                                  {product.salePrice ? (
                                    <>
                                      <span className="line-through text-mutedText mr-2">₹{Number(product.price).toFixed(2)}</span>
                                      <span className="text-error">₹{Number(product.salePrice).toFixed(2)}</span>
                                    </>
                                  ) : (
                                    <span>₹{Number(product.price).toFixed(2)}</span>
                                  )}
                                </p>
                              </div>
                            </Link>
                          </motion.div>
                        ))}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
