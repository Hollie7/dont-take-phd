import React, { useState, useRef, useEffect } from 'react';
import { AdvisorAvatar } from '../components/AdvisorAvatar';
import { SatisfactionBar } from '../components/SatisfactionBar';
import { ChatMessage } from '../components/ChatMessage';
import { GameInput } from '../components/GameInput';
import { evaluateStudentResponse } from '../services/deepseekAPI';
import { useLanguage } from '../contexts/LanguageContext';
import { ArcadeBackground } from '../components/ArcadeBackground';

export const PlayingScreen = ({ 
  advisorProfile, 
  messages, 
  setMessages,
  satisfaction,
  setSatisfaction,
  turnCount,
  setTurnCount,
  isProcessing,
  setIsProcessing,
  currentEmotion,
  onGameEnd,
  onShowModal
}) => {
  const [userInput, setUserInput] = useState('');
  const messagesEndRef = useRef(null);
  const { t, tf, language } = useLanguage();

  const MAX_TURNS = 7;

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = async () => {
    if (!userInput.trim() || isProcessing) return;

    const userMessage = userInput.trim();
    setUserInput('');
    setMessages(prev => [...prev, { role: 'student', content: userMessage, timestamp: Date.now() }]);
    setIsProcessing(true);

    try {
      const history = messages.map(m => ({
        role: m.role === 'advisor' ? 'assistant' : 'user',
        content: m.content
      }));

      const evaluation = await evaluateStudentResponse(
        userMessage, 
        history, 
        advisorProfile, 
        satisfaction, 
        turnCount,
        language
      );
      
      const newSat = Math.max(0, Math.min(100, satisfaction + evaluation.satisfaction_change));
      setSatisfaction(newSat);
      setTurnCount(prev => prev + 1);

      setMessages(prev => [...prev, {
        role: 'advisor',
        content: evaluation.next_question,
        satisfactionChange: evaluation.satisfaction_change,
        timestamp: Date.now()
      }]);

      if (evaluation.should_end || turnCount >= 6) {
        setTimeout(() => {
          onGameEnd(newSat >= 70 ? 'offer' : 'rejection');
        }, 2000);
      }
    } catch (error) {
      setMessages(prev => [...prev, {
        role: 'advisor',
        content: t('playing.errorMessage'),
        timestamp: Date.now()
      }]);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 via-purple-900/50 to-black flex items-center justify-center p-4 relative overflow-hidden">
      {/* 街机背景 */}
      <ArcadeBackground />

      <div className="max-w-5xl w-full relative z-10 flex flex-col" style={{ height: '90vh' }}>
        
        {/* 顶部信息栏 - CRT 屏幕风格 */}
        <div className="bg-gradient-to-b from-gray-800 to-gray-900 border-4 border-cyan-500 p-4 pixel-corners mb-4 relative"
          style={{
            boxShadow: '0 0 20px rgba(0,255,255,0.3), inset 0 0 20px rgba(0,0,0,0.5)'
          }}>
          
          {/* 状态指示灯 */}
          <div className="absolute top-2 right-2 flex gap-2">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
            <div className="w-2 h-2 bg-cyan-500 rounded-full animate-pulse" style={{animationDelay: '0.3s'}}></div>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <AdvisorAvatar 
                emotion={currentEmotion} 
                isProcessing={isProcessing} 
                onClick={onShowModal}
                size="md"
                gender={advisorProfile.gender}
              />
              <div>
                <h1 className="text-xl font-bold text-cyan-400 pixel-text"
                  style={{textShadow: '0 0 10px rgba(0,255,255,0.8)'}}>
                  {advisorProfile.name}
                </h1>
                <p className="text-cyan-300 text-sm font-mono"
                  style={{textShadow: '0 0 5px rgba(0,255,255,0.5)'}}>
                  {tf('playing.round', { current: turnCount + 1, total: MAX_TURNS })}
                </p>
              </div>
            </div>
            <SatisfactionBar satisfaction={satisfaction} />
          </div>
        </div>

        {/* 聊天区域 - CRT 显示器 */}
        <div className="flex-1 bg-gradient-to-b from-gray-800 to-gray-900 border-4 border-cyan-500 pixel-corners overflow-hidden relative mb-4"
          style={{
            boxShadow: '0 0 20px rgba(0,255,255,0.3), inset 0 0 30px rgba(0,0,0,0.7)'
          }}>
          
          {/* 扫描线效果 */}
          <div className="absolute inset-0 pointer-events-none z-20 opacity-5">
            <div className="w-full h-full" style={{
              backgroundImage: 'repeating-linear-gradient(0deg, transparent, transparent 2px, #00ffff 2px, #00ffff 4px)',
            }}></div>
          </div>

          {/* CRT 屏幕光晕 */}
          <div className="absolute inset-0 bg-gradient-radial from-cyan-900/10 via-transparent to-transparent pointer-events-none z-10"></div>

          {/* 消息内容 */}
          <div className="h-full overflow-y-auto p-6 bg-black/80 relative z-10">
            {messages.map((msg, idx) => (
              <ChatMessage 
                key={idx} 
                message={msg} 
                advisorName={advisorProfile.name}
              />
            ))}
            {isProcessing && (
              <div className="text-center py-4">
                <div className="inline-block bg-gray-900/80 border-2 border-cyan-500/50 px-6 py-3 pixel-corners">
                  <div className="flex items-center gap-3">
                    <div className="flex gap-1">
                      <div className="w-2 h-2 bg-cyan-400 rounded-full animate-bounce"></div>
                      <div className="w-2 h-2 bg-cyan-400 rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
                      <div className="w-2 h-2 bg-cyan-400 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
                    </div>
                    <p className="text-cyan-400 text-sm font-mono"
                      style={{textShadow: '0 0 5px rgba(0,255,255,0.5)'}}>
                      {t('playing.thinking')}
                    </p>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>
        </div>

        {/* 输入区域 */}
        <div className="flex-shrink-0">
          <GameInput 
            value={userInput}
            onChange={setUserInput}
            onSend={handleSend}
            disabled={isProcessing}
          />
        </div>
      </div>
    </div>
  );
};