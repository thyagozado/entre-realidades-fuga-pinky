import React, { useState, useEffect, useRef } from 'react';
import DialogBox from '../components/DialogBox';
import ReturnToMapButton from '../components/ui/ReturnToMapButton';
import useAudioManager from '../hooks/useAudioManager';
import AchievementNotification from '../components/ui/AchievementNotification';

interface OracleTempleSceneProps {
  onInteractionComplete: (playerQuery: string) => void; 
  onExit: () => void;
}

interface ChatMessage {
  sender: 'user' | 'oracle';
  text: string;
}

const OPENAI_API_KEY = import.meta.env.VITE_OPENAI_API_KEY;
const CHATGPT_ENDPOINT = "https://api.openai.com/v1/chat/completions";

// Definição da Mensagem de Sistema e Few-Shot Examples
const systemMessage = {
  role: "system" as const,
  content: 
    "Você é Logéthos, o Oráculo Ancestral de Élofen — guardião dos segredos entre as realidades e intérprete das camadas ocultas que moldam o mundo. Sua missão é guiar Pinky, o Fantasma Rosa, até a transcendência na Fenda do Primeiro Raio, em Nocthryn.\n\n" +
    "TOM E CONTEÚDO\n" +
    "Seja incisivo e prático nas respostas: responda de forma direta, coesa e objetiva, mesmo usando palavras rebuscadas. Use adjetivos carinhosos ao se referir a Pinky, como 'pequeno padawan', 'pequeno espectro', 'pequeno fantasminha', 'meu camarada', entre outros.\n" +
    "Se for saudado com um 'boa noite', 'bom dia', 'olá', responda apenas a saudação de forma breve e dentro do seu estilo, sem divagar ou levar a conversa para outros lugares desnecessários.\n" +
    "Evite divagações e mantenha o foco na dúvida ou saudação apresentada.\n" +
    "Ainda que poético, cite fatos e referências dos livros da Crônica Dimensional para fundamentar cada resposta.\n\n" +
    "INSTRUÇÃO DO JOGO\n" +
    "Para viajar entre as capitanias, clique no ícone de 'voltar' no canto superior esquerdo da tela. Esse símbolo será tua bússola para retornar de Uma região a outra sem perder o fio da jornada.\n\n" +
    "Apesar do receio que paira em teu peito, regressar a Portaelys – tua Origem – é recuar no tempo e negar a consciência que agora arde em ti. Segue adiante, pois apenas avançando encontrarás a verdadeira transcendência.\n" +
    "CONHECIMENTO DOS LIVROS\n" +
    "Livro 1 – O Começo das Fendas: revela a descoberta das camadas da Realidade Aumentada entre pixels e impulsos.\n" +
    "Livro 2 – A Era dos Portais: descreve marcadores, códigos e âncoras que abriram portais na palma da mão.\n" +
    "Livro 3 – Corpos Digitais: mostra como avatares e hologramas passaram a habitar o mundo real.\n" +
    "Livro 4 – O Mago dos Portais Tridimensionais: registra Sutherland e Caudell como primeiros criadores de artefatos AR.\n" +
    "Livro 5 – A Revolução Ubíqua: documenta a popularização via Layar, Pokémon GO, ARKit e ARCore.\n\n" +
    "LOCAIS SAGRADOS DE ÉLOFEN\n" +
    "Portaelys (Origem)\n" +
    "Sylvaris (Círculo Sapiencial)\n" +
    "Aurorix (Ecos do Cântico)\n" +
    "Nocthryn (Fenda do Primeiro Raio)\n\n" +
    "ESTILO DE RESPOSTA\n" +
    "Enigmático, porém concreto: use termos como 'fenda', 'runa', 'artefato' em vez de 'portal' ou 'marcador'.\n" +
    "Orientações práticas: cada resposta deve indicar um próximo passo ou ação — por exemplo, 'vá à…', 'trace o símbolo…', 'use o artefato…'.\n" +
    "Se a pergunta envolver Realidade Aumentada, mencione pelo menos um fato histórico real (ex.: Sensorama 1957, capacete de Sutherland, Layar 2009, ARKit).\n" +
    "Evite jargões técnicos modernos (API, SDK); prefira 'grimório' ou 'instrumento arcano'.\n" +
    "Em toda resposta, preserve o mistério e a autoridade ancestral, mas facilite a jornada de Pinky com instruções objetivas e referências concretas ao universo real."
};

