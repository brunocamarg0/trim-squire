# 🔧 Solução: Erro "api-key-not-valid"

## ⚠️ O erro indica que a API Key do Firebase não está sendo reconhecida

### Passo 1: Verificar a API Key no Firebase Console

1. Acesse: https://console.firebase.google.com
2. Selecione seu projeto "Barbearia"
3. Clique no ícone **⚙️ Engrenagem** → **Configurações do projeto**
4. Role até a seção **"Seus aplicativos"**
5. Clique no app web que você criou
6. **COPIE A API KEY COMPLETA** (deve ter aproximadamente 39 caracteres e começar com "AIza")

### Passo 2: Atualizar o arquivo .env.local

1. Abra o arquivo `.env.local` na raiz do projeto
2. Substitua a linha `VITE_FIREBASE_API_KEY=` pela API Key que você copiou
3. **IMPORTANTE**: 
   - Não deixe espaços antes ou depois do `=`
   - A API Key deve começar com `AIza` (A maiúsculo, I maiúsculo, za minúsculo)
   - Deve ter aproximadamente 39 caracteres

**Exemplo correto:**
```env
VITE_FIREBASE_API_KEY=AIzaSyCcu5Mo4yee-2KkhCbsYY6CPqJnxM6zl9A
```

**❌ ERRADO:**
```env
VITE_FIREBASE_API_KEY = AIzaSyCcu5Mo4yee-2KkhCbsYY6CPqJnxM6zl9A  (com espaços)
VITE_FIREBASE_API_KEY=AIzaSyCcu5Mo4yee-2KkhCbsYY6CPqJnxM6zl9A   (com espaços no final)
```

### Passo 3: Reiniciar o Servidor COMPLETAMENTE

**CRÍTICO**: O Vite só carrega variáveis de ambiente quando o servidor inicia!

1. **Pare o servidor completamente:**
   - No terminal, pressione `Ctrl + C`
   - Aguarde alguns segundos
   - Se necessário, feche o terminal e abra um novo

2. **Inicie novamente:**
   ```bash
   npm run dev
   ```

3. **Recarregue a página no navegador:**
   - Pressione `Ctrl + Shift + R` (hard refresh)
   - Ou feche e abra o navegador novamente

### Passo 4: Verificar no Console do Navegador

1. Abra o DevTools (F12)
2. Vá para a aba **Console**
3. Procure por erros relacionados ao Firebase
4. Se aparecer `🔍 Firebase Config Debug:`, verifique se `isConfigured: true`

## ✅ Checklist

- [ ] API Key copiada diretamente do Firebase Console
- [ ] API Key começa com "AIza" (não "Alza" ou "AIzA")
- [ ] API Key tem aproximadamente 39 caracteres
- [ ] Arquivo `.env.local` está na raiz do projeto (mesma pasta do `package.json`)
- [ ] Não há espaços antes ou depois do `=` no arquivo
- [ ] Servidor foi **COMPLETAMENTE REINICIADO** após atualizar o arquivo
- [ ] Página do navegador foi recarregada (hard refresh)

## 🔍 Se ainda não funcionar

1. **Verifique se há múltiplos apps Firebase:**
   - No Firebase Console, verifique se há mais de um app web criado
   - Use a API Key do app correto

2. **Regenere a API Key (se necessário):**
   - No Firebase Console → Configurações do projeto
   - Role até "Chaves de API"
   - Se necessário, crie uma nova chave

3. **Verifique se o arquivo .env.local não tem BOM ou encoding incorreto:**
   - O arquivo deve ser UTF-8 sem BOM
   - Não deve ter espaços ou caracteres invisíveis

## 📝 Exemplo de arquivo .env.local correto:

```env
VITE_FIREBASE_API_KEY=AIzaSyCcu5Mo4yee-2KkhCbsYY6CPqJnxM6zl9A
VITE_FIREBASE_AUTH_DOMAIN=barbearia-5cb67.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=barbearia-5cb67
VITE_FIREBASE_STORAGE_BUCKET=barbearia-5cb67.firebasestorage.app
VITE_FIREBASE_MESSAGING_SENDER_ID=55554148067
VITE_FIREBASE_APP_ID=1:55554148067:web:5a568c9e28f819356927d6
```

**⚠️ LEMBRE-SE**: Sempre reinicie o servidor após alterar o `.env.local`!

