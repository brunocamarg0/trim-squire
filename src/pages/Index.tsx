import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Calendar, Users, TrendingUp, Scissors, Clock, DollarSign, Shield, Star, ArrowRight, Check } from "lucide-react";
import { Link } from "react-router-dom";
import heroImage from "@/assets/hero-barbershop.jpg";
import { BarberLogo } from "@/components/BarberLogo";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      {/* Navbar */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-sm border-b-2 border-foreground">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <BarberLogo size="sm" showText={true} />
          <div className="flex gap-4">
            <Button asChild variant="ghost" size="sm">
              <Link to="/demo">Demo</Link>
            </Button>
            <Button asChild variant="default" size="sm">
              <Link to="/auth">Entrar</Link>
            </Button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-20 bg-gradient-dark">
        <div 
          className="absolute inset-0 bg-cover bg-center opacity-10 mix-blend-overlay"
          style={{ backgroundImage: `url(${heroImage})` }}
        />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,hsl(0,0%,0%)_100%)]" />
        
        <div className="container relative z-10 mx-auto px-4 py-20">
          <div className="max-w-4xl mx-auto text-center animate-fade-in">
            <div className="inline-block mb-6 px-6 py-2 border-2 border-foreground bg-background">
              <span className="text-sm font-bold uppercase tracking-wider">Sistema SaaS para Barbearias</span>
            </div>
            
            <h1 className="mb-8 text-foreground leading-tight">
              Gerencie sua<br />
              <span className="inline-block border-4 border-foreground bg-foreground text-background px-4 py-2 mt-2 shadow-harsh">
                Barbearia
              </span>
            </h1>
            
            <p className="mb-12 text-xl text-muted-foreground max-w-2xl mx-auto">
              Agendamentos automatizados. Controle financeiro total. 
              Gestão de equipe simplificada. Tudo em um só lugar.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
              <Button asChild variant="brutalist" size="xl">
                <Link to="/auth">
                  Começar Grátis
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
              <Button asChild variant="outline" size="xl">
                <Link to="/demo">Ver Demonstração</Link>
              </Button>
            </div>

            <div className="mt-12 text-sm text-muted-foreground">
              <p>✓ 7 dias grátis  •  ✓ Sem cartão de crédito  •  ✓ Cancele quando quiser</p>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 px-4 border-y-2 border-foreground bg-foreground text-background">
        <div className="container mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {[
              { label: "Barbearias", value: "500+" },
              { label: "Agendamentos/mês", value: "50k+" },
              { label: "Barbeiros", value: "2000+" },
              { label: "Satisfação", value: "98%" },
            ].map((stat) => (
              <div key={stat.label} className="text-center">
                <div className="text-4xl md:text-5xl font-bold mb-2">{stat.value}</div>
                <div className="text-sm uppercase tracking-wider opacity-80">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 px-4">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-foreground mb-4">
              Recursos Completos
            </h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Tudo que você precisa para transformar sua gestão em um processo profissional e eficiente
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              {
                icon: Calendar,
                title: "Agendamento Online",
                description: "Sistema completo com confirmações automáticas, lembretes por e-mail e SMS."
              },
              {
                icon: Users,
                title: "Gestão de Equipe",
                description: "Controle total de barbeiros, horários individuais e comissionamentos."
              },
              {
                icon: DollarSign,
                title: "Controle Financeiro",
                description: "Receitas, despesas, comissões e relatórios financeiros detalhados."
              },
              {
                icon: TrendingUp,
                title: "Analytics Avançado",
                description: "Métricas em tempo real, gráficos e insights para crescer seu negócio."
              },
              {
                icon: Clock,
                title: "Gestão de Horários",
                description: "Configure horários de funcionamento, intervalos e disponibilidade."
              },
              {
                icon: Shield,
                title: "Segurança Total",
                description: "Dados protegidos com criptografia e backups automáticos diários."
              },
            ].map((feature) => (
              <Card 
                key={feature.title} 
                className="p-6 border-2 border-border hover:border-foreground transition-all group hover:shadow-harsh"
              >
                <div className="mb-4 inline-flex p-3 border-2 border-foreground bg-background group-hover:bg-foreground transition-colors">
                  <feature.icon className="h-8 w-8 text-foreground group-hover:text-background transition-colors" />
                </div>
                <h3 className="text-xl font-bold mb-2 uppercase">{feature.title}</h3>
                <p className="text-muted-foreground text-sm">
                  {feature.description}
                </p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section className="py-24 px-4 bg-muted">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-foreground mb-4">
              Preços Transparentes
            </h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Escolha o plano ideal para o seu negócio. Sem taxas escondidas.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {/* Mensal */}
            <Card className="p-8 border-2 border-border bg-background relative">
              <div className="mb-8">
                <h3 className="text-2xl font-bold uppercase mb-2">Mensal</h3>
                <div className="flex items-baseline gap-2 mb-4">
                  <span className="text-5xl font-bold">R$ 99</span>
                  <span className="text-muted-foreground">/mês</span>
                </div>
                <p className="text-sm text-muted-foreground">Flexibilidade total</p>
              </div>
              
              <ul className="space-y-3 mb-8">
                {[
                  "Agendamentos ilimitados",
                  "Até 5 barbeiros",
                  "Relatórios básicos",
                  "Suporte por email",
                  "App móvel incluído"
                ].map((item) => (
                  <li key={item} className="flex items-center gap-2">
                    <Check className="h-5 w-5 flex-shrink-0" />
                    <span className="text-sm">{item}</span>
                  </li>
                ))}
              </ul>
              
              <Button asChild className="w-full" variant="outline" size="lg">
                <Link to="/auth">Começar Teste</Link>
              </Button>
            </Card>

            {/* Anual - Destaque */}
            <Card className="p-8 border-4 border-foreground bg-foreground text-background relative shadow-harsh scale-105">
              <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-destructive text-destructive-foreground px-6 py-1 border-2 border-foreground font-bold text-sm uppercase">
                Mais Popular
              </div>
              
              <div className="mb-8">
                <h3 className="text-2xl font-bold uppercase mb-2">Anual</h3>
                <div className="flex items-baseline gap-2 mb-4">
                  <span className="text-5xl font-bold">R$ 79</span>
                  <span className="opacity-80">/mês</span>
                </div>
                <p className="text-sm opacity-80">R$ 948 cobrados anualmente</p>
              </div>
              
              <ul className="space-y-3 mb-8">
                {[
                  "Agendamentos ilimitados",
                  "Barbeiros ilimitados",
                  "Relatórios avançados",
                  "Suporte prioritário 24/7",
                  "App móvel + integrações",
                  "2 meses grátis"
                ].map((item) => (
                  <li key={item} className="flex items-center gap-2">
                    <Check className="h-5 w-5 flex-shrink-0" />
                    <span className="text-sm">{item}</span>
                  </li>
                ))}
              </ul>
              
              <Button asChild className="w-full bg-background text-foreground hover:bg-background/90 border-2 border-background shadow-[4px_4px_0px_0px_rgba(255,255,255,1)] hover:shadow-none hover:translate-x-1 hover:translate-y-1" size="lg">
                <Link to="/auth">Começar Agora</Link>
              </Button>
            </Card>

            {/* Teste Grátis */}
            <Card className="p-8 border-2 border-border bg-background relative">
              <div className="mb-8">
                <h3 className="text-2xl font-bold uppercase mb-2">Teste Grátis</h3>
                <div className="flex items-baseline gap-2 mb-4">
                  <span className="text-5xl font-bold">R$ 0</span>
                  <span className="text-muted-foreground">/7 dias</span>
                </div>
                <p className="text-sm text-muted-foreground">Experimente sem compromisso</p>
              </div>
              
              <ul className="space-y-3 mb-8">
                {[
                  "Acesso completo",
                  "Até 3 barbeiros",
                  "Todas as funcionalidades",
                  "Sem cartão de crédito",
                  "Sem compromisso"
                ].map((item) => (
                  <li key={item} className="flex items-center gap-2">
                    <Check className="h-5 w-5 flex-shrink-0" />
                    <span className="text-sm">{item}</span>
                  </li>
                ))}
              </ul>
              
              <Button asChild className="w-full" variant="outline" size="lg">
                <Link to="/auth">Começar Teste</Link>
              </Button>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 px-4 border-y-4 border-foreground bg-gradient-dark text-background">
        <div className="container mx-auto text-center">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-4xl md:text-6xl font-bold mb-6 uppercase leading-tight">
              Pronto para<br />revolucionar<br />sua barbearia?
            </h2>
            <p className="text-xl mb-12 opacity-90">
              Junte-se a centenas de barbearias que já transformaram sua gestão
            </p>
            <Button asChild variant="brutalist" size="xl" className="bg-background text-foreground border-background hover:bg-foreground hover:text-background">
              <Link to="/auth">
                Começar Teste Grátis
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t-2 border-foreground py-12 px-4 bg-background">
        <div className="container mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
            <div>
              <BarberLogo size="sm" showText={true} />
              <p className="text-sm text-muted-foreground mt-4">
                Sistema completo de gestão para barbearias modernas.
              </p>
            </div>
            
            <div>
              <h4 className="font-bold mb-4 uppercase text-sm">Produto</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><Link to="/demo" className="hover:text-foreground transition-colors">Demonstração</Link></li>
                <li><Link to="#" className="hover:text-foreground transition-colors">Recursos</Link></li>
                <li><Link to="#" className="hover:text-foreground transition-colors">Preços</Link></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-bold mb-4 uppercase text-sm">Empresa</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><Link to="#" className="hover:text-foreground transition-colors">Sobre</Link></li>
                <li><Link to="#" className="hover:text-foreground transition-colors">Blog</Link></li>
                <li><Link to="#" className="hover:text-foreground transition-colors">Contato</Link></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-bold mb-4 uppercase text-sm">Suporte</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><Link to="#" className="hover:text-foreground transition-colors">Central de Ajuda</Link></li>
                <li><Link to="#" className="hover:text-foreground transition-colors">Documentação</Link></li>
                <li><Link to="#" className="hover:text-foreground transition-colors">Termos de Uso</Link></li>
              </ul>
            </div>
          </div>
          
          <div className="pt-8 border-t-2 border-border text-center">
            <p className="text-sm text-muted-foreground">
              &copy; 2025 BarberPro. Todos os direitos reservados.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
