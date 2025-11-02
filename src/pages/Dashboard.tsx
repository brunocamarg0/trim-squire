import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calendar, Users, DollarSign, TrendingUp, Clock, Settings, LogOut, Plus } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { dashboardService } from "@/services/dashboardService";
import { DashboardStats } from "@/types";
import { useNavigate } from "react-router-dom";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { useToast } from "@/hooks/use-toast";

const Dashboard = () => {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadStats = async () => {
      if (user && user.barbershopId) {
        try {
          const dashboardStats = await dashboardService.getDashboardStats(user.barbershopId);
          setStats(dashboardStats);
        } catch (error) {
          console.error('Erro ao carregar estatísticas:', error);
        } finally {
          setLoading(false);
        }
      } else {
        setLoading(false);
      }
    };

    loadStats();
  }, [user]);

  const handleLogout = async () => {
    await signOut();
    navigate("/");
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-dark flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Carregando dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold uppercase">Dashboard</h1>
        <p className="text-muted-foreground mt-2">Bem-vindo de volta, {user?.name}!</p>
      </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="p-6 border-2 border-border hover:border-foreground transition-all">
            <div className="flex items-center gap-4">
              <div className="p-3 border-2 border-foreground bg-background">
                <Calendar className="h-6 w-6" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Agendamentos Hoje</p>
                <p className="text-2xl font-bold">{stats?.todayAppointments || 0}</p>
              </div>
            </div>
          </Card>

          <Card className="p-6 border-2 border-border hover:border-foreground transition-all">
            <div className="flex items-center gap-4">
              <div className="p-3 border-2 border-foreground bg-background">
                <Users className="h-6 w-6" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Clientes Ativos</p>
                <p className="text-2xl font-bold">{stats?.activeClients || 0}</p>
              </div>
            </div>
          </Card>

          <Card className="p-6 border-2 border-border hover:border-foreground transition-all">
            <div className="flex items-center gap-4">
              <div className="p-3 border-2 border-foreground bg-background">
                <DollarSign className="h-6 w-6" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Receita Hoje</p>
                <p className="text-2xl font-bold">R$ {stats?.todayRevenue?.toFixed(2) || '0,00'}</p>
              </div>
            </div>
          </Card>

          <Card className="p-6 border-2 border-border hover:border-foreground transition-all">
            <div className="flex items-center gap-4">
              <div className="p-3 border-2 border-foreground bg-background">
                <TrendingUp className="h-6 w-6" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Receita Mensal</p>
                <p className="text-2xl font-bold">R$ {stats?.monthlyRevenue?.toFixed(2) || '0,00'}</p>
              </div>
            </div>
          </Card>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Próximos Agendamentos */}
          <Card className="lg:col-span-2 border-2 border-border">
            <div className="p-6">
              <h2 className="text-xl font-bold mb-4 flex items-center gap-2 uppercase">
                <Clock className="h-5 w-5" />
                Próximos Agendamentos
              </h2>
              <div className="space-y-4">
                {stats?.upcomingAppointments && stats.upcomingAppointments.length > 0 ? (
                  stats.upcomingAppointments.map((apt) => (
                    <div key={apt.id} className="flex items-center justify-between p-4 border-2 border-border hover:border-foreground transition-all">
                      <div className="flex items-center gap-4">
                        <div className="h-12 w-12 border-2 border-foreground bg-background flex items-center justify-center font-bold">
                          {format(new Date(apt.date), 'dd', { locale: ptBR })}
                        </div>
                        <div>
                          <p className="font-bold">{apt.clientId}</p>
                          <p className="text-sm text-muted-foreground">
                            {format(new Date(apt.date), "EEEE, dd 'de' MMMM", { locale: ptBR })}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-bold">{apt.startTime}</p>
                        <p className="text-sm text-muted-foreground">R$ {apt.totalPrice.toFixed(2)}</p>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-12">
                    <p className="text-muted-foreground">Nenhum agendamento próximo</p>
                  </div>
                )}
              </div>
            </div>
          </Card>

          {/* Quick Actions */}
          <Card className="border-2 border-border">
            <div className="p-6">
              <h2 className="text-xl font-bold mb-4 uppercase">Ações Rápidas</h2>
              <div className="space-y-3">
                <Button 
                  className="w-full justify-start border-2 border-border" 
                  variant="outline"
                  onClick={() => navigate("/appointments?action=new")}
                >
                  <Plus className="mr-2 h-4 w-4" />
                  Novo Agendamento
                </Button>
                <Button 
                  className="w-full justify-start border-2 border-border" 
                  variant="outline"
                  onClick={() => navigate("/clients?action=new")}
                >
                  <Users className="mr-2 h-4 w-4" />
                  Adicionar Cliente
                </Button>
                <Button 
                  className="w-full justify-start border-2 border-border" 
                  variant="outline"
                  onClick={() => navigate("/financial?action=new")}
                >
                  <DollarSign className="mr-2 h-4 w-4" />
                  Registrar Venda
                </Button>
                <Button 
                  className="w-full justify-start border-2 border-border" 
                  variant="outline"
                  onClick={() => navigate("/reports")}
                >
                  <TrendingUp className="mr-2 h-4 w-4" />
                  Ver Relatórios
                </Button>
              </div>
            </div>
          </Card>
        </div>
    </div>
  );
};

export default Dashboard;
