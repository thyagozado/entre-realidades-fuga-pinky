
import React from 'react';

interface NeonButtonProps {
  text: string;
  onClick: () => void;
  className?: string;
  icon?: string;
  color?: 'magenta' | 'blue' | 'white';
}

const NeonButton: React.FC<NeonButtonProps> = ({ 
  text, 
  onClick, 
  className = '',
  icon,
  color = 'white'
}) => {
  const colorClasses = {
    magenta: 'border-arcade-magenta hover:border-arcade-magenta hover:text-arcade-magenta',
    blue: 'border-arcade-blue hover:border-arcade-blue hover:text-arcade-blue',
    white: 'border-arcade-white hover:border-arcade-magenta'
  };

  return (
    <button 
      className={`neon-button hover:animate-pulse-neon focus:animate-pulse-neon ${colorClasses[color]} ${className}`}
      onClick={onClick}
    >
      {icon && <span className="mr-2">{icon}</span>}
      {text}
    </button>
  );
};

export default NeonButton;
