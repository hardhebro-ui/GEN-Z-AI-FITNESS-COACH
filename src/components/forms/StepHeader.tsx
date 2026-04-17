import React from 'react';

interface StepHeaderProps {
  title: string;
  highlight: string;
  description: string;
}

export const StepHeader: React.FC<StepHeaderProps> = ({ title, highlight, description }) => {
  return (
    <div className="space-y-4">
      <h2 className="text-4xl md:text-6xl font-black tracking-tighter font-display uppercase italic leading-none">
        {title} <span className="text-neon">{highlight}</span>
      </h2>
      <p className="text-zinc-500 text-xs font-medium leading-relaxed max-w-xl">
        {description}
      </p>
    </div>
  );
};
