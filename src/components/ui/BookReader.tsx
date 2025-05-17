import React, { useState, useEffect } from 'react';

interface BookReaderProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  pages: string[];
}

const BookReader: React.FC<BookReaderProps> = ({ isOpen, onClose, title, pages }) => {
  const [currentPageIndex, setCurrentPageIndex] = useState(0);

  useEffect(() => {
    // Resetar para a primeira página quando um novo livro for aberto (ou o mesmo reaberto)
    if (isOpen) {
      setCurrentPageIndex(0);
    }
  }, [isOpen, title]); // Depender do título também para o caso de abrir outro livro enquanto um já estava aberto

  if (!isOpen) {
    return null;
  }

  const goToNextPage = () => {
    setCurrentPageIndex(prev => Math.min(prev + 1, pages.length - 1));
  };

  const goToPreviousPage = () => {
    setCurrentPageIndex(prev => Math.max(prev - 1, 0));
  };

  const currentPageText = pages[currentPageIndex] || '';
  // Tentar separar "Capítulo X" do resto do texto para estilização, se presente
  let chapterTitle = '';
  let pageContent = currentPageText;
  const chapterMatch = currentPageText.match(/^(Capítulo\s*\d+[.:]?\s*–?-?\s*["“]?[^"”]+["”]?)/i);
  // Ou um padrão mais simples se os títulos dos capítulos forem consistentes
  // const chapterMatchSimple = currentPageText.match(/^(Capítulo\s*\d+)/i);
  // if (chapterMatchSimple) {
  //   chapterTitle = chapterMatchSimple[0];
  //   pageContent = currentPageText.substring(chapterTitle.length).trim();
  // }

  // Ajuste para o padrão exato "Nome do Capítulo" entre aspas
  const titleInQuotesMatch = currentPageText.match(/^"([^"]+)"/);
  if (titleInQuotesMatch && pages.length > 1) { // Aplicar só se tiver mais de uma página e o padrão bater
    chapterTitle = titleInQuotesMatch[0];
    pageContent = currentPageText.substring(chapterTitle.length).trim();
  }


  return (
    <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50 p-4 font-pixel">
      {/* Capa/Fundo do Livro */}
      <div className="bg-[#5D3A1A] w-[700px] max-w-[90vw] h-[750px] max-h-[90vh] p-6 rounded-md shadow-2xl flex flex-col">
        {/* Página Interna */}
        <div className="bg-amber-100 flex-grow p-8 md:p-10 rounded-sm relative overflow-y-auto flex flex-col text-black">
          {/* Botão Fechar */}
          <button 
            onClick={onClose}
            className="absolute top-3 right-3 w-8 h-8 bg-red-400 hover:bg-red-500 border-2 border-red-700 rounded-sm flex items-center justify-center text-red-900 font-bold text-lg shadow-sm transition-colors"
            title="Fechar Livro"
          >
            X
          </button>

          {/* Título do Livro */}
          <h2 className="text-2xl md:text-3xl text-center text-stone-800 mb-[calc(1rem+5px)] md:mb-[calc(1.5rem+5px)] select-none">
            {title}
          </h2>

          {/* Conteúdo da Página */}
          <div className="flex-grow text-sm md:text-base leading-relaxed select-text whitespace-pre-line">
            {chapterTitle && (
              <p className="text-lg md:text-xl text-stone-700 mb-3 text-center"><em>{chapterTitle}</em></p>
            )}
            <p>{pageContent}</p>
          </div>

          {/* Navegação e Indicador de Página */}
          <div className="mt-auto pt-4 flex items-center justify-between select-none">
            <button 
              onClick={goToPreviousPage} 
              disabled={currentPageIndex === 0}
              className="px-4 py-2 border-2 border-dashed border-stone-600 text-stone-700 rounded disabled:opacity-50 disabled:cursor-not-allowed hover:enabled:bg-stone-200 transition-colors text-sm md:text-base"
            >
              &lt; Anterior
            </button>
            <span className="text-stone-600 text-xs md:text-sm">
              Página {currentPageIndex + 1} de {pages.length}
            </span>
            <button 
              onClick={goToNextPage} 
              disabled={currentPageIndex === pages.length - 1}
              className="px-4 py-2 border-2 border-dashed border-stone-600 text-stone-700 rounded disabled:opacity-50 disabled:cursor-not-allowed hover:enabled:bg-stone-200 transition-colors text-sm md:text-base"
            >
              Próximo &gt;
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookReader; 