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
const isConfigured = apiKey && apiKey !== 'your-api-key-here' && !apiKey.includes('your-');

if (!isConfigured) {
  console.warn('⚠️ AVISO: Firebase não está configurado!');
  console.warn('📝 Por favor, crie um arquivo .env.local na raiz do projeto com suas credenciais do Firebase.');
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
let authInstance, dbInstance, storageInstance;

try {
  if (app) {
    authInstance = getAuth(app);
    dbInstance = getFirestore(app);
    storageInstance = getStorage(app);
  } else {
    // Criar instâncias mock para não quebrar a aplicação
    authInstance = null as any;
    dbInstance = null as any;
    storageInstance = null as any;
  }
} catch (error) {
  console.error('❌ Erro ao inicializar serviços Firebase:', error);
  authInstance = null as any;
  dbInstance = null as any;
  storageInstance = null as any;
}

export const auth = authInstance;
export const db = dbInstance;
export const storage = storageInstance;

export default app;

