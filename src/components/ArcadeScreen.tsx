
import React from 'react';

interface ArcadeScreenProps {
  children: React.ReactNode;
  showGrid?: boolean;
  className?: string;
}

const ArcadeScreen: React.FC<ArcadeScreenProps> = ({ 
  children, 
  showGrid = true,
  className = '' 
}) => {
  return (
    <div className={`min-h-screen w-full flex flex-col items-center justify-center 
      relative overflow-hidden arcade-scanline ${className}`}>
      {showGrid && (
        <div className="absolute inset-0 arcade-grid animate-grid-scroll-x"></div>
      )}
      <div className="relative z-10 max-w-4xl mx-auto w-full">
        {children}
      </div>
    </div>
  );
};

export default ArcadeScreen;
