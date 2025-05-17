import React from 'react';
import { cn } from '../../lib/utils'; // Supondo que você tenha uma função cn para classnames

interface NeonButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  text?: string;
  color?: 'cyan' | 'magenta' | 'lime' | 'yellow';
  glowStrength?: 'sm' | 'md' | 'lg';
}

const NeonButton: React.FC<NeonButtonProps> = ({
  text,
  children,
  className,
  color = 'cyan',
  glowStrength = 'md',
  ...props
}) => {
  const colorClasses = {
    cyan: {
      border: 'border-cyan-400',
      text: 'text-cyan-300',
      hoverBorder: 'hover:border-cyan-300',
      hoverText: 'hover:text-cyan-200',
      focusRing: 'focus:ring-cyan-500',
      shadowColorVar: 'theme(colors.cyan.400)',
    },
    magenta: {
      border: 'border-pink-500',
      text: 'text-pink-400',
      hoverBorder: 'hover:border-pink-400',
      hoverText: 'hover:text-pink-300',
      focusRing: 'focus:ring-pink-500',
      shadowColorVar: 'theme(colors.pink.500)',
    },
    lime: {
      border: 'border-lime-400',
      text: 'text-lime-300',
      hoverBorder: 'hover:border-lime-300',
      hoverText: 'hover:text-lime-200',
      focusRing: 'focus:ring-lime-500',
      shadowColorVar: 'theme(colors.lime.400)',
    },
    yellow: {
      border: 'border-yellow-400',
      text: 'text-yellow-300',
      hoverBorder: 'hover:border-yellow-300',
      hoverText: 'hover:text-yellow-200',
      focusRing: 'focus:ring-yellow-500',
      shadowColorVar: 'theme(colors.yellow.400)',
    },
  };

  const strengthClasses = {
    sm: 'shadow-[0_0_5px_var(--neon-glow-color),_0_0_10px_var(--neon-glow-color)]',
    md: 'shadow-[0_0_10px_var(--neon-glow-color),_0_0_20px_var(--neon-glow-color)]',
    lg: 'shadow-[0_0_15px_var(--neon-glow-color),_0_0_30px_var(--neon-glow-color)]',
  };

  const currentColors = colorClasses[color];
  
  const buttonStyle = {
    '--neon-glow-color': currentColors.shadowColorVar,
  } as React.CSSProperties;

  return (
    <button
      {...props}
      style={buttonStyle}
      className={cn(
        'py-2 px-4 rounded-lg border-2 bg-black bg-opacity-40 font-pixel font-semibold',
        'transition-all duration-200 ease-in-out focus:outline-none',
        'focus:ring-2 focus:ring-opacity-75',
        currentColors.border,
        currentColors.text,
        strengthClasses[glowStrength], // Applies the shadow using the CSS variable
        currentColors.hoverBorder,
        currentColors.hoverText,
        currentColors.focusRing,
        'hover:bg-opacity-50', // Slight background dim on hover
        className
      )}
    >
      {text || children}
    </button>
  );
};

export default NeonButton; 