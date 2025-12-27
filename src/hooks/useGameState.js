import { useState, useEffect } from 'react';

/**
 * 游戏状态管理 Hook
 */
export const useGameState = () => {
  const [gameState, setGameState] = useState('init');
  const [advisorProfile, setAdvisorProfile] = useState(null);
  const [messages, setMessages] = useState([]);
  const [satisfaction, setSatisfaction] = useState(50);
  const [turnCount, setTurnCount] = useState(0);
  const [isProcessing, setIsProcessing] = useState(false);
  const [currentEmotion, setCurrentEmotion] = useState('neutral');

  // 根据满意度自动更新表情
  useEffect(() => {
    if (isProcessing) {
      setCurrentEmotion('thinking');
    } else if (satisfaction >= 70) {
      setCurrentEmotion('happy');
    } else if (satisfaction < 30) {
      setCurrentEmotion('sad');
    } else {
      setCurrentEmotion('neutral');
    }
  }, [satisfaction, isProcessing]);

  const resetGame = () => {
    setGameState('init');
    setAdvisorProfile(null);
    setMessages([]);
    setSatisfaction(50);
    setTurnCount(0);
    setIsProcessing(false);
    setCurrentEmotion('neutral');
  };

  const startGame = (profile) => {
    setAdvisorProfile(profile);
    setGameState('playing');
    setMessages([{
      role: 'advisor',
      content: `你好，我是${profile.name}。请告诉我，你为什么想要攻读PhD？`,
      timestamp: Date.now()
    }]);
  };

  return {
    gameState,
    setGameState,
    advisorProfile,
    setAdvisorProfile,
    messages,
    setMessages,
    satisfaction,
    setSatisfaction,
    turnCount,
    setTurnCount,
    isProcessing,
    setIsProcessing,
    currentEmotion,
    resetGame,
    startGame
  };
};