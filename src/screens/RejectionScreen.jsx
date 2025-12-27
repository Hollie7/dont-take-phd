import React from 'react';
import { AdvisorAvatar } from '../components/AdvisorAvatar';

export const RejectionScreen = ({ advisorProfile, onReset }) => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-red-900 to-red-800 flex items-center justify-center p-4">
      <div className="max-w-2xl w-full bg-red-800 border-4 border-red-600 p-8 pixel-corners text-center">
        <div className="flex justify-center mb-6">
          <AdvisorAvatar emotion="sad" isProcessing={false} size="xl" />
        </div>
        <h1 className="text-4xl font-bold text-white mb-4 pixel-text">😔 很遗憾...</h1>
        <p className="text-red-200 text-lg mb-6">
          {advisorProfile.name} 认为你可能还需要更多准备。不要气馁，继续努力！
        </p>
        <button 
          onClick={onReset}
          className="bg-white hover:bg-red-100 text-red-900 font-bold py-4 px-8 border-4 border-red-900 pixel-corners"
        >
          再试一次
        </button>
      </div>
    </div>
  );
};