import { Card } from "@/components/ui/card";
import { AlertCircle } from "lucide-react";
import { Link } from "react-router-dom";

export const FirebaseSetupWarning = () => {
  const apiKey = import.meta.env.VITE_FIREBASE_API_KEY;
  const isFirebaseConfigured = apiKey && 
    apiKey !== 'your-api-key-here' && 
    !apiKey.includes('your-') &&
    apiKey.length > 10;

  if (!isFirebaseConfigured) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4 bg-background">
        <Card className="max-w-2xl w-full p-8 border-4 border-foreground">
          <div className="flex items-start gap-4 mb-6">
            <AlertCircle className="h-8 w-8 text-destructive flex-shrink-0" />
            <div>
              <h2 className="text-2xl font-bold mb-2 uppercase">Firebase Não Configurado</h2>
              <p className="text-muted-foreground">
                Você precisa configurar o Firebase antes de usar o sistema.
              </p>
            </div>
          </div>
          
          <div className="space-y-4 mb-6">
            <div className="p-4 border-2 border-border bg-muted">
              <h3 className="font-bold mb-2 uppercase text-sm">Passos Necessários:</h3>
              <ol className="list-decimal list-inside space-y-2 text-sm text-muted-foreground">
                <li>Criar arquivo <code className="bg-background px-1 py-0.5 border border-border">.env.local</code> na raiz do projeto</li>
                <li>Adicionar suas credenciais do Firebase</li>
                <li>Habilitar Authentication (Email/Senha) no Firebase Console</li>
                <li>Criar banco Firestore Database</li>
                <li>Reiniciar o servidor</li>
              </ol>
            </div>
            
            <div className="p-4 border-2 border-foreground bg-foreground text-background">
              <p className="text-sm font-bold mb-1">📖 Documentação Completa:</p>
              <p className="text-sm">
                Veja o arquivo <code className="bg-background/20 px-1 py-0.5">CONFIGURAR_FIREBASE.md</code> na raiz do projeto
                ou <code className="bg-background/20 px-1 py-0.5">COMO_OBTER_CREDENCIAIS.md</code> para instruções detalhadas.
              </p>
            </div>
          </div>
          
          <div className="flex gap-4">
            <a 
              href="https://console.firebase.google.com" 
              target="_blank" 
              rel="noopener noreferrer"
              className="px-6 py-3 border-2 border-foreground bg-background hover:bg-foreground hover:text-background transition-all font-bold uppercase"
            >
              Abrir Firebase Console
            </a>
            <Link
              to="/"
              className="px-6 py-3 border-2 border-border hover:border-foreground transition-all font-bold uppercase"
            >
              Voltar para Home
            </Link>
          </div>
        </Card>
      </div>
    );
  }

  return null;
};

