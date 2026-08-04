"use client";

import React from "react";
import { Sparkles } from "lucide-react";

interface FlavorMetric {
  label: string;
  score: number; // 0-100
}

const DEFAULT_METRICS: FlavorMetric[] = [
  { label: "Crunch Intensity", score: 95 },
  { label: "Natural Butteriness", score: 90 },
  { label: "Roast Depth", score: 88 },
  { label: "Sea Salt Harmony", score: 85 },
  { label: "Nutritional Density", score: 98 },
];

export default function FlavorRadarChart({ metrics = DEFAULT_METRICS }: { metrics?: FlavorMetric[] }) {
  const numSides = metrics.length;
  const radius = 90;
  const center = 120;
  const angleStep = (Math.PI * 2) / numSides;

  // Calculate polygon points
  const points = metrics.map((m, i) => {
    const angle = i * angleStep - Math.PI / 2;
    const r = (m.score / 100) * radius;
    const x = center + r * Math.cos(angle);
    const y = center + r * Math.sin(angle);
    return `${x},${y}`;
  }).join(" ");

  // Grid background circles
  const gridLevels = [0.25, 0.5, 0.75, 1];

  return (
    <div className="w-full bg-secondaryBg/80 border border-divider rounded-card p-6 space-y-4">
      <div className="flex items-center justify-between border-b border-divider/60 pb-3">
        <div className="flex items-center gap-2">
          <Sparkles size={14} className="text-luxuryGold" />
          <h4 className="text-xs uppercase tracking-ultra text-primaryText font-serif">Botanical Flavor & Texture Profile</h4>
        </div>
        <span className="text-[9px] uppercase tracking-ultra text-luxuryGold font-medium bg-luxuryGold/10 px-2.5 py-0.5 border border-luxuryGold/20 rounded-full">
          Master Sommelier Certified
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
        {/* SVG Polygon Radar */}
        <div className="relative flex justify-center items-center py-2">
          <svg width="240" height="240" viewBox="0 0 240 240" className="overflow-visible">
            {/* Background Radial Grid Lines */}
            {gridLevels.map((lvl, idx) => {
              const gridPoints = metrics.map((_, i) => {
                const angle = i * angleStep - Math.PI / 2;
                const r = lvl * radius;
                const x = center + r * Math.cos(angle);
                const y = center + r * Math.sin(angle);
                return `${x},${y}`;
              }).join(" ");

              return (
                <polygon
                  key={idx}
                  points={gridPoints}
                  fill="none"
                  stroke="#262626"
                  strokeWidth="1"
                  strokeDasharray={idx < 3 ? "2 2" : undefined}
                />
              );
            })}

            {/* Axis Spoke Lines */}
            {metrics.map((_, i) => {
              const angle = i * angleStep - Math.PI / 2;
              const x = center + radius * Math.cos(angle);
              const y = center + radius * Math.sin(angle);
              return (
                <line
                  key={i}
                  x1={center}
                  y1={center}
                  x2={x}
                  y2={y}
                  stroke="#333333"
                  strokeWidth="1"
                />
              );
            })}

            {/* Polygon Data Fill */}
            <polygon
              points={points}
              fill="rgba(212, 175, 55, 0.25)"
              stroke="#D4AF37"
              strokeWidth="2"
              className="transition-all duration-1000 ease-out"
            />

            {/* Interactive Glowing Nodes */}
            {metrics.map((m, i) => {
              const angle = i * angleStep - Math.PI / 2;
              const r = (m.score / 100) * radius;
              const x = center + r * Math.cos(angle);
              const y = center + r * Math.sin(angle);
              return (
                <g key={i} className="group cursor-pointer">
                  <circle cx={x} cy={y} r="4" fill="#D4AF37" className="group-hover:scale-150 transition-transform" />
                  <circle cx={x} cy={y} r="8" fill="none" stroke="#D4AF37" strokeWidth="1" className="opacity-40 animate-ping" />
                </g>
              );
            })}
          </svg>
        </div>

        {/* Legend Score Bars */}
        <div className="space-y-3">
          {metrics.map((m, idx) => (
            <div key={idx} className="space-y-1">
              <div className="flex justify-between items-center text-[10px] uppercase tracking-ultra">
                <span className="text-secondaryText">{m.label}</span>
                <span className="text-luxuryGold font-medium">{m.score}%</span>
              </div>
              <div className="w-full h-1.5 bg-background rounded-full overflow-hidden border border-divider">
                <div 
                  className="h-full bg-gradient-to-r from-goldDark via-luxuryGold to-goldHover rounded-full transition-all duration-1000" 
                  style={{ width: `${m.score}%` }} 
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
