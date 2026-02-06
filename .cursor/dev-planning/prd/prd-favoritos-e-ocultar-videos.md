## Introdução / Visão Geral

Este PRD descreve duas novas funcionalidades do aplicativo Laratube, voltado para crianças e adolescentes que ainda não podem acessar o YouTube livremente. O app exibe uma lista estática de vídeos pré‑selecionados (via JSON estático publicado no GitHub Pages) e não possui backend ou banco de dados. As novas features são:

- **Favoritar vídeo (coração)**: permitir que o usuário marque vídeos como favoritos para facilitar o acesso e protegê‑los contra exclusão acidental.
- **Ocultar vídeo (excluir)**: permitir que o usuário oculte vídeos que não deseja mais ver, de forma persistente entre sessões no mesmo navegador.

Todo o gerenciamento de estado de favoritos e ocultos deve ser feito **no lado do cliente**, utilizando `localStorage` (ou mecanismo equivalente suportado amplamente) com foco em **boa performance** e **compatibilidade**, evitando recursões custosas ou verificações excessivas sobre vídeos que já não existem mais no JSON.

## Objetivos

1. **Dar controle ao usuário** (crianças/adolescentes e/ou responsáveis) para marcar vídeos preferidos, preservando‑os de exclusão acidental.
2. **Permitir ocultar vídeos indesejados** de forma permanente por navegador, de modo que não voltem a ser exibidos em novos acessos.
3. **Garantir boa performance de carregamento**, mesmo com até ~200 vídeos, evitando lógicas recursivas e verificações desnecessárias.
4. **Manter compatibilidade com GitHub Pages** e ausência total de backend/servidor.
5. **Manter o tema, estilo visual e guidelines atuais**, reutilizando componentes e padrões já existentes sempre que possível.

## User Stories

1. **US01 – Favoritar vídeo**
   - Como **usuário (criança/adolescente ou responsável)**, quero **marcar um vídeo como favorito** pressionando o botão de coração, para que ele seja destacado como preferido e não possa ser excluído por engano.
2. **US02 – Proteger vídeo favorito de exclusão**
   - Como **usuário**, quero que **ao favoritar um vídeo, o botão de excluir deixe de aparecer** para esse vídeo, para evitar exclusão acidental.
3. **US03 – Remover favorito**
   - Como **usuário**, quero poder **clicar novamente no botão de coração para desfavoritar** um vídeo, para que o botão de excluir volte a aparecer e eu possa ocultá‑lo se desejar.
4. **US04 – Ocultar vídeo**
   - Como **usuário**, quero **ocultar um vídeo** pressionando o botão de excluir, para que ele **não seja exibido novamente** em acessos futuros no mesmo navegador.
5. **US05 – Persistência por navegador**
   - Como **usuário**, quero que **favoritos e vídeos ocultos sejam lembrados** sempre que eu abrir o site no mesmo navegador, para não precisar refazer as escolhas.
6. **US06 – Não exibir vídeos ocultados no carregamento**
   - Como **usuário**, quero que **vídeos marcados como ocultos já não apareçam na listagem ao carregar a página**, para reduzir distrações e tornar o carregamento mais rápido e objetivo.
7. **US07 – Confirmação antes de ocultar**
   - Como **usuário**, quero **ver uma confirmação** antes de um vídeo ser efetivamente ocultado, para evitar que eu oculte algo por engano.
8. **US08 – Limpar preferências**
   - Como **responsável ou usuário avançado**, quero **acessar um botão de configurações no topo superior direito** e, a partir de um modal, **limpar todas as preferências salvas (favoritos e ocultos)** com confirmação, para restaurar a listagem completa de vídeos como se fosse o primeiro acesso.

## Requisitos Funcionais

1. **RF01 – Persistência em armazenamento local**
   - O sistema deve armazenar o estado de vídeos **favoritados** e **ocultos** utilizando `localStorage` ou mecanismo equivalente amplamente suportado pelo navegador (sem uso de servidor).
   - A persistência deve ser **por navegador**, ou seja, o estado não é sincronizado entre dispositivos.
2. **RF02 – Identificação estável de vídeos**
   - Cada vídeo do JSON deve possuir um **identificador estável** (por exemplo, um campo `id` ou outro campo único) que permita:
     - Registrar se está **favoritado**.
     - Registrar se está **oculto**.
   - O mecanismo de persistência deve **usar apenas esses identificadores**, para evitar acoplamento forte com campos voláteis (como título).
3. **RF03 – Listagem de vídeos**
   - Na página inicial (ou tela principal), o sistema deve listar **todos os vídeos presentes no JSON** de dados, **exceto**:
     - Vídeos que tenham sido marcados como **ocultos** pelo usuário (via botão de excluir).
     - Não é necessário exibir mensagem de erro se um vídeo anteriormente oculto/favoritado **não estiver mais** no JSON: nesse caso, o registro pode ser simplesmente ignorado.
