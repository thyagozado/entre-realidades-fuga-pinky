# Fase 04: Criação do Mundo 16-bit Inicial e Mapa Principal

**Objetivo Principal:** Desenvolver o primeiro cenário 16-bit (Bosque Decrépito) onde Pinky chega após a transição dimensional, implementar seus diálogos iniciais neste novo mundo, e criar o mapa-múndi navegável de Élofen (estilo Final Fantasy IV) que permitirá o acesso às diferentes capitanias.

**Microtarefas Detalhadas:**

1.  **Preparação Pós-Transição Dimensional:**
    *   No `script.js`, na função que finaliza a `transition-screen` (final da Fase 03), adicionar a lógica para exibir a `bosque-screen` (a ser criada).

2.  **Criação dos Assets Visuais para o Mundo 16-bit:**
    *   **Sprite de Pinky 16-bit:** Criar ou obter um sprite sheet para Pinky no estilo pixel art 16-bit, incluindo animações de "idle" (parado) e "caminhada" (esquerda/direita). Salvar como `pinky_sprite_16bit.png` em `assets/images/`.
    *   **Tileset do Bosque Decrépito:** Criar ou obter um tileset de pixel art 16-bit para um ambiente de floresta/bosque com um tom melancólico ou misterioso (árvores, chão, arbustos, elementos de fundo para um efeito 2.5D). Salvar como `bosque_tileset_16bit.png` em `assets/images/`.

3.  **Estrutura HTML para a Tela do Bosque Decrépito (`bosque-screen`):**
    *   No `index.html`, adicionar um novo `div` com o id `bosque-screen` (inicialmente com `display: none;`).
    *   Dentro de `bosque-screen`, adicionar um `canvas` (ex: `id="bosque-canvas"`) para renderizar o cenário e Pinky, ou usar `divs` para uma abordagem baseada em DOM se preferível para o estilo 2.5D.
    *   Adicionar um `div` para a caixa de diálogo (ex: `class="dialog-box-bosque"`).

4.  **Estilização CSS da Tela do Bosque Decrépito:**
    *   No `style.css`, estilizar `#bosque-screen` (fundo base se o canvas não cobrir tudo, dimensões, posicionamento absoluto para sobrepor outras telas, `z-index: 40;`).
    *   Estilizar `#bosque-canvas` (dimensões, `image-rendering: pixelated;`).

5.  **Lógica JavaScript para Renderização do Cenário do Bosque:**
    *   No `script.js`, criar uma função `renderBosque()`.
    *   Carregar o `bosque_tileset_16bit.png`.
    *   Implementar a lógica para desenhar o cenário do Bosque Decrépito no `#bosque-canvas` usando o tileset. Considerar camadas para um efeito de profundidade (2.5D parallax scrolling simples se o movimento for lateral).

6.  **Lógica JavaScript para Pinky no Bosque (Sprite e Posicionamento):**
    *   Carregar o `pinky_sprite_16bit.png`.
    *   Criar uma função para desenhar o sprite de Pinky 16-bit no canvas, com base em seu estado (idle, caminhando) e direção.
    *   Posicionar Pinky no ponto de entrada do bosque (ex: lado esquerdo da tela).

7.  **Implementação da Caixa de Diálogo e Diálogos Iniciais no Bosque:**
    *   No `style.css`, estilizar `.dialog-box-bosque` (estilo RPG 16-bit, posicionada adequadamente na tela do bosque, fonte pixelada apropriada).
    *   No `script.js`, criar uma array com os diálogos de Pinky no bosque:
        *   `const bosqueDialogs = [`
        *   `    "[FANTASMA]: Isso... isso <span class='glitch-word-magenta'>e</span> diferente.",`
        *   `    "[FANTASMA]: E como se eu pudesse... <span class='glitch-word-green'>escolher</span> aonde ir?",`
        *   `    "[FANTASMA]: Preciso <span class='glitch-word-magenta'>entender</span> o que esta acontecendo..."`
        *   `];`
    *   No `style.css`, criar as classes `glitch-word-magenta` e `glitch-word-green` para aplicar as cores de falha de memória (magenta e verde) a palavras específicas.
    *   Implementar a lógica para exibir esses diálogos sequencialmente na `.dialog-box-bosque`, com avanço por clique.

8.  **Lógica JavaScript para Controle de Pinky no Bosque:**
    *   Implementar o controle de movimento lateral (esquerda/direita) para Pinky 16-bit usando as teclas de seta.
    *   Atualizar a animação do sprite de Pinky (idle/caminhada) com base no movimento.

