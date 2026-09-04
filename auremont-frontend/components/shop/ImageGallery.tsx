"use client";

import { useState, useEffect } from "react";
import Image from "next/image";

export default function ImageGallery({ images }: { images: string[] }) {
  const defaultImg = images[0] || '/images/california-almonds-250g.png';
  const [selectedImage, setSelectedImage] = useState(defaultImg);

  useEffect(() => {
    if (images && images.length > 0) {
      if (!selectedImage || !images.includes(selectedImage)) {
        setSelectedImage(images[0]);
      }
    }
  }, [images]);

  return (
    <div className="lg:sticky lg:top-32 space-y-3 sm:space-y-5 animate-fade-in">
      {/* Main Image Stage */}
      <div className="w-full aspect-[4/5] bg-secondaryBg rounded-card border border-divider overflow-hidden relative group shadow-[0_10px_40px_rgba(0,0,0,0.6)]">
        <Image 
          src={selectedImage} 
          alt="Product Showcase" 
          fill
          priority
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 600px"
          className="object-cover animate-image-scale transition-transform duration-700 hover:scale-105 cursor-zoom-in filter brightness-105" 
        />
      </div>

      {/* Thumbnail Track for both Mobile and Desktop */}
      {images.length > 1 && (
        <div className="flex gap-2.5 sm:gap-3 overflow-x-auto pb-2 pt-1 scrollbar-hide items-center">
          {images.map((img, i) => (
            <button
              key={i}
              onClick={() => setSelectedImage(img)}
              className={`relative w-14 sm:w-20 h-16 sm:h-24 flex-shrink-0 rounded-card overflow-hidden transition-all duration-300 ${
                selectedImage === img 
                  ? 'border-2 border-luxuryGold opacity-100 shadow-[0_0_12px_rgba(212,175,55,0.4)] scale-105' 
                  : 'opacity-50 hover:opacity-90 border border-divider'
              }`}
              aria-label={`View product image ${i + 1}`}
            >
              <Image src={img} alt={`Gallery thumbnail ${i + 1}`} fill className="object-cover" sizes="80px" />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
