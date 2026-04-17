import React from 'react';
import { ArrowLeft, ArrowRight, CheckCircle2, X } from 'lucide-react';

interface StepNavigationProps {
  step: number;
  isStepValid: boolean;
  termsAccepted?: boolean;
  onPrev: () => void;
  onNext: () => void;
  onSubmit: () => void;
  onCancel: () => void;
}

export const StepNavigation: React.FC<StepNavigationProps> = ({
  step,
  isStepValid,
  termsAccepted,
  onPrev,
  onNext,
  onSubmit,
  onCancel
}) => {
  return (
    <div className="fixed bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-zinc-950 via-zinc-950/90 to-transparent z-20 pb-[calc(1.5rem+env(safe-area-inset-bottom))]">
      <div className="max-w-2xl mx-auto flex items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <button
            onClick={onCancel}
            className="p-5 rounded-2xl bg-red-500/10 text-red-500 border border-red-500/20 hover:bg-red-500/20 transition-all shrink-0 active:scale-90"
            aria-label="Cancel"
            title="Cancel and return to home"
          >
            <X className="w-6 h-6" />
          </button>
          <button
            onClick={onPrev}
            disabled={step === 1}
            className="p-5 rounded-2xl bg-zinc-900/50 backdrop-blur-xl text-zinc-400 border border-white/5 hover:bg-zinc-800 disabled:opacity-20 disabled:cursor-not-allowed transition-all shrink-0 active:scale-90"
            aria-label="Previous step"
          >
            <ArrowLeft className="w-6 h-6" />
          </button>
        </div>
        
        {step < 8 ? (
          <button
            onClick={onNext}
            disabled={!isStepValid}
            className="flex-1 flex items-center justify-center gap-3 px-8 py-5 bg-neon text-black font-black text-xl rounded-2xl md:rounded-3xl hover:shadow-[0_0_30px_rgba(204,255,0,0.3)] disabled:opacity-30 disabled:cursor-not-allowed transition-all active:scale-[0.95] font-display uppercase italic"
          >
            Next Step
            <ArrowRight className="w-6 h-6" />
          </button>
        ) : (
          <button
            onClick={onSubmit}
            disabled={!termsAccepted}
            className="flex-1 flex items-center justify-center gap-3 px-8 py-5 bg-neon text-black font-black text-xl rounded-2xl md:rounded-3xl hover:shadow-[0_0_40px_rgba(204,255,0,0.4)] transition-all active:scale-[0.95] shadow-lg font-display uppercase italic disabled:opacity-30 disabled:cursor-not-allowed"
          >
            Generate Plan
            <CheckCircle2 className="w-6 h-6" />
          </button>
        )}
      </div>
    </div>
  );
};
