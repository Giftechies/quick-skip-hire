import { cn } from "@/lib/utils";
import { Check, MapPin } from "lucide-react";
import React from "react";

export default function ProgressBar({ className,currentStep, setCurrentStep, steps }) {
  const Handlestate = (idx) => {
    if (idx <= currentStep) {
      setCurrentStep(idx);
    }
  };

  return (
    <div className={cn("relative flex items-center justify-between w-full max-w-[900px] mx-auto",className)}>
      {steps.map((step, idx) => {
        const isClickable = idx <= currentStep;

        return (
          <div key={idx} className="relative flex-1 flex flex-col items-center  ">
            {/* Circle */}
            
            <div
              onClick={() => Handlestate(idx)}
              className={cn(
                ` z-50 w-10 h-10 rounded-full flex items-center justify-center text-sm font-semibold`,
                {
                  "cursor-pointer": isClickable,
                  "cursor-not-allowed opacity-50": !isClickable, // 🚫 disable future steps
                  "bg-primary text-white": idx === currentStep,
                  "bg-green-600 text-white": idx < currentStep,
                  "bg-gray-300 text-black!": idx > currentStep,
                }
              )}
            >
              {idx < currentStep ? <Check /> : idx + 1}
            </div>

            {/* Step Title */}
            <span className="text-xs font-semibold mt-1 text-center">{step.title}</span>

            {/* Connector line (background gray) */}
            {idx < steps.length - 1 && (
              <div
                className="absolute top-[35%] left-[68%] md:left-[60%] bg-gray-300 h-2 w-[62%] md:w-[80%] z-35 transition-all -translate-y-1/2 "
                
              ></div>
            )}

            {/* Connector line (active progress) */}
            {idx < steps.length - 1 && (
              <div
                className={cn(
                  "absolute top-[35%] left-1/2 -translate-y-1/2 h-2 w-0 z-40 theme-transition-3",
                  {
                    "bg-green-600 w-full": idx < currentStep,
                  }
                )}
              ></div>
            )}
          </div>
        );
      })}
    </div>
  );
}
