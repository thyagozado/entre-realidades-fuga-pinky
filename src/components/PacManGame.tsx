import React, { useState, useEffect, useRef } from 'react';
import DPad from './ui/DPad'; // Corrigido o caminho de importação
import useAudioManager from '../hooks/useAudioManager'; // Adicionado

// Game constants
const CELL_SIZE = 20;
const GRID_WIDTH = 28;
const GRID_HEIGHT = 31;
const GAME_SPEED = 150; // ms between movements

// Game elements
const EMPTY = 0;
const WALL = 1;
const DOT = 2;
const POWER_PELLET = 3;
const EXIT = 6;

// Directions
const UP = { x: 0, y: -1 };
const DOWN = { x: 0, y: 1 };
const LEFT = { x: -1, y: 0 };
const RIGHT = { x: 1, y: 0 };

// Estilos CSS para os personagens e D-Pad
const gameSpecificStyles = `
  /* ----------------------------------------
     Pac-Man (User Provided - New)
  ------------------------------------------*/
  .pacman {
    width: 100%; /* Ocupa CELL_SIZE via container */
    height: 100%; /* Ocupa CELL_SIZE via container */
    border-radius: 50%;
    background: #F2D648; /* Cor do Pac-Man do novo CSS */
    position: relative;
    /* margin-top: 20px;  removido, o posicionamento é pela grid */
  }

  .pacman__eye {
    position: absolute;
    /* width: 10px (de 100px) -> 10% */
    width: 10%; 
    /* height: 10px (de 100px) -> 10% */
    height: 10%;
    border-radius: 50%;
    /* top: 20px (de 100px) -> 20% */
    top: 20%; 
    /* right: 40px (de 100px) -> 40% */
    right: 40%; 
    background: #333333;
  }

  .pacman__mouth {
    background: #000; /* Cor do fundo do jogo para a boca */
    position: absolute;
    width: 100%;
    height: 100%;
    /* clip-path da animação é usado */
    animation-name: eat;
    animation-duration: 0.7s;
    animation-iteration-count: infinite;
  }

  @keyframes eat {
    0% {
      clip-path: polygon(100% 74%, 44% 48%, 100% 21%);
    }
    25% {
      clip-path: polygon(100% 60%, 44% 48%, 100% 40%);
    }
    50% {
      clip-path: polygon(100% 50%, 44% 48%, 100% 50%);
    }
    75% {
     clip-path: polygon(100% 59%, 44% 48%, 100% 35%);
    }
    100% {
     clip-path: polygon(100% 74%, 44% 48%, 100% 21%);
    }
  }

  /* ----------------------------------------
     Fantasma Rosa (Pinky) - New User Provided
  ------------------------------------------*/
  .ghost {
    /* Design original: width: 120px, height: 160px */
    /* No jogo, vai ocupar 100% de CELL_SIZE e manter proporções internas */
    width: 100%;
    height: 100%;
    border-radius: 50% 50% 0 0; /* Original: 100% 100% 0 0, adaptado para % do elemento */
    display: inline-block; /* Removido ou ajustado, pois controlamos com flex no container */
    position: relative;
    /* margin: 20px;  removido, o posicionamento é pela grid */
  }

  .pinky.ghost {
    background-color: #FF69B4; /* Cor rosa específica para Pinky */
  }

  .ghost .eyes{
    /* Original: height: 60px (de 160px ghost) -> 37.5% */
    /* Original: width: 90px (de 120px ghost) -> 75% */
    /* Original: left: 50%; margin-left: -45px (-37.5% da largura do ghost) */
    /* Original: top: 50px (de 160px ghost) -> 31.25% */
    height: 37.5%;
    width: 75%;
    left: 50%;
    transform: translateX(-50%); /* Alternativa ao margin-left negativo */
    position: absolute;
    top: 31.25%;
  }

  .ghost .eye{
    /* Original: height: 60px (de 60px .eyes container) -> 100% */
    /* Original: width: 30px (de 90px .eyes container) -> 33.33% */
    background: #fff;
    border-radius: 50%; /* Original: 100% */
    height: 100%; 
    width: 33.33%;
    position: relative; /* Para posicionar a íris dentro */
  }

  .ghost .iris{
    /* Original: height: 40px (de 60px .eye) -> 66.67% */
    /* Original: width: 20px (de 30px .eye) -> 66.67% */
    /* Original: top: 10px (de 60px .eye) -> 16.67% */
    background: blue; /* Cor da íris */
    border-radius: 50%; /* Original: 100% */
    height: 66.67%;
    width: 66.67%;
    position: absolute;
    top: 16.67%;
    /* CSS Vars para direção */
    --pupil-offset-x: 0%;
    --pupil-offset-y: 0%;
  }

  .ghost .leftEye{ float: left; }
  .ghost .leftEye .iris{
    /* Original: left: 5px (de 30px .eye) -> 16.67% */
    left: 16.67%;
    transform: translate(var(--pupil-offset-x), var(--pupil-offset-y));
  }

  .ghost .rightEye{ float: right; }
  .ghost .rightEye .iris{
    /* Original: right: 5px (de 30px .eye) -> 16.67% */
    /* Para posicionar com right e permitir transform, pode ser melhor usar left e ajustar */
    /* Ou usar left e transform: translateX para o posicionamento base e direcional */
    left: auto; /* Reseta left se estiver usando right */
    right: 16.67%; 
    transform: translate(var(--pupil-offset-x), var(--pupil-offset-y));
  }

  .ghost .ghostTail{
    /* Original: bottom: -20px (de 160px ghost) -> -12.5% */
    /* Original: height: 20px (de 160px ghost) -> 12.5% */
    /* Original: width: 120px (de 120px ghost) -> 100% */
    background-repeat: repeat-x;
    bottom: -12.5%; 
    height: 12.5%;
    position: absolute;
    width: 100%;
  }

  .pinky.ghost .ghostTail{
    /* Original background-size: 20px 20px. (20/120_ghost_width)*100% = 16.67% */
    background:
      linear-gradient(-45deg, transparent 75%, #FF69B4 75%) 0 50%,
      linear-gradient( 45deg, transparent 75%, #FF69B4 75%) 0 50%;
    background-size: 16.67% 100%; /* Largura do padrão, Altura do padrão (ocupa toda a altura da cauda) */
  }
  
  .d-pad-container {
    display: grid;
    grid-template-areas:
      ". up ."
      "left middle right"
      ". down .";
    gap: 5px;
    margin-top: 20px;
    user-select: none;
  }

  .d-pad-button {
    background-color: #333;
    color: white;
    border: 2px solid #555;
    border-radius: 8px;
    width: 50px;
    height: 50px;
    display: flex;
    justify-content: center;
    align-items: center;
    font-size: 24px;
    cursor: pointer;
    box-shadow: 0 2px 5px rgba(0,0,0,0.2);
  }
  .d-pad-button:hover {
    background-color: #444;
  }
  .d-pad-button:active {
    background-color: #222;
    transform: translateY(1px);
  }
  .up { grid-area: up; }
  .down { grid-area: down; }
  .left { grid-area: left; }
  .right { grid-area: right; }
  .middle { 
    grid-area: middle;
    background-color: transparent;
    border: none;
    box-shadow: none;
  }

  /* Animação de flutuar para Pinky (já existe em player-pinky, mas se precisar ajustar) */
  /* @keyframes floatPlayer { ... } */
  /* .animate-float-player { animation: floatPlayer 3s ease-in-out infinite; } */

  /* Estilos para Dots e Power Pellets */
  .cell {
    display: flex;
    justify-content: center;
    align-items: center;
  }
  .dot {
    width: 25%; /* Pequeno */
    height: 25%;
    border-radius: 50%;
    /* A cor será definida inline por Tailwind (bg-white) */
  }
  .power-pellet {
    width: 50%; /* Maior que o dot */
    height: 50%;
    border-radius: 50%;
    /* A cor será definida inline por Tailwind (bg-gray-300) e terá animate-pulse */
  }

`;

