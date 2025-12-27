import React from 'react';
import { Info } from 'lucide-react';
import { AdvisorAvatar } from '../components/AdvisorAvatar';

export const IntroScreen = ({ advisorProfile, onStartGame, onReset, onShowModal }) => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 to-slate-800 flex items-center justify-center p-4">
      <div className="max-w-2xl w-full bg-slate-800 border-4 border-slate-600 p-8 pixel-corners">
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <AdvisorAvatar emotion="neutral" isProcessing={false} size="xl" />
          </div>
          <h1 className="text-3xl font-bold text-white mb-2 pixel-text">{advisorProfile.name}</h1>
          <p className="text-slate-300">{advisorProfile.title} · {advisorProfile.field}</p>
          <button 
            onClick={onShowModal}
            className="text-blue-400 hover:text-blue-300 text-sm flex items-center gap-1 mx-auto mt-2 transition-colors"
          >
            <Info className="w-4 h-4" />
            查看导师详细信息
          </button>
        </div>
        
        <div className="bg-slate-700 p-6 rounded mb-6 border-2 border-slate-500">
          <h2 className="text-xl font-bold text-yellow-400 mb-3">📚 游戏说明</h2>
          <ul className="text-slate-200 space-y-2 text-sm">
            <li>• 你将与 {advisorProfile.name} 进行深入对话</li>
            <li>• 导师表情会随着满意度实时变化（😊 → 🤔 → 😔）</li>
            <li>• 你的回答将影响导师的满意度</li>
            <li>• 最终获得offer或被拒绝</li>
          </ul>
        </div>

        <div className="bg-slate-700 p-4 rounded mb-6 border-2 border-slate-500">
          <p className="text-slate-200 text-sm mb-2">
            <strong className="text-yellow-400">导师性格：</strong>{advisorProfile.personality}
          </p>
          <p className="text-slate-200 text-sm">
            <strong className="text-yellow-400">研究领域：</strong>{advisorProfile.field}
          </p>
        </div>

        <div className="flex gap-4">
          <button
            onClick={onReset}
            className="flex-1 bg-slate-600 hover:bg-slate-700 text-white font-bold py-4 px-6 border-4 border-slate-800 pixel-corners"
          >
            换导师
          </button>
          <button
            onClick={onStartGame}
            className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 px-6 border-4 border-blue-800 pixel-corners"
          >
            开始面试
          </button>
        </div>
      </div>
    </div>
  );
};