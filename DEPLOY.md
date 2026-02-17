# 🚀 Guia de Deploy Rápido - Segundo Cérebro

## 📋 Pré-requisitos

- Node.js 18+ instalado
- NPM ou Yarn
- 500MB de espaço em disco
- Porta 3000 disponível (ou configurar outra)

---

## ⚡ Deploy em 5 minutos

### Opção 1: VPS (Hostinger, DigitalOcean, etc)

```bash
# 1. Acesse sua VPS via SSH
ssh usuario@seu-ip

# 2. Clone ou copie o projeto
cd /var/www
# Se usar Git:
git clone [seu-repo] segundo-cerebro
# Se for via SCP:
# scp -r segundo-cerebro usuario@ip:/var/www/

cd segundo-cerebro

# 3. Instale dependências
npm install

# 4. Build do projeto
npm run build

# 5. Instale PM2 (gerenciador de processos)
npm install -g pm2

# 6. Inicie a aplicação
pm2 start npm --name "segundo-cerebro" -- start

# 7. Configure para iniciar com o sistema
pm2 startup
pm2 save

# 8. Verifique se está rodando
pm2 status
```

**Acesse:** `http://SEU-IP:3000`

---

### Opção 2: Com Domínio (jarvisnf.cloud)

```bash
# 1. Configure DNS no Hostinger
# Adicione registro A apontando para seu IP

# 2. Instale Nginx
sudo apt update
sudo apt install nginx

# 3. Configure proxy reverso
sudo nano /etc/nginx/sites-available/jarvisnf.cloud
```

**Cole esta configuração:**

```nginx
server {
    listen 80;
    server_name jarvisnf.cloud www.jarvisnf.cloud;
    
    location / {
        proxy_pass http://localhost:3000;
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

```bash
# 4. Habilite o site
sudo ln -s /etc/nginx/sites-available/jarvisnf.cloud /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx

# 5. Configure SSL (HTTPS)
sudo apt install certbot python3-certbot-nginx
sudo certbot --nginx -d jarvisnf.cloud -d www.jarvisnf.cloud

# 6. Teste a renovação automática
sudo certbot renew --dry-run
```

**Acesse:** `https://jarvisnf.cloud`

---

### Opção 3: Vercel (Mais Fácil)

```bash
# 1. Instale Vercel CLI
npm i -g vercel

# 2. Deploy
vercel

# 3. Siga as instruções
# - Login
# - Confirme projeto
# - Pronto!
```

---

## 🔧 Configurações Avançadas

### Variáveis de Ambiente

Crie `.env.local` na raiz do projeto:

```env
# Porta (padrão: 3000)
PORT=3000

# Ambiente
NODE_ENV=production

# Se usar banco de dados externo
DATABASE_URL=postgresql://...

# Se usar autenticação
NEXTAUTH_SECRET=sua-chave-secreta
NEXTAUTH_URL=https://jarvisnf.cloud
```

### Usar Porta Diferente

```bash
# Altere a porta
PORT=8080 pm2 start npm --name "segundo-cerebro" -- start

# Ou edite o package.json
# "start": "next start -p 8080"
```

---

## 📊 Monitoramento

### Logs

```bash
# Ver logs em tempo real
pm2 logs segundo-cerebro

# Ver logs do Nginx
sudo tail -f /var/log/nginx/access.log
sudo tail -f /var/log/nginx/error.log
```

### Status

```bash
# Status do PM2
pm2 status

# Status do Nginx
sudo systemctl status nginx

# Uso de recursos
pm2 monit
```

---

## 🔄 Atualizações

```bash
# 1. Pare a aplicação
pm2 stop segundo-cerebro

# 2. Atualize o código
git pull

# 3. Instale novas dependências (se houver)
npm install

# 4. Rebuilde
npm run build

# 5. Reinicie
pm2 restart segundo-cerebro
```

---

## 🛡️ Segurança

### Firewall (UFW)

```bash
# Habilite firewall
sudo ufw enable

# Permitir SSH
sudo ufw allow ssh

# Permitir HTTP/HTTPS
sudo ufw allow 'Nginx Full'

# Verificar status
sudo ufw status
```

### Atualizações Automáticas

```bash
# Instale unattended-upgrades
sudo apt install unattended-upgrades

# Configure
sudo dpkg-reconfigure -plow unattended-upgrades
```

---

## 🐛 Troubleshooting

### Erro: "Port 3000 already in use"

```bash
# Encontre o processo
lsof -i :3000

# Mate o processo
kill -9 [PID]
```

### Erro: "Permission denied"

```bash
# Dê permissões
sudo chown -R $USER:$USER /var/www/segundo-cerebro
chmod -R 755 /var/www/segundo-cerebro
```

### Build falhou

```bash
# Limpe cache
rm -rf .next node_modules
npm install
npm run build
```

---

## 📈 Performance

### Otimizações

```bash
# 1. Aumente memória do Node (se necessário)
NODE_OPTIONS="--max-old-space-size=2048" pm2 start npm --name "segundo-cerebro" -- start

# 2. Enable gzip no Nginx
sudo nano /etc/nginx/nginx.conf
# Adicione:
# gzip on;
# gzip_types text/plain text/css application/json application/javascript text/xml;
```

---

## ✅ Checklist de Deploy

- [ ] Node.js instalado (v18+)
- [ ] Projeto copiado para VPS
- [ ] Dependências instaladas (`npm install`)
- [ ] Build realizado (`npm run build`)
- [ ] PM2 instalado e configurado
- [ ] Aplicação rodando (`pm2 status`)
- [ ] DNS configurado (se usar domínio)
- [ ] Nginx configurado (se usar domínio)
- [ ] SSL configurado (se usar domínio)
- [ ] Firewall configurado
- [ ] Backup automático configurado

---

## 🆘 Suporte

**Logs importantes:**
- App: `pm2 logs segundo-cerebro`
- Nginx: `/var/log/nginx/error.log`
- Sistema: `journalctl -u nginx`

**Comandos úteis:**
```bash
pm2 restart segundo-cerebro  # Reiniciar
pm2 stop segundo-cerebro     # Parar
pm2 delete segundo-cerebro   # Remover
pm2 monit                    # Monitorar
```

---

**🎯 Seu Segundo Cérebro estará online em minutos!**