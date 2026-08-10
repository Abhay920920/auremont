"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowRight, ChevronDown, Sparkles } from "lucide-react";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";

export default function CinematicHero() {
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const handleMouseMove = (e: React.MouseEvent) => {
    if (typeof window !== "undefined") {
      const { clientX, clientY } = e;
      const { innerWidth, innerHeight } = window;
      const x = (clientX / innerWidth) * 2 - 1;
      const y = (clientY / innerHeight) * 2 - 1;
      mouseX.set(x);
      mouseY.set(y);
    }
  };

  const smoothX = useSpring(mouseX, { stiffness: 50, damping: 20 });
  const smoothY = useSpring(mouseY, { stiffness: 50, damping: 20 });

  const textX = useTransform(smoothX, [-1, 1], [-15, 15]);
  const textY = useTransform(smoothY, [-1, 1], [-15, 15]);

  const imageX = useTransform(smoothX, [-1, 1], [25, -25]);
  const imageY = useTransform(smoothY, [-1, 1], [25, -25]);

  return (
    <section 
      onMouseMove={handleMouseMove}
      className="relative w-full min-h-[100dvh] flex flex-col justify-between overflow-hidden bg-background pt-40 pb-12 lg:pt-44 lg:pb-16"
    >
      {/* Background Ambient Lighting & Radial Vignette */}
      <div className="absolute inset-0 w-full h-full -z-10 bg-[#050505] overflow-hidden">
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 lg:left-3/4 w-[500px] lg:w-[700px] h-[500px] lg:h-[700px] bg-luxuryGold/15 rounded-full blur-[160px] pointer-events-none animate-pulse-glow" />
        <div className="absolute bottom-10 left-10 w-[400px] h-[400px] bg-goldDark/10 rounded-full blur-[140px] pointer-events-none" />
        <div className="absolute inset-0 bg-gradient-to-b from-background/90 via-transparent to-background pointer-events-none" />
      </div>

      {/* Hero Container: Side-by-Side on Desktop, Centered Column on Mobile */}
      <div className="max-w-[1800px] mx-auto px-6 md:px-12 w-full flex-grow flex items-center z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center w-full">
          
          {/* LEFT: Typography & Narrative CTA */}
          <motion.div 
            style={{ x: textX, y: textY }}
            className="lg:col-span-7 flex flex-col items-center lg:items-start text-center lg:text-left space-y-6 lg:space-y-8"
          >
            <motion.div 
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full border border-luxuryGold/40 bg-background/80 backdrop-blur-md"
            >
              <Sparkles size={13} className="text-luxuryGold" />
              <span className="text-[10px] uppercase tracking-ultra text-luxuryGold font-medium">
                RARE NUTS · California Reserve Harvest 2026
              </span>
            </motion.div>
            
            <h1 className="text-4xl sm:text-6xl lg:text-7xl xl:text-[80px] font-serif text-primaryText tracking-tight leading-[0.98] drop-shadow-2xl">
              Exceptional Nuts. <br className="hidden sm:inline" />
              <span className="text-luxuryGold font-serif font-light text-2xl sm:text-4xl lg:text-5xl block mt-3">
                Chosen with Discernment.
              </span>
            </h1>

            <p className="text-sm sm:text-base lg:text-lg text-secondaryText font-light max-w-xl leading-relaxed tracking-wide">
              <span className="text-luxuryGold font-serif italic block text-lg mb-1">Exceptional by Nature. Distinct by Choice.</span>
              Hand-selected Extra Large California Almonds, slow-roasted to peak crispness and presented in bespoke velvet-lined mahogany vessels.
            </p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="pt-2 flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto"
            >
              <Link 
                href="/shop" 
                className="luxury-button w-full sm:w-auto inline-flex items-center justify-center gap-4 px-10 py-5 text-xs tracking-ultra shadow-[0_0_30px_rgba(212,175,55,0.25)] hover:shadow-[0_0_45px_rgba(212,175,55,0.45)] transition-all"
              >
                <span>Explore The Collection</span>
                <ArrowRight size={15} />
              </Link>
              <Link
                href="/about"
                className="luxury-button-outline w-full sm:w-auto inline-flex items-center justify-center px-8 py-5 text-xs tracking-ultra"
              >
                Our Heritage
              </Link>
            </motion.div>
          </motion.div>

          {/* RIGHT: Photography Showcase Frame */}
          <div className="lg:col-span-5 flex justify-center lg:justify-end">
            <motion.div 
              style={{ x: imageX, y: imageY }}
              initial={{ opacity: 0, scale: 0.92, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
              className="relative w-full max-w-[360px] sm:max-w-md lg:max-w-lg aspect-[4/5] rounded-card border border-luxuryGold/40 bg-surface/50 backdrop-blur-md overflow-hidden shadow-[0_25px_70px_rgba(0,0,0,0.9)] group"
            >
              <Image 
                src="/images/royal-almonds-wooden-box.png" 
                alt="RARE NUTS Royal Almonds Wooden Vessel" 
                fill 
                priority
                sizes="(max-width: 768px) 100vw, 50vw"
                className="object-cover object-center filter brightness-105 contrast-105 transition-transform duration-[2s] group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent opacity-85" />
              
              <div className="absolute bottom-6 left-6 right-6 flex justify-between items-end text-left border-t border-luxuryGold/20 pt-4">
                <div>
                  <p className="text-[9px] uppercase tracking-ultra text-luxuryGold font-medium">Reserve Vessel</p>
                  <p className="text-base font-serif text-primaryText">Velvet Oak Reserve Edition</p>
                </div>
                <span className="text-sm font-serif text-luxuryGold">₹1,499.00</span>
              </div>
            </motion.div>
          </div>

        </div>
      </div>

      {/* Bottom Scroll Cue */}
      <div className="pt-8 text-center z-10 flex flex-col items-center gap-2">
        <span className="text-[9px] uppercase tracking-ultra text-mutedText font-light">Scroll To Discover</span>
        <ChevronDown size={14} className="text-luxuryGold animate-bounce" />
      </div>
    </section>
  );
}
