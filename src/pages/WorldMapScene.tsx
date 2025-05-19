import React, { useState, useEffect, useRef } from 'react';
// import type { SceneName } from '../App'; // Comentado se não usado diretamente aqui
import DPad from '../components/ui/DPad'; // Importar DPad
import useAudioManager from '../hooks/useAudioManager'; // Adicionado

// Tipos e Constantes
const ORIGINAL_MAP_WIDTH = 4096;
const ORIGINAL_MAP_HEIGHT = 2760;

const PINKY_MOVE_STEP = 0.01; // Fração da dimensão do mapa por passo
const PINKY_DISPLAY_WIDTH = 50; // Largura visual da Pinky em pixels
const PINKY_DISPLAY_HEIGHT = 50; // Altura visual da Pinky em pixels

const INTERACTION_RADIUS = 0.04; // Raio para efeito de hover (fração da menor dimensão do mapa)

type Position = {
  normalizedX: number;
  normalizedY: number;
};

type InteractivePoint = {
  id: string;
  name: string;
  originalX: number; 
  originalY: number; 
  normalizedX: number;
  normalizedY: number;
  targetScene: string; 
  description?: string;
};

const interactivePointsData: Omit<InteractivePoint, 'normalizedX' | 'normalizedY'>[] = [
  { id: 'vestigios_ceu', name: 'Vestígios do Céu', originalX: 1231, originalY: 888, targetScene: 'sky_relics_scene', description: 'Ponto inicial, bosque' },
  { id: 'biblioteca_sapencial', name: 'Biblioteca Sapencial', originalX: 1626, originalY: 1487, targetScene: 'biblioteca_scene', description: 'Conhecimento ancestral' },
  { id: 'oraculo', name: 'Ruína de Logéthos', originalX: 2588.5, originalY: 1496.5, targetScene: 'oraculo_scene', description: 'Visões do futuro' },
  { id: 'fenda_primeiro_raio', name: 'Fenda do Primeiro Raio', originalX: 2837.5, originalY: 678.5, targetScene: 'fenda_scene', description: 'Energia primordial' },
];

const interactivePoints: InteractivePoint[] = interactivePointsData.map(p => ({
  ...p,
  normalizedX: p.originalX / ORIGINAL_MAP_WIDTH,
  normalizedY: p.originalY / ORIGINAL_MAP_HEIGHT,
}));

interface WorldMapSceneProps {
  // A função onNavigate em App.tsx espera (targetPointId: string)
  // e App.tsx decide a cena e se deve pular diálogos.
  onNavigate: (targetPointId: string) => void;
  bosqueCompleted: boolean;
}

