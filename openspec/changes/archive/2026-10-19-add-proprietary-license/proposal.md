# Proposal

## Why

O repositório vai ser público no GitHub para consulta, mas o código não é de uso livre. Sem um arquivo de licença, a situação fica ambígua para quem encontra o projeto.

## What Changes

- `LICENSE` proprietária ("todos os direitos reservados") em nome de Alan Santos, em português e inglês: o código pode ser lido, mas não pode ser copiado, modificado, distribuído ou usado sem autorização por escrito.
- Componentes de terceiros mantêm as próprias licenças (fonte Inter sob OFL em `public/fonts/Inter-LICENSE.txt`; dependências npm sob as licenças delas).
- `package.json` com `"license": "UNLICENSED"`; seção "Licença" no README.

### Fora do escopo

- Qualquer mudança de comportamento do app (sem delta de spec).

## Capabilities

### New Capabilities

Nenhuma.

### Modified Capabilities

Nenhuma.

## Impact

- `LICENSE`, `package.json`, `README.md`.