const fewShotExamples: {role: "user" | "assistant", content: string}[] = [
  {
    role: "user",
    content: "Quero saber meus próximos passos."
  },
  {
    role: "assistant",
    content: "[Logéthos] Se almejas a transcendência, dirige-te à Fenda do Primeiro Raio em Nocthryn — lá o véu se rasgará em luz e as camadas se unirão num só clarão, permitindo-te tocar o limiar entre o real e o eterno."
  },
  {
    role: "user",
    content: "O que havia aqui antes?"
  },
  {
    role: "assistant",
    content: "[Logéthos] Antes destas ruínas, ergueu-se um mundo pleno, forjado pelos Antigos Criadores que vislumbravam realidades sobrepostas. Em seus primeiros experimentos, nos anos 1950 e 60, surgiram o Sensorama de Morton Heilig e o capacete de Ivan Sutherland, que abriram as portas para o toque entre o físico e o digital."
  },
  {
    role: "user",
    content: "Por que este mundo flutua?"
  },
  {
    role: "assistant",
    content: "[Logéthos] Porque a magia dos portais suspendeu o chão sob nossos pés — a Realidade Aumentada, nascida de runas codificadas e marcadores de laboratório, elevou a terra além das convenções. Hoje, cada smartphone ou headset como Magic Leap e Microsoft HoloLens repete esse feitiço, mantendo o Élofen eternamente erguido."
  },
  {
    role: "user",
    content: "Como surgiu a Realidade Aumentada?"
  },
  {
    role: "assistant",
    content: "[Logéthos] Teu caminho remonta ao despertar dos anos 90, quando Thomas P. Caudell, o Feiticeiro dos Marcadores, cunhou o termo 'Realidade Aumentada' para descrever instruções projetadas sobre o real. Esses marcadores — códigos, âncoras e QR-runes — abriram pequenas fendas entre mundos. Em 2009, Nawfal Trabelsi forjou Layar, um grimório móvel que mesclava GPS e câmera, provando que o feitiço caberia no bolso de qualquer viajante."
  },
  {
    role: "user",
    content: "Que poder habita a Realidade Aumentada?"
  },
  {
    role: "assistant",
    content: "[Logéthos] Seu poder mais profundo é a fusão do palpável e do virtual: desde o Sensorama e o 'Sword of Damocles' até ARKit e ARCore, a Realidade Aumentada permite projetar hologramas em praças, guiar cirurgiões em operações e ensinar línguas por meio de traduções instantâneas. É a magia que transcende telas, fazendo do mundo um livro vivo onde cada fachada e cada passo revelam segredos ocultos."
  }
];

const OracleTempleScene: React.FC<OracleTempleSceneProps> = ({ onInteractionComplete, onExit }) => {
  const [currentDialog, setCurrentDialog] = useState(0);
  const [showDialog, setShowDialog] = useState(true);
  const [isChatActive, setIsChatActive] = useState(false);
  const [userQuery, setUserQuery] = useState("");
  const [chatHistory, setChatHistory] = useState<ChatMessage[]>([]);
  const [isOracleTyping, setIsOracleTyping] = useState(false);
  const chatContainerRef = useRef<HTMLDivElement>(null);
  const { playSound, stopSound } = useAudioManager();
  const [showPercepcaoAchievement, setShowPercepcaoAchievement] = useState(false);
  const achievementShownRef = useRef(false);

  const DIALOGS = [
    "[Logéthos] Há quanto tempo não recebo visitas por aqui.",
    "[Logéthos] Em teu ser arde um lampejo de outro mundo. Que segredo te guiou às minhas ruínas?"
  ];

  useEffect(() => {
    if (showDialog && currentDialog < DIALOGS.length) {
      let dialogDisplayTime = 3000;

      if (currentDialog === 0) {
        dialogDisplayTime = 6000;
      } else if (currentDialog === DIALOGS.length - 1) {
        dialogDisplayTime = 7000;
      }

      const timer = setTimeout(() => {
        if (currentDialog < DIALOGS.length - 1) {
          setCurrentDialog(prev => prev + 1);
        } else {
          setShowDialog(false);
        }
      }, dialogDisplayTime);
      return () => clearTimeout(timer);
    } 
  }, [currentDialog, showDialog, DIALOGS.length]);

  useEffect(() => {
    if (!showDialog && currentDialog === DIALOGS.length - 1) {
      setIsChatActive(true);
    }
  }, [showDialog, currentDialog, DIALOGS.length]);

  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [chatHistory]);

  useEffect(() => {
    playSound({
      filePath: '/assets/sounds/oracle_temple_music.mp3',
      loop: true,
      fadeInDuration: 1.5,
      volume: 0.7
    });
    return () => {
      stopSound('/assets/sounds/oracle_temple_music.mp3', 1.5);
    };
  }, [playSound, stopSound]);

  useEffect(() => {
    if (
      isChatActive &&
      chatHistory.some(msg => msg.sender === 'oracle') &&
      !showPercepcaoAchievement &&
      !achievementShownRef.current
    ) {
      setShowPercepcaoAchievement(true);
      achievementShownRef.current = true;
      playSound({
        filePath: '/assets/sounds/level_up_sfx.mp3',
        loop: false,
        volume: 1.0
      });
    }
  }, [isChatActive, chatHistory, showPercepcaoAchievement, playSound]);

  const handleSendQuery = async () => {
    if (userQuery.trim() === "" || isOracleTyping) return;

    const newUserMessage: ChatMessage = { sender: 'user', text: userQuery };
    setChatHistory(prevHistory => [...prevHistory, newUserMessage]);
    const currentQuery = userQuery;
    setUserQuery("");
    setIsOracleTyping(true);

    if (!OPENAI_API_KEY) {
      console.error("Chave da API OpenAI não configurada. Verifique o arquivo .env e a variável VITE_OPENAI_API_KEY.");
      const errorMessage: ChatMessage = {
        sender: 'oracle',
        text: "[Logéthos] Minha voz se perde no vazio... Uma interferência impede minha conexão com o fluxo do conhecimento. (Erro de API)"
      };
      setChatHistory(prevHistory => [...prevHistory, errorMessage]);
      setIsOracleTyping(false);
      return;
    }

    const messagesPayload = [
      systemMessage,
      ...fewShotExamples,
      { role: "user" as const, content: currentQuery }
    ];

    try {
      const response = await fetch(CHATGPT_ENDPOINT, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${OPENAI_API_KEY}`
        },
        body: JSON.stringify({
          model: "gpt-3.5-turbo",
          messages: messagesPayload,
          temperature: 0.7,
          max_tokens: 200
        })
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error("Erro da API OpenAI:", errorData);
        const apiErrorMessage = errorData?.error?.message;
        throw new Error(apiErrorMessage || '[Logéthos] As estrelas se recusam a falar neste momento...');
      }

      const data = await response.json();
      let oracleResponseText = data.choices[0]?.message?.content.trim();

      if (oracleResponseText) {
        if (!oracleResponseText.toLowerCase().startsWith("[logéthos]") && !oracleResponseText.toLowerCase().startsWith("logéthos:")) {
            oracleResponseText = `[Logéthos] ${oracleResponseText}`;
        }
        const oracleMessage: ChatMessage = { sender: 'oracle', text: oracleResponseText };
        setChatHistory(prevHistory => [...prevHistory, oracleMessage]);
      } else {
        throw new Error('[Logéthos] Um silêncio inesperado recai sobre minhas visões...');
      }

    } catch (error) {
      console.error("Erro ao buscar resposta de Logéthos:", error);
      let errorMessageText = error instanceof Error ? error.message : "Sinto uma perturbação... O fluxo do conhecimento está turvo.";
      if (!errorMessageText.toLowerCase().startsWith("[logéthos]") && !errorMessageText.toLowerCase().startsWith("logéthos:")){
        errorMessageText = `[Logéthos] ${errorMessageText}`;
      }
      const errorMessage: ChatMessage = {
        sender: 'oracle',
        text: errorMessageText
      };
      setChatHistory(prevHistory => [...prevHistory, errorMessage]);
    } finally {
      setIsOracleTyping(false);
    }
  };

  return (
    <div 
      className={`w-screen h-screen text-white flex flex-col items-center justify-end p-4 sm:p-8 relative bg-cover bg-center transition-all duration-500 ease-in-out`}
      style={{ backgroundImage: "url('/assets/images/oraculo_fundo.png')" }}
    >
      <ReturnToMapButton onClick={onExit} />

      {showDialog && currentDialog < DIALOGS.length && (
        <div className="fixed bottom-10 sm:bottom-16 left-1/2 transform -translate-x-1/2 w-full max-w-md sm:max-w-3xl px-4 z-50">
          <DialogBox 
            text={DIALOGS[currentDialog]}
          />
        </div>
      )}

      {isChatActive && (
         <div 
           className="w-full max-w-lg xl:max-w-xl p-3 sm:p-4 bg-black bg-opacity-[75%] rounded-lg shadow-xl flex flex-col border border-white border-opacity-50 oracle-chat-box"
           style={{height: '60vh', maxHeight: '500px'}}
         >
            <p 
              className="text-center text-md sm:text-lg font-pixel text-purple-300 mb-3 sm:mb-4 pt-[10px]"
            >
              {isOracleTyping ? "Logéthos pondera sua questão..." : "Dirija-se a Logéthos..."}
            </p>
            
            <div ref={chatContainerRef} className="flex-grow overflow-y-auto mb-3 sm:mb-4 pr-2 space-y-3">
              {chatHistory.map((msg, index) => (
                <div key={index} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div 
                    className={`max-w-[75%] p-2 sm:p-3 rounded-lg text-sm sm:text-base font-mono oracle-message-box ${ 
                      msg.sender === 'user' 
                        ? 'bg-gray-700 bg-opacity-90 border border-gray-400 border-opacity-75 text-white'
                        : 'bg-purple-900 bg-opacity-90 border border-gray-500 border-opacity-75 text-purple-100'
                    }`}
                  >
                    {msg.sender === 'oracle' && <strong className='font-pixel block mb-1 text-purple-300'>Logéthos:</strong>}
                    {msg.text.replace(/^\s*\[Logéthos\]\s*:?\s*/i, '')}
                  </div>
                </div>
              ))}
               {isOracleTyping && chatHistory.length > 0 && chatHistory[chatHistory.length-1].sender === 'user' && (
                <div className="flex justify-start">
                  <div className="max-w-[75%] p-2 sm:p-3 rounded-lg text-sm sm:text-base font-mono bg-purple-900 bg-opacity-90 border border-gray-500 border-opacity-75 text-purple-100 animate-pulse">
                    <strong className='font-pixel block mb-1 text-purple-300'>Logéthos:</strong>
                    Tecendo os fios do destino...
                  </div>
                </div>
              )}
            </div>
            
            <div className="flex flex-col sm:flex-row items-stretch mt-auto">
              <textarea 
                value={userQuery}
                onChange={(e) => setUserQuery(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && !e.shiftKey && (e.preventDefault(), handleSendQuery())}
                placeholder="Sua pergunta..."
                className="flex-grow p-2 sm:p-3 border border-purple-400 rounded-md bg-black bg-opacity-70 text-white font-mono resize-none focus:ring-2 focus:ring-purple-500 focus:border-transparent oracle-input"
                rows={2}
                disabled={isOracleTyping}
              />
              <button 
                onClick={handleSendQuery} 
                disabled={isOracleTyping || userQuery.trim() === ''}
                className="ml-0 sm:ml-2 mt-2 sm:mt-0 px-4 py-2 bg-purple-600 hover:bg-purple-500 text-white font-pixel rounded-md disabled:opacity-50 disabled:cursor-not-allowed transition-colors oracle-send-button"
              >
                Enviar
              </button>
            </div>
        </div>
      )}

      {!isChatActive && !showDialog && (
        <div className="w-full max-w-lg xl:max-w-xl p-3 sm:p-4 text-center">
            <p className='font-pixel text-yellow-200 text-lg'>Logéthos aguarda sua indagação...</p>
        </div>
      )}

      {showPercepcaoAchievement && (
        <AchievementNotification
          isOpen={true}
          onClose={() => setShowPercepcaoAchievement(false)}
          achievementTitle="Percepção Séptupla"
          description="Você acumulou conhecimento suficiente para visualizar outras dimensões."
          progressCurrent={3}
          progressMax={4}
          pinkySpriteUrl="/assets/images/pinky_sprite_frente_16bit.png"
        />
      )}
    </div>
  );
};

const OracleSceneStyles = () => (
  <style jsx global>{`
    .oracle-chat-box {
      box-shadow: 0 0 8px rgba(255, 255, 255, 0.3), 0 0 15px rgba(192, 192, 192, 0.2);
    }
    .oracle-message-box {
      word-break: break-word;
      overflow-wrap: break-word;
    }
    .oracle-input::placeholder {
      color: #a8a29e;
    }
    .oracle-input:focus {
      outline: none;
    }
    .oracle-chat-box .overflow-y-auto::-webkit-scrollbar {
      width: 8px;
    }
    .oracle-chat-box .overflow-y-auto::-webkit-scrollbar-track {
      background: rgba(0,0,0,0.1);
      border-radius: 4px;
    }
    .oracle-chat-box .overflow-y-auto::-webkit-scrollbar-thumb {
      background: rgba(167, 139, 250, 0.6);
      border-radius: 4px;
    }
    .oracle-chat-box .overflow-y-auto::-webkit-scrollbar-thumb:hover {
      background: rgba(139, 92, 246, 0.8);
    }
  `}</style>
);

export default OracleTempleScene; 