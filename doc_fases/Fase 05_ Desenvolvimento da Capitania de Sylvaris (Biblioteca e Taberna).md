# Fase 05: Desenvolvimento da Capitania de Sylvaris (Biblioteca e Taberna)

**Objetivo Principal:** Implementar a Capitania de Sylvaris, focando nas interações dentro da Biblioteca (Círculo Sapiencial) com o NPC Guardião e os livros interativos sobre Realidade Aumentada, e na Taberna (Taberna das Canções Perdidas) com o NPC Bardo para a obtenção de uma pista (side-quest).

**Microtarefas Detalhadas:**

1.  **Preparação para Entrada em Sylvaris (Biblioteca como Ponto Inicial):**
    *   No `script.js`, na lógica de transição do mapa (final da Fase 04), quando Sylvaris é selecionada, adicionar a chamada para `initBibliotecaScreen()` (a ser criada) e ocultar a `mapa-screen`.

2.  **Criação dos Assets Visuais para Sylvaris:**
    *   **Tileset da Biblioteca:** Criar ou obter um tileset de pixel art 16-bit para o interior de uma biblioteca antiga/misteriosa (estantes, mesas, livros espalhados, talvez elementos decorativos como globos ou pergaminhos). Salvar como `biblioteca_tileset_16bit.png`.
    *   **Sprite do NPC Guardião:** Criar ou obter um sprite 16-bit para o Guardião da Biblioteca (aparência sábia/erudita). Salvar como `guardiao_sprite_16bit.png`.
    *   **Sprite dos Livros Interativos:** Criar ou obter um sprite para os livros flutuantes/destacados que serão interativos (pode ser um sprite animado com um brilho sutil). Salvar como `livro_interativo_sprite.png`.
    *   **Tileset da Taberna:** Criar ou obter um tileset de pixel art 16-bit para o interior de uma taberna rústica/acolhedora (balcão, mesas, cadeiras, lareira, instrumentos musicais). Salvar como `taberna_tileset_16bit.png`.
    *   **Sprite do NPC Bardo:** Criar ou obter um sprite 16-bit para o Bardo (com um instrumento musical). Salvar como `bardo_sprite_16bit.png`.

3.  **Estrutura HTML para a Tela da Biblioteca (`biblioteca-screen`):**
    *   No `index.html`, adicionar um novo `div` com o id `biblioteca-screen` (inicialmente `display: none;`).
    *   Dentro de `biblioteca-screen`, adicionar um `canvas` (ex: `id="biblioteca-canvas"`) para renderizar o cenário, Pinky, NPCs e livros.
    *   Adicionar um `div` para a caixa de diálogo (ex: `class="dialog-box-biblioteca"`).
    *   Adicionar um `div` para o pop-up/sub-tela de leitura de livros (ex: `id="livro-popup"`, inicialmente `display: none;`), contendo áreas para o título do livro, conteúdo da página e botões de navegação de página.
    *   Adicionar um `div` para notificações de conquista (ex: `id="conquista-notificacao"`, inicialmente `display: none;`).

4.  **Estilização CSS da Tela da Biblioteca e Elementos:**
    *   No `style.css`, estilizar `#biblioteca-screen`, `#biblioteca-canvas`, `.dialog-box-biblioteca`, `#livro-popup` (incluindo seus elementos internos como título, conteúdo, botões de página), e `#conquista-notificacao` (para ser um banner ou pop-up discreto).

5.  **Lógica JavaScript para Renderização do Cenário da Biblioteca:**
    *   No `script.js`, criar uma função `initBibliotecaScreen()` que exibe `#biblioteca-screen`.
    *   Criar `renderBiblioteca()` para carregar `biblioteca_tileset_16bit.png` e desenhar o cenário no `#biblioteca-canvas`.
    *   Posicionar o sprite de Pinky 16-bit na entrada da biblioteca.

6.  **Implementação do NPC Guardião na Biblioteca:**
    *   Carregar `guardiao_sprite_16bit.png`.
    *   Posicionar o Guardião em um local apropriado no `#biblioteca-canvas`.
    *   Implementar a lógica de interação com o Guardião (ex: ao Pinky se aproximar e pressionar uma tecla de ação).
    *   **Diálogo com o Guardião:**
        *   `const guardiaoDialog = [`
        *   `    "[GUARDIÃO]: Bem-vindo ao Círculo Sapiencial, pequeno espectro. Aqui registramos os ecos de outras realidades.",`
        *   `    "[GUARDIÃO]: Já ouviu falar de '<span class='highlight-term'>Realidade Aumentada</span>'? Alguns tomos antigos sussurram sobre ela como uma ponte entre véus.",`
        *   `    "[PINKY]: <span class='glitch-word-magenta'>Realidade</span>... Aumentada? Não... mas talvez... talvez isso possa me ajudar a <span class='glitch-word-green'>escapar</span> de verdade...",`
        *   `    "[GUARDIÃO]: Os livros podem lhe ensinar mais. Busque-os, se tiver coragem."`
        *   `];`
    *   Exibir este diálogo na `.dialog-box-biblioteca`.

