import React, { useEffect, useRef, useState, useCallback } from 'react';

interface BosqueSceneProps {
  onNavigateToMap: () => void;
}

const BOSQUE_DIALOGUES = [
  "[PINKY]: Isso... isso <span class='glitch-word-magenta'>é</span> diferente.",
  "[PINKY]: E como se eu pudesse... <span class='glitch-word-green'>escolher</span> aonde ir?",
  "[PINKY]: Preciso <span class='glitch-word-magenta'>entender</span> o que esta acontecendo..."
];

const GROUND_Y_PERCENTAGE = 0.8; // Pinky's base will be at 80% of canvas height
const PINKY_SPEED = 10;
const PINKY_SPRITE_SCALE = 3; // Adjust if sprites are too small/large

// Image paths (relative to public folder)
const PINKY_FRENTE_SRC = 'assets/images/pinky_sprite_frente_16bit.png';
const PINKY_ESQUERDA_SRC = 'assets/images/pinky_sprite_esquerda_16bit.png';
const PINKY_DIREITA_SRC = 'assets/images/pinky_sprite_direita_16bit.png';
// const PINKY_COSTAS_SRC = 'assets/images/pinky_sprite_costas_16bit.png'; // If needed later
const BOSQUE_BG_SRC = 'assets/images/cena_bosque.png';

