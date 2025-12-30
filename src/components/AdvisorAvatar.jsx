import React from 'react';
import { getAdvisorImage } from '../config/images';

export const AdvisorAvatar = ({ emotion, isProcessing, onClick, size = 'md', gender = 'female' }) => {
  const sizeClasses = {
    sm: 'w-12 h-12',
    md: 'w-16 h-16',
    lg: 'w-24 h-24',
    xl: 'w-32 h-32'
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
        className={`${sizeClasses[size]} border-2 border-gray-200 rounded-xl overflow-hidden bg-gray-50 flex items-center justify-center ${onClick ? 'cursor-pointer hover:border-gray-300' : ''} transition-all shadow-sm`}
        onClick={onClick}
      >
        <img 
          src={getAdvisorImage(emotion, isProcessing, gender)} 
          alt="导师" 
          className="w-full h-full object-contain transition-all duration-500"
          onError={(e) => {
            e.target.style.display = 'none';
            e.target.nextSibling.style.display = 'block';
          }}
        />
        <div style={{ display: 'none' }} className="text-3xl">
          {isProcessing ? '🤔' : emojiMap[emotion] || '😐'}
        </div>
        {isProcessing && (
          <div className="absolute inset-0 bg-white bg-opacity-60 flex items-center justify-center backdrop-blur-sm">
            <div className="w-3 h-3 bg-gray-900 rounded-full animate-ping"></div>
          </div>
        )}
      </div>
      {size === 'md' && (
        <div className="absolute -bottom-1 -right-1 bg-white border border-gray-200 rounded-lg px-2 py-0.5 text-sm shadow-sm">
          {isProcessing ? '🤔' : emojiMap[emotion] || '😐'}
        </div>
      )}
    </div>
  );
};