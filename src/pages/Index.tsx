import React, { useState, useEffect } from 'react';
import StartScreen from './StartScreen';
import ConsciousnessScene from './ConsciousnessScene';
import PacManGameScene from './PacManGameScene';
import AchievementScreen from './AchievementScreen';
import PortalTransitionScene from './PortalTransitionScene';
import { GameOverReason } from '../components/PacManGame';
import BosqueScene from './BosqueScene';

const Index = () => {
  const [currentScene, setCurrentScene] = useState<'start' | 'consciousness' | 'achievement' | 'pacman' | 'portal_transition' | 'bosque' | 'mapa' | 'end'>('start');

  // Efeito para depuração: Observe as mudanças de cena no console
  useEffect(() => {
    console.log("Current scene changed to:", currentScene);
  }, [currentScene]);

  const handleStartGame = () => {
    setCurrentScene('consciousness');
  };

  const handleConsciousnessComplete = () => {
    setCurrentScene('achievement');
  };

  const handleAchievementContinue = () => {
    setCurrentScene('pacman');
  };
  
  const handleGameOver = (reason: GameOverReason) => {
    if (reason.type === 'caught_by_pacman') {
      setCurrentScene('consciousness');
    } else if (reason.type === 'exit_reached') {
      setCurrentScene('portal_transition'); 
    } else {
      setCurrentScene('start');
    }
  };

  // Esta função agora leva para a 'bosque'
  const handlePortalTransitionComplete = () => {
    console.log("Portal transition complete, attempting to set scene to 'bosque'");
    setCurrentScene('bosque'); 
  };

  return (
    <div className="arcade-app">
      {currentScene === 'start' && (
        <StartScreen onStart={handleStartGame} />
      )}
      
      {currentScene === 'consciousness' && (
        <ConsciousnessScene onContinue={handleConsciousnessComplete} />
      )}
      
      {currentScene === 'achievement' && (
        <AchievementScreen 
          onContinue={handleAchievementContinue}
          achievementTitle="Germinar da Consciência"
          achievementDescription="Você sentiu pela primeira vez que há algo além do ciclo. Uma nova percepção começou a brotar."
          progressNumerator={1}
          progressDenominator={4}
        />
      )}
      
      {currentScene === 'pacman' && (
        <PacManGameScene onGameOver={handleGameOver} />
      )}
      
      {currentScene === 'portal_transition' && (
        <PortalTransitionScene onComplete={handlePortalTransitionComplete} />
      )}
      
      {/* Bloco de renderização para BosqueScene */}
      {currentScene === 'bosque' && (
        <BosqueScene onNavigateToMap={() => {
          console.log("Navigating to map placeholder from BosqueScene");
          setCurrentScene('mapa'); // Próxima cena após o bosque será 'mapa'
        }} />
      )}
      
      {/* Placeholder para a futura MapaScene */}
      {currentScene === 'mapa' && (
        <div className="scene-container bg-black flex items-center justify-center min-h-screen text-white pixelated-font">
          <p>Mapa Scene - Placeholder</p>
          <button 
            onClick={() => setCurrentScene('bosque')} // Botão temporário para voltar ao bosque
            className="mt-4 p-2 bg-arcade-blue text-white pixelated-font rounded hover:bg-arcade-blue-dark"
          >
            Voltar ao Bosque (Temp)
          </button>
        </div>
      )}
      
      {currentScene === 'end' && (
        <div className="min-h-screen flex flex-col items-center justify-center bg-black arcade-scanline">
          <div className="text-center">
            <h2 className="text-arcade-magenta text-4xl mb-6 font-pixel">FIM DE JOGO</h2>
            <div className="text-arcade-white text-lg mt-8">
              O destino de Pinky foi selado...
            </div>
            <div className="text-arcade-blue text-lg font-pixel mt-10 animate-pulse">
              Retornando ao início...
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Index;
