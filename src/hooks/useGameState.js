import { useState, useEffect } from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import { translations } from '../locales/translations';

/**
 * 游戏状态管理 Hook
 */
export const useGameState = () => {
  const [gameState, setGameState] = useState('init');
  const [advisorProfile, setAdvisorProfile] = useState(null);
  const [messages, setMessages] = useState([]);
  const [satisfaction, setSatisfaction] = useState(30);
  const [turnCount, setTurnCount] = useState(0);
  const [isProcessing, setIsProcessing] = useState(false);
  const [currentEmotion, setCurrentEmotion] = useState('neutral');

  const { language } = useLanguage(); // 获取当前语言

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
    setSatisfaction(30);
    setTurnCount(0);
    setIsProcessing(false);
    setCurrentEmotion('neutral');
  };

  const startGame = (profile) => {
    setAdvisorProfile(profile);
    setGameState('playing');
    
    // 使用翻译配置
    const template = translations[language]?.intro?.initialMessage || translations.zh.intro.initialMessage;
    const initialMessage = template.replace('{name}', profile.name);
    
    setMessages([{
      role: 'advisor',
      content: initialMessage,
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