import React, { useState, useEffect } from 'react';
import ArcadeScreen from '../components/ArcadeScreen';
import PacManGame, { GameOverReason } from '../components/PacManGame';
import useAudioManager from '../hooks/useAudioManager';

interface PacManGameSceneProps {
  onGameOver: (reason: GameOverReason) => void;
}

const PacManGameScene: React.FC<PacManGameSceneProps> = ({ onGameOver }) => {
  const [gameStarted, setGameStarted] = useState(false);
  const [showInitialTip, setShowInitialTip] = useState(true);
  const { playSound, stopSound } = useAudioManager();
  
  useEffect(() => {
    const startGameTimer = setTimeout(() => {
      setGameStarted(true);
    }, 100);

    const tipTimer = setTimeout(() => {
      setShowInitialTip(false);
    }, 10000); // Tip dura 10 segundos

    playSound({
      filePath: '/assets/sounds/pacman_game_music.mp3',
      loop: true,
      fadeInDuration: 1.0, // Fade-in de 1 segundo
      volume: 0.4 // Volume um pouco mais baixo para não sobrepor SFX do jogo
    });

    return () => {
      clearTimeout(startGameTimer);
      clearTimeout(tipTimer);
      stopSound('/assets/sounds/pacman_game_music.mp3', 0.5); // Fade-out de 0.5 segundos
    };
  }, [playSound, stopSound]);

  const handleGameOverInternal = (reason: GameOverReason) => {
    setTimeout(() => {
      onGameOver(reason);
    }, 100);
  };

  return (
    <ArcadeScreen showGrid={false} className="animate-fade-in">
      <div className="flex flex-col items-center justify-center w-full h-full p-2 md:p-4"> {/* Added padding for scene margins */}
        {showInitialTip && (
          <div className="absolute top-16 md:top-20 left-1/2 -translate-x-1/2 z-20 p-3 bg-black bg-opacity-70 border-2 border-purple-500 shadow-[0_0_10px_theme(colors.purple.500)] rounded-md font-pixel text-center text-sm md:text-base text-white">
            Encontre a saída para obter respostas
          </div>
        )}
        <div 
          ref={null} // outerGridWrapperRef is in PacManGame.tsx, this div is for positioning
          className={`w-full h-auto aspect-[${28}/${31}] max-w-md md:max-w-lg lg:max-w-xl relative ${gameStarted ? 'opacity-100' : 'opacity-0'} transition-opacity duration-500 mt-8 md:mt-12`} // Reduzido mt-32 md:mt-36 para mt-8 md:mt-12
        >
          {gameStarted && <PacManGame onGameOver={handleGameOverInternal} />}
        </div>
      </div>
    </ArcadeScreen>
  );
};

export default PacManGameScene;
