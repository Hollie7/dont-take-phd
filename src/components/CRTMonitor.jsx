import React from 'react';
import { Sparkles } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';

export const CRTMonitor = ({ advisorInput, setAdvisorInput, isGenerating, onGenerate }) => {
  const { t, tf } = useLanguage();
  
  return (
    <div className="relative">
      {/* 显示器外壳 */}
      <div className="bg-gradient-to-b from-gray-700 to-gray-900 p-8 rounded-lg border-4 border-gray-600 shadow-2xl">
        {/* 显示器顶部装饰 */}
        <div className="absolute -top-2 left-1/2 transform -translate-x-1/2 bg-gray-800 px-4 py-1 rounded-t-lg border-2 border-gray-600">
          <div className="flex gap-2">
            <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
            <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
          </div>
        </div>

        {/* CRT 屏幕 */}
        <div className="relative bg-black rounded-lg p-6 border-4 border-gray-800 overflow-hidden">
          {/* 扫描线效果 */}
          <div className="absolute inset-0 pointer-events-none z-10">
            <div className="w-full h-full opacity-10" style={{
              backgroundImage: 'repeating-linear-gradient(0deg, transparent, transparent 2px, #00ff00 2px, #00ff00 4px)',
            }}></div>
          </div>

          {/* 屏幕发光效果 */}
          <div className="absolute inset-0 bg-gradient-radial from-cyan-900/20 via-transparent to-transparent pointer-events-none"></div>

          {/* 屏幕内容 */}
          <div className="relative z-20">
            {/* 闪烁的提示符 */}
            <div className="mb-4 font-mono text-green-400 text-sm flex items-center gap-2">
              <span className="animate-pulse">{'>'}</span>
              <span className="text-cyan-400">{t('input.title')}</span>
            </div>

            {/* 输入区域 */}
            <div className="relative mb-4">
              <textarea
                value={advisorInput}
                onChange={(e) => setAdvisorInput(e.target.value)}
                placeholder={t('input.placeholder')}
                className="w-full bg-gray-900/80 border-2 border-green-500/50 text-green-400 font-mono p-4 rounded resize-none h-40 placeholder-green-700 focus:border-cyan-500 focus:outline-none focus:ring-2 focus:ring-cyan-500/50 transition-all"
                style={{
                  textShadow: '0 0 5px rgba(0, 255, 0, 0.5)',
                  caretColor: '#00ff00'
                }}
              />
              
              {/* 字符计数器 */}
              <div className="absolute bottom-2 right-2 text-xs font-mono text-green-600">
                {tf('input.charCount', { count: advisorInput.length })}
              </div>
            </div>

            {/* 按钮 */}
            <button
              onClick={onGenerate}
              disabled={!advisorInput.trim() || isGenerating}
              className="w-full relative group"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-pink-500 to-cyan-500 blur-lg opacity-50 group-hover:opacity-75 transition-opacity"></div>
              <div className="relative bg-gradient-to-r from-pink-600 to-cyan-600 hover:from-pink-500 hover:to-cyan-500 text-white font-bold py-4 px-6 border-4 border-pink-400 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 transition-all pixel-corners shadow-lg">
                {isGenerating ? (
                  <>
                    <Sparkles className="w-5 h-5 animate-spin" />
                    <span className="pixel-text tracking-wider animate-pulse">
                      {t('input.buttonGenerating')}
                    </span>
                  </>
                ) : (
                  <>
                    <span className="pixel-text text-xl tracking-wider">
                      {t('input.button')}
                    </span>
                  </>
                )}
              </div>
            </button>

            {/* 底部状态栏 */}
            <div className="mt-4 flex justify-between items-center text-xs font-mono text-green-600">
              <span>{t('input.statusReady')}</span>
              <span className="flex items-center gap-1">
                <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse"></span>
                {t('input.statusOnline')}
              </span>
            </div>
          </div>
        </div>

        {/* 显示器底座 */}
        <div className="mt-4 mx-auto w-32 h-3 bg-gradient-to-b from-gray-700 to-gray-900 rounded-b-lg border-2 border-gray-600"></div>
      </div>
    </div>
  );
};