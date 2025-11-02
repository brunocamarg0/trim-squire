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
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Plus, Edit, Trash2, Search, Phone, Mail, Calendar } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { barbershopService } from "@/services/barbershopService";
import { Client } from "@/types";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { useToast } from "@/hooks/use-toast";

const Clients = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [searchParams, setSearchParams] = useSearchParams();
  const [clients, setClients] = useState<Client[]>([]);
  const [loading, setLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedClient, setSelectedClient] = useState<Client | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  
  // Form states
  const [formName, setFormName] = useState("");
  const [formEmail, setFormEmail] = useState("");
  const [formPhone, setFormPhone] = useState("");
  const [formDateOfBirth, setFormDateOfBirth] = useState<Date>();
  const [formNotes, setFormNotes] = useState("");

  useEffect(() => {
    if (searchParams.get("action") === "new") {
      setIsDialogOpen(true);
      setSearchParams({});
    }
  }, [searchParams, setSearchParams]);

  useEffect(() => {
    loadClients();
  }, [user]);

  const loadClients = async () => {
    if (!user?.barbershopId) return;
    
    try {
      setLoading(true);
      const clientsList = await barbershopService.getClients(user.barbershopId);
      setClients(clientsList);
    } catch (error) {
      console.error("Erro ao carregar clientes:", error);
      toast({
        title: "Erro",
        description: "Não foi possível carregar os clientes",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleOpenDialog = (client?: Client) => {
    if (client) {
      setSelectedClient(client);
      setFormName(client.name);
      setFormEmail(client.email || "");
      setFormPhone(client.phone);
      setFormDateOfBirth(client.dateOfBirth ? new Date(client.dateOfBirth) : undefined);
      setFormNotes(client.preferences?.notes || "");
    } else {
      setSelectedClient(null);
      resetForm();
    }
    setIsDialogOpen(true);
  };

  const resetForm = () => {
    setFormName("");
    setFormEmail("");
    setFormPhone("");
    setFormDateOfBirth(undefined);
    setFormNotes("");
  };

  const handleCloseDialog = () => {
    setIsDialogOpen(false);
    setSelectedClient(null);
    resetForm();
  };

  const handleSave = async () => {
    if (!user?.barbershopId || !formName || !formPhone) {
      toast({
        title: "Campos obrigatórios",
        description: "Nome e telefone são obrigatórios",
        variant: "destructive",
      });
      return;
    }

    try {
      const clientData: Omit<Client, "id" | "barbershopId" | "totalVisits" | "totalSpent" | "createdAt" | "updatedAt"> = {
        name: formName,
        email: formEmail || undefined,
        phone: formPhone,
        dateOfBirth: formDateOfBirth,
        preferences: {
          notes: formNotes || undefined,
        },
      };

      if (selectedClient) {
        await barbershopService.updateClient(user.barbershopId, selectedClient.id, clientData);
        toast({
          title: "Sucesso",
          description: "Cliente atualizado com sucesso!",
        });
      } else {
        await barbershopService.createClient(user.barbershopId, clientData);
        toast({
          title: "Sucesso",
          description: "Cliente criado com sucesso!",
        });
      }

      handleCloseDialog();
      loadClients();
    } catch (error: any) {
      toast({
        title: "Erro",
        description: error.message || "Não foi possível salvar o cliente",
        variant: "destructive",
      });
    }
  };

  const handleDelete = async (client: Client) => {
    if (!user?.barbershopId) return;
    
    if (!confirm(`Tem certeza que deseja excluir o cliente ${client.name}?`)) {
      return;
    }

    try {
      // Aqui você implementaria a exclusão quando criar o método no serviço
      toast({
        title: "Aviso",
        description: "Funcionalidade de exclusão será implementada em breve",
      });
    } catch (error: any) {
      toast({
        title: "Erro",
        description: error.message || "Não foi possível excluir o cliente",
        variant: "destructive",
      });
    }
  };

  const filteredClients = clients.filter(client =>
    client.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    client.phone.includes(searchTerm) ||
    (client.email && client.email.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-foreground mx-auto mb-4"></div>
          <p className="text-muted-foreground">Carregando clientes...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold uppercase">Clientes</h1>
          <p className="text-muted-foreground mt-2">Gerencie todos os clientes da sua barbearia</p>
        </div>
        <Button onClick={() => handleOpenDialog()} className="border-2 border-foreground">
          <Plus className="mr-2 h-4 w-4" />
          Novo Cliente
        </Button>
      </div>

      {/* Busca */}
      <Card className="p-4 border-2 border-border">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Buscar por nome, telefone ou email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 border-2"
          />
        </div>
      </Card>

      {/* Tabela de Clientes */}
      <Card className="border-2 border-border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="font-bold">Nome</TableHead>
              <TableHead className="font-bold">Contato</TableHead>
              <TableHead className="font-bold">Visitas</TableHead>
              <TableHead className="font-bold">Total Gasto</TableHead>
              <TableHead className="font-bold">Última Visita</TableHead>
              <TableHead className="font-bold text-right">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredClients.map((client) => (
              <TableRow key={client.id}>
                <TableCell className="font-medium">{client.name}</TableCell>
                <TableCell>
                  <div className="space-y-1">
                    {client.phone && (
                      <div className="flex items-center gap-2 text-sm">
                        <Phone className="h-3 w-3" />
                        {client.phone}
                      </div>
                    )}
                    {client.email && (
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Mail className="h-3 w-3" />
                        {client.email}
                      </div>
                    )}
                  </div>
                </TableCell>
                <TableCell>{client.totalVisits}</TableCell>
                <TableCell>R$ {client.totalSpent.toFixed(2)}</TableCell>
                <TableCell>
                  {client.lastVisit ? (
                    <div className="flex items-center gap-2 text-sm">
                      <Calendar className="h-3 w-3" />
                      {format(new Date(client.lastVisit), "dd/MM/yyyy", { locale: ptBR })}
                    </div>
                  ) : (
                    <span className="text-muted-foreground">Nunca</span>
                  )}
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-2">
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => handleOpenDialog(client)}
                      className="border-2"
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => handleDelete(client)}
                      className="border-2 border-red-500 text-red-600"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>

        {filteredClients.length === 0 && (
          <div className="p-12 text-center">
            <p className="text-muted-foreground text-lg">
              {searchTerm ? "Nenhum cliente encontrado" : "Nenhum cliente cadastrado"}
            </p>
            {!searchTerm && (
              <Button
                onClick={() => handleOpenDialog()}
                className="mt-4 border-2 border-foreground"
              >
                <Plus className="mr-2 h-4 w-4" />
                Cadastrar Primeiro Cliente
              </Button>
            )}
          </div>
        )}
      </Card>

      {/* Dialog de Criar/Editar */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-md border-4 border-foreground">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold uppercase">
              {selectedClient ? "Editar Cliente" : "Novo Cliente"}
            </DialogTitle>
            <DialogDescription>
              Preencha os dados do cliente
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="name">Nome Completo *</Label>
              <Input
                id="name"
                value={formName}
                onChange={(e) => setFormName(e.target.value)}
                placeholder="Nome do cliente"
                className="border-2"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="phone">Telefone *</Label>
              <Input
                id="phone"
                value={formPhone}
                onChange={(e) => setFormPhone(e.target.value)}
                placeholder="(00) 00000-0000"
                className="border-2"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={formEmail}
                onChange={(e) => setFormEmail(e.target.value)}
                placeholder="email@exemplo.com"
                className="border-2"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="dateOfBirth">Data de Nascimento</Label>
              <Input
                id="dateOfBirth"
                type="date"
                value={formDateOfBirth ? format(formDateOfBirth, "yyyy-MM-dd") : ""}
                onChange={(e) => setFormDateOfBirth(e.target.value ? new Date(e.target.value) : undefined)}
                className="border-2"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="notes">Observações</Label>
              <Input
                id="notes"
                value={formNotes}
                onChange={(e) => setFormNotes(e.target.value)}
                placeholder="Observações sobre o cliente..."
                className="border-2"
              />
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
              {selectedClient ? "Atualizar" : "Criar"} Cliente
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Clients;

