import React, { useState, useEffect } from 'react';
import ArcadeScreen from '../components/ArcadeScreen';
// import GhostSprite from '../components/GhostSprite'; // Removido
import DialogBox from '../components/DialogBox';
import NeonButton from '../components/NeonButton';
import useAudioManager from '../hooks/useAudioManager';

const NEW_DIALOGUES = [
  "(olhando ao redor): ... de novo?",
  "É sempre a mesma coisa...",
  "Corro. Me pegam. Volto. Corro.",
  "...e se houver algo além disso?",
  "Acho que está na hora de tentar sair daqui..."
];

interface ConsciousnessSceneProps {
  onContinue: () => void;
}

const ConsciousnessScene: React.FC<ConsciousnessSceneProps> = ({ onContinue }) => {
  const [currentDialogueIndex, setCurrentDialogueIndex] = useState(0);
  const [showFleeButtonAfterDialogues, setShowFleeButtonAfterDialogues] = useState(false);
  const [showAchievementCard, setShowAchievementCard] = useState(false);
  const [glitchActive, setGlitchActive] = useState(false);
  const { playSound, stopSound } = useAudioManager();
  const [levelUpSoundPlayed, setLevelUpSoundPlayed] = useState(false);

  useEffect(() => {
    // Trigger glitch effect periodically
    const glitchInterval = setInterval(() => {
      setGlitchActive(true);
      setTimeout(() => setGlitchActive(false), 200);
    }, 3000);

    // Adicionado: Tocar música da cena de consciência
    playSound({
      filePath: '/assets/sounds/consciousness_screen_music.mp3',
      loop: true,
      fadeInDuration: 1.5, // Fade-in de 1.5 segundos
      volume: 1.0 // Volume máximo
    });

    return () => {
      clearInterval(glitchInterval);
      // Adicionado: Parar música da cena de consciência com fade-out
      stopSound('/assets/sounds/consciousness_screen_music.mp3', 1.0); // Fade-out de 1 segundo
    };
  }, [playSound, stopSound]);

  // useEffect para tocar o som de Level Up quando showAchievementCard se tornar true
  useEffect(() => {
    if (showAchievementCard && !levelUpSoundPlayed) {
      playSound({
        filePath: '/assets/sounds/level_up_sfx.mp3',
        loop: false,
        volume: 0.7, // Volume um pouco mais alto para SFX
      });
      setLevelUpSoundPlayed(true); // Marcar que o som foi tocado
    }
  }, [showAchievementCard, levelUpSoundPlayed, playSound]);

  const advanceDialogue = () => {
    if (currentDialogueIndex < NEW_DIALOGUES.length - 1) {
      setCurrentDialogueIndex(currentDialogueIndex + 1);
      setGlitchActive(true); // Optional: keep glitch on dialogue change
      setTimeout(() => setGlitchActive(false), 200);
    } else {
      // Last dialogue finished, show Flee button after 200ms
      setTimeout(() => {
        setShowFleeButtonAfterDialogues(true);
      }, 200);
    }
  };

  const handleFleeAfterDialogues = () => {
    setShowFleeButtonAfterDialogues(false);
    setShowAchievementCard(true);
  };

  return (
    <div className="relative min-h-screen bg-black">
      <div className="absolute inset-0 arcade-grid opacity-30" />
      <div className="absolute inset-0 arcade-grid opacity-30" 
           style={{ animationDelay: '-5s' }} />
      
      <div className="ghost-consciousness min-h-screen overflow-y-auto">
        <div className="flex flex-col items-center justify-center min-h-screen p-4 relative">
          {/* Ghost container with glitch effect */}
          <div className={`my-6 ghost-container ${glitchActive ? 'scale-105 opacity-80' : ''}`}>
            {/* <GhostSprite 
              color="pink" 
              className="w-32 h-32 mx-auto animate-float" 
            /> */}
            <img 
              src="assets/images/pinky-character.png" 
              alt="Pinky, o Fantasma" 
              className="w-32 h-32 mx-auto animate-float pixelated-image" 
            />
          </div>
          
          <div className="w-full max-w-lg relative font-pixel">
            {!showFleeButtonAfterDialogues && !showAchievementCard && (
              <DialogBox 
                text={NEW_DIALOGUES[currentDialogueIndex]}
                onComplete={advanceDialogue}
                className="mb-8"
              />
            )}

            {showFleeButtonAfterDialogues && (
              <div className="text-center mt-4">
                <NeonButton
                  text="Fugir..."
                  onClick={handleFleeAfterDialogues}
                  color="magenta"
                  className="text-lg px-6 py-2.5"
                />
              </div>
            )}
            
            {showAchievementCard && (
              // Achievement Card Display
              <div className="achievement-card bg-black bg-opacity-80 p-5 md:p-6 rounded-lg border-2 border-cyan-400 shadow-[0_0_12px_theme(colors.cyan.500),_0_0_20px_theme(colors.cyan.500)] max-w-md mx-auto text-center my-8">
                <h2 className="text-3xl md:text-4xl text-fuchsia-400 mb-5 tracking-wider">LEVEL UP!</h2>
                
                <h3 className="text-xl md:text-2xl text-cyan-300 mb-3">Germinar da Consciência</h3>
                <p className="text-sm md:text-base text-gray-200 mb-6 px-2 leading-relaxed">
                  Você sentiu pela primeira vez que há algo além do ciclo. Uma nova percepção começou a brotar.
                </p>
                
                {/* Progress Bar */}
                <div className="w-full bg-slate-800 rounded-full h-7 md:h-8 p-1 mb-8 shadow-inner">
                  <div
                    className="bg-green-500 h-full rounded-full flex items-center justify-center text-xs md:text-sm text-white font-bold"
                    style={{ width: '25%' }} // For "1/4"
                  >
                    1/4
                  </div>
                </div>
                
                <NeonButton
                  text="Continuar →"
                  onClick={onContinue}
                  color="magenta"
                  className={`${glitchActive ? 'translate-x-1' : ''} hover:brightness-150 text-lg px-6 py-2.5`}
                />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ConsciousnessScene;