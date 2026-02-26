import React from 'react';
import { AdvisorAvatar } from '../components/AdvisorAvatar';
import { useLanguage } from '../contexts/LanguageContext';
import { Background } from '../components/Background';
import { XCircle, RefreshCw } from 'lucide-react';

export const RejectionScreen = ({ advisorProfile, onReset }) => {
  const { t, tf } = useLanguage();
  
  return (
    <div className="min-h-screen bg-white flex items-center justify-center p-6 relative overflow-hidden">
      <Background />

      <div className="max-w-2xl w-full relative z-10">
        {/* 标题 */}
        <div className="text-center mb-12">
          {/* <div className="inline-flex items-center justify-center w-16 h-16 bg-red-100 rounded-full mb-6">
            <XCircle className="w-8 h-8 text-red-600" />
          </div> */}
          
          <h1 className="text-4xl font-semibold text-gray-900 mb-3">
            {t('result.rejection.title')}
          </h1>
          
          <p className="text-gray-500 text-sm">
            Don't give up - every interview is a learning experience
          </p>
        </div>

        {/* 主卡片 */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 mb-6">
          {/* 导师头像 */}
          <div className="flex justify-center mb-6">
            <AdvisorAvatar
              emotion="sad"
              isProcessing={false}
              size="xl"
              gender={advisorProfile.gender}
              customAvatar={advisorProfile.customAvatar}
            />
          </div>

          {/* NOT ACCEPTED 标签 */}
          <div className="flex justify-center mb-6">
            <div className="bg-red-50 border border-red-200 px-6 py-2 rounded-xl inline-flex items-center gap-2">
              <XCircle className="w-4 h-4 text-red-600" />
              <span className="text-red-700 font-medium text-sm">
                Not Accepted
              </span>
            </div>
          </div>

          {/* 消息 */}
          <div className="bg-gray-50 border border-gray-100 rounded-xl p-6 mb-6">
            <p className="text-gray-700 text-base leading-relaxed text-center">
              {tf('result.rejection.message', { 
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
          <div className="flex justify-center">
            <button 
              onClick={onReset}
              className="bg-gray-900 hover:bg-gray-800 text-white font-medium py-3 px-8 rounded-xl transition-colors shadow-sm flex items-center gap-2"
            >
              <RefreshCw className="w-4 h-4" />
              <span>{t('result.rejection.button')}</span>
            </button>
          </div>
        </div>

        {/* 底部提示 */}
        <div className="text-center">
          <p className="text-gray-400 text-sm">
            Try again with different answers or a new advisor
          </p>
        </div>
      </div>
    </div>
  );
};