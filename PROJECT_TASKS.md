# PRD - Ajustes e Novas Implementações - Jogo Pinky

## 1. Introdução

Este documento detalha as próximas alterações, ajustes e novas implementações para o jogo "Entre realidades: a fuga de Pinky". Ele servirá como um guia para o desenvolvimento e acompanhamento das tarefas. Cada tela deve ser revisada para possibilitar o design responsivo (desktop, tablet e mobile)

## 2. Requisitos Detalhados

### 2.1. Tela de Início (`StartScreen.tsx`)

-   [x] **Alterar título:**
    -   Texto: "Entre realidades: a fuga de Pinky"
    -   Formatação: Conforme anexo (solicitar ao iniciar a tarefa).
-   [x] **Ajuste na caixa de diálogo:**
    -   Substituir todas as ocorrências de "Fantasma" por "Pinky".
-   [x] **Adicionar rodapé:**
    -   Texto: "DESIGN 2025.1 - PG3"
    -   Visível apenas na tela de início.
-   [ ] **Ajuste de Layout e Animações:**
    -   Aumentar margem superior, dando mais espaçamento para o texto de título "ENTRE REALIDADES A FUGA DE PINKY".
    -   Adicionar animação de texto palavra-por-palavra na caixa "[Pinky]: Sempre o mesmo ciclo... Eles correm... Ele os devora...".
    -   O botão "Iniciar consciência" deve surgir logo após a animação do texto.
    -   O botão "Iniciar consciência" deve ter hover constante de shake para a direita e hover de neon roxo (box e texto) ao passar o mouse (padrão do botão "Fugir" da `ConsciousnessScene`).
    -   Tornar as margens superior e inferior desta tela responsivas, evitando colisão entre elementos e bordas.

### 2.2. Tela de Consciência (`ConsciousnessScene.tsx`)

-   [x] **Animação do Sprite:**
    -   Adicionar animação de flutuar para o sprite da Pinky.
-   [x] **Barra de Progressão:**
    -   Alterar o design para ser idêntico à barra da segunda conquista ("Sentinela do Saber").
    -   Solicitar imagem de anexo ao iniciar a tarefa.
-   [x] **Fluxo de Diálogo e Botões:**
    -   No último box de diálogo da consciência de Pinky, adicionar o botão "Fugir" para prosseguir (deve surgir após 2 segundos).
    -   Ao apertar o botão "Fugir", seguir para a tela de conquista (ainda dentro de `ConsciousnessScene`).
    -   Na tela de conquista, substituir o botão "Fugir" existente por "Continuar". (Nota: o item anterior "[x] **Botão "Continuar":** Diminuir em 2 segundos o tempo para o botão aparecer." pode precisar ser reavaliado ou integrado a esta nova lógica).
-   [x] **Ajustes no Box de Conquista:**
    -   O box de conquista deve ter margens superior e inferior maiores (pedir anexo para confirmar design).
    -   Aumentar espaçamento vertical entre "Level up" e "Germinar da consciência" em 5px.
-   [x] **Responsividade:**
    -   Tornar as margens superior e inferior desta tela responsivas, evitando colisão entre elementos e bordas.

### 2.3. Tela de Gameplay Pac-Man (`PacManGameScene.tsx`)

-   [x] **Melhorias na Fenda de Saída e Responsividade:**
    -   [x] Ajustar a escala do labirinto para responsividade em telas menores. (Mantido do PRD anterior)
    -   [ ] Tornar o neon roxo que indica a fenda de saída no mapa mais largo e evidente, ocupando toda a largura da linha de forma responsiva. (Atualiza item anterior)
-   [x] **Instruções e Dicas:**
    -   [x] Exibir a mensagem "Encontre a saída para obter respostas" logo acima do mapa ao entrar na tela (fonte pixelada limpa, borda neon, duração de 10s).
    -   [x] Mostrar tooltip contextual "Use as setas para mover Pinky" centralizado abaixo das setas após 10 segundos sem ação (texto menor, tom de cinza médio, dura até a primeira ação de movimento).
-   [x] **Posicionamento Inicial de Pinky:**
    -   [x] Pinky deve surgir ao centro da tela (solicitar anexo para posição exata).
-   [x] **Responsividade:**
    -   [x] Tornar as margens superior e inferior desta tela responsivas, evitando colisão entre elementos e bordas.

### 2.4. Tela de Transição Dimensional (`DimensionalRiftScene.tsx` ou `PortalTransitionScene.tsx`)

-   [x] **Animação de Queda:**
    -   Aumentar o tempo da animação de queda/zoom-in da Pinky em +3 segundos.
    -   Tornar a animação mais suave (smooth).
