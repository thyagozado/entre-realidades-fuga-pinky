# Fase 12: Testes, Polimento e Revisão Final

**Objetivo Principal:** Garantir que o jogo "Fantasma RA" esteja o mais livre de bugs possível, com uma experiência de usuário coesa, visualmente polida, sonoramente imersiva e narrativamente completa. Esta fase envolve testes exaustivos em todos os aspectos do jogo e a aplicação de refinamentos finais.

**Microtarefas Detalhadas:**

1.  **Planejamento dos Testes:**
    *   Criar uma checklist de teste abrangente baseada nas funcionalidades e fluxos de todas as 11 fases anteriores.
    *   Definir cenários de teste para cobrir caminhos principais, interações específicas, condições de borda e os diferentes finais.
    *   Considerar diferentes "perfis" de jogadores (ex: explorador, apressado) para antecipar comportamentos.

2.  **Teste de Fluxo Narrativo Completo:**
    *   Jogar o jogo do início ao fim múltiplas vezes, seguindo o fluxo narrativo principal para o final de libertação AR.
    *   Verificar a consistência e clareza de todos os diálogos.
    *   Garantir que todas as transições entre cenas e telas ocorram suavemente e nos momentos corretos.
    *   Confirmar que todas as pistas narrativas são entregues e fazem sentido para a progressão.
    *   Testar o fluxo para o final de "Retorno ao Ciclo".
    *   Testar o fluxo para o final de "Pular Etapa AR" (se implementado).

3.  **Teste de Mecânicas de Jogo:**
    *   **Controles:** Validar os controles de Pinky em todas as suas formas (8-bit na fuga, 16-bit no bosque e locais, navegação no mapa).
    *   **Interações com NPCs:** Testar todas as interações com Guardião, Bardo, Logéthos, Criança Fantasma, garantindo que os diálogos corretos sejam acionados sob as condições corretas.
    *   **Interações com Objetos:** Testar a funcionalidade dos livros interativos na Biblioteca (abrir, navegar páginas, fechar), interação com o Altar.
    *   **Interação com o Portal:** Validar o prompt de decisão do portal e suas ramificações.
    *   **Lógica de Conquistas:** Confirmar que as conquistas ("Sentinela do Saber", "Percepção Séptupla") são desbloqueadas corretamente e as notificações exibidas.
    *   **Sistema de Diário/Pistas (se implementado):** Verificar se as pistas são adicionadas e exibidas corretamente.

4.  **Teste da Experiência de Realidade Aumentada (AR):**
    *   Re-testar a funcionalidade do QR Code/marcador na `instrucoes-ar-screen`.
    *   Testar a experiência WebAR em diferentes dispositivos móveis (iOS, Android) e navegadores compatíveis.
    *   Verificar a detecção do marcador/imagem, a renderização de Pinky AR, e a animação de libertação.
    *   Testar exaustivamente o mecanismo de comunicação/confirmação entre a AR e o jogo principal.

5.  **Teste Visual e Estético:**
    *   Revisar todos os cenários (8-bit, 16-bit, telas de transição, AR) para consistência visual e fidelidade ao estilo proposto.
    *   Verificar todos os sprites (Pinky, NPCs) e suas animações.
    *   Avaliar os efeitos visuais (grid neon, scanlines, glitch, brilho do portal, partículas, efeitos de falha de memória nas palavras).
    *   Garantir que a tipografia seja legível e esteticamente apropriada em todas as telas e caixas de diálogo.
    *   Verificar o alinhamento, espaçamento e layout de todos os elementos de UI.

6.  **Teste de Áudio:**
    *   Verificar se todos os efeitos sonoros (glitch, interações, ambiente, portal) estão sendo reproduzidos nos momentos corretos e com volume adequado.
    *   Avaliar as músicas de fundo (se houver) em diferentes cenas para garantir que complementam a atmosfera.
    *   Testar a sincronia de áudio com eventos visuais (ex: sons da transição dimensional).

7.  **Teste de Responsividade Mínima e Compatibilidade:**
    *   Verificar como o jogo (a parte não-AR) se comporta em diferentes resoluções de tela de desktop comuns.
    *   Garantir que os elementos principais permaneçam visíveis e utilizáveis.
    *   Testar em navegadores principais (Chrome, Firefox, Edge, Safari) para a parte web do jogo.

8.  **Identificação e Registro de Bugs:**
    *   Manter um registro detalhado de todos os bugs encontrados (ex: em uma planilha ou sistema de issue tracking simples).
    *   Para cada bug, registrar: descrição, passos para reproduzir, severidade, captura de tela (se aplicável).

9.  **Correção de Bugs:**
    *   Priorizar e corrigir os bugs identificados, começando pelos mais críticos ou que quebram o fluxo do jogo.
    *   Re-testar após cada correção para garantir que o bug foi resolvido e que a correção não introduziu novos problemas (testes de regressão).

10. **Polimento Geral:**
    *   Ajustar timings de animações e transições para uma melhor fluidez.
    *   Refinar textos de diálogos e instruções para clareza e impacto emocional.
    *   Melhorar a usabilidade geral (ex: feedback visual para interações, clareza dos prompts).
    *   Adicionar pequenos detalhes que enriquecem a experiência (ex: um leve piscar nos olhos de Pinky, uma partícula extra no portal).
    *   Otimizar o carregamento de assets (compressão de imagens, lazy loading se necessário).

11. **Revisão Final do Código:**
    *   Garantir que o código JavaScript, HTML e CSS esteja limpo, bem comentado e organizado.
    *   Remover código morto ou desnecessário.
    *   Verificar a consistência na nomeação de variáveis, funções e classes CSS.
    *   Considerar a performance do código, especialmente em loops de animação ou renderização.

12. **Playtesting com Terceiros (Opcional, mas Altamente Recomendado):**
    *   Se possível, pedir a algumas pessoas que não participaram do desenvolvimento para jogarem o jogo.
    *   Observar suas reações, onde ficam confusas, ou que bugs encontram.
    *   Coletar feedback sobre a experiência geral, dificuldade, clareza da narrativa e diversão.

13. **Build Final e Preparação para Entrega/Publicação (se aplicável):**
    *   Organizar todos os arquivos finais do projeto.
    *   Se for uma aplicação web, garantir que todos os caminhos para assets estejam corretos para a hospedagem.
    *   Criar um arquivo `README.md` com instruções de como rodar o projeto, tecnologias utilizadas e créditos.

**Entregável da Fase 12:** Uma versão do jogo "Fantasma RA" exaustivamente testada, polida e revisada, pronta para ser apresentada como o produto final do desenvolvimento. A experiência do jogador deve ser suave, imersiva e o mais livre de problemas técnicos possível.
