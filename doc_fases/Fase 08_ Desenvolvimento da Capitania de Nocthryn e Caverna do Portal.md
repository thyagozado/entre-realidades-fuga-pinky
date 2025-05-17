# Fase 08: Desenvolvimento da Capitania de Nocthryn e Caverna do Portal

**Objetivo Principal:** Criar o ambiente final da Capitania de Nocthryn, especificamente a Caverna do Portal (Fenda do Primeiro Raio), implementar os diálogos finais de Pinky antes da decisão de ativar a Realidade Aumentada, e o prompt de interação com o portal.

**Microtarefas Detalhadas:**

1.  **Preparação para Entrada em Nocthryn (Caverna do Portal):**
    *   No `script.js`, na lógica de transição do mapa (final da Fase 04), quando Nocthryn é selecionada (e o jogador tem as pistas necessárias, conforme Fase 07), adicionar a chamada para `initCavernaPortalScreen()` (a ser criada) e ocultar a `mapa-screen`.

2.  **Criação dos Assets Visuais para Nocthryn e a Caverna do Portal:**
    *   **Tileset da Caverna do Portal:** Criar ou obter um tileset de pixel art 16-bit para um ambiente de caverna escura e mística. Deve incluir elementos como rochas, cristais talvez, e texturas que permitam criar um portal brilhante ou uma fenda na rocha. Cores predominantes podem ser azuis escuros, púrpuras, com o portal emitindo uma luz contrastante (ciano/branco). Salvar como `caverna_portal_tileset_16bit.png`.
    *   **Efeitos de Partículas:** Preparar pequenos sprites para partículas (poeira caindo, brilhos emanando do portal) se forem ser implementadas via sprites. Salvar como `particle_effects_sprite.png` ou similar.

3.  **Estrutura HTML para a Tela da Caverna do Portal (`caverna-portal-screen`):**
    *   No `index.html`, adicionar um novo `div` com o id `caverna-portal-screen` (inicialmente `display: none;`).
    *   Dentro de `caverna-portal-screen`, adicionar um `canvas` (ex: `id="caverna-portal-canvas"`) para renderizar o cenário, Pinky e o portal.
    *   Adicionar um `div` para a caixa de diálogo (ex: `class="dialog-box-caverna"`).
    *   Adicionar um `div` para o prompt de decisão do portal (ex: `id="portal-decision-prompt"`, inicialmente `display: none;`), contendo o texto da pergunta e os botões "Sim" e "Retornar".

4.  **Estilização CSS da Tela da Caverna do Portal e Elementos:**
    *   No `style.css`, estilizar `#caverna-portal-screen`, `#caverna-portal-canvas`, `.dialog-box-caverna`, e `#portal-decision-prompt` (incluindo seus botões).

5.  **Lógica JavaScript para Renderização do Cenário da Caverna do Portal:**
    *   Criar `initCavernaPortalScreen()` e `renderCavernaPortal()` para carregar `caverna_portal_tileset_16bit.png`.
    *   Desenhar o cenário da caverna no `#caverna-portal-canvas`, destacando a "Fenda do Primeiro Raio" (o portal) com um brilho intenso e talvez uma animação pulsante.
    *   Posicionar Pinky na entrada da caverna.

6.  **Implementação dos Efeitos de Ambiente na Caverna:**
    *   **Brilho do Portal:** Usar CSS (ex: `box-shadow` animado no elemento do portal se for um div, ou desenhar com `globalCompositeOperation = 'lighter'` no canvas) ou JS no canvas para fazer o portal brilhar e pulsar.
    *   **Partículas:** Implementar um sistema simples de partículas (poeira caindo do teto, pequenas fagulhas de energia perto do portal) usando JS no canvas.
    *   **Tremor de Tela (Sutil e Ocasional):** Implementar uma função em JS que aplica um leve e rápido `transform: translate()` ao `#caverna-portal-canvas` ou à tela inteira para simular tremores ocasionais, aumentando a sensação de instabilidade e poder do local.
    *   **Efeitos Sonoros de Ambiente:** Adicionar um som ambiente de caverna (eco, gotejamento sutil) e um zumbido de energia emanando do portal (loop suave).

