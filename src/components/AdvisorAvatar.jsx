import React from 'react';
import { getAdvisorImage } from '../config/images';

export const AdvisorAvatar = ({ emotion, isProcessing, onClick, size = 'md' }) => {
  const sizeClasses = {
    sm: 'w-16 h-16',
    md: 'w-20 h-20',
    lg: 'w-32 h-32',
    xl: 'w-40 h-40'
  };

  const emojiMap = {
    happy: '😊',
    thinking: '🤔',
    sad: '😔',
    neutral: '😐'
  };

  return (
    <div className="relative">
      <div 
        className={`${sizeClasses[size]} border-4 border-indigo-500 pixel-corners overflow-hidden bg-indigo-700 flex items-center justify-center ${onClick ? 'cursor-pointer hover:border-indigo-400' : ''} transition-all`}
        onClick={onClick}
      >
        <img 
          src={getAdvisorImage(emotion, isProcessing)} 
          alt="导师" 
          className="w-full h-full object-contain transition-all duration-500"
          onError={(e) => {
            e.target.style.display = 'none';
            e.target.nextSibling.style.display = 'block';
          }}
        />
        <div style={{ display: 'none' }} className="text-4xl">
          {isProcessing ? '🤔' : emojiMap[emotion] || '😐'}
        </div>
        {isProcessing && (
          <div className="absolute inset-0 bg-indigo-900 bg-opacity-60 flex items-center justify-center">
            <div className="w-4 h-4 bg-yellow-400 rounded-full animate-ping"></div>
          </div>
        )}
      </div>
      {size === 'md' && (
        <div className="absolute -bottom-2 -right-2 bg-indigo-900 border-2 border-indigo-600 pixel-corners px-2 py-1 text-xs text-white">
          {isProcessing ? '🤔' : emojiMap[emotion] || '😐'}
        </div>
      )}
    </div>
  );
};