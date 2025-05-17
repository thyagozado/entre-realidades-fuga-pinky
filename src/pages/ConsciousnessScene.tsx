import React, { useState, useEffect } from 'react';
import ArcadeScreen from '../components/ArcadeScreen';
// import GhostSprite from '../components/GhostSprite'; // Removido
import DialogBox from '../components/DialogBox';
import NeonButton from '../components/NeonButton';

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
  const [showContinueButton, setShowContinueButton] = useState(false);
  const [glitchActive, setGlitchActive] = useState(false);

  useEffect(() => {
    // Trigger glitch effect periodically
    const glitchInterval = setInterval(() => {
      setGlitchActive(true);
      setTimeout(() => setGlitchActive(false), 200);
    }, 3000);

    return () => clearInterval(glitchInterval);
  }, []);

  const advanceDialogue = () => {
    if (currentDialogueIndex < NEW_DIALOGUES.length - 1) {
      setCurrentDialogueIndex(currentDialogueIndex + 1);
      setGlitchActive(true); // Optional: keep glitch on dialogue change
      setTimeout(() => setGlitchActive(false), 200);
    } else {
      setShowContinueButton(true);
    }
  };

  return (
    <div className="relative min-h-screen bg-black">
      <div className="absolute inset-0 arcade-grid opacity-30" />
      <div className="absolute inset-0 arcade-grid opacity-30" 
           style={{ animationDelay: '-5s' }} />
      
      <div className="ghost-consciousness min-h-screen">
        <div className="flex flex-col items-center justify-center min-h-screen p-4 relative">
          {/* Ghost container with glitch effect */}
          <div className={`mb-10 ghost-container ${glitchActive ? 'scale-105 opacity-80' : ''}`}>
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
          
          <div className="w-full max-w-lg relative">
            <DialogBox 
              text={NEW_DIALOGUES[currentDialogueIndex]}
              onComplete={!showContinueButton ? advanceDialogue : undefined}
              className="mb-8"
            />
            
            {showContinueButton && (
              <div className="text-right mt-8" onClick={(e) => e.stopPropagation()}>
                <NeonButton 
                  text="Fugir →"
                  onClick={onContinue}
                  color="magenta"
                  className={`${glitchActive ? 'translate-x-1' : ''} hover:brightness-150`}
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