import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calendar, MessageSquare, Clock, Scissors, LogOut } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { appointmentService } from "@/services/appointmentService";
import { messageService } from "@/services/messageService";
import { Appointment, Chat } from "@/types";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

const ClientDashboard = () => {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [chats, setChats] = useState<Chat[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      if (user && user.barbershopId) {
        try {
          const allAppointments = await appointmentService.getAppointments(user.barbershopId);
          const clientAppointments = allAppointments
            .filter(apt => apt.clientId === user.id)
            .filter(apt => apt.status !== 'cancelled' && apt.status !== 'completed')
            .sort((a, b) => {
              const dateA = new Date(`${a.date}T${a.startTime}`);
              const dateB = new Date(`${b.date}T${b.startTime}`);
              return dateA.getTime() - dateB.getTime();
            });
          
          setAppointments(clientAppointments);

          const clientChats = await messageService.getClientChats(user.id);
          setChats(clientChats);
        } catch (error) {
          console.error('Erro ao carregar dados:', error);
        } finally {
          setLoading(false);
        }
      } else {
        setLoading(false);
      }
    };

    loadData();
  }, [user]);

  const handleLogout = async () => {
    await signOut();
    navigate("/");
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-dark flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-foreground mx-auto mb-4"></div>
          <p className="text-muted-foreground">Carregando...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-dark">
      <div className="container mx-auto p-6">
        <div className="mb-8 flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold mb-2">Olá, {user?.name || "Cliente"}!</h1>
            <p className="text-muted-foreground">Bem-vindo ao seu painel</p>
          </div>
          <Button onClick={handleLogout} variant="outline" size="sm">
            <LogOut className="mr-2 h-4 w-4" />
            Sair
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <Card className="p-6 border-2 border-border hover:border-foreground transition-all cursor-pointer" onClick={() => navigate("/client/chat")}>
            <div className="flex items-center gap-4">
              <div className="p-3 border-2 border-foreground bg-background">
                <MessageSquare className="h-6 w-6" />
              </div>
              <div>
                <h3 className="text-lg font-bold mb-1">Conversar com a Barbearia</h3>
                <p className="text-sm text-muted-foreground">Agende serviços pelo chat</p>
              </div>
            </div>
          </Card>

          <Card className="p-6 border-2 border-border hover:border-foreground transition-all">
            <div className="flex items-center gap-4">
              <div className="p-3 border-2 border-foreground bg-background">
                <Calendar className="h-6 w-6" />
              </div>
              <div>
                <h3 className="text-lg font-bold mb-1">Meus Agendamentos</h3>
                <p className="text-sm text-muted-foreground">{appointments.length} agendamento(s) próximo(s)</p>
              </div>
            </div>
          </Card>
        </div>

        <Card className="mb-8 border-2 border-border">
          <div className="p-6">
            <h2 className="text-xl font-bold mb-4 flex items-center gap-2 uppercase">
              <Clock className="h-5 w-5" />
              Próximos Agendamentos
            </h2>
            {appointments.length > 0 ? (
              <div className="space-y-4">
                {appointments.map((apt) => (
                  <div key={apt.id} className="flex items-center justify-between p-4 border-2 border-border hover:border-foreground transition-all">
                    <div className="flex items-center gap-4">
                      <div className="p-3 border-2 border-foreground bg-background">
                        <Scissors className="h-5 w-5" />
                      </div>
                      <div>
                        <p className="font-bold">{format(new Date(apt.date), "dd 'de' MMMM 'de' yyyy", { locale: ptBR })}</p>
                        <p className="text-sm text-muted-foreground">
                          {apt.startTime} - {apt.endTime}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          Status: <span className="capitalize">{apt.status}</span>
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-bold">R$ {apt.totalPrice.toFixed(2)}</p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <p className="text-muted-foreground mb-4">Você não tem agendamentos futuros.</p>
                <Button onClick={() => navigate("/client/chat")} variant="default">
                  <MessageSquare className="mr-2 h-4 w-4" />
                  Agendar Agora
                </Button>
              </div>
            )}
          </div>
        </Card>
      </div>
    </div>
  );
};

export default ClientDashboard;

