"use client";

import { useState } from "react";
import Image from "next/image";

export default function ImageGallery({ images }: { images: string[] }) {
  const [selectedImage, setSelectedImage] = useState(images[0] || '/images/royal-almonds-wooden-box.png');

  return (
    <div className="lg:sticky lg:top-32 space-y-4 sm:space-y-6 animate-fade-in">
      <div className="w-full aspect-[4/5] bg-secondaryBg rounded-card border border-divider overflow-hidden relative group shadow-[0_10px_40px_rgba(0,0,0,0.6)]">
        <Image 
          src={selectedImage} 
          alt="Product Showcase" 
          fill
          className="object-cover animate-image-scale transition-transform duration-700 hover:scale-105 cursor-zoom-in filter brightness-105" 
        />
      </div>

      {/* Mobile Dot Indicators */}
      {images.length > 1 && (
        <div className="flex justify-center items-center gap-2 pt-1 lg:hidden">
          {images.map((img, i) => (
            <button
              key={i}
              onClick={() => setSelectedImage(img)}
              className={`w-2 h-2 rounded-full transition-all duration-300 ${
                selectedImage === img ? 'bg-luxuryGold w-5' : 'bg-divider'
              }`}
              aria-label={`View image ${i + 1}`}
            />
          ))}
        </div>
      )}

      {/* Desktop/Tablet Thumbnail Track */}
      {images.length > 1 && (
        <div className="hidden sm:flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
          {images.map((img, i) => (
            <button
              key={i}
              onClick={() => setSelectedImage(img)}
              className={`relative w-16 sm:w-20 h-20 sm:h-24 flex-shrink-0 rounded-card overflow-hidden transition-all duration-300 ${
                selectedImage === img 
                  ? 'border border-luxuryGold opacity-100 shadow-[0_0_10px_rgba(212,175,55,0.3)]' 
                  : 'opacity-50 hover:opacity-100 border border-divider'
              }`}
            >
              <Image src={img} alt={`Gallery ${i}`} fill className="object-cover" />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
