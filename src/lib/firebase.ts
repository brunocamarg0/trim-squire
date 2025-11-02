import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

// Configuração do Firebase
// IMPORTANTE: Configure as credenciais no arquivo .env.local
// Veja CONFIGURAR_FIREBASE.md para instruções detalhadas

const apiKey = import.meta.env.VITE_FIREBASE_API_KEY;
const authDomain = import.meta.env.VITE_FIREBASE_AUTH_DOMAIN;
const projectId = import.meta.env.VITE_FIREBASE_PROJECT_ID;
const storageBucket = import.meta.env.VITE_FIREBASE_STORAGE_BUCKET;
const messagingSenderId = import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID;
const appId = import.meta.env.VITE_FIREBASE_APP_ID;

// Verificar se as credenciais estão configuradas
const isConfigured = apiKey && 
  typeof apiKey === 'string' &&
  apiKey.length > 20 &&
  apiKey !== 'your-api-key-here' && 
  !apiKey.includes('your-') &&
  apiKey.startsWith('AIza');

// Debug: Log das variáveis (apenas em desenvolvimento)
if (import.meta.env.DEV) {
  console.log('🔍 Firebase Config Debug:', {
    hasApiKey: !!apiKey,
    apiKeyLength: apiKey?.length || 0,
    apiKeyStart: apiKey?.substring(0, 10) || 'undefined',
    isConfigured,
    authDomain: !!authDomain,
    projectId: !!projectId
  });
}

if (!isConfigured) {
  console.warn('⚠️ AVISO: Firebase não está configurado corretamente!');
  if (!apiKey) {
    console.warn('📝 Não foi possível encontrar VITE_FIREBASE_API_KEY no .env.local');
    console.warn('💡 Certifique-se de que:');
    console.warn('   1. O arquivo .env.local existe na raiz do projeto');
    console.warn('   2. O servidor foi reiniciado após criar o arquivo');
    console.warn('   3. As variáveis começam com VITE_');
  }
  console.warn('📖 Veja o arquivo CONFIGURAR_FIREBASE.md para instruções detalhadas.');
}

// Firebase config - usar valores padrão se não configurado
const firebaseConfig = {
  apiKey: apiKey || 'not-configured',
  authDomain: authDomain || 'not-configured',
  projectId: projectId || 'not-configured',
  storageBucket: storageBucket || 'not-configured',
  messagingSenderId: messagingSenderId || 'not-configured',
  appId: appId || 'not-configured'
};

// Initialize Firebase apenas se estiver configurado
let app;
try {
  app = initializeApp(firebaseConfig);
  if (!isConfigured) {
    console.warn('⚠️ Firebase inicializado com credenciais padrão. Configure o .env.local para usar o Firebase.');
  }
} catch (error) {
  console.error('❌ Erro ao inicializar Firebase:', error);
  // Criar um objeto mock para não quebrar a aplicação
  app = null as any;
}

// Initialize Firebase services apenas se app estiver inicializado
let authInstance: any = null;
let dbInstance: any = null;
let storageInstance: any = null;

try {
  if (app && isConfigured) {
    try {
      authInstance = getAuth(app);
      dbInstance = getFirestore(app);
      storageInstance = getStorage(app);
    } catch (serviceError) {
      console.error('❌ Erro ao inicializar serviços Firebase:', serviceError);
    }
  }
} catch (error) {
  console.error('❌ Erro ao inicializar serviços Firebase:', error);
}

export const auth = authInstance;
export const db = dbInstance;
export const storage = storageInstance;

export default app;

