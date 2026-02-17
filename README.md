# 🧠 Segundo Cérebro - JarvisNF

Sistema completo de Segundo Cérebro para gerenciamento de conhecimento e produtividade pessoal.

![Next.js](https://img.shields.io/badge/Next.js-14-black)
![TypeScript](https://img.shields.io/badge/TypeScript-5.3-blue)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.4-38bdf8)

## ✨ Funcionalidades

### 📊 Dashboard
- Visão geral do sistema
- Estatísticas em tempo real
- Ações rápidas
- Tarefas prioritárias
- Notas recentes
- Hábitos do dia

### 📝 Notas
- Criação e edição de notas
- Categorização (nota, ideia, tarefa, referência)
- Sistema de tags
- Busca e filtros
- Fixar notas importantes

### ✅ Tarefas
- Gerenciamento completo de tarefas
- Prioridades (urgente, alta, média, baixa)
- Data de vencimento
- Status de conclusão
- Filtros avançados

### ⚡ Captura Rápida
- Input rápido para ideias
- Tipos de captura
- Sistema de processamento
- Histórico de capturas

### 🚀 Próximas Funcionalidades
- Projetos
- Metas
- Recursos
- Hábitos
- Integração com APIs

## 🛠️ Tecnologias

- **Framework:** Next.js 14 (App Router)
- **Linguagem:** TypeScript
- **Estilização:** Tailwind CSS
- **Estado:** Zustand
- **Ícones:** Lucide React
- **Datas:** date-fns
- **Notificações:** react-hot-toast

## 📦 Instalação

```bash
# Clonar ou copiar projeto
cd segundo-cerebro

# Instalar dependências
npm install

# Rodar em desenvolvimento
npm run dev

# Build para produção
npm run build

# Iniciar em produção
npm start
```

## 🔧 Configuração

### Variáveis de Ambiente

Crie um arquivo `.env.local`:

```env
# Opcional - para persistência externa
DATABASE_URL=

# Opcional - para autenticação
NEXTAUTH_SECRET=
NEXTAUTH_URL=

# Opcional - para integrações
GOOGLE_CALENDAR_API_KEY=
NOTION_API_KEY=
```

### Deploy

#### Vercel (Recomendado)
```bash
npm i -g vercel
vercel
```

#### Docker
```bash
docker build -t segundo-cerebro .
docker run -p 3000:3000 segundo-cerebro
```

#### VPS Manual
```bash
# Build
npm run build

# PM2
npm i -g pm2
pm2 start npm --name "segundo-cerebro" -- start
pm2 save
pm2 startup
```

## 🎨 Estrutura do Projeto

```
segundo-cerebro/
├── src/
│   ├── app/              # App Router (Next.js 14)
│   │   ├── layout.tsx    # Layout principal
│   │   ├── page.tsx      # Página principal
│   │   └── globals.css   # Estilos globais
│   ├── components/       # Componentes React
│   │   ├── Sidebar.tsx
│   │   ├── Dashboard.tsx
│   │   ├── NotesView.tsx
│   │   ├── TasksView.tsx
│   │   └── QuickCapture.tsx
│   ├── store/           # Estado global (Zustand)
│   │   └── index.ts
│   ├── types/           # TypeScript types
│   │   └── index.ts
│   └── lib/             # Utilitários
├── public/              # Arquivos estáticos
├── package.json
├── tailwind.config.js
├── tsconfig.json
└── README.md
```

## 💡 Conceitos do Segundo Cérebro

### Método PARA
- **Projects:** Projetos ativos
- **Areas:** Áreas de responsabilidade
- **Resources:** Recursos e referências
- **Archive:** Arquivo morto

### Captura Rápida
Sistema para capturar ideias rapidamente sem interromper o fluxo de trabalho.

### Processamento
Revisão periódica dos itens capturados para organização adequada.

## 🔐 Segurança

- Validação de inputs
- Sanitização de dados
- LocalStorage seguro
- Preparado para autenticação

## 📱 Responsividade

- Mobile-first design
- Sidebar adaptativa
- Touch-friendly
- Breakpoints otimizados

## 🚀 Performance

- Code splitting automático
- Lazy loading
- Otimização de imagens
- Bundle otimizado

## 🎯 Roadmap

### Fase 1 ✅
- [x] Dashboard
- [x] Sistema de notas
- [x] Gerenciamento de tarefas
- [x] Captura rápida

### Fase 2 🚧
- [ ] Projetos
- [ ] Metas
- [ ] Hábitos
- [ ] Recursos

### Fase 3 📅
- [ ] Integração Google Calendar
- [ ] Integração Notion
- [ ] API externa
- [ ] Sync multi-dispositivo

### Fase 4 🔮
- [ ] App mobile (React Native)
- [ ] Colaboração
- [ ] IA para sugestões
- [ ] Analytics avançado

## 🤝 Contribuição

Contribuições são bem-vindas! Sinta-se à vontade para:

1. Reportar bugs
2. Sugerir funcionalidades
3. Enviar pull requests
4. Melhorar documentação

## 📄 Licença

MIT License - sinta-se livre para usar e modificar.

## 👤 Autor

Criado para o projeto JarvisNF por Rafael Bazilio.

---

**🧠 Seu segundo cérebro para organização e produtividade!**