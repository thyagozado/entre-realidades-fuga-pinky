# Fase 06: Desenvolvimento da Capitania de Aurorix (Altar e Oráculo)

**Objetivo Principal:** Implementar a Capitania de Aurorix, focando nas interações místicas no Altar (Ecos do Cântico) e no diálogo com a entidade Logéthos no Oráculo (Templo de Logéthos), incluindo a obtenção de uma conquista.

**Microtarefas Detalhadas:**

1.  **Preparação para Entrada em Aurorix:**
    *   No `script.js`, na lógica de transição do mapa (final da Fase 04), quando Aurorix é selecionada, adicionar a chamada para `initAltarScreen()` (ou `initAurorixScreen()` se houver uma tela de entrada para a capitania antes do Altar/Oráculo) e ocultar a `mapa-screen`.

2.  **Criação dos Assets Visuais para Aurorix:**
    *   **Tileset do Altar:** Criar ou obter um tileset de pixel art 16-bit para um altar místico ao ar livre ou em ruínas (plataforma elevada, colunas ancestrais, símbolos arcanos, talvez um céu estrelado ou um ambiente etéreo). Salvar como `altar_tileset_16bit.png`.
    *   **Tileset do Oráculo:** Criar ou obter um tileset de pixel art 16-bit para o interior de um templo ou câmara de sabedoria (arquitetura imponente, talvez com cristais, escrituras flutuantes ou uma fonte de luz central). Salvar como `oraculo_tileset_16bit.png`.
    *   **Visual de Logéthos:** Criar ou obter um sprite ou um design visual para Logéthos. Pode ser uma forma abstrata de energia, um rosto em uma parede, ou uma estátua falante, para representar uma entidade de sabedoria. Salvar como `logethos_visual_16bit.png`.

3.  **Estrutura HTML para a Tela do Altar (`altar-screen`):**
    *   No `index.html`, adicionar um novo `div` com o id `altar-screen` (inicialmente `display: none;`).
    *   Dentro de `altar-screen`, adicionar um `canvas` (ex: `id="altar-canvas"`) e um `div` para diálogo/descrição (ex: `class="dialog-box-altar"`).

4.  **Estilização CSS da Tela do Altar:**
    *   No `style.css`, estilizar `#altar-screen`, `#altar-canvas`, `.dialog-box-altar`.

5.  **Lógica JavaScript para Renderização do Cenário do Altar:**
    *   Criar `initAltarScreen()` e `renderAltar()` para carregar `altar_tileset_16bit.png` e desenhar o cenário.
    *   Posicionar Pinky na entrada do Altar.

6.  **Implementação da Interação com o Altar:**
    *   Definir um ponto de interação no Altar (ex: o centro da plataforma).
    *   Quando Pinky se aproxima e interage:
        *   Exibir um texto descritivo na `.dialog-box-altar`: "[ALTAR]: Ecos de um cântico heroico ressoam fracamente nesta plataforma. Uma melodia de coragem e sacrifício... talvez ligada ao Bardo de Sylvaris?"
        *   Implementar efeitos visuais sutis (ex: brilho emanando do altar, partículas luminosas) e sonoros (fragmento do cântico de Aelor, se disponível como asset de áudio).

7.  **Estrutura HTML para a Tela do Oráculo (`oraculo-screen`):**
    *   No `index.html`, adicionar um novo `div` com o id `oraculo-screen` (inicialmente `display: none;`).
    *   Dentro de `oraculo-screen`, adicionar um `canvas` (ex: `id="oraculo-canvas"`) para o cenário e Logéthos, e um `div` para diálogo (ex: `class="dialog-box-oraculo"`).

8.  **Estilização CSS da Tela do Oráculo:**
    *   No `style.css`, estilizar `#oraculo-screen`, `#oraculo-canvas`, `.dialog-box-oraculo`.

9.  **Lógica JavaScript para Renderização do Cenário do Oráculo:**
    *   Criar `initOraculoScreen()` e `renderOraculo()` para carregar `oraculo_tileset_16bit.png` e desenhar o cenário.
    *   Posicionar Pinky na entrada do Oráculo.
    *   Desenhar/posicionar o `logethos_visual_16bit.png` em um local de destaque.

10. **Implementação do Diálogo com Logéthos:**
    *   Implementar a lógica de interação com Logéthos.
    *   **Diálogo Inicial de Logéthos (respostas pré-definidas):**
        *   `const logethosDialog = [`
        *   `    "[LOGÉTHOS]: Pequena alma errante... buscas clareza nas brumas da existência. O que anseias compreender?",`
        *   `    "[PINKY]: Eu... eu não sei quem sou, ou por que estou aqui. Só sei que preciso... ir além.",`
        *   `    "[LOGÉTHOS]: Ir além é a natureza da consciência. Muitos caminhos se abrem, mas apenas um te levará à verdadeira <span class='highlight-term'>transcendência</span>. A Fenda do Primeiro Raio te aguarda, mas a travessia exige mais do que simples vontade.",`
        *   `    "[LOGÉTHOS]: Ela requer uma ponte entre o que <span class='glitch-word-magenta'>é</span> e o que <span class='glitch-word-green'>pode ser</span>. Uma... <span class='highlight-term'>Realidade Aumentada</span> pela percepção.",`
        *   `    "[PINKY]: Realidade Aumentada... os livros na biblioteca falavam disso! Então é esse o caminho?",`
        *   `    "[LOGÉTHOS]: O conhecimento aponta a direção, mas a jornada é tua. Segue para Nocthryn, onde a Fenda pulsa."`
        *   `];`
    *   Exibir este diálogo na `.dialog-box-oraculo`.
    *   **Consideração para IA (Opcional/Avançado):** Se for tentar integrar com ChatGPT/Grok, aqui seria o ponto para enviar um prompt inicial e permitir algumas perguntas limitadas do jogador, com Logéthos respondendo. Para a versão base, as respostas pré-definidas são suficientes.

11. **Implementação da Conquista "Percepção Séptupla":**
    *   Ao finalizar o diálogo principal com Logéthos, verificar se a conquista ainda não foi obtida.
    *   Se não, exibir a `#conquista-notificacao` com o texto "Conquista Desbloqueada: Percepção Séptupla!".
    *   Marcar a conquista como obtida.

12. **Navegação de Saída de Aurorix (Altar e Oráculo):**
    *   Implementar pontos de saída nas telas do Altar e do Oráculo (ou uma saída única da capitania se forem conectadas internamente) que retornam à `mapa-screen`.

13. **Testes e Ajustes da Fase 06:**
    *   Testar a entrada e saída de Aurorix (Altar e Oráculo) a partir do mapa.
    *   Verificar a renderização dos cenários, Pinky e o visual de Logéthos.
    *   Testar a interação com o Altar (texto descritivo, efeitos visuais/sonoros).
    *   Testar o fluxo de diálogo com Logéthos.
    *   Verificar a exibição da notificação de conquista "Percepção Séptupla".
    *   Ajustar layouts, sprites, textos, efeitos e fluxos de interação conforme necessário.

**Entregável da Fase 06:** A Capitania de Aurorix funcional, com o Altar e o Oráculo implementados, permitindo ao jogador interagir com os elementos místicos, dialogar com Logéthos para obter mais clareza sobre seu objetivo e a Realidade Aumentada, e ganhar uma nova conquista.
