"use client";

import React, { useState, useRef } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { Rotate3d, Sparkles, X, Type, Layers, Box, Check } from "lucide-react";

interface Packaging3DViewerProps {
  isOpen: boolean;
  onClose: () => void;
  defaultText?: string;
}

export default function Packaging3DViewer({ isOpen, onClose, defaultText = "AUREMONT RESERVE" }: Packaging3DViewerProps) {
  const [activeMaterial, setActiveMaterial] = useState<'mahogany' | 'glass'>('mahogany');
  const [rotationAngle, setRotationAngle] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [engravingText, setEngravingText] = useState(defaultText);

  // Handle Drag / Rotation
  const handleMouseDown = (e: React.MouseEvent | React.TouchEvent) => {
    setIsDragging(true);
    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
    setStartX(clientX);
  };

  const handleMouseMove = (e: React.MouseEvent | React.TouchEvent) => {
    if (!isDragging) return;
    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
    const deltaX = clientX - startX;
    setRotationAngle(prev => prev + deltaX * 0.5);
    setStartX(clientX);
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-8">
          {/* Backdrop */}
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/85 backdrop-blur-md"
          />

          {/* Modal Container */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
            className="relative w-full max-w-4xl bg-secondaryBg border border-luxuryGold/40 rounded-card overflow-hidden shadow-[0_25px_80px_rgba(0,0,0,0.9)] z-10 flex flex-col lg:flex-row"
          >
            {/* Left 3D Interactive Canvas */}
            <div 
              className="relative w-full lg:w-2/3 h-[380px] sm:h-[500px] bg-[#050505] flex items-center justify-center cursor-grab active:cursor-grabbing select-none overflow-hidden"
              onMouseDown={handleMouseDown}
              onMouseMove={handleMouseMove}
              onMouseUp={handleMouseUp}
              onTouchStart={handleMouseDown}
              onTouchMove={handleMouseMove}
              onTouchEnd={handleMouseUp}
            >
              {/* Ambient Radial Spotlight */}
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(212,175,55,0.18)_0%,transparent_70%)] pointer-events-none" />

              {/* 360° Rotatable Image Vessel Container */}
              <div 
                className="relative w-[280px] sm:w-[380px] aspect-[4/3] transition-transform duration-75"
                style={{ transform: `rotateY(${rotationAngle}deg)` }}
              >
                <Image 
                  src={activeMaterial === 'mahogany' ? '/images/royal-almonds-wooden-box.png' : '/images/roasted-almonds-jar.png'}
                  alt="Auremont 3D Vessel Packaging"
                  fill
                  className="object-contain filter brightness-105 contrast-105 pointer-events-none drop-shadow-[0_20px_50px_rgba(0,0,0,0.9)]"
                />

                {/* Real-Time Laser Engraving Text Overlay (Mahogany Only) */}
                {activeMaterial === 'mahogany' && (
                  <div className="absolute top-[38%] left-1/2 -translate-x-1/2 -translate-y-1/2 text-center pointer-events-none px-4 w-[60%]">
                    <p className="font-serif text-[10px] sm:text-xs text-[#D4AF37] tracking-ultra uppercase font-medium drop-shadow-[0_2px_4px_rgba(0,0,0,0.9)] border-b border-luxuryGold/30 pb-0.5 inline-block">
                      {engravingText || "AUREMONT RESERVE"}
                    </p>
                  </div>
                )}
              </div>

              {/* Rotate Indicator */}
              <div className="absolute bottom-4 left-4 flex items-center gap-2 text-[9px] uppercase tracking-ultra text-luxuryGold bg-background/80 px-3 py-1.5 rounded-full border border-luxuryGold/30 backdrop-blur-md pointer-events-none">
                <Rotate3d size={14} className="animate-spin" />
                <span>Drag to Rotate 360°</span>
              </div>
            </div>

            {/* Right Controls Panel */}
            <div className="w-full lg:w-1/3 p-6 sm:p-8 flex flex-col justify-between border-t lg:border-t-0 lg:border-l border-divider bg-background space-y-6">
              <div className="space-y-6">
                {/* Header */}
                <div className="flex justify-between items-start border-b border-divider pb-4">
                  <div>
                    <span className="text-[9px] uppercase tracking-ultra text-luxuryGold font-medium">Bespoke 3D Studio</span>
                    <h3 className="font-serif text-2xl text-primaryText">Packaging Inspector</h3>
                  </div>
                  <button onClick={onClose} className="p-1 text-secondaryText hover:text-luxuryGold transition-colors">
                    <X size={20} />
                  </button>
                </div>

                {/* Material Switcher */}
                <div className="space-y-3">
                  <label className="text-[10px] uppercase tracking-ultra text-secondaryText flex items-center gap-1.5 font-medium">
                    <Layers size={13} className="text-luxuryGold" /> Select Vessel Material
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    <button 
                      onClick={() => setActiveMaterial('mahogany')}
                      className={`p-3 rounded-card border text-left flex flex-col justify-between transition-all ${
                        activeMaterial === 'mahogany' 
                          ? 'border-luxuryGold bg-luxuryGold/10 text-primaryText' 
                          : 'border-divider bg-secondaryBg text-secondaryText hover:border-divider'
                      }`}
                    >
                      <span className="text-xs font-serif">Mahogany Box</span>
                      <span className="text-[9px] text-mutedText uppercase tracking-wider mt-1">Velvet Lined</span>
                    </button>

                    <button 
                      onClick={() => setActiveMaterial('glass')}
                      className={`p-3 rounded-card border text-left flex flex-col justify-between transition-all ${
                        activeMaterial === 'glass' 
                          ? 'border-luxuryGold bg-luxuryGold/10 text-primaryText' 
                          : 'border-divider bg-secondaryBg text-secondaryText hover:border-divider'
                      }`}
                    >
                      <span className="text-xs font-serif">UV Dark Glass Jar</span>
                      <span className="text-[9px] text-mutedText uppercase tracking-wider mt-1">Double Walled</span>
                    </button>
                  </div>
                </div>

                {/* Laser Engraving Input */}
                {activeMaterial === 'mahogany' && (
                  <div className="space-y-2">
                    <label className="text-[10px] uppercase tracking-ultra text-secondaryText flex items-center gap-1.5 font-medium">
                      <Type size={13} className="text-luxuryGold" /> Laser Engraving Text
                    </label>
                    <input 
                      type="text"
                      value={engravingText}
                      onChange={(e) => setEngravingText(e.target.value)}
                      maxLength={28}
                      placeholder="Type initials or name..."
                      className="w-full bg-secondaryBg border border-divider px-3.5 py-2.5 text-xs text-primaryText rounded-card outline-none focus:border-luxuryGold transition-colors"
                    />
                    <span className="text-[9px] text-mutedText block text-right">{engravingText.length}/28 Characters</span>
                  </div>
                )}
              </div>

              {/* Action Trigger */}
              <button 
                onClick={onClose}
                className="luxury-button w-full flex items-center justify-center gap-2 py-3.5 text-xs tracking-ultra mt-4"
              >
                <Check size={14} />
                <span>Confirm Packaging Selection</span>
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
