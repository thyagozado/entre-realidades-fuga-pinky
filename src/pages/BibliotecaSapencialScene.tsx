import React, { useState } from 'react';
import ReturnToMapButton from '../components/ui/ReturnToMapButton';
import PixelArtBook from '../components/ui/PixelArtBook';
import BookReader from '../components/ui/BookReader'; // Importar o BookReader
import AchievementNotification from '../components/ui/AchievementNotification'; // Importar AchievementNotification

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

  const handleBookClick = (bookData: BookData) => {
    setOpenedBookData(bookData);
    setIsReaderOpen(true);
  };

  const handleCloseReader = () => {
    setIsReaderOpen(false);
    if (openedBookData?.id === 'livro2') {
      // Idealmente, verificar se a conquista já foi ganha para não mostrar repetidamente,
      // mas para este escopo, mostraremos ao fechar o livro 2.
      setShowSentinelaAchievement(true);
    }
    // Não é estritamente necessário limpar openedBookData aqui,
    // pois o useEffect no BookReader vai resetar a página ao reabrir.
  };

  const handleCloseAchievement = () => {
    setShowSentinelaAchievement(false);
  };

  return (
    <div 
      className="w-screen h-screen bg-cover bg-center bg-no-repeat relative font-pixel"
      style={{ backgroundImage: "url('/assets/images/cena_biblioteca.png')" }}
    >
      <ReturnToMapButton onClick={onReturnToMap} />

      {booksOnShelves.map((book, index) => {
        const topPosition = '250px';
        const initialLeftOffset = 100; // Em pixels
        const horizontalSpacing = 175; // Em pixels
        const leftPosition = `${initialLeftOffset + index * horizontalSpacing}px`;

        return (
          <PixelArtBook 
            key={book.id}
            title={book.title}
            onClick={() => handleBookClick(book)}
            style={{ top: topPosition, left: leftPosition }}
            color={book.color}
          />
        );
      })}

      {openedBookData && (
        <BookReader 
          isOpen={isReaderOpen}
          onClose={handleCloseReader}
          title={openedBookData.title}
          pages={openedBookData.pages}
        />
      )}

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
  );
};

export default BibliotecaSapencialScene; 