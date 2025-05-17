# Fase 11: Implementação dos Finais (Libertação AR e Retorno ao Ciclo)

**Objetivo Principal:** Desenvolver as cenas finais do jogo, cobrindo tanto o cenário de sucesso da libertação de Pinky via Realidade Aumentada quanto o final alternativo onde o jogador opta por fazer Pinky retornar ao ciclo arcade. Isso inclui os diálogos finais e as transições para a tela de créditos ou reinício do jogo.

**Microtarefas Detalhadas:**

1.  **Preparação para a Tela Pós-Scan (Final de Libertação AR):**
    *   No `script.js`, na lógica que confirma a conclusão da experiência AR (final da Fase 10, usando o mecanismo de comunicação escolhido), adicionar a chamada para `initPosScanScreen()` (a ser criada) e ocultar a `instrucoes-ar-screen`.

2.  **Estrutura HTML para a Tela Pós-Scan (`pos-scan-screen`):**
    *   No `index.html`, adicionar um novo `div` com o id `pos-scan-screen` (inicialmente `display: none;`).
    *   Dentro de `pos-scan-screen`, adicionar um `div` para um possível visual de fundo (ex: a Caverna do Portal agora calma, ou um cenário etéreo/celestial) e um `div` para a caixa de diálogo final de Pinky (ex: `class="dialog-box-pos-scan"`).

3.  **Estilização CSS da Tela Pós-Scan:**
    *   No `style.css`, estilizar `#pos-scan-screen` (fundo, dimensões, posicionamento `z-index: 70;`).
    *   Estilizar o visual de fundo (pode ser uma imagem estática, ou o canvas da caverna com modificações).
    *   Estilizar `.dialog-box-pos-scan` (para ser proeminente, talvez com um tom mais sereno).

4.  **Implementação do Diálogo Final de Pinky (Libertação):**
    *   No `script.js`, definir o diálogo de agradecimento de Pinky:
        *   `const posScanDialog = [`
        *   `    "[PINKY]: (Voz calma e etérea) Eu... eu consigo ver. Tantas cores... tantas <span class='glitch-word-green'>possibilidades</span>...",`
        *   `    "[PINKY]: Você... você me <span class='highlight-term'>libertou</span>. Mostrou-me que há mais do que apenas paredes e escuridão.",`
        *   `    "[PINKY]: Obrigado, amigo(a) de além do véu. Minha jornada aqui termina, mas a sua... a sua está apenas começando. Adeus!"`
        *   `];`
    *   Exibir este diálogo sequencialmente na `.dialog-box-pos-scan`.
    *   **Efeito Visual/Sonoro:** Considerar um sprite de Pinky (talvez o 16-bit ou uma forma de luz) que gradualmente desaparece (fade out) durante ou após o diálogo. Acompanhar com uma música calma e edificante.

5.  **Transição para a Tela de Créditos (Após Final de Libertação):**
    *   Após o diálogo final de Pinky e o efeito de desaparecimento, implementar uma transição suave (ex: fade to black ou white) para a `credits-screen` (a ser criada).

6.  **Estrutura HTML para a Tela de Confirmação de Retorno (`confirm-return-screen`):**
    *   No `index.html`, adicionar um novo `div` com o id `confirm-return-screen` (inicialmente `display: none;`).
    *   Dentro, adicionar o texto da pergunta de confirmação e dois botões: "Confirmar Retorno" (id: `confirm-return-yes`) e "Cancelar" (id: `confirm-return-no`).

7.  **Estilização CSS da Tela de Confirmação de Retorno:**
    *   No `style.css`, estilizar `#confirm-return-screen` como um pop-up modal sobre a `caverna-portal-screen` (fundo semi-transparente, caixa centralizada, `z-index: 65;`).
    *   Estilizar o texto e os botões.

