import React, { useState } from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import { generateAdvisorProfile } from '../services/deepseekAPI';
import { ArcadeBackground } from '../components/ArcadeBackground';
import { CRTMonitor } from '../components/CRTMonitor';
import { PixelNote } from '../components/PixelNote';
import { ArcadeAnimations } from '../components/animations/ArcadeAnimations';
import { LanguageSwitch } from '../components/LanguageSwitch';

export const InitScreen = ({ onAdvisorGenerated }) => {
  const [advisorInput, setAdvisorInput] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const { t, language } = useLanguage(); // 获取当前语言

  const handleGenerate = async () => {
    if (!advisorInput.trim() || isGenerating) return;
    
    setIsGenerating(true);
    try {
      // 传入 language 参数
      const profile = await generateAdvisorProfile(advisorInput.trim(), language);
      console.log(profile);
      onAdvisorGenerated(profile);
    } catch (error) {
      alert(t('errors.generateFailed'));
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 via-purple-900/50 to-black flex items-center justify-center p-4 relative overflow-hidden">
      {/* 语言切换 */}
      <LanguageSwitch />
      
      {/* 街机背景 */}
      <ArcadeBackground />
      
      {/* 街机动画 */}
      <ArcadeAnimations />

      <div className="max-w-6xl w-full relative z-10">
        {/* 标题区域 */}
        <div className="text-center mb-8">
          <h1 className="text-6xl md:text-7xl font-bold pixel-text mb-4 relative inline-block">
            <span className="absolute inset-0 blur-lg bg-gradient-to-r from-pink-500 via-cyan-500 to-yellow-500 opacity-50"></span>
            <span className="relative bg-gradient-to-r from-pink-500 via-cyan-400 to-yellow-500 text-transparent bg-clip-text animate-pulse"
              style={{
                textShadow: '0 0 20px rgba(255,0,255,0.5), 0 0 40px rgba(0,255,255,0.3)',
              }}>
              {t('title')}
            </span>
          </h1>
          
          {/* 副标题 */}
          <div className="mt-6 inline-block">
            <div className="bg-black/50 border-2 border-cyan-500/50 px-6 py-3 relative">
              <div className="absolute top-0 left-0 w-2 h-2 bg-cyan-400 animate-pulse"></div>
              <div className="absolute top-0 right-0 w-2 h-2 bg-pink-400 animate-pulse" style={{animationDelay: '0.5s'}}></div>
              <div className="absolute bottom-0 left-0 w-2 h-2 bg-yellow-400 animate-pulse" style={{animationDelay: '1s'}}></div>
              <div className="absolute bottom-0 right-0 w-2 h-2 bg-green-400 animate-pulse" style={{animationDelay: '1.5s'}}></div>
              
              <p className="text-cyan-300 font-mono text-sm md:text-base leading-relaxed whitespace-pre-line"
                style={{textShadow: '0 0 10px rgba(0,255,255,0.5)'}}>
                {t('subtitle')}
              </p>
            </div>
          </div>
        </div>

        {/* 主要内容区域 */}
        <div className="grid md:grid-cols-12 gap-8 items-start">
          {/* 左侧纸条 */}
          <div className="md:col-span-3 flex justify-center md:justify-end">
            <PixelNote />
          </div>

          {/* 中间显示器 */}
          <div className="md:col-span-9">
            <CRTMonitor
              advisorInput={advisorInput}
              setAdvisorInput={setAdvisorInput}
              isGenerating={isGenerating}
              onGenerate={handleGenerate}
            />
          </div>
        </div>

        {/* 底部提示 */}
        <div className="mt-8 text-center">
          <p className="text-green-400 font-mono text-xs animate-pulse"
            style={{textShadow: '0 0 5px rgba(0,255,0,0.5)'}}>
            {t('footer')}
          </p>
        </div>
      </div>
    </div>
  );
};