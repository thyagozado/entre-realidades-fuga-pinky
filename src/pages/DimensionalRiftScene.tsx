import React, { useEffect, useRef } from 'react';

// Constantes de Configuração
const TOTAL_DURATION_MS = 6000;
const CLEAR_ALPHA = 0.08; // Mais rastro

// Partículas Principais
const PARTICLE_COUNT = 180; // Um pouco mais
const PARTICLE_SPEED_MULTIPLIER = 3.8; 
const PARTICLE_SIZE = 2.5;

// Grade de Losangos Dinâmicos
const GRID_RADIAL_LINES = 12; // Menos linhas radiais para não poluir tanto
const GRID_MAX_CONCENTRIC_RECTS = 12;
const GRID_RECT_SPAWN_INTERVAL = 8;
const GRID_SPEED = 2.2; // Mais rápido
const GRID_INITIAL_RECT_SIZE = 15;
const GRID_LINE_HUE_SPEED = 0.6;
const GRID_ROTATION_SPEED = 0.008; // Mais rotação
const GRID_SCALE_PULSE_AMOUNT = 0.18; // Mais pulsação
const GRID_SCALE_PULSE_SPEED = 0.06;
const RADIAL_LINE_OSCILLATION_AMOUNT = 0.04;
const RADIAL_LINE_OSCILLATION_SPEED = 0.04;

// Ruído Geral
const NOISE_PARTICLE_COUNT = 150;
const NOISE_MAX_SIZE = 2.5;
const NOISE_MIN_ALPHA = 0.03;
const NOISE_MAX_ALPHA = 0.15;

// Glitches nas Bordas
const GLITCH_EVENT_CHANCE = 0.25; 
const GLITCHES_PER_EVENT_MIN = 2;
const GLITCHES_PER_EVENT_MAX = 7; // Mais glitches menores
const GLITCH_MIN_DURATION_FRAMES = 2;
const GLITCH_MAX_DURATION_FRAMES = 6;
const GLITCH_MAX_WIDTH_PIXELS = 80; // Tamanhos em pixels para mais controle
const GLITCH_MAX_HEIGHT_PIXELS = 30;
const GLITCH_COLOR_HUES = [300, 180, 60, 240, 0, 120]; // Adicionado vermelho e verde

// Animação do Pinky
const PINKY_FADE_IN_DURATION_MS = 600;
const PINKY_SHRINK_DURATION_MS = 2200; 
const PINKY_FADE_OUT_START_OFFSET_MS = 400; // Começa a desaparecer 400ms antes do shrink terminar
const PINKY_INITIAL_SCALE_FACTOR_OF_HEIGHT = 0.75; 
const PINKY_FINAL_SCALE_FACTOR_OF_HEIGHT = 0.005;  
const PINKY_IMAGE_SRC = '/assets/images/pinky-character.png';

// Nova Malha de Fundo (Tipo Fluxo de Consciência)
const BG_GRID_LINES_COUNT = 10; // Número de linhas em cada direção
const BG_GRID_MAX_ALPHA = 0.15;
const BG_GRID_LINE_WIDTH = 1.5;
const BG_GRID_PERSPECTIVE_STRENGTH = 0.0005; // Quão rápido as linhas convergem/divergem

interface DimensionalRiftSceneProps { onTransitionComplete: () => void; }
interface Particle { x: number; y: number; angle: number; speed: number; colorHue: number; size: number; isWhite: boolean; baseLightness: number;}
interface ConcentricRect { scale: number; opacity: number; hue: number; baseRotation: number; }
interface ActiveGlitch { x: number; y: number; width: number; height: number; color: string; remainingFrames: number; }

