import React, { useState, useEffect } from 'react';
import ArcadeScreen from '../components/ArcadeScreen';
// import GhostSprite from '../components/GhostSprite'; // Preservado como comentado se você decidir usá-lo mais tarde
import DialogBox from '../components/DialogBox';
import NeonButton from '../components/NeonButton';
import useAudioManager from '../hooks/useAudioManager';

interface StartScreenProps {
  onStart: () => void;
}

const StartScreen: React.FC<StartScreenProps> = ({ onStart }) => {
  const [displayedText, setDisplayedText] = useState('');
  const [isButtonVisible, setIsButtonVisible] = useState(false);
  const fullText = "[Pinky]: Sempre o mesmo ciclo... Eles correm... Ele os devora...";
  const { playSound, stopSound } = useAudioManager();

  useEffect(() => {
    // Iniciar a música da tela inicial
    playSound({ filePath: '/assets/sounds/start_screen_music.mp3', loop: true, fadeInDuration: 1, volume: 0.5 });

    // Função de limpeza para parar a música ao desmontar o componente
    return () => {
      stopSound('/assets/sounds/start_screen_music.mp3', 1);
    };
  }, [playSound, stopSound]);

  useEffect(() => {
    if (displayedText.length < fullText.length) {
      const timeoutId = setTimeout(() => {
        setDisplayedText(fullText.substring(0, displayedText.length + 1));
      }, 50);
      return () => clearTimeout(timeoutId);
    } else {
      const buttonTimeoutId = setTimeout(() => {
        setIsButtonVisible(true);
      }, 500);
      return () => clearTimeout(buttonTimeoutId);
    }
  }, [displayedText, fullText]);

  const handleStartClick = () => {
    onStart();
  };

  return (
    <ArcadeScreen>
      {/* Main flex container for StartScreen content
          - Removed flex-1. The height will be determined by its content.
          - ArcadeScreen's child container has overflow-y-auto and flex-grow,
            so it should handle scrolling if StartScreen's content is too tall.
      */}
      <div className="flex flex-col items-center gap-4 p-4 md:p-8 w-full">
        {/* Content section that grows to push footer down
            Kept min-h-0 to potentially help with flex item shrinking issues.
        */}
        <div className="flex flex-col items-center gap-6 flex-grow w-full min-h-0">
          {/* Reduced top margin from mt-12 md:mt-16 to mt-8 md:mt-10 
               Reduced title font sizes slightly 
          */}
          <div className="text-center mt-8 md:mt-10">
            <h1 className="font-pixel">
              <span className="block text-2xl md:text-4xl text-white">ENTRE</span>
              <span className="block text-2xl md:text-4xl text-white">REALIDADES</span>
              <span className="block text-lg md:text-2xl text-arcade-magenta mt-1">
                A FUGA DE PINKY
              </span>
            </h1>
          </div>
          
          {/* Reduced mb-6 to mb-4 for image and sprite for tighter spacing */}
          <div className="relative flex flex-col items-center">
            {/* Pacman game visual element at the top */}
            <div className="mb-4 opacity-70">
              <img 
                src="assets/images/arcade-game-visual.png" 
                alt="Arcade Game" 
                className="w-64 h-auto"
                style={{ imageRendering: 'pixelated' }}
              />
            </div>
            
            {/* Ghost sprite */}
            <div className="mb-4 ghost-container">
              <img
                src="assets/images/pinky-character.png"
                alt="Pinky Character"
                className="w-24 h-24 mx-auto animate-float"
                style={{ imageRendering: 'pixelated' }}
              />
            </div>
            
            {/* Dialog box with integrated action button 
                Added mb-8 to ensure spacing before the footer, potentially helping with button clickability.
            */}
            <div className="dialog-box w-full max-w-lg mb-8">
              <DialogBox 
                text={displayedText}
                className="mb-4"
                autoAdvance={false}
              />
              
              {isButtonVisible && (
                <div className="text-right">
                  <NeonButton 
                    text="Iniciar Consciência →" 
                    onClick={handleStartClick}
                    color="white"
                    className="animate-shake-right hover:text-purple-300 hover:border-purple-400 hover:shadow-[0_0_15px_3px_rgba(192,132,252,0.6)] focus:shadow-[0_0_15px_3px_rgba(192,132,252,0.6)]"
                  />
                </div>
              )}
            </div>
          </div>
        </div>
        {/* Footer section */}
        <div className="w-full text-center pb-4 pt-4"> {/* Added pt-4 for some space from content above */}
          <p className="text-sm text-gray-400 font-pixel">
            DESIGN 2025.1 - PG3
          </p>
        </div>
      </div>
    </ArcadeScreen>
  );
};

export default StartScreen;