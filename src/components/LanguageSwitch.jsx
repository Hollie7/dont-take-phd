import React from 'react';
import { useLanguage } from '../contexts/LanguageContext';

export const LanguageSwitch = () => {
  const { language, toggleLanguage } = useLanguage();

  return (
    <div className="fixed top-4 right-4 z-50">
      <button
        onClick={toggleLanguage}
        className="bg-gray-900/80 border-2 border-cyan-500 px-4 py-2 pixel-corners hover:border-pink-500 transition-colors group"
      >
        <div className="flex items-center gap-2">
          <span className={`pixel-text text-xs ${language === 'zh' ? 'text-cyan-400' : 'text-gray-500'}`}>
            中文
          </span>
          <div className="w-8 h-4 bg-gray-700 rounded-full relative border border-cyan-500">
            <div 
              className={`absolute top-0.5 w-3 h-3 bg-cyan-400 rounded-full transition-all duration-300 ${
                language === 'en' ? 'left-4' : 'left-0.5'
              }`}
              style={{
                boxShadow: '0 0 5px #00ffff, 0 0 10px #00ffff'
              }}
            />
          </div>
          <span className={`pixel-text text-xs ${language === 'en' ? 'text-cyan-400' : 'text-gray-500'}`}>
            EN
          </span>
        </div>
      </button>
    </div>
  );
};