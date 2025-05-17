import React, { useState, useEffect, useRef } from 'react';
import NeonButton from '../components/ui/NeonButton'; 

interface SkyRelicsSceneProps {
  onComplete: () => void;
}

const PINKY_INITIAL_X = 450;
const PINKY_Y_POSITION = 690;
const PINKY_MOVE_SPEED = 15;
const SCENE_WIDTH = 5073;
const PINKY_WIDTH = 113;
const TRANSITION_POINT_X = 1500;

// Sprites 16-bit
const SPRITE_FRENTE = '/assets/images/pinky_sprite_frente_16bit.png';
const SPRITE_DIREITA = '/assets/images/pinky_sprite_direita_16bit.png';
const SPRITE_ESQUERDA = '/assets/images/pinky_sprite_esquerda_16bit.png'; // Caminho corrigido

const SkyRelicsScene: React.FC<SkyRelicsSceneProps> = ({ onComplete }) => {
  const [currentDialog, setCurrentDialog] = useState(0);
  const [pinkyX, setPinkyX] = useState(PINKY_INITIAL_X);
  const [pinkySprite, setPinkySprite] = useState(SPRITE_FRENTE);
  const [isMoving, setIsMoving] = useState(false);
  const moveTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const [showDialog, setShowDialog] = useState(true);
  const [transitionTriggered, setTransitionTriggered] = useState(false);
  const [showReturnToWorldModal, setShowReturnToWorldModal] = useState(false);
  const [showRuptureClosedModal, setShowRuptureClosedModal] = useState(false);

  const sceneWrapperRef = useRef<HTMLDivElement>(null);
  const [viewportWidth, setViewportWidth] = useState(0);
  const [backgroundXOffset, setBackgroundXOffset] = useState(0);

  const dialogs = [
    "[Pinky]: Isso... isso é diferente.",
    "[Pinky]: É como se eu pudesse... escolher aonde ir?",
    "[Pinky]: Preciso entender o que está acontecendo...",
  ];

  useEffect(() => {
    const updateViewport = () => {
      if (sceneWrapperRef.current) {
        setViewportWidth(sceneWrapperRef.current.offsetWidth);
      } else {
        // Fallback se ref não estiver pronto, embora deva estar após a primeira renderização
        setViewportWidth(window.innerWidth);
      }
    };
    updateViewport();
    window.addEventListener('resize', updateViewport);
    return () => window.removeEventListener('resize', updateViewport);
  }, []);

  useEffect(() => {
    if (viewportWidth > 0 && SCENE_WIDTH > viewportWidth) {
      // Onde queremos que o centro da Pinky apareça na tela (ex: meio da tela)
      const targetPinkyScreenX = viewportWidth / 2;
      // Posição no "mundo" da imagem que deveria estar na borda esquerda da tela para centralizar Pinky
      const desiredWorldLeftEdgeAtScreenLeft = pinkyX + PINKY_WIDTH / 2 - targetPinkyScreenX;
      // O valor de background-position-x é o negativo disso
      let newBackgroundXOffset = -desiredWorldLeftEdgeAtScreenLeft;

      // Limites para o background-position-x
      const minOffset = -(SCENE_WIDTH - viewportWidth); // Não mostrar além da borda direita da imagem
      const maxOffset = 0; // Não mostrar além da borda esquerda da imagem

      newBackgroundXOffset = Math.max(minOffset, Math.min(newBackgroundXOffset, maxOffset));
      
      setBackgroundXOffset(newBackgroundXOffset);
    } else {
      // Se a cena/imagem for menor que a viewport, centraliza ou alinha à esquerda
      setBackgroundXOffset(0); // Ou (viewportWidth - SCENE_WIDTH) / 2 para centralizar
    }
  }, [pinkyX, viewportWidth, PINKY_WIDTH]);

  useEffect(() => {
    const dialogTimer = setTimeout(() => {
      if (currentDialog < dialogs.length - 1) {
        setCurrentDialog(currentDialog + 1);
      } else if (currentDialog === dialogs.length - 1) {
        setCurrentDialog(currentDialog + 1);
        setTimeout(() => setShowDialog(false), 200);
      }
    }, 3000);

    return () => clearTimeout(dialogTimer);
  }, [currentDialog, dialogs.length]);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (showDialog || currentDialog < dialogs.length || transitionTriggered || showReturnToWorldModal || showRuptureClosedModal) return;

      let newPinkyX = pinkyX;
      let newSprite = pinkySprite;
      const rightBoundary = SCENE_WIDTH - PINKY_WIDTH;

      if (event.key === 'ArrowLeft') {
        newPinkyX = pinkyX - PINKY_MOVE_SPEED;
        if (newPinkyX <= 0) {
          setPinkyX(0);
          setPinkySprite(SPRITE_FRENTE);
          setIsMoving(false);
          if (moveTimeoutRef.current) clearTimeout(moveTimeoutRef.current);
          setShowReturnToWorldModal(true);
          return;
        }
        newSprite = SPRITE_ESQUERDA;
        setIsMoving(true);
      } else if (event.key === 'ArrowRight') {
        const potentialNextX = pinkyX + PINKY_MOVE_SPEED;
        
        if (!transitionTriggered && potentialNextX >= TRANSITION_POINT_X) {
          setPinkyX(Math.min(potentialNextX, rightBoundary));
          setPinkySprite(SPRITE_DIREITA);
          setIsMoving(false); 
          if (moveTimeoutRef.current) clearTimeout(moveTimeoutRef.current);
          console.log("[SkyRelicsScene] ATINGIU PONTO DE TRANSIÇÃO (" + TRANSITION_POINT_X + "px) (KeyDown), chamando onComplete.");
          setTransitionTriggered(true);
          onComplete();
          return; 
        }
        newPinkyX = Math.min(potentialNextX, rightBoundary);
        newSprite = SPRITE_DIREITA;
        setIsMoving(true);
      }

      setPinkyX(newPinkyX);
      setPinkySprite(newSprite);

      if (isMoving) {
        if (moveTimeoutRef.current) clearTimeout(moveTimeoutRef.current);
        moveTimeoutRef.current = setTimeout(() => {
          setIsMoving(false);
          setPinkySprite(SPRITE_FRENTE);
        }, 200);
      }
    };

    const handleKeyUp = (event: KeyboardEvent) => {
        if (showDialog || currentDialog < dialogs.length) return;
        if (event.key === 'ArrowLeft' || event.key === 'ArrowRight') {
            if (moveTimeoutRef.current) clearTimeout(moveTimeoutRef.current);
            moveTimeoutRef.current = setTimeout(() => {
                 setIsMoving(false);
                 setPinkySprite(SPRITE_FRENTE);
            }, 100); 
        }
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
      if (moveTimeoutRef.current) clearTimeout(moveTimeoutRef.current);
    };
  }, [pinkyX, pinkySprite, onComplete, currentDialog, dialogs.length, showDialog, isMoving, transitionTriggered, showReturnToWorldModal, showRuptureClosedModal]);

  const handleDPadClick = (direction: 'left' | 'right') => {
    if (showDialog || currentDialog < dialogs.length || transitionTriggered || showReturnToWorldModal || showRuptureClosedModal) return;
    
    let newPinkyX = pinkyX;
    let newSprite = pinkySprite;
    const rightBoundary = SCENE_WIDTH - PINKY_WIDTH;

    if (direction === 'left') {
      newPinkyX = pinkyX - PINKY_MOVE_SPEED;
      if (newPinkyX <= 0) {
        setPinkyX(0);
        setPinkySprite(SPRITE_FRENTE);
        setIsMoving(false);
        if (moveTimeoutRef.current) clearTimeout(moveTimeoutRef.current);
        setShowReturnToWorldModal(true);
        return;
      }
      newSprite = SPRITE_ESQUERDA;
      setIsMoving(true);
    } else if (direction === 'right') {
      const potentialNextX = pinkyX + PINKY_MOVE_SPEED;

      if (!transitionTriggered && potentialNextX >= TRANSITION_POINT_X) {
        setPinkyX(Math.min(potentialNextX, rightBoundary));
        setPinkySprite(SPRITE_DIREITA);
        setIsMoving(false); 
        if (moveTimeoutRef.current) clearTimeout(moveTimeoutRef.current);
        console.log("[SkyRelicsScene] ATINGIU PONTO DE TRANSIÇÃO (" + TRANSITION_POINT_X + "px) (DPad), chamando onComplete.");
        setTransitionTriggered(true);
        onComplete();
        return;
      }
      newPinkyX = Math.min(potentialNextX, rightBoundary);
      newSprite = SPRITE_DIREITA;
      setIsMoving(true);
    }

    setPinkyX(newPinkyX);
    setPinkySprite(newSprite);

    if (isMoving) {
        if (moveTimeoutRef.current) clearTimeout(moveTimeoutRef.current);
        moveTimeoutRef.current = setTimeout(() => {
            setIsMoving(false);
            setPinkySprite(SPRITE_FRENTE);
        }, 300);
    }
  };

  const ModalReturnToWorld = () => (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
      <div className="bg-indigo-900 bg-opacity-[.98] p-6 md:p-7 rounded-lg shadow-2xl border-2 border-gray-300 max-w-md" style={{ boxShadow: '0 0 8px rgba(255, 255, 255, 0.25)' }}>
        <p className="text-lg md:text-xl font-pixel text-white text-center mb-5">
          Você deseja retornar ao seu mundo?
        </p>
        <div className="flex justify-center space-x-3">
          <button
            onClick={() => setShowReturnToWorldModal(false)}
            className="font-pixel bg-red-600 hover:bg-red-500 text-white py-1.5 px-3 rounded transition-all duration-150 text-sm"
          >
            Não, quero ficar
          </button>
          <button
            onClick={() => {
              setShowReturnToWorldModal(false);
              setShowRuptureClosedModal(true);
            }}
            className="font-pixel bg-green-600 hover:bg-green-500 text-white py-1.5 px-3 rounded transition-all duration-150 text-sm"
          >
            Sim
          </button>
        </div>
      </div>
    </div>
  );

  const ModalRuptureClosed = () => (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
      <div className="bg-indigo-900 bg-opacity-[.98] p-6 md:p-7 rounded-lg shadow-2xl border-2 border-gray-300 max-w-md" style={{ boxShadow: '0 0 8px rgba(255, 255, 255, 0.25)' }}>
        <p className="text-lg md:text-xl font-pixel text-white text-center mb-5">
          Infelizmente o ponto de ruptura se fechou, você deve se manter no mundo atual.
        </p>
        <div className="flex justify-center">
          <button
            onClick={() => setShowRuptureClosedModal(false)}
            className="font-pixel bg-gray-600 hover:bg-gray-500 text-white py-1.5 px-3 rounded transition-all duration-150 text-sm"
          >
            Continuar
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <div 
      ref={sceneWrapperRef}
      className="w-screen h-screen flex flex-col items-center justify-end text-white p-0 relative overflow-hidden"
      style={{
        backgroundImage: "url('/assets/images/cena_bosque.png')",
        backgroundSize: 'cover',
        backgroundPositionX: `${backgroundXOffset}px`,
        backgroundPositionY: 'center',
        backgroundRepeat: 'no-repeat',
        transition: 'background-position-x 0.05s linear',
      }}
    >
      {/* Pinky */}
      <img 
        src={pinkySprite} 
        alt="Pinky"
        className="absolute select-none"
        style={{
          left: `${pinkyX}px`,
          top: `${PINKY_Y_POSITION}px`,
          width: `${PINKY_WIDTH}px`, 
          height: 'auto',
          imageRendering: 'pixelated'
        }}
      />

      {/* Caixa de Diálogo */}
      {showDialog && currentDialog < dialogs.length && (
        <div 
          className="fixed bottom-28 left-1/2 transform -translate-x-1/2 w-full max-w-2xl p-4 bg-slate-800 bg-opacity-90 border-2 border-arcade-cyan rounded-lg shadow-lg z-10" 
          style={{ boxShadow: '0 0 10px rgba(0, 200, 255, 0.6)' }}
        >
          <p className="text-xl font-pixel whitespace-pre-line text-center">
            {dialogs[currentDialog < dialogs.length ? currentDialog : dialogs.length -1]}
          </p>
        </div>
      )}
      
      {/* D-Pads */}
      {!showDialog && currentDialog >= dialogs.length && !(showReturnToWorldModal || showRuptureClosedModal) && (
         <div className="fixed bottom-10 left-1/2 transform -translate-x-1/2 flex space-x-4 z-20">
          <button 
            onClick={() => handleDPadClick('left')}
            className="bg-gray-700 hover:bg-gray-600 text-white font-bold py-4 px-6 rounded-l-lg border-2 border-arcade-cyan shadow-md hover:shadow-lg transition-all duration-150 focus:outline-none focus:ring-2 focus:ring-arcade-pink focus:ring-opacity-50"
            style={{ boxShadow: '0 0 5px #0ff, 0 0 10px #0ff' }}
          >
            &#x2190; 
          </button>
          <button 
            onClick={() => handleDPadClick('right')}
            className="bg-gray-700 hover:bg-gray-600 text-white font-bold py-4 px-6 rounded-r-lg border-2 border-arcade-cyan shadow-md hover:shadow-lg transition-all duration-150 focus:outline-none focus:ring-2 focus:ring-arcade-pink focus:ring-opacity-50"
            style={{ boxShadow: '0 0 5px #0ff, 0 0 10px #0ff' }}
          >
            &#x2192; 
          </button>
      </div>
      )}

      {showReturnToWorldModal && <ModalReturnToWorld />}
      {showRuptureClosedModal && <ModalRuptureClosed />}
    </div>
  );
};

export default SkyRelicsScene; 