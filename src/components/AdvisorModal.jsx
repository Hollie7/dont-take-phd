import React from 'react';
import { X, Sparkles } from 'lucide-react';
import { AdvisorAvatar } from './AdvisorAvatar';

export const AdvisorModal = ({ advisorProfile, currentEmotion, isProcessing, onClose }) => {
  return (
    <div 
      className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center p-4 z-50" 
      onClick={onClose}
    >
      <div 
        className="bg-indigo-900 border-4 border-indigo-600 max-w-2xl w-full pixel-corners relative max-h-[90vh] flex flex-col" 
        onClick={(e) => e.stopPropagation()}
      >
        {/* 固定的头部 */}
        <div className="p-6 pb-4 flex-shrink-0">
          <button 
            onClick={onClose}
            className="absolute top-4 right-4 text-white hover:text-red-400 transition-colors bg-indigo-800 hover:bg-red-900 border-2 border-indigo-600 pixel-corners p-2 z-10"
            title="关闭"
          >
            <X className="w-6 h-6" />
          </button>
          
          <div className="flex items-start gap-4">
            <AdvisorAvatar emotion={currentEmotion} isProcessing={isProcessing} size="lg" />
            <div className="flex-1 pr-12">
              <h2 className="text-2xl font-bold text-white pixel-text mb-1">{advisorProfile.name}</h2>
              <p className="text-indigo-300 mb-2">{advisorProfile.title} · {advisorProfile.institution}</p>
              <div className="bg-indigo-800 border-2 border-indigo-600 p-2 pixel-corners">
                <p className="text-indigo-200 text-sm italic">"{advisorProfile.famous_quote}"</p>
              </div>
            </div>
          </div>
        </div>

        {/* 可滚动的内容区域 */}
        <div className="flex-1 overflow-y-auto px-6 pb-4">
          <div className="space-y-4">
            <div className="bg-indigo-800 border-2 border-indigo-600 p-4 pixel-corners">
              <h3 className="text-yellow-400 font-bold mb-2 flex items-center gap-2">
                <Sparkles className="w-4 h-4" />
                研究领域
              </h3>
              <p className="text-white">{advisorProfile.field}</p>
            </div>

            <div className="bg-indigo-800 border-2 border-indigo-600 p-4 pixel-corners">
              <h3 className="text-yellow-400 font-bold mb-2">研究兴趣</h3>
              <ul className="text-white space-y-1">
                {advisorProfile.research_interests.map((interest, idx) => (
                  <li key={idx}>• {interest}</li>
                ))}
              </ul>
            </div>

            <div className="bg-indigo-800 border-2 border-indigo-600 p-4 pixel-corners">
              <h3 className="text-yellow-400 font-bold mb-2">性格特点</h3>
              <p className="text-white">{advisorProfile.personality}</p>
            </div>

            <div className="bg-indigo-800 border-2 border-indigo-600 p-4 pixel-corners">
              <h3 className="text-yellow-400 font-bold mb-2">实验室风格</h3>
              <p className="text-white">{advisorProfile.lab_style}</p>
            </div>

            <div className="bg-indigo-800 border-2 border-indigo-600 p-4 pixel-corners">
              <h3 className="text-yellow-400 font-bold mb-2">对学生的期待</h3>
              <ul className="text-white space-y-1">
                {advisorProfile.expectations.map((expectation, idx) => (
                  <li key={idx}>• {expectation}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>
        
        {/* 固定的底部按钮 */}
        <div className="p-6 pt-4 text-center flex-shrink-0 border-t-2 border-indigo-700">
          <button
            onClick={onClose}
            className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 px-8 border-2 border-indigo-800 pixel-corners transition-all"
          >
            关闭
          </button>
        </div>
      </div>
    </div>
  );
};