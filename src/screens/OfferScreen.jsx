import React, { useState } from 'react';
import { AdvisorAvatar } from '../components/AdvisorAvatar';
import { useLanguage } from '../contexts/LanguageContext';
import { Background } from '../components/Background';
import { Trophy, Sparkles, RefreshCw, Download } from 'lucide-react';
import { downloadConversationRecord } from '../services/downloadService';

export const OfferScreen = ({ advisorProfile, gameRecord, onReset }) => {
  const { t, tf } = useLanguage();
  const [isDownloading, setIsDownloading] = useState(false);

  const handleDownload = async () => {
    if (!gameRecord) return;
    setIsDownloading(true);
    try {
      await downloadConversationRecord({ ...gameRecord, advisorProfile, result: 'offer' });
    } finally {
      setIsDownloading(false);
    }
  };
  
  return (
    <div className="min-h-screen bg-white flex items-center justify-center p-6 relative overflow-hidden">
      <Background />

      <div className="max-w-2xl w-full relative z-10">
        {/* 标题 */}
        <div className="text-center mb-12">
          {/* <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-6">
            <Trophy className="w-8 h-8 text-green-600" />
          </div> */}
          
          <h1 className="text-4xl font-semibold text-gray-900 mb-3">
            {t('result.offer.title')}
          </h1>
          
          <p className="text-gray-500 text-sm">
            You've successfully impressed the advisor!
          </p>
        </div>

        {/* 主卡片 */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 mb-6">
          {/* 导师头像 */}
          <div className="flex justify-center mb-6">
            <AdvisorAvatar
              emotion="happy"
              isProcessing={false}
              size="xl"
              gender={advisorProfile.gender}
              customAvatar={advisorProfile.customAvatar}
            />
          </div>

          {/* SUCCESS 标签 */}
          <div className="flex justify-center mb-6">
            <div className="bg-green-50 border border-green-200 px-6 py-2 rounded-xl inline-flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-green-600" />
              <span className="text-green-700 font-medium text-sm">
                Offer Accepted
              </span>
            </div>
          </div>

          {/* 消息 */}
          <div className="bg-gray-50 border border-gray-100 rounded-xl p-6 mb-6">
            <p className="text-gray-700 text-base leading-relaxed text-center">
              {tf('result.offer.message', { 
                name: advisorProfile.name, 
                field: advisorProfile.field 
              })}
            </p>
          </div>

          {/* 导师信息 */}
          <div className="text-center mb-6">
            <p className="text-gray-500 text-sm">
              {advisorProfile.name} · {advisorProfile.institution}
            </p>
          </div>

          {/* 按钮 */}
          <div className="flex justify-center gap-3">
            {gameRecord && (
              <button
                onClick={handleDownload}
                disabled={isDownloading}
                className="bg-white hover:bg-gray-50 text-gray-700 font-medium py-3 px-6 rounded-xl transition-colors shadow-sm border border-gray-200 flex items-center gap-2 disabled:opacity-60"
              >
                <Download className="w-4 h-4" />
                <span>{isDownloading ? t('download.loading') : t('download.button')}</span>
              </button>
            )}
            <button
              onClick={onReset}
              className="bg-gray-900 hover:bg-gray-800 text-white font-medium py-3 px-8 rounded-xl transition-colors shadow-sm flex items-center gap-2"
            >
              <RefreshCw className="w-4 h-4" />
              <span>{t('result.offer.button')}</span>
            </button>
          </div>
        </div>

        {/* 底部提示 */}
        <div className="text-center">
          <p className="text-gray-400 text-sm">
            Congratulations on completing the interview!
          </p>
        </div>
      </div>
    </div>
  );
};