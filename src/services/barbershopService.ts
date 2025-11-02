import { collection, doc, getDoc, getDocs, addDoc, updateDoc, deleteDoc, query, where, orderBy } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { Barbershop, Service, Barber, Client } from '@/types';

export const barbershopService = {
  // Buscar barbearia por ID
  async getBarbershop(barbershopId: string): Promise<Barbershop | null> {
    try {
      const docRef = doc(db, 'barbershops', barbershopId);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        return { id: docSnap.id, ...docSnap.data() } as Barbershop;
      }
      return null;
    } catch (error) {
      console.error('Erro ao buscar barbearia:', error);
      return null;
    }
  },

  // Atualizar barbearia
  async updateBarbershop(barbershopId: string, data: Partial<Barbershop>) {
    try {
      const docRef = doc(db, 'barbershops', barbershopId);
      await updateDoc(docRef, {
        ...data,
        updatedAt: new Date()
      });
      return { success: true };
    } catch (error) {
      console.error('Erro ao atualizar barbearia:', error);
      return { success: false, error };
    }
  },

  // ============ SERVIÇOS ============
  // Criar serviço
  async createService(barbershopId: string, service: Omit<Service, 'id' | 'barbershopId' | 'createdAt' | 'updatedAt'>) {
    try {
      const docRef = await addDoc(collection(db, 'barbershops', barbershopId, 'services'), {
        ...service,
        barbershopId,
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date()
      });
      return { success: true, serviceId: docRef.id };
    } catch (error) {
      console.error('Erro ao criar serviço:', error);
      return { success: false, error };
    }
  },

  // Buscar serviços
  async getServices(barbershopId: string): Promise<Service[]> {
    try {
      const q = query(
        collection(db, 'barbershops', barbershopId, 'services'),
        where('isActive', '==', true),
        orderBy('name')
      );
      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Service));
    } catch (error) {
      console.error('Erro ao buscar serviços:', error);
      return [];
    }
  },

  // Atualizar serviço
  async updateService(barbershopId: string, serviceId: string, data: Partial<Service>) {
    try {
      const docRef = doc(db, 'barbershops', barbershopId, 'services', serviceId);
      await updateDoc(docRef, {
        ...data,
        updatedAt: new Date()
      });
      return { success: true };
    } catch (error) {
      console.error('Erro ao atualizar serviço:', error);
      return { success: false, error };
    }
  },

  // ============ BARBEIROS ============
  // Criar barbeiro
  async createBarber(barbershopId: string, barber: Omit<Barber, 'id' | 'barbershopId' | 'createdAt' | 'updatedAt'>) {
    try {
      const docRef = await addDoc(collection(db, 'barbershops', barbershopId, 'barbers'), {
        ...barber,
        barbershopId,
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date()
      });
      return { success: true, barberId: docRef.id };
    } catch (error) {
      console.error('Erro ao criar barbeiro:', error);
      return { success: false, error };
    }
  },

  // Buscar barbeiros
  async getBarbers(barbershopId: string): Promise<Barber[]> {
    try {
      const q = query(
        collection(db, 'barbershops', barbershopId, 'barbers'),
        where('isActive', '==', true),
        orderBy('name')
      );
      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Barber));
    } catch (error) {
      console.error('Erro ao buscar barbeiros:', error);
      return [];
    }
  },

  // Atualizar barbeiro
  async updateBarber(barbershopId: string, barberId: string, data: Partial<Barber>) {
    try {
      const docRef = doc(db, 'barbershops', barbershopId, 'barbers', barberId);
      await updateDoc(docRef, {
        ...data,
        updatedAt: new Date()
      });
      return { success: true };
    } catch (error) {
      console.error('Erro ao atualizar barbeiro:', error);
      return { success: false, error };
    }
  },

  // ============ CLIENTES ============
  // Criar cliente
  async createClient(barbershopId: string, client: Omit<Client, 'id' | 'barbershopId' | 'totalVisits' | 'totalSpent' | 'createdAt' | 'updatedAt'>) {
    try {
      const docRef = await addDoc(collection(db, 'barbershops', barbershopId, 'clients'), {
        ...client,
        barbershopId,
        totalVisits: 0,
        totalSpent: 0,
        createdAt: new Date(),
        updatedAt: new Date()
      });
      return { success: true, clientId: docRef.id };
    } catch (error) {
      console.error('Erro ao criar cliente:', error);
      return { success: false, error };
    }
  },

  // Buscar clientes
  async getClients(barbershopId: string): Promise<Client[]> {
    try {
      const q = query(
        collection(db, 'barbershops', barbershopId, 'clients'),
        orderBy('name')
      );
      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Client));
    } catch (error) {
      console.error('Erro ao buscar clientes:', error);
      return [];
    }
  },

  // Atualizar cliente
  async updateClient(barbershopId: string, clientId: string, data: Partial<Client>) {
    try {
      const docRef = doc(db, 'barbershops', barbershopId, 'clients', clientId);
      await updateDoc(docRef, {
        ...data,
        updatedAt: new Date()
      });
      return { success: true };
    } catch (error) {
      console.error('Erro ao atualizar cliente:', error);
      return { success: false, error };
    }
  }
};

