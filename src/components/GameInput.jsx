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
    <div className="bg-indigo-800 border-4 border-indigo-600 p-4 pixel-corners">
      <div className="flex gap-2">
        <textarea
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder={t('gameInput.placeholder')}
          disabled={disabled}
          className="flex-1 bg-indigo-950 border-2 border-indigo-500 text-white p-3 pixel-corners resize-none focus:outline-none focus:border-indigo-400 disabled:opacity-50"
          rows="3"
        />
        <button
          onClick={onSend}
          disabled={!value.trim() || disabled}
          className="bg-blue-600 hover:bg-blue-700 text-white px-6 border-2 border-blue-800 pixel-corners disabled:opacity-50 disabled:cursor-not-allowed transition-all"
        >
          <Send className="w-5 h-5" />
        </button>
      </div>
      <p className="text-indigo-400 text-xs mt-2">
        {t('gameInput.hint')}
      </p>
    </div>
  );
};