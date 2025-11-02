import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Calendar, Users, TrendingUp, Scissors, Clock, DollarSign, Shield, Star } from "lucide-react";
import { Link } from "react-router-dom";
import heroImage from "@/assets/hero-barbershop.jpg";

const Index = () => {
  return (
    <div className="min-h-screen bg-gradient-dark">
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        <div 
          className="absolute inset-0 bg-cover bg-center opacity-20"
          style={{ backgroundImage: `url(${heroImage})` }}
        />
        <div className="absolute inset-0 bg-gradient-hero" />
        
        <div className="container relative z-10 mx-auto px-4 py-20 text-center">
          <div className="animate-fade-in">
            <h1 className="mb-6 text-5xl md:text-7xl font-bold">
              <span className="bg-gradient-primary bg-clip-text text-transparent">
                Barber
              </span>
            </h1>
            <p className="mb-8 text-xl md:text-2xl text-muted-foreground max-w-3xl mx-auto">
              Sistema completo de gestão para barbearias. 
              Agendamentos, controle financeiro e muito mais em uma única plataforma.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Button asChild variant="hero" size="xl" className="animate-glow">
                <Link to="/auth">Começar Agora</Link>
              </Button>
              <Button asChild variant="premium" size="xl">
                <Link to="/demo">Ver Demonstração</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto">
          <h2 className="text-4xl font-bold text-center mb-4">
            Tudo que você precisa para <span className="text-primary">gerenciar sua barbearia</span>
          </h2>
          <p className="text-center text-muted-foreground mb-12 max-w-2xl mx-auto">
            Funcionalidades completas para otimizar seu negócio e aumentar seus lucros
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <Card className="p-6 bg-card border-border hover:border-primary transition-all duration-300 hover:shadow-premium group">
              <div className="mb-4 inline-flex p-3 rounded-lg bg-primary/10 group-hover:bg-primary/20 transition-colors">
                <Calendar className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Agendamento Online</h3>
              <p className="text-muted-foreground">
                Sistema intuitivo de agendamentos com confirmações automáticas e lembretes.
              </p>
            </Card>

            <Card className="p-6 bg-card border-border hover:border-primary transition-all duration-300 hover:shadow-premium group">
              <div className="mb-4 inline-flex p-3 rounded-lg bg-primary/10 group-hover:bg-primary/20 transition-colors">
                <Users className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Gestão de Equipe</h3>
              <p className="text-muted-foreground">
                Controle completo de barbeiros, horários e comissionamentos.
              </p>
            </Card>

            <Card className="p-6 bg-card border-border hover:border-primary transition-all duration-300 hover:shadow-premium group">
              <div className="mb-4 inline-flex p-3 rounded-lg bg-primary/10 group-hover:bg-primary/20 transition-colors">
                <DollarSign className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Controle Financeiro</h3>
              <p className="text-muted-foreground">
                Gestão completa de receitas, despesas e relatórios detalhados.
              </p>
            </Card>

            <Card className="p-6 bg-card border-border hover:border-primary transition-all duration-300 hover:shadow-premium group">
              <div className="mb-4 inline-flex p-3 rounded-lg bg-primary/10 group-hover:bg-primary/20 transition-colors">
                <TrendingUp className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Relatórios e Analytics</h3>
              <p className="text-muted-foreground">
                Insights detalhados sobre seu negócio com gráficos e métricas.
              </p>
            </Card>

            <Card className="p-6 bg-card border-border hover:border-primary transition-all duration-300 hover:shadow-premium group">
              <div className="mb-4 inline-flex p-3 rounded-lg bg-primary/10 group-hover:bg-primary/20 transition-colors">
                <Clock className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Gestão de Horários</h3>
              <p className="text-muted-foreground">
                Configure horários de funcionamento e intervalos facilmente.
              </p>
            </Card>

            <Card className="p-6 bg-card border-border hover:border-primary transition-all duration-300 hover:shadow-premium group">
              <div className="mb-4 inline-flex p-3 rounded-lg bg-primary/10 group-hover:bg-primary/20 transition-colors">
                <Shield className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Segurança Total</h3>
              <p className="text-muted-foreground">
                Seus dados protegidos com criptografia de ponta a ponta.
              </p>
            </Card>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section className="py-20 px-4 bg-secondary/20">
        <div className="container mx-auto">
          <h2 className="text-4xl font-bold text-center mb-4">
            Planos que <span className="text-primary">cabem no seu bolso</span>
          </h2>
          <p className="text-center text-muted-foreground mb-12 max-w-2xl mx-auto">
            Escolha o plano ideal para o seu negócio
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-6xl mx-auto">
            {/* Mensal */}
            <Card className="p-8 bg-card border-border hover:border-primary transition-all duration-300">
              <div className="text-center mb-6">
                <h3 className="text-2xl font-bold mb-2">Mensal</h3>
                <div className="flex items-baseline justify-center gap-2">
                  <span className="text-4xl font-bold text-primary">R$ 99</span>
                  <span className="text-muted-foreground">/mês</span>
                </div>
              </div>
              <ul className="space-y-4 mb-8">
                <li className="flex items-center gap-2">
                  <Star className="h-5 w-5 text-primary" />
                  <span>Agendamentos ilimitados</span>
                </li>
                <li className="flex items-center gap-2">
                  <Star className="h-5 w-5 text-primary" />
                  <span>Até 5 barbeiros</span>
                </li>
                <li className="flex items-center gap-2">
                  <Star className="h-5 w-5 text-primary" />
                  <span>Relatórios básicos</span>
                </li>
                <li className="flex items-center gap-2">
                  <Star className="h-5 w-5 text-primary" />
                  <span>Suporte por email</span>
                </li>
              </ul>
              <Button asChild className="w-full" variant="outline">
                <Link to="/auth">Começar Teste</Link>
              </Button>
            </Card>

            {/* Anual - Destaque */}
            <Card className="p-8 bg-gradient-primary border-2 border-primary relative shadow-premium">
              <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-destructive text-destructive-foreground px-4 py-1 rounded-full text-sm font-semibold">
                Mais Popular
              </div>
              <div className="text-center mb-6">
                <h3 className="text-2xl font-bold mb-2 text-primary-foreground">Anual</h3>
                <div className="flex items-baseline justify-center gap-2">
                  <span className="text-4xl font-bold text-primary-foreground">R$ 79</span>
                  <span className="text-primary-foreground/80">/mês</span>
                </div>
                <p className="text-sm text-primary-foreground/70 mt-2">R$ 948 cobrados anualmente</p>
              </div>
              <ul className="space-y-4 mb-8">
                <li className="flex items-center gap-2 text-primary-foreground">
                  <Star className="h-5 w-5" />
                  <span>Agendamentos ilimitados</span>
                </li>
                <li className="flex items-center gap-2 text-primary-foreground">
                  <Star className="h-5 w-5" />
                  <span>Barbeiros ilimitados</span>
                </li>
                <li className="flex items-center gap-2 text-primary-foreground">
                  <Star className="h-5 w-5" />
                  <span>Relatórios avançados</span>
                </li>
                <li className="flex items-center gap-2 text-primary-foreground">
                  <Star className="h-5 w-5" />
                  <span>Suporte prioritário</span>
                </li>
                <li className="flex items-center gap-2 text-primary-foreground">
                  <Star className="h-5 w-5" />
                  <span>2 meses grátis</span>
                </li>
              </ul>
              <Button asChild className="w-full bg-card text-foreground hover:bg-card/90" size="lg">
                <Link to="/auth">Começar Agora</Link>
              </Button>
            </Card>

            {/* Teste Grátis */}
            <Card className="p-8 bg-card border-border hover:border-primary transition-all duration-300">
              <div className="text-center mb-6">
                <h3 className="text-2xl font-bold mb-2">Teste Grátis</h3>
                <div className="flex items-baseline justify-center gap-2">
                  <span className="text-4xl font-bold text-primary">R$ 0</span>
                  <span className="text-muted-foreground">/7 dias</span>
                </div>
              </div>
              <ul className="space-y-4 mb-8">
                <li className="flex items-center gap-2">
                  <Star className="h-5 w-5 text-primary" />
                  <span>Acesso completo</span>
                </li>
                <li className="flex items-center gap-2">
                  <Star className="h-5 w-5 text-primary" />
                  <span>Até 3 barbeiros</span>
                </li>
                <li className="flex items-center gap-2">
                  <Star className="h-5 w-5 text-primary" />
                  <span>Todas as funcionalidades</span>
                </li>
                <li className="flex items-center gap-2">
                  <Star className="h-5 w-5 text-primary" />
                  <span>Sem cartão de crédito</span>
                </li>
              </ul>
              <Button asChild className="w-full" variant="outline">
                <Link to="/auth">Começar Teste</Link>
              </Button>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto text-center">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              Pronto para <span className="text-primary">revolucionar</span> sua barbearia?
            </h2>
            <p className="text-xl text-muted-foreground mb-8">
              Junte-se a centenas de barbearias que já transformaram sua gestão com o Barber
            </p>
            <Button asChild variant="hero" size="xl" className="animate-glow">
              <Link to="/auth">Começar Teste Grátis</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border py-8 px-4">
        <div className="container mx-auto text-center text-muted-foreground">
          <p>&copy; 2025 Barber. Todos os direitos reservados.</p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
