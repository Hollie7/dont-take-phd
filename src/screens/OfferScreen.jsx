import React from 'react';
import { AdvisorAvatar } from '../components/AdvisorAvatar';

export const OfferScreen = ({ advisorProfile, onReset }) => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-emerald-900 to-emerald-800 flex items-center justify-center p-4">
      <div className="max-w-2xl w-full bg-emerald-800 border-4 border-emerald-600 p-8 pixel-corners text-center">
        <div className="flex justify-center mb-6">
          <AdvisorAvatar emotion="happy" isProcessing={false} size="xl" />
        </div>
        <h1 className="text-4xl font-bold text-white mb-4 pixel-text">🎉 恭喜！Offer!</h1>
        <p className="text-emerald-200 text-lg mb-6">
          {advisorProfile.name} 对你非常满意！你展现出了对{advisorProfile.field}的热情和充分的准备。
        </p>
        <button 
          onClick={onReset}
          className="bg-white hover:bg-emerald-100 text-emerald-900 font-bold py-4 px-8 border-4 border-emerald-900 pixel-corners transition-all"
        >
          再玩一次
        </button>
      </div>
    </div>
  );
};