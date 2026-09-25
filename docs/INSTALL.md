# Instalação rápida

O repositório é público: `git clone https://github.com/emanuelcardosorodrigues/keynote-expert.git` não exige login no GitHub. O presenter, por padrão, exige senha própria; isso é separado do acesso ao código.

## Modos

- **Protegido (recomendado):** `PRESENTER_AUTH_REQUIRED = "true"`.
- **Presenter público:** `PRESENTER_AUTH_REQUIRED = "false"`. A audiência continua vendo somente a projeção; admin e API administrativa continuam protegidos.

O modo público não registra métricas autenticadas de tempo. Para métricas, use o modo protegido.

## Validação local

```bash
npm ci
npm run typecheck
npm run build
cd worker && npm ci && npm run typecheck
```

Nunca coloque senha, hash ou token em Git. O único segredo obrigatório do Worker é `ADMIN_PASSWORD_SHA256`, criado com `wrangler secret put`.
