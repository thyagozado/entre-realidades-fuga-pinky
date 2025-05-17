# Fase 10: Desenvolvimento e Integração da Experiência AR

**Objetivo Principal:** Criar a experiência de Realidade Aumentada (AR) em si, onde Pinky (ou sua essência) aparece no ambiente real do jogador através de um dispositivo móvel. Esta fase foca no desenvolvimento da aplicação AR separada (preferencialmente WebAR) e na definição de como o jogo principal saberá que esta experiência foi concluída.

**Microtarefas Detalhadas:**

1.  **Seleção e Configuração da Tecnologia AR:**
    *   **Decisão Final da Tecnologia:** Confirmar a escolha da tecnologia AR (ex: AR.js para WebAR baseada em marcadores ou reconhecimento de imagem, MindAR para reconhecimento de imagem/face, ou outra biblioteca WebAR adequada como 8th Wall se o orçamento permitir para funcionalidades mais avançadas como SLAM).
    *   **Setup do Ambiente de Desenvolvimento AR:** Configurar um projeto separado ou uma pasta dentro do projeto principal para a aplicação WebAR. Incluir as bibliotecas AR necessárias.
    *   Criar uma página HTML base para a experiência WebAR (ex: `ar_experience.html`).

2.  **Criação ou Obtenção do Asset de Pinky para AR:**
    *   **Modelo 3D de Pinky (Ideal):** Se possível, criar ou obter um modelo 3D low-poly de Pinky, otimizado para WebAR (formato glTF/GLB é comum). Incluir animações básicas (idle, talvez uma animação de "libertação" ou desaparecimento).
    *   **Sprite/Animação 2D em AR (Alternativa):** Se um modelo 3D não for viável, usar um sprite 2D de Pinky (talvez o 16-bit ou um novo mais detalhado) e animá-lo no espaço 3D da cena AR.
    *   Salvar os assets na pasta da aplicação AR.

3.  **Desenvolvimento da Lógica de Reconhecimento (Marcador/Superfície):**
    *   **Baseado em Marcador (se escolhido na Fase 09):**
        *   Integrar o marcador visual (ex: `marcador_ar.png`) com a biblioteca AR escolhida.
        *   Implementar a lógica para detectar o marcador através da câmera do dispositivo móvel.
    *   **Baseado em Reconhecimento de Imagem (se um marcador específico for usado):**
        *   Treinar ou configurar a biblioteca AR para reconhecer a imagem alvo.
    *   **Baseado em Superfície (SLAM - mais avançado, pode não ser o foco inicial):**
        *   Se a biblioteca suportar, implementar a detecção de superfícies planas para posicionar Pinky.

4.  **Implementação da Exibição de Pinky na Cena AR:**
    *   Uma vez que o marcador/imagem/superfície é detectado, implementar a lógica para:
        *   Renderizar o modelo 3D de Pinky (ou o sprite 2D) sobreposto ao vídeo da câmera, ancorado ao marcador/superfície.
        *   Aplicar a animação de "idle" a Pinky.

5.  **Implementação da Interação ou Evento de "Libertação" na AR:**
    *   **Interação Simples (Opcional):** Permitir que o usuário toque na tela do dispositivo móvel para acionar um efeito em Pinky (ex: um brilho, uma pequena animação de agradecimento).
    *   **Animação de Libertação:** Criar uma animação onde Pinky brilha intensamente, talvez se desfaz em partículas de luz, ou ascende e desaparece, simbolizando sua libertação.
    *   **Duração:** A experiência AR deve ser relativamente curta mas significativa (ex: 15-30 segundos após a detecção).

6.  **Mecanismo de Comunicação entre a Experiência AR e o Jogo Principal:**
    *   **Objetivo:** O jogo principal (rodando no PC/navegador) precisa saber que o jogador completou a experiência AR no dispositivo móvel para prosseguir para o final de libertação.
    *   **Abordagens Possíveis (do mais simples ao mais complexo):**
        *   **Confirmação Manual no Jogo Principal:** Após o jogador ver a animação de libertação no celular, ele volta ao jogo principal e clica em um botão "Eu completei a experiência AR!" que aparece na `instrucoes-ar-screen`. (Mais simples de implementar).
        *   **Código de Confirmação:** A experiência AR no celular, ao final, exibe um código simples (ex: 3 dígitos). O jogador insere este código em um campo na `instrucoes-ar-screen` do jogo principal. (Requer um pouco mais de UI no jogo e na AR).
        *   **Comunicação via Servidor (Avançado):** A aplicação WebAR envia um sinal para um servidor simples quando concluída. O jogo principal faz polling nesse servidor ou usa WebSockets para receber a confirmação. (Mais robusto, mas aumenta a complexidade).
        *   **Deep Linking com Parâmetros (Se WebAR e jogo principal puderem interagir via URL):** A WebAR, ao concluir, tenta redirecionar para uma URL especial do jogo com um parâmetro de sucesso. (Pode ser complexo de configurar de forma confiável entre dispositivos).
    *   **Escolha e Implementação:** Selecionar a abordagem mais viável para o escopo do projeto. Para um protótipo, a confirmação manual é aceitável.

7.  **Desenvolvimento da Página WebAR (`ar_experience.html` e `ar_script.js`):**
    *   Estruturar o HTML básico para a cena AR.
    *   Escrever o JavaScript para inicializar a câmera, carregar a biblioteca AR, configurar o reconhecimento, carregar o modelo/sprite de Pinky, e gerenciar a lógica da cena AR (detecção, exibição, animação de libertação, e o mecanismo de comunicação/confirmação escolhido).
    *   Estilizar a página AR minimamente (ex: instruções de "Aponte para o marcador" se necessário).

8.  **Hospedagem da Aplicação WebAR:**
    *   Para que o QR Code funcione, a página `ar_experience.html` e seus assets precisam estar hospedados em um servidor acessível publicamente via HTTPS (GitHub Pages, Netlify, Vercel são opções gratuitas para projetos estáticos).
    *   Atualizar a URL no QR Code (gerado na Fase 09) para apontar para a aplicação WebAR hospedada.

9.  **Testes da Experiência AR:**
    *   Testar a detecção do marcador/imagem em diferentes dispositivos móveis e condições de iluminação.
    *   Verificar a renderização e animação de Pinky na cena AR.
    *   Testar a interação/animação de libertação.
    *   Testar o mecanismo de comunicação/confirmação escolhido para garantir que o jogo principal seja notificado (ou que o jogador possa confirmar manualmente).
    *   Otimizar os assets AR para carregamento rápido em dispositivos móveis.

10. **Integração Final com o Fluxo do Jogo Principal:**
    *   Garantir que, uma vez que a conclusão da AR seja sinalizada ao jogo principal (via o mecanismo escolhido), a `instrucoes-ar-screen` seja ocultada e a lógica para exibir a `Tela Pós-Scan (Sucesso da Libertação)` (Fase 11) seja acionada.

**Entregável da Fase 10:** Uma experiência de Realidade Aumentada funcional (preferencialmente WebAR) que permite ao jogador ver Pinky em seu ambiente real e testemunhar sua "libertação". A URL desta experiência estará pronta para ser usada no QR Code da Fase 09, e um mecanismo (mesmo que simples) para o jogo principal reconhecer a conclusão da AR estará implementado.
