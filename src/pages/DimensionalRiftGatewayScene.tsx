import React, { useState, useEffect, useRef } from 'react';
import Modal from '../components/ui/Modal'; // Importe o novo Modal
import ReturnToMapButton from '../components/ui/ReturnToMapButton'; // Importar o novo botão
import useAudioManager from '../hooks/useAudioManager'; // Adicionado

// --- BEGIN COPIED AND ADAPTED FROM DimensionalRiftScene ---

// Constantes de Configuração Sutis para Gateway
const GATEWAY_CLEAR_ALPHA = 0.1; // Um pouco menos rastro que o rift original

// Partículas Sutis
const GATEWAY_PARTICLE_COUNT = 80; 
const GATEWAY_PARTICLE_SPEED_MULTIPLIER = 1.5; 
const GATEWAY_PARTICLE_SIZE = 1.8;

// Grade de Losangos Dinâmicos Sutis
const GATEWAY_GRID_RADIAL_LINES = 10;
const GATEWAY_GRID_MAX_CONCENTRIC_RECTS = 8;
const GATEWAY_GRID_RECT_SPAWN_INTERVAL = 12;
const GATEWAY_GRID_SPEED = 1.0; 
const GATEWAY_GRID_INITIAL_RECT_SIZE = 20;
const GATEWAY_GRID_LINE_HUE_SPEED = 0.2;
const GATEWAY_GRID_ROTATION_SPEED = 0.003; 
const GATEWAY_GRID_SCALE_PULSE_AMOUNT = 0.08; 
const GATEWAY_GRID_SCALE_PULSE_SPEED = 0.03;
const GATEWAY_RADIAL_LINE_OSCILLATION_AMOUNT = 0.02;
const GATEWAY_RADIAL_LINE_OSCILLATION_SPEED = 0.02;

// Ruído Geral Sutil
const GATEWAY_NOISE_PARTICLE_COUNT = 100;
const GATEWAY_NOISE_MAX_SIZE = 2.0;
const GATEWAY_NOISE_MIN_ALPHA = 0.01;
const GATEWAY_NOISE_MAX_ALPHA = 0.08;

// Glitches nas Bordas Sutis
const GATEWAY_GLITCH_EVENT_CHANCE = 0.1; 
const GATEWAY_GLITCHES_PER_EVENT_MIN = 1;
const GATEWAY_GLITCHES_PER_EVENT_MAX = 3; 
const GATEWAY_GLITCH_MIN_DURATION_FRAMES = 2;
const GATEWAY_GLITCH_MAX_DURATION_FRAMES = 4;
const GATEWAY_GLITCH_MAX_WIDTH_PIXELS = 50; 
const GATEWAY_GLITCH_MAX_HEIGHT_PIXELS = 20;
const GATEWAY_GLITCH_COLOR_HUES = [240, 300, 180]; // Roxo, Rosa, Ciano (mais suaves)

// Malha de Fundo Sutil (Tipo Fluxo de Consciência)
const GATEWAY_BG_GRID_LINES_COUNT = 8; 
const GATEWAY_BG_GRID_MAX_ALPHA = 0.07;
const GATEWAY_BG_GRID_LINE_WIDTH = 1.0;
const GATEWAY_BG_GRID_PERSPECTIVE_STRENGTH = 0.0003; 

interface GatewayParticle { x: number; y: number; angle: number; speed: number; colorHue: number; size: number; isWhite: boolean; baseLightness: number;}
interface GatewayConcentricRect { scale: number; opacity: number; hue: number; baseRotation: number; }
interface GatewayActiveGlitch { x: number; y: number; width: number; height: number; color: string; remainingFrames: number; }

// --- END COPIED AND ADAPTED FROM DimensionalRiftScene ---

interface DimensionalRiftGatewaySceneProps {
  onComplete: (outcome: 'finalScreen' | 'pacman' | 'startOver') => void;
  onReturnToMap?: () => void; // Nova prop para voltar ao mapa
}

