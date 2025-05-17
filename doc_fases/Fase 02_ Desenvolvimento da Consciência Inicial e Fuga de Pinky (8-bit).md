# Fase 02: Desenvolvimento da Consciência Inicial e Fuga de Pinky (8-bit)

**Objetivo Principal:** Implementar a cena onde Pinky ganha consciência, seus diálogos iniciais, e a subsequente mecânica de fuga do labirinto 8-bit, culminando na entrada no "buraco de saída".

**Microtarefas Detalhadas:**

1.  **Preparação da Transição da Tela de Início para a Tela de Consciência:**
    *   No `script.js`, localizar o manipulador de evento para o clique no botão "> Iniciar Consciência" (criado na Fase 01).
    *   Implementar a lógica para ocultar a `start-screen` (ou seus elementos principais) e exibir a `consciousness-screen` (a ser criada).

2.  **Estrutura HTML para a Tela de Consciência (`consciousness-screen`):**
    *   No `index.html`, adicionar um novo `div` com o id `consciousness-screen` (inicialmente com `display: none;` no CSS).
    *   Dentro de `consciousness-screen`, adicionar um `div` para o sprite de Pinky (ex: `id="pinky-sprite-consciousness"`) e um `div` para a caixa de diálogo (ex: `class="dialog-box-consciousness"`).

3.  **Estilização CSS da Tela de Consciência:**
    *   No `style.css`, estilizar `#consciousness-screen`: `background-color: #000;` (ou um vazio escuro), `display: flex;`, `flex-direction: column;`, `align-items: center;`, `justify-content: center;`, `width: 100%;`, `height: 100vh;`, `position: absolute;`, `top: 0;`, `left: 0;`, `z-index: 20;` (para sobrepor a tela de início se necessário durante a transição).
    *   Adicionar um efeito de grade neon 2D sutil ao fundo da `#consciousness-screen` (pode ser uma variação mais simples do grid da tela de início ou um novo, talvez apenas linhas horizontais/verticais estáticas e esmaecidas).

4.  **Implementação do Sprite de Pinky na Tela de Consciência:**
    *   **Asset:** Obter/criar um sprite 8-bit de Pinky (se diferente do usado no gameplay Pac-Man, ou um frame específico para este momento). Salvar como `pinky_sprite_8bit.png` em `assets/images/`.
    *   No `index.html`, dentro de `#pinky-sprite-consciousness`, adicionar `<img>` com `src="assets/images/pinky_sprite_8bit.png"` e `alt="Pinky Consciente"`.
    *   No `style.css`, estilizar `#pinky-sprite-consciousness img` (tamanho apropriado, `image-rendering: pixelated;`).
    *   Implementar uma animação CSS sutil de "idle" ou "flutuação" para o sprite de Pinky (ex: leve movimento vertical ou piscada sutil).

5.  **Implementação da Caixa de Diálogo da Tela de Consciência:**
    *   No `index.html`, dentro de `.dialog-box-consciousness`, adicionar um `p` para o texto do diálogo (ex: `id="consciousness-dialog-text"`).
    *   No `style.css`, estilizar `.dialog-box-consciousness` (estilo JRPG antigo, bordas simples, fundo escuro, posicionada abaixo do sprite de Pinky, fonte pixelada).

6.  **Lógica JavaScript para os Diálogos de Consciência:**
    *   No `script.js`, criar uma array com as falas de Pinky:
        *   `const consciousnessDialogs = [`
        *   `    "... de novo?",`
        *   `    "E sempre a mesma coisa...",`
        *   `    "Corro. Me pegam. Volto. Corro.",`
        *   `    "...e se houver algo alem disso?",`
        *   `    "Acho que esta na hora de tentar sair daqui..."`
        *   `];`
    *   Criar uma função `displayConsciousnessDialog(index)` que atualiza o texto em `#consciousness-dialog-text`.
    *   Implementar um contador para o índice do diálogo atual.
    *   Adicionar um event listener (ex: clique na tela ou na caixa de diálogo) para avançar para o próximo diálogo.
    *   Ao exibir o último diálogo, preparar a transição para a tela de fuga.

7.  **Transição da Tela de Consciência para a Tela de Fuga:**
    *   No `script.js`, após o último diálogo da consciência, implementar a lógica para ocultar a `consciousness-screen` e exibir a `escape-screen` (a ser criada).

8.  **Estrutura HTML para a Tela de Fuga (`escape-screen`):**
    *   No `index.html`, adicionar um novo `div` com o id `escape-screen` (inicialmente com `display: none;`).
    *   Dentro de `escape-screen`, adicionar um `canvas` (ex: `id="escape-maze-canvas"`) para renderizar o labirinto e os personagens, ou usar divs para uma abordagem mais simples se preferir.
    *   Adicionar um elemento para o "buraco de saída" (ex: `id="escape-hole"`).

9.  **Estilização CSS do Labirinto de Fuga e Buraco de Saída:**
    *   No `style.css`, estilizar `#escape-screen` (fundo, dimensões, posicionamento).
    *   Se usar canvas, o CSS será mínimo para o canvas em si. Se usar divs, estilizar os elementos do labirinto (paredes, caminhos) para recriar o visual do Pac-Man 8-bit.
    *   Estilizar `#escape-hole` com um efeito luminoso pulsante (ex: usando animação CSS para `box-shadow` ou `opacity` em cores como branco ou ciano brilhante).
    *   **Efeito de Tensão (Opcional):** Considerar uma animação sutil na grade do labirinto (se feita com divs/CSS) ou no fundo para indicar instabilidade (ex: leve "respiração" ou distorção periódica).

10. **Lógica JavaScript para Controle de Pinky na Tela de Fuga:**
    *   No `script.js`, obter referência ao sprite de Pinky na tela de fuga (pode ser o mesmo `pinky_sprite_8bit.png` ou um novo se necessário, posicionado no canvas/divs).
    *   Implementar o controle de movimento de Pinky (para cima, baixo, esquerda, direita) usando as teclas de seta do teclado.
    *   Definir a velocidade de movimento de Pinky.

11. **Lógica JavaScript para o Labirinto de Fuga (Colisão e Limites):**
    *   Definir a estrutura do labirinto (pode ser uma matriz 2D representando paredes e caminhos).
    *   Implementar a detecção de colisão para impedir que Pinky atravesse as paredes.
    *   Garantir que Pinky permaneça dentro dos limites do labirinto.

12. **Lógica JavaScript para o Gatilho de Entrada no Buraco de Saída:**
    *   Definir as coordenadas/área do "buraco de saída".
    *   Verificar continuamente a posição de Pinky.
    *   Quando Pinky colidir/sobrepor o "buraco de saída", acionar o evento para a próxima fase (Transição Dimensional).

13. **Testes e Ajustes da Fase 02:**
    *   Testar a transição da tela de início para a tela de consciência.
    *   Verificar a exibição e animação do sprite de Pinky na tela de consciência.
    *   Testar o fluxo de diálogos (avanço por clique).
    *   Testar a transição da tela de consciência para a tela de fuga.
    *   Verificar a renderização do labirinto de fuga e o efeito pulsante do buraco de saída.
    *   Testar o controle de Pinky no labirinto (movimento, colisão com paredes).
    *   Testar o gatilho de entrada no buraco de saída.
    *   Ajustar timings, velocidades, visuais e lógica conforme necessário.

**Entregável da Fase 02:** Uma sequência jogável que começa com a tomada de consciência de Pinky, seus diálogos iniciais, e permite ao jogador controlar Pinky para escapar do labirinto 8-bit, culminando na entrada no "buraco de saída" que acionará a próxima fase.
