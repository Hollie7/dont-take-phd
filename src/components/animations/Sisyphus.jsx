import React from 'react';

export const Sisyphus = () => {
  return (
    <div className="absolute bottom-20 left-20 w-96 h-64 pointer-events-none">
      {/* 山坡路径 */}
      <svg className="absolute inset-0 w-full h-full" viewBox="0 0 400 250">
        <defs>
          {/* 定义山坡路径 */}
          <path
            id="hillPath"
            d="M 50 220 Q 150 180, 250 100 T 350 80"
            fill="none"
            stroke="#4ade80"
            strokeWidth="3"
            strokeDasharray="5,5"
            opacity="0.3"
          />
        </defs>
        
        {/* 显示山坡 */}
        <use href="#hillPath" />
        
        {/* 山顶标记 */}
        <circle cx="350" cy="80" r="3" fill="#fbbf24" opacity="0.5" />
      </svg>

      {/* 西西弗斯和石头组 */}
      <div className="sisyphus-journey">
        {/* 石头 */}
        <div className="sisyphus-rock">
          <svg width="32" height="32" viewBox="0 0 32 32">
            <rect x="4" y="4" width="24" height="24" fill="#78716c" />
            <rect x="2" y="6" width="2" height="20" fill="#57534e" />
            <rect x="28" y="6" width="2" height="20" fill="#57534e" />
            <rect x="6" y="2" width="20" height="2" fill="#a8a29e" />
            <rect x="6" y="28" width="20" height="2" fill="#44403c" />
            {/* 裂纹 */}
            <rect x="12" y="8" width="2" height="16" fill="#44403c" opacity="0.5" />
            <rect x="18" y="10" width="2" height="12" fill="#44403c" opacity="0.5" />
          </svg>
        </div>

        {/* 小人 */}
        <div className="sisyphus-person">
          <svg width="24" height="32" viewBox="0 0 24 32">
            {/* 头 */}
            <rect x="8" y="0" width="8" height="8" fill="#fbbf24" />
            {/* 身体 */}
            <rect x="6" y="8" width="12" height="12" fill="#3b82f6" />
            {/* 手臂（推的姿势） */}
            <rect x="0" y="10" width="6" height="4" fill="#fbbf24" className="arm-push" />
            <rect x="18" y="12" width="6" height="4" fill="#fbbf24" />
            {/* 腿 */}
            <rect x="7" y="20" width="4" height="12" fill="#1e40af" className="leg-left" />
            <rect x="13" y="20" width="4" height="12" fill="#1e40af" className="leg-right" />
          </svg>
        </div>
      </div>

      {/* 石头滚落 */}
      <div className="rock-rolling">
        <svg width="32" height="32" viewBox="0 0 32 32">
          <rect x="4" y="4" width="24" height="24" fill="#78716c" />
          <rect x="2" y="6" width="2" height="20" fill="#57534e" />
          <rect x="28" y="6" width="2" height="20" fill="#57534e" />
          <rect x="6" y="2" width="20" height="2" fill="#a8a29e" />
          <rect x="6" y="28" width="20" height="2" fill="#44403c" />
        </svg>
      </div>

      {/* 小人返回 */}
      <div className="person-return">
        <svg width="24" height="32" viewBox="0 0 24 32">
          <rect x="8" y="0" width="8" height="8" fill="#fbbf24" />
          <rect x="6" y="8" width="12" height="12" fill="#3b82f6" />
          <rect x="4" y="12" width="6" height="4" fill="#fbbf24" />
          <rect x="14" y="12" width="6" height="4" fill="#fbbf24" />
          <rect x="7" y="20" width="4" height="12" fill="#1e40af" />
          <rect x="13" y="20" width="4" height="12" fill="#1e40af" />
        </svg>
      </div>
    </div>
  );
};