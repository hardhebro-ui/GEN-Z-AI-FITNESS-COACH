import React from 'react';

interface UnitToggleProps {
  label: string;
  unit: string;
  onToggle: (unit: string) => void;
  options: { id: string; label: string }[];
}

export const UnitToggle: React.FC<UnitToggleProps> = ({ label, unit, onToggle, options }) => {
  return (
    <div className="flex items-center justify-between mb-2">
      <label className="block text-[10px] font-black text-zinc-500 uppercase tracking-[0.2em]">
        {label}
      </label>
      <div className="flex bg-zinc-900 rounded-xl p-1 border border-white/5">
        {options.map(opt => (
          <button
            key={opt.id}
            onClick={() => onToggle(opt.id)}
            className={`px-3 py-1 text-[10px] font-black rounded-lg transition-all ${
              unit === opt.id ? 'bg-neon text-black shadow-lg' : 'text-zinc-500'
            }`}
          >
            {opt.label}
          </button>
        ))}
      </div>
    </div>
  );
};
