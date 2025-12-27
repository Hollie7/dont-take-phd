import React, { useState, useRef, useEffect } from 'react';
import { AdvisorAvatar } from '../components/AdvisorAvatar';
import { SatisfactionBar } from '../components/SatisfactionBar';
import { ChatMessage } from '../components/ChatMessage';
import { GameInput } from '../components/GameInput';
import { evaluateStudentResponse } from '../services/deepseekAPI';

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
  const [inputValue, setInputValue] = useState('');
  const messagesEndRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = async () => {
    if (!inputValue.trim() || isProcessing) return;

    const userMessage = inputValue.trim();
    setInputValue('');
    setMessages(prev => [...prev, { role: 'student', content: userMessage, timestamp: Date.now() }]);
    setIsProcessing(true);

    try {
      const history = messages.map(m => ({
        role: m.role === 'advisor' ? 'assistant' : 'user',
        content: m.content
      }));

      const evaluation = await evaluateStudentResponse(userMessage, history, advisorProfile, satisfaction, turnCount);
      
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
        content: '抱歉，请再说一次。',
        timestamp: Date.now()
      }]);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-indigo-900 to-indigo-800 p-4">
      <div className="max-w-4xl mx-auto">
        <div className="bg-indigo-800 border-4 border-indigo-600 p-4 mb-4 pixel-corners">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <AdvisorAvatar 
                emotion={currentEmotion} 
                isProcessing={isProcessing} 
                onClick={onShowModal}
                size="md"
              />
              <div>
                <h1 className="text-xl font-bold text-white pixel-text">{advisorProfile.name}</h1>
                <p className="text-indigo-300 text-sm">回合 {turnCount + 1}/7</p>
              </div>
            </div>
            <SatisfactionBar value={satisfaction} />
          </div>
        </div>

        <div className="bg-indigo-800 border-4 border-indigo-600 p-4 mb-4 pixel-corners h-96 overflow-y-auto">
          {messages.map((msg, idx) => (
            <ChatMessage key={idx} message={msg} advisorName={advisorProfile.name} />
          ))}
          {isProcessing && (
            <div className="text-center">
              <div className="inline-block bg-indigo-700 border-2 p-3 pixel-corners">
                <p className="text-indigo-300 text-sm">思考中...</p>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        <GameInput 
          value={inputValue}
          onChange={setInputValue}
          onSend={handleSend}
          disabled={isProcessing}
        />
      </div>
    </div>
  );
};