7.  **Implementação dos Diálogos Finais de Pinky (Pré-Decisão):**
    *   Quando Pinky se aproxima do portal (ou automaticamente ao entrar na sala do portal):
        *   `const cavernaDialog = [`
        *   `    "[PINKY]: (Arrepiando-se) Que lugar... sinto uma energia poderosa aqui.",`
        *   `    "[PINKY]: (Olhando para a Fenda) Acho que <span class=\'glitch-word-magenta\'>é</span> aqui. A Fenda do Primeiro Raio.",`
        *   `    "[PINKY]: Se eu atravessar isso... estarei <span class=\'glitch-word-green\'>livre</span>? Ou apenas trocarei uma prisão por outra?",`
        *   `    "[PINKY]: (Respirando fundo) Cheguei até aqui. Preciso ver com meus próprios olhos."`
        *   `];`
    *   Exibir este diálogo na `.dialog-box-caverna`.

8.  **Implementação do Prompt de Interação e Decisão do Portal:**
    *   Após os diálogos de Pinky, ou quando Pinky está diretamente em frente ao portal e o jogador pressiona uma tecla de ação:
        *   Ocultar a caixa de diálogo normal (`.dialog-box-caverna`).
        *   Exibir o `#portal-decision-prompt`.
        *   **Texto do Prompt:** "O portal pulsa com uma energia desconhecida. Você sente que este é um ponto sem retorno fácil. Deseja tentar atravessar a Fenda e acessar a camada superior da realidade?"
        *   **Botões no Prompt:**
            *   Botão "Sim" (id: `portal-confirm-yes`)
            *   Botão "Retornar" (id: `portal-confirm-return`)
    *   **Hover/Focus no Portal (Instrução Visual):** Antes do prompt aparecer, se Pinky estiver perto do portal, um texto sutil pode aparecer sobre o portal ou em um canto: "Interagir?" ou "Escaneie com seu celular para ajudar Pinky" (este último pode ser reservado para a tela de instruções AR, mas um hint aqui é bom).

9.  **Lógica JavaScript para os Botões de Decisão do Portal:**
    *   Adicionar event listeners aos botões `portal-confirm-yes` e `portal-confirm-return`.
    *   **Se "Sim" for clicado:**
        *   Ocultar `#portal-decision-prompt`.
        *   Chamar a função para iniciar a Fase 09 (ex: `initInstrucoesARScreen()`).
    *   **Se "Retornar" for clicado:**
        *   Ocultar `#portal-decision-prompt`.
        *   Chamar a função para exibir a tela de confirmação de retorno ao ciclo (a ser detalhada na Fase 11, mas o gatilho é aqui. Ex: `initConfirmReturnScreen()`).

10. **Testes e Ajustes da Fase 08:**
    *   Testar a entrada na Caverna do Portal a partir do mapa de Élofen (após Nocthryn ser selecionada).
    *   Verificar a renderização do cenário da caverna, o portal brilhante/pulsante e Pinky.
    *   Testar os efeitos de ambiente (partículas, tremor de tela, sons).
    *   Testar o fluxo de diálogos finais de Pinky.
    *   Verificar a exibição e funcionalidade do prompt de decisão do portal (texto, botões).
    *   Testar a lógica dos botões "Sim" (deve levar à próxima fase - placeholder por enquanto) e "Retornar" (deve levar à tela de confirmação de retorno - placeholder por enquanto).
    *   Ajustar visuais, efeitos, textos e fluxos de interação conforme necessário.

**Entregável da Fase 08:** A Capitania de Nocthryn e a Caverna do Portal implementadas, com Pinky chegando ao clímax de sua jornada no mundo 16-bit. O jogador poderá experienciar os diálogos finais de Pinky e tomar a decisão crucial de prosseguir para a ativação da Realidade Aumentada ou considerar retornar ao ciclo anterior.
