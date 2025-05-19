import React, { useState, useEffect } from 'react';
import StartScreen from './pages/StartScreen';
import ConsciousnessScene from './pages/ConsciousnessScene';
import PacManGameScene from './pages/PacManGameScene';
import { GameOverReason } from './components/PacManGame';
import WorldMapScene from './pages/WorldMapScene';
import DimensionalRiftScene from './pages/DimensionalRiftScene';
import SkyRelicsScene from './pages/SkyRelicsScene';
import DimensionalRiftGatewayScene from './pages/DimensionalRiftGatewayScene';
import FinalCreditsScene from './pages/FinalCreditsScene';
import BibliotecaSapencialScene from './pages/BibliotecaSapencialScene';
import OracleTempleScene from './pages/OracleTempleScene';
import useAudioManager from './hooks/useAudioManager';

export type SceneName = 'start' | 'consciousness' | 'pacman' | 'worldMap' | 'dimensional_rift' | 'sky_relics' | 'riftGateway' | 'finalCredits' | 'biblioteca' | 'oracleTemple';

const Index: React.FC = () => {
  const [currentScene, setCurrentScene] = useState<SceneName>('start');
  const audioManager = useAudioManager();

  useEffect(() => {
    const resume = () => {
      audioManager.manualResumeAudioContext();
      window.removeEventListener('click', resume, true);
      window.removeEventListener('keydown', resume, true);
      window.removeEventListener('touchstart', resume, true);
    };
    window.addEventListener('click', resume, { once: true, capture: true });
    window.addEventListener('keydown', resume, { once: true, capture: true });
    window.addEventListener('touchstart', resume, { once: true, capture: true });
    return () => {
      window.removeEventListener('click', resume, true);
      window.removeEventListener('keydown', resume, true);
      window.removeEventListener('touchstart', resume, true);
    };
  }, [audioManager]);

  const handleSceneComplete = (nextScene: SceneName) => {
    console.log(`[App.tsx] handleSceneComplete: Mudando para cena ${nextScene}`);
    setCurrentScene(nextScene);
  };

  const handleGameOver = (reason: GameOverReason) => {
    console.log(`[App.tsx] handleGameOver: Razão ${reason.type}`);
    if (reason.type === 'exit_reached') {
      setCurrentScene('dimensional_rift');
    } else if (reason.type === 'caught_by_pacman') {
      setCurrentScene('consciousness');
    } else {
      setCurrentScene('start');
    }
  };

  const handleNavigateFromWorldMap = (targetPointId: string) => {
    console.log(`[App.tsx] handleNavigateFromWorldMap para: ${targetPointId}`);
    if (targetPointId === 'vestigios_ceu') {
      setCurrentScene('sky_relics');
    } else if (targetPointId === 'biblioteca_sapencial') {
      setCurrentScene('biblioteca');
    } else if (targetPointId === 'oraculo') {
      setCurrentScene('oracleTemple');
    } else if (targetPointId === 'fenda_primeiro_raio') {
      setCurrentScene('riftGateway');
    }
  };

  const renderScene = () => {
    console.log(`[App.tsx] Renderizando cena: ${currentScene}`);
    switch (currentScene) {
      case 'start':
        return <StartScreen onStart={() => handleSceneComplete('consciousness')} />;
      case 'consciousness':
        return <ConsciousnessScene
                 onContinue={() => handleSceneComplete('pacman')}
               />;
      case 'pacman':
        return <PacManGameScene onGameOver={handleGameOver} />;
      case 'dimensional_rift':
        return <DimensionalRiftScene onTransitionComplete={() => setCurrentScene('sky_relics')} />;
      case 'worldMap':
        return <WorldMapScene onNavigate={handleNavigateFromWorldMap} bosqueCompleted={false} />;
      case 'sky_relics':
        return <SkyRelicsScene onComplete={() => setCurrentScene('worldMap')} />;
      case 'riftGateway':
        return <DimensionalRiftGatewayScene 
                  onComplete={(outcome) => {
                    if (outcome === 'finalScreen') {
                      setCurrentScene('finalCredits');
                    } else if (outcome === 'pacman') {
                      setCurrentScene('pacman');
                    } else if (outcome === 'startOver') {
                      setCurrentScene('start');
                    }
                  }}
                  onReturnToMap={() => setCurrentScene('worldMap')}
                />;
      case 'finalCredits':
        return <FinalCreditsScene onRestart={() => setCurrentScene('start')} />;
      case 'biblioteca':
        return <BibliotecaSapencialScene onReturnToMap={() => setCurrentScene('worldMap')} />;
      case 'oracleTemple':
        return <OracleTempleScene 
                  onExit={() => setCurrentScene('worldMap')} 
                  onInteractionComplete={(query) => {
                    console.log("Consulta ao Oráculo enviada:", query);
                  }}
                />;
      default:
        const exhaustiveCheck: never = currentScene;
        console.warn(`[App.tsx] Cena desconhecida: ${exhaustiveCheck}. Voltando para 'start'.`);
        return <StartScreen onStart={() => handleSceneComplete('consciousness')} />;
    }
  };

  return renderScene();
};

export default Index;