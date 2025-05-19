import React, { useEffect, useRef } from 'react';
import useAudioManager from '../hooks/useAudioManager';

interface PortalTransitionSceneProps {
  onComplete: () => void;
}

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  color: string;
  size: number;
  life: number;
}

const MAX_PARTICLES = 200; // Reduced a bit to make space for mesh
const PARTICLE_SPAWN_RATE = 1;
const PARTICLE_BASE_SIZE = 2;
const PARTICLE_SPEED_MULTIPLIER = 4.5;

// Grid properties
const NUM_RADIAL_LINES = 16; // Number of lines radiating from the center
const NUM_CONCENTRIC_LINES = 10; // Number of "depth" lines
const GRID_MAX_DEPTH_FACTOR = 0.02; // How close the farthest grid lines appear to the center initially (smaller means farther)
const GRID_SPEED = 0.005; // How fast the grid appears to move towards the viewer
const GRID_LINE_WIDTH = 1.5;

// Noise properties
const NOISE_PARTICLE_COUNT = 50; // Number of noise speckles per frame
const NOISE_PARTICLE_SIZE = 1.5;

// Glitch properties
const GLITCH_EVENT_CHANCE = 0.2; // Increased: 20% chance per frame for a glitch EVENT
const GLITCHES_PER_EVENT_MIN = 1;
const GLITCHES_PER_EVENT_MAX = 4; // Spawn 1 to 4 small glitches per event
const GLITCH_MAX_DURATION = 8; // Slightly reduced max duration for faster feel
const GLITCH_MIN_WIDTH = 5;
const GLITCH_MAX_WIDTH = 80; // Reduced max width for smaller glitches
const GLITCH_MIN_HEIGHT = 2;
const GLITCH_MAX_HEIGHT = 20; // Reduced max height

// Pinky Animation Properties
const PINKY_ANIMATION_DURATION_SECONDS = 2.5; 
const PINKY_FADE_IN_DURATION_SECONDS = 0.75;
const PINKY_INITIAL_SCALE_FACTOR = 0.7; // Starts at 70% of screen height
const PINKY_FINAL_SCALE_FACTOR = 0.01;

interface ActiveGlitch {
  x: number;
  y: number;
  width: number;
  height: number;
  color: string;
  duration: number; // Frames remaining for this glitch
}

let frameCount = 0; 
const TOTAL_DURATION_FRAMES = 6 * 60; // 6 seconds at 60fps approximation

