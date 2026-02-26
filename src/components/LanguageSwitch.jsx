import React from 'react';
import { useLanguage } from '../contexts/LanguageContext';

export const LanguageSwitch = () => {
  const { language, toggleLanguage } = useLanguage();

  return (
    <div className="fixed top-8 right-8 z-50">
      <button
        onClick={toggleLanguage}
        className="bg-white border border-gray-200 px-4 py-2 rounded-lg hover:border-gray-300 transition-colors shadow-sm"
      >
        <div className="flex items-center gap-3">
          <span className={`text-sm font-medium transition-colors ${
            language === 'zh' ? 'text-gray-900' : 'text-gray-400'
          }`}>
            中文
          </span>
          <div className="w-9 h-5 bg-gray-100 rounded-full relative">
            <div 
              className={`absolute top-0.5 w-4 h-4 bg-gray-900 rounded-full transition-all duration-200 ${
                language === 'en' ? 'left-4' : 'left-0.5'
              }`}
            />
          </div>
          <span className={`text-sm font-medium transition-colors ${
            language === 'en' ? 'text-gray-900' : 'text-gray-400'
          }`}>
            EN
          </span>
        </div>
      </button>
    </div>
  );
};