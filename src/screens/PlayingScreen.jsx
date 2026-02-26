import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Mic, MicOff, Volume2 } from 'lucide-react';
import { AdvisorAvatar } from '../components/AdvisorAvatar';
import { SatisfactionBar } from '../components/SatisfactionBar';
import { ChatMessage } from '../components/ChatMessage';
import { GameInput } from '../components/GameInput';
import { VoiceInput } from '../components/VoiceInput';
import { evaluateStudentResponse } from '../services/apiService';
import { speakText } from '../services/voiceService';
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
  const [voiceEnabled, setVoiceEnabled] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [pendingVoiceInput, setPendingVoiceInput] = useState(false);
  // Maps message timestamp → audio object URL for replay
  const [msgAudioMap, setMsgAudioMap] = useState({});

  const messagesEndRef = useRef(null);
  const audioRef = useRef(null);
  // Ref mirrors msgAudioMap so the game-end timeout always captures the latest value
  const msgAudioMapRef = useRef({});
  const { t, tf, language } = useLanguage();

  const MAX_TURNS = 7;

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // When voice mode is toggled, sync UI state
  useEffect(() => {
    if (!voiceEnabled) {
      if (audioRef.current) { audioRef.current.pause(); audioRef.current = null; }
      setIsSpeaking(false);
      setPendingVoiceInput(false);
      return;
    }
    // If it's currently the user's turn when enabling voice, show recording UI
    const lastMsg = messages[messages.length - 1];
    if (lastMsg?.role === 'advisor' && !isProcessing) {
      setPendingVoiceInput(true);
    }
  }, [voiceEnabled]); // intentionally only re-runs on toggle

  const playAdvisorAudio = useCallback(async (text, timestamp) => {
    setIsSpeaking(true);
    try {
      const audioUrl = await speakText(text, advisorProfile.gender);
      setMsgAudioMap(prev => {
        const next = { ...prev, [timestamp]: audioUrl };
        msgAudioMapRef.current = next;
        return next;
      });

      const audio = new Audio(audioUrl);
      audioRef.current = audio;
      audio.onended = () => { setIsSpeaking(false); setPendingVoiceInput(true); audioRef.current = null; };
      audio.onerror = () => { setIsSpeaking(false); setPendingVoiceInput(true); audioRef.current = null; };
      await audio.play();
    } catch (err) {
      console.error('TTS error:', err);
      setIsSpeaking(false);
      setPendingVoiceInput(true);
    }
  }, [advisorProfile.gender]);

  const handleSend = async (explicitText, studentAudioUrl) => {
    const userMessage = (explicitText ?? userInput).trim();
    if (!userMessage || isProcessing) return;

    const studentTimestamp = Date.now();
    setUserInput('');
    setPendingVoiceInput(false);
    const studentMsg = { role: 'student', content: userMessage, timestamp: studentTimestamp };
    setMessages(prev => [...prev, studentMsg]);
    if (studentAudioUrl) {
      setMsgAudioMap(prev => {
        const next = { ...prev, [studentTimestamp]: studentAudioUrl };
        msgAudioMapRef.current = next;
        return next;
      });
    }
    setIsProcessing(true);

    try {
      const history = messages.map(m => ({
        role: m.role === 'advisor' ? 'assistant' : 'user',
        content: m.content
      }));

      const evaluation = await evaluateStudentResponse(
        userMessage, history, advisorProfile, satisfaction, turnCount, language
      );

      const newSat = Math.max(0, Math.min(100, satisfaction + evaluation.satisfaction_change));
      setSatisfaction(newSat);
      setTurnCount(prev => prev + 1);

      const advisorTimestamp = Date.now();
      const advisorMsg = {
        role: 'advisor',
        content: evaluation.next_question,
        satisfactionChange: evaluation.satisfaction_change,
        timestamp: advisorTimestamp
      };
      setMessages(prev => [...prev, advisorMsg]);

      if (evaluation.should_end || turnCount >= 6) {
        // Build full message snapshot for the downloadable record
        const finalMessages = [...messages, studentMsg, advisorMsg];
        setTimeout(() => onGameEnd(
          newSat >= 70 ? 'offer' : 'rejection',
          { messages: finalMessages, msgAudioMap: msgAudioMapRef.current }
        ), 2000);
        return;
      }

      if (voiceEnabled) {
        playAdvisorAudio(evaluation.next_question, advisorTimestamp);
      }
    } catch (error) {
      console.error('evaluateStudentResponse error:', error);
      setMessages(prev => [...prev, {
        role: 'advisor',
        content: t('playing.errorMessage'),
        timestamp: Date.now()
      }]);
      if (voiceEnabled) setPendingVoiceInput(true);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleVoiceTranscribed = (text, audioUrl) => {
    if (text?.trim()) {
      handleSend(text, audioUrl);
    } else {
      if (audioUrl) URL.revokeObjectURL(audioUrl);
      setPendingVoiceInput(true); // empty transcript — let user retry
    }
  };

  const renderInputArea = () => {
    if (!voiceEnabled) {
      return (
        <GameInput
          value={userInput}
          onChange={setUserInput}
          onSend={handleSend}
          disabled={isProcessing}
        />
      );
    }
    if (isProcessing) return null;
    if (isSpeaking) {
      return (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4">
          <div className="flex items-center gap-3 text-gray-500 text-sm">
            <Volume2 className="w-4 h-4 text-blue-400 animate-pulse" />
            {t('voice.speaking')}
          </div>
        </div>
      );
    }
    if (pendingVoiceInput) {
      return (
        <VoiceInput
          onTranscribed={handleVoiceTranscribed}
          onError={() => setVoiceEnabled(false)}
        />
      );
    }
    return null;
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
            <div className="flex items-center gap-3">
              {/* Voice mode toggle */}
              <button
                onClick={() => setVoiceEnabled(prev => !prev)}
                title={voiceEnabled ? t('voice.disable') : t('voice.enable')}
                className={`p-2 rounded-xl border transition-colors ${
                  voiceEnabled
                    ? 'bg-gray-900 text-white border-gray-900'
                    : 'bg-white text-gray-400 border-gray-200 hover:border-gray-400 hover:text-gray-600'
                }`}
              >
                {voiceEnabled ? <Mic className="w-4 h-4" /> : <MicOff className="w-4 h-4" />}
              </button>
              <SatisfactionBar satisfaction={satisfaction} />
            </div>
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
                audioUrl={msgAudioMap[msg.timestamp]}
              />
            ))}
            {isProcessing && (
              <div className="flex justify-center py-4">
                <div className="bg-gray-50 rounded-xl px-5 py-3 border border-gray-100">
                  <div className="flex items-center gap-3">
                    <div className="flex gap-1">
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" />
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }} />
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }} />
                    </div>
                    <p className="text-gray-600 text-sm">{t('playing.thinking')}</p>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>
        </div>

        {/* 输入区域 */}
        <div className="flex-shrink-0">
          {renderInputArea()}
        </div>
      </div>
    </div>
  );
};
