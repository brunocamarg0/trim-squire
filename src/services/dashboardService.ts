import { appointmentService } from './appointmentService';
import { financialService } from './financialService';
import { barbershopService } from './barbershopService';
import { DashboardStats } from '@/types';

export const dashboardService = {
  // Buscar estatísticas do dashboard
  async getDashboardStats(barbershopId: string): Promise<DashboardStats> {
    try {
      const today = new Date();
      const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);

      // Agendamentos de hoje
      const todayAppointments = await appointmentService.getTodayAppointments(barbershopId);

      // Receita de hoje
      const todayStats = await financialService.getFinancialStats(
        barbershopId,
        new Date(today.getFullYear(), today.getMonth(), today.getDate())
      );

      // Estatísticas do mês
      const monthStats = await financialService.getFinancialStats(barbershopId, startOfMonth);

      // Todos os agendamentos
      const allAppointments = await appointmentService.getAppointments(barbershopId, {
        startDate: startOfMonth
      });

      // Barbeiros
      const barbers = await barbershopService.getBarbers(barbershopId);

      // Clientes
      const clients = await barbershopService.getClients(barbershopId);

      // Transações recentes
      const recentTransactions = await financialService.getTransactions(barbershopId);
      const recentTransactionsLimited = recentTransactions.slice(0, 5);

      // Próximos agendamentos
      const upcomingAppointments = allAppointments
        .filter(apt => apt.status === 'scheduled' || apt.status === 'confirmed')
        .sort((a, b) => {
          const dateA = new Date(a.date);
          const dateB = new Date(b.date);
          if (dateA.getTime() !== dateB.getTime()) {
            return dateA.getTime() - dateB.getTime();
          }
          return a.startTime.localeCompare(b.startTime);
        })
        .slice(0, 10);

      return {
        todayAppointments: todayAppointments.length,
        todayRevenue: todayStats.totalRevenue,
        monthlyAppointments: allAppointments.length,
        monthlyRevenue: monthStats.totalRevenue,
        activeBarbers: barbers.length,
        activeClients: clients.length,
        upcomingAppointments,
        recentTransactions: recentTransactionsLimited
      };
    } catch (error) {
      console.error('Erro ao buscar estatísticas:', error);
      return {
        todayAppointments: 0,
        todayRevenue: 0,
        monthlyAppointments: 0,
        monthlyRevenue: 0,
        activeBarbers: 0,
        activeClients: 0,
        upcomingAppointments: [],
        recentTransactions: []
      };
    }
  }
};

