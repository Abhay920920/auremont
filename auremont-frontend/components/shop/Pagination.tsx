"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";

export default function Pagination({ 
  currentPage, 
  totalPages, 
  onPageChange 
}: { 
  currentPage: number; 
  totalPages: number; 
  onPageChange: (page: number) => void;
}) {
  if (totalPages <= 1) return null;

  return (
    <div className="flex items-center justify-center gap-4 mt-24">
      <button 
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        aria-label="Previous page"
        className="w-11 h-11 border border-divider flex items-center justify-center text-primaryText hover:border-luxuryGold hover:text-luxuryGold disabled:opacity-30 disabled:hover:border-divider disabled:hover:text-primaryText transition-colors cursor-pointer disabled:cursor-not-allowed"
      >
        <ChevronLeft size={16} />
      </button>

      <div className="flex gap-2 font-serif text-lg text-secondaryText">
        {[...Array(totalPages)].map((_, i) => {
          const page = i + 1;
          const isActive = currentPage === page;
          return (
            <button
              key={page}
              onClick={() => onPageChange(page)}
              aria-label={`Go to page ${page}`}
              aria-current={isActive ? "page" : undefined}
              className={`w-11 h-11 flex items-center justify-center transition-colors cursor-pointer ${
                isActive ? 'text-luxuryGold font-bold border border-luxuryGold/40' : 'hover:text-primaryText'
              }`}
            >
              {page}
            </button>
          );
        })}
      </div>

      <button 
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        aria-label="Next page"
        className="w-11 h-11 border border-divider flex items-center justify-center text-primaryText hover:border-luxuryGold hover:text-luxuryGold disabled:opacity-30 disabled:hover:border-divider disabled:hover:text-primaryText transition-colors cursor-pointer disabled:cursor-not-allowed"
      >
        <ChevronRight size={16} />
      </button>
    </div>
  );
}
