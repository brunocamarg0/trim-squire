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
if (!apiKey || apiKey === 'your-api-key-here' || apiKey.includes('your-')) {
  console.error('❌ ERRO: Firebase não está configurado!');
  console.error('📝 Por favor, crie um arquivo .env.local na raiz do projeto com suas credenciais do Firebase.');
  console.error('📖 Veja o arquivo CONFIGURAR_FIREBASE.md para instruções detalhadas.');
  throw new Error('Firebase não configurado. Crie o arquivo .env.local com suas credenciais. Veja CONFIGURAR_FIREBASE.md');
}

const firebaseConfig = {
  apiKey,
  authDomain,
  projectId,
  storageBucket,
  messagingSenderId,
  appId
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase services
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);

export default app;

