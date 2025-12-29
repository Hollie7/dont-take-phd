import React from 'react';
import { Lightbulb } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';

export const PixelNote = () => {
  const { t } = useLanguage();
  
  return (
    <div className="relative">
      {/* 图钉 */}
      <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 z-10">
        <svg width="20" height="20" viewBox="0 0 20 20">
          <circle cx="10" cy="10" r="8" fill="#ff4444"/>
          <circle cx="10" cy="10" r="4" fill="#cc0000"/>
        </svg>
      </div>

      {/* 纸条主体 */}
      <div className="bg-gradient-to-br from-yellow-200 via-yellow-100 to-yellow-200 p-6 border-4 border-yellow-900/30 relative transform rotate-2 hover:rotate-0 transition-transform duration-300"
        style={{
          boxShadow: '4px 4px 0px rgba(0,0,0,0.3), 8px 8px 0px rgba(0,0,0,0.1)',
          clipPath: 'polygon(2% 0%, 100% 0%, 98% 100%, 0% 100%)'
        }}>
        
        {/* 纸张纹理 */}
        <div className="absolute inset-0 opacity-5 pointer-events-none"
          style={{
            backgroundImage: 'repeating-linear-gradient(45deg, transparent, transparent 10px, #000 10px, #000 11px)',
          }}></div>

        {/* 内容 */}
        <div className="relative">
          {/* 标题 */}
          <div className="flex items-center gap-2 mb-4 pb-2 border-b-2 border-dashed border-yellow-600/30">
            <Lightbulb className="w-5 h-5 text-yellow-700" />
            <h3 className="font-bold text-yellow-900 pixel-text text-lg">
              {t('gameInfo.title')}
            </h3>
          </div>

          {/* 列表 */}
          <div className="space-y-3 text-yellow-900">
            <div className="flex items-start gap-2">
              <span className="text-pink-600 font-bold pixel-text mt-0.5">▸</span>
              <span className="text-sm leading-relaxed">{t('gameInfo.point1')}</span>
            </div>
            <div className="flex items-start gap-2">
              <span className="text-cyan-600 font-bold pixel-text mt-0.5">▸</span>
              <span className="text-sm leading-relaxed">{t('gameInfo.point2')}</span>
            </div>
            <div className="flex items-start gap-2">
              <span className="text-purple-600 font-bold pixel-text mt-0.5">▸</span>
              <span className="text-sm leading-relaxed">{t('gameInfo.point3')}</span>
            </div>
          </div>

          {/* 底部装饰 */}
          <div className="mt-4 pt-3 border-t-2 border-dashed border-yellow-600/30 text-center">
            <p className="text-xs text-yellow-700 italic pixel-text">
              {t('gameInfo.footer')}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};