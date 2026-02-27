import React, { useState } from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import { generateAdvisorProfile, generateAdvisorFromURL } from '../services/apiService';
import { generateCartoonAvatar } from '../services/avatarService';
import { Background } from '../components/Background';
import { InputCard } from '../components/InputCard';
import { InfoCard } from '../components/InfoCard';
import { LanguageSwitch } from '../components/LanguageSwitch';

export const InitScreen = ({ onAdvisorGenerated }) => {
  const [inputMode, setInputMode] = useState('text');
  const [advisorInput, setAdvisorInput] = useState('');
  const [urlInput, setUrlInput] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatingStep, setGeneratingStep] = useState(''); // current progress label
  const [errorMessage, setErrorMessage] = useState('');
  const [warningMessage, setWarningMessage] = useState(''); // non-blocking avatar warning
  const { t, language } = useLanguage();

  const handleGenerate = async () => {
    setIsGenerating(true);
    setErrorMessage('');
    setWarningMessage('');
    setGeneratingStep('');

    try {
      let profile;

      if (inputMode === 'url') {
        if (!urlInput.trim()) {
          setErrorMessage(t('errors.urlRequired'));
          setIsGenerating(false);
          return;
        }
        try {
          new URL(urlInput.trim());
        } catch {
          setErrorMessage(t('errors.invalidUrl'));
          setIsGenerating(false);
          return;
        }

        // Step 1: Extract advisor profile from the homepage
        setGeneratingStep(t('generating.profile'));
        profile = await generateAdvisorFromURL(urlInput.trim(), language);

        // Step 2: If a photo URL was found, generate a cartoon avatar
        if (profile.photo_url) {
          setGeneratingStep(t('generating.avatar'));
          try {
            profile.customAvatar = await generateCartoonAvatar(profile.photo_url);
          } catch (avatarError) {
            console.warn('Avatar generation failed:', avatarError.message);
            setWarningMessage(avatarError.message);
          }
        } else {
          setWarningMessage(t('warnings.noPhotoFound'));
        }
      } else {
        if (!advisorInput.trim()) {
          setErrorMessage(t('errors.descriptionRequired'));
          setIsGenerating(false);
          return;
        }
        setGeneratingStep(t('generating.profileFromText'));
        profile = await generateAdvisorProfile(advisorInput.trim(), language);
      }

      console.log(profile);
      onAdvisorGenerated(profile);
    } catch (error) {
      console.error('Generation error:', error);
      setErrorMessage(error.message || t('errors.generateFailed'));
    } finally {
      setIsGenerating(false);
      setGeneratingStep('');
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

        {/* Error message */}
        {errorMessage && (
          <div className="max-w-2xl mx-auto mb-6">
            <div className="bg-red-50 border border-red-200 rounded-xl p-4">
              <p className="text-red-700 text-sm">{errorMessage}</p>
            </div>
          </div>
        )}

        {/* Non-blocking avatar warning */}
        {warningMessage && (
          <div className="max-w-2xl mx-auto mb-6">
            <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4">
              <p className="text-yellow-700 text-sm">{warningMessage}</p>
            </div>
          </div>
        )}

        {/* Generation progress */}
        {isGenerating && generatingStep && (
          <div className="max-w-2xl mx-auto mb-6">
            <div className="bg-gray-50 border border-gray-200 rounded-xl p-4 flex items-center gap-3">
              <div className="w-2 h-2 bg-gray-500 rounded-full animate-ping flex-shrink-0"></div>
              <p className="text-gray-600 text-sm">{generatingStep}</p>
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

        {/* Footer */}
        <div className="mt-8 flex items-center justify-center gap-4 text-xs text-gray-400">
          <a
            href="https://github.com/Hollie7/dont-take-phd"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 hover:text-gray-600 transition-colors"
          >
            <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
            </svg>
            GitHub
          </a>
          <span>·</span>
          <a
            href="https://hollysong.site"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-gray-600 transition-colors"
          >
            Contact: hollysong.site
          </a>
        </div>
      </div>
    </div>
  );
};