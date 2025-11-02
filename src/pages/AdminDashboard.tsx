import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Building2, Users, DollarSign, TrendingUp, AlertCircle, CheckCircle } from "lucide-react";

const AdminDashboard = () => {
  return (
    <div className="min-h-screen bg-gradient-dark">
      <div className="container mx-auto p-6">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold">Painel Master</h1>
          <p className="text-muted-foreground">Visão geral do sistema SaaS</p>
        </div>

        {/* Global Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="p-6 bg-card border-primary/50 shadow-card">
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-lg bg-primary/10">
                <Building2 className="h-6 w-6 text-primary" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Barbearias Ativas</p>
                <p className="text-2xl font-bold">127</p>
              </div>
            </div>
          </Card>

          <Card className="p-6 bg-card border-primary/50 shadow-card">
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-lg bg-primary/10">
                <Users className="h-6 w-6 text-primary" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Usuários Totais</p>
                <p className="text-2xl font-bold">1.234</p>
              </div>
            </div>
          </Card>

          <Card className="p-6 bg-card border-primary/50 shadow-card">
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-lg bg-primary/10">
                <DollarSign className="h-6 w-6 text-primary" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Receita Mensal</p>
                <p className="text-2xl font-bold">R$ 12.573</p>
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
                <p className="text-2xl font-bold">+23%</p>
              </div>
            </div>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Assinaturas */}
          <Card className="p-6 bg-card">
            <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
              <CheckCircle className="h-5 w-5 text-primary" />
              Assinaturas Ativas
            </h2>
            <div className="space-y-4">
              {[
                { name: "Barbearia Premium", plan: "Anual", status: "active", value: "R$ 79/mês" },
                { name: "Corte & Arte", plan: "Mensal", status: "active", value: "R$ 99/mês" },
                { name: "Estilo Masculino", plan: "Anual", status: "active", value: "R$ 79/mês" },
                { name: "King's Barber", plan: "Mensal", status: "active", value: "R$ 99/mês" },
              ].map((sub, i) => (
                <div key={i} className="flex items-center justify-between p-4 rounded-lg bg-secondary/50 border border-border">
                  <div>
                    <p className="font-semibold">{sub.name}</p>
                    <p className="text-sm text-muted-foreground">Plano {sub.plan}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-primary">{sub.value}</p>
                    <p className="text-sm text-muted-foreground">Ativo</p>
                  </div>
                </div>
              ))}
            </div>
          </Card>

          {/* Alertas */}
          <Card className="p-6 bg-card">
            <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
              <AlertCircle className="h-5 w-5 text-destructive" />
              Alertas e Pendências
            </h2>
            <div className="space-y-4">
              {[
                { name: "Barber Shop XYZ", issue: "Pagamento pendente", days: "3 dias" },
                { name: "Style Cut", issue: "Cartão recusado", days: "1 dia" },
                { name: "Urban Barber", issue: "Renovação próxima", days: "5 dias" },
              ].map((alert, i) => (
                <div key={i} className="flex items-center justify-between p-4 rounded-lg bg-destructive/10 border border-destructive/50">
                  <div>
                    <p className="font-semibold">{alert.name}</p>
                    <p className="text-sm text-muted-foreground">{alert.issue}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-destructive font-semibold">{alert.days}</p>
                    <Button size="sm" variant="outline">Resolver</Button>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>

        {/* Actions */}
        <div className="mt-6">
          <Card className="p-6 bg-card">
            <h2 className="text-xl font-semibold mb-4">Ações Administrativas</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Button variant="outline" className="w-full">
                <Building2 className="mr-2 h-4 w-4" />
                Gerenciar Barbearias
              </Button>
              <Button variant="outline" className="w-full">
                <Users className="mr-2 h-4 w-4" />
                Gerenciar Usuários
              </Button>
              <Button variant="outline" className="w-full">
                <DollarSign className="mr-2 h-4 w-4" />
                Relatórios Financeiros
              </Button>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
