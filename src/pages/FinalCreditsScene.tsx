import React from 'react';

interface FinalCreditsSceneProps {
  onRestart: () => void;
}

const FinalCreditsScene: React.FC<FinalCreditsSceneProps> = ({ onRestart }) => {
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
      <div className="text-center mb-8">
        <p className="text-lg md:text-xl text-gray-300">Criadores</p>
        <p className="text-xl md:text-2xl text-gray-100 mt-1">Jadson Rodrigues & Thyago Nogueira</p>
      </div>

      {/* Rodapé */}
      <div className="absolute bottom-6 text-center w-full">
        <p className="text-sm md:text-md text-gray-500">DESIGN 2025.1 - PG3</p>
      </div>
    </div>
  );
};

export default FinalCreditsScene; 