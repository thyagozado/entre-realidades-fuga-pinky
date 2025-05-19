import React, { useState, useEffect, useRef } from 'react';
import ReturnToMapButton from '../components/ui/ReturnToMapButton';
import PixelArtBook from '../components/ui/PixelArtBook';
import BookReader from '../components/ui/BookReader'; // Importar o BookReader
import AchievementNotification from '../components/ui/AchievementNotification'; // Importar AchievementNotification
import useAudioManager from '../hooks/useAudioManager'; // Adicionado

interface BookData {
  id: string;
  title: string;
  pages: string[];
  position: { top: string; left: string; };
  color?: 'red' | 'blue' | 'green' | 'purple' | 'brown';
}

// Dados dos Livros Atualizados
const booksOnShelves: BookData[] = [
  {
    id: 'livro1',
    title: 'O Começo das Fendas',
    pages: [
      "Antigos criadores vislumbravam mundos sobrepostos... camadas visíveis com o olho certo. Era a Realidade Aumentada.",
      "Enquanto os mundos 2D brigavam por espaço na tela, alguns sonhavam com pixels que saíssem dela. E assim, em telas pequenas, começaram os primeiros experimentos: misturar real com digital."
    ],
    position: { top: '50%', left: '20%' }, 
    color: 'blue'
  },
  {
    id: 'livro2',
    title: 'A Era dos Portais',
    pages: [
      "Primeiros portais surgiram nos anos 90, em laboratórios. Hoje vivem no seu bolso.",
      "Chamavam de marcadores, códigos, âncoras. Eram sinais para abrir janelas — pequenas brechas entre as camadas.",
      "Com o tempo, o espelho virou tela, a câmera virou passagem. O real passou a aceitar o virtual como hóspede."
    ],
    position: { top: '50%', left: '30%' },
    color: 'red'
  },
  {
    id: 'livro3',
    title: 'Corpos Digitais',
    pages: [
      "Com o tempo, as imagens ganharam volume, os dados ganharam lugar. O virtual não só tocava — ele habitava.",
      "Avatares começaram a caminhar entre móveis. Hologramas dançavam em praças. Monstros surgiam nas esquinas de quem olhava com os olhos certos.",
      "O 2D era a cela. O 3D... a saída. Mas era preciso saber olhar."
    ],
    position: { top: '50%', left: '40%' },
    color: 'green'
  },
  {
    id: 'livro4',
    title: 'O Mago dos Portais Tridimensionais',
    pages: [
      "“1968 – O Capacete Mágico”\nIvan Sutherland, o primeiro grande mago da visão computacional, forjou o 'The Sword of Damocles': um capacete suspenso que projetava polígonos sobre o mundo real. Foi a centelha que uniu o físico ao virtual, criando o primeiro portal tridimensional.",
      "“1990 – A Runas da Boeing”\nThomas P. Caudell, conhecido como o Feiticeiro dos Marcadores, cunhou o termo Realidade Aumentada enquanto engrenagens e parafusos dançavam entre hologramas. Seus 'marcadores' eram verdadeiras runas: quando reconhecidos pela câmera, abriam janelas para instruções flutuantes.",
      "“2018 – Os Óculos dos Novos Arcanos”\nEmpresas como Magic Leap e Microsoft Research encarnaram Novos Magos, criando headsets leves e portáteis. Com sensoriamento de profundidade e rastreamento ocular, transformaram escritórios e salas de aula em verdadeiros salões de magia interativa."
    ],
    position: { top: '50%', left: '50%' },
    color: 'purple'
  },
  {
    id: 'livro5',
    title: 'A Revolução Ubíqua',
    pages: [
      "“2009 – Layar, o Grimório Móvel”\nNawfal Trabelsi lançou Layar, um tomo digital que mesclava GPS, câmeras e internet móvel. Cada rua, cada fachada tornava-se uma página viva, exibindo criaturas, traduções e roteiros — anunciando a democratização dos portais.",
      "“2016 – O Surgimento de Pokémon GO”\nA Niantic encheu o bolso de feitiços com um passe de mágica: Pokémon GO. Milhões de jogadores embarcaram numa caça global, provando que a Realidade Aumentada não era apenas curiosidade acadêmica, mas uma força cultural capaz de mobilizar multidões.",
      "“A Onipresença e a (Nova) Importância”\nCom ARKit da Apple e ARCore do Google, a tecnologia se espalhou como um novo elemento: da manutenção industrial à telemedicina, do e-commerce à educação. Seu verdadeiro poder reside em transcender telas — integrando dados, pessoas e lugares numa dimensão onde o digital impulsiona o real, alterando para sempre como percebemos e interagimos com o mundo."
    ],
    position: { top: '50%', left: '60%' },
    color: 'brown'
  },
];

interface BibliotecaSapencialSceneProps {
  onReturnToMap: () => void;
}

