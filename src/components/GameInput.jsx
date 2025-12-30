import React from 'react';
import { Send } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';

export const GameInput = ({ value, onChange, onSend, disabled }) => {
  const { t } = useLanguage();
  
  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      onSend();
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4">
      <div className="flex gap-3">
        <textarea
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder={t('gameInput.placeholder')}
          disabled={disabled}
          className="flex-1 bg-gray-50 border border-gray-200 text-gray-900 px-4 py-3 rounded-xl resize-none focus:outline-none focus:border-gray-900 disabled:opacity-50 transition-colors text-sm leading-relaxed"
          rows="3"
        />
        <button
          onClick={onSend}
          disabled={!value.trim() || disabled}
          className="bg-gray-900 hover:bg-gray-800 text-white px-6 rounded-xl disabled:opacity-50 disabled:cursor-not-allowed transition-colors shadow-sm flex items-center justify-center"
        >
          <Send className="w-5 h-5" />
        </button>
      </div>
      <p className="text-gray-400 text-xs mt-3">
        {t('gameInput.hint')}
      </p>
    </div>
  );
};