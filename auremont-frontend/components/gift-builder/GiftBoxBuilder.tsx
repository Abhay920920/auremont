"use client";

import { useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { ShieldCheck, Sparkles, Check, PackageCheck, Award, Box, RotateCcw, ShoppingBag } from "lucide-react";
import { useCartStore } from "@/store/cartStore";
import { useCurrencyStore } from "@/store/currencyStore";
import api from "@/lib/axios";

const BOX_STYLES = [
  {
    id: "mahogany",
    name: "Handcrafted Mahogany Wood Box",
    price: 1499,
    image: "/images/royal-almonds-wooden-box.png",
    description: "Carved from solid mahogany wood with polished brass hinges & velvet interior tray.",
    badge: "Masterpiece Edition",
  },
  {
    id: "matte-black",
    name: "Matte Black Rigid Gift Box",
    price: 999,
    image: "/images/luxury-gift-box-unboxing.png",
    description: "Heavyweight matte black rigid box with debossed gold foil trim & magnetic closure.",
    badge: "Signature Edition",
  },
  {
    id: "velvet-pouch",
    name: "Transparent Window Edition Box",
    price: 899,
    image: "/images/almonds-pouch-window.png",
    description: "Matte black box featuring a clear sight window and dewy gold lettering.",
    badge: "Modern Edition",
  },
];

const ALMOND_VARIETIES = [
  {
    id: "raw-250",
    name: "California Reserve Raw Almonds 250g",
    price: 799,
    image: "/images/california-almonds-250g.png",
    tag: "100% Natural",
  },
  {
    id: "roasted-sea-salt",
    name: "Slow-Roasted Sea Salt 250g",
    price: 899,
    image: "/images/roasted-almonds-jar.png",
    tag: "Artisanal Salt",
  },
  {
    id: "smokey-barbecue",
    name: "Smokey Hickory Roasted 250g",
    price: 899,
    image: "/images/roasted-almonds-jar.png",
    tag: "Wood-Smokey",
  },
  {
    id: "honey-glazed",
    name: "Honey Glazed Reserve 250g",
    price: 949,
    image: "/images/california-almonds-250g.png",
    tag: "Sweet Nectar",
  },
];

const WAX_SEALS = [
  { id: "gold", name: "Royal Gold Seal", color: "#D4AF37" },
  { id: "burgundy", name: "Burgundy Red Seal", color: "#800020" },
  { id: "emerald", name: "Imperial Emerald Seal", color: "#046307" },
];

export default function GiftBoxBuilder() {
  const { addItem } = useCartStore();
  const { formatPrice } = useCurrencyStore();

  const [currentStep, setCurrentStep] = useState(1);

  // Customization State
  const [selectedBox, setSelectedBox] = useState(BOX_STYLES[0]);
  const [compartmentCount, setCompartmentCount] = useState<2 | 3 | 4>(2);
  const [selectedFillings, setSelectedFillings] = useState<Array<typeof ALMOND_VARIETIES[0]>>([
    ALMOND_VARIETIES[0],
    ALMOND_VARIETIES[1],
  ]);
  const [engravingText, setEngravingText] = useState("AUREMONT RESERVE");
  const [selectedSeal, setSelectedSeal] = useState(WAX_SEALS[0]);
  const [addingToCart, setAddingToCart] = useState(false);

  // Price Calculation
  const fillingsTotal = selectedFillings.reduce((sum, item) => sum + item.price, 0);
  const grandTotal = selectedBox.price + fillingsTotal;

  const handleCompartmentCountChange = (count: 2 | 3 | 4) => {
    setCompartmentCount(count);
    const newFillings = [...selectedFillings];
    while (newFillings.length < count) {
      newFillings.push(ALMOND_VARIETIES[newFillings.length % ALMOND_VARIETIES.length]);
    }
    setSelectedFillings(newFillings.slice(0, count));
  };

  const handleSlotFillingChange = (slotIndex: number, variety: typeof ALMOND_VARIETIES[0]) => {
    const updated = [...selectedFillings];
    updated[slotIndex] = variety;
    setSelectedFillings(updated);
  };

  const handleAddToCart = async () => {
    setAddingToCart(true);
    try {
      let targetProductId = "ALM-EV-250";
      try {
        const res = await api.get('/products');
        const products = res.data?.data || [];
        if (products.length > 0) {
          targetProductId = products[0].id;
        }
      } catch (err) {
        // Fallback SKU
      }
      await addItem(targetProductId, 1);
    } catch (e) {
      console.error("Failed to add bespoke gift box to cart", e);
    } finally {
      setAddingToCart(false);
    }
  };

  return (
    <div className="w-full bg-background min-h-screen">
      {/* Interactive Builder Container */}
      <div className="max-w-[1800px] mx-auto px-6 md:px-12 py-12 flex flex-col lg:flex-row gap-12 xl:gap-20">
        
        {/* LEFT COLUMN: Sticky 3D Visual Box Mock & Real-Time Engraving Preview */}
        <div className="w-full lg:w-1/2 flex flex-col items-center">
          <div className="sticky top-32 w-full max-w-xl space-y-6">
            
            {/* Box Preview Container */}
            <div className="relative aspect-[4/5] w-full bg-secondaryBg border border-luxuryGold/40 rounded-card overflow-hidden shadow-[0_20px_60px_rgba(0,0,0,0.8)] group">
              
              {/* Background Product Image */}
              <Image 
                src={selectedBox.image} 
                alt={selectedBox.name} 
                fill 
                className="object-cover filter brightness-105 transition-all duration-700"
              />

              {/* Gold Foil Engraving Overlay */}
              <div className="absolute inset-0 flex flex-col items-center justify-center p-8 pointer-events-none">
                <div className="bg-black/50 backdrop-blur-md border border-luxuryGold/50 px-6 py-4 rounded-sm text-center max-w-xs transition-all duration-300 transform group-hover:scale-105">
                  <span className="text-[9px] uppercase tracking-ultra text-luxuryGold font-medium block mb-1">
                    Bespoke Laser Engraving
                  </span>
                  <p className="font-serif text-xl md:text-2xl text-luxuryGold tracking-widest uppercase drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]">
                    {engravingText || "YOUR INITIALS"}
                  </p>
                </div>
              </div>

              {/* Wax Seal Overlay Badge */}
              <div className="absolute bottom-6 left-6 flex items-center gap-2 bg-background/90 backdrop-blur-md px-3.5 py-1.5 border border-divider rounded-full">
                <div 
                  className="w-3.5 h-3.5 rounded-full shadow-inner border border-white/20" 
                  style={{ backgroundColor: selectedSeal.color }} 
                />
                <span className="text-[10px] uppercase tracking-widest text-primaryText font-medium">
                  {selectedSeal.name}
                </span>
              </div>

              <div className="absolute top-6 right-6 bg-luxuryGold/10 backdrop-blur-md border border-luxuryGold/30 text-luxuryGold text-[10px] uppercase tracking-ultra px-3.5 py-1 rounded-full font-medium">
                {selectedBox.badge}
              </div>
            </div>

            {/* Selected Fillings Tray Summary */}
            <div className="bg-secondaryBg border border-divider p-6 rounded-card space-y-4">
              <h4 className="font-serif text-lg text-primaryText flex items-center gap-2">
                <PackageCheck size={18} className="text-luxuryGold" />
                Vessel Compartment Contents ({compartmentCount} Slots)
              </h4>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {selectedFillings.map((item, idx) => (
                  <div key={idx} className="p-2.5 bg-background border border-divider text-center space-y-1">
                    <span className="text-[9px] uppercase tracking-ultra text-luxuryGold block font-medium">Slot #{idx + 1}</span>
                    <p className="text-xs font-serif text-primaryText line-clamp-1">{item.name}</p>
                    <span className="text-[10px] text-secondaryText" suppressHydrationWarning>{formatPrice(item.price)}</span>
                  </div>
                ))}
              </div>
            </div>

          </div>
        </div>

        {/* RIGHT COLUMN: 4-Step Interactive Configuration Panel */}
        <div className="w-full lg:w-1/2 space-y-10 animate-fade-in">
          
          {/* Step Progress Bar */}
          <div className="flex justify-between items-center border-b border-divider pb-6">
            {[
              { step: 1, label: "Box Vessel" },
              { step: 2, label: "Fillings" },
              { step: 3, label: "Engraving" },
              { step: 4, label: "Seal & Finish" },
            ].map((s) => (
              <button
                key={s.step}
                onClick={() => setCurrentStep(s.step)}
                className={`flex items-center gap-2 text-xs uppercase tracking-widest transition-colors ${
                  currentStep === s.step ? 'text-luxuryGold font-medium' : 'text-mutedText hover:text-primaryText'
                }`}
              >
                <span className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] ${
                  currentStep === s.step ? 'bg-luxuryGold text-background font-bold' : 'border border-divider'
                }`}>
                  {s.step}
                </span>
                <span className="hidden sm:inline">{s.label}</span>
              </button>
            ))}
          </div>

          {/* STEP 1: Box Style Selection */}
          {currentStep === 1 && (
            <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-6">
              <div>
                <h3 className="font-serif text-2xl md:text-3xl text-primaryText mb-2">Select Box Vessel Finish</h3>
                <p className="text-secondaryText text-sm font-light">Choose the outer handcrafted packaging vessel for your gift set.</p>
              </div>

              <div className="space-y-4">
                {BOX_STYLES.map((box) => (
                  <div 
                    key={box.id}
                    onClick={() => setSelectedBox(box)}
                    className={`p-6 border rounded-card cursor-pointer transition-all flex gap-6 items-center bg-secondaryBg ${
                      selectedBox.id === box.id ? 'border-luxuryGold shadow-[0_0_20px_rgba(212,175,55,0.2)]' : 'border-divider hover:border-luxuryGold/40'
                    }`}
                  >
                    <div className="w-20 h-24 relative flex-shrink-0 border border-divider">
                      <Image src={box.image} alt={box.name} fill className="object-cover" />
                    </div>
                    <div className="flex-grow space-y-1">
                      <div className="flex justify-between items-center">
                        <h4 className="font-serif text-xl text-primaryText">{box.name}</h4>
                        <span className="font-serif text-luxuryGold text-lg" suppressHydrationWarning>{formatPrice(box.price)}</span>
                      </div>
                      <p className="text-secondaryText text-xs leading-relaxed font-light">{box.description}</p>
                    </div>
                  </div>
                ))}
              </div>

              <button 
                onClick={() => setCurrentStep(2)}
                className="luxury-button w-full h-12 text-xs uppercase tracking-ultra mt-6"
              >
                Proceed to Fillings →
              </button>
            </motion.div>
          )}

          {/* STEP 2: Compartments & Almond Selection */}
          {currentStep === 2 && (
            <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-8">
              <div>
                <h3 className="font-serif text-2xl md:text-3xl text-primaryText mb-2">Configure Box Compartments</h3>
                <p className="text-secondaryText text-sm font-light">Choose the number of inner compartments and select almond varieties.</p>
              </div>

              {/* Compartment Count Toggle */}
              <div className="space-y-3">
                <label className="text-xs uppercase tracking-widest text-secondaryText font-medium">Compartment Count</label>
                <div className="flex gap-4">
                  {([2, 3, 4] as const).map((count) => (
                    <button
                      key={count}
                      onClick={() => handleCompartmentCountChange(count)}
                      className={`flex-1 py-3 border text-xs uppercase tracking-widest font-serif transition-colors ${
                        compartmentCount === count 
                          ? 'border-luxuryGold bg-luxuryGold/10 text-luxuryGold' 
                          : 'border-divider bg-secondaryBg text-primaryText hover:border-luxuryGold/40'
                      }`}
                    >
                      {count} Slots Edition
                    </button>
                  ))}
                </div>
              </div>

              {/* Slot Selectors */}
              <div className="space-y-6">
                {selectedFillings.map((currentFilling, slotIdx) => (
                  <div key={slotIdx} className="p-5 border border-divider bg-secondaryBg space-y-3">
                    <div className="flex justify-between items-center border-b border-divider pb-2">
                      <span className="text-xs uppercase tracking-ultra text-luxuryGold font-medium">Slot #{slotIdx + 1} Selection</span>
                      <span className="text-xs text-primaryText font-serif" suppressHydrationWarning>{formatPrice(currentFilling.price)}</span>
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      {ALMOND_VARIETIES.map((varItem) => (
                        <button
                          key={varItem.id}
                          onClick={() => handleSlotFillingChange(slotIdx, varItem)}
                          className={`p-3 border text-left flex gap-3 items-center transition-colors ${
                            currentFilling.id === varItem.id
                              ? 'border-luxuryGold bg-background'
                              : 'border-divider bg-secondaryBg/50 opacity-60 hover:opacity-100'
                          }`}
                        >
                          <div className="w-10 h-12 relative flex-shrink-0">
                            <Image src={varItem.image} alt={varItem.name} fill className="object-cover" />
                          </div>
                          <div>
                            <p className="text-xs font-serif text-primaryText line-clamp-1">{varItem.name}</p>
                            <span className="text-[9px] uppercase tracking-wider text-luxuryGold">{varItem.tag}</span>
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>
                ))}
              </div>

              <div className="flex gap-4">
                <button onClick={() => setCurrentStep(1)} className="luxury-button-outline flex-1 h-12 text-xs uppercase tracking-ultra">
                  ← Back
                </button>
                <button onClick={() => setCurrentStep(3)} className="luxury-button flex-1 h-12 text-xs uppercase tracking-ultra">
                  Proceed to Engraving →
                </button>
              </div>
            </motion.div>
          )}

          {/* STEP 3: Laser Engraving Customizer */}
          {currentStep === 3 && (
            <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-8">
              <div>
                <h3 className="font-serif text-2xl md:text-3xl text-primaryText mb-2">Bespoke Laser Engraving</h3>
                <p className="text-secondaryText text-sm font-light">Enter custom initials, family crest monogram, or personal gift message to be laser-engraved in 24k gold leaf on the box lid.</p>
              </div>

              <div className="space-y-4 bg-secondaryBg p-6 border border-divider">
                <label className="text-xs uppercase tracking-widest text-secondaryText font-medium block">
                  Engraving Inscription (Max 24 Characters)
                </label>
                <input 
                  type="text" 
                  maxLength={24}
                  value={engravingText}
                  onChange={(e) => setEngravingText(e.target.value.toUpperCase())}
                  placeholder="E.G. AUREMONT 2026"
                  className="w-full h-14 bg-background border border-divider px-4 font-serif text-xl tracking-widest text-primaryText outline-none focus:border-luxuryGold transition-colors uppercase"
                />
                <p className="text-[10px] text-mutedText italic">
                  Complimentary 24k gold foil leaf laser etching applied by our master artisans in San Francisco.
                </p>
              </div>

              <div className="flex gap-4">
                <button onClick={() => setCurrentStep(2)} className="luxury-button-outline flex-1 h-12 text-xs uppercase tracking-ultra">
                  ← Back
                </button>
                <button onClick={() => setCurrentStep(4)} className="luxury-button flex-1 h-12 text-xs uppercase tracking-ultra">
                  Proceed to Wax Seal →
                </button>
              </div>
            </motion.div>
          )}

          {/* STEP 4: Wax Seal & Summary */}
          {currentStep === 4 && (
            <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-8">
              <div>
                <h3 className="font-serif text-2xl md:text-3xl text-primaryText mb-2">Wax Seal & Concierge Summary</h3>
                <p className="text-secondaryText text-sm font-light">Select your hand-stamped wax seal accent to complete your bespoke gift box.</p>
              </div>

              <div className="space-y-4">
                <label className="text-xs uppercase tracking-widest text-secondaryText font-medium block">Wax Seal Color</label>
                <div className="grid grid-cols-3 gap-4">
                  {WAX_SEALS.map((seal) => (
                    <button
                      key={seal.id}
                      onClick={() => setSelectedSeal(seal)}
                      className={`p-4 border text-center flex flex-col items-center gap-2 transition-colors ${
                        selectedSeal.id === seal.id
                          ? 'border-luxuryGold bg-luxuryGold/10'
                          : 'border-divider bg-secondaryBg'
                      }`}
                    >
                      <div className="w-6 h-6 rounded-full border border-white/30" style={{ backgroundColor: seal.color }} />
                      <span className="text-xs font-serif text-primaryText">{seal.name}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Order Total Breakdown Card */}
              <div className="p-8 bg-secondaryBg border border-luxuryGold/40 space-y-6">
                <h4 className="font-serif text-2xl text-primaryText border-b border-divider pb-4">Bespoke Summary</h4>
                
                <div className="space-y-3 text-sm text-secondaryText">
                  <div className="flex justify-between">
                    <span>{selectedBox.name}</span>
                    <span className="text-primaryText" suppressHydrationWarning>{formatPrice(selectedBox.price)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>{compartmentCount}x Reserve Almond Fillings</span>
                    <span className="text-primaryText" suppressHydrationWarning>{formatPrice(fillingsTotal)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>24k Gold Laser Engraving</span>
                    <span className="text-luxuryGold uppercase text-xs font-medium">Complimentary</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Insured Vault Dispatch</span>
                    <span className="text-luxuryGold uppercase text-xs font-medium">Complimentary</span>
                  </div>
                </div>

                <div className="border-t border-divider pt-6 flex justify-between font-serif text-3xl text-primaryText">
                  <span>Grand Total</span>
                  <span className="text-luxuryGold" suppressHydrationWarning>{formatPrice(grandTotal)}</span>
                </div>

                <button
                  onClick={handleAddToCart}
                  disabled={addingToCart}
                  className="luxury-button w-full py-4 text-xs tracking-ultra flex items-center justify-center gap-3 disabled:opacity-50"
                >
                  <ShoppingBag size={18} />
                  {addingToCart ? "Adding Custom Box..." : "Add Bespoke Box to Cart"}
                </button>
              </div>
            </motion.div>
          )}

        </div>

      </div>
    </div>
  );
}
