# 🔑 Como Obter as Credenciais do Firebase

## 📍 Onde Estamos

Você já tem:
- ✅ Nome do projeto: **Barbearia**
- ✅ ID do projeto: **barbearia-5cb67**
- ✅ Número do projeto: **55554148067**
- ❌ **FALTA**: Chave de API da Web

## 🎯 O Que Fazer Agora

### Passo 1: Criar App Web no Firebase

1. Na página que você está vendo (com as informações do projeto), **role para baixo** ou procure por:
   - **"Seus aplicativos"** ou **"Your apps"**
   - Ou **ícone `</>`** (Web)
   
2. Clique no **ícone `</>` (Web)** ou em **"Adicionar app"** → **"Web"**

3. Você verá uma tela perguntando:
   - **Apelido do app** (Nickname): Digite "Barber Web" ou qualquer nome
   - ✅ **Marque a opção "Também configure o Firebase Hosting"** (opcional, pode desmarcar)
   
4. Clique em **"Registrar app"** ou **"Register app"**

### Passo 2: Copiar as Credenciais

Após criar o app, você verá uma tela com código JavaScript parecido com isso:

```javascript
const firebaseConfig = {
  apiKey: "AIzaSyC1234567890abcdefghijklmnopqrstuvwxyz",
  authDomain: "barbearia-5cb67.firebaseapp.com",
  projectId: "barbearia-5cb67",
  storageBucket: "barbearia-5cb67.appspot.com",
  messagingSenderId: "55554148067",
  appId: "1:55554148067:web:abcdef1234567890"
};
```

**Copie TODOS esses valores!**

### Passo 3: Criar Arquivo .env.local

1. Na raiz do seu projeto (pasta `trim-squire-main`), crie um arquivo chamado **`.env.local`**

2. Cole o seguinte conteúdo, substituindo pelos valores que você copiou:

```env
VITE_FIREBASE_API_KEY=AIzaSyC1234567890abcdefghijklmnopqrstuvwxyz
VITE_FIREBASE_AUTH_DOMAIN=barbearia-5cb67.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=barbearia-5cb67
VITE_FIREBASE_STORAGE_BUCKET=barbearia-5cb67.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=55554148067
VITE_FIREBASE_APP_ID=1:55554148067:web:abcdef1234567890
```

**⚠️ IMPORTANTE**: 
- Use os valores REAIS que você copiou do Firebase
- O `messagingSenderId` será o número do projeto: `55554148067`
- O `projectId` será: `barbearia-5cb67`

### Passo 4: Habilitar Authentication

1. No menu lateral do Firebase, clique em **"Autenticação"** (Authentication)
2. Clique em **"Começar"** (Get started)
3. Vá para a aba **"Métodos de login"** (Sign-in method)
4. Clique em **"Email/Senha"**
5. Ative a primeira opção e clique em **"Salvar"**

### Passo 5: Criar Banco Firestore

1. No menu lateral, clique em **"Firestore Database"**
2. Clique em **"Criar banco de dados"** (Create database)
3. Escolha **"Começar no modo de teste"** (Start in test mode)
4. Selecione localização: **"southamerica-east1"** (São Paulo)
5. Clique em **"Ativar"**

### Passo 6: Reiniciar o Servidor

Depois de criar o `.env.local`:

1. Pare o servidor (Ctrl+C no terminal)
2. Execute novamente: `npm run dev`
3. Agora você pode criar contas! 🎉

## ❓ Não Encontrou a Seção "Seus aplicativos"?

Se você não encontrar a seção de apps, tente:

1. Clique no ícone de **⚙️ Engrenagem** ao lado de "Visão geral do projeto"
2. Selecione **"Configurações do projeto"** (Project settings)
3. Role até a seção **"Seus aplicativos"** ou **"Your apps"**
4. Lá você verá o botão para adicionar um app web

## 🎯 Resumo Rápido

Você precisa:
1. ✅ Criar app web no Firebase (ícone `</>`)
2. ✅ Copiar todas as credenciais
3. ✅ Criar arquivo `.env.local` com as credenciais
4. ✅ Habilitar Authentication (Email/Senha)
5. ✅ Criar Firestore Database
6. ✅ Reiniciar o servidor

Depois disso, tudo funcionará! 🚀

