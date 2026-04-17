import React from 'react';

interface SelectableCardProps {
  selected: boolean;
  onClick: () => void;
  title: string;
  description?: string;
  image?: string;
  className?: string;
  variant?: 'large' | 'small' | 'icon';
}

export const SelectableCard: React.FC<SelectableCardProps> = ({
  selected,
  onClick,
  title,
  description,
  image,
  className = '',
  variant = 'small'
}) => {
  if (variant === 'large') {
    return (
      <button
        onClick={onClick}
        className={`relative overflow-hidden rounded-2xl border text-left transition-all group ${selected ? 'border-neon ring-1 ring-neon' : 'border-white/5 hover:border-white/10'} ${className}`}
      >
        <div className="absolute inset-0 bg-zinc-900">
          {image && (
            <img 
              src={image} 
              alt={title} 
              className="w-full h-full object-cover opacity-40 group-hover:scale-110 transition-transform duration-700" 
              referrerPolicy="no-referrer"
            />
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-950/40 to-transparent" />
        </div>
        <div className="relative p-5 h-28 flex items-end">
          <span className={`font-black uppercase italic text-sm ${selected ? 'text-neon' : 'text-white'}`}>{title}</span>
        </div>
      </button>
    );
  }

  if (variant === 'icon') {
    return (
        <button
          onClick={onClick}
          className={`relative overflow-hidden rounded-2xl border text-left transition-all group ${selected ? 'border-neon bg-neon/10' : 'border-white/5 bg-zinc-900/40'} ${className}`}
        >
          <div className="h-24 w-full bg-zinc-800 overflow-hidden">
            {image && (
              <img 
                src={image} 
                alt={title} 
                className="w-full h-full object-cover opacity-60 group-hover:scale-110 transition-transform duration-500" 
                referrerPolicy="no-referrer"
              />
            )}
          </div>
          <div className="p-4">
            <div className={`font-black uppercase italic text-sm ${selected ? 'text-neon' : 'text-white'}`}>{title}</div>
          </div>
        </button>
    );
  }

  return (
    <button
      onClick={onClick}
      className={`p-5 rounded-2xl border text-left transition-all ${selected ? 'border-neon bg-neon/10 shadow-[0_0_20px_rgba(204,255,0,0.1)]' : 'border-white/5 bg-zinc-900/40 hover:border-white/10'} ${className}`}
    >
      <div className={`font-black uppercase italic text-sm ${selected ? 'text-neon' : 'text-white'}`}>{title}</div>
      {description && <div className="text-[10px] text-zinc-500 mt-1 font-bold">{description}</div>}
    </button>
  );
};
