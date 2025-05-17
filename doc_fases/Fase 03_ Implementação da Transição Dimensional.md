# Fase 03: Implementação da Transição Dimensional

**Objetivo Principal:** Criar um efeito visual e sonoro impactante para a transição de Pinky do mundo arcade 8-bit para o universo de fantasia 16-bit 2.5D, utilizando a técnica de "Sprite Deconstruction" e outros efeitos de glitch.

**Microtarefas Detalhadas:**

1.  **Preparação da Transição Pós-Fuga:**
    *   No `script.js`, na função que detecta a entrada de Pinky no "buraco de saída" (final da Fase 02), adicionar a lógica para ocultar a `escape-screen`.
    *   Imediatamente após ocultar a `escape-screen`, acionar a exibição da `transition-screen` (a ser criada).

2.  **Estrutura HTML para a Tela de Transição (`transition-screen`):**
    *   No `index.html`, adicionar um novo `div` com o id `transition-screen` (inicialmente com `display: none;`).
    *   Este `div` servirá como um container para os vários elementos visuais do efeito glitch. Pode conter múltiplos `canvas` ou `divs` para diferentes camadas de efeitos, se necessário, ou ser um único container onde os efeitos são aplicados via CSS e JS.

3.  **Estilização CSS Base da Tela de Transição:**
    *   No `style.css`, estilizar `#transition-screen`: `background-color: #000;` (ou uma cor base para o glitch), `width: 100%;`, `height: 100vh;`, `position: absolute;`, `top: 0;`, `left: 0;`, `z-index: 30;` (para sobrepor outras telas), `overflow: hidden;` (para conter os efeitos visuais).

4.  **Implementação do Efeito de "Sprite Deconstruction" para Pinky 8-bit:**
    *   **Captura/Referência do Sprite:** Ter o sprite 8-bit de Pinky (usado na Fase 02) como referência.
    *   **Lógica JS/Canvas:** Criar uma função em `script.js` que, ao iniciar a transição, renderize o sprite de Pinky 8-bit (talvez em um `canvas` dentro da `transition-screen`).
    *   Implementar a lógica para "quebrar" ou "fragmentar" este sprite em múltiplos pequenos blocos ou pixels.
    *   Animar esses fragmentos para se espalharem caoticamente pela tela, talvez com diferentes velocidades e trajetórias.

5.  **Implementação de Efeitos de Glitch Visual na Tela:**
    *   **CSS Keyframes para Glitch:** Definir `@keyframes` no `style.css` para simular:
        *   **Screen Tearing/Block Shifting:** Deslocamento horizontal de blocos da tela.
        *   **Color Channel Misalignment:** Breves separações das cores RGB.
        *   **Noise/Static:** Sobreposição de ruído digital (pode ser uma imagem de ruído animada com `opacity` ou gerada proceduralmente).
        *   **Scanlines Instáveis:** Variação na intensidade ou posição das scanlines.
    *   **Classes CSS para Ativar Glitches:** Criar classes CSS que aplicam essas animações de glitch.
    *   **Lógica JS para Ativar/Desativar Glitches:** No `script.js`, durante a `transition-screen`, adicionar e remover essas classes CSS em elementos da tela (ou no próprio `body`/`transition-screen`) em intervalos rápidos e aleatórios para criar um efeito errático.

6.  **Alternância de Frames/Fragmentos (8-bit e 16-bit):**
    *   **Assets 16-bit (Preview):** Ter alguns fragmentos ou sprites/tilesets muito básicos do mundo 16-bit (Bosque Decrépito, Pinky 16-bit) prontos como `assets/images/`.
    *   **Lógica JS/CSS:** Durante a transição, piscar rapidamente (exibir por poucos milissegundos) esses fragmentos 16-bit sobrepostos ou alternados com os elementos 8-bit e os efeitos de glitch. Isso cria a sensação de que a nova realidade está "vazando" para a antiga.

7.  **Implementação de Efeitos Sonoros da Transição:**
    *   **Assets de Áudio:** Preparar arquivos de áudio curtos (`.mp3` ou `.wav`) em uma pasta `assets/audio/` para:
        *   Estática digital (`static_glitch.wav`)
        *   Zaps elétricos (`zap_effect.wav`)
        *   Fragmentos distorcidos de sons do Pac-Man (`pacman_sound_distorted.wav`)
        *   Um zumbido ou som de "rasgo" que aumenta de intensidade (`rift_sound.wav`).
    *   **Lógica JS para Áudio:** No `script.js`, usar a API Web Audio (ou simples tags `<audio>`) para tocar esses sons em sincronia com os efeitos visuais. Alguns sons podem ser em loop curto, outros disparados em momentos específicos do glitch.

8.  **Controle da Duração da Transição:**
    *   No `script.js`, definir uma duração total para a `transition-screen` (ex: 0.8 a 1.5 segundos).
    *   Usar `setTimeout` para controlar o fim da transição.

9.  **Lógica JavaScript para Finalizar a Transição e Chamar a Próxima Fase:**
    *   Após a duração definida, a função de `setTimeout` deve:
        *   Parar todos os efeitos sonoros da transição.
        *   Ocultar a `transition-screen` (`display: none;`).
        *   Chamar a função que inicializa a Fase 04 (ex: `initBosqueScreen()`).

10. **Testes e Ajustes da Fase 03:**
    *   Testar a transição completa após Pinky entrar no buraco de saída.
    *   Verificar o efeito de "Sprite Deconstruction" do Pinky 8-bit.
    *   Avaliar a intensidade e a aparência dos efeitos de glitch visual (tearing, color shift, noise, scanlines).
    *   Observar a alternância de frames 8-bit e 16-bit.
    *   Testar a sincronia e o impacto dos efeitos sonoros.
    *   Ajustar a duração da transição para que seja impactante, mas não excessivamente longa.
    *   Garantir que a transição flua suavemente para a próxima fase (tela do Bosque Decrépito).
    *   Refinar os parâmetros das animações CSS e da lógica JS para obter o efeito desejado.

**Entregável da Fase 03:** Uma cena de transição dimensional funcional e visualmente/sonoramente impactante, que efetivamente marca a passagem de Pinky do mundo 8-bit para o 16-bit, preparando o terreno para a próxima etapa da jornada.
