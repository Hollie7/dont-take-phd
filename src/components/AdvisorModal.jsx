import React from 'react';
import { X, Sparkles, Zap, Brain, Beaker, Star, Target } from 'lucide-react';
import { AdvisorAvatar } from './AdvisorAvatar';
import { useLanguage } from '../contexts/LanguageContext';

export const AdvisorModal = ({ advisorProfile, currentEmotion, isProcessing, onClose }) => {
  const { t } = useLanguage();
  
  return (
    <div 
      className="fixed inset-0 bg-black bg-opacity-90 flex items-center justify-center p-4 z-50" 
      onClick={onClose}
    >
      <div 
        className="bg-gradient-to-b from-gray-800 to-gray-900 border-4 border-cyan-500 max-w-3xl w-full pixel-corners relative max-h-[90vh] flex flex-col shadow-2xl" 
        onClick={(e) => e.stopPropagation()}
        style={{
          boxShadow: '0 0 40px rgba(0,255,255,0.3), 0 0 80px rgba(255,0,255,0.2)'
        }}
      >
        {/* 顶部装饰条 */}
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-pink-500 via-cyan-500 to-yellow-500"></div>
        
        {/* 固定的头部 - CRT 屏幕风格 */}
        <div className="p-6 pb-4 flex-shrink-0 relative">
          {/* 关闭按钮 */}
          <button 
            onClick={onClose}
            className="absolute top-4 right-4 text-white hover:text-red-400 transition-colors bg-red-900/80 hover:bg-red-800 border-2 border-red-500 pixel-corners p-2 z-10 group"
            title={t('advisorModal.close')}
            style={{
              boxShadow: '0 0 10px rgba(255,0,0,0.5)'
            }}
          >
            <X className="w-5 h-5 group-hover:animate-pulse" />
          </button>

          {/* 显示器装饰灯 */}
          <div className="absolute top-4 left-4 flex gap-2">
            <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
            <div className="w-2 h-2 bg-yellow-500 rounded-full animate-pulse" style={{animationDelay: '0.3s'}}></div>
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" style={{animationDelay: '0.6s'}}></div>
          </div>
          
          <div className="flex items-start gap-4 mt-8">
            <div className="relative">
              <AdvisorAvatar emotion={currentEmotion} isProcessing={isProcessing} size="lg" gender={advisorProfile.gender}/>
              {/* 头像发光效果 */}
              <div className="absolute inset-0 bg-cyan-500 opacity-20 blur-xl rounded-full -z-10"></div>
            </div>
            
            <div className="flex-1 pr-12">
              <h2 className="text-3xl font-bold text-cyan-400 pixel-text mb-2"
                style={{textShadow: '0 0 10px rgba(0,255,255,0.8), 0 0 20px rgba(0,255,255,0.4)'}}>
                {advisorProfile.name}
              </h2>
              <p className="text-pink-300 mb-3 font-mono"
                style={{textShadow: '0 0 5px rgba(255,0,255,0.5)'}}>
                {advisorProfile.title} · {advisorProfile.institution}
              </p>
              <div className="bg-black/50 border-2 border-purple-500/50 p-3 pixel-corners relative overflow-hidden">
                {/* 扫描线效果 */}
                <div className="absolute inset-0 pointer-events-none opacity-10">
                  <div className="w-full h-full" style={{
                    backgroundImage: 'repeating-linear-gradient(0deg, transparent, transparent 2px, #00ff00 2px, #00ff00 4px)',
                  }}></div>
                </div>
                <p className="text-purple-200 text-sm italic relative z-10">
                  💬 "{advisorProfile.famous_quote}"
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* 可滚动的内容区域 - 街机风格 */}
        <div className="flex-1 overflow-y-auto px-6 pb-4">
          <div className="space-y-4">
            {/* 研究领域 */}
            <div className="bg-gradient-to-br from-purple-900/80 to-indigo-900/80 border-2 border-cyan-500 p-4 pixel-corners relative overflow-hidden group hover:border-pink-500 transition-colors">
              <div className="absolute top-0 right-0 w-16 h-16 bg-cyan-500 opacity-5 rounded-full -mr-8 -mt-8"></div>
              <h3 className="text-cyan-400 font-bold mb-2 flex items-center gap-2 pixel-text"
                style={{textShadow: '0 0 5px rgba(0,255,255,0.5)'}}>
                <Sparkles className="w-4 h-4" />
                {t('advisorModal.field')}
              </h3>
              <p className="text-white">{advisorProfile.field}</p>
            </div>

            {/* 研究兴趣 */}
            <div className="bg-gradient-to-br from-pink-900/80 to-purple-900/80 border-2 border-pink-500 p-4 pixel-corners relative overflow-hidden group hover:border-cyan-500 transition-colors">
              <div className="absolute bottom-0 left-0 w-16 h-16 bg-pink-500 opacity-5 rounded-full -ml-8 -mb-8"></div>
              <h3 className="text-pink-400 font-bold mb-2 flex items-center gap-2 pixel-text"
                style={{textShadow: '0 0 5px rgba(255,0,255,0.5)'}}>
                <Brain className="w-4 h-4" />
                {t('advisorModal.interests')}
              </h3>
              <ul className="text-white space-y-1">
                {advisorProfile.research_interests.map((interest, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <span className="text-cyan-400 mt-0.5">▸</span>
                    <span>{interest}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* 性格特点 */}
            <div className="bg-gradient-to-br from-yellow-900/80 to-orange-900/80 border-2 border-yellow-500 p-4 pixel-corners relative overflow-hidden group hover:border-pink-500 transition-colors">
              <div className="absolute top-0 left-0 w-16 h-16 bg-yellow-500 opacity-5 rounded-full -ml-8 -mt-8"></div>
              <h3 className="text-yellow-400 font-bold mb-2 flex items-center gap-2 pixel-text"
                style={{textShadow: '0 0 5px rgba(255,255,0,0.5)'}}>
                <Star className="w-4 h-4" />
                {t('advisorModal.personality')}
              </h3>
              <p className="text-white">{advisorProfile.personality}</p>
            </div>

            {/* 实验室风格 */}
            <div className="bg-gradient-to-br from-green-900/80 to-teal-900/80 border-2 border-green-500 p-4 pixel-corners relative overflow-hidden group hover:border-yellow-500 transition-colors">
              <div className="absolute bottom-0 right-0 w-16 h-16 bg-green-500 opacity-5 rounded-full -mr-8 -mb-8"></div>
              <h3 className="text-green-400 font-bold mb-2 flex items-center gap-2 pixel-text"
                style={{textShadow: '0 0 5px rgba(0,255,0,0.5)'}}>
                <Beaker className="w-4 h-4" />
                {t('advisorModal.labStyle')}
              </h3>
              <p className="text-white">{advisorProfile.lab_style}</p>
            </div>

            {/* 对学生的期待 */}
            <div className="bg-gradient-to-br from-orange-900/80 to-red-900/80 border-2 border-orange-500 p-4 pixel-corners relative overflow-hidden group hover:border-cyan-500 transition-colors">
              <div className="absolute top-0 right-0 w-16 h-16 bg-orange-500 opacity-5 rounded-full -mr-8 -mt-8"></div>
              <h3 className="text-orange-400 font-bold mb-2 flex items-center gap-2 pixel-text"
                style={{textShadow: '0 0 5px rgba(255,165,0,0.5)'}}>
                <Target className="w-4 h-4" />
                {t('advisorModal.expectations')}
              </h3>
              <ul className="text-white space-y-1">
                {advisorProfile.expectations.map((expectation, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <span className="text-pink-400 mt-0.5">▸</span>
                    <span>{expectation}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
        
        {/* 底部装饰条 */}
        <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-cyan-500 via-pink-500 to-yellow-500"></div>
      </div>
    </div>
  );
};