import React, { useState, useEffect } from 'react';

export const BookTower = () => {
  const [isPlaying, setIsPlaying] = useState(true);

  // 书籍数据 - 增加随机性
  const books = [
    { 
      color: { primary: '#a78bfa', secondary: '#7c3aed' },
      width: 80,
      rotation: 2,
      offsetX: -5
    },
    { 
      color: { primary: '#ec4899', secondary: '#be185d' },
      width: 70,
      rotation: -3,
      offsetX: 8
    },
    { 
      color: { primary: '#fbbf24', secondary: '#d97706' },
      width: 85,
      rotation: 1,
      offsetX: -3
    },
    { 
      color: { primary: '#60a5fa', secondary: '#2563eb' },
      width: 75,
      rotation: -2,
      offsetX: 5
    },
    { 
      color: { primary: '#34d399', secondary: '#059669' },
      width: 78,
      rotation: 3,
      offsetX: -7
    },
    { 
      color: { primary: '#f472b6', secondary: '#db2777' },
      width: 82,
      rotation: -1,
      offsetX: 4
    },
    { 
      color: { primary: '#fb923c', secondary: '#ea580c' },
      width: 72,
      rotation: 2,
      offsetX: -4
    },
    { 
      color: { primary: '#a855f7', secondary: '#7e22ce' },
      width: 76,
      rotation: -2,
      offsetX: 6
    },
  ];

  // 动画完成后重新开始
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsPlaying(false);
      setTimeout(() => setIsPlaying(true), 100);
    }, 14000); // 整个动画周期

    return () => clearTimeout(timer);
  }, [isPlaying]);

  if (!isPlaying) return null;

  return (
    <div className="absolute bottom-10 right-10 w-48 h-80 pointer-events-none">
      {/* 地面 */}
      <div className="absolute bottom-0 w-full h-1 bg-cyan-500/30"></div>

      {/* 书籍堆叠 */}
      <div className="relative w-full h-full">
        {books.map((book, index) => (
          <div
            key={index}
            className="absolute left-1/2 book-stack-messy"
            style={{
              animationDelay: `${index * 0.7}s`,
              bottom: `${index * 28}px`,
              transform: `translateX(-50%) translateX(${book.offsetX}px)`,
            }}
          >
            <svg width={book.width} height="32" viewBox={`0 0 ${book.width} 32`} 
              style={{
                transform: `rotate(${book.rotation}deg)`,
              }}>
              {/* 书本主体 */}
              <rect x="4" y="8" width={book.width - 8} height="20" fill={book.color.primary} />
              <rect x="0" y="10" width="4" height="16" fill={book.color.secondary} />
              <rect x={book.width - 4} y="10" width="4" height="16" fill={book.color.secondary} />
              
              {/* 书脊细节 */}
              <rect x="8" y="12" width="2" height="12" fill={book.color.secondary} opacity="0.5" />
              <rect x="12" y="12" width={book.width - 24} height="2" fill="white" opacity="0.3" />
              <rect x="12" y="18" width={book.width - 24} height="2" fill="white" opacity="0.3" />
              
              {/* 书页效果 */}
              <rect x="6" y="28" width={book.width - 12} height="2" fill="#f0f0f0" opacity="0.8" />
            </svg>
          </div>
        ))}

        {/* 摇晃的塔 */}
        <div 
          className="absolute inset-0 tower-wobble"
          style={{
            animationDelay: `${books.length * 0.7}s`,
          }}
        />

        {/* 崩塌的书本 - 更随机的方向 */}
        {books.map((book, index) => (
          <div
            key={`fall-${index}`}
            className="absolute book-fall-messy"
            style={{
              animationDelay: `${8 + index * 0.12}s`,
              left: `${Math.random() * 100}%`,
              top: `${30 + index * 15}%`,
              '--fall-x': `${(Math.random() - 0.5) * 200}px`,
              '--fall-rotation': `${Math.random() * 1080 - 540}deg`,
            }}
          >
            <svg width={book.width * 0.8} height="24" viewBox={`0 0 ${book.width * 0.8} 24`}>
              <rect x="0" y="0" width={book.width * 0.8} height="20" fill={book.color.primary} />
              <rect x="4" y="4" width={book.width * 0.8 - 8} height="2" fill="white" opacity="0.3" />
            </svg>
          </div>
        ))}
      </div>

      {/* 灰尘效果 */}
      <div className="dust-cloud" style={{ animationDelay: '8s' }}>
        {[...Array(6)].map((_, i) => (
          <div
            key={i}
            className="dust-particle"
            style={{
              left: `${20 + i * 15}%`,
              animationDelay: `${8 + i * 0.1}s`,
            }}
          >
            <div className="w-1 h-1 bg-gray-400 rounded-full"></div>
          </div>
        ))}
      </div>
    </div>
  );
};