import React from 'react';

export const SatisfactionBar = ({ value }) => {
  const getColor = () => {
    if (value >= 70) return 'bg-green-500';
    if (value >= 30) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  return (
    <div className="text-right">
      <p className="text-indigo-300 text-xs mb-1">满意度</p>
      <div className="w-48 h-6 bg-indigo-950 border-2 border-indigo-500 pixel-corners overflow-hidden">
        <div 
          className={`h-full transition-all duration-700 ${getColor()}`}
          style={{ width: `${value}%` }}
        />
      </div>
      <p className="text-white text-sm mt-1">{value}/100</p>
    </div>
  );
};