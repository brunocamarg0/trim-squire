import { initializeApp, getApps, FirebaseApp } from 'firebase/app';
import { getAuth, Auth } from 'firebase/auth';
import { getFirestore, Firestore } from 'firebase/firestore';
import { getStorage, FirebaseStorage } from 'firebase/storage';

// Configuração do Firebase
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

if (!isConfigured) {
  console.error('❌ ERRO: Firebase não está configurado!');
  console.error('📝 Certifique-se de que o arquivo .env.local existe na raiz do projeto com suas credenciais.');
  console.error('📖 Veja o arquivo ENV_EXAMPLE.txt para o formato correto.');
}

// Firebase config
const firebaseConfig = {
  apiKey: apiKey || 'not-configured',
  authDomain: authDomain || 'not-configured',
  projectId: projectId || 'not-configured',
  storageBucket: storageBucket || 'not-configured',
  messagingSenderId: messagingSenderId || 'not-configured',
  appId: appId || 'not-configured'
};

// Initialize Firebase (usar app existente se já estiver inicializado)
let app: FirebaseApp;
try {
  const existingApps = getApps();
  if (existingApps.length > 0) {
    app = existingApps[0];
  } else {
    app = initializeApp(firebaseConfig);
  }
  
  if (!isConfigured) {
    console.warn('⚠️ Firebase inicializado com credenciais padrão. Configure o .env.local corretamente.');
  }
} catch (error) {
  console.error('❌ Erro ao inicializar Firebase:', error);
  throw new Error('Falha ao inicializar Firebase. Verifique suas credenciais no arquivo .env.local');
}

// Initialize Firebase services
let authInstance: Auth;
let dbInstance: Firestore;
let storageInstance: FirebaseStorage;

try {
  authInstance = getAuth(app);
  dbInstance = getFirestore(app);
  storageInstance = getStorage(app);
  
  if (!isConfigured) {
    console.warn('⚠️ Serviços Firebase inicializados, mas as credenciais podem estar incorretas.');
  }
} catch (error) {
  console.error('❌ Erro ao inicializar serviços Firebase:', error);
  throw new Error('Falha ao inicializar serviços Firebase. Verifique a configuração.');
}

export const auth = authInstance;
export const db = dbInstance;
export const storage = storageInstance;

export default app;