4. **RF04 – Botão de favoritar (coração)**
   - Cada vídeo exibido deve possuir um botão de **coração** (favoritar).
   - Ao clicar no botão de coração:
     - Se o vídeo **não estava favoritado**, ele passa a ser favoritado.
     - O estado de favorito deve ser salvo de forma persistente no `localStorage`.
     - **Enquanto o vídeo estiver favoritado, o botão de excluir não deve ser exibido** para esse vídeo.
   - Um segundo clique no botão de coração deve:
     - **Remover o status de favorito**.
     - Atualizar o estado persistido.
     - **Reexibir o botão de excluir** para esse vídeo.
5. **RF05 – Botão de excluir (ocultar)**
   - Cada vídeo exibido **não favoritado** deve possuir um botão de **excluir/ocultar**.
   - Ao clicar no botão de excluir:
     - O sistema deve exibir uma **confirmação** (por exemplo, `window.confirm` ou componente de modal) antes de concluir a ação.
     - Se o usuário confirmar, o vídeo deve ser **marcado como oculto** e deixado de aparecer na lista **em tempo real**.
     - O estado de oculto deve ser salvo de forma persistente no `localStorage`.
   - Vídeos ocultos **não devem ser exibidos em novos carregamentos** da página.
6. **RF06 – Carregamento eficiente**
   - No carregamento da página:
     - O sistema deve ler do `localStorage` a lista de **ids de vídeos ocultos** e **ids de vídeos favoritados**.
     - A filtragem dos vídeos ocultos e a marcação dos vídeos favoritados devem ser feitas em uma **única passagem** (ou em algoritmos de custo linear) sobre a lista de vídeos, **sem recursão**.
     - A lógica deve ser otimizada para funcionar bem mesmo com até **200 vídeos**.
7. **RF07 – Sincronização com o JSON**
   - Caso o JSON principal seja atualizado e algum vídeo que estava favoritado ou oculto **não exista mais**:
     - Esse vídeo simplesmente **não será exibido** nem gerará erro.
     - O registro no `localStorage` pode ser mantido ou limpo de forma preguiçosa (lazy), desde que não afete a performance.
8. **RF08 – Compatibilidade com navegadores alvo**
   - A solução deve usar APIs com **boa compatibilidade** em navegadores modernos, incluindo Chrome, Firefox, Edge e Brave (não é necessário suporte a modo privado).
   - Deve ser considerado que o Brave, em particular, **já apresentou problemas de demora de carregamento**; a solução não deve reintroduzir lógicas pesadas que acentuem esse problema.
9. **RF09 – Interface consistente com o tema atual**
   - Os novos estados visuais (favorito/oculto/confirmar exclusão) devem:
     - **Respeitar o tema e guidelines atuais** da aplicação.
     - **Reutilizar componentes, estilos e padrões existentes** sempre que possível (por exemplo, modais ou ícones já padronizados no projeto).
10. **RF10 – Limitação de escopo visual**
   - Não é necessário, neste momento, criar dashboards ou telas extras de gerenciamento; basta:
     - Indicar visualmente que um vídeo está **favoritado** (por exemplo, coração preenchido).
     - Não exibir o botão de excluir para vídeos favoritados.
     - Não exibir vídeos que foram marcados como ocultos.
11. **RF11 – Botão de configurações e limpeza de preferências**
   - Deve existir um **botão de configurações (ícone de gear)** posicionado no **topo superior direito** da interface principal.
   - Ao clicar nesse botão:
     - Deve ser aberto um **modal de configurações**.
     - Dentro do modal, deve haver um **botão para limpar todas as preferências salvas** (estado de favoritos e ocultos) no `localStorage` (ou mecanismo equivalente).
     - Antes de executar a limpeza, o sistema deve exibir uma **confirmação clara** (no próprio modal ou em diálogo adicional).
     - Uma vez confirmada a limpeza:
       - As chaves utilizadas para armazenar favoritos e ocultos devem ser apagadas do `localStorage`.
       - A UI deve ser atualizada para **reexibir todos os vídeos do JSON** como não favoritados e não ocultos.
       - Não é necessário feedback adicional além do fechamento do modal e do refresh da listagem, desde que a mudança seja visualmente óbvia.

## Requisitos Não Funcionais

1. **RNF01 – Performance**
   - O carregamento da lista de vídeos (incluindo leitura de `localStorage`, filtragem de ocultos e marcação de favoritos) deve ser perceptivelmente rápido mesmo com ~200 vídeos.
   - É **proibido** o uso de recursão para varrer listas de vídeos ou estados; devem ser usadas **estruturas iterativas simples** e, preferencialmente, estruturas de dados com acesso O(1) (por exemplo, `Set` ou `Map` em memória) para checar se um vídeo está oculto/favorito.
2. **RNF02 – Simplicidade de implementação**
   - A solução deve ser suficientemente simples para ser compreendida por um **desenvolvedor júnior**, com funções bem nomeadas e responsabilidades claras.
3. **RNF03 – Robustez diante de mudanças no JSON**
   - A aplicação deve continuar funcionando corretamente mesmo que:
     - Novos vídeos sejam adicionados ao JSON.
     - Vídeos antigos sejam removidos do JSON.
   - O código não deve assumir que o JSON é estático ou imutável, apenas que é a **fonte de verdade** para a lista atual de vídeos.
