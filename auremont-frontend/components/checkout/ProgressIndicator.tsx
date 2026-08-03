"use client";

import { Check } from "lucide-react";

export default function ProgressIndicator({
  steps,
  currentStep
}: {
  steps: string[];
  currentStep: number;
}) {
  return (
    <div className="w-full flex items-center justify-between mb-12">
      {steps.map((step, idx) => {
        const isCompleted = idx < currentStep;
        const isActive = idx === currentStep;

        return (
          <div key={step} className="flex-1 flex items-center">
            <div className="flex flex-col items-center relative">
              <div 
                className={`w-6 h-6 rounded-full flex items-center justify-center text-xs transition-all duration-500
                  ${isCompleted ? 'bg-luxuryGold text-background' : 
                    isActive ? 'border-2 border-luxuryGold text-luxuryGold bg-background' : 
                    'border border-divider text-mutedText bg-secondaryBg'}`}
              >
                {isCompleted ? <Check size={12} strokeWidth={3} /> : (idx + 1)}
              </div>
              <span className={`absolute top-8 whitespace-nowrap text-[10px] uppercase tracking-widest font-medium transition-colors duration-500
                ${isCompleted || isActive ? 'text-primaryText' : 'text-mutedText'}`}>
                {step}
              </span>
            </div>
            
            {/* Connecting Line */}
            {idx < steps.length - 1 && (
              <div className="flex-1 h-[1px] mx-4 relative overflow-hidden bg-divider">
                <div 
                  className="absolute top-0 left-0 h-full bg-luxuryGold transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)]"
                  style={{ width: isCompleted ? '100%' : '0%' }}
                />
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
