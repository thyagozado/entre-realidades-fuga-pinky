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
    <div className={`min-h-screen w-full flex flex-col items-center 
      relative arcade-scanline ${className}`}>
      {showGrid && (
        <div className="absolute inset-0 arcade-grid animate-grid-scroll-x"></div>
      )}
      <div className="relative z-10 max-w-4xl mx-auto w-full flex-grow overflow-y-auto flex flex-col h-0 hide-scrollbar">
        {children}
      </div>
    </div>
  );
};

export default ArcadeScreen;
