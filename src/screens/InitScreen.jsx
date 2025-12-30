import React, { useState } from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import { generateAdvisorProfile, generateAdvisorFromURL } from '../services/deepseekAPI';
import { Background } from '../components/Background';
import { InputCard } from '../components/InputCard';
import { InfoCard } from '../components/InfoCard';
import { LanguageSwitch } from '../components/LanguageSwitch';

export const InitScreen = ({ onAdvisorGenerated }) => {
  const [inputMode, setInputMode] = useState('text');
  const [advisorInput, setAdvisorInput] = useState('');
  const [urlInput, setUrlInput] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [errorMessage, setErrorMessage] = useState(''); // 新增：错误消息状态
  const { t, language } = useLanguage();

  const handleGenerate = async () => {
    setIsGenerating(true);
    setErrorMessage(''); // 清除之前的错误
    
    try {
      let profile;
      
      if (inputMode === 'url') {
        if (!urlInput.trim()) {
          setErrorMessage(t('errors.urlRequired'));
          setIsGenerating(false);
          return;
        }
        // 验证 URL 格式
        try {
          new URL(urlInput.trim());
        } catch {
          setErrorMessage(t('errors.invalidUrl'));
          setIsGenerating(false);
          return;
        }
        profile = await generateAdvisorFromURL(urlInput.trim(), language);
      } else {
        if (!advisorInput.trim()) {
          setErrorMessage(t('errors.descriptionRequired'));
          setIsGenerating(false);
          return;
        }
        profile = await generateAdvisorProfile(advisorInput.trim(), language);
      }
      
      console.log(profile);
      onAdvisorGenerated(profile);
    } catch (error) {
      console.error('Generation error:', error);
      // 显示具体的错误信息
      setErrorMessage(error.message || t('errors.generateFailed'));
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="min-h-screen bg-white flex items-center justify-center p-6 relative overflow-hidden">
      <LanguageSwitch />
      <Background />

      <div className="max-w-6xl w-full relative z-10">
        {/* 标题区域 */}
        <div className="text-center mb-12">
          <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-4">
            {t('title')}
          </h1>
          
          <div className="mt-6 inline-block">
            <div className="bg-gray-50 rounded-xl px-8 py-4 max-w-2xl">
              <p className="text-gray-600 text-sm leading-relaxed whitespace-pre-line">
                {t('subtitle')}
              </p>
            </div>
          </div>
        </div>

        {/* 错误提示 */}
        {errorMessage && (
          <div className="max-w-2xl mx-auto mb-6">
            <div className="bg-red-50 border border-red-200 rounded-xl p-4">
              <p className="text-red-700 text-sm">{errorMessage}</p>
            </div>
          </div>
        )}

        {/* 主要内容区域 */}
        <div className="grid md:grid-cols-12 gap-8 items-start">
          {/* 左侧信息卡片 */}
          <div className="md:col-span-4">
            <InfoCard />
          </div>

          {/* 右侧输入卡片 */}
          <div className="md:col-span-8">
            <InputCard
              inputMode={inputMode}
              setInputMode={setInputMode}
              advisorInput={advisorInput}
              setAdvisorInput={setAdvisorInput}
              urlInput={urlInput}
              setUrlInput={setUrlInput}
              isGenerating={isGenerating}
              onGenerate={handleGenerate}
            />
          </div>
        </div>

        {/* 底部提示 */}
        <div className="mt-8 text-center">
          <p className="text-gray-400 text-sm">
            {t('footer')}
          </p>
        </div>
      </div>
    </div>
  );
};