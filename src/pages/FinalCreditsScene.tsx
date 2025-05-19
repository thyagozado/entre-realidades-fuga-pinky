import React, { useEffect } from 'react';
import useAudioManager from '../hooks/useAudioManager';

interface FinalCreditsSceneProps {
  onRestart: () => void;
}

const FinalCreditsScene: React.FC<FinalCreditsSceneProps> = ({ onRestart }) => {
  const { playSound, stopSound } = useAudioManager();

  useEffect(() => {
    playSound({
      filePath: '/assets/sounds/final_credits_music.mp3',
      loop: true,
      fadeInDuration: 2.0,
      volume: 0.8
    });
    return () => {
      stopSound('/assets/sounds/final_credits_music.mp3', 2.0);
    };
  }, [playSound, stopSound]);

  return (
    <div className="w-screen h-screen bg-black flex flex-col items-center justify-center text-white font-pixel p-8">
      {/* Título do Jogo - Tentativa de replicar o estilo da referência */}
      <div className="text-center mb-12">
        <h1 className="text-5xl md:text-7xl text-arcade-cyan tracking-wider leading-tight">
          ENTRE REALIDADES
        </h1>
        <p className="text-3xl md:text-4xl text-arcade-magenta mt-1 md:mt-2 tracking-wide">
          A FUGA DE PINKY
        </p>
      </div>

      {/* Botão Recomeçar */}
      <button 
        onClick={onRestart}
        className="font-pixel bg-gray-700 hover:bg-gray-600 text-white py-3 px-6 rounded text-xl mb-10 border-2 border-gray-500 hover:border-arcade-cyan transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-arcade-pink focus:ring-opacity-50"
      >
        Recomeçar
      </button>

      {/* Criadores */}
      <div className="flex flex-col items-center mt-8">
        <span className="text-lg font-pixel text-white">Criadores</span>
        <span className="text-2xl font-pixel text-white mt-2">Jadson Rodrigues & Thyago Nogueira</span>
        <div className="flex flex-row items-center justify-center mt-2" style={{ gap: '25px' }}>
          <span className="text-base font-mono text-gray-300">@jjjjad.raw</span>
          <span className="text-base font-mono text-gray-300">@thyago.ty</span>
        </div>
      </div>

      {/* Rodapé */}
      <div className="absolute bottom-6 text-center w-full">
        <p className="text-sm md:text-md text-gray-500">DESIGN 2025.1 - PG3</p>
      </div>
    </div>
  );
};

export default FinalCreditsScene; 