interface Position {
  x: number;
  y: number;
}

export interface GameOverReason {
  type: 'exit_reached' | 'caught_by_pacman';
}
interface PacManGameProps {
  onGameOver: (reason: GameOverReason) => void;
}

// console.log('PacManGame component mounted'); 

const PacManGame: React.FC<PacManGameProps> = ({ onGameOver }) => {
  const [grid, setGrid] = useState<number[][]>([]);
  const [playerPos, setPlayerPos] = useState<Position>({ x: 14, y: 15 }); 
  const [pacmanPos, setPacmanPos] = useState<Position>({ x: 14, y: 17 }); 
  const [playerDirection, setPlayerDirection] = useState<Position>(UP);
  const [pacmanDirection, setPacmanDirection] = useState<Position>(LEFT);
  const [gameActive, setGameActive] = useState(true);
  const [dotsRemaining, setDotsRemaining] = useState(0);
  const [showMovementTooltip, setShowMovementTooltip] = useState(false);
  const [hasPlayerMoved, setHasPlayerMoved] = useState(false);
  const [gameOverMessage, setGameOverMessage] = useState('');
  
  const gameLoopRef = useRef<number | null>(null);
  const lastFrameTimeRef = useRef(0);
  const keysPressed = useRef<Set<string>>(new Set());

  // Refs para estado lógico usado no loop
  const playerPosRef = useRef<Position>(playerPos);
  const playerDirectionRef = useRef<Position>(playerDirection);
  const pacmanPosRef = useRef<Position>(pacmanPos);
  const pacmanDirectionRef = useRef<Position>(pacmanDirection);
  const gridRef = useRef<number[][]>(grid);
  const gameActiveRef = useRef<boolean>(gameActive);
  const hasPlayerMovedRef = useRef<boolean>(hasPlayerMoved); // Ref for player movement status

  const outerGridWrapperRef = useRef<HTMLDivElement>(null);
  const gameGridContainerRef = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(1);

  const { playSound } = useAudioManager(); // Adicionado

  // Sincronizar refs com o estado
  useEffect(() => { playerPosRef.current = playerPos; }, [playerPos]);
  useEffect(() => { playerDirectionRef.current = playerDirection; }, [playerDirection]);
  useEffect(() => { pacmanPosRef.current = pacmanPos; }, [pacmanPos]);
  useEffect(() => { pacmanDirectionRef.current = pacmanDirection; }, [pacmanDirection]);
  useEffect(() => { gridRef.current = grid; }, [grid]);
  useEffect(() => { gameActiveRef.current = gameActive; }, [gameActive]);
  useEffect(() => { hasPlayerMovedRef.current = hasPlayerMoved; }, [hasPlayerMoved]);

  // Injetar estilos CSS específicos do jogo
  useEffect(() => {
    const styleSheet = document.createElement("style");
    styleSheet.type = "text/css";
    styleSheet.innerText = gameSpecificStyles;
    document.head.appendChild(styleSheet);
    return () => {
      document.head.removeChild(styleSheet);
    };
  }, []);

  useEffect(() => {
    console.log("[Init] Initializing game grid and listeners.");
    const initialGrid = createInitialGrid();
    setGrid(initialGrid); // Atualiza estado e ref via useEffect
    
    let dotCount = 0;
    initialGrid.forEach(row => row.forEach(cell => {
        if (cell === DOT || cell === POWER_PELLET) dotCount++;
    }));
    setDotsRemaining(dotCount);
    console.log(`[Init] Initial dots: ${dotCount}`);
    
    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    
    if (gameActiveRef.current) {
      startGameLoop();
    }
    
    return () => {
      console.log("[Cleanup] Removing event listeners and stopping game loop.");
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
      if (gameLoopRef.current) cancelAnimationFrame(gameLoopRef.current);
      gameLoopRef.current = null; // Explicitamente nulo ao desmontar
    };
  }, []); // Executa apenas uma vez na montagem
  
  useEffect(() => {
    if (!gameActiveRef.current) return; 

    if (gridRef.current.length > 0 && playerPosRef.current.y < gridRef.current.length && playerPosRef.current.x < gridRef.current[0].length) {
      if (gridRef.current[playerPosRef.current.y]?.[playerPosRef.current.x] === EXIT) {
        console.log("[Game Over] Pinky reached EXIT!");
        setGameActive(false);
        playSound({
          filePath: '/assets/sounds/portal_transition_sfx.mp3',
          loop: false,
          volume: 1.0
        });
        onGameOver({ type: 'exit_reached' });
      }
    }
  }, [playerPos, onGameOver]); // Depende do estado playerPos para checar a condição de saída

  useEffect(() => {
    const calculateScale = () => {
      if (outerGridWrapperRef.current && gameGridContainerRef.current) {
        const actualGameWidth = GRID_WIDTH * CELL_SIZE;
        const actualGameHeight = GRID_HEIGHT * CELL_SIZE;

        const wrapperWidth = outerGridWrapperRef.current.offsetWidth;
        const wrapperHeight = outerGridWrapperRef.current.offsetHeight;

        if (actualGameWidth === 0 || actualGameHeight === 0 || wrapperWidth === 0 || wrapperHeight === 0) {
            // Evita divisão por zero ou cálculo com dimensões não prontas
            setScale(1);
            return;
        }

        const scaleX = wrapperWidth / actualGameWidth;
        const scaleY = wrapperHeight / actualGameHeight;
        const newScale = Math.min(scaleX, scaleY, 1); // Não escalar além de 100%
        
        setScale(newScale);
      }
    };

    calculateScale(); // Calcula na montagem
    window.addEventListener('resize', calculateScale);
    return () => window.removeEventListener('resize', calculateScale);
  }, []); // Dependências vazias para rodar na montagem e adicionar/remover listener

  useEffect(() => {
    // Effect for tooltip visibility based on player movement
    if (!hasPlayerMovedRef.current) {
      const tooltipTimer = setTimeout(() => {
        if (!hasPlayerMovedRef.current) { // Double check if player hasn't moved
          setShowMovementTooltip(true);
        }
      }, 10000); // Show tooltip after 10 seconds of no action
      return () => clearTimeout(tooltipTimer); 
    } else {
      setShowMovementTooltip(false); // If player has already moved, ensure tooltip is hidden
    }
  }, [hasPlayerMoved]); // Depend on hasPlayerMoved state

  const createInitialGrid = () => {
    const mazeTemplate = [
      [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
      [1, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 1, 1, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 1],
      [1, 2, 1, 1, 1, 1, 2, 1, 1, 1, 1, 1, 2, 1, 1, 2, 1, 1, 1, 1, 1, 2, 1, 1, 1, 1, 2, 1],
      [1, 3, 1, 1, 1, 1, 2, 1, 1, 1, 1, 1, 2, 1, 1, 2, 1, 1, 1, 1, 1, 2, 1, 1, 1, 1, 3, 1],
      [1, 2, 1, 1, 1, 1, 2, 1, 1, 1, 1, 1, 2, 1, 1, 2, 1, 1, 1, 1, 1, 2, 1, 1, 1, 1, 2, 1],
      [1, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 1],
      [1, 2, 1, 1, 1, 1, 2, 1, 1, 2, 1, 1, 1, 1, 1, 1, 1, 1, 2, 1, 1, 2, 1, 1, 1, 1, 2, 1],
      [1, 2, 1, 1, 1, 1, 2, 1, 1, 2, 1, 1, 1, 1, 1, 1, 1, 1, 2, 1, 1, 2, 1, 1, 1, 1, 2, 1],
      [1, 2, 2, 2, 2, 2, 2, 1, 1, 2, 2, 2, 2, 1, 1, 2, 2, 2, 2, 1, 1, 2, 2, 2, 2, 2, 2, 1],
      [1, 1, 1, 1, 1, 1, 2, 1, 1, 1, 1, 1, 0, 1, 1, 0, 1, 1, 1, 1, 1, 2, 1, 1, 1, 1, 1, 1],
      [1, 1, 1, 1, 1, 1, 2, 1, 1, 1, 1, 1, 0, 1, 1, 0, 1, 1, 1, 1, 1, 2, 1, 1, 1, 1, 1, 1],
      [1, 1, 1, 1, 1, 1, 2, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 2, 1, 1, 1, 1, 1, 1],
      [1, 1, 1, 1, 1, 1, 2, 1, 1, 0, 1, 1, 1, 0, 0, 1, 1, 1, 0, 1, 1, 2, 1, 1, 1, 1, 1, 1],
      [1, 1, 1, 1, 1, 1, 2, 1, 1, 0, 1, 0, 0, 0, 0, 0, 0, 1, 0, 1, 1, 2, 1, 1, 1, 1, 1, 1],
      [0, 0, 0, 0, 0, 0, 2, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 2, 0, 0, 0, 0, 6, 0], 
      [1, 1, 1, 1, 1, 1, 2, 1, 1, 0, 1, 0, 0, 0, 0, 0, 0, 1, 0, 1, 1, 2, 1, 1, 1, 1, 1, 1],
      [1, 1, 1, 1, 1, 1, 2, 1, 1, 0, 1, 1, 1, 1, 1, 1, 1, 1, 0, 1, 1, 2, 1, 1, 1, 1, 1, 1],
      [1, 1, 1, 1, 1, 1, 2, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 2, 1, 1, 1, 1, 1, 1],
      [1, 1, 1, 1, 1, 1, 2, 1, 1, 0, 1, 1, 1, 1, 1, 1, 1, 1, 0, 1, 1, 2, 1, 1, 1, 1, 1, 1],
      [1, 1, 1, 1, 1, 1, 2, 1, 1, 0, 1, 1, 1, 1, 1, 1, 1, 1, 0, 1, 1, 2, 1, 1, 1, 1, 1, 1],
      [1, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 1, 1, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 1],
      [1, 2, 1, 1, 1, 1, 2, 1, 1, 1, 1, 1, 2, 1, 1, 2, 1, 1, 1, 1, 1, 2, 1, 1, 1, 1, 2, 1],
      [1, 2, 1, 1, 1, 1, 2, 1, 1, 1, 1, 1, 2, 1, 1, 2, 1, 1, 1, 1, 1, 2, 1, 1, 1, 1, 2, 1],
      [1, 3, 2, 2, 1, 1, 2, 2, 2, 2, 2, 2, 2, 0, 0, 2, 2, 2, 2, 2, 2, 2, 1, 1, 2, 2, 3, 1],
      [1, 1, 1, 2, 1, 1, 2, 1, 1, 2, 1, 1, 1, 1, 1, 1, 1, 1, 2, 1, 1, 2, 1, 1, 2, 1, 1, 1],
      [1, 1, 1, 2, 1, 1, 2, 1, 1, 2, 1, 1, 1, 1, 1, 1, 1, 1, 2, 1, 1, 2, 1, 1, 2, 1, 1, 1],
      [1, 2, 2, 2, 2, 2, 2, 1, 1, 2, 2, 2, 2, 1, 1, 2, 2, 2, 2, 1, 1, 2, 2, 2, 2, 2, 2, 1],
      [1, 2, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 2, 1, 1, 2, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 2, 1],
      [1, 2, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 2, 1, 1, 2, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 2, 1],
      [1, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 1],
      [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1]
    ];
    return mazeTemplate;
  };

  const handleKeyDown = (e: KeyboardEvent) => { 
    keysPressed.current.add(e.key); 
    updatePlayerDirectionFromInput(e.key); 
    if (!hasPlayerMovedRef.current) {
      setHasPlayerMoved(true); // State will be set, then useEffect for tooltip will hide it.
    }
  };
  const handleKeyUp = (e: KeyboardEvent) => { keysPressed.current.delete(e.key);};
  const handleControlClick = (directionKey: string) => { 
    updatePlayerDirectionFromInput(directionKey); 
    if (!hasPlayerMovedRef.current) {
      setHasPlayerMoved(true);
    }
  };

  const updatePlayerDirectionFromInput = (key: string) => {
    // console.log(`[Input] Key: ${key}`);
    let newDirection = playerDirectionRef.current; 
    switch (key) {
      case 'ArrowUp': newDirection = UP; break;
      case 'ArrowDown': newDirection = DOWN; break;
      case 'ArrowLeft': newDirection = LEFT; break;
      case 'ArrowRight': newDirection = RIGHT; break;
    }
    if (newDirection !== playerDirectionRef.current) {
        playerDirectionRef.current = newDirection;
        // Não definir estado aqui, o loop usará a ref
        // setPlayerDirection(newDirection); // Isso causava a definição de estado fora do fluxo principal do loop
        console.log(`[Direction Changed] Pinky playerDirectionRef set to:`, playerDirectionRef.current);
      }
  };
  
  const calculatePlayerNextPos = (): Position => {
    const currentPos = playerPosRef.current;
    const direction = playerDirectionRef.current;
    const currentGrid = gridRef.current;

    const nextPos = {
      x: currentPos.x + direction.x,
      y: currentPos.y + direction.y,
    };
    
    if (nextPos.x < 0 || nextPos.x >= GRID_WIDTH || nextPos.y < 0 || nextPos.y >= GRID_HEIGHT) {
      return currentPos; 
    }
    if (currentGrid.length > 0 && currentGrid[nextPos.y]?.[nextPos.x] === WALL) {
      return currentPos; 
    }
    return nextPos;
  };

  const calculatePacmanAIMove = (): { pos: Position; newGrid: number[][]; gridChanged: boolean; newDirection: Position } => {
    const currentPos = pacmanPosRef.current;
    const currentDir = pacmanDirectionRef.current;
    let localGrid = gridRef.current.map(arr => arr.slice()); // Clone para modificação local
    let gridChanged = false;
    let newDirection = currentDir;

    // IA Simplificada: Tentar avançar, se bater, escolher aleatoriamente uma direção válida.
    const directions = [UP, DOWN, LEFT, RIGHT];
    let potentialNextPos = { x: currentPos.x + currentDir.x, y: currentPos.y + currentDir.y };

    const isValid = (pos: Position) => 
        pos.x >= 0 && pos.x < GRID_WIDTH && 
        pos.y >= 0 && pos.y < GRID_HEIGHT && 
        localGrid[pos.y]?.[pos.x] !== WALL;

    if (!isValid(potentialNextPos)) {
        const availableDirs = directions.filter(dir => {
            const checkPos = { x: currentPos.x + dir.x, y: currentPos.y + dir.y };
            return isValid(checkPos);
        });
        if (availableDirs.length > 0) {
            newDirection = availableDirs[Math.floor(Math.random() * availableDirs.length)];
        } else {
            newDirection = currentDir; // Preso
        }
        potentialNextPos = { x: currentPos.x + newDirection.x, y: currentPos.y + newDirection.y };
    }
    
    let finalPos = isValid(potentialNextPos) ? potentialNextPos : currentPos;

    if (localGrid[finalPos.y]?.[finalPos.x] === DOT || localGrid[finalPos.y]?.[finalPos.x] === POWER_PELLET) {
        localGrid[finalPos.y][finalPos.x] = EMPTY;
        gridChanged = true;
    }
    // console.log(`[Pacman AI] Moving from ${JSON.stringify(currentPos)} to ${JSON.stringify(finalPos)} dir ${JSON.stringify(newDirection)}`);
    return { pos: finalPos, newGrid: localGrid, gridChanged, newDirection };
  };

  const checkCollisionInternal = () => {
    if (pacmanPosRef.current.x === playerPosRef.current.x && pacmanPosRef.current.y === playerPosRef.current.y) {
      console.log("[Collision] Pacman caught Pinky!");
      setGameActive(false);
      onGameOver({ type: 'caught_by_pacman' });
    }
  };

  const startGameLoop = () => {
    console.log("[Loop] startGameLoop called. gameActiveRef:", gameActiveRef.current);
    
    const gameTick = (currentTime: number) => {
      if (!gameActiveRef.current) { // Usa a ref para verificar se o jogo está ativo
        console.log("[Loop] Game not active (checked by ref), stopping animation frame.");
        if (gameLoopRef.current) cancelAnimationFrame(gameLoopRef.current);
        gameLoopRef.current = null;
        return;
      }

      const deltaTime = currentTime - lastFrameTimeRef.current;

      if (deltaTime >= GAME_SPEED) {
        lastFrameTimeRef.current = currentTime;
        // console.log(`[Loop] Tick!`);

        const newPlayerPos = calculatePlayerNextPos();
        const pacmanMoveResult = calculatePacmanAIMove();

        // Atualiza refs primeiro (se houver mudança)
        let playerMoved = false;
        if (newPlayerPos.x !== playerPosRef.current.x || newPlayerPos.y !== playerPosRef.current.y) {
            playerPosRef.current = newPlayerPos;
            playerMoved = true;
        }

        let pacmanMoved = false;
        if (pacmanMoveResult.pos.x !== pacmanPosRef.current.x || pacmanMoveResult.pos.y !== pacmanPosRef.current.y) {
            pacmanPosRef.current = pacmanMoveResult.pos;
            pacmanMoved = true;
        }
        if (pacmanDirectionRef.current !== pacmanMoveResult.newDirection) {
            pacmanDirectionRef.current = pacmanMoveResult.newDirection;
            // Não precisa de flag separada, setPacmanDirection resolverá
        }
        
        if (pacmanMoveResult.gridChanged) {
            gridRef.current = pacmanMoveResult.newGrid;
        }

        // Agora, propaga para o estado do React para re-renderização
        if (playerMoved) {
          // console.log("[State Update] Setting Player Pos:", newPlayerPos)
          setPlayerPos(newPlayerPos);
        }
        if (pacmanMoved) {
          // console.log("[State Update] Setting Pacman Pos:", pacmanMoveResult.pos)
          setPacmanPos(pacmanMoveResult.pos);
        }
        // Sempre atualiza a direção do pacman e o grid (se mudou) para o estado React
        setPacmanDirection(pacmanMoveResult.newDirection); 
        if (pacmanMoveResult.gridChanged) {
          // console.log("[State Update] Setting Grid")
          setGrid(pacmanMoveResult.newGrid);
          setDotsRemaining(prev => pacmanMoveResult.gridChanged ? prev - 1 : prev); // Simplesmente decrementa se mudou
        }
        
        checkCollisionInternal();
      }
      
      if (gameActiveRef.current) { // Agenda o próximo frame apenas se o jogo ainda estiver ativo
          gameLoopRef.current = requestAnimationFrame(gameTick);
      } else {
          console.log("[Loop] Game became inactive during tick, cleaning up animation frame.");
          if (gameLoopRef.current) cancelAnimationFrame(gameLoopRef.current);
          gameLoopRef.current = null;
      }
    };
    
    // Inicia o loop de jogo
    if (gameActiveRef.current) { // Checa de novo antes de iniciar
        lastFrameTimeRef.current = performance.now(); // Inicia o contador de tempo
        gameLoopRef.current = requestAnimationFrame(gameTick);
        console.log("[Loop] Initial requestAnimationFrame scheduled.");
    } else {
        console.log("[Loop] startGameLoop called, but gameActiveRef is false. Loop not started.");
    }
  };
  
  // Render game elements
  const renderCell = (cellType: number, rowIndex: number, colIndex: number) => {
    const key = `${rowIndex}-${colIndex}`;
    switch (cellType) {
      case WALL:
        return <div key={key} className="cell wall-cell bg-blue-700"></div>;
      case DOT:
        return <div key={key} className="cell dot-cell"><div className="dot bg-white"></div></div>;
      case POWER_PELLET:
        return <div key={key} className="cell power-pellet-cell"><div className="power-pellet bg-gray-300 animate-pulse"></div></div>;
      case EXIT:
        // Enhanced styling for the exit cell - removed custom animation class
        return <div key={key} className="cell exit-cell bg-purple-700 shadow-[0_0_15px_5px_rgba(192,132,252,0.8),_inset_0_0_8px_rgba(255,255,255,0.6)] flex items-center justify-center font-bold text-white text-xs">SAÍDA</div>;
      case EMPTY:
      default:
        return <div key={key} className="cell empty-cell"></div>;
    }
  };

  return (
    <>
      <style>{gameSpecificStyles}</style> {/* Injete os estilos CSS específicos do jogo */}
      <div 
        ref={outerGridWrapperRef} 
        className="pacman-grid-container relative flex flex-col items-center justify-center w-full h-full pb-16" /* Adicionado pb-16 */
      >
        <div 
          ref={gameGridContainerRef}
          className="game-grid bg-black border-4 border-blue-900 shadow-2xl transition-transform duration-300 ease-out"
          style={{
            display: 'grid',
            gridTemplateColumns: `repeat(${GRID_WIDTH}, ${CELL_SIZE}px)`,
            gridTemplateRows: `repeat(${GRID_HEIGHT}, ${CELL_SIZE}px)`,
            width: GRID_WIDTH * CELL_SIZE,
            height: GRID_HEIGHT * CELL_SIZE,
            transform: `scale(${scale})`,
            transformOrigin: 'center center',
            imageRendering: 'pixelated'
          }}
        >
          {grid.map((row, rowIndex) => 
            row.map((cell, colIndex) => renderCell(cell, rowIndex, colIndex))
          )}
          {/* Player (Pinky) - Nova Estrutura CSS */}
          <div 
            className="absolute animate-float-player"
            style={{
              left: playerPos.x * CELL_SIZE,
              top: playerPos.y * CELL_SIZE,
              width: CELL_SIZE,
              height: CELL_SIZE,
              transition: 'left 0.1s linear, top 0.1s linear', 
              zIndex: 10,
              display: 'flex', 
              justifyContent: 'center',
              alignItems: 'center'
            }}
          >
            <div className="ghost pinky"> 
              <div className="eyes">
                <div className="eye leftEye">
                  <div className="iris" style={{
                    //@ts-ignore
                    '--pupil-offset-x': playerDirectionRef.current === LEFT ? '-15%' : playerDirectionRef.current === RIGHT ? '15%' : '0%',
                    //@ts-ignore
                    '--pupil-offset-y': playerDirectionRef.current === UP ? '-15%' : playerDirectionRef.current === DOWN ? '15%' : '0%'
                  }}></div>
                </div>
                <div className="eye rightEye">
                  <div className="iris" style={{
                    //@ts-ignore
                    '--pupil-offset-x': playerDirectionRef.current === LEFT ? '-15%' : playerDirectionRef.current === RIGHT ? '15%' : '0%',
                    //@ts-ignore
                    '--pupil-offset-y': playerDirectionRef.current === UP ? '-15%' : playerDirectionRef.current === DOWN ? '15%' : '0%'
                  }}></div>
                </div>
              </div>
              <div className="ghostTail"></div>
            </div>
          </div>
          
          {/* Pacman (IA) */}
          <div 
            className="absolute"
            style={{
              left: pacmanPos.x * CELL_SIZE,
              top: pacmanPos.y * CELL_SIZE,
              width: CELL_SIZE,
              height: CELL_SIZE,
              transition: 'left 0.1s linear, top 0.1s linear',
              zIndex: 9,
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center'
            }}
          >
            <div 
              className="pacman"
              style={{ 
                transform: `rotate(${
                  pacmanDirection === RIGHT ? '0deg' :
                  pacmanDirection === DOWN ? '90deg' :
                  pacmanDirection === LEFT ? '180deg' :
                  pacmanDirection === UP ? '270deg' : '0deg'
                })`,
                transformOrigin: 'center center'
              }}
            >
              <div className="pacman__eye"></div>
              <div className="pacman__mouth"></div> 
            </div>
          </div>
        </div>

        {/* Game Over Message */}
        {gameOverMessage && (
          <div className="absolute inset-0 bg-black bg-opacity-75 flex flex-col items-center justify-center z-20">
            <p className="text-2xl font-pixel text-white mb-4">{gameOverMessage}</p>
            {/* Não há botão de tentar novamente, o onGameOver é chamado e a cena externa decide */} 
          </div>
        )}

        {/* D-Pad Controls */}
        {gameOverMessage === '' && (
            <DPad 
                onDirectionClick={handleControlClick} 
                className="fixed bottom-8 left-1/2 transform -translate-x-1/2 z-10 select-none"
            />
        )}

        {showMovementTooltip && (
          <div className="absolute bottom-[-40px] left-1/2 -translate-x-1/2 p-2 bg-gray-700 bg-opacity-90 text-gray-200 text-xs font-pixel rounded-md shadow-lg z-20 whitespace-nowrap">
            Use as setas para mover Pinky
          </div>
        )}
      </div>
    </>
  );
};

export default PacManGame;