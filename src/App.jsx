import React, { useState } from 'react';
import { useGameState } from './hooks/useGameState';
import { InitScreen } from './screens/InitScreen';
import { IntroScreen } from './screens/IntroScreen';
import { PlayingScreen } from './screens/PlayingScreen';
import { OfferScreen } from './screens/OfferScreen';
import { RejectionScreen } from './screens/RejectionScreen';
import { AdvisorModal } from './components/AdvisorModal';
import { LanguageProvider } from './contexts/LanguageContext';

function AppContent() {
  const {
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
  } = useGameState();

  const [showAdvisorModal, setShowAdvisorModal] = useState(false);

  const handleAdvisorGenerated = (profile) => {
    setAdvisorProfile(profile);
    setGameState('intro');
  };

  const handleStartGame = () => {
    startGame(advisorProfile);
  };

  const handleGameEnd = (result) => {
    setGameState(result);
  };

  // 根据游戏状态渲染不同页面
  switch (gameState) {
    case 'init':
      return <InitScreen onAdvisorGenerated={handleAdvisorGenerated} />;
    
    case 'intro':
      return (
        <>
          <IntroScreen 
            advisorProfile={advisorProfile}
            onStartGame={handleStartGame}
            onReset={resetGame}
            onShowModal={() => setShowAdvisorModal(true)}
          />
          {showAdvisorModal && (
            <AdvisorModal 
              advisorProfile={advisorProfile}
              currentEmotion="neutral"
              isProcessing={false}
              onClose={() => setShowAdvisorModal(false)}
            />
          )}
        </>
      );
    
    case 'playing':
      return (
        <>
          <PlayingScreen 
            advisorProfile={advisorProfile}
            messages={messages}
            setMessages={setMessages}
            satisfaction={satisfaction}
            setSatisfaction={setSatisfaction}
            turnCount={turnCount}
            setTurnCount={setTurnCount}
            isProcessing={isProcessing}
            setIsProcessing={setIsProcessing}
            currentEmotion={currentEmotion}
            onGameEnd={handleGameEnd}
            onShowModal={() => setShowAdvisorModal(true)}
          />
          {showAdvisorModal && (
            <AdvisorModal 
              advisorProfile={advisorProfile}
              currentEmotion={currentEmotion}
              isProcessing={isProcessing}
              onClose={() => setShowAdvisorModal(false)}
            />
          )}
        </>
      );
    
    case 'offer':
      return <OfferScreen advisorProfile={advisorProfile} onReset={resetGame} />;
    
    case 'rejection':
      return <RejectionScreen advisorProfile={advisorProfile} onReset={resetGame} />;
    
    default:
      return <InitScreen onAdvisorGenerated={handleAdvisorGenerated} />;
  }
}

function App() {
  return (
    <LanguageProvider>
      <AppContent />
    </LanguageProvider>
  );
}

export default App;