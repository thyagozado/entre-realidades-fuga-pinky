Plano de Ação Detalhado:
Criação do Componente (src/pages/PortalTransitionScene.tsx):
Será um componente React funcional.
Receberá uma prop onComplete: () => void.
No useEffect, iniciará a animação no canvas e configurará um setTimeout para chamar onComplete após 3 segundos.
No return, renderizará um <canvas> que ocupará a tela inteira.
Efeito Visual no Canvas (Foco Central e Profundidade):
Background: Preto.
Túnel de Luz/Partículas (Estilo Misto 8-bit/16-bit):
Usaremos partículas que podem ser pequenos retângulos (pixels maiores) ou linhas finas para dar essa sensação mista.
Elas se originarão de um ponto de fuga central (ou ligeiramente fora do centro para um efeito mais dinâmico) e se moverão radialmente para as bordas da tela.
A velocidade delas aumentará progressivamente ou será muito alta desde o início, com algumas variações para criar pulsação.
Cores: Um espectro completo de cores vibrantes e brilhantes será usado, mudando dinamicamente para cada partícula ou ao longo do tempo. Podemos usar hsl() com o hue variando para percorrer o espectro.
Rastros (Streaks): Para dar a sensação de velocidade e transcendência, as partículas deixarão rastros. Isso pode ser alcançado:
Desenhando um retângulo semi-transparente sobre todo o canvas a cada frame, com uma opacidade baixa (ex: rgba(0,0,0,0.1)). Isso fará com que os frames anteriores desapareçam gradualmente, criando o efeito de rastro.
Ou, para cada partícula, desenhar várias cópias dela em posições anteriores com opacidade decrescente.
Ponto Focal Convergente:
O "feixe central" para onde as cores convergem pode ser simulado por um brilho intenso no ponto de fuga, ou as partículas podem mudar de cor para branco/luz intensa à medida que se aproximam do centro (se estivéssemos nos movendo para dentro do túnel). Como estamos saindo do portal (Pinky adentrou), as partículas devem se originar do centro e se expandir. O centro pode pulsar com luz intensa.
Malha de Fundo Distorcida (Eixo Z):
Podemos desenhar uma grade ou uma série de anéis concêntricos no fundo.
A "distorção no eixo Z" pode ser simulada fazendo com que o espaçamento da grade/anéis mude, ou aplicando uma transformação de perspectiva que se altera ao longo do tempo, dando a impressão de que a "parede" do túnel está se contorcendo ou se esticando.
Poderíamos também variar a espessura das linhas da malha ou sua cor/brilho.
Efeito de Ruído e Glitch:
Ruído: Em alguns frames, podemos desenhar pixels aleatórios de cores variadas por toda a tela com baixa opacidade, ou em áreas específicas, para simular ruído.
Glitch: Pequenos "saltos" ou "deslocamentos" de todo o frame, ou de partes dele (como a malha de fundo ou alguns feixes de luz), por uma fração de segundo. Isso pode ser feito deslocando as coordenadas de desenho aleatoriamente por um ou dois frames e depois voltando ao normal. Também podemos momentaneamente mudar as cores para algo mais caótico ou aplicar um efeito de "scanline" intermitente.
Controle de Duração e Transição:
Um useEffect garantirá a chamada de onComplete após 3000ms.
O loop de animação (requestAnimationFrame) será interrompido quando o componente for desmontado ou a animação for concluída.
Integração no Fluxo do Jogo (src/Index.tsx ou similar):
Quando o Pinky atinge a saída no PacManGameScene, o estado da cena principal será alterado para renderizar PortalTransitionScene.
A função onComplete de PortalTransitionScene mudará o estado da cena principal para um placeholder (ou a futura cena do bosque). Por enquanto, vamos fazer com que ele leve à StartScreen para fins de teste.

