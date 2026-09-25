# Operação

- Projeção: `/p/lps-slide-aula06/`.
- Presenter: `/p/lps-slide-aula06/?presenter=1`.
- Admin: `/p/lps-slide-aula06/admin.html`.
- `→`, `↓`, `PageDown`, espaço e Enter avançam; setas esquerdas, `PageUp` e Backspace voltam.
- `F` alterna tela cheia; `R` reinicia cronômetros; “forçar sincronia” adota o estado da projeção.
- Antes de uma apresentação, abrir projeção e presenter, testar duas telas e validar `#s1`.
- Sem `BroadcastChannel`, cada janela continua funcionando, mas sem sincronização.

## Atualização

```bash
git pull --ff-only
npm ci && npm run typecheck && npm run build
cd worker && npm ci && npm run typecheck && npx wrangler deploy
```
