# Fase 01: Desenvolvimento da Introdução e Gameplay Arcade (8-bit)

**Objetivo Principal:** Criar a tela de início interativa com a estética arcade retro, a simulação do gameplay automático do Pac-Man e o gatilho para a consciência de Pinky, conforme a referência visual e o plano de desenvolvimento.

**Microtarefas Detalhadas:**

1.  **Configuração Inicial do Ambiente de Desenvolvimento:**
    *   Criar a pasta raiz do projeto (ex: `fantasma_ra_projeto`).
    *   Dentro da pasta raiz, criar os arquivos `index.html`, `style.css`, `script.js`.
    *   Criar uma subpasta `assets/` e dentro dela uma subpasta `images/` para armazenar todos os recursos visuais.
    *   Considerar um sistema de controle de versão (Git) desde o início.

2.  **Estrutura HTML Base para a Tela de Início (`index.html`):**
    *   Definir o `DOCTYPE` e a tag `html` com o atributo `lang="pt-BR"`.
    *   Incluir as metatags essenciais no `<head>` (charset, viewport, title "Projeto Fantasma RA").
    *   Linkar o arquivo `style.css`.
    *   No `<body>`, criar um `div` principal com a classe `start-screen` que englobará todos os elementos da tela de início.
    *   Adicionar um `div` com a classe `grid-overlay` dentro do `body` (ou do `start-screen` se o grid for contido) para o efeito de grade neon.
    *   Adiar a inclusão do `script.js` para o final do `<body>`.

