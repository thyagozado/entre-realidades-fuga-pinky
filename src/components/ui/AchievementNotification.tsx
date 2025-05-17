import React from 'react';

interface AchievementNotificationProps {
  isOpen: boolean;
  onClose: () => void;
  achievementTitle: string;
  description: string;
  progressCurrent: number;
  progressMax: number;
  pinkySpriteUrl: string;
}

const AchievementNotification: React.FC<AchievementNotificationProps> = ({
  isOpen,
  onClose,
  achievementTitle,
  description,
  progressCurrent,
  progressMax,
  pinkySpriteUrl,
}) => {
  if (!isOpen) {
    return null;
  }

  const progressPercentage = (progressCurrent / progressMax) * 100;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-90 flex flex-col items-center justify-center z-[100] font-pixel p-4">
      {/* LEVEL UP! Text */}
      <p 
        className="text-6xl sm:text-7xl text-pink-500 mb-4 sm:mb-6"
      >
        LEVEL UP!
      </p>

      {/* Pinky Sprite */}
      <img 
        src={pinkySpriteUrl} 
        alt="Pinky" 
        className="w-20 h-20 sm:w-24 sm:h-24 mb-6 sm:mb-8 object-contain" 
      />

      {/* Main Achievement Box */}
      <div 
        className="bg-black border-2 border-cyan-400 rounded-lg p-5 sm:p-6 shadow-[0_0_15px_rgba(0,255,255,0.5),_0_0_25px_rgba(0,255,255,0.3)] w-full max-w-md sm:max-w-lg text-center"
      >
        {/* Achievement Title */}
        <h2 
          className="text-3xl sm:text-4xl text-cyan-300 mb-3 sm:mb-4"
        >
          {achievementTitle}
        </h2>

        {/* Description */}
        <p className="text-white text-sm sm:text-base mb-4 sm:mb-5 leading-relaxed">
          {description}
        </p>
        
        {/* Progress Bar Container */}
        <div className="w-full bg-gray-800 rounded-full h-7 sm:h-8 mb-1 relative overflow-hidden border border-cyan-700 shadow-inner">
          {/* Progress Fill */}
          <div 
            className="absolute top-0 left-0 h-full bg-green-500 rounded-full flex items-center justify-center"
            style={{ 
              width: `${progressPercentage}%`, 
              boxShadow: '0 0 8px #32CD32, 0 0 12px #32CD32, inset 0 0 4px #adff2f',
              transition: 'width 0.5s ease-in-out'
            }}
          />
          {/* Progress Text */}
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-sm sm:text-base text-white font-bold" style={{ textShadow: '1px 1px 2px rgba(0,0,0,0.7)'}}>
              {progressCurrent}/{progressMax}
            </span>
          </div>
        </div>
      </div>

      {/* Continue Button */}
      <button
        onClick={onClose}
        className="mt-8 sm:mt-10 bg-transparent border-2 border-white text-white py-2.5 px-8 sm:py-3 sm:px-10 rounded text-lg sm:text-xl hover:bg-white hover:text-black focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:ring-opacity-75 transition-all duration-300 ease-in-out"
        style={{ letterSpacing: '0.05em' }}
      >
        Continuar →
      </button>
    </div>
  );
};

export default AchievementNotification; 