const BosqueScene: React.FC<BosqueSceneProps> = ({ onNavigateToMap }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [images, setImages] = useState<{ [key: string]: HTMLImageElement }>({});
  
  const [pinkyWorldX, setPinkyWorldX] = useState(450); // Posição inicial alterada de 350 para 450
  const [pinkyCanvasY, setPinkyCanvasY] = useState(0); // Y on canvas, calculated later
  const [currentPinkySpriteKey, setCurrentPinkySpriteKey] = useState('frente');
  
  const [cameraX, setCameraX] = useState(0);
  
  const [currentDialogueIndex, setCurrentDialogueIndex] = useState(0);
  const [showDialog, setShowDialog] = useState(true);

  const dialogueContainerRef = useRef<HTMLDivElement>(null);

  // Estados para os modais de escolha/informação
  type ModalType = 'none' | 'returnChoice' | 'cannotReturnInfo';
  const [activeModal, setActiveModal] = useState<ModalType>('none');

  // Load images
  useEffect(() => {
    const sources: { [key: string]: string } = {
      frente: PINKY_FRENTE_SRC,
      esquerda: PINKY_ESQUERDA_SRC,
      direita: PINKY_DIREITA_SRC,
      // costas: PINKY_COSTAS_SRC,
      bosqueBg: BOSQUE_BG_SRC,
    };
    let loadedCount = 0;
    const numImages = Object.keys(sources).length;
    const loadedImages: { [key: string]: HTMLImageElement } = {};

    Object.entries(sources).forEach(([key, src]) => {
      const img = new Image();
      img.src = src;
      img.onload = () => {
        loadedImages[key] = img;
        loadedCount++;
        if (loadedCount === numImages) {
          setImages(loadedImages);
          setIsLoaded(true);
        }
      };
      img.onerror = () => {
        console.error(`Failed to load image: ${key} at ${src}`);
        loadedCount++; 
         if (loadedCount === numImages) { 
          setImages(loadedImages); 
          setIsLoaded(Object.values(loadedImages).some(img => img.complete && img.naturalHeight !== 0));
        }
      };
    });
  }, []);

  // Setup canvas dimensions and initial Pinky Y
  useEffect(() => {
    if (!isLoaded || !canvasRef.current || !images.bosqueBg) return;
    const canvas = canvasRef.current;
    const bgImage = images.bosqueBg; // Necessário aqui para aspectRatio da imagem, se usado no futuro

    console.log('[BosqueScene Dimensioning] Window Inner W/H:', window.innerWidth, window.innerHeight);
    console.log('[BosqueScene Dimensioning] BG Image W/H:', bgImage.width, bgImage.height);

    const screenWidth = window.innerWidth;
    const screenHeight = window.innerHeight;
    
    // Definir uma proporção alvo para o canvas, por exemplo, 16:9
    const TARGET_CANVAS_ASPECT_RATIO = 16 / 9;

    let calculatedCanvasWidth: number;
    let calculatedCanvasHeight: number;

    // Calcular dimensões do canvas para preencher a tela mantendo TARGET_CANVAS_ASPECT_RATIO
    if (screenWidth / screenHeight > TARGET_CANVAS_ASPECT_RATIO) {
      // Tela é mais larga que o alvo: basear na altura da tela
      calculatedCanvasHeight = screenHeight;
      calculatedCanvasWidth = calculatedCanvasHeight * TARGET_CANVAS_ASPECT_RATIO;
    } else {
      // Tela é mais alta ou igual ao alvo: basear na largura da tela
      calculatedCanvasWidth = screenWidth;
      calculatedCanvasHeight = calculatedCanvasWidth / TARGET_CANVAS_ASPECT_RATIO;
    }
    
    console.log('[BosqueScene Dimensioning] Calculated Canvas W/H (target aspect ratio):', calculatedCanvasWidth, calculatedCanvasHeight);

    canvas.width = Math.round(calculatedCanvasWidth);
    canvas.height = Math.round(calculatedCanvasHeight);
    console.log('[BosqueScene Dimensioning] Final Canvas W/H Set:', canvas.width, canvas.height);
    
    const pinkySprite = images[currentPinkySpriteKey] || images.frente;
    if (pinkySprite && canvas.height > 0) { // Adicionado canvas.height > 0 para evitar divisão por zero se algo der errado
        const groundY = canvas.height * GROUND_Y_PERCENTAGE;
        // Certificar que pinkySprite.height é um número e PINKY_SPRITE_SCALE também
        const pinkyRenderHeight = (pinkySprite.height || 0) * PINKY_SPRITE_SCALE;
        setPinkyCanvasY(groundY - pinkyRenderHeight);
    }

  }, [isLoaded, images, currentPinkySpriteKey]); // Removido bgImage de dependências diretas se não for mais usado para aspect ratio do canvas

  // Game Loop
  useEffect(() => {
    if (!isLoaded || !canvasRef.current || !images.bosqueBg || !images.frente) return;

    const canvas = canvasRef.current;
    const context = canvas.getContext('2d');
    if (!context) return;

    let animationFrameId: number;

    const render = () => {
      context.imageSmoothingEnabled = false; 
      context.clearRect(0, 0, canvas.width, canvas.height);

      const bgImage = images.bosqueBg;
      const canvasHeight = canvas.height;
      const canvasWidth = canvas.width;

      const pinkySpriteToDraw = images[currentPinkySpriteKey] || images.frente;
      const pinkyOriginalWidth = pinkySpriteToDraw.width * PINKY_SPRITE_SCALE;
      const pinkyOriginalHeight = pinkySpriteToDraw.height * PINKY_SPRITE_SCALE;

      const bgScale = canvasHeight / bgImage.height;
      const visibleWorldWidth = canvasWidth / bgScale;
      const visibleWorldHeight = bgImage.height; // ou canvasHeight / bgScale

      let newCameraX = pinkyWorldX - (visibleWorldWidth / 2) + ((pinkyOriginalWidth / bgScale) / 2);

      newCameraX = Math.max(0, newCameraX);
      const maxCameraX = bgImage.width - visibleWorldWidth;
      newCameraX = Math.min(newCameraX, Math.max(0, maxCameraX));

      context.drawImage(
        bgImage,          
        newCameraX,       
        0,                
        visibleWorldWidth,
        visibleWorldHeight,
        0,                
        0,                
        canvasWidth,      
        canvasHeight      
      );

      const pinkyCanvasDrawX = (pinkyWorldX - newCameraX) * bgScale;

      context.drawImage(
        pinkySpriteToDraw,
        pinkyCanvasDrawX,
        pinkyCanvasY,
        pinkyOriginalWidth,
        pinkyOriginalHeight
      );

      animationFrameId = requestAnimationFrame(render);
    };
    render();
    return () => cancelAnimationFrame(animationFrameId);
  }, [isLoaded, images, pinkyWorldX, pinkyCanvasY, currentPinkySpriteKey]);

  // Handle Keyboard Input
  useEffect(() => {
    if (!isLoaded || showDialog || activeModal !== 'none') return; // Adicionado activeModal !== 'none' para desabilitar input

        const handleKeyDown = (e: KeyboardEvent) => {
            let newPinkyWorldX = pinkyWorldX;
            let newSpriteKey = currentPinkySpriteKey;

            if (e.key === 'ArrowLeft') {
                newPinkyWorldX -= PINKY_SPEED;
                newSpriteKey = 'esquerda';
            } else if (e.key === 'ArrowRight') {
                newPinkyWorldX += PINKY_SPEED;
                newSpriteKey = 'direita';
            }
            
            const bgImageWidth = images.bosqueBg?.width || 0;
            const pinkySpriteForBoundary = images[newSpriteKey] || images.frente;
            // Ensure pinkySpriteForBoundary is valid before accessing width
            const pinkyDrawWidthForBoundary = pinkySpriteForBoundary?.width ? pinkySpriteForBoundary.width * PINKY_SPRITE_SCALE : PINKY_SPEED;

            // Left boundary
            if (newPinkyWorldX < PINKY_SPEED) { // Usar PINKY_SPEED como uma pequena margem para ativar o modal antes de bater 0
                newPinkyWorldX = 0; // Para Pinky na borda
                setActiveModal('returnChoice');
                // Não definir pinkyWorldX aqui ainda, para que ele não se mova para 0 imediatamente se o modal for fechado
                // Apenas previne movimento adicional para a esquerda
                return; // Impede que o resto do código de movimento seja executado
            }
            
            // Right boundary logic
            if (bgImageWidth > 0) {
                // Define a point slightly before the absolute edge for triggering navigation
                const navigationTriggerX = bgImageWidth - pinkyDrawWidthForBoundary - 10; // e.g., 10px before Pinky's right edge hits the background's right edge

                if (newPinkyWorldX >= navigationTriggerX) {
                    console.log("Reached right boundary zone - navigating to map");
                    onNavigateToMap();
                    return; // Exit early as navigation is triggered
                }
                // Hard stop if Pinky tries to move beyond the background width
                if (newPinkyWorldX + pinkyDrawWidthForBoundary > bgImageWidth) {
                    newPinkyWorldX = bgImageWidth - pinkyDrawWidthForBoundary;
                }
            }

            setPinkyWorldX(newPinkyWorldX);
            if (newSpriteKey !== currentPinkySpriteKey && (e.key === 'ArrowLeft' || e.key === 'ArrowRight')) {
              setCurrentPinkySpriteKey(newSpriteKey);
            }
        };

        const handleKeyUp = (e: KeyboardEvent) => {
            if (e.key === 'ArrowLeft' || e.key === 'ArrowRight') {
                setCurrentPinkySpriteKey('frente'); 
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        window.addEventListener('keyup', handleKeyUp);
        return () => {
            window.removeEventListener('keydown', handleKeyDown);
            window.removeEventListener('keyup', handleKeyUp);
        };
  }, [isLoaded, pinkyWorldX, currentPinkySpriteKey, images, onNavigateToMap, showDialog, activeModal]); // Adicionado activeModal como dependência


  const advanceDialogue = useCallback(() => {
    if (currentDialogueIndex < BOSQUE_DIALOGUES.length - 1) {
      setCurrentDialogueIndex(prev => prev + 1);
    } else {
      setShowDialog(false);
      if(canvasRef.current) canvasRef.current.focus();
    }
  }, [currentDialogueIndex]);

  // Funções para manipular os modais
  const handleReturnChoice = (choice: 'yes' | 'no') => {
    if (choice === 'no') {
      setActiveModal('none');
    } else {
      setActiveModal('cannotReturnInfo');
    }
  };

  const handleCannotReturnInfoContinue = () => {
    setActiveModal('none');
  };

  if (!isLoaded) {
    return <div className="scene-container bg-black flex items-center justify-center min-h-screen text-white pixelated-font">Carregando Bosque...</div>;
  }

  return (
    <div className="scene-container bg-black flex flex-col items-center justify-center min-h-screen relative">
      <canvas 
        ref={canvasRef} 
        id="bosque-canvas" 
        className="border-2 border-gray-700 shadow-2xl shadow-black"
      ></canvas>
      
      {/* Caixa de Diálogo Principal */}
      {showDialog && (
        <div
          ref={dialogueContainerRef} 
          className="dialog-box-bosque bg-gray-900 bg-opacity-90 text-white p-4 sm:p-6 rounded-lg border-2 border-gray-600 max-w-3xl w-[90%] pixelated-font text-lg sm:text-xl shadow-lg absolute bottom-[15%] left-1/2 -translate-x-1/2 cursor-pointer z-10" 
          onClick={advanceDialogue} 
        >
          <div dangerouslySetInnerHTML={{ __html: BOSQUE_DIALOGUES[currentDialogueIndex] }} />
          {currentDialogueIndex < BOSQUE_DIALOGUES.length -1 && (
            <div className="absolute bottom-2 right-3 sm:bottom-3 sm:right-4 text-xl animate-pulse">▼</div>
          )}
        </div>
      )}

      {/* Modal: Você deseja retornar a sua realidade? */}
      {activeModal === 'returnChoice' && (
        <div className="modal-overlay fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-20">
          <div className="modal-content bg-gray-800 p-6 rounded-lg shadow-xl max-w-md w-[90%] pixelated-font text-white border-2 border-gray-600">
            <p className="text-xl mb-6 text-center">Você deseja retornar à sua realidade?</p>
            <div className="flex justify-around mt-4">
              <button 
                onClick={() => handleReturnChoice('yes')} 
                className="px-6 py-2 bg-arcade-red hover:bg-arcade-red-dark text-white font-semibold rounded-md shadow-md transition-colors duration-150"
              >
                Sim
              </button>
              <button 
                onClick={() => handleReturnChoice('no')} 
                className="px-6 py-2 bg-arcade-blue hover:bg-arcade-blue-dark text-white font-semibold rounded-md shadow-md transition-colors duration-150"
              >
                Não, quero ficar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal: Infelizmente você não tem mais acesso... */}
      {activeModal === 'cannotReturnInfo' && (
        <div className="modal-overlay fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-20">
          <div className="modal-content bg-gray-800 p-8 rounded-lg shadow-xl max-w-lg w-[90%] pixelated-font text-white border-2 border-gray-600 text-center">
            <p className="text-xl mb-6">Infelizmente você não tem mais acesso ao ponto de ruptura.</p>
            <button 
              onClick={handleCannotReturnInfoContinue} 
              className="mt-4 px-8 py-3 bg-arcade-green hover:bg-arcade-green-dark text-white font-bold rounded-lg shadow-lg transition-colors duration-150 text-lg"
            >
              Continuar
            </button>
          </div>
        </div>
      )}

    </div>
  );
};

export default BosqueScene;