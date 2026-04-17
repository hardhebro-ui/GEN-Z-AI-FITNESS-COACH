import React from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
}

export const Input: React.FC<InputProps> = ({ label, className = '', ...props }) => {
  return (
    <div>
      <label className="block text-[10px] font-black text-zinc-500 mb-2 uppercase tracking-[0.2em]">
        {label}
      </label>
      <input
        {...props}
        className={`w-full bg-zinc-900/40 border border-white/5 rounded-2xl px-5 py-4 focus:ring-2 focus:ring-neon outline-none text-white font-bold transition-all ${className}`}
      />
    </div>
  );
};

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label: string;
  options: { value: string; label: string }[];
}

export const Select: React.FC<SelectProps> = ({ label, options, className = '', ...props }) => {
  return (
    <div>
      <label className="block text-[10px] font-black text-zinc-500 mb-2 uppercase tracking-[0.2em]">
        {label}
      </label>
      <select
        {...props}
        className={`w-full bg-zinc-900/40 border border-white/5 rounded-2xl px-5 py-4 focus:ring-2 focus:ring-neon outline-none text-white font-bold transition-all appearance-none ${className}`}
      >
        <option value="" className="bg-zinc-950">Select</option>
        {options.map(opt => (
          <option key={opt.value} value={opt.value} className="bg-zinc-950">
            {opt.label}
          </option>
        ))}
      </select>
    </div>
  );
};
