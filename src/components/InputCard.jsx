import React from 'react';
import { Sparkles, Link } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';

export const InputCard = ({ 
  inputMode, 
  setInputMode,
  advisorInput, 
  setAdvisorInput, 
  urlInput,
  setUrlInput,
  isGenerating, 
  onGenerate 
}) => {
  const { t, tf } = useLanguage();
  
  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
      {/* 标题 */}
      <div className="mb-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-2">
          {t('input.title')}
        </h2>
        <p className="text-sm text-gray-500 leading-relaxed">
          {t('input.subtitle')}
        </p>
      </div>

      {/* 模式切换 */}
      <div className="flex gap-2 mb-6">
        <button
          onClick={() => setInputMode('text')}
          className={`flex-1 py-2.5 px-4 rounded-lg text-sm font-medium transition-all ${
            inputMode === 'text'
              ? 'bg-gray-900 text-white'
              : 'bg-gray-50 text-gray-600 hover:bg-gray-100'
          }`}
        >
          {t('input.modeText')}
        </button>
        <button
          onClick={() => setInputMode('url')}
          className={`flex-1 py-2.5 px-4 rounded-lg text-sm font-medium transition-all ${
            inputMode === 'url'
              ? 'bg-gray-900 text-white'
              : 'bg-gray-50 text-gray-600 hover:bg-gray-100'
          }`}
        >
          {t('input.modeUrl')}
        </button>
      </div>

      {/* 输入区域 */}
      <div className="relative mb-6">
        {inputMode === 'text' ? (
          <>
            <textarea
              value={advisorInput}
              onChange={(e) => setAdvisorInput(e.target.value)}
              placeholder={t('input.placeholder')}
              className="w-full bg-gray-50 border border-gray-200 text-gray-900 px-4 py-3 rounded-xl resize-none h-48 placeholder-gray-400 focus:border-gray-900 focus:outline-none transition-colors text-sm leading-relaxed"
            />
            {/* 字符计数器 */}
            <div className="absolute bottom-3 right-3 text-xs text-gray-400 bg-white px-2">
              {tf('input.charCount', { count: advisorInput.length })}
            </div>
          </>
        ) : (
          <div>
            <div className="relative">
              <input
                type="url"
                value={urlInput}
                onChange={(e) => setUrlInput(e.target.value)}
                placeholder={t('input.urlPlaceholder')}
                className="w-full bg-gray-50 border border-gray-200 text-gray-900 px-4 py-3 pl-10 rounded-xl placeholder-gray-400 focus:border-gray-900 focus:outline-none transition-colors text-sm"
              />
              <Link className="absolute left-3 top-3.5 w-4 h-4 text-gray-400" />
            </div>
            {/* URL 示例 */}
            <div className="mt-3 text-xs text-gray-500">
              <span className="font-medium">{t('input.urlExample')}:</span> https://example.edu/~professor
            </div>
          </div>
        )}
      </div>

      {/* 按钮 */}
      <button
        onClick={onGenerate}
        disabled={
          isGenerating || 
          (inputMode === 'text' && !advisorInput.trim()) ||
          (inputMode === 'url' && !urlInput.trim())
        }
        className="w-full bg-gray-900 hover:bg-gray-800 text-white font-medium py-4 px-6 rounded-xl disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 transition-colors shadow-sm"
      >
        {isGenerating ? (
          <>
            <Sparkles className="w-5 h-5 animate-spin" />
            <span>{t('input.buttonGenerating')}</span>
          </>
        ) : (
          <span>{t('input.button')}</span>
        )}
      </button>

      {/* 底部状态 */}
      <div className="mt-6 flex justify-between items-center text-sm text-gray-500">
        <span>{t('input.statusReady')}</span>
        <span className="flex items-center gap-2">
          <span className="w-2 h-2 bg-green-500 rounded-full"></span>
          {t('input.statusOnline')}
        </span>
      </div>
    </div>
  );
};