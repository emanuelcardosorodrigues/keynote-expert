# Segurança

- O código público não contém credenciais.
- `ADMIN_PASSWORD_SHA256` fica somente como segredo do Worker.
- Sessões usam cookie `HttpOnly`, `Secure`, `SameSite=Strict` e expiração configurável (90 dias por padrão).
- Admin exige sessão e perfil `admin`; a projeção pública nunca recebe a UI do presenter.
- Presenter sem login é uma opção explícita e reduz a proteção das notas/cola; use apenas em rede e conteúdo apropriados.
- Ao suspeitar de vazamento, revogue o segredo, gere outro hash e reimplante o Worker.