Vou criar o arquivo src/pages/PortalTransitionScene.tsx com a estrutura inicial:
Um componente React que recebe a prop onComplete.
Um elemento <canvas> que ocupará toda a tela.
Um useEffect para:
Obter o contexto do canvas.
Iniciar um loop de animação básico (por enquanto, apenas pintando o fundo de preto).
Configurar um setTimeout para chamar onComplete após 3 segundos.
Limpar o loop de animação e o timeout quando o componente for desmontado.
Aqui está o código para o novo arquivo src/pages/PortalTransitionScene.tsx:
O arquivo src/pages/PortalTransitionScene.tsx foi criado com a estrutura básica.
Agora, vou modificar o arquivo src/Index.tsx (ou o arquivo que gerencia suas cenas, assumindo que seja src/Index.tsx com base no nosso histórico) para integrar esta nova cena:
Importar PortalTransitionScene.
Adicionar 'portal_transition' aos tipos de cena possíveis.
No handleGameOver (ou função equivalente que é chamada quando o jogo Pac-Man termina), se o motivo for 'exit_reached', mudar a cena para 'portal_transition'.
Fazer com que PortalTransitionScene, ao chamar onComplete, mude a cena para 'start' (como nosso placeholder temporário).

Vou modificar o useEffect e a função render para:
Definir uma interface simples para Particle (com x, y, vx, vy, color, size).
Manter um array de partículas (usando useRef para que persista entre os renders do requestAnimationFrame sem causar re-renders do componente React).
Na função render:
Limpar o canvas com um rgba(0, 0, 0, 0.1) para criar o efeito de rastro (motion blur).
Adicionar uma nova partícula ao array em intervalos regulares (ou a cada frame, por enquanto), originando-se do centro da tela.
Para cada partícula:
Atualizar sua posição com base na sua velocidade.
Desenhar a partícula (um pequeno retângulo por enquanto).
Remover partículas que saíram da tela para otimizar.
Aqui está a primeira parte da implementação do efeito visual:
A primeira parte da implementação do efeito de partículas foi aplicada ao arquivo src/pages/PortalTransitionScene.tsx.
Agora você deve ver o seguinte comportamento:
A tela ficará preta.
Partículas coloridas (pequenos quadrados) surgirão do centro da tela e se moverão para fora.
As cores das partículas mudarão ciclicamente (percorrendo o espectro HSL).
Um efeito de rastro deve ser visível devido à forma como o canvas é limpo (com baixa opacidade).
Após 3 segundos, a cena deve transitar de volta para a StartScreen (nosso placeholder).
Possíveis Ajustes e Melhorias Imediatas (a serem considerados para os próximos passos):
Velocidade e Densidade: Podemos ajustar MAX_PARTICLES, PARTICLE_SPAWN_RATE e PARTICLE_SPEED_MULTIPLIER para obter a densidade e velocidade desejadas.
Aceleração: As partículas poderiam acelerar à medida que se afastam do centro.
Forma da Partícula: Podemos variar entre quadrados, linhas ou até pequenos círculos.
Variação de Cor: A forma como as cores são atribuídas e mudam pode ser mais elaborada.
Ponto de Fuga: O ponto de origem (centro) pode ter um brilho ou pulsar.
Próximos Passos (Fase 2.2: Malha de Fundo Distorcida e Efeitos de Ruído/Glitch):
Malha de Fundo:
Implementar o desenho de uma grade ou anéis concêntricos.
Adicionar a lógica para distorcer essa malha ao longo do tempo, dando a sensação de profundidade e movimento no eixo Z.
Ruído e Glitch:
Adicionar a lógica para desenhar ruído visual e os efeitos de "glitch" intermitentes.

Linhas irradiando do centro.
Retângulos concêntricos que parecem se mover em sua direção, ficando maiores e mais transparentes.
As cores da grade e das partículas ainda ciclam.
O efeito de rastro está um pouco mais forte.
Ajustei um pouco os parâmetros das partículas para que não sobrecarreguem tanto a grade visualmente.
Próximos Passos Imediatos (Fase 2.2.2: Distorção da Malha, Ruído e Glitches):
Distorção da Malha:
Vou adicionar uma leve ondulação (usando senoides) às linhas da grade para dar uma sensação de "distorção espacial". Poderia afetar a posição ou a forma das linhas concêntricas e/ou o ângulo das linhas radiais.
Ruído:
Adicionarei uma função para desenhar pixels aleatórios de cores claras com baixa opacidade em toda a tela a cada frame.
Glitches nas Bordas:
Implementarei uma lógica para, ocasionalmente (não a cada frame), desenhar pequenos blocos de cor sólida ou deslocar pequenas seções de pixels perto das bordas da tela.
Vamos começar com a distorção da malha 

