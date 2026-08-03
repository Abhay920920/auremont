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
        className="w-11 h-11 border border-divider flex items-center justify-center text-primaryText hover:border-luxuryGold hover:text-luxuryGold disabled:opacity-30 disabled:hover:border-divider disabled:hover:text-primaryText transition-colors"
      >
        <ChevronLeft size={16} />
      </button>

      <div className="flex gap-2 font-serif text-lg text-secondaryText">
        {[...Array(totalPages)].map((_, i) => {
          const page = i + 1;
          return (
            <button
              key={page}
              onClick={() => onPageChange(page)}
              className={`w-11 h-11 flex items-center justify-center transition-colors ${
                currentPage === page ? 'text-luxuryGold' : 'hover:text-primaryText'
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
        className="w-11 h-11 border border-divider flex items-center justify-center text-primaryText hover:border-luxuryGold hover:text-luxuryGold disabled:opacity-30 disabled:hover:border-divider disabled:hover:text-primaryText transition-colors"
      >
        <ChevronRight size={16} />
      </button>
    </div>
  );
}