4. **RNF04 – Persistência confiável**
   - A lógica deve lidar graciosamente com falhas na leitura ou escrita do `localStorage` (por exemplo, tratar exceções e cair em um comportamento seguro, como não persistir, mas ainda assim carregar a lista de vídeos).

## Não Objetivos (Out of Scope)

1. **Sincronização entre dispositivos ou contas**
   - Não haverá sincronização de favoritos/ocultos entre diferentes navegadores, dispositivos ou contas.
2. **Backend, banco de dados ou APIs externas**
   - Não será criado nenhum backend ou integração com APIs externas para armazenar o estado; tudo será client‑side.
3. **Gestão avançada de listas**
   - Não será implementada, neste momento, uma tela específica para gerenciar todos os favoritos/ocultos em um só lugar; o gerenciamento é feito diretamente na listagem principal.
4. **Perfis de usuário ou autenticação**
   - Não há criação de usuários, login, controle por perfil ou permissões diferenciadas.
5. **Relatórios ou métricas automáticas**
   - Não serão implementados dashboards ou coleta automática de métricas de uso (a mensuração será feita via pesquisa NPS externa).

## Considerações de Design

1. **UI/UX geral**
   - Manter o **tema atual** do Laratube (cores, tipografia, espaçamentos).
   - Garantir que os ícones de **coração** (favoritar) e **excluir/ocultar** sejam claros e acessíveis para crianças e adolescentes.
2. **Estados visuais**
   - Coração:
     - Estado **normal**: vídeo não favoritado.
     - Estado **ativo**: vídeo favoritado (por exemplo, coração preenchido).
   - Botão de excluir:
     - Exibido somente quando o vídeo **não está favoritado**.
     - Pode ser ocultado por completo ou desabilitado (com estilo visual condizente).
3. **Confirmação de exclusão/ocultação**
   - A confirmação pode ser feita inicialmente com `window.confirm` ou, se já existir um componente de modal no projeto, reutilizá‑lo.
   - A mensagem deve ser simples e clara, adequada para crianças/adolescentes (linguagem amigável).

## Considerações Técnicas

1. **Stack atual**
   - Aplicação React + TypeScript, empacotada com Vite e servida como site estático no GitHub Pages.
2. **Estratégia recomendada de persistência**
   - Estrutura sugerida no `localStorage` (pseudocódigo conceitual):
     - Chave, por exemplo: `laratube:video-preferences`
     - Valor: JSON com formato semelhante a:
       - `{ favorites: string[], hidden: string[] }`
     - Onde cada item é o `id` do vídeo.
   - Em memória, após carregar:
     - Converter os arrays em `Set<string>` para checagem rápida (`isFavorite`, `isHidden`).
3. **Fluxo de inicialização**
   - Ao iniciar a aplicação:
     1. Carregar o JSON de vídeos.
     2. Ler o estado do `localStorage` (tratando falhas com `try/catch`).
     3. Construir `Set` de `favorites` e `hidden`.
     4. Filtrar a lista de vídeos removendo os `hidden`.
     5. Marcar cada vídeo com a flag de favorito baseada no `Set` de `favorites`.
4. **Fluxo de interação**
   - Favoritar:
     - Atualizar estado em memória (ex.: `favoritesSet.add(videoId)`).
     - Persistir alteração no `localStorage`.
     - Atualizar UI (coração ativo, ocultar botão excluir).
   - Desfavoritar:
     - Atualizar estado em memória (ex.: `favoritesSet.delete(videoId)`).
     - Persistir.
     - Atualizar UI (coração normal, exibir botão excluir).
   - Ocultar:
     - Pedir confirmação.
     - Em caso afirmativo:
       - Adicionar ao `hiddenSet`.
       - Persistir.
       - Remover imediatamente o vídeo da lista renderizada.

## Métricas de Sucesso

1. **Satisfação do usuário**
   - A principal métrica será medida por **pesquisa NPS** específica sobre a experiência de favoritar e ocultar vídeos (por exemplo, “Quão satisfeito você está com a forma de marcar e esconder vídeos no Laratube?”).
2. **Indicadores qualitativos (observáveis)**
   - Redução de relatos de performance lenta ao carregar a página (principalmente em navegadores como o Brave).
   - Redução de reclamações sobre exclusão acidental de vídeos favoritos.

## Questões em Aberto

1. **Limite máximo de armazenamento**
   - Definido pelo usuário como **não necessário neste momento**; será utilizada a capacidade padrão do `localStorage`, confiando na baixa escala (até ~200 vídeos).
2. **Comportamento ao limpar armazenamento do navegador**
   - Ao o usuário limpar manualmente dados/cache do navegador, o comportamento padrão (perder preferências) é **aceito**; não há requisitos adicionais de UX específicos.
3. **Acessibilidade**
   - As interações devem seguir **boas práticas gerais de acessibilidade** (uso adequado de rótulos, foco, etc.), sem especificações adicionais neste PRD.

