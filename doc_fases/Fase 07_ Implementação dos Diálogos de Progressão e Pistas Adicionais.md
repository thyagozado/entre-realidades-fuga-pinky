# Fase 07: Implementação dos Diálogos de Progressão e Pistas Adicionais

**Objetivo Principal:** Integrar os diálogos cruciais com NPCs (como o Guardião da Biblioteca e a Criança Fantasma) que fornecem as pistas finais e a motivação para Pinky se dirigir à Capitania de Nocthryn e à Caverna do Portal. Este passo pode envolver revisitar locais ou encontrar esses NPCs em pontos específicos do mapa ou das capitanias, dependendo da progressão do jogador.

**Microtarefas Detalhadas:**

1.  **Revisão do Fluxo Narrativo para Pistas:**
    *   Analisar o `fluxo_narrativo_interativo.md` e `elementos_chave_projeto_RA.md` para confirmar os momentos e os NPCs exatos que devem fornecer as pistas para Nocthryn.
    *   Decidir se esses diálogos ocorrem em novas interações com NPCs já visitados (ex: Guardião após Pinky ler os livros ou visitar o Oráculo) ou se são novos encontros.

2.  **Implementação do Diálogo com o Guardião (Pista para Nocthryn):**
    *   **Condição de Ativação:** Este diálogo pode ser acionado se Pinky falar novamente com o Guardião na Biblioteca APÓS ter interagido com os livros e/ou com Logéthos no Oráculo.
    *   **Diálogo Específico:**
        *   `const guardiaoPistaDialog = [`
        *   `    "[PINKY]: Guardião, os livros e o Oráculo mencionaram uma... Fenda do Primeiro Raio. E algo sobre Nocthryn.",`
        *   `    "[GUARDIÃO]: Vejo que a semente da compreensão germinou. Sim, a Fenda do Primeiro Raio jaz em Nocthryn, nas profundezas de uma caverna esquecida.",`
        *   `    "[GUARDIÃO]: É um lugar de grande poder e perigo, onde o véu entre os mundos é mais fino. Dizem que só aparece para aqueles que já entenderam que há algo <span class='highlight-term'>além</span> do que se vê.",`
        *   `    "[GUARDIÃO]: Se é a transcendência que buscas, teu caminho agora te leva para as terras sombrias do norte, para Nocthryn."`
        *   `];`
    *   **Lógica JS:** No `script.js`, adicionar uma variável de estado para verificar se Pinky já obteve informações suficientes (ex: `hasReadBooksAndVisitedOracle = true`).
    *   Modificar a lógica de interação com o Guardião para que, se essa condição for verdadeira, ele apresente o `guardiaoPistaDialog` em vez do diálogo inicial.

3.  **Implementação da Criança Fantasma e suas Pistas:**
    *   **Asset:** Criar ou obter um sprite 16-bit para a Criança Fantasma (aparência etérea, talvez translúcida). Salvar como `crianca_fantasma_sprite.png`.
    *   **Condição de Aparição:** A Criança Fantasma pode aparecer em um local específico no mapa de Élofen (ex: perto da entrada de uma floresta sombria que leva a Nocthryn) ou aleatoriamente em locais já visitados após certos gatilhos narrativos.
    *   **Lógica JS para Aparição:** Implementar a lógica para fazer a Criança Fantasma aparecer e desaparecer sutilmente (ex: fade in/out).
    *   **Interação:** Pinky pode interagir ao se aproximar.
    *   **Diálogo da Criança Fantasma (Sussurros):**
        *   `const criancaFantasmaDialog = [`
        *   `    "(Sussurrando) [CRIANÇA FANTASMA]: Shhh... você também ouve? Os ecos...",`
        *   `    "(Sussurrando) [CRIANÇA FANTASMA]: Eles falam de um mundo que se <span class='glitch-word-green'>mistura</span> com o nosso... lá no norte... onde a noite é mais <span class='glitch-word-magenta'>profunda</span>...",`
        *   `    "(Sussurrando) [CRIANÇA FANTASMA]: A Fenda... ela chama..."`
        *   `];`
    *   Exibir este diálogo de forma especial (ex: fonte menor, cor diferente, talvez com um leve efeito sonoro de sussurro).

4.  **Atualização do Mapa de Élofen (se necessário):**
    *   Se Nocthryn não estava acessível ou claramente indicada no mapa antes, atualizar a `mapa-screen` para destacar ou habilitar a seleção de Nocthryn após essas pistas serem obtidas.
    *   Pode ser um desbloqueio visual no mapa ou simplesmente o jogador agora tendo o conhecimento para ir até lá.

5.  **Sistema de Diário/Pistas (Opcional, mas Recomendado):**
    *   Considerar a implementação de um sistema simples de diário ou log de pistas no jogo.
    *   **HTML/CSS:** Criar um pequeno ícone/botão para abrir o diário e uma interface para exibir as pistas coletadas.
    *   **Lógica JS:** Quando Pinky recebe uma pista importante (do Guardião, Bardo, Criança Fantasma, Logéthos), adicionar uma entrada resumida no diário.
        *   Ex: "O Guardião mencionou uma Fenda do Primeiro Raio em Nocthryn."
        *   Ex: "O Bardo cantou sobre a Fenda e o Cântico de Aelor."
        *   Ex: "Logéthos confirmou que a Fenda em Nocthryn é o caminho para a transcendência via Realidade Aumentada."
        *   Ex: "A Criança Fantasma sussurrou sobre ecos e uma fenda ao norte."
    *   Isso ajuda o jogador a acompanhar a narrativa e saber para onde ir.

6.  **Testes e Ajustes da Fase 07:**
    *   Testar as condições de ativação para os diálogos de pista com o Guardião.
    *   Testar a aparição e o diálogo com a Criança Fantasma.
    *   Verificar se as pistas são claras e guiam o jogador efetivamente para Nocthryn.
    *   Se o sistema de diário for implementado, testar a adição e visualização das pistas.
    *   Garantir que a progressão para Nocthryn no mapa esteja lógica e funcional após receber as pistas.
    *   Ajustar textos, condições de gatilho e posicionamento de NPCs conforme necessário.

**Entregável da Fase 07:** Diálogos de progressão e pistas adicionais implementados, garantindo que o jogador receba as informações necessárias para entender que seu próximo destino é Nocthryn e a Caverna do Portal. O sistema opcional de diário, se implementado, ajudará na organização dessas informações para o jogador.
