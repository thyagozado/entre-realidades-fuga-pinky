import React, { useState, useEffect, useRef } from 'react';
import NeonButton from '../components/ui/NeonButton'; 
import DPad from '../components/ui/DPad';
import useAudioManager from '../hooks/useAudioManager';

interface SkyRelicsSceneProps {
  onComplete: () => void;
}

const PINKY_INITIAL_X = 350;
const PINKY_MOVE_SPEED = 15;
const SCENE_WIDTH = 5073;
const PINKY_WIDTH = 113;
const PINKY_SPRITE_HEIGHT = 113;
const TRANSITION_POINT_X = 1500;
const DESIRED_PINKY_BOTTOM_MARGIN = 230;

// Camera smoothing factor
const CAMERA_SMOOTHING_FACTOR = 0.05;
const DPAD_MOVE_INTERVAL = 30; // ms, para controle de velocidade do D-Pad (mais rápido que teclado talvez)

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
  const [viewportHeight, setViewportHeight] = useState(0);
  
  // Estado para a câmera suave
  const [currentBackgroundXOffset, setCurrentBackgroundXOffset] = useState(0);
  const targetBackgroundXOffsetRef = useRef(0); // Alvo calculado para o offset da câmera
  const [initialOffsetApplied, setInitialOffsetApplied] = useState(false); // Novo estado

  const keysPressedRef = useRef(new Set<string>());
  const dpadActiveDirectionRef = useRef<'ArrowLeft' | 'ArrowRight' | null>(null); // Para o D-Pad
  const animationFrameIdRef = useRef<number | null>(null);
  const lastDpadMoveTimeRef = useRef<number>(0); // Para controlar a velocidade do D-Pad
  const { playSound, stopSound } = useAudioManager();

  const dialogs = [
    "[Pinky]: Isso... isso é diferente.",
    "[Pinky]: É como se eu pudesse... escolher aonde ir?",
    "[Pinky]: Preciso entender o que está acontecendo...",
  ];

  useEffect(() => {
    // Adicionado: Tocar música da cena do bosque
    playSound({
      filePath: '/assets/sounds/bosque_music.mp3',
      loop: true,
      fadeInDuration: 1.5,
      volume: 0.5
    });

    const updateViewport = () => {
      if (sceneWrapperRef.current) {
        setViewportWidth(sceneWrapperRef.current.offsetWidth);
        setViewportHeight(sceneWrapperRef.current.offsetHeight);
      } else {
        setViewportWidth(window.innerWidth);
        setViewportHeight(window.innerHeight);
      }
    };
    updateViewport();
    window.addEventListener('resize', updateViewport);
    return () => {
      window.removeEventListener('resize', updateViewport);
      // Adicionado: Parar música da cena do bosque
      stopSound('/assets/sounds/bosque_music.mp3', 1.0);
    };
  }, [playSound, stopSound]);

  useEffect(() => {
    let newTargetOffsetValue = 0;
    if (viewportWidth > 0 && SCENE_WIDTH > viewportWidth) {
      const targetPinkyScreenX = viewportWidth / 2;
      const pinkyCenterXInWorld = pinkyX + PINKY_WIDTH / 2;
      const desiredWorldLeftEdgeAtScreenLeft = pinkyCenterXInWorld - targetPinkyScreenX;
      newTargetOffsetValue = -desiredWorldLeftEdgeAtScreenLeft;

      const minOffset = -(SCENE_WIDTH - viewportWidth);
      const maxOffset = 0;
      newTargetOffsetValue = Math.max(minOffset, Math.min(newTargetOffsetValue, maxOffset));
    }
    
    targetBackgroundXOffsetRef.current = newTargetOffsetValue;

    if (viewportWidth > 0 && !initialOffsetApplied) {
      setCurrentBackgroundXOffset(newTargetOffsetValue);
      setInitialOffsetApplied(true);
    }
  }, [pinkyX, viewportWidth, viewportHeight, initialOffsetApplied]);

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
      if (event.key === 'ArrowLeft' || event.key === 'ArrowRight') {
        keysPressedRef.current.add(event.key);
      }
    };

    const handleKeyUp = (event: KeyboardEvent) => {
      if (showDialog || currentDialog < dialogs.length || transitionTriggered || showReturnToWorldModal || showRuptureClosedModal) return;
      if (event.key === 'ArrowLeft' || event.key === 'ArrowRight') {
        keysPressedRef.current.delete(event.key);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);

    // Loop de Animação para Movimento Contínuo
    const gameLoop = () => {
      if (transitionTriggered || showReturnToWorldModal || showRuptureClosedModal || showDialog || currentDialog < dialogs.length) {
        // Se qualquer modal ou diálogo estiver ativo, ou transição iniciada, para o movimento
        if (isMoving) {
          setIsMoving(false);
          setPinkySprite(SPRITE_FRENTE);
        }
        keysPressedRef.current.clear();
        dpadActiveDirectionRef.current = null;
        animationFrameIdRef.current = requestAnimationFrame(gameLoop);
        return;
      }

      let pressedDirKey: string | null = null; // Teclado
      if (keysPressedRef.current.has('ArrowLeft')) {
        pressedDirKey = 'ArrowLeft';
      } else if (keysPressedRef.current.has('ArrowRight')) {
        pressedDirKey = 'ArrowRight';
      }

      // Prioriza D-Pad se estiver ativo
      let activeMoveDirection = dpadActiveDirectionRef.current || pressedDirKey;

      let newPinkyX = pinkyX;
      let newSprite = pinkySprite;
      let movementOccurred = false;
      const rightBoundary = SCENE_WIDTH - PINKY_WIDTH;

      if (activeMoveDirection) {
        if (moveTimeoutRef.current) clearTimeout(moveTimeoutRef.current);
        setIsMoving(true);

        let moveSpeed = PINKY_MOVE_SPEED;
        // Controlar a velocidade para o D-Pad aqui, se estiver usando dpadActiveDirectionRef
        if (dpadActiveDirectionRef.current && performance.now() - lastDpadMoveTimeRef.current < DPAD_MOVE_INTERVAL) {
          // Se o D-Pad está ativo mas o intervalo não passou, não move e agenda próximo frame
          animationFrameIdRef.current = requestAnimationFrame(gameLoop);
          return;
        }

        if (activeMoveDirection === 'ArrowLeft') {
          newPinkyX = pinkyX - moveSpeed;
          if (newPinkyX <= 0) {
            newPinkyX = 0; // Para na borda
            // Lógica do modal da borda esquerda
            if (!showReturnToWorldModal && !showRuptureClosedModal) {
              setShowReturnToWorldModal(true);
              keysPressedRef.current.clear(); // Impede movimento ao abrir modal
              dpadActiveDirectionRef.current = null;
              activeMoveDirection = null; // Interrompe movimento neste frame
            }
          }
          newSprite = SPRITE_ESQUERDA;
          movementOccurred = true;
        } else if (activeMoveDirection === 'ArrowRight') {
          const potentialNextX = pinkyX + moveSpeed;
          if (!transitionTriggered && potentialNextX >= TRANSITION_POINT_X) {
            newPinkyX = Math.min(potentialNextX, rightBoundary);
            newSprite = SPRITE_DIREITA;
            setIsMoving(false);
            setTransitionTriggered(true);
            onComplete();
            animationFrameIdRef.current = requestAnimationFrame(gameLoop);
            return; // Importante sair do loop aqui após disparar onComplete
          }
          newPinkyX = Math.min(potentialNextX, rightBoundary);
          newSprite = SPRITE_DIREITA;
          movementOccurred = true;
        }

        if (movementOccurred) {
            setPinkyX(newPinkyX);
            setPinkySprite(newSprite);
            if (dpadActiveDirectionRef.current) { // Atualiza o tempo do último movimento do D-Pad
                lastDpadMoveTimeRef.current = performance.now();
            }
        }

      } else if (isMoving) {
        // Nenhuma tecla/dpad pressionada, mas estava se movendo -> agendar parada
        if (moveTimeoutRef.current) clearTimeout(moveTimeoutRef.current);
        moveTimeoutRef.current = setTimeout(() => {
          setIsMoving(false);
          setPinkySprite(SPRITE_FRENTE);
        }, 100); // Delay para parar
      }

      // Atualização Suave da Câmera
      if (initialOffsetApplied) { // Só suaviza se o offset inicial já foi aplicado
        if (Math.abs(currentBackgroundXOffset - targetBackgroundXOffsetRef.current) > 0.5) { // 0.5 para evitar micro-movimentos
          setCurrentBackgroundXOffset(prevOffset => 
            prevOffset + (targetBackgroundXOffsetRef.current - prevOffset) * CAMERA_SMOOTHING_FACTOR
          );
        } else if (currentBackgroundXOffset !== targetBackgroundXOffsetRef.current) {
          // Snap para o valor final se estiver perto o suficiente
          setCurrentBackgroundXOffset(targetBackgroundXOffsetRef.current);
        }
      }

      animationFrameIdRef.current = requestAnimationFrame(gameLoop);
    };

    animationFrameIdRef.current = requestAnimationFrame(gameLoop);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
      if (moveTimeoutRef.current) clearTimeout(moveTimeoutRef.current);
      if (animationFrameIdRef.current) cancelAnimationFrame(animationFrameIdRef.current);
    };
  }, [pinkyX, pinkySprite, onComplete, currentDialog, dialogs.length, showDialog, isMoving, transitionTriggered, showReturnToWorldModal, showRuptureClosedModal, viewportWidth, viewportHeight, currentBackgroundXOffset, initialOffsetApplied]);

  const handleDPadPointerDown = (direction: 'ArrowLeft' | 'ArrowRight') => {
    if (showDialog || currentDialog < dialogs.length || transitionTriggered || showReturnToWorldModal || showRuptureClosedModal) return;
    dpadActiveDirectionRef.current = direction;
    lastDpadMoveTimeRef.current = performance.now() - DPAD_MOVE_INTERVAL; // Permite movimento imediato no primeiro toque
    if (moveTimeoutRef.current) clearTimeout(moveTimeoutRef.current);
    setIsMoving(true); // Define isMoving imediatamente para resposta visual
  };

  const handleDPadPointerUp = () => { // A direção específica não é crucial aqui, apenas que foi solto
    dpadActiveDirectionRef.current = null;
    // A lógica de parar (sprite e isMoving) será tratada pelo loop de animação (gameLoop)
    // quando nenhuma tecla/dpad estiver pressionada.
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
        backgroundPositionX: `${currentBackgroundXOffset}px`,
        backgroundPositionY: 'center',
        backgroundRepeat: 'no-repeat',
        paddingBottom: '100px',
      }}
    >
      {/* Pinky */}
      <img 
        src={pinkySprite} 
        alt="Pinky"
        className="absolute select-none"
        style={{
          left: `${pinkyX}px`,
          top: `${viewportHeight - PINKY_SPRITE_HEIGHT - DESIRED_PINKY_BOTTOM_MARGIN}px`,
          width: `${PINKY_WIDTH}px`, 
          height: `${PINKY_SPRITE_HEIGHT}px`,
          imageRendering: 'pixelated'
        }}
      />

      {/* Caixa de Diálogo */}
      {showDialog && currentDialog < dialogs.length && (
        <div 
          className="fixed bottom-16 md:bottom-20 left-1/2 transform -translate-x-1/2 w-full max-w-sm sm:max-w-md md:max-w-lg lg:max-w-xl p-3 sm:p-4 bg-slate-800 bg-opacity-90 border-2 border-arcade-cyan rounded-lg shadow-lg z-10"
          style={{ boxShadow: '0 0 10px rgba(0, 200, 255, 0.6)' }}
        >
          <p className="text-base sm:text-lg md:text-xl font-pixel whitespace-pre-line text-center">
            {dialogs[currentDialog < dialogs.length ? currentDialog : dialogs.length -1]}
          </p>
        </div>
      )}
      
      {/* D-Pads E TEXTO INSTRUTIVO */}
      {!showDialog && currentDialog >= dialogs.length && !(showReturnToWorldModal || showRuptureClosedModal) && (
         <div 
            className="fixed bottom-6 left-1/2 transform -translate-x-1/2 flex flex-col items-center space-y-2 z-20 select-none"
            style={{ touchAction: 'manipulation' }}
          >
            <DPad 
                onDirectionPointerDown={handleDPadPointerDown} 
                onDirectionPointerUp={handleDPadPointerUp}
                className="select-none"
                visibleButtons={{ left: true, right: true, up: false, down: false }}
            />
            <p className="text-xs font-pixel text-center text-gray-300 bg-black bg-opacity-50 px-2 py-1 rounded">
              Use as setas do teclado ou os botões para mover Pinky
            </p>
          </div>
      )}

      {showReturnToWorldModal && <ModalReturnToWorld />}
      {showRuptureClosedModal && <ModalRuptureClosed />}
    </div>
  );
};

export default SkyRelicsScene; 