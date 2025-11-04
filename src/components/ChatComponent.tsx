import { useState, useEffect, useRef } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Send, Bot, User } from "lucide-react";
import { messageService } from "@/services/messageService";
import { chatbotService } from "@/services/chatbotService";
import { Message } from "@/types";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

interface ChatComponentProps {
  chatId: string;
  barbershopId: string;
  clientId: string;
  clientName: string;
}

export const ChatComponent = ({ chatId, barbershopId, clientId, clientName }: ChatComponentProps) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputMessage, setInputMessage] = useState("");
  const [isSending, setIsSending] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Carregar mensagens iniciais
    const loadMessages = async () => {
      try {
        const loadedMessages = await messageService.getMessages(chatId);
        setMessages(loadedMessages);
      } catch (error) {
        console.error("Erro ao carregar mensagens:", error);
      }
    };

    loadMessages();

    // Escutar novas mensagens em tempo real
    const unsubscribe = messageService.subscribeToMessages(chatId, (newMessages) => {
      setMessages(newMessages);
      setTimeout(() => scrollToBottom(), 100);
    });

    return () => unsubscribe();
  }, [chatId]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!inputMessage.trim() || isSending) return;

    const messageText = inputMessage.trim();
    setInputMessage("");
    setIsSending(true);

    try {
      // Enviar mensagem do cliente
      await messageService.sendMessage(
        chatId,
        clientId,
        "client",
        clientName,
        messageText,
        "text"
      );

      // Processar mensagem com o chatbot
      await chatbotService.processMessage(chatId, barbershopId, clientId, clientName, messageText);
    } catch (error) {
      console.error("Erro ao enviar mensagem:", error);
    } finally {
      setIsSending(false);
    }
  };

  return (
    <Card className="flex flex-col h-[600px] border-2 border-border">
      {/* Header */}
      <div className="p-4 border-b-2 border-border bg-background">
        <div className="flex items-center gap-2">
          <Bot className="h-5 w-5 text-primary" />
          <h3 className="font-bold">Chat com a Barbearia</h3>
        </div>
      </div>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-muted/30">
        {messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-center text-muted-foreground">
            <Bot className="h-12 w-12 mb-4 opacity-50" />
            <p>Nenhuma mensagem ainda.</p>
            <p className="text-sm mt-2">Digite "oi" ou "agendar" para começar!</p>
          </div>
        ) : (
          messages.map((message) => (
            <div
              key={message.id}
              className={`flex gap-3 ${
                message.senderRole === "client" ? "justify-end" : "justify-start"
              }`}
            >
              {message.senderRole !== "client" && (
                <div className="flex-shrink-0">
                  <div className="h-8 w-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center">
                    {message.senderRole === "ai" ? (
                      <Bot className="h-4 w-4" />
                    ) : (
                      <User className="h-4 w-4" />
                    )}
                  </div>
                </div>
              )}

              <div
                className={`max-w-[70%] rounded-lg p-3 ${
                  message.senderRole === "client"
                    ? "bg-primary text-primary-foreground"
                    : "bg-background border-2 border-border"
                }`}
              >
                {message.senderRole !== "client" && (
                  <p className="text-xs font-bold mb-1 opacity-70">
                    {message.senderName}
                  </p>
                )}
                <p className="whitespace-pre-wrap break-words">{message.content}</p>
                <p className="text-xs mt-1 opacity-70">
                  {format(message.createdAt, "HH:mm", { locale: ptBR })}
                </p>
              </div>

              {message.senderRole === "client" && (
                <div className="flex-shrink-0">
                  <div className="h-8 w-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center">
                    <User className="h-4 w-4" />
                  </div>
                </div>
              )}
            </div>
          ))
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <form onSubmit={handleSendMessage} className="p-4 border-t-2 border-border bg-background">
        <div className="flex gap-2">
          <Input
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            placeholder="Digite sua mensagem..."
            disabled={isSending}
            className="flex-1"
          />
          <Button type="submit" disabled={isSending || !inputMessage.trim()}>
            <Send className="h-4 w-4" />
          </Button>
        </div>
      </form>
    </Card>
  );
};

