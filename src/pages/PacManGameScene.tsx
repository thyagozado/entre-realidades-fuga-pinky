import React, { useState, useEffect } from 'react';
import ArcadeScreen from '../components/ArcadeScreen';
import PacManGame, { GameOverReason } from '../components/PacManGame';

interface PacManGameSceneProps {
  onGameOver: (reason: GameOverReason) => void;
}

const PacManGameScene: React.FC<PacManGameSceneProps> = ({ onGameOver }) => {
  const [gameStarted, setGameStarted] = useState(false);
  
  useEffect(() => {
    const timer = setTimeout(() => {
      setGameStarted(true);
    }, 100);
    return () => clearTimeout(timer);
  }, []);

  const handleGameOverInternal = (reason: GameOverReason) => {
    setTimeout(() => {
      onGameOver(reason);
    }, 100);
  };

  return (
    <ArcadeScreen showGrid={false} className="animate-fade-in">
      <div className="flex flex-col items-center justify-center w-full h-full">
          <div className={`w-full ${gameStarted ? 'opacity-100' : 'opacity-0'} transition-opacity duration-500`}>
          {gameStarted && <PacManGame onGameOver={handleGameOverInternal} />}
          </div>
      </div>
    </ArcadeScreen>
  );
};

export default PacManGameScene;
