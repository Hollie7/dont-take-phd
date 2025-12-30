import React from 'react';

export const Background = () => {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {/* 极简网格背景 */}
      <div className="absolute inset-0 opacity-[0.03]">
        <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="notion-grid" width="32" height="32" patternUnits="userSpaceOnUse">
              <path d="M 32 0 L 0 0 0 32" fill="none" stroke="#000000" strokeWidth="1"/>
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#notion-grid)" />
        </svg>
      </div>
    </div>
  );
};