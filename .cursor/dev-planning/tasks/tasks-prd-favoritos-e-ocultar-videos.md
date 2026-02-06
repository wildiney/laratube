## Relevant Files

- `src/components/videoList.tsx` - Renderiza a listagem de vídeos; precisará filtrar ocultos e refletir favorito/ocultar na UI.
- `src/components/VideoModal.tsx` - Pode precisar refletir estados (ex.: favorito) ou manter consistência visual.
- `src/App.tsx` - Ponto de composição da UI; provável local para inserir o botão de configurações no topo direito.
- `src/data/videos.json` - Fonte de verdade da listagem; define o identificador que será usado para persistência.
- `src/model/video.ts` - Modelo TypeScript do vídeo; deve incluir/validar o campo identificador estável.
- `src/lib/videoPreferences.ts` - Nova camada (util) para ler/escrever preferências (favoritos/ocultos) no `localStorage` com segurança e performance.
- `src/lib/videoPreferences.test.ts` - Testes unitários da persistência e parsing resiliente (ex.: JSON inválido, ausência de chave).
- `src/components/SettingsModal.tsx` - Novo modal mínimo de configurações com ação “limpar preferências”.
- `src/components/SettingsModal.test.tsx` - Testes de interação do modal (confirmação antes de limpar; aciona callback).
- `src/components/videoList.test.tsx` - Testes de renderização/fluxos principais: favoritar oculta botão excluir, desfavoritar reexibe, ocultar remove da lista.
- `vite.config.ts` - Pode precisar de ajustes para ambiente de testes, caso seja adotado Vitest.
- `package.json` - Adicionar scripts e dependências de teste (mínimo viável).
- `vitest.config.ts` - Configuração de testes (environment jsdom, integração com React e setup global).
- `src/test/setupTests.ts` - Setup global de testes (por exemplo, jest-dom para matchers adicionais).

### Notes

- Os testes devem ser **mínimos e focados nos fluxos críticos**: persistência, filtragem de ocultos no carregamento e regras de UI (favorito vs excluir) + limpeza via configurações.
- O projeto hoje não tem runner de testes configurado; para o mínimo viável em React + Vite, a sugestão é **Vitest + Testing Library**.
- Quando comandos de CLI forem executados, seguir o limite de tempo (~60s) e revisar diffs de lockfile após updates.

## Tasks

- [x] 1.0 Definir estratégia de identificação e shape de persistência
- [x] 1.1 Confirmar o identificador estável do vídeo (preferência: `id`) em `src/data/videos.json` e `src/model/video.ts`.
- [x] 1.2 Definir chaves e formato no `localStorage` (ex.: `laratube:video-preferences` com `{ favorites: string[], hidden: string[] }`).
- [x] 1.3 Definir estratégia de compatibilidade/performance: carregar preferências 1x, converter arrays para `Set`, filtrar lista em \(O(n)\) sem recursão.

- [x] 2.0 Implementar persistência eficiente (favoritos/ocultos) no cliente
- [x] 2.1 Especificar API mínima do util `src/lib/videoPreferences.ts` (com JSDoc): `load()`, `save()`, `toggleFavorite(id)`, `hide(id)`, `clear()`.
- [x] 2.2 Implementar `load()` resiliente com `try/catch` e fallback seguro (JSON inválido/ausente → estado vazio).
- [x] 2.3 Implementar `save()` com escrita atômica (serializar uma única estrutura) e tratamento de exceções de `localStorage`.
- [x] 2.4 Implementar `clear()` removendo a(s) chave(s) do `localStorage`.

- [ ] 3.0 Implementar UI mínima na listagem (favoritar, ocultar com confirmação, regra de esconder excluir)
- [ ] 3.1 (TDD) Criar testes de UI para `videoList` cobrindo:
  - [x] 3.1.1 Vídeo favoritado não exibe botão de excluir.
- [x] 3.1.2 Desfavoritar reexibe o botão de excluir.
  - [ ] 3.1.3 Clicar em excluir pede confirmação; confirmando, remove o item da lista e persiste como oculto.
  - [ ] 3.1.4 Ao carregar, itens marcados como ocultos não aparecem (filtro no “primeiro paint”).
- [ ] 3.2 Integrar leitura inicial do `localStorage` no fluxo de carregamento da lista (sem loops recursivos).
- [ ] 3.3 Implementar toggle de favorito no botão de coração e persistir via `videoPreferences`.
- [ ] 3.4 Implementar ocultação (excluir) apenas quando não favoritado, com confirmação antes de persistir/ocultar.
- [ ] 3.5 Garantir que vídeos que não existam mais no JSON sejam ignorados (sem warnings/erros visíveis).

- [ ] 4.0 Implementar botão de configurações + modal + “limpar preferências” (com confirmação)
- [ ] 4.1 (TDD) Criar testes para `SettingsModal`:
  - [ ] 4.1.1 Abrir/fechar modal.
  - [ ] 4.1.2 Clique em “limpar preferências” pede confirmação; confirmando, chama `videoPreferences.clear()` e dispara atualização da listagem.
- [ ] 4.2 Implementar botão de gear no topo superior direito em `src/App.tsx`.
- [ ] 4.3 Implementar `src/components/SettingsModal.tsx` com botão “Limpar preferências” e confirmação.
- [ ] 4.4 Ao limpar preferências, garantir que a UI reflita estado “zerado” (lista completa, sem favoritos/ocultos).

- [ ] 5.0 Adicionar testes mínimos (unit + integração) e garantir performance no carregamento
- [x] 5.1 Adicionar runner de testes mínimo (Vitest) e libs de teste React.
- [x] 5.2 Antes de adicionar dependências: `pnpm audit` - checar vulnerabilidades antes de instalar novas dependências.
- [x] 5.3 Instalar dependências de teste (mínimo viável) e re-rodar auditoria.
- [ ] 5.4 Criar testes unitários para `src/lib/videoPreferences.ts` cobrindo:
  - [x] 5.4.1 Estado vazio quando não há chave.
  - [x] 5.4.2 Recuperação quando JSON está inválido.
  - [x] 5.4.3 Toggle de favorito e ocultar persistem corretamente.
  - [x] 5.4.4 `clear()` remove preferências.
- [ ] 5.5 Adicionar scripts no `package.json` (ex.: `test`, `test:watch`) e documentar no `README.md` (mínimo).
- [ ] 5.6 Rodar lint e testes para validar (sem regressões) e revisar performance de carregamento (checar que a filtragem é linear e ocorre uma vez).
  - [x] 5.7 Configurar Vitest para React (environment jsdom e setup de testes).


