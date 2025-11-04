import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { Link } from "react-router-dom";
import { BarberLogo } from "@/components/BarberLogo";
import { useAuth } from "@/contexts/AuthContext";
import { authService } from "@/services/authService";

const Auth = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [signupName, setSignupName] = useState("");
  const [signupEmail, setSignupEmail] = useState("");
  const [signupBarbershop, setSignupBarbershop] = useState("");
  const [signupPassword, setSignupPassword] = useState("");
  const [clientName, setClientName] = useState("");
  const [clientEmail, setClientEmail] = useState("");
  const [clientBarbershopId, setClientBarbershopId] = useState("");
  const [clientPassword, setClientPassword] = useState("");
  const navigate = useNavigate();
  const { toast } = useToast();
  const { signIn, signUp, signUpClient, user } = useAuth();

  // Redirecionar automaticamente se já estiver logado
  useEffect(() => {
    if (user && !isLoading) {
      // Redirecionar baseado no role do usuário
      if (user.role === 'client') {
        navigate("/client/dashboard", { replace: true });
      } else {
        navigate("/dashboard", { replace: true });
      }
    }
  }, [user, navigate, isLoading]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    const result = await signIn(loginEmail, loginPassword);

    if (result.success) {
      toast({
        title: "Login realizado!",
        description: "Redirecionando...",
      });
      
      // Aguardar um pouco para o user ser atualizado no contexto e redirecionar
      setTimeout(() => {
        // O redirecionamento será feito pelo useEffect que monitora o user
      }, 500);
    } else {
      toast({
        title: "Erro no login",
        description: result.error || "Email ou senha incorretos",
        variant: "destructive",
      });
      setIsLoading(false);
    }
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    const result = await signUp(signupEmail, signupPassword, signupName, signupBarbershop);

    if (result.success) {
      toast({
        title: "Conta criada!",
        description: "Redirecionando para o dashboard...",
      });
      
      setTimeout(() => {
        navigate("/dashboard", { replace: true });
      }, 1000);
    } else {
      toast({
        title: "Erro ao criar conta",
        description: result.error || "Não foi possível criar a conta",
        variant: "destructive",
      });
      setIsLoading(false);
    }
  };

  const handleClientSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    const result = await signUpClient(clientEmail, clientPassword, clientName, clientBarbershopId);

    if (result.success) {
      toast({
        title: "Conta criada!",
        description: "Redirecionando para o dashboard...",
      });
      
      setTimeout(() => {
        navigate("/client/dashboard", { replace: true });
      }, 1000);
    } else {
      toast({
        title: "Erro ao criar conta",
        description: result.error || "Não foi possível criar a conta de cliente",
        variant: "destructive",
      });
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-hero flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <Link to="/" className="inline-block mb-2">
            <BarberLogo size="md" showText={true} />
          </Link>
          <p className="text-white/90 font-medium">Gestão profissional para sua barbearia</p>
        </div>

        <Card className="p-6 shadow-premium">
          <Tabs defaultValue="login" className="w-full">
            <TabsList className="grid w-full grid-cols-3 mb-6">
              <TabsTrigger value="login">Entrar</TabsTrigger>
              <TabsTrigger value="signup">Sou Barbeiro</TabsTrigger>
              <TabsTrigger value="signup-client">Sou Cliente</TabsTrigger>
            </TabsList>

            <TabsContent value="login">
              <form onSubmit={handleLogin} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="seu@email.com"
                    value={loginEmail}
                    onChange={(e) => setLoginEmail(e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="password">Senha</Label>
                  <Input
                    id="password"
                    type="password"
                    placeholder="••••••••"
                    value={loginPassword}
                    onChange={(e) => setLoginPassword(e.target.value)}
                    required
                  />
                </div>
                <Button type="submit" className="w-full" disabled={isLoading} variant="hero">
                  {isLoading ? "Entrando..." : "Entrar"}
                </Button>
              </form>
            </TabsContent>

            <TabsContent value="signup">
              <form onSubmit={handleSignup} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Nome Completo</Label>
                  <Input
                    id="name"
                    type="text"
                    placeholder="Seu nome"
                    value={signupName}
                    onChange={(e) => setSignupName(e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="signup-email">Email</Label>
                  <Input
                    id="signup-email"
                    type="email"
                    placeholder="seu@email.com"
                    value={signupEmail}
                    onChange={(e) => setSignupEmail(e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="barbershop">Nome da Barbearia</Label>
                  <Input
                    id="barbershop"
                    type="text"
                    placeholder="Minha Barbearia"
                    value={signupBarbershop}
                    onChange={(e) => setSignupBarbershop(e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="signup-password">Senha</Label>
                  <Input
                    id="signup-password"
                    type="password"
                    placeholder="••••••••"
                    value={signupPassword}
                    onChange={(e) => setSignupPassword(e.target.value)}
                    required
                  />
                </div>
                <Button type="submit" className="w-full" disabled={isLoading} variant="hero">
                  {isLoading ? "Criando conta..." : "Criar Conta de Barbeiro"}
                </Button>
              </form>
            </TabsContent>

            <TabsContent value="signup-client">
              <form onSubmit={handleClientSignup} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="client-name">Nome Completo</Label>
                  <Input
                    id="client-name"
                    type="text"
                    placeholder="Seu nome"
                    value={clientName}
                    onChange={(e) => setClientName(e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="client-email">Email</Label>
                  <Input
                    id="client-email"
                    type="email"
                    placeholder="seu@email.com"
                    value={clientEmail}
                    onChange={(e) => setClientEmail(e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="client-barbershop">ID da Barbearia</Label>
                  <Input
                    id="client-barbershop"
                    type="text"
                    placeholder="ID da barbearia (ex: abc123...)"
                    value={clientBarbershopId}
                    onChange={(e) => setClientBarbershopId(e.target.value)}
                    required
                  />
                  <p className="text-xs text-muted-foreground">
                    Peça o ID da barbearia ao proprietário ou use o ID do Firebase
                  </p>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="client-password">Senha</Label>
                  <Input
                    id="client-password"
                    type="password"
                    placeholder="••••••••"
                    value={clientPassword}
                    onChange={(e) => setClientPassword(e.target.value)}
                    required
                  />
                </div>
                <Button type="submit" className="w-full" disabled={isLoading} variant="hero">
                  {isLoading ? "Criando conta..." : "Criar Conta de Cliente"}
                </Button>
              </form>
            </TabsContent>
          </Tabs>
        </Card>

        <p className="text-center text-sm text-muted-foreground mt-4">
          <Link to="/" className="hover:text-primary transition-colors">
            ← Voltar para home
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Auth;
