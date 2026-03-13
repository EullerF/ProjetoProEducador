# Task Dashboard App - Projeto ProEducador

Um painel de controle (Dashboard) completo para gerenciamento de tarefas, categorias e tags personalizadas, desenvolvido com foco em UI/UX Premium, Glassmorphism e alta performance.

## 🚀 Tecnologias Utilizadas

### Frontend
- **React** (via Vite)
- **TypeScript**
- **Bootstrap 5** (Layout e Componentes) + CSS Customizado (Glassmorphism)
- **Recharts** (Gráficos Dinâmicos de Desempenho)
- **Framer Motion** (Animações fluidas)
- **Lucide React** (Ícones)
- **Axios** (Integração com API)
- **React Router v6** (Navegação SPA)

### Backend
- **Node.js** com **Express**
- **TypeScript** (tsx para desenvolvimento)
- **Prisma ORM** (Modelagem e manipulação do banco de dados)
- **SQLite** (Banco de Dados relacional, modelo MVP rápido)
- **JWT** (JSON Web Tokens para Autenticação Segura)
- **Bcrypt.js** (Criptografia de senhas)

---

## ⚙️ Como executar o projeto localmente

Para rodar o projeto, você precisará inicializar as duas frentes: **Backend (API)** e **Frontend**. Certifique-se de ter o Node.js v18 ou superior instalado.

### 1. Rodando o Backend (API)

Abra o terminal e acesse a pasta do backend:
```bash
cd backend
```

Instale as dependências:
```bash
npm install
```

Gere os artefatos do Prisma e sincronize a estrutura com o banco de dados SQLite:
```bash
npx prisma generate
npx prisma db push
```

Inicie o servidor de desenvolvimento:
```bash
npm run dev
```
O backend ficará acessível em `http://localhost:3000`.

### 2. Rodando o Frontend (Aplicação Web)

Abra um **novo terminal** e acesse a pasta do frontend:
```bash
cd frontend
```

Instale as dependências locias:
```bash
npm install
```

Inicie o servidor local do Vue/Vite:
```bash
npm run dev
```
O Frontend ficará acessível, por padrão, em `http://localhost:5173`. Acesse esta URL no navegador para ver o sistema.
