import React from 'react';

interface ModalProps {
  isOpen: boolean;
  onClose?: () => void; // Optional: if you want a close button or overlay click
  title?: string | React.ReactNode;
  children: React.ReactNode;
  actions?: React.ReactNode; // For buttons or other action elements
  contentClassName?: string; // Nova prop para classes do container do conteúdo
  // maxWidth?: string; // Temporariamente removido para teste
}

const Modal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  title,
  children,
  actions,
  contentClassName, // Nova prop
  // maxWidth = 'max-w-lg' // Temporariamente removido
}) => {
  if (!isOpen) {
    return null;
  }

  console.log('[Modal.tsx] typeof actions:', typeof actions, 'Value:', actions); // Log para depuração

  return (
    <div 
      className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4"
      onClick={onClose} // Optional: close on overlay click
    >
      <div
        className={`bg-indigo-900 bg-opacity-[.98] p-6 md:p-7 rounded-lg shadow-2xl border-2 border-gray-300 w-[500px] max-w-[90vw] ${contentClassName || ''}`} // Largura fixa maior para teste, com max-width para telas pequenas
        style={{ boxShadow: '0 0 8px rgba(255, 255, 255, 0.25)' }}
        onClick={(e) => e.stopPropagation()} // Prevent closing when clicking inside modal content
      >
        {title && (
          <div className="mb-4">
            {typeof title === 'string' ? (
              <h2 className="text-xl md:text-2xl font-pixel text-white text-center">{title}</h2>
            ) : (
              title
            )}
          </div>
        )}
        <div className="text-white font-pixel mb-5 text-center">{children}</div> {/* Adicionado text-center para o children */}
        {actions && <div className="flex justify-center space-x-[15px]">{actions}</div>} {/* Espaçamento exato de 15px */}
      </div>
    </div>
  );
};

export default Modal; 