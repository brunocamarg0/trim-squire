import { initializeApp, getApps, FirebaseApp } from 'firebase/app';
import { getAuth, Auth } from 'firebase/auth';
import { getFirestore, Firestore } from 'firebase/firestore';
import { getStorage, FirebaseStorage } from 'firebase/storage';

// ============================================
// CONFIGURAÇÃO DO FIREBASE
// ============================================
// Credenciais do projeto "Barbearia" - Firebase Console
const FIREBASE_CONFIG = {
  apiKey: "AIzaSyCcu5Mo4yee-2KkhCbsYY6CPqJnxM6zl9A",
  authDomain: "barbearia-5cb67.firebaseapp.com",
  projectId: "barbearia-5cb67",
  storageBucket: "barbearia-5cb67.firebasestorage.app",
  messagingSenderId: "55554148067",
  appId: "1:55554148067:web:5a568c9e28f819356927d6",
  measurementId: "G-EPKF1FE86B"
};

// Tentar usar variáveis de ambiente primeiro, senão usar config direto
const apiKey = import.meta.env.VITE_FIREBASE_API_KEY || FIREBASE_CONFIG.apiKey;
const authDomain = import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || FIREBASE_CONFIG.authDomain;
const projectId = import.meta.env.VITE_FIREBASE_PROJECT_ID || FIREBASE_CONFIG.projectId;
const storageBucket = import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || FIREBASE_CONFIG.storageBucket;
const messagingSenderId = import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || FIREBASE_CONFIG.messagingSenderId;
const appId = import.meta.env.VITE_FIREBASE_APP_ID || FIREBASE_CONFIG.appId;

// Verificar se está usando variáveis de ambiente ou fallback
const usingEnvVars = !!import.meta.env.VITE_FIREBASE_API_KEY;
if (!usingEnvVars) {
  console.warn('⚠️ Usando credenciais hardcoded. Configure o .env.local para produção.');
}

// Firebase config final
const firebaseConfig = {
  apiKey,
  authDomain,
  projectId,
  storageBucket,
  messagingSenderId,
  appId
};

// Log de debug em desenvolvimento
if (import.meta.env.DEV) {
  console.log('🔍 Firebase Config:', {
    apiKey: apiKey?.substring(0, 15) + '...',
    authDomain,
    projectId,
    usingEnvVars
  });
}

// Initialize Firebase (usar app existente se já estiver inicializado)
let app: FirebaseApp;
try {
  const existingApps = getApps();
  if (existingApps.length > 0) {
    app = existingApps[0];
    console.log('✅ Usando instância existente do Firebase');
  } else {
    app = initializeApp(firebaseConfig);
    console.log('✅ Firebase inicializado com sucesso!');
  }
} catch (error: any) {
  console.error('❌ Erro ao inicializar Firebase:', error);
  // Tentar novamente sem usar app existente
  try {
    app = initializeApp(firebaseConfig, 'barber-app');
    console.log('✅ Firebase inicializado com ID customizado');
  } catch (retryError) {
    console.error('❌ Erro crítico ao inicializar Firebase:', retryError);
    throw new Error(`Falha ao inicializar Firebase: ${retryError}`);
  }
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

