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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Plus, Edit, Trash2, Scissors, Clock, DollarSign } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { barbershopService } from "@/services/barbershopService";
import { Service } from "@/types";
import { useToast } from "@/hooks/use-toast";

const Services = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedService, setSelectedService] = useState<Service | null>(null);
  
  // Form states
  const [formName, setFormName] = useState("");
  const [formDescription, setFormDescription] = useState("");
  const [formDuration, setFormDuration] = useState("");
  const [formPrice, setFormPrice] = useState("");
  const [formCategory, setFormCategory] = useState("");

  useEffect(() => {
    loadServices();
  }, [user]);

  const loadServices = async () => {
    if (!user?.barbershopId) return;
    
    try {
      setLoading(true);
      const servicesList = await barbershopService.getServices(user.barbershopId);
      setServices(servicesList);
    } catch (error) {
      console.error("Erro ao carregar serviços:", error);
      toast({
        title: "Erro",
        description: "Não foi possível carregar os serviços",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleOpenDialog = (service?: Service) => {
    if (service) {
      setSelectedService(service);
      setFormName(service.name);
      setFormDescription(service.description || "");
      setFormDuration(service.duration.toString());
      setFormPrice(service.price.toString());
      setFormCategory(service.category || "");
    } else {
      setSelectedService(null);
      resetForm();
    }
    setIsDialogOpen(true);
  };

  const resetForm = () => {
    setFormName("");
    setFormDescription("");
    setFormDuration("30");
    setFormPrice("");
    setFormCategory("");
  };

  const handleCloseDialog = () => {
    setIsDialogOpen(false);
    setSelectedService(null);
    resetForm();
  };

  const handleSave = async () => {
    if (!user?.barbershopId || !formName || !formDuration || !formPrice) {
      toast({
        title: "Campos obrigatórios",
        description: "Nome, duração e preço são obrigatórios",
        variant: "destructive",
      });
      return;
    }

    try {
      const serviceData: Omit<Service, "id" | "barbershopId" | "createdAt" | "updatedAt"> = {
        name: formName,
        description: formDescription || undefined,
        duration: parseInt(formDuration),
        price: parseFloat(formPrice),
        category: formCategory || undefined,
        isActive: true,
      };

      if (selectedService) {
        await barbershopService.updateService(user.barbershopId, selectedService.id, serviceData);
        toast({
          title: "Sucesso",
          description: "Serviço atualizado com sucesso!",
        });
      } else {
        await barbershopService.createService(user.barbershopId, serviceData);
        toast({
          title: "Sucesso",
          description: "Serviço criado com sucesso!",
        });
      }

      handleCloseDialog();
      loadServices();
    } catch (error: any) {
      toast({
        title: "Erro",
        description: error.message || "Não foi possível salvar o serviço",
        variant: "destructive",
      });
    }
  };

  const categories = ["Corte", "Barba", "Completo", "Tratamento", "Outros"];

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-foreground mx-auto mb-4"></div>
          <p className="text-muted-foreground">Carregando serviços...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold uppercase">Serviços</h1>
          <p className="text-muted-foreground mt-2">Gerencie os serviços oferecidos</p>
        </div>
        <Button onClick={() => handleOpenDialog()} className="border-2 border-foreground">
          <Plus className="mr-2 h-4 w-4" />
          Novo Serviço
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {services.map((service) => (
          <Card key={service.id} className="p-6 border-2 border-border hover:border-foreground transition-all">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="p-3 border-2 border-foreground bg-background rounded-full">
                  <Scissors className="h-6 w-6" />
                </div>
                <div>
                  <h3 className="text-xl font-bold">{service.name}</h3>
                  {service.category && (
                    <p className="text-sm text-muted-foreground">{service.category}</p>
                  )}
                </div>
              </div>
              <Button
                variant="outline"
                size="icon"
                onClick={() => handleOpenDialog(service)}
                className="border-2"
              >
                <Edit className="h-4 w-4" />
              </Button>
            </div>

            {service.description && (
              <p className="text-sm text-muted-foreground mb-4">{service.description}</p>
            )}

            <div className="flex items-center justify-between pt-4 border-t-2 border-border">
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2 text-sm">
                  <Clock className="h-4 w-4" />
                  <span>{service.duration} min</span>
                </div>
                <div className="flex items-center gap-2 text-sm font-bold">
                  <DollarSign className="h-4 w-4" />
                  <span className="text-lg">R$ {service.price.toFixed(2)}</span>
                </div>
              </div>
            </div>
          </Card>
        ))}

        {services.length === 0 && (
          <Card className="col-span-full p-12 text-center border-2 border-border">
            <p className="text-muted-foreground text-lg mb-4">Nenhum serviço cadastrado</p>
            <Button
              onClick={() => handleOpenDialog()}
              className="border-2 border-foreground"
            >
              <Plus className="mr-2 h-4 w-4" />
              Cadastrar Primeiro Serviço
            </Button>
          </Card>
        )}
      </div>

      {/* Dialog de Criar/Editar */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-md border-4 border-foreground">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold uppercase">
              {selectedService ? "Editar Serviço" : "Novo Serviço"}
            </DialogTitle>
            <DialogDescription>
              Preencha os dados do serviço
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="name">Nome do Serviço *</Label>
              <Input
                id="name"
                value={formName}
                onChange={(e) => setFormName(e.target.value)}
                placeholder="Ex: Corte + Barba"
                className="border-2"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="category">Categoria</Label>
              <Select value={formCategory} onValueChange={setFormCategory}>
                <SelectTrigger className="border-2">
                  <SelectValue placeholder="Selecione a categoria" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">Sem categoria</SelectItem>
                  {categories.map((cat) => (
                    <SelectItem key={cat} value={cat}>
                      {cat}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="duration">Duração (minutos) *</Label>
                <Input
                  id="duration"
                  type="number"
                  value={formDuration}
                  onChange={(e) => setFormDuration(e.target.value)}
                  placeholder="30"
                  className="border-2"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="price">Preço (R$) *</Label>
                <Input
                  id="price"
                  type="number"
                  step="0.01"
                  value={formPrice}
                  onChange={(e) => setFormPrice(e.target.value)}
                  placeholder="0.00"
                  className="border-2"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Descrição</Label>
              <Input
                id="description"
                value={formDescription}
                onChange={(e) => setFormDescription(e.target.value)}
                placeholder="Descrição do serviço..."
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
              {selectedService ? "Atualizar" : "Criar"} Serviço
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Services;

