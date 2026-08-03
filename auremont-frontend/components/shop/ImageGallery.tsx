"use client";

import { useState } from "react";
import Image from "next/image";

export default function ImageGallery({ images }: { images: string[] }) {
  const [selectedImage, setSelectedImage] = useState(images[0] || '/images/royal-almonds-wooden-box.png');

  return (
    <div className="lg:sticky lg:top-32 space-y-6 animate-fade-in">
      <div className="w-full aspect-[4/5] bg-secondaryBg rounded-img overflow-hidden relative group">
        <Image 
          src={selectedImage} 
          alt="Product Image" 
          fill
          className="object-cover animate-image-scale transition-transform duration-700 hover:scale-105 cursor-zoom-in" 
        />
      </div>

      {images.length > 1 && (
        <div className="flex gap-4 overflow-x-auto pb-2 scrollbar-hide">
          {images.map((img, i) => (
            <button
              key={i}
              onClick={() => setSelectedImage(img)}
              className={`relative w-20 h-24 flex-shrink-0 rounded-sm overflow-hidden transition-all duration-300 ${
                selectedImage === img 
                  ? 'ring-1 ring-luxuryGold ring-offset-2 ring-offset-background opacity-100' 
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
