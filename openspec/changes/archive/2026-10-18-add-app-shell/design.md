# Design

## Context

Ver proposal.md. Router por arquivos (TanStack), i18n e tema já prontos. Requisitos em `specs/app-shell/spec.md`.

## Decisions

- **D1. Layout raiz.** `__root.tsx` renderiza `<Header />`, `<main>` (largura máxima 1360 px, gutter 24 px, 16 px no celular) com `<Outlet />` e `<Footer />`. `notFoundComponent` da raiz renderiza `NotFoundPage` dentro do mesmo layout, então o cabeçalho também aparece no 404.
- **D2. Etapas como rota sem caminho.** `src/routes/_steps.tsx` (layout pathless do TanStack) envolve `/transcribe`, `/edit`, `/export` e mostra o `<Stepper />`. A etapa atual vem do `useMatchRoute`/`useLocation`; a disponibilidade vem de uma função `getStepAvailability()` que nesta mudança retorna todas disponíveis e será substituída pela sessão em `add-session`.
- **D3. Stepper como componente puro.** `Stepper({ current, available })` usa `<Link>` para etapas disponíveis e `<button disabled>` para indisponíveis (não navegável e anunciado como desabilitado). Testável sem router real via `RouterProvider` de memória.
- **D4. Button com cva.** `src/components/Button.tsx` com variantes `primary` (violeta, pílula), `secondary` (neutro), `ghost` e `danger`, tamanhos `md` (44 px) e `sm` (36 px); foco visível com `ring`.
- **D5. Ícones.** `lucide-react` (já instalado pelo shadcn), sempre `aria-hidden` com rótulo no botão.

## Risks / Trade-offs

- [Rotas de etapa sem conteúdo nesta mudança] → Mostram só o título traduzido até as próximas mudanças; não são alcançáveis pelo fluxo normal antes do upload existir.
