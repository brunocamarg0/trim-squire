import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Plus, DollarSign, TrendingUp, TrendingDown, Calendar } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { financialService } from "@/services/financialService";
import { Transaction } from "@/types";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { useToast } from "@/hooks/use-toast";

const Financial = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [searchParams, setSearchParams] = useSearchParams();
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [stats, setStats] = useState({
    totalRevenue: 0,
    totalExpenses: 0,
    profit: 0,
    transactionCount: 0,
  });
  const [loading, setLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedTransaction, setSelectedTransaction] = useState<Transaction | null>(null);
  const [activeTab, setActiveTab] = useState<"revenue" | "expense">("revenue");
  
  // Form states
  const [formType, setFormType] = useState<"revenue" | "expense">("revenue");
  const [formCategory, setFormCategory] = useState("");
  const [formDescription, setFormDescription] = useState("");
  const [formAmount, setFormAmount] = useState("");
  const [formDate, setFormDate] = useState<Date>(new Date());

  const revenueCategories = ["Serviços", "Produtos", "Outros"];
  const expenseCategories = ["Salários", "Aluguel", "Materiais", "Utilidades", "Marketing", "Outros"];

  useEffect(() => {
    if (searchParams.get("action") === "new") {
      setIsDialogOpen(true);
      setSearchParams({});
    }
  }, [searchParams, setSearchParams]);

  useEffect(() => {
    loadFinancialData();
  }, [user]);

  const loadFinancialData = async () => {
    if (!user?.barbershopId) return;
    
    try {
      setLoading(true);
      const [transactionsList, statsData] = await Promise.all([
        financialService.getTransactions(user.barbershopId),
        financialService.getFinancialStats(user.barbershopId),
      ]);
      
      setTransactions(transactionsList);
      setStats(statsData);
    } catch (error) {
      console.error("Erro ao carregar dados financeiros:", error);
      toast({
        title: "Erro",
        description: "Não foi possível carregar os dados financeiros",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleOpenDialog = (transaction?: Transaction) => {
    if (transaction) {
      setSelectedTransaction(transaction);
      setFormType(transaction.type);
      setFormCategory(transaction.category);
      setFormDescription(transaction.description);
      setFormAmount(transaction.amount.toString());
      setFormDate(new Date(transaction.date));
    } else {
      setSelectedTransaction(null);
      resetForm();
    }
    setIsDialogOpen(true);
  };

  const resetForm = () => {
    setFormType(activeTab);
    setFormCategory("");
    setFormDescription("");
    setFormAmount("");
    setFormDate(new Date());
  };

  const handleCloseDialog = () => {
    setIsDialogOpen(false);
    setSelectedTransaction(null);
    resetForm();
  };

  const handleSave = async () => {
    if (!user?.barbershopId || !formCategory || !formDescription || !formAmount) {
      toast({
        title: "Campos obrigatórios",
        description: "Preencha todos os campos obrigatórios",
        variant: "destructive",
      });
      return;
    }

    try {
      const transactionData: Omit<Transaction, "id" | "createdAt"> = {
        barbershopId: user.barbershopId,
        type: formType,
        category: formCategory,
        description: formDescription,
        amount: parseFloat(formAmount),
        date: formDate,
        createdBy: user.id,
      };

      await financialService.createTransaction(transactionData);
      
      toast({
        title: "Sucesso",
        description: selectedTransaction ? "Transação atualizada!" : "Transação registrada!",
      });

      handleCloseDialog();
      loadFinancialData();
    } catch (error: any) {
      toast({
        title: "Erro",
        description: error.message || "Não foi possível salvar a transação",
        variant: "destructive",
      });
    }
  };

  const filteredTransactions = transactions.filter(t => t.type === activeTab);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-foreground mx-auto mb-4"></div>
          <p className="text-muted-foreground">Carregando dados financeiros...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold uppercase">Financeiro</h1>
          <p className="text-muted-foreground mt-2">Controle financeiro completo da sua barbearia</p>
        </div>
        <Button onClick={() => handleOpenDialog()} className="border-2 border-foreground">
          <Plus className="mr-2 h-4 w-4" />
          Nova Transação
        </Button>
      </div>

      {/* Estatísticas */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="p-6 border-2 border-border">
          <div className="flex items-center gap-4">
            <div className="p-3 border-2 border-green-500 bg-green-500/20 rounded-full">
              <TrendingUp className="h-6 w-6 text-green-600" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Receitas</p>
              <p className="text-2xl font-bold text-green-600">R$ {stats.totalRevenue.toFixed(2)}</p>
            </div>
          </div>
        </Card>

        <Card className="p-6 border-2 border-border">
          <div className="flex items-center gap-4">
            <div className="p-3 border-2 border-red-500 bg-red-500/20 rounded-full">
              <TrendingDown className="h-6 w-6 text-red-600" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Despesas</p>
              <p className="text-2xl font-bold text-red-600">R$ {stats.totalExpenses.toFixed(2)}</p>
            </div>
          </div>
        </Card>

        <Card className="p-6 border-2 border-border">
          <div className="flex items-center gap-4">
            <div className="p-3 border-2 border-foreground bg-background rounded-full">
              <DollarSign className="h-6 w-6" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Lucro</p>
              <p className={`text-2xl font-bold ${stats.profit >= 0 ? "text-green-600" : "text-red-600"}`}>
                R$ {stats.profit.toFixed(2)}
              </p>
            </div>
          </div>
        </Card>

        <Card className="p-6 border-2 border-border">
          <div className="flex items-center gap-4">
            <div className="p-3 border-2 border-foreground bg-background rounded-full">
              <Calendar className="h-6 w-6" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Transações</p>
              <p className="text-2xl font-bold">{stats.transactionCount}</p>
            </div>
          </div>
        </Card>
      </div>

      {/* Tabs de Receitas/Despesas */}
      <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as "revenue" | "expense")}>
        <TabsList className="grid w-full max-w-md grid-cols-2 border-2 border-border">
          <TabsTrigger value="revenue" className="font-bold">Receitas</TabsTrigger>
          <TabsTrigger value="expense" className="font-bold">Despesas</TabsTrigger>
        </TabsList>

        <TabsContent value={activeTab} className="space-y-4 mt-6">
          {filteredTransactions.length > 0 ? (
            filteredTransactions.map((transaction) => (
              <Card key={transaction.id} className="p-6 border-2 border-border hover:border-foreground transition-all">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <div className="flex items-center gap-4 mb-2">
                      <h3 className="text-xl font-bold">{transaction.description}</h3>
                      <span className="px-3 py-1 rounded-full text-xs font-bold border-2 bg-muted">
                        {transaction.category}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Calendar className="h-4 w-4" />
                      {format(new Date(transaction.date), "dd 'de' MMMM 'de' yyyy", { locale: ptBR })}
                    </div>
                  </div>
                  <div className="text-right">
                    <div className={`text-2xl font-bold ${transaction.type === "revenue" ? "text-green-600" : "text-red-600"}`}>
                      {transaction.type === "revenue" ? "+" : "-"} R$ {transaction.amount.toFixed(2)}
                    </div>
                  </div>
                </div>
              </Card>
            ))
          ) : (
            <Card className="p-12 text-center border-2 border-border">
              <p className="text-muted-foreground text-lg">
                Nenhuma {activeTab === "revenue" ? "receita" : "despesa"} registrada
              </p>
            </Card>
          )}
        </TabsContent>
      </Tabs>

      {/* Dialog de Criar Transação */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-md border-4 border-foreground">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold uppercase">
              {selectedTransaction ? "Editar Transação" : "Nova Transação"}
            </DialogTitle>
            <DialogDescription>
              Registre uma {formType === "revenue" ? "receita" : "despesa"}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label>Tipo</Label>
              <Select value={formType} onValueChange={(v) => setFormType(v as "revenue" | "expense")}>
                <SelectTrigger className="border-2">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="revenue">Receita</SelectItem>
                  <SelectItem value="expense">Despesa</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Categoria *</Label>
              <Select value={formCategory} onValueChange={setFormCategory}>
                <SelectTrigger className="border-2">
                  <SelectValue placeholder="Selecione a categoria" />
                </SelectTrigger>
                <SelectContent>
                  {(formType === "revenue" ? revenueCategories : expenseCategories).map((cat) => (
                    <SelectItem key={cat} value={cat}>
                      {cat}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Descrição *</Label>
              <Input
                value={formDescription}
                onChange={(e) => setFormDescription(e.target.value)}
                placeholder="Descrição da transação"
                className="border-2"
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Valor (R$) *</Label>
                <Input
                  type="number"
                  step="0.01"
                  value={formAmount}
                  onChange={(e) => setFormAmount(e.target.value)}
                  placeholder="0.00"
                  className="border-2"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label>Data</Label>
                <Input
                  type="date"
                  value={format(formDate, "yyyy-MM-dd")}
                  onChange={(e) => setFormDate(new Date(e.target.value))}
                  className="border-2"
                />
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={handleCloseDialog}
              className="border-2"
            >
              Cancelar
            </Button>
            <Button
              onClick={handleSave}
              className="border-2 border-foreground"
            >
              {selectedTransaction ? "Atualizar" : "Registrar"} Transação
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Financial;

