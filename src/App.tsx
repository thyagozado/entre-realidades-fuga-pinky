import React, { useState, useEffect } from 'react';
import StartScreen from './pages/StartScreen';
import ConsciousnessScene from './pages/ConsciousnessScene';
import AchievementScreen from './pages/AchievementScreen';
import PacManGameScene from './pages/PacManGameScene';
import { GameOverReason } from './components/PacManGame';
import WorldMapScene from './pages/WorldMapScene';
import DimensionalRiftScene from './pages/DimensionalRiftScene';
import SkyRelicsScene from './pages/SkyRelicsScene';
import DimensionalRiftGatewayScene from './pages/DimensionalRiftGatewayScene';
import FinalCreditsScene from './pages/FinalCreditsScene';
import BibliotecaSapencialScene from './pages/BibliotecaSapencialScene';

export type SceneName = 'start' | 'consciousness' | 'achievement' | 'pacman' | 'worldMap' | 'dimensional_rift' | 'sky_relics' | 'riftGateway' | 'finalCredits' | 'biblioteca';

const Index: React.FC = () => {
  const [currentScene, setCurrentScene] = useState<SceneName>('start');

  const handleSceneComplete = (nextScene: SceneName) => {
    console.log(`[Index.tsx] handleSceneComplete: Mudando para cena ${nextScene}`);
    setCurrentScene(nextScene);
  };

  const handleGameOver = (reason: GameOverReason) => {
    console.log(`[Index.tsx] handleGameOver: Razão ${reason.type}`);
    if (reason.type === 'exit_reached') {
      setCurrentScene('dimensional_rift');
    } else if (reason.type === 'caught_by_pacman') {
      setCurrentScene('consciousness');
    } else {
      setCurrentScene('start');
    }
  };

  const handleNavigateFromWorldMap = (targetPointId: string) => {
    console.log(`[Index.tsx] handleNavigateFromWorldMap para: ${targetPointId}`);
    if (targetPointId === 'vestigios_ceu') {
      setCurrentScene('sky_relics');
    } else if (targetPointId === 'biblioteca_sapencial') {
      setCurrentScene('biblioteca');
    } else if (targetPointId === 'oraculo') {
      console.log("Navegação para Oráculo ainda não implementada.");
    } else if (targetPointId === 'fenda_primeiro_raio') {
      setCurrentScene('riftGateway');
    }
  };

  const renderScene = () => {
    console.log(`[Index.tsx] Renderizando cena: ${currentScene}`);
    switch (currentScene) {
      case 'start':
        return <StartScreen onStart={() => handleSceneComplete('consciousness')} />;
      case 'consciousness':
        return <ConsciousnessScene
                 onContinue={() => handleSceneComplete('achievement')}
               />;
      case 'achievement':
        return <AchievementScreen 
                 onContinue={() => handleSceneComplete('pacman')} 
                 achievementTitle="Germinar da Consciência"
                 achievementDescription="Você sentiu pela primeira vez que há algo além do ciclo. Uma nova percepção começou a brotar."
                 progressNumerator={1}
                 progressDenominator={4}
               />;
      case 'pacman':
        return <PacManGameScene onGameOver={handleGameOver} />;
      case 'dimensional_rift':
        return <DimensionalRiftScene onTransitionComplete={() => setCurrentScene('sky_relics')} />;
      case 'worldMap':
        return <WorldMapScene onNavigate={handleNavigateFromWorldMap} />;
      case 'sky_relics':
        return <SkyRelicsScene onComplete={() => setCurrentScene('worldMap')} />;
      case 'riftGateway':
        return <DimensionalRiftGatewayScene 
                  onComplete={(outcome) => {
                    if (outcome === 'finalScreen') {
                      setCurrentScene('finalCredits');
                    } else if (outcome === 'pacman') {
                      setCurrentScene('pacman');
                    }
                  }}
                  onReturnToMap={() => setCurrentScene('worldMap')}
                />;
      case 'finalCredits':
        return <FinalCreditsScene onRestart={() => setCurrentScene('start')} />;
      case 'biblioteca':
        return <BibliotecaSapencialScene onReturnToMap={() => setCurrentScene('worldMap')} />;
      default:
        console.warn(`[Index.tsx] Cena desconhecida: ${currentScene}. Voltando para 'start'.`);
        return <StartScreen onStart={() => handleSceneComplete('consciousness')} />;
    }
  };

  return renderScene();
};

export default Index;