import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calendar, Users, DollarSign, ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";
import { BarberLogo } from "@/components/BarberLogo";

const Demo = () => {
  return (
    <div className="min-h-screen bg-gradient-dark">
      <div className="container mx-auto p-6">
        <div className="mb-8 flex items-center gap-4">
          <Button asChild variant="ghost">
            <Link to="/">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Voltar
            </Link>
          </Button>
        </div>

        <div className="text-center mb-12">
          <div className="flex justify-center mb-6">
            <BarberLogo size="md" showText={false} />
          </div>
          <h1 className="text-4xl font-bold mb-4">
            Demonstração do <span className="text-primary">Barber</span>
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Veja como nosso sistema funciona na prática
          </p>
        </div>

        {/* Demo Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <Card className="p-6 bg-card border-primary/50 shadow-premium">
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-lg bg-primary/10">
                <Calendar className="h-6 w-6 text-primary" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Agendamentos</p>
                <p className="text-2xl font-bold">+350%</p>
                <p className="text-xs text-muted-foreground">crescimento médio</p>
              </div>
            </div>
          </Card>

          <Card className="p-6 bg-card border-primary/50 shadow-premium">
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-lg bg-primary/10">
                <Users className="h-6 w-6 text-primary" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Eficiência</p>
                <p className="text-2xl font-bold">87%</p>
                <p className="text-xs text-muted-foreground">redução de no-shows</p>
              </div>
            </div>
          </Card>

          <Card className="p-6 bg-card border-primary/50 shadow-premium">
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-lg bg-primary/10">
                <DollarSign className="h-6 w-6 text-primary" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Receita</p>
                <p className="text-2xl font-bold">+45%</p>
                <p className="text-xs text-muted-foreground">aumento médio</p>
              </div>
            </div>
          </Card>
        </div>

        {/* Demo Sections */}
        <div className="space-y-8">
          <Card className="p-8 bg-card">
            <h2 className="text-2xl font-bold mb-4">Painel do Proprietário</h2>
            <p className="text-muted-foreground mb-6">
              Visão completa do seu negócio com métricas em tempo real, controle financeiro e gestão de equipe.
            </p>
            <img 
              src="https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=1200&q=80" 
              alt="Dashboard" 
              className="rounded-lg border border-border"
            />
          </Card>

          <Card className="p-8 bg-card">
            <h2 className="text-2xl font-bold mb-4">Sistema de Agendamentos</h2>
            <p className="text-muted-foreground mb-6">
              Agendamento online simples e intuitivo com confirmações automáticas e lembretes por SMS/email.
            </p>
            <img 
              src="https://images.unsplash.com/photo-1557804506-669a67965ba0?auto=format&fit=crop&w=1200&q=80" 
              alt="Agendamentos" 
              className="rounded-lg border border-border"
            />
          </Card>

          <Card className="p-8 bg-card">
            <h2 className="text-2xl font-bold mb-4">Gestão Financeira</h2>
            <p className="text-muted-foreground mb-6">
              Controle total de receitas, despesas e comissões com relatórios detalhados e gráficos interativos.
            </p>
            <img 
              src="https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=1200&q=80" 
              alt="Financeiro" 
              className="rounded-lg border border-border"
            />
          </Card>
        </div>

        <div className="mt-12 text-center">
          <h3 className="text-2xl font-bold mb-4">Pronto para começar?</h3>
          <div className="flex gap-4 justify-center">
            <Button asChild variant="hero" size="xl">
              <Link to="/auth">Iniciar Teste Grátis</Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Demo;
