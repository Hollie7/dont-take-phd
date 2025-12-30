import React from 'react';

export const SatisfactionBar = ({ satisfaction }) => {
  const getSatisfactionColor = (value) => {
    if (value >= 80) return 'bg-green-500';
    if (value >= 60) return 'bg-yellow-500';
    if (value >= 40) return 'bg-orange-500';
    return 'bg-red-500';
  };

  return (
    <div className="w-64">
      {/* 标签和百分比 */}
      <div className="flex justify-between items-center mb-2">
        <span className="text-xs text-gray-500">Satisfaction</span>
        <span className="text-sm font-medium text-gray-900">{satisfaction}%</span>
      </div>
      
      {/* 进度条 */}
      <div className="w-full bg-gray-100 rounded-full h-1.5 overflow-hidden">
        <div 
          className={`h-full transition-all duration-500 ${getSatisfactionColor(satisfaction)}`}
          style={{ width: `${satisfaction}%` }}
        />
      </div>
    </div>
  );
};