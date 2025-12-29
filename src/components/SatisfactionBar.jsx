import React from 'react';

export const SatisfactionBar = ({ satisfaction }) => {
  // 根据满意度确定颜色
  const getSatisfactionColor = (value) => {
    if (value >= 80) return 'bg-green-500';
    if (value >= 60) return 'bg-yellow-500';
    if (value >= 40) return 'bg-orange-500';
    return 'bg-red-500';
  };

  return (
    <div className="w-64">
      {/* 只保留进度条 */}
      <div className="w-full bg-indigo-900 rounded-full h-4 overflow-hidden border-2 border-indigo-700">
        <div 
          className={`h-full transition-all duration-500 ${getSatisfactionColor(satisfaction)}`}
          style={{ width: `${satisfaction}%` }}
        >
          <div className="w-full h-full animate-pulse opacity-50 bg-white"></div>
        </div>
      </div>
      
      {/* 只显示百分比数字 */}
      <div className="flex justify-between text-xs text-indigo-400 mt-1">
        <span>0%</span>
        <span className="font-bold text-white">{satisfaction}%</span>
        <span>100%</span>
      </div>
    </div>
  );
};