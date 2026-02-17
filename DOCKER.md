# 🐳 Deploy com Docker - Segundo Cérebro

## Quick Start

```bash
# 1. Copie a pasta para o servidor
scp -r segundo-cerebro usuario@seu-ip:/var/www/

# 2. Acesse o servidor
ssh usuario@seu-ip
cd /var/www/segundo-cerebro

# 3. Build e execute
docker-compose up -d --build

# 4. Verifique se está rodando
docker-compose ps
docker-compose logs -f
```

## Comandos Úteis

```bash
# Parar
docker-compose down

# Reiniciar
docker-compose restart

# Ver logs
docker-compose logs -f

# Rebuild
docker-compose up -d --build

# Entrar no container
docker exec -it segundo-cerebro sh
```

## Com Nginx (Recomendado)

### 1. Crie a rede nginx
```bash
docker network create nginx-network
```

### 2. Edite o docker-compose.yml
Descomente a seção `networks` no final do arquivo.

### 3. Configure o Nginx
```nginx
# /etc/nginx/sites-available/jarvisnf.cloud
server {
    listen 80;
    server_name jarvisnf.cloud www.jarvisnf.cloud;
    
    location / {
        proxy_pass http://segundo-cerebro:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }
}
```

### 4. SSL com Certbot
```bash
sudo apt install certbot python3-certbot-nginx
sudo certbot --nginx -d jarvisnf.cloud -d www.jarvisnf.cloud
```

## Variáveis de Ambiente

Crie `.env` na raiz se necessário:

```env
NODE_ENV=production
PORT=3000
```

## Porta Diferente

Edite o `docker-compose.yml`:

```yaml
ports:
  - "8080:3000"  # Externamente na porta 8080
```

---

**Pronto! Acesse http://SEU-IP:3000 ou https://jarvisnf.cloud**