9.  **Definição de Limites e Gatilho de Transição para o Mapa:**
    *   Definir os limites do cenário do bosque (ex: Pinky não pode ir muito para a esquerda – "beco sem saída").
    *   Quando Pinky alcançar a borda direita do cenário do bosque, acionar a transição para a tela do mapa principal.

10. **Criação dos Assets Visuais para o Mapa Principal (Élofen):**
    *   **Tileset do Mapa Élofen:** Criar ou obter um tileset de pixel art 16-bit para um mapa-múndi estilo top-down (similar a Final Fantasy IV), com terrenos variados (grama, montanhas, água, florestas). Salvar como `mapa_elofen_tileset.png`.
    *   **Ícones das Capitanias:** Criar ou obter pequenos ícones/sprites para representar as quatro capitanias (Portaelys, Sylvaris, Aurorix, Nocthryn) no mapa. Salvar individualmente ou como um sprite sheet.
    *   **Sprite de Pinky para o Mapa:** Criar ou obter um pequeno sprite de Pinky para representá-lo no mapa-múndi. Salvar como `pinky_map_sprite.png`.

11. **Estrutura HTML para a Tela do Mapa Principal (`mapa-screen`):**
    *   No `index.html`, adicionar um novo `div` com o id `mapa-screen` (inicialmente `display: none;`).
    *   Dentro de `mapa-screen`, adicionar um `canvas` (ex: `id="mapa-elofen-canvas"`) para renderizar o mapa.
    *   Adicionar elementos para exibir o nome da localidade selecionada (ex: `id="mapa-location-name"`).

12. **Estilização CSS da Tela do Mapa Principal:**
    *   No `style.css`, estilizar `#mapa-screen` e `#mapa-elofen-canvas` (dimensões, posicionamento, `z-index: 50;`).
    *   Estilizar `#mapa-location-name` (fonte, cor, posicionamento na tela do mapa).

13. **Lógica JavaScript para Renderização do Mapa de Élofen:**
    *   No `script.js`, criar uma função `renderMapaElofen()`.
    *   Carregar o `mapa_elofen_tileset.png` e os ícones das capitanias.
    *   Implementar a lógica para desenhar o mapa de Élofen no `#mapa-elofen-canvas` usando o tileset.
    *   Posicionar os ícones das capitanias em suas respectivas localizações no mapa.
    *   Desenhar o sprite de Pinky (`pinky_map_sprite.png`) na sua posição inicial no mapa (ex: em Portaelys).

14. **Lógica JavaScript para Navegação no Mapa:**
    *   Implementar a lógica para mover um cursor de seleção ou o próprio `pinky_map_sprite` sobre os ícones das capitanias usando as teclas de seta.
    *   Ao focar em um ícone de capitania, destacar o ícone e exibir seu nome em `#mapa-location-name`.
    *   Permitir a confirmação da seleção (ex: tecla Enter/Espaço).

15. **Lógica JavaScript para Transição do Mapa para Localidades:**
    *   Ao confirmar a seleção de uma capitania, ocultar a `mapa-screen`.
    *   Chamar a função de inicialização da tela da respectiva localidade (ex: `initBibliotecaScreen()` se Sylvaris for selecionada e a Biblioteca for o ponto de entrada).

16. **Testes e Ajustes da Fase 04:**
    *   Testar a transição da `transition-screen` para a `bosque-screen`.
    *   Verificar a renderização do Bosque Decrépito e do sprite 16-bit de Pinky.
    *   Testar os diálogos no bosque, incluindo o efeito "falha de memória".
    *   Testar o controle de Pinky no bosque e os limites do cenário.
    *   Testar a transição do bosque para a `mapa-screen`.
    *   Verificar a renderização do mapa de Élofen, ícones das capitanias e sprite de Pinky no mapa.
    *   Testar a navegação no mapa (seleção de capitanias, feedback visual e textual).
    *   Testar a transição do mapa para uma tela de localidade (placeholder por enquanto, se a Fase 05 não estiver iniciada).
    *   Ajustar visuais, controles, timings e lógica conforme necessário.

**Entregável da Fase 04:** Um protótipo funcional que inclui o primeiro cenário 16-bit (Bosque Decrépito) com interações básicas de Pinky, e um mapa-múndi navegável (Élofen) que permite ao jogador selecionar diferentes capitanias para exploração futura.
