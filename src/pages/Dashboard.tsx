import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calendar, Users, DollarSign, TrendingUp, Clock, Settings } from "lucide-react";

const Dashboard = () => {
  return (
    <div className="min-h-screen bg-gradient-dark">
      <div className="container mx-auto p-6">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold">Dashboard</h1>
            <p className="text-muted-foreground">Bem-vindo de volta!</p>
          </div>
          <Button variant="ghost" size="icon">
            <Settings className="h-5 w-5" />
          </Button>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="p-6 bg-card border-primary/50 shadow-card">
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-lg bg-primary/10">
                <Calendar className="h-6 w-6 text-primary" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Agendamentos Hoje</p>
                <p className="text-2xl font-bold">24</p>
              </div>
            </div>
          </Card>

          <Card className="p-6 bg-card border-primary/50 shadow-card">
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-lg bg-primary/10">
                <Users className="h-6 w-6 text-primary" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Clientes Ativos</p>
                <p className="text-2xl font-bold">156</p>
              </div>
            </div>
          </Card>

          <Card className="p-6 bg-card border-primary/50 shadow-card">
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-lg bg-primary/10">
                <DollarSign className="h-6 w-6 text-primary" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Receita Hoje</p>
                <p className="text-2xl font-bold">R$ 1.280</p>
              </div>
            </div>
          </Card>

          <Card className="p-6 bg-card border-primary/50 shadow-card">
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-lg bg-primary/10">
                <TrendingUp className="h-6 w-6 text-primary" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Crescimento</p>
                <p className="text-2xl font-bold">+12%</p>
              </div>
            </div>
          </Card>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Próximos Agendamentos */}
          <Card className="lg:col-span-2 p-6 bg-card">
            <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
              <Clock className="h-5 w-5 text-primary" />
              Próximos Agendamentos
            </h2>
            <div className="space-y-4">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="flex items-center justify-between p-4 rounded-lg bg-secondary/50 border border-border hover:border-primary transition-colors">
                  <div className="flex items-center gap-4">
                    <div className="h-12 w-12 rounded-full bg-primary/20 flex items-center justify-center">
                      <Users className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <p className="font-semibold">Cliente {i}</p>
                      <p className="text-sm text-muted-foreground">Corte + Barba</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold">14:{i * 15}</p>
                    <p className="text-sm text-muted-foreground">Barbeiro João</p>
                  </div>
                </div>
              ))}
            </div>
          </Card>

          {/* Quick Actions */}
          <Card className="p-6 bg-card">
            <h2 className="text-xl font-semibold mb-4">Ações Rápidas</h2>
            <div className="space-y-3">
              <Button className="w-full justify-start" variant="premium">
                <Calendar className="mr-2 h-4 w-4" />
                Novo Agendamento
              </Button>
              <Button className="w-full justify-start" variant="premium">
                <Users className="mr-2 h-4 w-4" />
                Adicionar Cliente
              </Button>
              <Button className="w-full justify-start" variant="premium">
                <DollarSign className="mr-2 h-4 w-4" />
                Registrar Venda
              </Button>
              <Button className="w-full justify-start" variant="premium">
                <TrendingUp className="mr-2 h-4 w-4" />
                Ver Relatórios
              </Button>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
