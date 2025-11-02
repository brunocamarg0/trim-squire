# 🔥 Como Configurar o Firebase

## Passo 1: Criar Projeto no Firebase

1. Acesse https://console.firebase.google.com
2. Clique em **"Adicionar projeto"** ou **"Create a project"**
3. Digite um nome para o projeto (ex: "barber-gestao")
4. Continue e aceite os termos
5. **Desabilite** o Google Analytics (não é necessário para começar)
6. Clique em **"Criar projeto"**

## Passo 2: Obter Credenciais do Firebase

1. No console do Firebase, clique no ícone de **engrenagem (⚙️)** ao lado de "Visão geral do projeto"
2. Selecione **"Configurações do projeto"**
3. Role até a seção **"Seus aplicativos"**
4. Clique no ícone **`</>`** (Web) para adicionar um app web
5. Registre um apelido para o app (ex: "Barber Web")
6. **Copie todas as credenciais** que aparecem (não precisa instalar Firebase Hosting)

Você verá algo como:
```javascript
const firebaseConfig = {
  apiKey: "AIza...",
  authDomain: "seu-projeto.firebaseapp.com",
  projectId: "seu-projeto",
  storageBucket: "seu-projeto.appspot.com",
  messagingSenderId: "123456789",
  appId: "1:123456789:web:abcdef"
};
```

## Passo 3: Habilitar Authentication

1. No menu lateral do Firebase Console, clique em **"Autenticação"** (Authentication)
2. Clique em **"Começar"** (Get started)
3. Vá para a aba **"Métodos de login"** (Sign-in method)
4. Clique em **"Email/Senha"**
5. Ative a opção e clique em **"Salvar"**

## Passo 4: Criar Banco de Dados Firestore

1. No menu lateral, clique em **"Firestore Database"**
2. Clique em **"Criar banco de dados"** (Create database)
3. Escolha **"Começar no modo de teste"** (Start in test mode)
4. Selecione a localização mais próxima do Brasil (ex: `southamerica-east1`)
5. Clique em **"Ativar"**

⚠️ **Importante**: O modo de teste permite leitura/escrita por 30 dias. Depois, configure as regras de segurança.

## Passo 5: Configurar o Projeto

1. Na raiz do projeto, crie um arquivo chamado **`.env.local`**
2. Cole o seguinte conteúdo e substitua pelos seus valores:

```env
VITE_FIREBASE_API_KEY=AIza... (sua api key)
VITE_FIREBASE_AUTH_DOMAIN=seu-projeto.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=seu-projeto
VITE_FIREBASE_STORAGE_BUCKET=seu-projeto.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=123456789
VITE_FIREBASE_APP_ID=1:123456789:web:abcdef
```

**Exemplo real:**
```env
VITE_FIREBASE_API_KEY=AIzaSyC1234567890abcdefghijklmnopqrstuvwxyz
VITE_FIREBASE_AUTH_DOMAIN=barber-gestao.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=barber-gestao
VITE_FIREBASE_STORAGE_BUCKET=barber-gestao.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=123456789012
VITE_FIREBASE_APP_ID=1:123456789012:web:abcdef123456
```

## Passo 6: Reiniciar o Servidor

Após criar o arquivo `.env.local`:
1. Pare o servidor (Ctrl+C)
2. Inicie novamente com `npm run dev`
3. O Firebase agora deve funcionar! 🎉

## ⚠️ Problemas Comuns

### Erro: "api-key-not-valid"
- Verifique se copiou a API key completa (sem espaços)
- Certifique-se que o arquivo se chama `.env.local` (com ponto no início)
- Reinicie o servidor após criar o arquivo

### Erro: "Firebase App named '[DEFAULT]' already exists"
- Limpe o cache: `npm run dev -- --force` ou reinicie completamente o terminal

### Erro ao criar conta: "auth/email-already-in-use"
- O email já está cadastrado, use outro ou faça login

## 📝 Nota de Segurança

⚠️ **NUNCA compartilhe ou faça commit do arquivo `.env.local`** no GitHub!
O arquivo já está no `.gitignore` para sua segurança.

