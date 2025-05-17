import React, { useState, useEffect, useRef } from 'react';

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

console.log('PacManGame component mounted'); 

const PacManGame: React.FC<PacManGameProps> = ({ onGameOver }) => {
  const [grid, setGrid] = useState<number[][]>([]);
  const [playerPos, setPlayerPos] = useState<Position>({ x: 14, y: 23 }); 
  const [pacmanPos, setPacmanPos] = useState<Position>({ x: 14, y: 17 }); 
  const [playerDirection, setPlayerDirection] = useState<Position>(UP);
  const [pacmanDirection, setPacmanDirection] = useState<Position>(LEFT);
  const [gameActive, setGameActive] = useState(true);
  const [dotsRemaining, setDotsRemaining] = useState(0);
  
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

  // Sincronizar refs com o estado
  useEffect(() => { playerPosRef.current = playerPos; }, [playerPos]);
  useEffect(() => { playerDirectionRef.current = playerDirection; }, [playerDirection]);
  useEffect(() => { pacmanPosRef.current = pacmanPos; }, [pacmanPos]);
  useEffect(() => { pacmanDirectionRef.current = pacmanDirection; }, [pacmanDirection]);
  useEffect(() => { gridRef.current = grid; }, [grid]);
  useEffect(() => { gameActiveRef.current = gameActive; }, [gameActive]);


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
    
    // Iniciar o loop de jogo usando a ref gameActiveRef
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
        onGameOver({ type: 'exit_reached' });
    }
    }
  }, [playerPos, onGameOver]); // Depende do estado playerPos para checar a condição de saída


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

  const handleKeyDown = (e: KeyboardEvent) => { keysPressed.current.add(e.key); updatePlayerDirectionFromInput(e.key); };
  const handleKeyUp = (e: KeyboardEvent) => { keysPressed.current.delete(e.key);};
  const handleControlClick = (directionKey: string) => { updatePlayerDirectionFromInput(directionKey); };

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
    // Render Pac-Man
    if (pacmanPos.x === colIndex && pacmanPos.y === rowIndex) {
      let mouthRotation = '0deg';
      if (pacmanDirection.x === 1) mouthRotation = '0deg'; 
      else if (pacmanDirection.x === -1) mouthRotation = '180deg'; 
      else if (pacmanDirection.y === -1) mouthRotation = '270deg'; 
      else if (pacmanDirection.y === 1) mouthRotation = '90deg'; 

      return (
        <div 
          key={`${rowIndex}-${colIndex}-pacman-container`} 
          className="absolute flex items-center justify-center"
          style={{ 
            width: CELL_SIZE, height: CELL_SIZE, 
            left: colIndex * CELL_SIZE, top: rowIndex * CELL_SIZE,
            zIndex: 10
          }}
        >
          <div 
            className="relative pacman-body"
            style={{
              width: '100%', height: '100%', 
              backgroundColor: '#FFFF00', 
              borderRadius: '50%',
              overflow: 'hidden' 
            }}
          >
            <div 
              className="absolute pacman-mouth"
              style={{
                width: 0, height: 0, 
                borderRight: `${CELL_SIZE / 2}px solid #000`, 
                borderTop: `${CELL_SIZE / 2}px solid transparent`,
                borderBottom: `${CELL_SIZE / 2}px solid transparent`,
                left: '50%', top: '0',     
                transformOrigin: '0% 50%', 
                transform: `rotate(${mouthRotation})`, // Simplificado o transform da boca
              }}
            />
          </div>
        </div>
      );
    }
    
    // Render player (Pinky)
    if (playerPos.x === colIndex && playerPos.y === rowIndex) {
      return (
        <div 
          key={`${rowIndex}-${colIndex}-player`} 
          className="absolute ghost-player flex items-center justify-center"
          style={{ 
            width: CELL_SIZE, height: CELL_SIZE, 
            left: colIndex * CELL_SIZE, top: rowIndex * CELL_SIZE,
            zIndex: 10
          }}
        >
            <img 
              src="assets/images/pinky-character.png" 
              alt="Pinky" 
              className="w-full h-full pixelated-image" 
              style={{ objectFit: 'contain' }} 
            />
        </div>
      );
    }
    
    switch (cellType) {
      case WALL:
        return ( <div key={`${rowIndex}-${colIndex}-wall`} className="absolute" style={{ width: CELL_SIZE, height: CELL_SIZE, left: colIndex * CELL_SIZE, top: rowIndex * CELL_SIZE, backgroundColor: '#00FFFF' }} /> );
      case DOT:
        return ( <div key={`${rowIndex}-${colIndex}-dot`} className="absolute flex items-center justify-center" style={{ width: CELL_SIZE, height: CELL_SIZE, left: colIndex * CELL_SIZE, top: rowIndex * CELL_SIZE }} > <div className="rounded-full bg-white" style={{ width: 4, height: 4 }}></div> </div> );
      case POWER_PELLET:
        return ( <div key={`${rowIndex}-${colIndex}-pp`} className="absolute flex items-center justify-center" style={{ width: CELL_SIZE, height: CELL_SIZE, left: colIndex * CELL_SIZE, top: rowIndex * CELL_SIZE }} > <div className="rounded-full bg-white animate-pulse" style={{ width: 8, height: 8 }}></div> </div> );
      case EXIT:
        return ( <div key={`${rowIndex}-${colIndex}-exit`} className="absolute" style={{ width: CELL_SIZE, height: CELL_SIZE, left: colIndex * CELL_SIZE, top: rowIndex * CELL_SIZE, backgroundColor: 'rgba(255, 0, 255, 0.2)', boxShadow: '0 0 10px #FF00FF, 0 0 20px #FF00FF, 0 0 30px #FF00FF', animation: 'pulse-neon 2s infinite' }} /> );
      default: // EMPTY
        return ( <div key={`${rowIndex}-${colIndex}-empty`} className="absolute" style={{ width: CELL_SIZE, height: CELL_SIZE, left: colIndex * CELL_SIZE, top: rowIndex * CELL_SIZE}} /> );
    }
  };

  return (
    <div className="flex flex-col items-center justify-center w-full">
      <div 
        className="relative bg-black border-2 border-arcade-blue"
        style={{ 
          width: GRID_WIDTH * CELL_SIZE, 
          height: GRID_HEIGHT * CELL_SIZE,
          maxWidth: '90vw',
          maxHeight: '70vh',
          overflow: 'hidden' // Mantido para o container do grid
        }}
      >
        {grid.map((row, rowIndex) => ( // Renderização usa o ESTADO 'grid'
          row.map((cell, colIndex) => renderCell(cell, rowIndex, colIndex))
        ))}
      </div>

      {/* On-screen controls */}
      <div className="mt-6 flex justify-center items-center w-full select-none" style={{ touchAction: 'manipulation' }}>
        <div className="grid grid-cols-3 grid-rows-3 gap-1 w-36 h-36 md:w-48 md:h-48">
          {/* Up Button: Row 1, Column 2 */}
          <div className="row-start-1 col-start-2 flex items-center justify-center">
            <button className="pixel-control-button bg-arcade-blue/30 active:bg-arcade-blue/50 hover:bg-arcade-blue/40 w-full h-full flex items-center justify-center" onClick={() => handleControlClick('ArrowUp')} aria-label="Mover para Cima" >
              {/* Seta para Cima */}
              <div style={{ width: 0, height: 0, borderLeft: '10px solid transparent', borderRight: '10px solid transparent', borderBottom: '15px solid white' }}></div>
        </button>
          </div>

          {/* Left Button: Row 2, Column 1 */}
          <div className="row-start-2 col-start-1 flex items-center justify-center">
            <button className="pixel-control-button bg-arcade-blue/30 active:bg-arcade-blue/50 hover:bg-arcade-blue/40 w-full h-full flex items-center justify-center" onClick={() => handleControlClick('ArrowLeft')} aria-label="Mover para Esquerda" >
              {/* Seta para Esquerda */}
              <div style={{ width: 0, height: 0, borderTop: '10px solid transparent', borderBottom: '10px solid transparent', borderRight: '15px solid white' }}></div>
        </button>
          </div>
          
          {/* Empty Center Cell: Row 2, Column 2 */}
          <div className="row-start-2 col-start-2"></div>

          {/* Right Button: Row 2, Column 3 */}
          <div className="row-start-2 col-start-3 flex items-center justify-center">
            <button className="pixel-control-button bg-arcade-blue/30 active:bg-arcade-blue/50 hover:bg-arcade-blue/40 w-full h-full flex items-center justify-center" onClick={() => handleControlClick('ArrowRight')} aria-label="Mover para Direita" >
              {/* Seta para Direita */}
              <div style={{ width: 0, height: 0, borderTop: '10px solid transparent', borderBottom: '10px solid transparent', borderLeft: '15px solid white' }}></div>
        </button>
          </div>

          {/* Down Button: Row 3, Column 2 */}
          <div className="row-start-3 col-start-2 flex items-center justify-center">
            <button className="pixel-control-button bg-arcade-blue/30 active:bg-arcade-blue/50 hover:bg-arcade-blue/40 w-full h-full flex items-center justify-center" onClick={() => handleControlClick('ArrowDown')} aria-label="Mover para Baixo" >
              {/* Seta para Baixo */}
              <div style={{ width: 0, height: 0, borderLeft: '10px solid transparent', borderRight: '10px solid transparent', borderTop: '15px solid white' }}></div>
        </button>
          </div>
        </div>
      </div>
      
      {!gameActive && ( // Usa o ESTADO gameActive para mostrar overlay
        <div className="absolute inset-0 bg-black bg-opacity-70 flex items-center justify-center z-20">
          <div className="text-center text-white font-pixel p-8">
            <h2 className="text-2xl mb-4">FIM DE JOGO</h2>
          </div>
        </div>
      )}
    </div>
  );
};

export default PacManGame;