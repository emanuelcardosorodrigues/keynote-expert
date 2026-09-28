# Webinar ELOS

Deck de aplicação do Programa ELOS, com 132 telas públicas e presenter protegido.

- Público: `https://w.othiagomagalhaes.com/pac-web01-slides/`
- Presenter: `https://w.othiagomagalhaes.com/pac-web01-slides/?presenter=1`
- Administração: `https://w.othiagomagalhaes.com/pac-web01-slides/admin.html`

O conteúdo visual e a cola do presenter são extraídos dos arquivos em `src/content/`. Depoimentos são os materiais autorizados em `public/assets/elos/`.

## Verificação

```bash
npm ci && npm run typecheck && npm run build
cd worker && npm ci && npm run typecheck
```

## Deploy THM

O `worker/wrangler.toml` está fixado na conta THM e no D1 `pac-web01-slides`. A publicação usa o cofre local:

```bash
cd worker
~/.config/apolo/cf-deploy.sh .
```
