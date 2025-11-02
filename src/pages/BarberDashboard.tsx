import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calendar, Clock, DollarSign, User } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { appointmentService } from "@/services/appointmentService";
import { useToast } from "@/hooks/use-toast";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

const BarberDashboard = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [appointments, setAppointments] = useState<any[]>([]);
  const [stats, setStats] = useState({
    todayAppointments: 0,
    todayComission: 0,
    nextClient: null as string | null,
  });

  useEffect(() => {
    loadBarberData();
  }, [user]);

  const loadBarberData = async () => {
    if (!user?.barbershopId) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      
      const appointmentsList = await appointmentService.getTodayAppointments(user.barbershopId);
      const myAppointments = appointmentsList.filter(apt => apt.barberId === user.id);
      
      setAppointments(myAppointments);

      // Calcular estatísticas
      const confirmedAppointments = myAppointments.filter(apt => 
        apt.status === 'confirmed' || apt.status === 'scheduled'
      );

      setStats({
        todayAppointments: confirmedAppointments.length,
        todayComission: 0, // TODO: Calcular comissão
        nextClient: myAppointments.length > 0 ? myAppointments[0].startTime : null,
      });
    } catch (error) {
      console.error("Erro ao carregar dados:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleAppointmentAction = async (appointment: any, action: "confirm" | "complete") => {
    if (!user?.barbershopId) return;

    try {
      if (action === "confirm") {
        await appointmentService.updateAppointment(user.barbershopId, appointment.id, {
          status: "confirmed",
        } as any);
      } else if (action === "complete") {
        await appointmentService.completeAppointment(user.barbershopId, appointment.id);
      }
      
      toast({
        title: "Sucesso",
        description: action === "confirm" ? "Agendamento confirmado!" : "Agendamento concluído!",
      });
      
      loadBarberData();
    } catch (error) {
      toast({
        title: "Erro",
        description: "Não foi possível realizar a ação",
        variant: "destructive",
      });
    }
  };
  return (
    <div className="min-h-screen bg-gradient-dark">
      <div className="container mx-auto p-6">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold">Painel do Barbeiro</h1>
          <p className="text-muted-foreground">Olá, {user?.name || "Barbeiro"}! Aqui está sua agenda de hoje.</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card className="p-6 bg-card border-primary/50 shadow-card">
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-lg bg-primary/10">
                <Calendar className="h-6 w-6 text-primary" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Atendimentos Hoje</p>
                <p className="text-2xl font-bold">{stats.todayAppointments}</p>
              </div>
            </div>
          </Card>

          <Card className="p-6 bg-card border-primary/50 shadow-card">
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-lg bg-primary/10">
                <DollarSign className="h-6 w-6 text-primary" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Comissão Hoje</p>
                <p className="text-2xl font-bold">R$ {stats.todayComission.toFixed(2)}</p>
              </div>
            </div>
          </Card>

          <Card className="p-6 bg-card border-primary/50 shadow-card">
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-lg bg-primary/10">
                <Clock className="h-6 w-6 text-primary" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Próximo Cliente</p>
                <p className="text-2xl font-bold">{stats.nextClient || '-'}</p>
              </div>
            </div>
          </Card>
        </div>

        {/* Agenda */}
        <Card className="p-6 bg-card">
          <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
            <Calendar className="h-5 w-5 text-primary" />
            Minha Agenda
          </h2>
          <div className="space-y-4">
            {loading ? (
              <div className="text-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
                <p className="text-muted-foreground">Carregando agenda...</p>
              </div>
            ) : appointments.length > 0 ? (
              appointments.map((appointment) => (
                <div key={appointment.id} className="flex items-center justify-between p-4 rounded-lg bg-secondary/50 border border-border">
                  <div className="flex items-center gap-4">
                    <div className="h-12 w-12 rounded-full bg-primary/20 flex items-center justify-center">
                      <User className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <p className="font-semibold">{appointment.clientId}</p>
                      <p className="text-sm text-muted-foreground">
                        {format(new Date(appointment.date), "dd/MM/yyyy", { locale: ptBR })} - {appointment.serviceIds.join(", ")}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="text-right">
                      <p className="font-semibold">{appointment.startTime}</p>
                      <p className={`text-sm ${appointment.status === 'confirmed' || appointment.status === 'scheduled' ? 'text-primary' : 'text-muted-foreground'}`}>
                        {appointment.status === 'confirmed' ? 'Confirmado' : 
                         appointment.status === 'scheduled' ? 'Agendado' :
                         appointment.status === 'completed' ? 'Concluído' : appointment.status}
                      </p>
                    </div>
                    {appointment.status !== 'completed' && (
                      <Button 
                        size="sm" 
                        variant={appointment.status === 'confirmed' || appointment.status === 'scheduled' ? 'outline' : 'default'}
                        onClick={() => handleAppointmentAction(appointment, appointment.status === 'confirmed' || appointment.status === 'scheduled' ? 'complete' : 'confirm')}
                      >
                        {appointment.status === 'confirmed' || appointment.status === 'scheduled' ? 'Concluir' : 'Confirmar'}
                      </Button>
                    )}
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-12">
                <p className="text-muted-foreground">Nenhum agendamento para hoje</p>
              </div>
            )}
          </div>
        </Card>
      </div>
    </div>
  );
};

export default BarberDashboard;
