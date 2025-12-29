import React from 'react';
import { useLanguage } from '../../contexts/LanguageContext';


// 掉落的霓虹文字
export const FallingText = () => {
  const { t } = useLanguage();
  const words = t('animations.words');
  
  return (
    <div className="absolute top-0 right-20 w-64 h-screen pointer-events-none overflow-hidden">
      {words.map((word, index) => (
        <div
          key={index}
          className="absolute arcade-text-fall"
          style={{
            animationDelay: `${index * 3}s`,
            left: `${index * 20}%`,
          }}
        >
          <div className="pixel-text text-2xl font-bold neon-text-pink">
            {word}
          </div>
        </div>
      ))}
    </div>
  );
};

// 横向滚动的追逐游戏
export const ChaseGame = () => {
  return (
    <div className="absolute bottom-32 left-0 w-full h-20 pointer-events-none overflow-hidden">
      {/* 跑道线 */}
      <div className="absolute bottom-8 left-0 right-0 h-0.5 bg-cyan-500/30"></div>
      
      {/* 被追逐的学生 */}
      <div className="student-running">
        <svg width="32" height="32" viewBox="0 0 32 32" className="neon-glow-cyan">
          {/* 头 */}
          <rect x="12" y="4" width="8" height="8" fill="#00ffff" />
          {/* 身体 */}
          <rect x="10" y="12" width="12" height="8" fill="#00ffff" />
          {/* 腿（跑步动作） */}
          <rect x="10" y="20" width="4" height="8" fill="#00ffff" className="leg-run-1" />
          <rect x="18" y="20" width="4" height="8" fill="#00ffff" className="leg-run-2" />
          {/* 手臂 */}
          <rect x="6" y="14" width="4" height="4" fill="#00ffff" />
          <rect x="22" y="14" width="4" height="4" fill="#00ffff" />
        </svg>
      </div>

      {/* 追逐的 DDL */}
      <div className="deadline-chasing">
        <svg width="40" height="40" viewBox="0 0 40 40" className="neon-glow-pink">
          {/* 闹钟形状 */}
          <circle cx="20" cy="22" r="14" fill="#ff00ff" />
          <circle cx="20" cy="22" r="10" fill="#000" />
          {/* 铃铛 */}
          <rect x="8" y="8" width="4" height="4" fill="#ff00ff" />
          <rect x="28" y="8" width="4" height="4" fill="#ff00ff" />
          {/* 指针 */}
          <rect x="19" y="14" width="2" height="8" fill="#ff00ff" />
          <rect x="20" y="22" width="6" height="2" fill="#ff00ff" />
          {/* DDL 文字 */}
          <text x="20" y="38" fontSize="6" fill="#ff00ff" textAnchor="middle" className="pixel-text">DDL</text>
        </svg>
      </div>

      {/* 追逐的论文 */}
      <div className="paper-chasing">
        <svg width="32" height="32" viewBox="0 0 32 32" className="neon-glow-yellow">
          <rect x="6" y="4" width="20" height="24" fill="#ffff00" />
          <rect x="10" y="8" width="12" height="2" fill="#000" opacity="0.3" />
          <rect x="10" y="12" width="12" height="2" fill="#000" opacity="0.3" />
          <rect x="10" y="16" width="12" height="2" fill="#000" opacity="0.3" />
          <rect x="10" y="20" width="8" height="2" fill="#000" opacity="0.3" />
        </svg>
      </div>
    </div>
  );
};

// 能量条消耗动画
export const EnergyDrain = () => {
  return (
    <div className="absolute top-32 left-20 w-48 pointer-events-none">
      <div className="bg-gray-900/80 border-2 border-cyan-500 p-3 pixel-corners">
        <div className="text-xs pixel-text text-cyan-400 mb-2">MOTIVATION</div>
        <div className="relative w-full h-4 bg-gray-800 border-2 border-gray-600">
          <div className="energy-bar-drain absolute inset-0 bg-gradient-to-r from-green-500 via-yellow-500 to-red-500"></div>
        </div>
        <div className="text-xs pixel-text text-red-400 mt-1 text-right energy-text-blink">
          CRITICAL!
        </div>
      </div>
    </div>
  );
};

// 组合所有街机动画
export const ArcadeAnimations = () => {
  return (
    <>
      <FallingText />
      <ChaseGame />
      <EnergyDrain />
    </>
  );
};