3.  **Estilização CSS Base e Efeitos de Fundo (`style.css`):**
    *   Importar a fonte pixelada (ex: 'Press Start 2P' do Google Fonts ou uma local).
    *   Aplicar ao `body`: `background-color: #000;`, `color: #fff;`, `font-family` pixelada, `margin: 0;`, `padding: 0;`, `display: flex;`, `justify-content: center;`, `align-items: center;`, `min-height: 100vh;`, `position: relative;`, `overflow: hidden;`.
    *   **Efeito Scanlines:** Implementar o efeito de scanlines sutis usando o pseudo-elemento `body::after` com `repeating-linear-gradient`.
    *   **Grid Neon Animado:** Implementar o overlay do grid (`.grid-overlay`) com duas camadas (`::before` e `::after`) para as cores ciano (#00FFFF) e magenta (#FF00FF). Aplicar animações CSS (`@keyframes`) para movimento sutil e um efeito de "glitch" de malha (usando `clip-path` e `transform` em intervalos irregulares).

4.  **Implementação do Logo do Jogo:**
    *   No `index.html`, dentro de `.start-screen`, adicionar um `<h1>` com a classe `logo`.
    *   Dentro do `<h1>`, usar `<span>` com classes específicas (ex: `logo-projeto` e `logo-fantasma-ra`) para "PROJETO" e "FANTASMA RA", permitindo estilização de cores diferentes.
    *   No `style.css`, estilizar `.logo` (tamanho da fonte, margens, espaçamento entre letras, alinhamento).
    *   Estilizar `.logo-projeto` com cor ciano e `text-shadow` para brilho neon.
    *   Estilizar `.logo-fantasma-ra` com cor magenta e `text-shadow` para brilho neon.

5.  **Implementação da Imagem de Gameplay do Pac-Man:**
    *   Salvar a imagem `pacman_atari_gameplay.png` (obtida anteriormente) na pasta `assets/images/`.
    *   No `index.html`, adicionar um `div` com a classe `pacman-gameplay-container`.
    *   Dentro deste `div`, inserir uma tag `<img>` com `id="pacman-gameplay-img"`, `src="assets/images/pacman_atari_gameplay.png"`, e `alt="Gameplay Pac-Man"`.
    *   No `style.css`, estilizar `#pacman-gameplay-img` (largura fixa, `height: auto;`, `image-rendering: pixelated;` para manter a nitidez dos pixels, margens).

6.  **Implementação dos Sprites Extras (Placeholders):**
    *   No `index.html`, abaixo do container do gameplay, adicionar um `div` com a classe `extra-sprites-container`.
    *   Dentro deste `div`, adicionar duas tags `<img>` com a classe `extra-sprite` e `alt="Extra Sprite"`. Usar placeholders de imagem (ex: `assets/images/extra_sprite1_placeholder.png`, `assets/images/extra_sprite2_placeholder.png`) ou omitir o `src` por enquanto se os assets não existirem.
    *   No `style.css`, estilizar `.extra-sprites-container` (`display: flex;`, `justify-content: center;`, margens).
    *   Estilizar `.extra-sprite` (largura, altura, `image-rendering: pixelated;`, margens entre eles, `background-color` temporária se `src` estiver omitido).

7.  **Implementação da Caixa de Diálogo Inicial:**
    *   No `index.html`, adicionar um `div` com a classe `dialog-box` (ou usar estrutura do NES.css se for o caso).
    *   Dentro da caixa, adicionar um `div` ou `p` para o título "[FANTASMA]" (classe `dialog-title`) e outro `p` para o texto "Sempre o mesmo ciclo... Eles correm... Ele os devora..." (id `dialog-text`).
    *   No `style.css`, estilizar `.dialog-box` (largura, `max-width`, margens, borda neon ciano, `background-color` escura, `box-shadow` para brilho, `padding`).
    *   Estilizar `.dialog-title` (cor ciano, alinhamento, fonte).
    *   Estilizar `#dialog-text` (cor branca, alinhamento, fonte, `line-height`).

8.  **Implementação do Botão "Iniciar Consciência":**
    *   No `index.html`, abaixo da caixa de diálogo, adicionar um elemento `<button>` com a classe `nes-btn neon-button` (ou classe customizada) e o texto `> Iniciar Consciência`.
    *   No `style.css`, estilizar `.neon-button` (fonte pixelada, cor base branca, fundo preto, borda branca, `padding`, `transition`).
    *   Implementar o efeito `:hover` para o botão (borda magenta neon, cor do texto magenta, `box-shadow` para brilho, animação de pulso leve com `@keyframes` se desejado).

9.  **Lógica JavaScript Inicial (`script.js`):**
    *   Adicionar um listener `DOMContentLoaded` para garantir que o DOM esteja carregado antes de executar scripts.
    *   **Simulação de Gameplay Automático Pac-Man (Placeholder Inicial):** Esboçar uma função `startPacManAnimation()` que, futuramente, controlaria a animação do Pac-Man na tela de gameplay (movimento, "comer" elementos). *Para esta fase inicial, pode ser apenas um console.log ou uma animação visual muito simples se o foco for a tela de start estática da referência.*
    *   **Gatilho para Consciência de Pinky (Placeholder Inicial):** Definir uma lógica ou evento (ex: após um tempo, ou se a animação do Pac-Man fosse implementada, quando ele se aproximasse de um ponto específico) que acionaria a transição para a próxima fase (consciência de Pinky). Por enquanto, o clique no botão "Iniciar Consciência" servirá como gatilho principal para a próxima fase, mas esta lógica de gameplay automático pode ser desenvolvida em paralelo ou posteriormente.

10. **Testes e Ajustes Iniciais:**
    *   Abrir `index.html` no navegador.
    *   Verificar se todos os elementos visuais estão conforme a referência (logo, imagem do Pac-Man, caixa de diálogo, botão).
    *   Testar o efeito de grid neon e scanlines.
    *   Verificar o efeito hover do botão.
    *   Ajustar CSS (cores, tamanhos, espaçamentos, posicionamentos) conforme necessário para máxima fidelidade visual.
    *   Garantir responsividade mínima (centralização dos elementos em diferentes larguras de tela).

**Entregável da Fase 01:** Uma tela de início funcional e visualmente fiel à referência, com todos os elementos estáticos e efeitos de fundo implementados. A lógica de gameplay automático do Pac-Man e o gatilho para a consciência de Pinky estarão esboçados ou com placeholders, com o botão "Iniciar Consciência" pronto para acionar a próxima fase no desenvolvimento subsequente.