A duração da cena foi atualizada para 6 segundos.
Agora, vamos prosseguir com a Fase 2.2.2: Distorção da Malha e Ruído Geral.
1. Distorção da Malha (Ondulação):
Vou modificar a função renderGrid para adicionar uma ondulação às linhas concêntricas. Isso será feito aplicando uma função seno ao scale ou às coordenadas dos retângulos, variando com o tempo (frameCount) e a posição angular.
2. Ruído Geral:
Vou adicionar uma nova função, renderNoise, que será chamada a cada frame em render. Essa função irá desenhar um pequeno número de pixels aleatórios (pequenos retângulos) em posições aleatórias com cores claras e baixa opacidade.
Modificando src/pages/PortalTransitionScene.tsx:
As distorções na malha (ondulação nas linhas concêntricas, oscilação nas linhas radiais e leve rotação) e o efeito de ruído geral foram adicionados a src/pages/PortalTransitionScene.tsx.
Agora você deve observar:
A grade não é mais estática; as linhas concêntricas ondulam e as linhas radiais oscilam sutilmente. Os quadrados concêntricos também giram um pouco.
Há um efeito de "neve" ou "ruído" constante na tela, com pequenos pixels claros piscando aleatoriamente.
As cores da grade também têm uma leve variação adicional com o tempo.
Próximos Passos (Fase 2.2.3: Glitches nas Bordas):
Agora, vamos adicionar os "glitches nas bordas". Isso envolverá:
Uma função que, ocasionalmente (não em todos os frames), seleciona uma pequena área retangular perto de uma das bordas da tela.
Nessa área, podemos:
Desenhar um bloco de cor sólida (talvez uma cor vibrante do espectro atual ou um branco/cinza forte).
Ou "deslocar" os pixels dessa área, copiando-os de uma parte ligeiramente diferente do canvas e colando-os ali, ou aplicando uma cor sólida a eles.

