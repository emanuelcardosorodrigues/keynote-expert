# Instalação em VPS

```bash
git clone https://github.com/emanuelcardosorodrigues/keynote-expert.git
cd keynote-expert
npm ci
npm run build
sudo mkdir -p /var/www/keynote-expert
sudo rsync -a --delete dist/lps-slide-aula06/ /var/www/keynote-expert/
```

Nginx:

```nginx
location /p/lps-slide-aula06/ {
  alias /var/www/keynote-expert/;
  try_files $uri $uri/ /p/lps-slide-aula06/index.html;
}
```

O Worker/D1 continua sendo necessário para login, admin e métricas. Para uma VPS 100% independente, é preciso trocar a API D1 por um serviço SQLite/Node; isso não é feito automaticamente para evitar expor senha ou banco.
