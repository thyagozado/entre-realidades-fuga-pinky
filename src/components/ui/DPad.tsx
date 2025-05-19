import React, { useEffect } from 'react';

type DPadDirection = 'ArrowUp' | 'ArrowDown' | 'ArrowLeft' | 'ArrowRight';

interface DPadVisibleButtons {
  up?: boolean;
  down?: boolean;
  left?: boolean;
  right?: boolean;
}

interface DPadProps {
  onDirectionClick?: (direction: DPadDirection) => void;
  onDirectionPointerDown?: (direction: DPadDirection) => void;
  onDirectionPointerUp?: (direction: DPadDirection) => void;
  className?: string; 
  visibleButtons?: DPadVisibleButtons;
}

// Estilos CSS para o D-Pad reutilizável
// Estes estilos são baseados nos estilos originais de PacManGame.tsx
const dPadStyles = `
  .d-pad-button-reusable {
    background-color: #333;
    color: white;
    border: 2px solid #555;
    border-radius: 8px;
    width: 50px; /* Tamanho padrão dos botões do PacManGame D-Pad */
    height: 50px;
    display: flex;
    justify-content: center;
    align-items: center;
    font-size: 24px;
    cursor: pointer;
    box-shadow: 0 2px 5px rgba(0,0,0,0.2);
    user-select: none; /* Evitar seleção de texto */
    touch-action: manipulation; /* Melhorar responsividade ao toque */
  }
  .d-pad-button-reusable:hover {
    background-color: #444;
  }
  .d-pad-button-reusable:active {
    background-color: #222;
    transform: translateY(1px);
  }
  .d-pad-reusable-middle { /* Div central para espaçamento, como no PacManGame D-Pad */
    width: 50px; 
    height: 50px;
    flex-shrink: 0; /* Adicionado para garantir que não encolha */
    background-color: transparent;
    border: none;
    box-shadow: none;
  }
`;

const DPad: React.FC<DPadProps> = ({ 
  onDirectionClick, 
  onDirectionPointerDown,
  onDirectionPointerUp,
  className,
  visibleButtons = { up: true, down: true, left: true, right: true }
}) => {
  useEffect(() => {
    const styleTagId = 'dpad-reusable-styles';
    if (!document.getElementById(styleTagId)) {
      const styleElement = document.createElement('style');
      styleElement.id = styleTagId;
      styleElement.textContent = dPadStyles;
      document.head.appendChild(styleElement);
    }
    // Não há cleanup para estilos globais nesta implementação simples.
  }, []);

  const handlePointerDown = (direction: DPadDirection) => {
    if (onDirectionPointerDown) {
      onDirectionPointerDown(direction);
    }
  };

  const handlePointerUp = (direction: DPadDirection) => {
    if (onDirectionPointerUp) {
      onDirectionPointerUp(direction);
    }
  };

  const handleClick = (direction: DPadDirection) => {
    if (onDirectionClick) {
      onDirectionClick(direction);
    }
  };

  // Determina se a linha do meio (esquerda/centro/direita) deve ser renderizada
  const shouldRenderMiddleLine = visibleButtons.left || visibleButtons.right;

  return (
    <div className={`flex flex-col items-center ${className || ''}`}>
      {visibleButtons.up && (
        <button 
          onClick={() => handleClick('ArrowUp')}
          onPointerDown={() => handlePointerDown('ArrowUp')}
          onPointerUp={() => handlePointerUp('ArrowUp')}
          onPointerLeave={() => handlePointerUp('ArrowUp')}
          className="d-pad-button-reusable"
        >
          ▲
        </button>
      )}
      {shouldRenderMiddleLine && (
        <div className={`flex ${visibleButtons.up && (visibleButtons.left || visibleButtons.right || visibleButtons.down) ? 'gap-1' : ''} ${visibleButtons.down && (visibleButtons.left || visibleButtons.right) ? 'gap-1' : ''}`}>
          {visibleButtons.left && (
            <button 
              onClick={() => handleClick('ArrowLeft')}
              onPointerDown={() => handlePointerDown('ArrowLeft')}
              onPointerUp={() => handlePointerUp('ArrowLeft')}
              onPointerLeave={() => handlePointerUp('ArrowLeft')}
              className="d-pad-button-reusable"
            >
              ◄
            </button>
          )}
          {(visibleButtons.left && visibleButtons.right) && ( // Renderiza o meio apenas se ambos os lados estiverem visíveis para manter o espaçamento
            <div className="d-pad-reusable-middle"></div>
          )}
          {visibleButtons.right && (
            <button 
              onClick={() => handleClick('ArrowRight')}
              onPointerDown={() => handlePointerDown('ArrowRight')}
              onPointerUp={() => handlePointerUp('ArrowRight')}
              onPointerLeave={() => handlePointerUp('ArrowRight')}
              className="d-pad-button-reusable"
            >
              ►
            </button>
          )}
        </div>
      )}
      {visibleButtons.down && (
        <button 
          onClick={() => handleClick('ArrowDown')}
          onPointerDown={() => handlePointerDown('ArrowDown')}
          onPointerUp={() => handlePointerUp('ArrowDown')}
          onPointerLeave={() => handlePointerUp('ArrowDown')}
          className="d-pad-button-reusable ${ (visibleButtons.left || visibleButtons.right) && visibleButtons.up ? 'mt-1' : '' }" // Adiciona margem superior se a linha do meio e o botão de cima existirem
        >
          ▼
        </button>
      )}
    </div>
  );
};

export default DPad; 