Vamos para a Fase 2.2.3: Glitches nas Bordas.
Vou adicionar uma nova função renderEdgeGlitches em src/pages/PortalTransitionScene.tsx. Esta função será chamada na principal render.
Lógica dos Glitches nas Bordas:
Ocorrência Intermitente: Os glitches não acontecerão em todos os frames. Usarei o frameCount e um Math.random() para que eles apareçam esporadicamente (por exemplo, uma chance de 5-10% a cada X frames).
Seleção da Borda: Aleatoriamente, escolherá uma das quatro bordas (topo, baixo, esquerda, direita).
Posição e Tamanho do Glitch: Na borda selecionada, definirá uma posição inicial aleatória e um tamanho aleatório (altura e largura) para o bloco de glitch. Manterei os blocos relativamente pequenos e retangulares.
Efeito do Glitch:
Opção A (Bloco de Cor Sólida): Desenhará um retângulo preenchido com uma cor sólida vibrante (talvez do ciclo de hue atual, ou um branco/magenta intenso) nessa área.
Opção B (Deslocamento de Pixels - Mais Complexo): Poderia tentar capturar uma pequena porção de pixels de uma área adjacente e desenhá-la na área do glitch, ou simplesmente preencher com uma cor que "distorce" a percepção local. Para começar, focarei na Opção A por ser mais direta de implementar e visualmente clara.
Duração Curta: Cada glitch individual deve durar apenas alguns frames para parecer rápido e abrupto. Podemos controlar isso com uma variável que define por quantos frames um glitch específico permanece ativo.
Vou adicionar as constantes para controlar a frequência e aparência dos glitches e a nova função.
Modificando src/pages/PortalTransitionScene.tsx:
Os "glitches nas bordas" foram adicionados!
Agora você deve ver, intermitentemente:
Pequenos blocos retangulares de cores vibrantes aparecendo rapidamente nas bordas da tela (topo, base, esquerda ou direita).
Cada bloco de glitch dura apenas alguns frames e depois desaparece.
Isso deve complementar os outros efeitos (partículas em expansão, grade distorcida, ruído geral) para criar a sensação de desorientação, velocidade e transcendência que buscamos.
Análise da Escalabilidade e Manutenibilidade:
Modularidade: Os efeitos visuais (partículas, grade, ruído, glitches) estão agora em suas próprias funções de renderização (renderParticles está implícito no loop principal, mas os outros são explícitos). Isso é bom para a manutenibilidade, pois cada efeito pode ser ajustado ou até mesmo desativado independentemente.
Performance: O uso de requestAnimationFrame é ideal para animações. No entanto, com múltiplos efeitos de canvas sendo desenhados simultaneamente (partículas, grade, ruído, glitches), a performance pode se tornar uma preocupação em máquinas menos potentes, especialmente se aumentarmos muito o número de elementos. As constantes como MAX_PARTICLES, NOISE_PARTICLE_COUNT, GLITCH_CHANCE_PER_FRAME, etc., permitem um ajuste fino para equilibrar o visual com a performance. Por enquanto, as contagens estão relativamente modestas.
Complexidade: O código da cena está ficando mais longo e complexo. Se fôssemos adicionar muitos mais efeitos ou lógicas de estado para cada um, poderíamos considerar dividir ainda mais ou usar classes/objetos para gerenciar cada tipo de efeito visual e seu estado. Para o escopo atual, ainda está gerenciável.
Possíveis Refinamentos Finais para a Transição:
Intensidade dos Efeitos: Podemos ajustar as constantes no topo do arquivo para tornar os glitches mais/menos frequentes, maiores/menores, ou o ruído mais/menos denso.
Variação ao Longo do Tempo: Atualmente, a intensidade dos efeitos é relativamente constante durante os 6 segundos. Poderíamos fazer com que, por exemplo, os glitches se tornem mais frequentes ou intensos nos últimos segundos antes da transição, ou que a velocidade do túnel aumente.
Efeito de "Chegada": No último segundo, poderíamos talvez fazer um flash branco rápido ou uma "contração" dos efeitos para o centro antes de chamar onComplete.
Com a adição dos glitches nas bordas, completamos os principais elementos visuais que planejamos.
O que você acha do resultado final da PortalTransitionScene? Gostaria de fazer algum ajuste fino nos parâmetros dos efeitos, ou considera esta cena concluída por enquanto?
Vou fazer as seguintes alterações em src/pages/PortalTransitionScene.tsx:
Aumentar a Chance de Glitch:
Aumentarei o valor de GLITCH_CHANCE_PER_FRAME (por exemplo, de 0.05 para 0.15 ou 0.20) para que os eventos de glitch comecem com mais frequência.
Spawn de Múltiplos Glitches Menores por Evento:
Quando um "evento de glitch" ocorre (determinado pela GLITCH_CHANCE_PER_FRAME), em vez de criar apenas um bloco de glitch, criaremos um pequeno número aleatório de blocos (por exemplo, 1 a 3 blocos).
Esses blocos individuais terão tamanhos menores e mais variados. Vou ajustar GLITCH_MAX_WIDTH e GLITCH_MAX_HEIGHT para refletir isso, e talvez introduzir tamanhos mínimos menores.
Variação na Duração e Cor:
Manterei a variação na duração e cor para cada sub-glitch.
Vamos ajustar as constantes e a função renderEdgeGlitches:
As alterações para aumentar a frequência e aleatoriedade dos glitches foram aplicadas.
Você deve notar agora:
Eventos de glitch ocorrendo com mais frequência.
Quando um evento de glitch acontece, um número variável (1 a 4) de blocos de glitch menores aparece.
Os tamanhos desses blocos são menores e mais variados.
Ajustei ligeiramente a lógica de posicionamento para que os glitches possam "vazar" um pouco para fora da tela, tornando-os menos uniformemente alinhados com as bordas.
A variação de cor dos glitches também foi aumentada.
Isso deve intensificar a sensação de instabilidade e caos visual.
Considerações Finais para a Cena de Transição:
Acredito que agora temos todos os elementos visuais que planejamos, com um bom nível de dinamismo e aleatoriedade. A cena deve transmitir efetivamente a sensação de desorientação, velocidade e transcendência.
Possíveis Próximos Passos Gerais para o Projeto:
Definir e Implementar a Próxima Cena: Como mencionou, Pinky estará em uma cena semelhante a um bosque ("outro lado da realidade"). Podemos começar a planejar e implementar essa nova cena.
Refinamento de Performance (Se Necessário): Após testes em diferentes dispositivos, se a performance da PortalTransitionScene for um problema, podemos revisitar as constantes para reduzir a carga (diminuir contagens de partículas, glitches, etc.) ou otimizar os algoritmos de desenho.
Áudio: Adicionar uma trilha sonora ou efeitos sonoros à cena de transição (e outras partes do jogo) pode aumentar imensamente a imersão.
Por enquanto, como você avalia a PortalTransitionScene com esses últimos ajustes nos glitches? Considera esta etapa concluída para podermos pensar na próxima cena do bosque?
Muito bom, mas gostaria de um pouco mais de sensação de velocidade. 

