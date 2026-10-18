# Gerador de Legenda

Aplicação web gratuita que gera legendas para vídeos direto no navegador: o usuário escolhe o vídeo, a legenda é transcrita localmente com Whisper, ele revisa assistindo e baixa a legenda (SRT/VTT) ou o vídeo legendado. Não há backend, conta nem histórico: o vídeo nunca sai do computador e nada fica salvo.

## Requisitos

- Node 24 (veja `.nvmrc`; mínimo 22.12). Use o npm 11 que vem com o Node 24: o npm 10.9 tem um bug ao resolver peer dependencies opcionais (`Cannot read properties of null (reading 'edgesOut')`) ao instalar pacotes novos.
- Chrome ou Edge atuais para desenvolver (WebGPU e `crossOriginIsolated`).

## Comandos

| Comando                           | O que faz                                                                       |
| --------------------------------- | ------------------------------------------------------------------------------- |
| `npm run dev`                     | Servidor de desenvolvimento em `http://localhost:5173`, com COOP/COEP           |
| `npm run build`                   | Typecheck + build estático em `dist/` (inclui `_headers`)                       |
| `npm run preview`                 | Serve o build em `http://localhost:4173`, com COOP/COEP                         |
| `npm run check`                   | Typecheck, lint, formatação e testes unitários (falha se qualquer etapa falhar) |
| `npm test`                        | Testes unitários e de componentes (Vitest + Testing Library)                    |
| `npm run test:tooling`            | Testes da infraestrutura (tsc, eslint, prettier, build, CI)                     |
| `npm run test:e2e`                | Testes end-to-end (Playwright) contra o dev server e o preview                  |
| `npm run lint` / `npm run format` | ESLint / Prettier                                                               |

Na primeira vez, instale o navegador dos testes e2e com `npx playwright install chromium`.

## Fluxo de desenvolvimento (OpenSpec)

O projeto segue Spec-Driven Development com [OpenSpec](https://github.com/Fission-AI/OpenSpec). Nenhum código é escrito sem uma mudança aprovada.

1. `/opsx:explore` (opcional) para entender o problema.
2. `/opsx:propose <nome>` cria `openspec/changes/<nome>/` com proposta, design, tasks e deltas de spec.
3. `openspec validate <nome> --strict` até passar.
4. Aprovação humana da proposta.
5. `/opsx:apply` implementa as tasks; todo cenário da spec tem um teste que cita o nome do cenário.
6. `/opsx:verify` confere se o código bate com a spec.
7. `/opsx:archive` move a mudança para `openspec/changes/archive/` e atualiza `openspec/specs/`.

O contexto do projeto (stack, princípios, decisões de produto e a ordem das mudanças) fica em `openspec/config.yaml`.

## Hospedagem

Site estático no Cloudflare Pages (plano gratuito). `public/_headers` aplica `Cross-Origin-Opener-Policy: same-origin` e `Cross-Origin-Embedder-Policy: credentialless`, os mesmos headers que `config/cross-origin-headers.ts` aplica no dev e no preview.