const WorldMapScene: React.FC<WorldMapSceneProps> = ({ onNavigate, bosqueCompleted }) => {
  const [mapSize, setMapSize] = useState({ width: 0, height: 0 });
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const [pinkyPosition, setPinkyPosition] = useState<Position>({ normalizedX: 0.3005, normalizedY: 0.3217 }); // Posição inicial da Pinky (centro)
  const [pinkyDirection, setPinkyDirection] = useState<'frente' | 'costas' | 'esquerda' | 'direita'>('frente'); // Novo estado para direção
  const [hoveredPointId, setHoveredPointId] = useState<string | null>(null);
  const [showMapInstruction, setShowMapInstruction] = useState(false); // Modificado: Começa como falso
  const instructionTimerRef = useRef<NodeJS.Timeout | null>(null); // Novo ref para o timer
  const { playSound, stopSound } = useAudioManager(); // Adicionado

  const pinkySprites = {
    frente: '/assets/images/pinky_sprite_frente_16bit.png',
    costas: '/assets/images/pinky_sprite_costas_16bit.png',
    esquerda: '/assets/images/pinky_sprite_esquerda_16bit.png',
    direita: '/assets/images/pinky_sprite_direita_16bit.png',
  };

  // Função auxiliar para calcular o ponto mais próximo da Pinky
  const calculateClosestPointToPinky = (
    currentPinkyPosition: Position,
    points: InteractivePoint[],
    radius: number,
    currentMapSize: {width: number, height: number}
  ): string | null => {
    if (currentMapSize.width === 0 || currentMapSize.height === 0) return null;
    
    let closestId: string | null = null;
    let minDistanceSq = radius * radius; 

    for (const point of points) {
      const dx = currentPinkyPosition.normalizedX - point.normalizedX;
      const dy = currentPinkyPosition.normalizedY - point.normalizedY;
      const distanceSq = dx * dx + dy * dy;

      if (distanceSq < minDistanceSq) {
        minDistanceSq = distanceSq;
        closestId = point.id;
      }
    }
    return closestId;
  };

  useEffect(() => {
    const calculateMapSize = () => {
      if (mapContainerRef.current) {
        const containerWidth = mapContainerRef.current.offsetWidth;
        const containerHeight = mapContainerRef.current.offsetHeight;
        const mapAspectRatio = ORIGINAL_MAP_WIDTH / ORIGINAL_MAP_HEIGHT;
        
        let width = containerWidth;
        let height = containerWidth / mapAspectRatio;

        if (height > containerHeight) {
          height = containerHeight;
          width = containerHeight * mapAspectRatio;
        }
        setMapSize({ width, height });
      }
    };

    calculateMapSize();
    window.addEventListener('resize', calculateMapSize);
    return () => window.removeEventListener('resize', calculateMapSize);
  }, []);

  useEffect(() => {
    // Atualiza o ponto em hover com base na proximidade da Pinky
    const closestToPinky = calculateClosestPointToPinky(pinkyPosition, interactivePoints, INTERACTION_RADIUS, mapSize);
    // Só atualiza se o mouse não estiver explicitamente sobre um ponto diferente, 
    // ou se nenhum ponto estiver atualmente em hover pelo mouse.
    // Esta lógica é simplificada: o mouseEnter/Leave terá a palavra final momentaneamente.
    setHoveredPointId(closestToPinky);
  }, [pinkyPosition, mapSize]); // Removido interactivePoints pois é estável

  // Restaurar useEffect para handleKeyDown (movimento pelo teclado)
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      setPinkyPosition(prevPos => {
        let newNormalizedX = prevPos.normalizedX;
        let newNormalizedY = prevPos.normalizedY;
        let newDirection = pinkyDirection;

        switch (event.key) {
          case 'ArrowUp': 
            newNormalizedY -= PINKY_MOVE_STEP; 
            newDirection = 'costas';
            break;
          case 'ArrowDown': 
            newNormalizedY += PINKY_MOVE_STEP; 
            newDirection = 'frente';
            break;
          case 'ArrowLeft': 
            newNormalizedX -= PINKY_MOVE_STEP; 
            newDirection = 'esquerda';
            break;
          case 'ArrowRight': 
            newNormalizedX += PINKY_MOVE_STEP; 
            newDirection = 'direita';
            break;
          default: return prevPos;
        }
        setPinkyDirection(newDirection);

        const minX = mapSize.width > 0 ? (PINKY_DISPLAY_WIDTH / 2) / mapSize.width : 0;
        const maxX = mapSize.width > 0 ? 1 - (PINKY_DISPLAY_WIDTH / 2) / mapSize.width : 1;
        const minY = mapSize.height > 0 ? (PINKY_DISPLAY_HEIGHT / 2) / mapSize.height : 0;
        const maxY = mapSize.height > 0 ? 1 - (PINKY_DISPLAY_HEIGHT / 2) / mapSize.height : 1;

        newNormalizedX = Math.max(minX, Math.min(maxX, newNormalizedX));
        newNormalizedY = Math.max(minY, Math.min(maxY, newNormalizedY));
        
        return { normalizedX: newNormalizedX, normalizedY: newNormalizedY };
      });
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [mapSize]); // Dependência em mapSize para recalcular limites

  // Nova função para lidar com cliques do DPad reutilizável
  const handleMapDpadClick = (direction: 'ArrowUp' | 'ArrowDown' | 'ArrowLeft' | 'ArrowRight') => {
    setPinkyPosition(prevPos => {
      let newNormalizedX = prevPos.normalizedX;
      let newNormalizedY = prevPos.normalizedY;
      let newDirection = pinkyDirection;

      switch (direction) {
        case 'ArrowUp': 
          newNormalizedY -= PINKY_MOVE_STEP; 
          newDirection = 'costas';
          break;
        case 'ArrowDown': 
          newNormalizedY += PINKY_MOVE_STEP; 
          newDirection = 'frente';
          break;
        case 'ArrowLeft': 
          newNormalizedX -= PINKY_MOVE_STEP; 
          newDirection = 'esquerda';
          break;
        case 'ArrowRight': 
          newNormalizedX += PINKY_MOVE_STEP; 
          newDirection = 'direita';
          break;
      }
      setPinkyDirection(newDirection);

      const minX = mapSize.width > 0 ? (PINKY_DISPLAY_WIDTH / 2) / mapSize.width : 0;
      const maxX = mapSize.width > 0 ? 1 - (PINKY_DISPLAY_WIDTH / 2) / mapSize.width : 1;
      const minY = mapSize.height > 0 ? (PINKY_DISPLAY_HEIGHT / 2) / mapSize.height : 0;
      const maxY = mapSize.height > 0 ? 1 - (PINKY_DISPLAY_HEIGHT / 2) / mapSize.height : 1;

      newNormalizedX = Math.max(minX, Math.min(maxX, newNormalizedX));
      newNormalizedY = Math.max(minY, Math.min(maxY, newNormalizedY));
      
      return { normalizedX: newNormalizedX, normalizedY: newNormalizedY };
    });
  };

  // useEffect para controlar a exibição do aviso de inatividade
  useEffect(() => {
    // Se o aviso estiver visível, esconde-o pois houve interação (mudança de pinkyPosition)
    if (showMapInstruction) {
      setShowMapInstruction(false);
    }

    // Limpa o timer anterior, se existir
    if (instructionTimerRef.current) {
      clearTimeout(instructionTimerRef.current);
    }

    // Inicia um novo timer para mostrar o aviso após 4 segundos de inatividade
    instructionTimerRef.current = setTimeout(() => {
      setShowMapInstruction(true);
    }, 4000); // 4 segundos

    // Limpa o timer quando o componente é desmontado ou antes da próxima execução do efeito
    return () => {
      if (instructionTimerRef.current) {
        clearTimeout(instructionTimerRef.current);
      }
    };
  }, [pinkyPosition]); // Reage a mudanças na posição da Pinky (e na montagem inicial)

  useEffect(() => {
    playSound({
      filePath: '/assets/sounds/world_map_music.mp3',
      loop: true,
      fadeInDuration: 1.5,
      volume: 0.7
    });
    return () => {
      stopSound('/assets/sounds/world_map_music.mp3', 1.5);
    };
  }, [playSound, stopSound]);

  return (
    <>
      <style>
        {`
          @keyframes scroll-left-to-right {
            0% { transform: translateX(-100%); opacity: 0; }
            10%, 80% { opacity: 0.8; } /* Fade-in até 10%, mantém opacidade, começa fade-out em 80% */
            100% { transform: translateX(100vw); opacity: 0; }
          }
          @keyframes scroll-right-to-left {
            0% { transform: translateX(100vw); opacity: 0; }
            10%, 80% { opacity: 0.8; } /* Fade-in até 10%, mantém opacidade, começa fade-out em 80% */
            100% { transform: translateX(-100%); opacity: 0; }
          }
          .animate-cloud-ltr {
            animation: scroll-left-to-right 60s linear infinite;
          }
          .animate-cloud-rtl {
            animation: scroll-right-to-left 70s linear infinite;
          }
          .map-instruction-box {
            box-shadow: 0 0 15px 3px rgba(128, 0, 128, 0.7), inset 0 0 8px 2px rgba(220, 180, 255, 0.5); /* Neon Roxo similar ao PacMan */
            border-color: rgba(180, 100, 255, 0.8);
          }
        `}
      </style>
      <div ref={mapContainerRef} className="w-screen h-screen bg-black flex items-center justify-center overflow-hidden select-none relative">
        
        {/* Box de Instrução do Mapa */} 
        {showMapInstruction && (
          <div className="absolute top-8 left-1/2 transform -translate-x-1/2 z-50 p-4 bg-black bg-opacity-80 border-2 rounded-lg map-instruction-box max-w-lg w-11/12 sm:w-auto">
            <p className="font-pixel text-center text-lg text-white">
              Lembre-se, você é um espectro, desfrute do mapa
            </p>
          </div>
        )}

        {/* Nuvem Superior */}
        <img 
          src="/assets/images/nuvem_cima_mapa.png"
          alt="Nuvem superior"
          className="absolute top-0 left-0 w-[150%] max-w-none h-auto z-40 animate-cloud-ltr pointer-events-none"
        />
        
        {/* Nuvem Inferior */}
        <img 
          src="/assets/images/nuvem_baixo_mapa.png"
          alt="Nuvem inferior"
          className="absolute bottom-0 right-0 w-[150%] max-w-none h-auto z-40 animate-cloud-rtl pointer-events-none"
        />

        <div
          style={{
            width: `${mapSize.width}px`,
            height: `${mapSize.height}px`,
            backgroundImage: 'url(/assets/images/cena_mapa.png)',
            backgroundSize: 'contain',
            backgroundRepeat: 'no-repeat',
            backgroundPosition: 'center',
            position: 'relative',
          }}
          className="map-content z-10"
        >
          {/* Renderizar Pinky */}
          {mapSize.width > 0 && mapSize.height > 0 && (
            <img 
              src={pinkySprites[pinkyDirection]}
              alt="Pinky"
              style={{
                position: 'absolute',
                left: `${pinkyPosition.normalizedX * mapSize.width - PINKY_DISPLAY_WIDTH / 2}px`,
                top: `${pinkyPosition.normalizedY * mapSize.height - PINKY_DISPLAY_HEIGHT / 2}px`,
                width: `${PINKY_DISPLAY_WIDTH}px`,
                height: `${PINKY_DISPLAY_HEIGHT}px`,
                imageRendering: 'pixelated', // Para manter o estilo pixel art
                zIndex: 30, // Acima do mapa, abaixo das nuvens
                transition: 'transform 0.1s ease-out', // Pequena transição para suavidade
              }}
            />
          )}

          {/* Renderizar Pontos Interativos */}
          {interactivePoints.map(point => {
            const displayX = point.normalizedX * mapSize.width;
            const displayY = point.normalizedY * mapSize.height;
            const isHovered = point.id === hoveredPointId;

            let pointName = point.name;
            let pointBgColor = isHovered ? 'rgba(255, 0, 255, 0.8)' : 'rgba(255, 255, 0, 0.7)';
            let pointTextColor = isHovered ? 'white' : 'black';

            if (point.id === 'vestigios_ceu' && bosqueCompleted) {
              pointName = `${point.name} (Concluído!)`;
              pointBgColor = isHovered ? 'rgba(100, 100, 100, 0.9)' : 'rgba(128, 128, 128, 0.7)'; // Cinza, um pouco mais escuro no hover
              pointTextColor = 'white'; // Texto branco para melhor contraste com cinza
            }

            return (
              <div
                key={point.id}
                style={{
                  position: 'absolute',
                  left: `${displayX}px`,
                  top: `${displayY}px`,
                  transform: `translate(-50%, -50%) ${isHovered ? 'scale(1.25)' : 'scale(1)'}`,
                  backgroundColor: pointBgColor,
                  color: pointTextColor,
                  padding: '3px 6px',
                  borderRadius: '4px',
                  fontSize: isHovered ? '12px' : '10px',
                  fontWeight: isHovered ? 'bold' : 'normal',
                  cursor: 'pointer',
                  whiteSpace: 'nowrap',
                  zIndex: 20, // Acima do mapa, abaixo da Pinky e das nuvens
                  transition: 'transform 0.2s ease-in-out, background-color 0.2s, color 0.2s, font-size 0.2s',
                }}
                onClick={() => {
                  console.log(`WorldMapScene: Clicado em: ${point.name}, ID: ${point.id}`);
                  onNavigate(point.id);
                }}
                onMouseEnter={() => setHoveredPointId(point.id)}
                onMouseLeave={() => {
                  const closestToPinkyOnMouseLeave = calculateClosestPointToPinky(pinkyPosition, interactivePoints, INTERACTION_RADIUS, mapSize);
                  setHoveredPointId(closestToPinkyOnMouseLeave);
                }}
              >
                {pointName}
              </div>
            );
          })}
        </div>

        {/* D-Pad Controls for World Map using Reusable Component */}
        <DPad 
          onDirectionClick={handleMapDpadClick}
          className="fixed bottom-8 left-1/2 transform -translate-x-1/2 z-50 select-none"
        />

      </div>
    </>
  );
};

export default WorldMapScene; 