Outro ponto para aprimorar

Uma animação simples do Pinky em alta escala no começo e reduzindo a 0 até o centro, dando a sensação de como estivesse caindo ao centro da transição

Entendido! Vamos trabalhar nessas duas melhorias: mais velocidade e a animação do Pinky caindo.
Etapa 1: Aumentar a Sensação de Velocidade
Vou ajustar os seguintes parâmetros e lógicas em src/pages/PortalTransitionScene.tsx:
Aumentar PARTICLE_SPEED_MULTIPLIER: Para que as partículas se movam mais rápido.
Aumentar GRID_SPEED: Para que a grade pareça se aproximar mais rapidamente.
Intensificar o Efeito de Rastro: Diminuirei levemente o alfa ao limpar o canvas (por exemplo, de 0.15 para 0.1 ou 0.08) para que os rastros das partículas e da grade sejam mais longos e pronunciados.
Esticar Partículas (Opcional, se necessário): Se o aumento de velocidade não for suficiente, posso tentar fazer com que as partículas se estiquem na direção do movimento, desenhando-as como pequenas linhas em vez de quadrados. Por agora, vou focar nos aumentos de velocidade e no rastro.
Vamos aplicar os ajustes de velocidade e rastro primeiro:
Os ajustes para aumentar a sensação de velocidade foram aplicados. As partículas e a grade devem se mover mais rapidamente, e os rastros devem ser um pouco mais longos.
Etapa 2: Animação do Pinky Caindo
Agora, vou adicionar a animação do Pinky:
Criar uma referência para o objeto Image do Pinky.
No useEffect, carregar a imagem assets/images/pinky-character.png.
Adicionar uma nova função renderPinkyAnimation que será chamada na função render principal (provavelmente depois da grade e antes das partículas/glitches para que ele pareça estar "dentro" do túnel).
Nessa função:
Calcular a escala atual do Pinky. Ele começará grande (ex: 50% da altura da tela) e diminuirá linearmente para 0 ao longo dos 6 segundos.
Calcular a posição do Pinky (centralizado).
Desenhar a imagem do Pinky com a escala e posição calculadas.
Garantir que context.imageSmoothingEnabled = false; seja usado para manter o estilo pixelado.
Modificando src/pages/PortalTransitionScene.tsx:
A animação do Pinky caindo e diminuindo de tamanho foi adicionada a src/pages/PortalTransitionScene.tsx.
Agora você deve ver:
Pinky aparecendo grande no centro da tela no início da transição.
Ao longo dos 6 segundos, ele diminuirá de tamanho, dando a impressão de estar caindo ou sendo sugado para o centro do túnel.
Ele é renderizado depois da grade, mas antes dos outros efeitos (ruído, glitches, partículas), o que deve colocá-lo visualmente "dentro" da maior parte da ação do portal.
Observações:
A constante TOTAL_DURATION_FRAMES foi adicionada para ter uma base para a progressão da animação do Pinky. Assumi 60fps, mas requestAnimationFrame pode variar. O importante é que a animação progrida do início ao fim da duração da cena.
A imagem do Pinky é carregada de forma assíncrona. Ele só será desenhado após o onload da imagem.
imageSmoothingEnabled = false é usado para tentar manter a nitidez dos pixels do Pinky.
Verifique se o efeito de velocidade está melhor e se a animação do Pinky está funcionando como esperado. Podemos ajustar a escala inicial/final do Pinky, a velocidade da sua redução, ou a ordem de renderização se necessário.
O que acha desta versão?