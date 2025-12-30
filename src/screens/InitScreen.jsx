import React, { useState } from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import { generateAdvisorProfile } from '../services/deepseekAPI';
import { Background } from '../components/Background';
import { InputCard } from '../components/InputCard';
import { InfoCard } from '../components/InfoCard';
import { LanguageSwitch } from '../components/LanguageSwitch';

export const InitScreen = ({ onAdvisorGenerated }) => {
  const [advisorInput, setAdvisorInput] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const { t, language } = useLanguage();

  const handleGenerate = async () => {
    if (!advisorInput.trim() || isGenerating) return;
    
    setIsGenerating(true);
    try {
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
    <div className="min-h-screen bg-white flex items-center justify-center p-8 relative">
      <LanguageSwitch />
      <Background />

      <div className="max-w-6xl w-full relative z-10">
        {/* 标题区域 */}
        <div className="text-center mb-16">
          <h1 className="text-6xl md:text-7xl font-semibold text-gray-900 mb-6 tracking-tight">
            {t('title')}
          </h1>
          
          <div className="mt-8 inline-block">
            <div className="bg-gray-50 rounded-lg px-8 py-5 max-w-2xl">
              <p className="text-gray-600 text-base leading-relaxed whitespace-pre-line">
                {t('subtitle')}
              </p>
            </div>
          </div>
        </div>

        {/* 主要内容区域 */}
        <div className="grid md:grid-cols-12 gap-8 items-start">
          {/* 左侧信息卡片 */}
          <div className="md:col-span-4">
            <InfoCard />
          </div>

          {/* 右侧输入卡片 */}
          <div className="md:col-span-8">
            <InputCard
              advisorInput={advisorInput}
              setAdvisorInput={setAdvisorInput}
              isGenerating={isGenerating}
              onGenerate={handleGenerate}
            />
          </div>
        </div>

        {/* 底部提示 */}
        <div className="mt-12 text-center">
          <p className="text-gray-400 text-sm">
            {t('footer')}
          </p>
        </div>
      </div>
    </div>
  );
};