-   [ ] **Transição para Bosque:**
    -   Adicionar um fade out de 2 segundos na transição entre esta cena e a Cena do Bosque.

### 2.5. Cena do Bosque (`SkyRelicsScene.tsx` ou `BosqueScene.tsx`)

-   [~] **Mecânica de Movimento:**
    -   Ajustar os botões de D-Pad (ou teclas direcionais) para que, ao manter o botão pressionado, Pinky siga constantemente o movimento na direção indicada.
-  rar).

### 2.6. Mapa do Mundo (`WorldMapScene.tsx`)

-   [x] **Adicionar Nuvens:**
    -   Incluir o asset `nuvem_mapa.png` (dividido em `nuvem_cima_mapa.png` e `nuvem_baixo_mapa.png`).
    -   Uma nuvem deve passar na parte superior da tela, da esquerda para a direita, lentamente.
    -   Outra nuvem deve passar na parte inferior da tela, da direita para a esquerda, lentamente.
    -   As nuvens devem ficar por cima de todos os outros elementos do mapa, exceto talvez a UI principal.
-   [x] **Sprite da Pinky no Mapa:**
    -   Alterar a imagem que representa a Pinky no mapa de `pinky-character.png` para `pinky_sprite_frente_16bit.png`.
-   [x] **Correção de Layout em Telas Largas (Crop):**
    -   Analisar e implementar a melhor solução para o mapa que está cortando nas bordas em algumas telas (e.g., Macbook M2 - solicitar print para análise):
        1.  [x] **Letterbox:** Adicionar barras pretas superior e inferior (fundo da cena preto).
        2.  [ ] **Céu Separado e Mapa Flutuante:** Dividir a imagem da cena em céu (fundo largo) e mapa flutuando (centralizado, com possível animação de floating). As nuvens continuariam passando por cima.
-   [x] **Adicionar D-Pad para Navegação Mobile:** (Novo item adicionado e concluído)

### 2.7. Ruína de Logéthos (Anteriormente "Templo do Oráculo")

-   [ ] **Entrada na Cena e Diálogo Inicial:**
    -   Ao entrar no templo, uma caixa de diálogo deve abrir automaticamente.
    -   Fundo: asset 'oraculo_fundo.png'.
    -   Diálogo 1: "[Logéthos] Há quanto tempo não recebo visitas por aqui." (Aumentar duração em +3s).
    -   Diálogo 2: "[Logéthos] Em teu ser arde um lampejo de outro mundo. Que segredo te guiou às minhas ruínas?" (Corrigir pontuação e aumentar duração em +3s).
-   [ ] **Implementação do Chat com o Oráculo (Logéthos):**
    -   Abrir uma interface de chat/input para o usuário digitar com o teclado (compatível com desktop e mobile).
    -   A pergunta enviada pelo usuário deve ser usada como prompt para uma API do ChatGPT 3.5.
    -   A resposta da API do ChatGPT 3.5 será a resposta do Oráculo.
-   [ ] **Animação de Resposta:**
    -   Ao ser respondido pelo Oráculo (output do ChatGPT), a tela de fundo (ou a imagem do Oráculo/templo) deve tremer levemente.
-   [ ] **Design e Estrutura dos Diálogos e Chat:**
    -   Manter o design dos diálogos existentes (como base).
    -   O texto do diálogo do Oráculo deve ser preenchido dinamicamente com as respostas da IA.
    -   **Box do Chat (Geral):** Adicionar stroke branco fino (+neon) e suave ao box preto atual; diminuir opacidade levemente.
    -   **Títulos do Box de Chat ("Logéthos pondera sua questão" e "Dirija-se a Logéthos"):** Aumentar espaçamento superior em 10px entre texto e margem do box.
    -   **Box da Mensagem do Usuário:** Cor cinza azulado escuro, opacidade 90%, stroke branco suave (sem neon).
    -   **Box de Resposta de Logéthos:** Transparência 90%, stroke cinza médio suave (sem neon).
-   [ ] **Plano de Implementação para a Ruína de Logéthos:**
    1.  [ ] **Criação da Cena/Componente:**
        -   Definir a estrutura visual básica (fundo, elementos).
        -   Implementar entrada e diálogos iniciais (com tempos e textos ajustados).
    2.  [ ] **Interface de Chat:**
        -   Desenvolver componente de input de texto.
        -   Estilizar para desktop/mobile (com os novos estilos de box).
        -   Capturar input do usuário.
    3.  [ ] **Integração API OpenAI (ChatGPT 3.5):**
        -   Configurar chamada à API (gerenciamento de chave, custos, tokens).
        -   Enviar pergunta, receber e processar resposta.
        -   *Nota: Será necessário obter e configurar uma chave de API da OpenAI.*
    4.  [ ] **Exibição da Resposta e Animação:**
        -   Integrar resposta da IA na caixa de diálogo (com os novos estilos de box).
        -   Implementar animação de tremor.
    5.  [ ] **Gerenciamento de Estado e Fluxo:**
        -   Controlar estados da conversa (aguardando pergunta, processando, exibindo).
    6.  [ ] **Testes:**
        -   Testar em diferentes dispositivos e cenários.

