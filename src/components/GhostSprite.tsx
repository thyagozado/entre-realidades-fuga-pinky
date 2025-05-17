
import React from 'react';

interface GhostSpriteProps {
  color: 'pink' | 'red' | 'blue' | 'orange';
  className?: string;
  direction?: 'up' | 'down' | 'left' | 'right';
}

const GhostSprite: React.FC<GhostSpriteProps> = ({ 
  color, 
  className = '',
  direction = 'right'
}) => {
  // Define the base path for ghost sprites
  const basePath = `/lovable-uploads/ba904fd5-c9bb-4231-a99a-02eb62ddfc98.png`;
  
  // Define ghost dimensions and positions (using ghost sprite sheet)
  const ghostData = {
    pink: { x: 0, y: 60, width: 32, height: 32 }, // Pink ghost (3rd row, 1st column)
    red: { x: 0, y: 0, width: 32, height: 32 },   // Red ghost (1st row, 1st column)
    blue: { x: 0, y: 30, width: 32, height: 32 }, // Blue ghost (2nd row, 1st column)
    orange: { x: 0, y: 90, width: 32, height: 32 } // Orange ghost (4th row, 1st column)
  };

  const ghost = ghostData[color];
  
  // For animation, we could add different frames based on direction
  // This is a simplified version that just displays the basic sprite
  // In a full game, we would have different animation frames

  return (
    <div className={`ghost-sprite ${className}`}>
      <div className="relative w-full h-full animate-float">
        <img 
          src={basePath} 
          alt={`${color} ghost`} 
          className="w-full h-full object-cover"
          style={{
            objectFit: 'none',
            objectPosition: `-${ghost.x}px -${ghost.y}px`,
            width: `${ghost.width * 2}px`,
            height: `${ghost.height * 2}px`,
            transform: direction === 'left' ? 'scaleX(-1)' : 'none',
          }}
        />
      </div>
    </div>
  );
};

export default GhostSprite;
