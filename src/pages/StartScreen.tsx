import React from 'react';
import ArcadeScreen from '../components/ArcadeScreen';
import GhostSprite from '../components/GhostSprite';
import DialogBox from '../components/DialogBox';
import NeonButton from '../components/NeonButton';

interface StartScreenProps {
  onStart: () => void;
}

const StartScreen: React.FC<StartScreenProps> = ({ onStart }) => {
  const handleStartClick = () => {
    // Directly trigger the scene change without animations
    onStart();
  };

  return (
    <ArcadeScreen>
      <div className="flex flex-col items-center gap-8 p-4">
        <div className="text-center">
          <h1 className="text-3xl md:text-5xl mb-0 font-pixel">
            <span className="text-arcade-blue block">ENTRE REALIDADES</span>
          </h1>
          <h2 className="text-xl md:text-3xl text-arcade-magenta mt-[-0.5em]">
            – A FUGA DO FANTASMA
          </h2>
        </div>
        
        <div className="relative flex flex-col items-center">
          {/* Pacman game visual element at the top */}
          <div className="mb-6 opacity-70">
            <img 
              src="assets/images/arcade-game-visual.png" 
              alt="Arcade Game" 
              className="w-64 h-auto"
              style={{ imageRendering: 'pixelated' }}
            />
          </div>
          
          {/* Ghost sprite */}
          <div className="mb-6 ghost-container">
            <img
              src="assets/images/pinky-character.png"
              alt="Pinky Character"
              className="w-24 h-24 mx-auto"
              style={{ imageRendering: 'pixelated' }}
            />
          </div>
          
          {/* Dialog box with integrated action button */}
          <div className="dialog-box w-full max-w-lg mb-8">
            <DialogBox 
              text="[FANTASMA]: Sempre o mesmo ciclo... Eles correm... Ele os devora..."
              className="mb-4"
              autoAdvance={false}
            />
            
            <div className="text-right">
              <NeonButton 
                text="Iniciar Consciência →" 
                onClick={handleStartClick}
                color="white"
              />
            </div>
          </div>
        </div>
      </div>
    </ArcadeScreen>
  );
};

export default StartScreen;