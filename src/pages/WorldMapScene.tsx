import React, { useState, useEffect, useRef } from 'react';
// import type { SceneName } from '../App'; // Comentado se não usado diretamente aqui

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
  { id: 'vestigios_ceu', name: 'Vestígios do Céu', originalX: 1231, originalY: 888, targetScene: 'pacman_game', description: 'Ponto inicial, bosque' },
  { id: 'biblioteca_sapencial', name: 'Biblioteca Sapencial', originalX: 1626, originalY: 1487, targetScene: 'biblioteca_scene', description: 'Conhecimento ancestral' },
  { id: 'oraculo', name: 'Templo do Oráculo', originalX: 2588.5, originalY: 1496.5, targetScene: 'oraculo_scene', description: 'Visões do futuro' },
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
}

const WorldMapScene: React.FC<WorldMapSceneProps> = ({ onNavigate }) => {
  const [mapSize, setMapSize] = useState({ width: 0, height: 0 });
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const [pinkyPosition, setPinkyPosition] = useState<Position>({ normalizedX: 0.3005, normalizedY: 0.3217 }); // Posição inicial da Pinky (centro)
  const [hoveredPointId, setHoveredPointId] = useState<string | null>(null);

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
    const handleKeyDown = (event: KeyboardEvent) => {
      setPinkyPosition(prevPos => {
        let newNormalizedX = prevPos.normalizedX;
        let newNormalizedY = prevPos.normalizedY;

        switch (event.key) {
          case 'ArrowUp':
            newNormalizedY -= PINKY_MOVE_STEP;
            break;
          case 'ArrowDown':
            newNormalizedY += PINKY_MOVE_STEP;
            break;
          case 'ArrowLeft':
            newNormalizedX -= PINKY_MOVE_STEP;
            break;
          case 'ArrowRight':
            newNormalizedX += PINKY_MOVE_STEP;
            break;
          default:
            return prevPos; // Nenhuma tecla de seta, não faz nada
        }

        // Limites do mapa (considerando que a posição é o centro da Pinky)
        // E que mapSize.width e mapSize.height são > 0
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
  }, [mapSize]); // Dependência em mapSize para recalcular limites se o mapa redimensionar

  useEffect(() => {
    if (mapSize.width === 0 || mapSize.height === 0) return;

    let closestPointId: string | null = null;
    let minDistanceSq = INTERACTION_RADIUS * INTERACTION_RADIUS; // Comparar quadrados para evitar sqrt

    for (const point of interactivePoints) {
      const dx = pinkyPosition.normalizedX - point.normalizedX;
      const dy = pinkyPosition.normalizedY - point.normalizedY;
      const distanceSq = dx * dx + dy * dy;

      if (distanceSq < minDistanceSq) {
        minDistanceSq = distanceSq;
        closestPointId = point.id;
      }
    }
    setHoveredPointId(closestPointId);

  }, [pinkyPosition, mapSize, interactivePoints]); // Adicionado interactivePoints como dependência

  return (
    <div ref={mapContainerRef} className="w-screen h-screen bg-gray-800 flex items-center justify-center overflow-hidden select-none">
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
        className="map-content"
      >
        {/* Renderizar Pinky */}
        {mapSize.width > 0 && mapSize.height > 0 && (
          <img 
            src="/assets/images/pinky-character.png"
            alt="Pinky"
            style={{
              position: 'absolute',
              left: `${pinkyPosition.normalizedX * mapSize.width - PINKY_DISPLAY_WIDTH / 2}px`,
              top: `${pinkyPosition.normalizedY * mapSize.height - PINKY_DISPLAY_HEIGHT / 2}px`,
              width: `${PINKY_DISPLAY_WIDTH}px`,
              height: `${PINKY_DISPLAY_HEIGHT}px`,
              imageRendering: 'pixelated', // Para manter o estilo pixel art
              zIndex: 10, // Para garantir que Pinky fique sobre os pontos se necessário
              transition: 'transform 0.1s ease-out', // Pequena transição para suavidade
            }}
          />
        )}

        {/* Renderizar Pontos Interativos */}
        {interactivePoints.map(point => {
          const displayX = point.normalizedX * mapSize.width;
          const displayY = point.normalizedY * mapSize.height;
          const isHovered = point.id === hoveredPointId;

          return (
            <div
              key={point.id}
              style={{
                position: 'absolute',
                left: `${displayX}px`,
                top: `${displayY}px`,
                transform: `translate(-50%, -50%) ${isHovered ? 'scale(1.25)' : 'scale(1)'}`,
                backgroundColor: isHovered ? 'rgba(255, 0, 255, 0.8)' : 'rgba(255, 255, 0, 0.7)',
                color: isHovered ? 'white' : 'black',
                padding: '3px 6px',
                borderRadius: '4px',
                fontSize: isHovered ? '12px' : '10px',
                fontWeight: isHovered ? 'bold' : 'normal',
                cursor: 'pointer',
                whiteSpace: 'nowrap',
                zIndex: 1, // Para que Pinky possa passar por cima
                transition: 'transform 0.2s ease-in-out, background-color 0.2s, color 0.2s, font-size 0.2s',
              }}
              onClick={() => {
                console.log(`WorldMapScene: Clicado em: ${point.name}, ID: ${point.id}`);
                onNavigate(point.id);
              }}
            >
              {point.name}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default WorldMapScene; 