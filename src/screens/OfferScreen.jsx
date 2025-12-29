import React from 'react';
import { AdvisorAvatar } from '../components/AdvisorAvatar';
import { useLanguage } from '../contexts/LanguageContext';
import { ArcadeBackground } from '../components/ArcadeBackground';
import { Trophy, Sparkles, RefreshCw } from 'lucide-react';

export const OfferScreen = ({ advisorProfile, onReset }) => {
  const { t, tf } = useLanguage();
  
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 via-purple-900/50 to-black flex items-center justify-center p-4 relative overflow-hidden">
      {/* 街机背景 */}
      <ArcadeBackground />

      <div className="max-w-3xl w-full relative z-10">
        {/* 标题动画 */}
        <div className="text-center mb-8">
          <div className="inline-block relative">
            {/* 发光效果 */}
            <div className="absolute inset-0 blur-2xl bg-gradient-to-r from-green-500 via-cyan-500 to-green-500 opacity-50 animate-pulse"></div>
            
            <h1 className="text-6xl md:text-7xl font-bold pixel-text mb-4 relative"
              style={{
                background: 'linear-gradient(to right, #10b981, #06b6d4, #10b981)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                textShadow: '0 0 40px rgba(16, 185, 129, 0.8)',
              }}>
              {t('result.offer.title')}
            </h1>
          </div>
        </div>

        {/* CRT 显示器 */}
        <div className="bg-gradient-to-b from-gray-800 to-gray-900 p-8 rounded-lg border-4 border-cyan-500 pixel-corners shadow-2xl relative"
          style={{
            boxShadow: '0 0 40px rgba(0,255,255,0.4), inset 0 0 30px rgba(0,0,0,0.5)'
          }}>
          
          {/* 顶部装饰条 */}
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-green-500 via-cyan-500 to-green-500"></div>

          {/* 状态指示灯 */}
          <div className="absolute top-4 right-4 flex gap-2">
            <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
            <div className="w-3 h-3 bg-cyan-500 rounded-full animate-pulse" style={{animationDelay: '0.3s'}}></div>
            <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse" style={{animationDelay: '0.6s'}}></div>
          </div>

          {/* 扫描线效果 */}
          <div className="absolute inset-0 pointer-events-none opacity-5 rounded-lg overflow-hidden">
            <div className="w-full h-full" style={{
              backgroundImage: 'repeating-linear-gradient(0deg, transparent, transparent 2px, #00ffff 2px, #00ffff 4px)',
            }}></div>
          </div>

          {/* 内容 */}
          <div className="relative z-10">
            {/* 导师头像 */}
            <div className="flex justify-center mb-6 relative">
              <div className="relative">
                <AdvisorAvatar emotion="happy" isProcessing={false} size="xl" gender={advisorProfile.gender}/>
                {/* 头像发光 */}
                <div className="absolute inset-0 bg-green-500 opacity-20 blur-2xl rounded-full -z-10"></div>
              </div>
            </div>

            {/* SUCCESS 标签 */}
            <div className="flex justify-center mb-6">
              <div className="bg-black/50 border-2 border-green-500 px-6 py-2 pixel-corners inline-flex items-center gap-2">
                <Trophy className="w-5 h-5 text-green-400" />
                <span className="text-green-400 font-bold pixel-text"
                  style={{textShadow: '0 0 10px rgba(16, 185, 129, 0.8)'}}>
                  SUCCESS
                </span>
                <Sparkles className="w-5 h-5 text-green-400" />
              </div>
            </div>

            {/* 消息 */}
            <div className="bg-black/30 border-2 border-cyan-500/50 p-6 pixel-corners mb-8">
              <p className="text-cyan-100 text-lg leading-relaxed font-mono text-center">
                {tf('result.offer.message', { 
                  name: advisorProfile.name, 
                  field: advisorProfile.field 
                })}
              </p>
            </div>

            {/* 导师信息 */}
            <div className="text-center mb-6">
              <p className="text-cyan-400 font-mono text-sm"
                style={{textShadow: '0 0 5px rgba(0,255,255,0.5)'}}>
                {advisorProfile.name} · {advisorProfile.institution}
              </p>
            </div>

            {/* 按钮 */}
            <div className="flex justify-center">
              <button 
                onClick={onReset}
                className="relative group"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-green-500 to-cyan-500 blur-lg opacity-50 group-hover:opacity-75 transition-opacity"></div>
                <div className="relative bg-gradient-to-r from-green-600 to-cyan-600 hover:from-green-500 hover:to-cyan-500 text-white font-bold py-4 px-8 border-4 border-green-400 pixel-corners transition-all shadow-lg flex items-center gap-2">
                  <RefreshCw className="w-5 h-5" />
                  <span className="pixel-text tracking-wider">{t('result.offer.button')}</span>
                </div>
              </button>
            </div>
          </div>

          {/* 底部装饰条 */}
          <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-green-500 via-cyan-500 to-green-500"></div>
        </div>

        {/* 底部提示 */}
        <div className="mt-6 text-center">
          <p className="text-green-400 font-mono text-sm animate-pulse"
            style={{textShadow: '0 0 5px rgba(16, 185, 129, 0.5)'}}>
            ▶ CONGRATULATIONS! GAME COMPLETE ◀
          </p>
        </div>
      </div>
    </div>
  );
};