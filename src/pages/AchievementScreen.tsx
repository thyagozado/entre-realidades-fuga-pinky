import React, { useState, useEffect } from 'react';
import NeonButton from '../components/NeonButton';
// Importaremos outros componentes e assets conforme necessário

interface AchievementScreenProps {
  onContinue: () => void;
  achievementTitle: string;
  achievementDescription: string;
  progressNumerator: number;
  progressDenominator: number;
}

const AchievementScreen: React.FC<AchievementScreenProps> = ({
  onContinue,
  achievementTitle,
  achievementDescription,
  progressNumerator,
  progressDenominator
}) => {
  const [showContinueButton, setShowContinueButton] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowContinueButton(true);
    }, 5000); // Botão aparece após 5 segundos

    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-black text-arcade-white p-4 arcade-scanline">
      {/* LEVEL UP! Text */}
      <div className="text-5xl font-pixel mb-8 text-arcade-magenta animate-zoom-in-soft animate-pulse-glow animate-float-gentle">
        LEVEL UP!
      </div>

      {/* Pinky Sprite */}
      <img src="assets/images/pinky-character.png" alt="Pinky" className="w-32 h-32 mb-8" style={{ imageRendering: 'pixelated' }} />

      {/* Achievement Info Container (simulando uma dialog box) */}
      <div className="bg-arcade-black border-2 border-arcade-blue p-6 rounded-lg shadow-lg max-w-md w-full mb-8 dialog-box-achievement">
        <h2 className="text-3xl font-pixel text-center text-arcade-blue mb-4">{achievementTitle}</h2>
        <p className="text-center text-sm mb-6">{achievementDescription}</p>

        {/* Progress Bar */}
        <div className="w-full bg-gray-700 rounded-full h-6 border-2 border-transparent animate-rainbow-border mb-4">
          <div 
            className="bg-arcade-green h-full rounded-full text-xs flex items-center justify-center"
            style={{ width: `${(progressNumerator / progressDenominator) * 100}%` }}
          >
            {progressNumerator}/{progressDenominator}
          </div>
        </div>
      </div>

      {/* Continue Button */}
      {showContinueButton && (
        <NeonButton
          text="Continuar →"
          onClick={onContinue}
          color="white"
        />
      )}
    </div>
  );
};

export default AchievementScreen; 