import { 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword, 
  signOut, 
  updateProfile,
  User as FirebaseUser,
  onAuthStateChanged,
  sendPasswordResetEmail
} from 'firebase/auth';
import { doc, setDoc, getDoc, updateDoc, collection, query, where, getDocs } from 'firebase/firestore';
import { auth, db } from '@/lib/firebase';
import { User } from '@/types';

export const authService = {
  // Registrar novo usuário
  async signUp(email: string, password: string, name: string, barbershopName: string) {
    try {
      if (!auth) {
        throw new Error('Firebase Auth não está inicializado. Verifique a configuração do Firebase.');
      }
      
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // Atualizar o displayName
      await updateProfile(user, { displayName: name });

      // Criar perfil do usuário no Firestore
      const userData: Omit<User, 'id'> = {
        email,
        name,
        role: 'owner',
        createdAt: new Date(),
        updatedAt: new Date()
      };

      await setDoc(doc(db, 'users', user.uid), userData);

      // Criar barbearia associada
      const barbershopRef = doc(db, 'barbershops', user.uid);
      await setDoc(barbershopRef, {
        name: barbershopName,
        ownerId: user.uid,
        settings: {
          bookingAdvanceDays: 30,
          bookingDuration: 30,
          allowOnlineBooking: true,
          sendEmailNotifications: true,
          sendSMSNotifications: false
        },
        createdAt: new Date(),
        updatedAt: new Date()
      });

      // Atualizar user com barbershopId
      await updateDoc(doc(db, 'users', user.uid), {
        barbershopId: user.uid
      });

      return { success: true, userId: user.uid };
    } catch (error: any) {
      console.error('Erro ao registrar:', error);
      return { success: false, error: error.message };
    }
  },

  // Fazer login
  async signIn(email: string, password: string) {
    try {
      if (!auth) {
        throw new Error('Firebase Auth não está inicializado. Verifique a configuração do Firebase.');
      }
      
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // Buscar dados do usuário no Firestore
      const userDoc = await getDoc(doc(db, 'users', user.uid));
      if (userDoc.exists()) {
        return { 
          success: true, 
          user: { id: user.uid, ...userDoc.data() } as User 
        };
      }

      return { success: true, userId: user.uid };
    } catch (error: any) {
      console.error('Erro ao fazer login:', error);
      return { success: false, error: error.message };
    }
  },

  // Fazer logout
  async signOut() {
    try {
      await signOut(auth);
      return { success: true };
    } catch (error: any) {
      console.error('Erro ao fazer logout:', error);
      return { success: false, error: error.message };
    }
  },

  // Recuperar senha
  async resetPassword(email: string) {
    try {
      await sendPasswordResetEmail(auth, email);
      return { success: true };
    } catch (error: any) {
      console.error('Erro ao recuperar senha:', error);
      return { success: false, error: error.message };
    }
  },

  // Observer para mudanças de autenticação
  onAuthStateChanged(callback: (user: FirebaseUser | null) => void) {
    return onAuthStateChanged(auth, callback);
  },

  // Registrar novo cliente
  async signUpClient(email: string, password: string, name: string, barbershopId: string) {
    try {
      if (!auth) {
        throw new Error('Firebase Auth não está inicializado. Verifique a configuração do Firebase.');
      }
      
      // Verificar se a barbearia existe
      const barbershopDoc = await getDoc(doc(db, 'barbershops', barbershopId));
      if (!barbershopDoc.exists()) {
        return { success: false, error: 'Barbearia não encontrada. Verifique o ID da barbearia.' };
      }
      
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // Atualizar o displayName
      await updateProfile(user, { displayName: name });

      // Criar perfil do cliente no Firestore
      const userData: Omit<User, 'id'> = {
        email,
        name,
        role: 'client',
        barbershopId,
        createdAt: new Date(),
        updatedAt: new Date()
      };

      await setDoc(doc(db, 'users', user.uid), userData);

      return { success: true, userId: user.uid };
    } catch (error: any) {
      console.error('Erro ao registrar cliente:', error);
      return { success: false, error: error.message };
    }
  },

  // Buscar barbearia por nome (para facilitar cadastro de cliente)
  async findBarbershopByName(name: string) {
    try {
      const barbershopsRef = collection(db, 'barbershops');
      const q = query(barbershopsRef, where('name', '==', name));
      const querySnapshot = await getDocs(q);
      
      if (!querySnapshot.empty) {
        const doc = querySnapshot.docs[0];
        return { id: doc.id, ...doc.data() };
      }
      return null;
    } catch (error) {
      console.error('Erro ao buscar barbearia:', error);
      return null;
    }
  },

  // Buscar dados do usuário atual
  async getCurrentUser(userId: string): Promise<User | null> {
    try {
      const userDoc = await getDoc(doc(db, 'users', userId));
      if (userDoc.exists()) {
        return { id: userDoc.id, ...userDoc.data() } as User;
      }
      return null;
    } catch (error) {
      console.error('Erro ao buscar usuário:', error);
      return null;
    }
  }
};

