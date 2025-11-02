# 🎉 Barber - Sistema de Gestão para Barbearias

Sistema completo de gestão e agendamento para barbearias, com controle financeiro, gestão de equipe e muito mais.

## ⚡ Início Rápido

### 1. Clone e instale dependências

```sh
git clone https://github.com/brunocamarg0/trim-squire.git
cd trim-squire
npm install
```

### 2. 🔥 Configure o Firebase (OBRIGATÓRIO)

**⚠️ IMPORTANTE**: Antes de usar o sistema, você precisa configurar o Firebase.

1. **Crie um arquivo `.env.local` na raiz do projeto**
2. **Siga o guia completo**: Veja [`CONFIGURAR_FIREBASE.md`](./CONFIGURAR_FIREBASE.md) para instruções detalhadas passo a passo.

**Resumo rápido:**
- Crie um projeto no [Firebase Console](https://console.firebase.google.com)
- Ative Authentication (Email/Password)
- Crie um banco Firestore (modo de teste)
- Copie as credenciais para `.env.local`

### 3. Execute o projeto

```sh
npm run dev
```

O app estará disponível em `http://localhost:8080`

---

## 🚀 Funcionalidades

- ✅ **Autenticação completa** - Login e registro de proprietários
- 📅 **Sistema de agendamentos** - Gestão completa de agendamentos
- 👥 **Gestão de clientes** - Cadastro e histórico de clientes
- 💇 **Gestão de barbeiros** - Controle de equipe e comissões
- 💰 **Controle financeiro** - Receitas, despesas e relatórios
- 📊 **Dashboard em tempo real** - Métricas e estatísticas atualizadas

## 📁 Estrutura do Projeto

```
src/
├── components/     # Componentes reutilizáveis
├── contexts/      # Contexts React (AuthContext)
├── lib/           # Configurações (Firebase)
├── pages/         # Páginas da aplicação
├── services/      # Serviços Firebase
└── types/         # Tipos TypeScript
```

## 🔧 Tecnologias

- **React** + **TypeScript**
- **Firebase** (Auth, Firestore, Storage)
- **Tailwind CSS** + **shadcn/ui**
- **React Router** para navegação
- **date-fns** para manipulação de datas

---

## 📖 Como editar este código

There are several ways of editing your application.

**Use Lovable**

Simply visit the [Lovable Project](https://lovable.dev/projects/aad27fcd-4e9a-4943-8548-664ae7045d90) and start prompting.

Changes made via Lovable will be committed automatically to this repo.

**Use your preferred IDE**

If you want to work locally using your own IDE, you can clone this repo and push changes. Pushed changes will also be reflected in Lovable.

The only requirement is having Node.js & npm installed - [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating)

Follow these steps:

```sh
# Step 1: Clone the repository using the project's Git URL.
git clone <YOUR_GIT_URL>

# Step 2: Navigate to the project directory.
cd <YOUR_PROJECT_NAME>

# Step 3: Install the necessary dependencies.
npm i

# Step 4: Start the development server with auto-reloading and an instant preview.
npm run dev
```

**Edit a file directly in GitHub**

- Navigate to the desired file(s).
- Click the "Edit" button (pencil icon) at the top right of the file view.
- Make your changes and commit the changes.

**Use GitHub Codespaces**

- Navigate to the main page of your repository.
- Click on the "Code" button (green button) near the top right.
- Select the "Codespaces" tab.
- Click on "New codespace" to launch a new Codespace environment.
- Edit files directly within the Codespace and commit and push your changes once you're done.

## What technologies are used for this project?

This project is built with:

- Vite
- TypeScript
- React
- shadcn-ui
- Tailwind CSS

## How can I deploy this project?

Simply open [Lovable](https://lovable.dev/projects/aad27fcd-4e9a-4943-8548-664ae7045d90) and click on Share -> Publish.

## Can I connect a custom domain to my Lovable project?

Yes, you can!

To connect a domain, navigate to Project > Settings > Domains and click Connect Domain.

Read more here: [Setting up a custom domain](https://docs.lovable.dev/features/custom-domain#custom-domain)
