import { collection, doc, getDocs, addDoc, updateDoc, query, where, orderBy, Timestamp } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { Transaction } from '@/types';

export const financialService = {
  // Criar transação
  async createTransaction(transaction: Omit<Transaction, 'id' | 'createdAt'>) {
    try {
      const docRef = await addDoc(collection(db, 'barbershops', transaction.barbershopId, 'transactions'), {
        ...transaction,
        date: Timestamp.fromDate(transaction.date),
        createdAt: new Date()
      });
      return { success: true, transactionId: docRef.id };
    } catch (error) {
      console.error('Erro ao criar transação:', error);
      return { success: false, error };
    }
  },

  // Buscar transações
  async getTransactions(barbershopId: string, filters?: {
    type?: 'revenue' | 'expense';
    startDate?: Date;
    endDate?: Date;
  }): Promise<Transaction[]> {
    try {
      let q = query(
        collection(db, 'barbershops', barbershopId, 'transactions'),
        orderBy('date', 'desc')
      );

      if (filters?.type) {
        q = query(q, where('type', '==', filters.type));
      }

      const querySnapshot = await getDocs(q);
      let transactions = querySnapshot.docs.map(doc => {
        const data = doc.data();
        return {
          id: doc.id,
          ...data,
          date: data.date instanceof Timestamp ? data.date.toDate() : data.date
        } as Transaction;
      });

      // Filtrar por data se especificado
      if (filters?.startDate) {
        transactions = transactions.filter(t => t.date >= filters.startDate!);
      }
      if (filters?.endDate) {
        transactions = transactions.filter(t => t.date <= filters.endDate!);
      }

      return transactions;
    } catch (error) {
      console.error('Erro ao buscar transações:', error);
      return [];
    }
  },

  // Calcular estatísticas financeiras
  async getFinancialStats(barbershopId: string, startDate?: Date, endDate?: Date) {
    try {
      const transactions = await this.getTransactions(barbershopId, { startDate, endDate });

      const revenue = transactions
        .filter(t => t.type === 'revenue')
        .reduce((sum, t) => sum + t.amount, 0);

      const expenses = transactions
        .filter(t => t.type === 'expense')
        .reduce((sum, t) => sum + t.amount, 0);

      const profit = revenue - expenses;

      return {
        totalRevenue: revenue,
        totalExpenses: expenses,
        profit,
        transactionCount: transactions.length
      };
    } catch (error) {
      console.error('Erro ao calcular estatísticas:', error);
      return {
        totalRevenue: 0,
        totalExpenses: 0,
        profit: 0,
        transactionCount: 0
      };
    }
  }
};

