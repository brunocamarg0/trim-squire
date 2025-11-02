import React, { Component, ErrorInfo, ReactNode } from 'react';
import { Card } from '@/components/ui/card';
import { AlertCircle } from 'lucide-react';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('❌ Erro capturado pelo ErrorBoundary:', error, errorInfo);
  }

  public render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center p-4 bg-background">
          <Card className="max-w-2xl w-full p-8 border-4 border-destructive">
            <div className="flex items-start gap-4 mb-6">
              <AlertCircle className="h-8 w-8 text-destructive flex-shrink-0" />
              <div>
                <h2 className="text-2xl font-bold mb-2 uppercase">Erro na Aplicação</h2>
                <p className="text-muted-foreground mb-4">
                  Ocorreu um erro inesperado. Por favor, recarregue a página.
                </p>
                {this.state.error && (
                  <details className="mt-4">
                    <summary className="cursor-pointer text-sm font-bold mb-2">Detalhes do erro:</summary>
                    <pre className="text-xs bg-muted p-4 rounded border overflow-auto max-h-48">
                      {this.state.error.message}
                      {'\n'}
                      {this.state.error.stack}
                    </pre>
                  </details>
                )}
              </div>
            </div>
            <button
              onClick={() => window.location.reload()}
              className="w-full px-6 py-3 border-2 border-foreground bg-background hover:bg-foreground hover:text-background transition-all font-bold uppercase"
            >
              Recarregar Página
            </button>
          </Card>
        </div>
      );
    }

    return this.props.children;
  }
}