8.  **Lógica JavaScript para a Tela de Confirmação de Retorno:**
    *   No `script.js`, criar `initConfirmReturnScreen()` que exibe `#confirm-return-screen`.
    *   Adicionar event listeners aos botões `#confirm-return-yes` e `#confirm-return-no`.
    *   **Se "Confirmar Retorno" (`#confirm-return-yes`) for clicado:**
        *   Ocultar `#confirm-return-screen` e `caverna-portal-screen`.
        *   **Diálogo de Despedida (Opcional, Curto):** Pode haver um breve diálogo de Pinky expressando resignação antes do reinício.
            *   `"[PINKY]: (Suspiro) Talvez... talvez este seja meu único destino, afinal."`
        *   Reiniciar o jogo: Chamar a função que inicializa a `start-screen` (Fase 01), resetando quaisquer variáveis de estado do jogo.
    *   **Se "Cancelar" (`#confirm-return-no`) for clicado:**
        *   Ocultar `#confirm-return-screen`.
        *   Retornar o jogador à interação com o prompt de decisão do portal na `caverna-portal-screen` (reexibir `#portal-decision-prompt`).

9.  **Implementação do Final Alternativo (Pular AR):**
    *   Se o botão "Pular Etapa AR" foi implementado na Fase 09 e o jogador o confirmou:
        *   Ocultar a `instrucoes-ar-screen`.
        *   Exibir uma tela ou diálogo específico para este final (ex: `skipped-ar-ending-screen`).
        *   **Diálogo de Final (Pular AR):**
            *   `"[PINKY]: (Voz um pouco triste) Entendo... talvez o outro lado não estivesse pronto para mim, ou eu para ele.",`
            *   `"[PINKY]: A Fenda ainda pulsa, mas a ponte... não foi cruzada. Sinto o ciclo me puxando de volta..."`
        *   Transição para um reinício do jogo (Fase 01) ou para os créditos com uma nota melancólica.

10. **Estrutura HTML para a Tela de Créditos (`credits-screen`):**
    *   No `index.html`, adicionar um novo `div` com o id `credits-screen` (inicialmente `display: none;`).
    *   Dentro, adicionar parágrafos ou listas para os créditos: Desenvolvedor(es), Artista(s) de Pixel Art (se aplicável), Músicas/Efeitos Sonoros (fontes), Agradecimentos Especiais, Ferramentas Utilizadas.
    *   Adicionar um botão "Voltar à Tela Inicial" ou "Jogar Novamente".

11. **Estilização CSS da Tela de Créditos:**
    *   No `style.css`, estilizar `#credits-screen` (fundo (pode ser preto ou temático), texto centralizado, fonte legível, animação de rolagem suave para os créditos se forem longos, `z-index: 80;`).
    *   Estilizar o botão de retorno.

12. **Lógica JavaScript para a Tela de Créditos:**
    *   Criar `initCreditsScreen()` que exibe `#credits-screen`.
    *   Implementar a lógica para o botão "Voltar à Tela Inicial" (chama a função de inicialização da Fase 01).

13. **Testes e Ajustes da Fase 11:**
    *   Testar o fluxo completo do final de libertação AR: desde a confirmação da conclusão da AR, passando pela tela Pós-Scan, diálogo final de Pinky, até a transição para os créditos.
    *   Testar o fluxo completo do final de retorno ao ciclo: desde a escolha "Retornar" no portal, passando pela tela de confirmação, até o reinício do jogo na tela inicial.
    *   Se implementado, testar o final alternativo de "Pular Etapa AR".
    *   Verificar a correta exibição e formatação da tela de créditos e a funcionalidade do botão de retorno.
    *   Ajustar diálogos, timings de transição, visuais e lógica dos finais conforme necessário para garantir que sejam impactantes e coesos.

**Entregável da Fase 11:** Todos os finais do jogo (libertação AR, retorno ao ciclo, e opcionalmente pular AR) implementados e funcionando corretamente, incluindo as telas de diálogo final, transições e a tela de créditos.
