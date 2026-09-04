"use client";

import { Check } from "lucide-react";

export default function ProgressIndicator({
  steps,
  currentStep,
}: {
  steps: string[];
  currentStep: number;
}) {
  return (
    <div className="w-full flex items-center py-2 mb-8 sm:mb-10">
      {steps.map((step, idx) => {
        const isCompleted = idx < currentStep;
        const isActive = idx === currentStep;
        const isLast = idx === steps.length - 1;

        return (
          <div
            key={step}
            className={`flex items-center ${!isLast ? "flex-1" : ""}`}
          >
            <div className="flex items-center gap-2.5 sm:gap-3 flex-shrink-0">
              <div
                className={`w-7 h-7 rounded-full flex items-center justify-center text-xs transition-all duration-300 font-medium
                  ${
                    isCompleted
                      ? "bg-luxuryGold text-background shadow-sm"
                      : isActive
                      ? "border-2 border-luxuryGold text-luxuryGold bg-background"
                      : "border border-divider text-mutedText bg-secondaryBg"
                  }`}
              >
                {isCompleted ? <Check size={13} strokeWidth={2.5} /> : idx + 1}
              </div>
              <span
                className={`text-[10px] sm:text-[11px] uppercase tracking-widest font-medium transition-colors duration-300
                  ${
                    isCompleted || isActive
                      ? "text-primaryText font-semibold"
                      : "text-mutedText"
                  }`}
              >
                {step}
              </span>
            </div>

            {!isLast && (
              <div className="flex-1 h-[1px] mx-3 sm:mx-6 bg-divider relative overflow-hidden">
                <div
                  className="h-full bg-luxuryGold transition-all duration-500"
                  style={{ width: isCompleted ? "100%" : "0%" }}
                />
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
