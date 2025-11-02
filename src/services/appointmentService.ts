import { collection, doc, getDoc, getDocs, addDoc, updateDoc, query, where, orderBy, Timestamp } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { Appointment } from '@/types';

export const appointmentService = {
  // Criar agendamento
  async createAppointment(appointment: Omit<Appointment, 'id' | 'createdAt' | 'updatedAt'>) {
    try {
      const docRef = await addDoc(collection(db, 'barbershops', appointment.barbershopId, 'appointments'), {
        ...appointment,
        date: Timestamp.fromDate(appointment.date),
        createdAt: new Date(),
        updatedAt: new Date()
      });
      return { success: true, appointmentId: docRef.id };
    } catch (error) {
      console.error('Erro ao criar agendamento:', error);
      return { success: false, error };
    }
  },

  // Buscar agendamentos
  async getAppointments(barbershopId: string, filters?: {
    barberId?: string;
    status?: Appointment['status'];
    startDate?: Date;
    endDate?: Date;
  }): Promise<Appointment[]> {
    try {
      let q = query(
        collection(db, 'barbershops', barbershopId, 'appointments'),
        orderBy('date'),
        orderBy('startTime')
      );

      if (filters?.barberId) {
        q = query(q, where('barberId', '==', filters.barberId));
      }

      if (filters?.status) {
        q = query(q, where('status', '==', filters.status));
      }

      const querySnapshot = await getDocs(q);
      let appointments = querySnapshot.docs.map(doc => {
        const data = doc.data();
        return { 
          id: doc.id, 
          ...data,
          date: data.date instanceof Timestamp ? data.date.toDate() : data.date
        } as Appointment;
      });

      // Filtrar por data se especificado
      if (filters?.startDate) {
        appointments = appointments.filter(apt => apt.date >= filters.startDate!);
      }
      if (filters?.endDate) {
        appointments = appointments.filter(apt => apt.date <= filters.endDate!);
      }

      return appointments;
    } catch (error) {
      console.error('Erro ao buscar agendamentos:', error);
      return [];
    }
  },

  // Buscar agendamentos de hoje
  async getTodayAppointments(barbershopId: string): Promise<Appointment[]> {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    return this.getAppointments(barbershopId, {
      startDate: today,
      endDate: tomorrow
    });
  },

  // Buscar agendamentos por barbeiro
  async getBarberAppointments(barbershopId: string, barberId: string): Promise<Appointment[]> {
    return this.getAppointments(barbershopId, { barberId });
  },

  // Atualizar agendamento
  async updateAppointment(barbershopId: string, appointmentId: string, data: Partial<Appointment>) {
    try {
      const docRef = doc(db, 'barbershops', barbershopId, 'appointments', appointmentId);
      const updateData: any = {
        ...data,
        updatedAt: new Date()
      };

      if (data.date) {
        updateData.date = Timestamp.fromDate(data.date);
      }

      await updateDoc(docRef, updateData);
      return { success: true };
    } catch (error) {
      console.error('Erro ao atualizar agendamento:', error);
      return { success: false, error };
    }
  },

  // Cancelar agendamento
  async cancelAppointment(barbershopId: string, appointmentId: string, notes?: string) {
    try {
      const docRef = doc(db, 'barbershops', barbershopId, 'appointments', appointmentId);
      await updateDoc(docRef, {
        status: 'cancelled',
        notes: notes,
        updatedAt: new Date()
      });
      return { success: true };
    } catch (error) {
      console.error('Erro ao cancelar agendamento:', error);
      return { success: false, error };
    }
  },

  // Concluir agendamento
  async completeAppointment(barbershopId: string, appointmentId: string) {
    try {
      const docRef = doc(db, 'barbershops', barbershopId, 'appointments', appointmentId);
      await updateDoc(docRef, {
        status: 'completed',
        updatedAt: new Date()
      });
      return { success: true };
    } catch (error) {
      console.error('Erro ao concluir agendamento:', error);
      return { success: false, error };
    }
  }
};

