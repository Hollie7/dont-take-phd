import React from 'react';
import { Lightbulb } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';

export const InfoCard = () => {
  const { t } = useLanguage();
  
  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
      {/* 标题 */}
      <div className="flex items-center gap-3 mb-6 pb-5 border-b border-gray-100">
        <div className="w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center">
          <Lightbulb className="w-4 h-4 text-gray-700" />
        </div>
        <h3 className="font-semibold text-gray-900 text-base">
          {t('gameInfo.title')}
        </h3>
      </div>

      {/* 列表 */}
      <div className="space-y-4 text-gray-600">
        <div className="flex items-start gap-3">
          <div className="w-6 h-6 bg-gray-100 rounded-md flex items-center justify-center flex-shrink-0 mt-0.5">
            <span className="text-gray-700 text-xs font-medium">1</span>
          </div>
          <span className="text-sm leading-relaxed">{t('gameInfo.point1')}</span>
        </div>
        <div className="flex items-start gap-3">
          <div className="w-6 h-6 bg-gray-100 rounded-md flex items-center justify-center flex-shrink-0 mt-0.5">
            <span className="text-gray-700 text-xs font-medium">2</span>
          </div>
          <span className="text-sm leading-relaxed">{t('gameInfo.point2')}</span>
        </div>
        <div className="flex items-start gap-3">
          <div className="w-6 h-6 bg-gray-100 rounded-md flex items-center justify-center flex-shrink-0 mt-0.5">
            <span className="text-gray-700 text-xs font-medium">3</span>
          </div>
          <span className="text-sm leading-relaxed">{t('gameInfo.point3')}</span>
        </div>
      </div>

      {/* 提示信息 */}
      <div className="mt-4 pt-4 border-t border-gray-100">
        <p className="text-xs text-gray-500 leading-relaxed">
          {t('gameInfo.tip')}
        </p>
      </div>
    </div>
  );
};