const PortalTransitionScene: React.FC<PortalTransitionSceneProps> = ({ onComplete }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationFrameIdRef = useRef<number | null>(null);
  const particlesRef = useRef<Particle[]>([]);
  const hueRef = useRef(0);
  const gridDepthOffsetRef = useRef(0); // Controls the perceived movement of the grid
  const activeGlitchesRef = useRef<ActiveGlitch[]>([]); // Store active glitches
  const pinkyImageRef = useRef<HTMLImageElement | null>(null);
  const pinkyLoadedRef = useRef(false);
  const { playSound, stopSound } = useAudioManager();

  useEffect(() => {
    playSound({
      filePath: '/assets/sounds/portal_transition_music.mp3',
      loop: true,
      volume: 0.6
    });

    const img = new Image();
    img.src = 'assets/images/pinky-character.png';
    img.onload = () => {
      pinkyImageRef.current = img;
      pinkyLoadedRef.current = true;
    };

    const canvas = canvasRef.current;
    if (!canvas) return;

    const context = canvas.getContext('2d');
    if (!context) return;

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;

    const createParticle = (id: number): Particle => {
      const angle = Math.random() * Math.PI * 2;
      const speed = Math.random() * 3 + 1 * PARTICLE_SPEED_MULTIPLIER;
      const color = `hsl(${ (hueRef.current + 120) % 360}, 100%, 70%)`; // Different hue offset for particles
      
      return {
        x: centerX,
        y: centerY,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        color,
        size: PARTICLE_BASE_SIZE + Math.random() * 2,
        life: 120 + Math.random() * 60, // Increased life a bit
      };
    };

    const renderGrid = (ctx: CanvasRenderingContext2D, currentHue: number, currentDepthOffset: number) => {
      ctx.save();
      ctx.translate(centerX, centerY);
      ctx.lineWidth = GRID_LINE_WIDTH;

      // Draw Radial Lines
      for (let i = 0; i < NUM_RADIAL_LINES; i++) {
        const angle = (i / NUM_RADIAL_LINES) * Math.PI * 2;
        // Add slight oscillation to radial lines for more dynamism
        const oscillation = Math.sin(frameCount * 0.02 + angle * 3) * 10; // angle * 3 to make each line different
        ctx.beginPath();
        ctx.moveTo(0,0);
        ctx.lineTo(Math.cos(angle) * (canvas.width + oscillation), Math.sin(angle) * (canvas.height + oscillation));
        ctx.strokeStyle = `hsla(${(currentHue + i * 10) % 360}, 70%, 50%, 0.3)`; // Made them a bit more transparent
        ctx.stroke();
      }

      // Draw Concentric Lines (Squares/Rectangles)
      for (let i = 0; i < NUM_CONCENTRIC_LINES; i++) {
        let depth = GRID_MAX_DEPTH_FACTOR + ((i / NUM_CONCENTRIC_LINES) + currentDepthOffset) % 1.0;
        if (depth > 1) depth -=1;
        
        let scale = depth * Math.max(canvas.width, canvas.height) * 0.7;
        if (scale < 5) continue;

        // Add undulation to the scale or position for distortion
        const undulation = Math.sin(frameCount * 0.05 + i * 0.5) * (scale * 0.1); // i * 0.5 to make each ring undulate differently
        scale += undulation;
        if (scale < 3) scale = 3; // prevent negative or too small scale

        const alpha = 1 - depth;
        ctx.strokeStyle = `hsla(${(currentHue + i * 20 + frameCount * 0.2) % 360}, 80%, 60%, ${Math.max(0.1, alpha * 0.7)})`; // Added frameCount to hue for more color shift
        
        ctx.beginPath();
        // Apply slight rotation for more disorientation
        const rotationAngle = Math.sin(frameCount * 0.01 + i * 0.3) * 0.05; // Small rotation
        ctx.rotate(rotationAngle);
        ctx.rect(-scale / 2, -scale / 2, scale, scale);
        ctx.stroke();
        ctx.rotate(-rotationAngle); // Rotate back
      }
      ctx.restore();
    };

    const renderNoise = (ctx: CanvasRenderingContext2D) => {
      for (let i = 0; i < NOISE_PARTICLE_COUNT; i++) {
        const x = Math.random() * canvas.width;
        const y = Math.random() * canvas.height;
        const colorVal = Math.floor(Math.random() * 55) + 200; // Brighter speckles (200-255)
        ctx.fillStyle = `rgba(${colorVal}, ${colorVal}, ${colorVal}, ${Math.random() * 0.2 + 0.05})`; // Very faint white/greyish speckles
        ctx.fillRect(x, y, NOISE_PARTICLE_SIZE, NOISE_PARTICLE_SIZE);
      }
    };

    const renderEdgeGlitches = (ctx: CanvasRenderingContext2D, currentHue: number) => {
      // Attempt to spawn a new glitch EVENT
      if (Math.random() < GLITCH_EVENT_CHANCE) {
        const numGlitchesToSpawn = 
          Math.floor(Math.random() * (GLITCHES_PER_EVENT_MAX - GLITCHES_PER_EVENT_MIN + 1)) + 
          GLITCHES_PER_EVENT_MIN;

        for (let j = 0; j < numGlitchesToSpawn; j++) {
          const edge = Math.floor(Math.random() * 4); // 0: top, 1: right, 2: bottom, 3: left
          let x, y, width, height;
          
          const glitchWidth = Math.random() * (GLITCH_MAX_WIDTH - GLITCH_MIN_WIDTH) + GLITCH_MIN_WIDTH;
          const glitchHeight = Math.random() * (GLITCH_MAX_HEIGHT - GLITCH_MIN_HEIGHT) + GLITCH_MIN_HEIGHT;

          switch (edge) {
            case 0: // Top
              x = Math.random() * (canvas.width - glitchWidth);
              y = Math.random() * glitchHeight * 0.5; // Allow some overlap from the very edge
              width = glitchWidth;
              height = glitchHeight;
              break;
            case 1: // Right
              x = canvas.width - glitchWidth * (Math.random() * 0.5 + 0.5); // Allow some overlap
              y = Math.random() * (canvas.height - glitchHeight);
              width = glitchWidth;
              height = glitchHeight;
              break;
            case 2: // Bottom
              x = Math.random() * (canvas.width - glitchWidth);
              y = canvas.height - glitchHeight * (Math.random() * 0.5 + 0.5); // Allow some overlap
              width = glitchWidth;
              height = glitchHeight;
              break;
            default: // Left (case 3)
              x = Math.random() * glitchWidth * 0.5; // Allow some overlap
              y = Math.random() * (canvas.height - glitchHeight);
              width = glitchWidth;
              height = glitchHeight;
              break;
          }
          activeGlitchesRef.current.push({
            x, y, width, height,
            color: `hsl(${(currentHue + Math.random() * 90 - 45) % 360}, ${Math.random() * 30 + 70}%, ${Math.random() * 30 + 50}%)`, // Wider color/saturation/lightness variation
            duration: Math.floor(Math.random() * GLITCH_MAX_DURATION * 0.6) + Math.floor(GLITCH_MAX_DURATION * 0.4)
          });
        }
      }

      // Draw and update active glitches
      for (let i = activeGlitchesRef.current.length - 1; i >= 0; i--) {
        const glitch = activeGlitchesRef.current[i];
        glitch.duration--;

        if (glitch.duration <= 0) {
          activeGlitchesRef.current.splice(i, 1);
          continue;
        }

        ctx.fillStyle = glitch.color;
        ctx.fillRect(glitch.x, glitch.y, glitch.width, glitch.height);
      }
    };

    const renderPinkyAnimation = (ctx: CanvasRenderingContext2D) => {
      if (!pinkyLoadedRef.current || !pinkyImageRef.current || frameCount > PINKY_ANIMATION_DURATION_SECONDS * 60) {
        return; // Pinky not loaded or its animation time is over
      }

      const animationProgress = frameCount / (PINKY_ANIMATION_DURATION_SECONDS * 60); // 0 to 1 over PINKY_ANIMATION_DURATION_SECONDS
      
      // Calculate Alpha for Fade-In
      let alpha = 1;
      if (frameCount <= PINKY_FADE_IN_DURATION_SECONDS * 60) {
        alpha = frameCount / (PINKY_FADE_IN_DURATION_SECONDS * 60);
      } 
      alpha = Math.max(0, Math.min(1, alpha)); // Clamp alpha between 0 and 1

      // Interpolate scale: starts big, ends small, over PINKY_ANIMATION_DURATION_SECONDS
      const currentScale = PINKY_INITIAL_SCALE_FACTOR * (1 - animationProgress) + PINKY_FINAL_SCALE_FACTOR * animationProgress;
      
      const img = pinkyImageRef.current;
      const aspectRatio = img.width / img.height;
      let drawWidth = canvas.height * currentScale * aspectRatio;
      let drawHeight = canvas.height * currentScale;

      if (drawWidth < 1 || drawHeight < 1) return; 

      const x = centerX - drawWidth / 2;
      const y = centerY - drawHeight / 2;
      
      ctx.save();
      ctx.globalAlpha = alpha;
      ctx.imageSmoothingEnabled = false; 
      ctx.drawImage(img, x, y, drawWidth, drawHeight);
      ctx.restore(); // Restores globalAlpha among other things
    };

    const render = () => {
      context.fillStyle = 'rgba(0, 0, 0, 0.1)';
      context.fillRect(0, 0, canvas.width, canvas.height);
      frameCount++;

      hueRef.current = (hueRef.current + 0.5) % 360;
      gridDepthOffsetRef.current = (gridDepthOffsetRef.current + GRID_SPEED) % 1;

      renderGrid(context, hueRef.current, gridDepthOffsetRef.current);
      renderPinkyAnimation(context); // Render Pinky after grid, before particles/noise/glitches
      renderNoise(context);
      renderEdgeGlitches(context, hueRef.current);

      // Render Particles
      if (particlesRef.current.length < MAX_PARTICLES) {
        for (let i = 0; i < PARTICLE_SPAWN_RATE; i++) {
          particlesRef.current.push(createParticle(particlesRef.current.length));
        }
      }
      
      for (let i = particlesRef.current.length - 1; i >= 0; i--) {
        const p = particlesRef.current[i];
        p.x += p.vx;
        p.y += p.vy;
        p.life -= 1;

        if (p.x < 0 || p.x > canvas.width || p.y < 0 || p.y > canvas.height || p.life <= 0) {
          particlesRef.current.splice(i, 1);
          continue;
        }

        context.fillStyle = p.color;
        context.fillRect(p.x - p.size / 2, p.y - p.size / 2, p.size, p.size);
      }

      animationFrameIdRef.current = requestAnimationFrame(render);
    };

    render();

    const timerId = setTimeout(() => {
      if (onComplete) {
        onComplete();
      }
    }, 6000);

    // Cleanup
    return () => {
      if (animationFrameIdRef.current) {
        cancelAnimationFrame(animationFrameIdRef.current);
      }
      clearTimeout(timerId);
      particlesRef.current = [];
      frameCount = 0;
      gridDepthOffsetRef.current = 0;
      activeGlitchesRef.current = []; // Clear active glitches on unmount
      stopSound('/assets/sounds/portal_transition_music.mp3', 1.0);
    };
  }, [onComplete, playSound, stopSound]);

  return (
    <canvas 
      ref={canvasRef} 
      style={{ display: 'block', background: 'black' }} 
    />
  );
};

export default PortalTransitionScene; 