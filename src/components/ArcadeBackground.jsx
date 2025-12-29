import React from 'react';

export const ArcadeBackground = () => {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {/* 网格背景 */}
      <div className="absolute inset-0 opacity-20">
        <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
              <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#00ffff" strokeWidth="0.5"/>
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#grid)" />
        </svg>
      </div>

      {/* 漂浮的像素图标 */}
      <div className="absolute inset-0">
        {/* 星星 */}
        <div className="absolute top-20 left-20 animate-pulse">
          <svg width="16" height="16" viewBox="0 0 16 16">
            <rect x="6" y="0" width="4" height="4" fill="#ff00ff"/>
            <rect x="2" y="4" width="4" height="4" fill="#ff00ff"/>
            <rect x="10" y="4" width="4" height="4" fill="#ff00ff"/>
            <rect x="6" y="8" width="4" height="4" fill="#ff00ff"/>
            <rect x="4" y="12" width="8" height="4" fill="#ff00ff"/>
          </svg>
        </div>

        {/* 硬币 */}
        <div className="absolute top-40 right-32 animate-bounce" style={{animationDuration: '3s'}}>
          <svg width="20" height="20" viewBox="0 0 20 20">
            <rect x="4" y="2" width="12" height="16" fill="#ffd700"/>
            <rect x="2" y="4" width="16" height="12" fill="#ffd700"/>
            <rect x="6" y="6" width="8" height="8" fill="#ffed4e"/>
          </svg>
        </div>

        {/* 问号块 */}
        <div className="absolute bottom-32 left-32 animate-pulse" style={{animationDelay: '1s'}}>
          <svg width="24" height="24" viewBox="0 0 24 24">
            <rect x="0" y="0" width="24" height="24" fill="#ff6b00"/>
            <rect x="8" y="4" width="8" height="2" fill="#fff"/>
            <rect x="14" y="6" width="2" height="4" fill="#fff"/>
            <rect x="12" y="10" width="2" height="2" fill="#fff"/>
            <rect x="10" y="12" width="2" height="4" fill="#fff"/>
            <rect x="10" y="18" width="4" height="2" fill="#fff"/>
          </svg>
        </div>

        {/* 爱心 */}
        <div className="absolute top-1/2 right-20 animate-pulse" style={{animationDelay: '2s'}}>
          <svg width="20" height="20" viewBox="0 0 20 20">
            <rect x="4" y="4" width="4" height="4" fill="#ff1493"/>
            <rect x="12" y="4" width="4" height="4" fill="#ff1493"/>
            <rect x="2" y="8" width="16" height="4" fill="#ff1493"/>
            <rect x="4" y="12" width="12" height="4" fill="#ff1493"/>
            <rect x="6" y="16" width="8" height="2" fill="#ff1493"/>
          </svg>
        </div>

        {/* 学位帽 */}
        <div className="absolute bottom-40 right-40 animate-bounce" style={{animationDuration: '4s', animationDelay: '0.5s'}}>
          <svg width="28" height="28" viewBox="0 0 28 28">
            <rect x="2" y="12" width="24" height="4" fill="#00ffff"/>
            <rect x="10" y="8" width="8" height="4" fill="#0099ff"/>
            <rect x="12" y="16" width="4" height="8" fill="#0099ff"/>
            <circle cx="14" cy="26" r="2" fill="#00ffff"/>
          </svg>
        </div>

        {/* 书本 */}
        <div className="absolute top-1/3 left-1/4 animate-pulse" style={{animationDelay: '1.5s'}}>
          <svg width="24" height="24" viewBox="0 0 24 24">
            <rect x="4" y="6" width="16" height="14" fill="#ff00ff"/>
            <rect x="6" y="8" width="12" height="2" fill="#ff69b4"/>
            <rect x="6" y="12" width="12" height="2" fill="#ff69b4"/>
            <rect x="6" y="16" width="8" height="2" fill="#ff69b4"/>
          </svg>
        </div>
      </div>
    </div>
  );
};