const DimensionalRiftScene: React.FC<DimensionalRiftSceneProps> = ({ onTransitionComplete }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationFrameIdRef = useRef<number | null>(null);
  const particlesRef = useRef<Particle[]>([]); 
  const concentricRectsRef = useRef<ConcentricRect[]>([]);
  const activeGlitchesRef = useRef<ActiveGlitch[]>([]);
  const frameCountRef = useRef(0);
  const startTimeRef = useRef<number>(0);
  const pinkyImageRef = useRef<HTMLImageElement | null>(null);
  const isPinkyImageLoadedRef = useRef<boolean>(false);

  useEffect(() => {
    const canvas = canvasRef.current; if (!canvas) return;
    const ctx = canvas.getContext('2d'); if (!ctx) return;
    canvas.width = window.innerWidth; canvas.height = window.innerHeight;
    startTimeRef.current = performance.now();

    if (!pinkyImageRef.current && !isPinkyImageLoadedRef.current) {
        const img = new Image();
        img.onload = () => { pinkyImageRef.current = img; isPinkyImageLoadedRef.current = true; };
        img.onerror = () => { console.error("Failed to load Pinky image"); };
        img.src = PINKY_IMAGE_SRC;
    }

    if (particlesRef.current.length === 0) {
        for (let i = 0; i < PARTICLE_COUNT; i++) {
            const isWhite = Math.random() < 0.5;
            particlesRef.current.push({
              x: canvas.width / 2, y: canvas.height / 2,
              angle: Math.random() * Math.PI * 2,
              speed: Math.random() * PARTICLE_SPEED_MULTIPLIER + 1.0, // Velocidade base aumentada
              colorHue: Math.random() * 360,
              size: Math.random() * PARTICLE_SIZE + 1,
              isWhite: isWhite,
              baseLightness: isWhite ? Math.random() * 30 + 70 : 75, // 70-100% para branco, 75% para colorido
            });
        }
    }

    const renderBackgroundGrid = (currentFrame: number) => {
        const centerX = canvas.width / 2;
        const centerY = canvas.height / 2;
        const timeFactor = currentFrame * BG_GRID_PERSPECTIVE_STRENGTH;

        ctx.lineWidth = BG_GRID_LINE_WIDTH;
        const numLines = BG_GRID_LINES_COUNT;
        const baseHue = (currentFrame * 0.1) % 360;

        for (let i = 0; i <= numLines; i++) {
            const progress = i / numLines;
            const perspectiveOffset = Math.pow(progress, 2) * canvas.width * timeFactor;
            
            const currentHue = (baseHue + progress * 30) % 360;
            const alpha = BG_GRID_MAX_ALPHA * (1 - progress) * 0.7; // Mais transparente nas bordas
            ctx.strokeStyle = `hsla(${currentHue}, 60%, 40%, ${alpha})`;

            // Linhas Horizontais (movendo de/para o centro Y)
            const yPos = centerY + (progress * canvas.height/2) - perspectiveOffset;
            const yNeg = centerY - (progress * canvas.height/2) + perspectiveOffset;
            ctx.beginPath(); ctx.moveTo(0, yPos); ctx.lineTo(canvas.width, yPos); ctx.stroke();
            ctx.beginPath(); ctx.moveTo(0, yNeg); ctx.lineTo(canvas.width, yNeg); ctx.stroke();

            // Linhas Verticais (movendo de/para o centro X)
            const xPos = centerX + (progress * canvas.width/2) - perspectiveOffset;
            const xNeg = centerX - (progress * canvas.width/2) + perspectiveOffset;
            ctx.beginPath(); ctx.moveTo(xPos, 0); ctx.lineTo(xPos, canvas.height); ctx.stroke();
            ctx.beginPath(); ctx.moveTo(xNeg, 0); ctx.lineTo(xNeg, canvas.height); ctx.stroke();
        }
    };

    const renderGrid = (currentFrame: number) => {
        const centerX = canvas.width / 2;
        const centerY = canvas.height / 2;
        ctx.lineWidth = 1;
        for (let i = 0; i < GRID_RADIAL_LINES; i++) {
            const baseAngle = (i / GRID_RADIAL_LINES) * Math.PI * 2;
            const angleOffset = Math.sin(currentFrame * RADIAL_LINE_OSCILLATION_SPEED + i * 0.5) * RADIAL_LINE_OSCILLATION_AMOUNT;
            const angle = baseAngle + angleOffset + (currentFrame * 0.0008); // Rotação geral da grade radial
            const hue = (currentFrame * GRID_LINE_HUE_SPEED + i * (360 / GRID_RADIAL_LINES)) % 360;
            ctx.strokeStyle = `hsla(${hue}, 100%, 60%, 0.15)`; // Mais sutis
            ctx.beginPath(); ctx.moveTo(centerX, centerY);
            ctx.lineTo(centerX + Math.cos(angle) * canvas.width * 0.8, centerY + Math.sin(angle) * canvas.height * 0.8); // Não tão longas
            ctx.stroke();
        }
        if (currentFrame % GRID_RECT_SPAWN_INTERVAL === 0 && concentricRectsRef.current.length < GRID_MAX_CONCENTRIC_RECTS) {
            concentricRectsRef.current.push({ scale: GRID_INITIAL_RECT_SIZE, opacity: 1, hue: (currentFrame * 2.5) % 360, baseRotation: (Math.random() - 0.5) * Math.PI / 3 });
        }
        concentricRectsRef.current = concentricRectsRef.current.filter(rect => rect.opacity > 0.005 && rect.scale < Math.max(canvas.width, canvas.height) * 1.2);
        concentricRectsRef.current.forEach(rect => {
            rect.scale += GRID_SPEED * (1 + rect.scale / (canvas.width*0.5)); // Acelerar à medida que crescem
            rect.opacity -= 0.007;
            rect.hue = (rect.hue + GRID_LINE_HUE_SPEED * 2) % 360;
            const pulse = Math.sin(currentFrame * GRID_SCALE_PULSE_SPEED + rect.scale * 0.05) * GRID_SCALE_PULSE_AMOUNT * (1 + rect.opacity);
            const currentScale = rect.scale * (1 + pulse);
            const size = currentScale;
            const rotation = rect.baseRotation + currentFrame * GRID_ROTATION_SPEED * (rect.hue / 180) + Math.PI / 4;            
            ctx.save(); ctx.translate(centerX, centerY); ctx.rotate(rotation);
            ctx.strokeStyle = `hsla(${rect.hue}, 90%, 75%, ${rect.opacity * 0.7})`; 
            ctx.lineWidth = Math.max(1, 4 * rect.opacity * (size / canvas.width + 0.2));
            ctx.beginPath(); ctx.moveTo(-size / 2, -size / 2); ctx.lineTo(size / 2, -size / 2); ctx.lineTo(size / 2, size / 2); ctx.lineTo(-size / 2, size / 2); ctx.closePath(); ctx.stroke();
            ctx.restore();
        });
    };
    const renderParticles_logic = () => {
        particlesRef.current.forEach(p => {
            p.x += Math.cos(p.angle) * p.speed * (1 + p.y / canvas.height); // Acelerar um pouco com a distância Y
            p.y += Math.sin(p.angle) * p.speed * (1 + p.x / canvas.width);
            p.colorHue = (p.colorHue + 1.5) % 360;
            if (p.x < -50 || p.x > canvas.width + 50 || p.y < -50 || p.y > canvas.height + 50) {
                p.x = canvas.width / 2; p.y = canvas.height / 2;
                p.angle = Math.random() * Math.PI * 2; p.speed = Math.random() * PARTICLE_SPEED_MULTIPLIER + 1.0;
                p.isWhite = Math.random() < 0.5;
                p.baseLightness = p.isWhite ? Math.random() * 30 + 70 : 75;
            }
            if (p.isWhite) {
                ctx.fillStyle = `hsl(0, 0%, ${p.baseLightness}%)`;
            } else {
                ctx.fillStyle = `hsl(${p.colorHue}, 70%, ${p.baseLightness}%)`;
            }
            ctx.globalAlpha = Math.random() * 0.3 + 0.5; // Variar alpha das partículas
            ctx.fillRect(p.x - p.size / 2, p.y - p.size / 2, p.size, p.size);
            ctx.globalAlpha = 1.0; // Resetar alpha global
        });
    };
    const renderNoise = (currentFrame: number) => {
        for (let i = 0; i < NOISE_PARTICLE_COUNT; i++) {
            const x = Math.random() * canvas.width; const y = Math.random() * canvas.height;
            const size = Math.random() * NOISE_MAX_SIZE;
            const alpha = Math.random() * (NOISE_MAX_ALPHA - NOISE_MIN_ALPHA) + NOISE_MIN_ALPHA;
            const grayscale = Math.floor(Math.random() * 100 + 155);
            ctx.fillStyle = `rgba(${grayscale}, ${grayscale}, ${grayscale}, ${alpha})`;
            ctx.fillRect(x, y, size, size);
        }
    };
    const renderEdgeGlitches = (currentFrame: number) => {
        activeGlitchesRef.current = activeGlitchesRef.current.filter(glitch => {
            ctx.fillStyle = glitch.color; ctx.fillRect(glitch.x, glitch.y, glitch.width, glitch.height);
            glitch.remainingFrames--; return glitch.remainingFrames > 0;
        });
        if (Math.random() < GLITCH_EVENT_CHANCE) {
            const numGlitchesToSpawn = Math.floor(Math.random() * (GLITCHES_PER_EVENT_MAX - GLITCHES_PER_EVENT_MIN + 1)) + GLITCHES_PER_EVENT_MIN;
            for (let i = 0; i < numGlitchesToSpawn; i++) {
                const isHorizontal = Math.random() < 0.5;
                const glitchWidth = Math.random() * GLITCH_MAX_WIDTH_PIXELS * (isHorizontal ? 1 : 0.5) + 5;
                const glitchHeight = Math.random() * GLITCH_MAX_HEIGHT_PIXELS * (isHorizontal ? 0.5 : 1) + 5;
                const edge = Math.floor(Math.random() * 4); let x, y;
                const invasionFactor = 0.2; // Quanto o glitch pode "invadir" a tela
                switch (edge) {
                    case 0: x = Math.random() * (canvas.width - glitchWidth); y = Math.random() * glitchHeight * (1 - invasionFactor) - glitchHeight * (invasionFactor/2) ; break;
                    case 1: x = Math.random() * (canvas.width - glitchWidth); y = canvas.height - glitchHeight * (1 - Math.random() * invasionFactor) ; break;
                    case 2: x = Math.random() * glitchWidth * (1 - invasionFactor) - glitchWidth * (invasionFactor/2); y = Math.random() * (canvas.height - glitchHeight); break;
                    default: x = canvas.width - glitchWidth * (1 - Math.random() * invasionFactor); y = Math.random() * (canvas.height - glitchHeight); break;
                }
                const colorHue = GLITCH_COLOR_HUES[Math.floor(Math.random() * GLITCH_COLOR_HUES.length)];
                const glitchColor = `hsla(${colorHue}, 100%, ${Math.random()*30 + 50}%, ${Math.random()*0.4 + 0.5})`; // Cor e alpha mais variados
                const duration = Math.floor(Math.random() * (GLITCH_MAX_DURATION_FRAMES - GLITCH_MIN_DURATION_FRAMES + 1)) + GLITCH_MIN_DURATION_FRAMES;
                activeGlitchesRef.current.push({ x, y, width: glitchWidth, height: glitchHeight, color: glitchColor, remainingFrames: duration });
            }
        }
    };
    const renderPinkyAnimation = (currentElapsedTimeMs: number) => {
        if (!isPinkyImageLoadedRef.current || !pinkyImageRef.current) return;
        const img = pinkyImageRef.current; const pinkyAspectRatio = img.width / img.height;
        const fadeInProgress = Math.min(1, currentElapsedTimeMs / PINKY_FADE_IN_DURATION_MS);
        const shrinkEndTime = PINKY_SHRINK_DURATION_MS;
        const fadeOutStartTime = shrinkEndTime - PINKY_FADE_OUT_START_OFFSET_MS;
        const shrinkProgress = Math.min(1, currentElapsedTimeMs / shrinkEndTime);
        let fadeOutProgress = 1;
        if (currentElapsedTimeMs > fadeOutStartTime) {
            fadeOutProgress = Math.max(0, 1 - (currentElapsedTimeMs - fadeOutStartTime) / (shrinkEndTime - fadeOutStartTime + PINKY_FADE_OUT_START_OFFSET_MS));
        }
        const currentBaseHeight = PINKY_INITIAL_SCALE_FACTOR_OF_HEIGHT * canvas.height - (PINKY_INITIAL_SCALE_FACTOR_OF_HEIGHT * canvas.height - PINKY_FINAL_SCALE_FACTOR_OF_HEIGHT * canvas.height) * shrinkProgress;
        const pinkyDisplayHeight = Math.max(0, currentBaseHeight); const pinkyDisplayWidth = pinkyDisplayHeight * pinkyAspectRatio;
        const centerX = canvas.width / 2; const centerY = canvas.height / 2;
        ctx.save();
        ctx.globalAlpha = fadeInProgress * fadeOutProgress;
        ctx.imageSmoothingEnabled = false;
        if (pinkyDisplayHeight > 0 && pinkyDisplayWidth > 0) {
             ctx.drawImage(img, centerX - pinkyDisplayWidth / 2, centerY - pinkyDisplayHeight / 2, pinkyDisplayWidth, pinkyDisplayHeight);
        }
        ctx.restore();
    };

    const renderLoop = () => {
      frameCountRef.current++; const currentElapsedTimeMs = performance.now() - startTimeRef.current;
      ctx.fillStyle = `rgba(0, 0, 0, ${CLEAR_ALPHA})`; ctx.fillRect(0, 0, canvas.width, canvas.height);
      renderBackgroundGrid(frameCountRef.current); // Nova malha de fundo PRIMEIRO
      renderGrid(frameCountRef.current);
      renderPinkyAnimation(currentElapsedTimeMs);
      renderParticles_logic(); 
      renderNoise(frameCountRef.current);
      renderEdgeGlitches(frameCountRef.current);
      if (currentElapsedTimeMs < TOTAL_DURATION_MS) { animationFrameIdRef.current = requestAnimationFrame(renderLoop); }
      else { if (onTransitionComplete) { animationFrameIdRef.current = null; onTransitionComplete();} }
    };
    renderLoop();
    const transitionTimer = setTimeout(() => { if (animationFrameIdRef.current !== null && onTransitionComplete) { /*onTransitionComplete();*/ } }, TOTAL_DURATION_MS + 200);
    return () => { if (animationFrameIdRef.current) cancelAnimationFrame(animationFrameIdRef.current); clearTimeout(transitionTimer); animationFrameIdRef.current = null; };
  }, [onTransitionComplete]);

  return <canvas ref={canvasRef} style={{ display: 'block', background: '#000' }} aria-label="Animação de transição dimensional" />;
};
export default DimensionalRiftScene; 