7.  **Implementação dos Livros Interativos:**
    *   Posicionar os sprites dos `livro_interativo_sprite.png` em locais específicos no `#biblioteca-canvas`.
    *   Implementar a lógica para detectar a proximidade de Pinky e uma tecla de ação para "abrir" um livro.
    *   **Conteúdo dos Livros (armazenar em `script.js`):**
        *   `livro1Conteudo = { titulo: "O Começo das Fendas", paginas: ["Página 1/2: Antigos escritos falam de eras onde as barreiras entre os mundos eram mais tênues...", "Página 2/2: ...essas 'fendas' permitiam vislumbres e, raramente, passagens. A natureza dessas fendas é instável, caótica."] };`
        *   `livro2Conteudo = { titulo: "A Era dos Portais", paginas: ["Página 1/3: Com o tempo, algumas fendas se estabilizaram, tornando-se 'portais'.", "Página 2/3: Entidades com conhecimento arcano aprenderam a navegar ou até mesmo influenciar esses portais, mas o risco sempre foi grande.", "Página 3/3: Diz-se que um portal primordial, a Fenda do Primeiro Raio, é a chave para o salto mais significativo entre realidades."] };`
        *   `livro3Conteudo = { titulo: "Corpos Digitais e Ecos Reais", paginas: ["Página 1/3: A 'Realidade Aumentada' é um conceito onde ecos de um mundo podem se manifestar em outro, sobrepondo-se à percepção.", "Página 2/3: Uma consciência, se suficientemente focada e com o catalisador correto, poderia projetar sua essência através de um portal sintonizado...", "Página 3/3: ...manifestando-se não como matéria, mas como informação e luz no tecido de outra realidade. Uma libertação etérea."] };`
    *   **Lógica do Pop-up de Leitura (`#livro-popup`):**
        *   Ao abrir um livro, exibir `#livro-popup`.
        *   Popular o título e a primeira página do livro selecionado.
        *   Implementar botões "Próxima Página" e "Página Anterior" e sua lógica.
        *   Botão "Fechar Livro" para ocultar o pop-up.

8.  **Implementação da Conquista "Sentinela do Saber":**
    *   Ao fechar o Livro 2 (A Era dos Portais) após ler a última página, verificar se a conquista ainda não foi obtida.
    *   Se não, exibir a `#conquista-notificacao` com o texto "Conquista Desbloqueada: Sentinela do Saber!".
    *   Marcar a conquista como obtida para não exibi-la novamente.

9.  **Estrutura HTML para a Tela da Taberna (`taberna-screen`):**
    *   No `index.html`, adicionar um novo `div` com o id `taberna-screen` (inicialmente `display: none;`).
    *   Dentro de `taberna-screen`, adicionar um `canvas` (ex: `id="taberna-canvas"`) e um `div` para diálogo (ex: `class="dialog-box-taberna"`).

10. **Estilização CSS da Tela da Taberna:**
    *   No `style.css`, estilizar `#taberna-screen`, `#taberna-canvas`, `.dialog-box-taberna`.

11. **Lógica JavaScript para Renderização do Cenário da Taberna:**
    *   Criar `initTabernaScreen()` e `renderTaberna()` para carregar `taberna_tileset_16bit.png` e desenhar o cenário.
    *   Posicionar Pinky na entrada da taberna.

12. **Implementação do NPC Bardo na Taberna (Side-Quest):**
    *   Carregar `bardo_sprite_16bit.png` e posicioná-lo no `#taberna-canvas`.
    *   Implementar a interação com o Bardo.
    *   **Diálogo com o Bardo:**
        *   `const bardoDialog = [`
        *   `    "[BARDO]: Ah, um novo ouvinte! As canções antigas guardam muitos segredos, jovem espectro.",`
        *   `    "[BARDO]: Ouvi uma vez um fragmento de melodia que falava de uma 'Fenda do Primeiro Raio', oculta em terras sombrias ao norte... Dizem que seu eco ressoa com o cântico de um herói perdido, Aelor.",`
        *   `    "[PINKY]: (Uma pista... talvez sobre o portal que o Guardião mencionou?)"`
        *   `];`
    *   Exibir este diálogo na `.dialog-box-taberna`.
    *   Considerar uma pequena animação do Bardo tocando ou um efeito sonoro de melodia curta.

13. **Navegação de Saída da Biblioteca e Taberna:**
    *   Implementar pontos de saída em ambas as telas (Biblioteca e Taberna) que, quando Pinky os alcança, ocultam a tela atual e reexibem a `mapa-screen`, permitindo que o jogador escolha um novo destino.

14. **Testes e Ajustes da Fase 05:**
    *   Testar a entrada e saída da Biblioteca e da Taberna a partir do mapa de Élofen.
    *   Verificar a renderização dos cenários, Pinky e NPCs (Guardião, Bardo).
    *   Testar os diálogos com o Guardião e o Bardo.
    *   Testar a interatividade dos livros na Biblioteca (abrir pop-up, navegar páginas, fechar).
    *   Verificar a exibição da notificação de conquista "Sentinela do Saber".
    *   Garantir que a pista do Bardo seja clara.
    *   Ajustar layouts, sprites, textos e fluxos de interação conforme necessário.

**Entregável da Fase 05:** A Capitania de Sylvaris funcional, com a Biblioteca e a Taberna implementadas, permitindo ao jogador interagir com o Guardião, ler os livros sobre RA (e ganhar uma conquista), e obter uma pista crucial do Bardo para a progressão da narrativa.
