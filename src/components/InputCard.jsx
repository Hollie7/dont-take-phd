import React from 'react';
import { Sparkles } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';

export const InputCard = ({ advisorInput, setAdvisorInput, isGenerating, onGenerate }) => {
  const { t, tf } = useLanguage();
  
  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-8">
      {/* 标题 */}
      <div className="mb-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-2">
          {t('input.title')}
        </h2>
        <p className="text-sm text-gray-500 leading-relaxed">
          {t('input.placeholder')}
        </p>
      </div>

      {/* 输入区域 */}
      <div className="relative mb-6">
        <textarea
          value={advisorInput}
          onChange={(e) => setAdvisorInput(e.target.value)}
          placeholder={t('input.placeholder')}
          className="w-full bg-white border border-gray-200 text-gray-900 px-4 py-3 rounded-lg resize-none h-48 placeholder-gray-400 focus:border-gray-900 focus:outline-none transition-colors text-sm leading-relaxed"
        />
        
        {/* 字符计数器 */}
        <div className="absolute bottom-3 right-3 text-xs text-gray-400 bg-white px-2">
          {tf('input.charCount', { count: advisorInput.length })}
        </div>
      </div>

      {/* 按钮 */}
      <button
        onClick={onGenerate}
        disabled={!advisorInput.trim() || isGenerating}
        className="w-full bg-black hover:bg-gray-800 text-white font-medium py-3 px-6 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 transition-colors text-sm"
      >
        {isGenerating ? (
          <>
            <Sparkles className="w-4 h-4 animate-spin" />
            <span>{t('input.buttonGenerating')}</span>
          </>
        ) : (
          <span>{t('input.button')}</span>
        )}
      </button>

      {/* 底部状态 */}
      <div className="mt-6 flex justify-between items-center text-xs text-gray-400">
        <span>{t('input.statusReady')}</span>
        <span className="flex items-center gap-2">
          <span className="w-1.5 h-1.5 bg-green-500 rounded-full"></span>
          {t('input.statusOnline')}
        </span>
      </div>
    </div>
  );
};