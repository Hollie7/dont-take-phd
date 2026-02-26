import React, { useState, useRef, useEffect } from 'react';
import { AdvisorAvatar } from '../components/AdvisorAvatar';
import { SatisfactionBar } from '../components/SatisfactionBar';
import { ChatMessage } from '../components/ChatMessage';
import { GameInput } from '../components/GameInput';
import { evaluateStudentResponse } from '../services/apiService';
import { useLanguage } from '../contexts/LanguageContext';
import { Background } from '../components/Background';

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
      console.error('evaluateStudentResponse error:', error);
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
    <div className="min-h-screen bg-white flex items-center justify-center p-6 relative">
      <Background />

      <div className="max-w-5xl w-full relative z-10 flex flex-col" style={{ height: '90vh' }}>
        
        {/* 顶部信息栏 */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 mb-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <AdvisorAvatar
                emotion={currentEmotion}
                isProcessing={isProcessing}
                onClick={onShowModal}
                size="md"
                gender={advisorProfile.gender}
                customAvatar={advisorProfile.customAvatar}
              />
              <div>
                <h1 className="text-xl font-semibold text-gray-900">
                  {advisorProfile.name}
                </h1>
                <p className="text-sm text-gray-500 mt-0.5">
                  {tf('playing.round', { current: turnCount + 1, total: MAX_TURNS })}
                </p>
              </div>
            </div>
            <SatisfactionBar satisfaction={satisfaction} />
          </div>
        </div>

        {/* 聊天区域 */}
        <div className="flex-1 bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden mb-4">
          <div className="h-full overflow-y-auto p-6">
            {messages.map((msg, idx) => (
              <ChatMessage 
                key={idx} 
                message={msg} 
                advisorName={advisorProfile.name}
              />
            ))}
            {isProcessing && (
              <div className="flex justify-center py-4">
                <div className="bg-gray-50 rounded-xl px-5 py-3 border border-gray-100">
                  <div className="flex items-center gap-3">
                    <div className="flex gap-1">
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
                    </div>
                    <p className="text-gray-600 text-sm">
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