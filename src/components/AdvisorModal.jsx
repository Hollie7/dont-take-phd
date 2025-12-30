import React from 'react';
import { X, Sparkles, Brain, Beaker, Star, Target } from 'lucide-react';
import { AdvisorAvatar } from './AdvisorAvatar';
import { useLanguage } from '../contexts/LanguageContext';

export const AdvisorModal = ({ advisorProfile, currentEmotion, isProcessing, onClose }) => {
  const { t } = useLanguage();
  
  return (
    <div 
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50 backdrop-blur-sm" 
      onClick={onClose}
    >
      <div 
        className="bg-white rounded-2xl max-w-3xl w-full relative max-h-[90vh] flex flex-col shadow-xl" 
        onClick={(e) => e.stopPropagation()}
      >
        {/* 固定的头部 */}
        <div className="p-8 pb-6 flex-shrink-0 border-b border-gray-100">
          {/* 关闭按钮 */}
          <button 
            onClick={onClose}
            className="absolute top-6 right-6 text-gray-400 hover:text-gray-900 transition-colors bg-gray-50 hover:bg-gray-100 rounded-lg p-2"
            title={t('advisorModal.close')}
          >
            <X className="w-5 h-5" />
          </button>
          
          <div className="flex items-start gap-6">
            <div className="flex-shrink-0">
              <AdvisorAvatar 
                emotion={currentEmotion} 
                isProcessing={isProcessing} 
                size="lg" 
                gender={advisorProfile.gender}
              />
            </div>
            
            <div className="flex-1 pr-12">
              <h2 className="text-3xl font-semibold text-gray-900 mb-2">
                {advisorProfile.name}
              </h2>
              <p className="text-gray-600 mb-4 text-sm">
                {advisorProfile.title} · {advisorProfile.institution}
              </p>
              {/* <div className="bg-gray-50 border border-gray-100 rounded-xl p-4">
                <p className="text-gray-700 text-sm italic">
                  💬 "{advisorProfile.famous_quote}"
                </p>
              </div> */}
            </div>
          </div>
        </div>

        {/* 可滚动的内容区域 */}
        <div className="flex-1 overflow-y-auto px-8 py-6">
          <div className="space-y-5">
            {/* 研究领域 */}
            <div className="bg-gray-50 border border-gray-100 rounded-xl p-5">
              <h3 className="text-base font-semibold text-gray-900 mb-3 flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-gray-600" />
                {t('advisorModal.field')}
              </h3>
              <p className="text-gray-700 text-sm leading-relaxed">{advisorProfile.field}</p>
            </div>

            {/* 研究兴趣 */}
            <div className="bg-gray-50 border border-gray-100 rounded-xl p-5">
              <h3 className="text-base font-semibold text-gray-900 mb-3 flex items-center gap-2">
                <Brain className="w-4 h-4 text-gray-600" />
                {t('advisorModal.interests')}
              </h3>
              <ul className="text-gray-700 space-y-2 text-sm">
                {advisorProfile.research_interests.map((interest, idx) => (
                  <li key={idx} className="flex items-start gap-3">
                    <span className="text-gray-400 mt-0.5">•</span>
                    <span className="leading-relaxed">{interest}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* 性格特点 */}
            <div className="bg-gray-50 border border-gray-100 rounded-xl p-5">
              <h3 className="text-base font-semibold text-gray-900 mb-3 flex items-center gap-2">
                <Star className="w-4 h-4 text-gray-600" />
                {t('advisorModal.personality')}
              </h3>
              <p className="text-gray-700 text-sm leading-relaxed">{advisorProfile.personality}</p>
            </div>

            {/* 实验室风格 */}
            <div className="bg-gray-50 border border-gray-100 rounded-xl p-5">
              <h3 className="text-base font-semibold text-gray-900 mb-3 flex items-center gap-2">
                <Beaker className="w-4 h-4 text-gray-600" />
                {t('advisorModal.labStyle')}
              </h3>
              <p className="text-gray-700 text-sm leading-relaxed">{advisorProfile.lab_style}</p>
            </div>

            {/* 对学生的期待 */}
            <div className="bg-gray-50 border border-gray-100 rounded-xl p-5">
              <h3 className="text-base font-semibold text-gray-900 mb-3 flex items-center gap-2">
                <Target className="w-4 h-4 text-gray-600" />
                {t('advisorModal.expectations')}
              </h3>
              <ul className="text-gray-700 space-y-2 text-sm">
                {advisorProfile.expectations.map((expectation, idx) => (
                  <li key={idx} className="flex items-start gap-3">
                    <span className="text-gray-400 mt-0.5">•</span>
                    <span className="leading-relaxed">{expectation}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};