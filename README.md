# LPS Slide Aula 06

Deck de apresentação ao vivo baseado no projeto antigo `lps-slide-aula06`, com projeção pública, presenter protegido por senha, notas/cola editáveis, sincronização entre dispositivos, métricas por slide e administração de usuários.

## O que existe

- `/p/lps-slide-aula06/`: tela da audiência; exibe somente o slide.
- `/p/lps-slide-aula06/?presenter=1`: presenter autenticado; teclado, mãos-livres, voltar/avançar, forçar sincronia, cronômetros, cola editável e notas locais.
- `/p/lps-slide-aula06/admin.html`: login admin, usuários ativos, remoção de usuários, edição de cola e tempo agregado por slide.
- `worker/`: Worker Cloudflare com D1, sessões HttpOnly, API administrativa e coleta de tempo.

O frontend não contém qualquer referência a Jev ou credenciais.

## Desenvolvimento local

```bash
npm ci
npm run typecheck
npm run build
npm run dev
```

Para testar a API local, configure um D1 no `worker/wrangler.toml`, crie o banco e defina o segredo local:

```bash
cd worker
npm install
npx wrangler d1 create lps-slide-aula06
# copie o database_id para wrangler.toml
npx wrangler d1 migrations apply lps-slide-aula06 --local
npx wrangler secret put ADMIN_PASSWORD_SHA256 --local
npx wrangler dev
```

O valor do segredo é o SHA-256 hexadecimal da senha da conta `admin` (nunca commite a senha ou o hash). Usuários criados no admin recebem email e senha próprios, armazenados apenas como hash.

## Deploy Cloudflare Workers + D1

1. `npm run build` na raiz.
2. Crie o D1: `cd worker && npx wrangler d1 create lps-slide-aula06`.
3. Substitua `COLOQUE_O_DATABASE_ID_AQUI` em `worker/wrangler.toml`.
4. Aplique a migration: `npx wrangler d1 migrations apply lps-slide-aula06 --remote`.
5. Crie o segredo: `printf %s 'HASH_SHA256' | npx wrangler secret put ADMIN_PASSWORD_SHA256`.
6. Publique: `npx wrangler deploy`.

O Worker serve os artefatos de `../dist/lps-slide-aula06` pelo binding `ASSETS`. Para usar sob `/p/lps-slide-aula06/`, mantenha a regra de roteamento do Worker de páginas existente ou publique o Worker no hostname dedicado e faça o rewrite na borda.

## VPS (sem Cloudflare)

O build é estático e pode ser servido por Nginx. A API continua sendo o Worker; para uma VPS totalmente independente, substitua `worker/src/index.ts` por um adaptador Node compatível com SQLite/D1 ou mantenha o Worker em Cloudflare.

```bash
git clone <URL_DO_REPOSITORIO> lps-slide-aula06
cd lps-slide-aula06
npm ci && npm run build
sudo rsync -a --delete ../dist/lps-slide-aula06/ /var/www/lps-slide-aula06/
```

Exemplo mínimo de Nginx:

```nginx
location /p/lps-slide-aula06/ {
  alias /var/www/lps-slide-aula06/;
  try_files $uri $uri/ /p/lps-slide-aula06/index.html;
}
```

Use HTTPS. Não coloque senha, hash ou token no repositório; injete-os como segredo do provedor.

## Testes e operação ao vivo

- `npm run typecheck` e `npm run build` são gates de publicação.
- Abra primeiro a projeção e depois o presenter. O presenter exige login; a audiência nunca recebe a UI do presenter.
- `→`, `↓`, `PageDown`, espaço e Enter avançam; setas esquerdas, `PageUp` e Backspace voltam. `F` alterna tela cheia e `R` reinicia cronômetros.
- “Forçar sincronia” significa abrir/recarregar o presenter: ele adota o estado da projeção via `BroadcastChannel`; a URL `#sN` é fallback.
- Se o navegador não oferecer `BroadcastChannel`, cada tela continua navegável, mas sem sincronização automática.

## Limites conhecidos

O plano gratuito não inclui R2. Assets são versionados no build; para uploads futuros, adicionar R2 é uma decisão separada. O D1 guarda usuários, sessões, textos de cola e tempos, mas a definição visual dos slides continua no código para manter builds determinísticos.
