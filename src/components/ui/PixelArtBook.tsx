import React from 'react';

interface PixelArtBookProps {
  onClick: () => void;
  title: string;
  style?: React.CSSProperties; // Para posicionamento absoluto na estante
  color?: 'red' | 'blue' | 'green' | 'purple' | 'brown'; // Cores da capa
}

const PixelArtBook: React.FC<PixelArtBookProps> = ({
  onClick,
  title,
  style,
  color = 'brown' // Cor padrão
}) => {

  const colorClasses = {
    red: { bg: 'bg-red-700', spine: 'bg-red-900', border: 'border-red-900' },
    blue: { bg: 'bg-blue-700', spine: 'bg-blue-900', border: 'border-blue-900' },
    green: { bg: 'bg-green-700', spine: 'bg-green-900', border: 'border-green-900' },
    purple: { bg: 'bg-purple-700', spine: 'bg-purple-900', border: 'border-purple-900' },
    brown: { bg: 'bg-yellow-700', spine: 'bg-yellow-900', border: 'border-yellow-900' }, // Usando yellow para um tom de marrom
  };

  const selectedColor = colorClasses[color] || colorClasses.brown;

  return (
    <button
      onClick={onClick}
      title={title}
      style={style} // Aplicar estilos de posicionamento aqui
      className={`absolute w-8 h-10 font-pixel cursor-pointer transform transition-transform hover:scale-110 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-400 ${selectedColor.border}`}
    >
      {/* Capa do Livro */}
      <div className={`w-full h-full ${selectedColor.bg} border-2 ${selectedColor.border} shadow-sm`}>
        {/* Lombada do Livro */}
        <div className={`absolute top-0 left-0 w-2 h-full ${selectedColor.spine} border-r-2 ${selectedColor.border}`}></div>
        {/* Detalhe sutil na capa (opcional) */}
        {/* <div className="absolute top-1 right-1 w-1 h-1 bg-yellow-300 opacity-75"></div> */}
      </div>
      {/* <span className="mt-1 text-xs text-white truncate group-hover:text-yellow-300">{title}</span> */}
    </button>
  );
};

export default PixelArtBook; 