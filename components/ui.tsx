import React from 'react';

export const Card: React.FC<{ children: React.ReactNode; className?: string; onClick?: () => void }> = ({ children, className = '', onClick }) => (
  <div 
    onClick={onClick}
    className={`bg-slate-900 border border-slate-800 rounded-2xl p-4 shadow-lg ${className}`}
  >
    {children}
  </div>
);

export const NeonButton: React.FC<{ 
  children: React.ReactNode; 
  onClick?: () => void; 
  variant?: 'blue' | 'lime' | 'danger';
  className?: string;
  disabled?: boolean;
}> = ({ children, onClick, variant = 'blue', className = '', disabled }) => {
  const colors = {
    blue: 'bg-cyan-500 hover:bg-cyan-400 text-slate-950 shadow-[0_0_15px_rgba(6,182,212,0.4)]',
    lime: 'bg-lime-500 hover:bg-lime-400 text-slate-950 shadow-[0_0_15px_rgba(132,204,22,0.4)]',
    danger: 'bg-rose-600 hover:bg-rose-500 text-white shadow-[0_0_15px_rgba(225,29,72,0.4)]'
  };

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`
        relative px-6 py-3 rounded-xl font-bold transition-all active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed
        ${colors[variant]}
        ${className}
      `}
    >
      {children}
    </button>
  );
};

export const ProgressBar: React.FC<{ value: number; max: number; color?: string; height?: string }> = ({ value, max, color = 'bg-cyan-400', height = 'h-2' }) => {
  const percentage = Math.min(100, Math.max(0, (value / max) * 100));
  return (
    <div className={`w-full bg-slate-800 rounded-full overflow-hidden ${height}`}>
      <div 
        className={`${color} h-full transition-all duration-500 ease-out shadow-[0_0_10px_currentColor]`} 
        style={{ width: `${percentage}%` }}
      />
    </div>
  );
};

export const Badge: React.FC<{ children: React.ReactNode; color?: string }> = ({ children, color = 'bg-slate-800 text-slate-300' }) => (
  <span className={`px-2 py-0.5 rounded text-xs font-semibold ${color}`}>
    {children}
  </span>
);