const DimensionalRiftGatewayScene: React.FC<DimensionalRiftGatewaySceneProps> = ({ onComplete, onReturnToMap }) => {
  // Estados para controlar os modais e fluxo da cena
  const [showInitialText, setShowInitialText] = useState(true);
  // Adicione mais estados conforme necessário para os modais e interações
  const [isAccessModalOpen, setIsAccessModalOpen] = useState(false);
  const [isQrCodeModalOpen, setIsQrCodeModalOpen] = useState(false);
  const [isDesistConfirmModalOpen, setIsDesistConfirmModalOpen] = useState(false);
  const [isSphereVibrating, setIsSphereVibrating] = useState(true);
  const [showPointCameraInstruction, setShowPointCameraInstruction] = useState(false);

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const sphereRef = useRef<HTMLDivElement>(null); // Ref for the sphere element

  // Refs para os elementos do canvas, adaptados
  const particlesRef = useRef<GatewayParticle[]>([]); 
  const concentricRectsRef = useRef<GatewayConcentricRect[]>([]);
  const activeGlitchesRef = useRef<GatewayActiveGlitch[]>([]);
  const frameCountRef = useRef(0);

  const { playSound, stopSound, loadSound } = useAudioManager(); // Adicionado

  // Efeito para o texto inicial de 7 segundos
  useEffect(() => {
    if (showInitialText) {
      const timer = setTimeout(() => {
        setShowInitialText(false);
      }, 7000);
      return () => clearTimeout(timer);
    }
  }, [showInitialText]);

  // Efeito para o canvas de background (lógica a ser adicionada)
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;

    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      // Reinicializar partículas se necessário ao redimensionar para evitar que fiquem presas
      // Se as partículas são sempre reiniciadas do centro, pode não ser estritamente necessário
      // mas se a lógica de respawn for baseada em sair dos limites atuais, pode ser útil.
      // particlesRef.current = []; // Exemplo, se precisar reinicializar
    };

    const initializeParticles = () => {
        particlesRef.current = []; // Limpa para o caso de redimensionamento ou reinício
        for (let i = 0; i < GATEWAY_PARTICLE_COUNT; i++) {
            const isWhite = Math.random() < 0.6; // Um pouco mais de brancas para sutileza
            particlesRef.current.push({
              x: canvas.width / 2, y: canvas.height / 2,
              angle: Math.random() * Math.PI * 2,
              speed: Math.random() * GATEWAY_PARTICLE_SPEED_MULTIPLIER + 0.5, 
              colorHue: Math.random() * 360,
              size: Math.random() * GATEWAY_PARTICLE_SIZE + 0.5,
              isWhite: isWhite,
              baseLightness: isWhite ? Math.random() * 20 + 80 : 60, // Brancos mais brilhantes, coloridos mais escuros/sutis
            });
        }
    };
    
    const renderBackgroundGrid = (currentFrame: number) => {
        const centerX = canvas.width / 2;
        const centerY = canvas.height / 2;
        const timeFactor = currentFrame * GATEWAY_BG_GRID_PERSPECTIVE_STRENGTH;

        ctx.lineWidth = GATEWAY_BG_GRID_LINE_WIDTH;
        const numLines = GATEWAY_BG_GRID_LINES_COUNT;
        const baseHue = (currentFrame * 0.05) % 360; // Mais lento

        for (let i = 0; i <= numLines; i++) {
            const progress = i / numLines;
            const perspectiveOffset = Math.pow(progress, 2.5) * canvas.width * timeFactor; // Mais curvatura
            
            const currentHue = (baseHue + progress * 20) % 360;
            const alpha = GATEWAY_BG_GRID_MAX_ALPHA * (1 - Math.pow(progress, 0.5)) * 0.6; // Mais transparente nas bordas rapidamente
            ctx.strokeStyle = `hsla(${currentHue}, 50%, 35%, ${alpha})`; // Cores mais escuras

            const yPos = centerY + (progress * canvas.height/1.8) - perspectiveOffset;
            const yNeg = centerY - (progress * canvas.height/1.8) + perspectiveOffset;
            ctx.beginPath(); ctx.moveTo(0, yPos); ctx.lineTo(canvas.width, yPos); ctx.stroke();
            ctx.beginPath(); ctx.moveTo(0, yNeg); ctx.lineTo(canvas.width, yNeg); ctx.stroke();

            const xPos = centerX + (progress * canvas.width/1.8) - perspectiveOffset;
            const xNeg = centerX - (progress * canvas.width/1.8) + perspectiveOffset;
            ctx.beginPath(); ctx.moveTo(xPos, 0); ctx.lineTo(xPos, canvas.height); ctx.stroke();
            ctx.beginPath(); ctx.moveTo(xNeg, 0); ctx.lineTo(xNeg, canvas.height); ctx.stroke();
        }
    };

    const renderGrid = (currentFrame: number) => { // Losangos
        const centerX = canvas.width / 2;
        const centerY = canvas.height / 2;
        ctx.lineWidth = 0.8; // Mais fino
        for (let i = 0; i < GATEWAY_GRID_RADIAL_LINES; i++) {
            const baseAngle = (i / GATEWAY_GRID_RADIAL_LINES) * Math.PI * 2;
            const angleOffset = Math.sin(currentFrame * GATEWAY_RADIAL_LINE_OSCILLATION_SPEED + i * 0.6) * GATEWAY_RADIAL_LINE_OSCILLATION_AMOUNT;
            const angle = baseAngle + angleOffset + (currentFrame * 0.0005); 
            const hue = (currentFrame * GATEWAY_GRID_LINE_HUE_SPEED * 0.5 + i * (360 / GATEWAY_GRID_RADIAL_LINES)) % 360;
            ctx.strokeStyle = `hsla(${hue}, 80%, 50%, 0.1)`; // Bem sutil
            ctx.beginPath(); ctx.moveTo(centerX, centerY);
            ctx.lineTo(centerX + Math.cos(angle) * canvas.width * 0.7, centerY + Math.sin(angle) * canvas.height * 0.7); 
            ctx.stroke();
        }
        if (currentFrame % GATEWAY_GRID_RECT_SPAWN_INTERVAL === 0 && concentricRectsRef.current.length < GATEWAY_GRID_MAX_CONCENTRIC_RECTS) {
            concentricRectsRef.current.push({ scale: GATEWAY_GRID_INITIAL_RECT_SIZE, opacity: 0.8, hue: (currentFrame * 1.5) % 360, baseRotation: (Math.random() - 0.5) * Math.PI / 4 });
        }
        concentricRectsRef.current = concentricRectsRef.current.filter(rect => rect.opacity > 0.005 && rect.scale < Math.max(canvas.width, canvas.height) * 1.1);
        concentricRectsRef.current.forEach(rect => {
            rect.scale += GATEWAY_GRID_SPEED * (1 + rect.scale / (canvas.width*0.6)); 
            rect.opacity -= 0.008;
            rect.hue = (rect.hue + GATEWAY_GRID_LINE_HUE_SPEED) % 360;
            const pulse = Math.sin(currentFrame * GATEWAY_GRID_SCALE_PULSE_SPEED + rect.scale * 0.06) * GATEWAY_GRID_SCALE_PULSE_AMOUNT * (1 + rect.opacity);
            const currentScale = rect.scale * (1 + pulse);
            const size = currentScale;
            const rotation = rect.baseRotation + currentFrame * GATEWAY_GRID_ROTATION_SPEED * (rect.hue / 200) + Math.PI / 4;            
            ctx.save(); ctx.translate(centerX, centerY); ctx.rotate(rotation);
            ctx.strokeStyle = `hsla(${rect.hue}, 70%, 60%, ${rect.opacity * 0.5})`; 
            ctx.lineWidth = Math.max(0.5, 2.5 * rect.opacity * (size / canvas.width + 0.15)); // Mais fino
            ctx.beginPath(); ctx.moveTo(-size / 2, -size / 2); ctx.lineTo(size / 2, -size / 2); ctx.lineTo(size / 2, size / 2); ctx.lineTo(-size / 2, size / 2); ctx.closePath(); ctx.stroke();
            ctx.restore();
        });
    };

    const renderParticles_logic = () => {
        particlesRef.current.forEach(p => {
            p.x += Math.cos(p.angle) * p.speed * (1 + p.y / (canvas.height * 1.5)); // Movimento menos dependente da posição
            p.y += Math.sin(p.angle) * p.speed * (1 + p.x / (canvas.width * 1.5));
            p.colorHue = (p.colorHue + 0.8) % 360; // Mudança de cor mais lenta
            if (p.x < -20 || p.x > canvas.width + 20 || p.y < -20 || p.y > canvas.height + 20) { // Limites um pouco menores
                p.x = canvas.width / 2; p.y = canvas.height / 2;
                p.angle = Math.random() * Math.PI * 2; p.speed = Math.random() * GATEWAY_PARTICLE_SPEED_MULTIPLIER + 0.5;
                p.isWhite = Math.random() < 0.6;
                p.baseLightness = p.isWhite ? Math.random() * 20 + 80 : 60;
            }
            if (p.isWhite) {
                ctx.fillStyle = `hsla(0, 0%, ${p.baseLightness}%, 0.7)`; // Alpha fixo para brancas
            } else {
                ctx.fillStyle = `hsla(${p.colorHue}, 60%, ${p.baseLightness}%, 0.5)`; // Alpha e saturação menores para coloridas
            }
            // ctx.globalAlpha = Math.random() * 0.2 + 0.3; // Alpha sutil e variado
            ctx.fillRect(p.x - p.size / 2, p.y - p.size / 2, p.size, p.size);
            // ctx.globalAlpha = 1.0; 
        });
    };

    const renderNoise = (currentFrame: number) => {
        for (let i = 0; i < GATEWAY_NOISE_PARTICLE_COUNT; i++) {
            const x = Math.random() * canvas.width; const y = Math.random() * canvas.height;
            const size = Math.random() * GATEWAY_NOISE_MAX_SIZE;
            const alpha = Math.random() * (GATEWAY_NOISE_MAX_ALPHA - GATEWAY_NOISE_MIN_ALPHA) + GATEWAY_NOISE_MIN_ALPHA;
            const grayscale = Math.floor(Math.random() * 80 + 175); // Tons de cinza mais claros
            ctx.fillStyle = `rgba(${grayscale}, ${grayscale}, ${grayscale}, ${alpha})`;
            ctx.fillRect(x, y, size, size);
        }
    };
    
    const renderEdgeGlitches = (currentFrame: number) => {
        activeGlitchesRef.current = activeGlitchesRef.current.filter(glitch => {
            ctx.fillStyle = glitch.color; ctx.fillRect(glitch.x, glitch.y, glitch.width, glitch.height);
            glitch.remainingFrames--; return glitch.remainingFrames > 0;
        });
        if (Math.random() < GATEWAY_GLITCH_EVENT_CHANCE) {
            const numGlitchesToSpawn = Math.floor(Math.random() * (GATEWAY_GLITCHES_PER_EVENT_MAX - GATEWAY_GLITCHES_PER_EVENT_MIN + 1)) + GATEWAY_GLITCHES_PER_EVENT_MIN;
            for (let i = 0; i < numGlitchesToSpawn; i++) {
                const isHorizontal = Math.random() < 0.6;
                const glitchWidth = Math.random() * GATEWAY_GLITCH_MAX_WIDTH_PIXELS * (isHorizontal ? 1 : 0.4) + 3;
                const glitchHeight = Math.random() * GATEWAY_GLITCH_MAX_HEIGHT_PIXELS * (isHorizontal ? 0.4 : 1) + 3;
                const edge = Math.floor(Math.random() * 4); let x, y;
                const invasionFactor = 0.1; 
                switch (edge) {
                    case 0: x = Math.random() * (canvas.width - glitchWidth); y = Math.random() * glitchHeight * (1 - invasionFactor) - glitchHeight * (invasionFactor/2) ; break;
                    case 1: x = Math.random() * (canvas.width - glitchWidth); y = canvas.height - glitchHeight * (1 - Math.random() * invasionFactor) ; break;
                    case 2: x = Math.random() * glitchWidth * (1 - invasionFactor) - glitchWidth * (invasionFactor/2); y = Math.random() * (canvas.height - glitchHeight); break;
                    default: x = canvas.width - glitchWidth * (1 - Math.random() * invasionFactor); y = Math.random() * (canvas.height - glitchHeight); break;
                }
                const colorHue = GATEWAY_GLITCH_COLOR_HUES[Math.floor(Math.random() * GATEWAY_GLITCH_COLOR_HUES.length)];
                const glitchColor = `hsla(${colorHue}, 80%, ${Math.random()*20 + 60}%, ${Math.random()*0.3 + 0.3})`; // Cores e alpha mais sutis
                const duration = Math.floor(Math.random() * (GATEWAY_GLITCH_MAX_DURATION_FRAMES - GATEWAY_GLITCH_MIN_DURATION_FRAMES + 1)) + GATEWAY_GLITCH_MIN_DURATION_FRAMES;
                activeGlitchesRef.current.push({ x, y, width: glitchWidth, height: glitchHeight, color: glitchColor, remainingFrames: duration });
            }
        }
    };

    const drawFullBackground = () => {
      frameCountRef.current++;
      ctx.fillStyle = `rgba(0, 0, 0, ${GATEWAY_CLEAR_ALPHA})`; // Use a constante GATEWAY_CLEAR_ALPHA
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      
      renderBackgroundGrid(frameCountRef.current);
      renderGrid(frameCountRef.current);
      renderParticles_logic(); 
      renderNoise(frameCountRef.current);
      renderEdgeGlitches(frameCountRef.current);
      
      animationFrameId = requestAnimationFrame(drawFullBackground);
    };

    window.addEventListener('resize', resizeCanvas);
    resizeCanvas(); // Set initial size
    initializeParticles(); // Initialize particles after canvas is sized
    drawFullBackground(); // Start the animation loop

    return () => {
      window.removeEventListener('resize', resizeCanvas);
      cancelAnimationFrame(animationFrameId);
      // Limpar refs se necessário para evitar memory leaks em HMR ou desmontagem
      particlesRef.current = [];
      concentricRectsRef.current = [];
      activeGlitchesRef.current = [];
      frameCountRef.current = 0;
    };
  }, []); // Empty dependency array ensures this runs once on mount and cleans up on unmount

  useEffect(() => {
    playSound({
      filePath: '/assets/sounds/fenda_primeiro_raio_music.mp3',
      loop: true,
      fadeInDuration: 1.5,
      volume: 0.8
    });
    return () => {
      stopSound('/assets/sounds/fenda_primeiro_raio_music.mp3', 1.5);
    };
  }, [playSound, stopSound]);

  const handleSphereClick = () => {
    setIsSphereVibrating(false); // Para a vibração
    setIsAccessModalOpen(true);
  };

  // Handlers para os botões dos modais
  const handleAccessPrepared = () => {
    setIsAccessModalOpen(false);
    setIsQrCodeModalOpen(true);
  };

  const handleAccessAfraid = () => {
    setIsAccessModalOpen(false);
    setIsDesistConfirmModalOpen(true);
  };

  const handleQrContinue = () => {
    setIsQrCodeModalOpen(false);
    setIsSphereVibrating(false); // Para a vibração da esfera
    setShowPointCameraInstruction(true);
    // Iniciar timer de 120s
    setTimeout(() => {
      onComplete('finalScreen');
    }, 120000);
  };

  const handleDesistTry = () => {
    setIsDesistConfirmModalOpen(false);
    setIsQrCodeModalOpen(true); // Vai para o QR Code
  };

  const handleDesistGiveUp = () => {
    setIsDesistConfirmModalOpen(false);
    onComplete('startOver'); // Alterado para 'startOver'
  };


  return (
    <div className="w-screen h-screen relative flex flex-col items-center justify-center overflow-hidden bg-black">
      {onReturnToMap && <ReturnToMapButton onClick={onReturnToMap} />}
      <canvas ref={canvasRef} className="absolute top-0 left-0 w-full h-full z-0" />

      {/* Texto Inicial */}
      {showInitialText && (
        <div className="absolute top-10 left-1/2 -translate-x-1/2 z-20 p-4 bg-black bg-opacity-50 rounded-md">
          <p className="text-xl font-pixel text-arcade-cyan text-center">
            Clique na esfera se estiver preparado
          </p>
        </div>
      )}

      {/* Esfera Central */}
      <div 
        ref={sphereRef}
        className={`sphere-base absolute z-10 ${isSphereVibrating ? 'sphere-vibrating' : 'sphere-static'}`}
        onClick={handleSphereClick} 
      >
        {/* Conteúdo da esfera se houver, ou deixar vazio para o gradiente */}
      </div>

      {/* Instrução para apontar a câmera - AGORA POSICIONADA ACIMA DA ESFERA */}
      {showPointCameraInstruction && (
        <div 
          className="absolute z-20 text-center p-3 bg-black rounded-md opacity-90"
          style={{
            bottom: 'calc(50% + 8rem + 100px)', // 50% (centro) + raio da esfera aprox (13rem/2 ~6.5rem, usando 8rem para folga) + 100px de distância
            left: '50%',
            transform: 'translateX(-50%)',
          }}
        >
            <p className="text-lg font-pixel text-arcade-cyan">Aponte a câmera para a esfera.</p>
        </div>
      )}

      {/* Modal para Escolha de Acesso */}
      <Modal
        isOpen={isAccessModalOpen}
        onClose={() => setIsAccessModalOpen(false)}
        title={
          <div className="pt-2.5">
            <h2 className="text-xl md:text-2xl font-pixel text-white text-center">
              Você liberou uma faixa de ruptura.
            </h2>
          </div>
        }
      >
        <div className="text-center mt-4">
            <p className="text-lg text-gray-300">Está preparado para acessar?</p>
        </div>
        <div className="mt-8 flex flex-row justify-center items-center space-x-4">
          <button
            onClick={handleAccessPrepared}
            className="font-pixel px-6 py-3 rounded-md text-white bg-green-600 hover:bg-green-500 transition-colors duration-300 w-auto"
          >
            Estou preparado
          </button>
          <button
            onClick={handleAccessAfraid}
            className="font-pixel px-6 py-3 rounded-md text-gray-300 bg-blue-800/90 hover:bg-blue-700/90 transition-colors duration-300 w-auto"
          >
            Tenho medo
          </button>
        </div>
      </Modal>

      {/* Modal de Instrução do QR Code */}
      <Modal
        isOpen={isQrCodeModalOpen}
        onClose={() => {
          setIsQrCodeModalOpen(false);
          // Talvez reiniciar a vibração da esfera se o usuário fechar este modal sem interagir
          // setIsSphereVibrating(true);
        }}
        title="Um Eco Tecnológico na Fenda"
      >
        <div className="mt-4 flex flex-col items-center text-center px-2.5">
          <p className="text-sm text-gray-300 mb-4 font-pixel px-4">
            {showPointCameraInstruction 
              ? "Aponte com a câmera para ajudar Pinky a acessar"
              : "Aponte a câmera para revelar o caminho de Pinky"}
          </p>
          
          {/* QR Code real */}
          <div className="w-40 h-40 bg-gray-800/70 border-2 border-purple-500/80 flex items-center justify-center mb-6 mt-[15px]">
            <img src="/assets/images/QR_CODE.png" alt="QR Code" className="w-full h-full object-contain" />
          </div>
          
          <button
            onClick={handleQrContinue}
            className="font-pixel px-8 py-3 rounded-md text-white bg-transparent border-2 border-white 
                       shadow-[0_0_4px_#fff,0_0_8px_#fff,0_0_12px_#00ffff,inset_0_0_4px_#fff]  /* Neon diminuído */
                       hover:bg-green-600 hover:shadow-none hover:text-white 
                       transition-all duration-300 w-auto text-lg"
          >
            {showPointCameraInstruction ? "Entendido" : "Continuar"}
          </button>
        </div>
      </Modal>

      {/* Modal para Confirmação de Desistência */}
      <Modal
        isOpen={isDesistConfirmModalOpen}
        onClose={() => setIsDesistConfirmModalOpen(false)}
        title="Desistir agora é abandonar a consciência adquirida."
        contentClassName="!bg-red-900 !bg-opacity-80"
      >
        <div className="text-center mt-3 mb-6">
          <p className="text-base text-gray-400">Você tem certeza?</p>
        </div>
        <div className="mt-8 flex flex-row justify-center items-center space-x-4">
          <button
            onClick={handleDesistTry}
            className="font-pixel text-sm px-8 py-3 rounded-md text-white bg-green-600 hover:bg-green-500 transition-colors duration-300 w-auto"
          >
            Quero continuar
          </button>
          <button
            onClick={handleDesistGiveUp}
            className="font-pixel text-sm px-8 py-3 rounded-md text-gray-200 bg-red-800/80 hover:bg-red-700/90 transition-colors duration-300 w-auto"
          >
            Retornar ao início
          </button>
        </div>
      </Modal>

    </div>
  );
};

export default DimensionalRiftGatewayScene; 