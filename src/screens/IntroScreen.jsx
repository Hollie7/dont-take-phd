import React from 'react';
import { Info, Sparkles, User } from 'lucide-react';
import { AdvisorAvatar } from '../components/AdvisorAvatar';
import { useLanguage } from '../contexts/LanguageContext';
import { Background } from '../components/Background';

export const IntroScreen = ({ advisorProfile, onStartGame, onReset, onShowModal }) => {
  const { t, tf } = useLanguage();
  
  return (
    <div className="min-h-screen bg-white flex items-center justify-center p-6 relative overflow-hidden">
      <Background />

      <div className="max-w-4xl w-full relative z-10">
        {/* 标题 */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-semibold text-gray-900 mb-2">
            {t('intro.meetAdvisor') || 'Meet Your Advisor'}
          </h1>
          <p className="text-gray-500 text-sm">
            {t('intro.subtitle') || 'Get to know your potential PhD advisor'}
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {/* 左侧：导师信息卡片 */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
            {/* 导师信息 */}
            <div className="text-center">
              <div className="flex justify-center mb-6">
                <AdvisorAvatar 
                  emotion="neutral" 
                  isProcessing={false} 
                  size="xl" 
                  gender={advisorProfile.gender} 
                />
              </div>
              
              <h2 className="text-2xl font-semibold text-gray-900 mb-2">
                {advisorProfile.name}
              </h2>
              
              <p className="text-gray-600 text-sm mb-4">
                {advisorProfile.title}
              </p>

              <div className="bg-gray-50 border border-gray-100 rounded-xl p-3 mb-4">
                <p className="text-gray-700 text-sm">
                  {advisorProfile.field}
                </p>
              </div>

              <button 
                onClick={onShowModal}
                className="text-gray-600 hover:text-gray-900 text-sm flex items-center gap-2 mx-auto transition-colors"
              >
                <Info className="w-4 h-4" />
                {t('intro.viewDetails')}
              </button>
            </div>
          </div>

          {/* 右侧：游戏信息 */}
          <div className="space-y-4">
            {/* 游戏规则面板 */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <Sparkles className="w-5 h-5" />
                {t('intro.gameRules')}
              </h2>
              <ul className="text-gray-600 space-y-3 text-sm leading-relaxed">
                <li className="flex items-start gap-3">
                  <span className="text-gray-400 mt-0.5 flex-shrink-0">1.</span>
                  <span>{tf('intro.rule1', { name: advisorProfile.name })}</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-gray-400 mt-0.5 flex-shrink-0">2.</span>
                  <span>{t('intro.rule2')}</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-gray-400 mt-0.5 flex-shrink-0">3.</span>
                  <span>{t('intro.rule3')}</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-gray-400 mt-0.5 flex-shrink-0">4.</span>
                  <span>{t('intro.rule4')}</span>
                </li>
              </ul>
            </div>

            {/* 导师特征面板 */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
              <h3 className="text-base font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <User className="w-4 h-4" />
                {t('intro.advisorTraits') || 'Advisor Traits'}
              </h3>
              <div className="space-y-3">
                <div className="bg-gray-50 border border-gray-100 rounded-xl p-3">
                  <p className="text-gray-500 text-xs mb-1 font-medium">
                    {t('intro.advisorPersonality')}
                  </p>
                  <p className="text-gray-900 text-sm">{advisorProfile.personality}</p>
                </div>
                <div className="bg-gray-50 border border-gray-100 rounded-xl p-3">
                  <p className="text-gray-500 text-xs mb-1 font-medium">
                    {t('intro.researchField')}
                  </p>
                  <p className="text-gray-900 text-sm">{advisorProfile.field}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* 底部按钮 */}
        <div className="flex gap-4 mt-8">
          <button
            onClick={onReset}
            className="flex-1 bg-white hover:bg-gray-50 text-gray-700 font-medium py-4 px-6 rounded-xl border border-gray-200 transition-colors shadow-sm"
          >
            <span>← {t('intro.changeAdvisor')}</span>
          </button>

          <button
            onClick={onStartGame}
            className="flex-1 bg-gray-900 hover:bg-gray-800 text-white font-medium py-4 px-6 rounded-xl transition-colors shadow-lg"
          >
            <span>▶ {t('intro.startInterview')}</span>
          </button>
        </div>

        {/* 底部提示 */}
        <div className="mt-6 text-center">
          <p className="text-gray-400 text-sm">
            {t('intro.readyPrompt') || '▶ Press start when ready'}
          </p>
        </div>
      </div>
    </div>
  );
};