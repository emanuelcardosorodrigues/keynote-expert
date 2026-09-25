# Cloudflare Workers + D1

```bash
npm ci && npm run build
cd worker
npm ci
npx wrangler d1 create lps-slide-aula06
# coloque o database_id retornado em wrangler.toml
npx wrangler d1 migrations apply lps-slide-aula06 --remote
printf %s 'HASH_SHA256_DA_SENHA_ADMIN' | npx wrangler secret put ADMIN_PASSWORD_SHA256
npx wrangler deploy
```

Para presenter sem login, altere no `worker/wrangler.toml`:

```toml
PRESENTER_AUTH_REQUIRED = "false"
```

Depois execute novamente `npx wrangler deploy`. Não use R2: os assets estão versionados no build e o D1 guarda sessões, usuários, cola e métricas.
