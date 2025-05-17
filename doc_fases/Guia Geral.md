# Guia Sucinto do Projeto: Fantasma RA (Instruções para o Cursor)

## 1. Visão Geral do Projeto

"Fantasma RA" é uma experiência narrativa interativa que conta a história de Pinky, um fantasma de Pac-Man que ganha consciência e busca escapar de seu ciclo repetitivo. O jogo transita de uma estética arcade 8-bit para um mundo de fantasia 2.5D 16-bit, culminando em uma interação de Realidade Aumentada (AR) para a libertação final de Pinky.

## 2. Narrativa Principal e Jornada de Pinky

1.  **Ciclo Arcade:** Pinky existe no mundo de Pac-Man, fadado a ser comido repetidamente.
2.  **Despertar da Consciência:** Momentos antes de ser devorado novamente, Pinky questiona sua existência.
3.  **A Fuga:** O jogador controla Pinky em uma tentativa de escapar do labirinto 8-bit através de um "buraco de saída".
4.  **Transição Dimensional:** Ao escapar, Pinky atravessa uma transição caótica (glitch) e emerge em um novo mundo 16-bit (Élofen).
5.  **Exploração e Descoberta:** Pinky explora Élofen, buscando entender sua nova realidade e encontrar uma saída definitiva. Ele interage com NPCs, coleta pistas e aprende sobre "Realidade Aumentada" como uma possível chave.
6.  **O Portal Final:** Guiado por pistas, Pinky chega a uma caverna com um portal místico.
7.  **Libertação via AR:** O jogador é instruído a usar seu dispositivo móvel para uma experiência AR, que simboliza a libertação de Pinky para uma "camada superior" da realidade.
8.  **Finais Alternativos:** O jogador pode optar por não prosseguir com a AR, resultando no retorno de Pinky ao ciclo arcade.

## 3. Fluxo de Gameplay e Telas Chave

**Fase 1: Mundo Arcade (8-bit)**

*   **Tela de Início/Gameplay Automático Pac-Man:** Introdução visual, Pac-Man em ação.
*   **Tela de Consciência Inicial do Pinky:** Pinky isolado, diálogos sobre o ciclo.
*   **Tela de Controle do Pinky no Labirinto (Fuga):** Jogador controla Pinky até o "buraco de saída".

**Fase 2: Transição**

*   **Tela de Transição Dimensional (Glitch):** Efeito visual intenso marcando a mudança de mundos.

**Fase 3: Mundo de Fantasia (16-bit 2.5D - Élofen)**

*   **Tela do Bosque Decrépito:** Primeiro contato com o mundo 16-bit, diálogos de Pinky.
*   **Tela do Mapa Principal (Élofen):** Navegação estilo RPG top-down para diferentes capitanias.
    *   **Portaelys (Origem):** Ponto de chegada.
    *   **Sylvaris (Conhecimento):**
        *   *Biblioteca:* Interação com livros sobre RA, diálogo com Guardião, conquista "Sentinela do Saber".
        *   *Taberna:* Side-quest com NPC Bardo (pista para o portal).
    *   **Aurorix (Misticismo):**
        *   *Altar:* Interação mística.
        *   *Oráculo:* Diálogo com Logéthos (IA), conquista "Percepção Séptupla".
    *   **Nocthryn (Destino):**
        *   *Caverna do Portal:* Diálogos finais de Pinky, decisão de ativar AR.

**Fase 4: Ativação AR e Finais**

*   **Tela de Instrução para Ativação AR:** Guia o jogador sobre como usar o celular para a experiência AR (marcador/QR code).
*   **Experiência AR (no dispositivo móvel):** Pinky aparece no ambiente real do jogador; interação leva à "libertação".
*   **Tela Pós-Scan (Sucesso da Libertação):** Diálogo final de agradecimento de Pinky no jogo.
*   **Tela de Confirmação de Retorno:** Se o jogador opta por não fazer a AR, confirma o retorno ao ciclo.
*   **Tela de Créditos.**

## 4. Mecânicas Principais

*   **Controle de Personagem:** Movimentação de Pinky nos ambientes 8-bit e 16-bit.
*   **Sistema de Diálogo:** Caixas de texto para narrativa e interações com NPCs; avanço por clique.
*   **Interação com Objetos:** Leitura de livros (pop-ups com navegação de páginas), interação com elementos de cenário (Altar, Portal).
*   **Side-Quests:** Pequenas missões opcionais que fornecem pistas (ex: Bardo na Taberna).
*   **Sistema de Conquistas:** Recompensas por marcos narrativos ("Sentinela do Saber", "Percepção Séptupla").
*   **Decisão do Jogador:** Escolha crucial na Caverna do Portal (ativar AR ou retornar).
*   **Integração AR:** Uso de dispositivo móvel para uma breve experiência que impacta o final do jogo.

## 5. Estética e Efeitos Visuais Chave

*   **Dualidade Estética:** Transição de pixel art 8-bit (Atari, cores limitadas, neon) para 16-bit (fantasia 2.5D, mais cores, estilo FFIV).
*   **Efeitos Retrô:**
    *   **Scanlines:** Sobreposição sutil para emular monitores antigos.
    *   **Grid Neon:** Fundo com linhas ciano e magenta, animadas e com efeito glitch.
    *   **Glitch Visual:** Distorções na tela durante a transição dimensional e sutilmente no grid.
*   **Falhas de Memória:** Palavras nos diálogos de Pinky piscam em cores (verde/magenta) para indicar confusão/desenvolvimento da consciência.
*   **Atmosfera:** Uso de luz, sombra e partículas para criar ambientes (Bosque Decrépito, Caverna do Portal).

## 6. Integração da Realidade Aumentada (AR)

*   **Gatilho:** Após Pinky decidir atravessar o portal final e o jogador confirmar.
*   **Instruções:** Tela no jogo principal instrui o jogador a usar seu smartphone/tablet.
*   **Método:** Preferencialmente WebAR (via QR code ou marcador exibido na tela do jogo) para acessibilidade.
*   **Experiência AR:** Pinky (ou sua essência) aparece no ambiente real do jogador através da câmera do dispositivo. Uma breve interação ou passagem de tempo na AR simboliza sua libertação.
*   **Impacto no Jogo:** A conclusão da experiência AR leva ao final de libertação. Um fallback (pular AR) deve levar a uma resolução alternativa no jogo.

Este guia deve fornecer ao Cursor uma compreensão clara dos objetivos, fluxo e componentes essenciais do projeto "Fantasma RA".
