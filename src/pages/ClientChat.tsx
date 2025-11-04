import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { messageService } from "@/services/messageService";
import { ChatComponent } from "@/components/ChatComponent";
import { useToast } from "@/hooks/use-toast";

const ClientChat = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { toast } = useToast();
  const [chatId, setChatId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const initializeChat = async () => {
      if (!user || !user.barbershopId) {
        toast({
          title: "Erro",
          description: "Você precisa estar logado e associado a uma barbearia",
          variant: "destructive",
        });
        navigate("/auth");
        return;
      }

      try {
        // Verificar se há um chatId na URL
        const chatIdParam = searchParams.get("chatId");
        
        if (chatIdParam) {
          setChatId(chatIdParam);
          setLoading(false);
          return;
        }

        // Criar ou obter chat existente
        const newChatId = await messageService.getOrCreateChat(
          user.barbershopId,
          user.id,
          user.name
        );
        
        setChatId(newChatId);
      } catch (error) {
        console.error("Erro ao inicializar chat:", error);
        toast({
          title: "Erro",
          description: "Não foi possível inicializar o chat",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    initializeChat();
  }, [user, searchParams, navigate, toast]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-dark flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-foreground mx-auto mb-4"></div>
          <p className="text-muted-foreground">Carregando chat...</p>
        </div>
      </div>
    );
  }

  if (!chatId || !user || !user.barbershopId) {
    return (
      <div className="min-h-screen bg-gradient-dark flex items-center justify-center">
        <div className="text-center">
          <p className="text-muted-foreground mb-4">Erro ao carregar o chat</p>
          <Button onClick={() => navigate("/client/dashboard")} variant="outline">
            Voltar
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-dark">
      <div className="container mx-auto p-6">
        <div className="mb-4">
          <Button
            onClick={() => navigate("/client/dashboard")}
            variant="ghost"
            size="sm"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Voltar
          </Button>
        </div>
        
        <div className="max-w-4xl mx-auto">
          <ChatComponent
            chatId={chatId}
            barbershopId={user.barbershopId}
            clientId={user.id}
            clientName={user.name}
          />
        </div>
      </div>
    </div>
  );
};

export default ClientChat;

