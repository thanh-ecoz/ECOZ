import React from 'react';
import { Animal } from '../types';

interface AnimalCardProps {
  animal: Animal;
  onClick: () => void;
  disabled: boolean;
  status: 'default' | 'correct' | 'wrong' | 'dimmed';
}

export const AnimalCard: React.FC<AnimalCardProps> = ({ animal, onClick, disabled, status }) => {
  let baseClasses = "relative flex flex-col items-center justify-center p-4 rounded-2xl border-4 transition-all duration-300 transform aspect-square cursor-pointer select-none";
  let colorClasses = animal.color; // Using the pre-defined tailwind classes in constants
  
  if (status === 'correct') {
    colorClasses = "bg-green-400 border-green-600 scale-105 shadow-[0_0_20px_rgba(74,222,128,0.6)] z-10";
  } else if (status === 'wrong') {
    colorClasses = "bg-red-200 border-red-400 opacity-60 grayscale";
  } else if (status === 'dimmed') {
    colorClasses = "bg-gray-100 border-gray-200 opacity-40";
  } else {
    // Default hover effect
    if (!disabled) {
      baseClasses += " hover:scale-105 hover:shadow-xl hover:-translate-y-1";
    }
  }

  return (
    <div 
      onClick={disabled ? undefined : onClick}
      className={`${baseClasses} ${colorClasses}`}
    >
      <div className="text-6xl mb-2 drop-shadow-sm filter">{animal.emoji}</div>
      <div className={`font-bold text-lg md:text-xl rounded-full px-3 py-1 ${status === 'correct' ? 'bg-white text-green-700' : 'bg-white/60 text-slate-700'}`}>
        {animal.name}
      </div>
      {status === 'correct' && (
        <div className="absolute -top-2 -right-2 bg-green-500 text-white w-8 h-8 rounded-full flex items-center justify-center font-bold text-xl border-2 border-white shadow">
          ✓
        </div>
      )}
    </div>
  );
};
