import { useState, useEffect } from "react";
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
import { Plus, Edit, Trash2, Scissors, Mail, Phone } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { barbershopService } from "@/services/barbershopService";
import { Barber } from "@/types";
import { useToast } from "@/hooks/use-toast";

const Barbers = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [barbers, setBarbers] = useState<Barber[]>([]);
  const [loading, setLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedBarber, setSelectedBarber] = useState<Barber | null>(null);
  
  // Form states
  const [formName, setFormName] = useState("");
  const [formEmail, setFormEmail] = useState("");
  const [formPhone, setFormPhone] = useState("");
  const [formCommission, setFormCommission] = useState("");
  const [formSpecialties, setFormSpecialties] = useState("");

  useEffect(() => {
    loadBarbers();
  }, [user]);

  const loadBarbers = async () => {
    if (!user?.barbershopId) return;
    
    try {
      setLoading(true);
      const barbersList = await barbershopService.getBarbers(user.barbershopId);
      setBarbers(barbersList);
    } catch (error) {
      console.error("Erro ao carregar barbeiros:", error);
      toast({
        title: "Erro",
        description: "Não foi possível carregar os barbeiros",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleOpenDialog = (barber?: Barber) => {
    if (barber) {
      setSelectedBarber(barber);
      setFormName(barber.name);
      setFormEmail(barber.email || "");
      setFormPhone(barber.phone || "");
      setFormCommission(barber.commissionRate?.toString() || "");
      setFormSpecialties(barber.specialties?.join(", ") || "");
    } else {
      setSelectedBarber(null);
      resetForm();
    }
    setIsDialogOpen(true);
  };

  const resetForm = () => {
    setFormName("");
    setFormEmail("");
    setFormPhone("");
    setFormCommission("");
    setFormSpecialties("");
  };

  const handleCloseDialog = () => {
    setIsDialogOpen(false);
    setSelectedBarber(null);
    resetForm();
  };

  const handleSave = async () => {
    if (!user?.barbershopId || !formName) {
      toast({
        title: "Campos obrigatórios",
        description: "Nome é obrigatório",
        variant: "destructive",
      });
      return;
    }

    try {
      const barberData: Omit<Barber, "id" | "barbershopId" | "createdAt" | "updatedAt"> = {
        name: formName,
        email: formEmail || undefined,
        phone: formPhone || undefined,
        commissionRate: formCommission ? parseFloat(formCommission) : undefined,
        specialties: formSpecialties ? formSpecialties.split(",").map(s => s.trim()) : undefined,
        isActive: true,
      };

      if (selectedBarber) {
        await barbershopService.updateBarber(user.barbershopId, selectedBarber.id, barberData);
        toast({
          title: "Sucesso",
          description: "Barbeiro atualizado com sucesso!",
        });
      } else {
        await barbershopService.createBarber(user.barbershopId, barberData);
        toast({
          title: "Sucesso",
          description: "Barbeiro criado com sucesso!",
        });
      }

      handleCloseDialog();
      loadBarbers();
    } catch (error: any) {
      toast({
        title: "Erro",
        description: error.message || "Não foi possível salvar o barbeiro",
        variant: "destructive",
      });
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-foreground mx-auto mb-4"></div>
          <p className="text-muted-foreground">Carregando barbeiros...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold uppercase">Barbeiros</h1>
          <p className="text-muted-foreground mt-2">Gerencie a equipe de barbeiros</p>
        </div>
        <Button onClick={() => handleOpenDialog()} className="border-2 border-foreground">
          <Plus className="mr-2 h-4 w-4" />
          Novo Barbeiro
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {barbers.map((barber) => (
          <Card key={barber.id} className="p-6 border-2 border-border hover:border-foreground transition-all">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="p-3 border-2 border-foreground bg-background rounded-full">
                  <Scissors className="h-6 w-6" />
                </div>
                <div>
                  <h3 className="text-xl font-bold">{barber.name}</h3>
                  <p className="text-sm text-muted-foreground">
                    {barber.specialties?.join(", ") || "Sem especialidades"}
                  </p>
                </div>
              </div>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => handleOpenDialog(barber)}
                  className="border-2"
                >
                  <Edit className="h-4 w-4" />
                </Button>
              </div>
            </div>

            <div className="space-y-2 text-sm">
              {barber.phone && (
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Phone className="h-4 w-4" />
                  {barber.phone}
                </div>
              )}
              {barber.email && (
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Mail className="h-4 w-4" />
                  {barber.email}
                </div>
              )}
              {barber.commissionRate && (
                <div className="mt-3 p-2 bg-muted rounded-lg border-2 border-border">
                  <span className="font-bold">Comissão: {barber.commissionRate}%</span>
                </div>
              )}
            </div>
          </Card>
        ))}

        {barbers.length === 0 && (
          <Card className="col-span-full p-12 text-center border-2 border-border">
            <p className="text-muted-foreground text-lg mb-4">Nenhum barbeiro cadastrado</p>
            <Button
              onClick={() => handleOpenDialog()}
              className="border-2 border-foreground"
            >
              <Plus className="mr-2 h-4 w-4" />
              Cadastrar Primeiro Barbeiro
            </Button>
          </Card>
        )}
      </div>

      {/* Dialog de Criar/Editar */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-md border-4 border-foreground">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold uppercase">
              {selectedBarber ? "Editar Barbeiro" : "Novo Barbeiro"}
            </DialogTitle>
            <DialogDescription>
              Preencha os dados do barbeiro
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="name">Nome Completo *</Label>
              <Input
                id="name"
                value={formName}
                onChange={(e) => setFormName(e.target.value)}
                placeholder="Nome do barbeiro"
                className="border-2"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="phone">Telefone</Label>
              <Input
                id="phone"
                value={formPhone}
                onChange={(e) => setFormPhone(e.target.value)}
                placeholder="(00) 00000-0000"
                className="border-2"
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
              <Label htmlFor="commission">Taxa de Comissão (%)</Label>
              <Input
                id="commission"
                type="number"
                value={formCommission}
                onChange={(e) => setFormCommission(e.target.value)}
                placeholder="Ex: 30"
                className="border-2"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="specialties">Especialidades (separadas por vírgula)</Label>
              <Input
                id="specialties"
                value={formSpecialties}
                onChange={(e) => setFormSpecialties(e.target.value)}
                placeholder="Ex: Corte, Barba, Bigode"
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
              {selectedBarber ? "Atualizar" : "Criar"} Barbeiro
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Barbers;

