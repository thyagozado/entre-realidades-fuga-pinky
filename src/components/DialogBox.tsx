import React from 'react';

interface DialogBoxProps {
  text: string;
  onComplete?: () => void;
  className?: string;
}

const DialogBox: React.FC<DialogBoxProps> = ({ 
  text, 
  onComplete, 
  className = '' 
}) => {
  const handleClick = () => {
      onComplete && onComplete();
  };

  return (
    <div 
      className={`dialog-box ${className}`} 
      onClick={handleClick}
    >
      <div className="relative">
        <p className="m-0 text-sm leading-relaxed" style={{ whiteSpace: 'pre-wrap', wordWrap: 'break-word' }}>
          {text}
        </p>
        {onComplete && (
          <div className="absolute bottom-[-10px] right-0 animate-blink">▼</div>
        )}
      </div>
    </div>
  );
};

export default DialogBox;
