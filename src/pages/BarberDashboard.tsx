import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calendar, Clock, DollarSign, User } from "lucide-react";

const BarberDashboard = () => {
  return (
    <div className="min-h-screen bg-gradient-dark">
      <div className="container mx-auto p-6">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold">Painel do Barbeiro</h1>
          <p className="text-muted-foreground">Olá, João! Aqui está sua agenda de hoje.</p>
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
                <p className="text-2xl font-bold">8</p>
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
                <p className="text-2xl font-bold">R$ 320</p>
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
                <p className="text-2xl font-bold">14:30</p>
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
            {[
              { time: "09:00", client: "Carlos Silva", service: "Corte + Barba", status: "confirmed" },
              { time: "10:00", client: "João Santos", service: "Corte Social", status: "confirmed" },
              { time: "11:00", client: "Pedro Oliveira", service: "Barba", status: "confirmed" },
              { time: "14:00", client: "Lucas Costa", service: "Corte + Barba", status: "pending" },
              { time: "15:00", client: "Rafael Lima", service: "Corte Degradê", status: "pending" },
            ].map((appointment, i) => (
              <div key={i} className="flex items-center justify-between p-4 rounded-lg bg-secondary/50 border border-border">
                <div className="flex items-center gap-4">
                  <div className="h-12 w-12 rounded-full bg-primary/20 flex items-center justify-center">
                    <User className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <p className="font-semibold">{appointment.client}</p>
                    <p className="text-sm text-muted-foreground">{appointment.service}</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="text-right">
                    <p className="font-semibold">{appointment.time}</p>
                    <p className={`text-sm ${appointment.status === 'confirmed' ? 'text-primary' : 'text-muted-foreground'}`}>
                      {appointment.status === 'confirmed' ? 'Confirmado' : 'Pendente'}
                    </p>
                  </div>
                  <Button size="sm" variant={appointment.status === 'confirmed' ? 'outline' : 'default'}>
                    {appointment.status === 'confirmed' ? 'Concluir' : 'Confirmar'}
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
};

export default BarberDashboard;
