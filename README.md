# 🎉 Presente para Geovana 💙

Um site de aniversário interativo e carinhoso dedicado à Geovana, com flores azuis, animações delicadas e o chatbot inteligente Matteo.

## 🌸 Características

- **Design suave**: Tons de azul-claro e azul-celeste com animações delicadas
- **Flores animadas**: Flores azuis desabrochando e pétalas caindo
- **Chatbot Matteo Inteligente**: Assistente conversacional com IA que entende contexto e conversa naturalmente
- **Páginas interativas**: 
  - Página inicial com animação de flores
  - Página do presente com mensagem digitada, galeria e playlist
  - Modal de recado secreto
  - Página de fotos favoritas com galeria interativa
  - Página final com efeito de pétalas

## 🚀 Como executar localmente

### Frontend (React)

1. Instale as dependências:
```bash
npm install
```

2. Execute o servidor de desenvolvimento:
```bash
npm run dev
```

3. Abra o navegador em `http://localhost:5173`

## 🛠️ Tecnologias

### Frontend
- **React** + **Vite**: Framework e build tool
- **TailwindCSS**: Estilização
- **Framer Motion**: Animações
- **React Router**: Navegação entre páginas

### Backend (Vercel Serverless Functions)
- **Python**: Serverless Functions
- **OpenAI API**: Inteligência artificial conversacional
- **PostgreSQL**: Banco de dados para feedback e histórico do chat

## 🤖 Chatbot Matteo Inteligente

O Matteo é um chatbot conversacional que:
- Entende o contexto das conversas
- Responde de forma natural e personalizada
- Mantém a personalidade carinhosa e divertida
- Conhece informações sobre Pablo e Geovana
- Persiste o histórico de conversas no banco de dados

### Personalizar a personalidade do Matteo

Edite o arquivo `api/_prompts.py` para ajustar:
- Informações sobre você e a Geovana
- Tom e estilo das respostas
- Conhecimentos específicos

## 📝 Personalização

### Adicionar fotos na galeria

Adicione as imagens na pasta `public/fotos/` e edite `src/pages/FotosPage.jsx` para atualizar os dados das fotos.

### Adicionar playlist

Na seção "Playlist Especial", você pode incorporar um iframe do Spotify ou YouTube.

## 🌐 Deploy na Vercel

### 1. Criar projeto na Vercel

1. Acesse [vercel.com](https://vercel.com) e faça login
2. Clique em **"Add New..."** → **"Project"**
3. Importe o repositório do GitHub
4. A Vercel detectará automaticamente que é um projeto Vite

### 2. Configurar banco de dados PostgreSQL

1. No dashboard da Vercel, vá em **"Storage"**
2. Clique em **"Create Database"** → **"Postgres"**
3. Conecte o banco ao seu projeto
4. A variável `POSTGRES_URL` será configurada automaticamente

### 3. Configurar variáveis de ambiente

No projeto da Vercel, vá em **"Settings"** → **"Environment Variables"** e adicione:

| Variável | Descrição | Obrigatória |
|----------|-----------|-------------|
| `OPENAI_API_KEY` | Chave da API da OpenAI | ✅ Sim |
| `POSTGRES_URL` | String de conexão PostgreSQL | ✅ (automática) |
| `SENDER_EMAIL` | E-mail para notificações | Não |
| `SENDER_PASSWORD` | Senha de app do Gmail | Não |
| `RECEIVER_EMAIL` | E-mail destinatário | Não |

### 4. Deploy

O deploy é automático! A cada push no GitHub, a Vercel fará um novo deploy.

## 📁 Estrutura do Projeto

```
presente-main/
├── api/                    # Serverless Functions (Python)
│   ├── _db.py             # Conexão com banco de dados
│   ├── _email.py          # Envio de e-mails
│   ├── _prompts.py        # System prompt do Matteo
│   ├── chat.py            # Endpoint /api/chat
│   ├── feedback.py        # Endpoint /api/feedback
│   ├── health.py          # Endpoint /api/health
│   └── requirements.txt   # Dependências Python
├── src/                   # Frontend React
│   ├── components/        # Componentes reutilizáveis
│   ├── pages/             # Páginas da aplicação
│   └── ...
├── public/                # Arquivos estáticos
│   └── fotos/            # Fotos da galeria
├── vercel.json           # Configuração da Vercel
└── package.json          # Dependências Node.js
```

## 💙 Feito com carinho

Este site foi criado como um presente especial para Geovana! 🌸
