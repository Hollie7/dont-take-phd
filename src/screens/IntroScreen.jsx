import React from 'react';
import { Info, Zap, User } from 'lucide-react';
import { AdvisorAvatar } from '../components/AdvisorAvatar';
import { useLanguage } from '../contexts/LanguageContext';
import { ArcadeBackground } from '../components/ArcadeBackground';

export const IntroScreen = ({ advisorProfile, onStartGame, onReset, onShowModal }) => {
  const { t, tf } = useLanguage();
  
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 via-blue-900/50 to-black flex items-center justify-center p-4 relative overflow-hidden">
      {/* 街机背景 */}
      <ArcadeBackground />

      <div className="max-w-4xl w-full relative z-10">
        {/* 霓虹标题 */}
        <div className="text-center mb-8">
          <h1 className="text-5xl font-bold pixel-text mb-2 relative inline-block">
            <span className="absolute inset-0 blur-lg bg-gradient-to-r from-cyan-500 via-blue-500 to-cyan-500 opacity-50"></span>
            <span className="relative bg-gradient-to-r from-cyan-400 via-blue-400 to-cyan-400 text-transparent bg-clip-text animate-pulse"
              style={{
                textShadow: '0 0 20px rgba(0,255,255,0.5), 0 0 40px rgba(0,150,255,0.3)',
              }}>
              MEET YOUR ADVISOR
            </span>
          </h1>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {/* 左侧：导师 CRT 显示器 */}
          <div className="bg-gradient-to-b from-gray-700 to-gray-900 p-6 rounded-lg border-4 border-cyan-500 shadow-2xl pixel-corners"
            style={{boxShadow: '0 0 20px rgba(0,255,255,0.3)'}}>
            
            {/* 显示器顶部装饰 */}
            <div className="flex justify-center gap-2 mb-4">
              <div className="w-3 h-3 bg-cyan-500 rounded-full animate-pulse"></div>
              <div className="w-3 h-3 bg-blue-500 rounded-full animate-pulse" style={{animationDelay: '0.3s'}}></div>
              <div className="w-3 h-3 bg-cyan-400 rounded-full animate-pulse" style={{animationDelay: '0.6s'}}></div>
            </div>

            {/* CRT 屏幕 */}
            <div className="relative bg-black rounded-lg p-6 border-4 border-gray-800 overflow-hidden">
              {/* 扫描线效果 */}
              <div className="absolute inset-0 pointer-events-none z-10 opacity-10">
                <div className="w-full h-full" style={{
                  backgroundImage: 'repeating-linear-gradient(0deg, transparent, transparent 2px, #00ffff 2px, #00ffff 4px)',
                }}></div>
              </div>

              {/* 导师信息 */}
              <div className="relative z-20 text-center">
                <div className="flex justify-center mb-4">
                  <AdvisorAvatar emotion="neutral" isProcessing={false} size="xl" gender={advisorProfile.gender} />
                </div>
                
                <h2 className="text-2xl font-bold text-cyan-400 mb-2 pixel-text"
                  style={{textShadow: '0 0 10px rgba(0,255,255,0.5)'}}>
                  {advisorProfile.name}
                </h2>
                
                <p className="text-cyan-300 font-mono text-sm mb-3"
                  style={{textShadow: '0 0 5px rgba(0,255,255,0.3)'}}>
                  {advisorProfile.title}
                </p>

                <div className="bg-gray-900/80 border-2 border-cyan-500/50 p-3 pixel-corners mb-3">
                  <p className="text-cyan-300 text-xs font-mono">
                    {advisorProfile.field}
                  </p>
                </div>

                <button 
                  onClick={onShowModal}
                  className="text-blue-400 hover:text-blue-300 text-xs flex items-center gap-1 mx-auto transition-colors font-mono"
                  style={{textShadow: '0 0 5px rgba(59,130,246,0.5)'}}>
                  <Info className="w-3 h-3" />
                  {t('intro.viewDetails')}
                </button>
              </div>
            </div>
          </div>

          {/* 右侧：游戏信息 */}
          <div className="space-y-4">
            {/* 游戏规则面板 */}
            <div className="bg-gradient-to-br from-gray-800 to-gray-900 p-5 border-4 border-cyan-500 pixel-corners relative overflow-hidden"
              style={{boxShadow: '0 0 20px rgba(0,255,255,0.3)'}}>
              
              {/* 装饰性背景 */}
              <div className="absolute top-0 right-0 w-20 h-20 bg-cyan-500 opacity-10 rounded-full -mr-10 -mt-10"></div>
              <div className="absolute bottom-0 left-0 w-16 h-16 bg-blue-500 opacity-10 rounded-full -ml-8 -mb-8"></div>
              
              <h2 className="text-xl font-bold text-cyan-400 mb-4 pixel-text flex items-center gap-2 relative z-10"
                style={{textShadow: '0 0 10px rgba(0,255,255,0.5)'}}>
                <Zap className="w-5 h-5" />
                {t('intro.gameRules')}
              </h2>
              <ul className="text-gray-200 space-y-2 text-sm relative z-10">
                <li className="flex items-start gap-2">
                  <span className="text-cyan-400 mt-0.5">▸</span>
                  <span>{tf('intro.rule1', { name: advisorProfile.name })}</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-cyan-300 mt-0.5">▸</span>
                  <span>{t('intro.rule2')}</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-blue-400 mt-0.5">▸</span>
                  <span>{t('intro.rule3')}</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-cyan-400 mt-0.5">▸</span>
                  <span>{t('intro.rule4')}</span>
                </li>
              </ul>
            </div>

            {/* 导师特征面板 */}
            <div className="bg-gradient-to-br from-gray-800 to-gray-900 p-4 border-4 border-blue-500 pixel-corners"
              style={{boxShadow: '0 0 20px rgba(59,130,246,0.3)'}}>
              <h3 className="text-blue-400 font-bold mb-3 pixel-text flex items-center gap-2"
                style={{textShadow: '0 0 10px rgba(59,130,246,0.5)'}}>
                <User className="w-4 h-4" />
                ADVISOR TRAITS
              </h3>
              <div className="space-y-2">
                <div className="bg-black/30 border border-cyan-500/30 p-2 pixel-corners">
                  <p className="text-cyan-400 text-xs font-mono mb-1">{t('intro.advisorPersonality')}</p>
                  <p className="text-white text-sm">{advisorProfile.personality}</p>
                </div>
                <div className="bg-black/30 border border-blue-500/30 p-2 pixel-corners">
                  <p className="text-blue-400 text-xs font-mono mb-1">{t('intro.researchField')}</p>
                  <p className="text-white text-sm">{advisorProfile.field}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* 底部按钮 */}
        <div className="flex gap-4 mt-8">
          <button
            onClick={onReset}
            className="flex-1 relative group"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-gray-500 to-gray-600 blur-lg opacity-50 group-hover:opacity-75 transition-opacity"></div>
            <div className="relative bg-gradient-to-r from-gray-600 to-gray-700 hover:from-gray-500 hover:to-gray-600 text-white font-bold py-4 px-6 border-4 border-gray-800 pixel-corners transition-all">
              <span className="pixel-text tracking-wider">← {t('intro.changeAdvisor')}</span>
            </div>
          </button>

          <button
            onClick={onStartGame}
            className="flex-1 relative group"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-cyan-500 to-blue-500 blur-lg opacity-50 group-hover:opacity-75 transition-opacity"></div>
            <div className="relative bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white font-bold py-4 px-6 border-4 border-cyan-400 pixel-corners transition-all shadow-lg">
              <span className="pixel-text text-xl tracking-wider">▶ {t('intro.startInterview')}</span>
            </div>
          </button>
        </div>

        {/* 底部提示 */}
        <div className="mt-6 text-center">
          <p className="text-cyan-400 font-mono text-xs animate-pulse"
            style={{textShadow: '0 0 5px rgba(0,255,255,0.5)'}}>
            ▶ PRESS START WHEN READY ◀
          </p>
        </div>
      </div>
    </div>
  );
};