const BibliotecaSapencialScene: React.FC<BibliotecaSapencialSceneProps> = ({ onReturnToMap }) => {
  const [openedBookData, setOpenedBookData] = useState<BookData | null>(null);
  const [isReaderOpen, setIsReaderOpen] = useState(false);
  const [showSentinelaAchievement, setShowSentinelaAchievement] = useState(false); // Estado para a conquista
  const booksContainerRef = useRef<HTMLDivElement>(null); // Ref para o contêiner dos livros
  const { playSound, stopSound } = useAudioManager(); // Adicionado

  // Constantes para cálculo de layout dos livros
  const BOOK_WIDTH_APPROX = 100; // Largura aproximada de um livro para cálculo do min-width
  const INITIAL_LEFT_OFFSET = 50; // Diminuído para teste
  const HORIZONTAL_SPACING = 150; // Diminuído para teste
  const TOP_POSITION_PERCENT = '50%'; // Mudado para porcentagem

  // Calcula a largura mínima necessária para o contêiner de scroll dos livros
  const minBooksContainerWidth = 
    INITIAL_LEFT_OFFSET + 
    (booksOnShelves.length > 0 ? (booksOnShelves.length - 1) * HORIZONTAL_SPACING + BOOK_WIDTH_APPROX : 0) + 
    INITIAL_LEFT_OFFSET; // Adiciona um padding no final também

  useEffect(() => {
    if (booksContainerRef.current) {
      // console.log('Books Container Mounted');
      // console.log('clientWidth:', booksContainerRef.current.clientWidth);
      // console.log('scrollWidth:', booksContainerRef.current.scrollWidth);
      // console.log('Computed minWidth style:', booksContainerRef.current.style.minWidth);
    }
  }, [minBooksContainerWidth]); // Adicionado minBooksContainerWidth como dependência para logar quando recalcular

  useEffect(() => {
    playSound({
      filePath: '/assets/sounds/biblioteca_music.mp3',
      loop: true,
      fadeInDuration: 1.5,
      volume: 0.7
    });
    return () => {
      stopSound('/assets/sounds/biblioteca_music.mp3', 1.5);
    };
  }, [playSound, stopSound]);

  const handleBookClick = (bookData: BookData) => {
    setOpenedBookData(bookData);
    setIsReaderOpen(true);
  };

  const handleCloseReader = () => {
    setIsReaderOpen(false);
    if (openedBookData?.id === 'livro2') {
      setShowSentinelaAchievement(true);
      playSound({
        filePath: '/assets/sounds/level_up_biblioteca_sfx.mp3',
        loop: false,
        volume: 1.0
      });
    }
    // Não é estritamente necessário limpar openedBookData aqui,
    // pois o useEffect no BookReader vai resetar a página ao reabrir.
  };

  const handleCloseAchievement = () => {
    setShowSentinelaAchievement(false);
  };

  return (
    <>
      {/* Estilos para a barra de scroll devem estar dentro do JSX retornado */}
      <style jsx global>{`
        .کتاب-scroller-container::-webkit-scrollbar {
          height: 12px; /* Aumentado para visibilidade */
          background-color: rgba(0,0,0,0.3); 
        }
        .کتاب-scroller-container::-webkit-scrollbar-thumb {
          background-color: rgba(204, 153, 102, 0.8); /* Mais opaco */
          border-radius: 6px;
          border: 2px solid rgba(0,0,0,0.4);
        }
        .کتاب-scroller-container::-webkit-scrollbar-thumb:hover {
          background-color: rgba(184, 133, 82, 1);
        }
        .کتاب-scroller-container {
          scrollbar-width: auto; /* "auto" ou "thin" - mudado para auto para mais visibilidade */
          scrollbar-color: rgba(204, 153, 102, 0.8) rgba(0,0,0,0.3);
        }
      `}</style>
      <div 
        className="min-h-screen w-screen bg-cover bg-center bg-no-repeat relative font-pixel overflow-hidden"
        style={{ backgroundImage: "url('/assets/images/cena_biblioteca.png')" }}
      >
        <div className="relative z-10 flex flex-col items-center justify-center w-full h-full">
          <ReturnToMapButton 
            onClick={onReturnToMap} 
            className="absolute top-4 left-4 z-50"
          />

          <div className="relative w-full h-full max-w-4xl mx-auto flex items-center justify-center"> {/* Adicionado justify-center para teste */}
            {/* Contêiner Externo que limita a largura no desktop e centraliza */}
            {/* Contêiner Interno para os livros, com scroll horizontal em mobile */}
            <div 
              ref={booksContainerRef}
              className="w-full md:overflow-x-visible overflow-x-auto کتاب-scroller-container relative" // Restaurado md:overflow-x-visible e overflow-x-auto. Removidas classes de diagnóstico. Mantido w-full e relative.
              style={{
                minWidth: `${minBooksContainerWidth}px`, 
                height: '450px', // Aumentada altura
                // position: 'relative' já está na classe
              }}
            >
              {booksOnShelves.map((book, index) => {
                const leftPosition = `${INITIAL_LEFT_OFFSET + index * HORIZONTAL_SPACING}px`;
                // Os livros agora são posicionados absolutamente dentro deste contêiner de scroll
                return (
                  <PixelArtBook 
                    key={book.id}
                    title={book.title}
                    onClick={() => handleBookClick(book)}
                    style={{ 
                      position: 'absolute', 
                      top: TOP_POSITION_PERCENT, 
                      left: leftPosition,
                      transform: 'translateY(-50%)', // Adicionado para centralizar verticalmente
                    }}
                    color={book.color}
                  />
                );
              })}
            </div>

            {openedBookData && (
              <BookReader 
                isOpen={isReaderOpen}
                onClose={handleCloseReader}
                title={openedBookData.title}
                pages={openedBookData.pages}
              />
            )}
          </div>
          
          <AchievementNotification 
            isOpen={showSentinelaAchievement}
            onClose={handleCloseAchievement}
            achievementTitle="Sentinela do saber"
            description="Você acumulou conhecimento suficiente para pensar sobre si mesmo e o mundo."
            progressCurrent={2}
            progressMax={4}
            pinkySpriteUrl="/assets/images/pinky_sprite_frente_16bit.png"
          />
        </div>
      </div>
    </>
  );
};

export default BibliotecaSapencialScene; 