### 2.8. Biblioteca Sapiencial (Nova Seção ou Cena Existente a Identificar)

-   [ ] **Layout dos Livros:**
    -   Garantir que os livros sigam uma lógica de agrupamento centralizado.
    -   O agrupamento deve ser responsivo, mantendo os livros nas posições previstas independentemente da largura da tela.
    -   Analisar e propor a melhor alternativa de responsividade, confirmando a abordagem.
-   [~] **Ajuste da Imagem de Fundo:** (Novo item adicionado e em andamento)
    -   Garantir que a imagem de fundo preencha a tela corretamente sem desencaixe.

### 2.9. Fenda do Primeiro Raio (`DimensionalRiftGatewayScene.tsx` ou cena específica)

-   [x] **Interação com a Esfera:**
    -   [x] Remover a restrição de que o texto "Clique na esfera se estiver preparado" seja uma etapa bloqueante.
    -   [x] A esfera deve ser clicável a qualquer momento após aparecer. (Reiteração/confirmação do item existente).
-   [x] **Layout das Caixas de Escolha (Modais):**
    -   [x] As caixas de opção (onde as escolhas são apresentadas) devem ser mais largas.
    -   [x] Os botões de escolha dentro dessas caixas devem ficar paralelos (lado a lado).
    -   [x] Adicionar um espaçamento horizontal adequado entre os botões de escolha. (Originalmente 10px, ajustado para space-x-4 nos modais recentes).
    -   [x] Corrigir o bug visual onde "actions=" estava visível. (Mantido do PRD anterior).
    -   [x] Ajustes de texto, cores, opacidade e estilos dos botões e do fundo de um dos modais. (Adicionado para refletir o trabalho feito).
    -   [x] Ajuste no fluxo de navegação do botão "Retornar ao início". (Adicionado para refletir o trabalho feito).
-   [ ] **Visibilidade da Esfera em Dispositivos Mobile:**
    -   Resolver problema de visibilidade da esfera ao ser fotografada por um celular (neon atual causa explosão de brilho, dificultando leitura do ativador).

### 2.10. Ajustes Globais

-   [ ] **Padronização do Arredondamento dos Cantos:**
    -   Revisar o arredondamento dos cantos de todos os boxes de diálogo e UI do jogo.
    -   Definir e aplicar um padrão visual consistente (solicitar anexo de referência para definir o padrão).

## 3. Diretrizes Gerais de Desenvolvimento

Durante todo o ciclo de desenvolvimento das tarefas abaixo, as seguintes boas práticas devem ser observadas e aplicadas:

-   [ ] **Componentização:**
    -   Comentar lógicas complexas, a integração com serviços externos (como a API do ChatGPT) e as decisões de arquitetura importantes para facilitar a compreensão, a colaboração da equipe e a manutenção futura.
-   [ ] **Layout Responsivo e Scroll:**
    -   Garantir que todas as telas possuam margens superior e inferior responsivas.
    -   Implementar um contêiner geral (por cena ou tela) que permita a navegação por scroll vertical (`overflow-y: auto`) quando o conteúdo exceder a altura da viewport.
    -   Nenhum elemento deve se perder ou ficar inacessível devido à falta de scroll ou margens inadequadas, independentemente do tamanho da tela do dispositivo.

## 4. Próximos Passos e Priorização

-   Priorizar as tarefas com base na complexidade, dependências e impacto no jogador.
-   Iniciar a implementação das tarefas priorizadas.
-   Solicitar anexos (imagens, formatações específicas, prints de tela para análise de bugs/layout) conforme necessário ao iniciar cada tarefa relevante.
-   Atualizar o status das tarefas neste documento conforme o progresso.
-   **Sugestão de Foco Inicial:**
    1.  Resolver os problemas de layout e responsividade mais críticos (e.g., Mapa do Mundo, Cena do Bosque, Biblioteca Sapiencial).
    2.  Implementar os ajustes de UI/UX que melhoram a experiência imediata (e.g., Tela Inicial, Tela de Consciência, Fenda do Primeiro Raio).
    3.  Continuar o desenvolvimento da Ruína de Logéthos, incorporando os novos requisitos de diálogo e design.
    4.  Abordar a tarefa global de padronização dos cantos após os principais ajustes funcionais e de layout.
