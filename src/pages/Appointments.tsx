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
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { CalendarIcon, Plus, Edit, Trash2, Check, X, Clock, User } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { appointmentService } from "@/services/appointmentService";
import { barbershopService } from "@/services/barbershopService";
import { Appointment, Barber, Client, Service } from "@/types";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";

const Appointments = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [searchParams, setSearchParams] = useSearchParams();
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [barbers, setBarbers] = useState<Barber[]>([]);
  const [clients, setClients] = useState<Client[]>([]);
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date>();
  const [selectedAppointment, setSelectedAppointment] = useState<Appointment | null>(null);
  
  // Form states
  const [formDate, setFormDate] = useState<Date>();
  const [formStartTime, setFormStartTime] = useState("");
  const [formBarberId, setFormBarberId] = useState("");
  const [formClientId, setFormClientId] = useState("");
  const [formServiceIds, setFormServiceIds] = useState<string[]>([]);
  const [formNotes, setFormNotes] = useState("");

  useEffect(() => {
    if (searchParams.get("action") === "new") {
      setIsDialogOpen(true);
      setSearchParams({});
    }
  }, [searchParams, setSearchParams]);

  useEffect(() => {
    loadData();
  }, [user]);

  const loadData = async () => {
    if (!user?.barbershopId) return;
    
    try {
      setLoading(true);
      const [appts, barbersList, clientsList, servicesList] = await Promise.all([
        appointmentService.getAppointments(user.barbershopId),
        barbershopService.getBarbers(user.barbershopId),
        barbershopService.getClients(user.barbershopId),
        barbershopService.getServices(user.barbershopId),
      ]);
      
      setAppointments(appts);
      setBarbers(barbersList);
      setClients(clientsList);
      setServices(servicesList);
    } catch (error) {
      console.error("Erro ao carregar dados:", error);
      toast({
        title: "Erro",
        description: "Não foi possível carregar os dados",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleOpenDialog = (appointment?: Appointment) => {
    if (appointment) {
      setSelectedAppointment(appointment);
      setFormDate(new Date(appointment.date));
      setFormStartTime(appointment.startTime);
      setFormBarberId(appointment.barberId);
      setFormClientId(appointment.clientId);
      setFormServiceIds(appointment.serviceIds);
      setFormNotes(appointment.notes || "");
    } else {
      setSelectedAppointment(null);
      setFormDate(undefined);
      setFormStartTime("");
      setFormBarberId("");
      setFormClientId("");
      setFormServiceIds([]);
      setFormNotes("");
    }
    setIsDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setIsDialogOpen(false);
    setSelectedAppointment(null);
    resetForm();
  };

  const resetForm = () => {
    setFormDate(undefined);
    setFormStartTime("");
    setFormBarberId("");
    setFormClientId("");
    setFormServiceIds([]);
    setFormNotes("");
  };

  const calculateDuration = (serviceIds: string[]): number => {
    return serviceIds.reduce((total, serviceId) => {
      const service = services.find(s => s.id === serviceId);
      return total + (service?.duration || 30);
    }, 0);
  };

  const calculateTotal = (serviceIds: string[]): number => {
    return serviceIds.reduce((total, serviceId) => {
      const service = services.find(s => s.id === serviceId);
      return total + (service?.price || 0);
    }, 0);
  };

  const getEndTime = (startTime: string, duration: number): string => {
    const [hours, minutes] = startTime.split(":").map(Number);
    const start = new Date();
    start.setHours(hours, minutes, 0);
    start.setMinutes(start.getMinutes() + duration);
    return `${start.getHours().toString().padStart(2, "0")}:${start.getMinutes().toString().padStart(2, "0")}`;
  };

  const handleSave = async () => {
    if (!user?.barbershopId || !formDate || !formStartTime || !formBarberId || !formClientId || formServiceIds.length === 0) {
      toast({
        title: "Campos obrigatórios",
        description: "Preencha todos os campos obrigatórios",
        variant: "destructive",
      });
      return;
    }

    try {
      const duration = calculateDuration(formServiceIds);
      const totalPrice = calculateTotal(formServiceIds);
      const endTime = getEndTime(formStartTime, duration);

      const appointmentData: Omit<Appointment, "id" | "createdAt" | "updatedAt"> = {
        barbershopId: user.barbershopId,
        barberId: formBarberId,
        clientId: formClientId,
        serviceIds: formServiceIds,
        date: formDate,
        startTime: formStartTime,
        endTime,
        duration,
        totalPrice,
        status: "scheduled",
        paymentStatus: "pending",
        notes: formNotes,
      };

      if (selectedAppointment) {
        await appointmentService.updateAppointment(
          user.barbershopId,
          selectedAppointment.id,
          appointmentData
        );
        toast({
          title: "Sucesso",
          description: "Agendamento atualizado com sucesso!",
        });
      } else {
        await appointmentService.createAppointment(appointmentData);
        toast({
          title: "Sucesso",
          description: "Agendamento criado com sucesso!",
        });
      }

      handleCloseDialog();
      loadData();
    } catch (error: any) {
      toast({
        title: "Erro",
        description: error.message || "Não foi possível salvar o agendamento",
        variant: "destructive",
      });
    }
  };

  const handleComplete = async (appointment: Appointment) => {
    if (!user?.barbershopId) return;
    
    try {
      await appointmentService.completeAppointment(user.barbershopId, appointment.id);
      
      // Criar transação de receita
      const { financialService } = await import("@/services/financialService");
      await financialService.createTransaction({
        barbershopId: user.barbershopId,
        type: "revenue",
        category: "Serviços",
        description: `Agendamento ${appointment.id}`,
        amount: appointment.totalPrice,
        date: new Date(),
        appointmentId: appointment.id,
        createdBy: user.id,
      });

      toast({
        title: "Sucesso",
        description: "Agendamento concluído e receita registrada!",
      });
      loadData();
    } catch (error: any) {
      toast({
        title: "Erro",
        description: error.message || "Não foi possível concluir o agendamento",
        variant: "destructive",
      });
    }
  };

  const handleCancel = async (appointment: Appointment) => {
    if (!user?.barbershopId) return;
    
    try {
      await appointmentService.cancelAppointment(user.barbershopId, appointment.id);
      toast({
        title: "Sucesso",
        description: "Agendamento cancelado!",
      });
      loadData();
    } catch (error: any) {
      toast({
        title: "Erro",
        description: error.message || "Não foi possível cancelar o agendamento",
        variant: "destructive",
      });
    }
  };

  const getStatusColor = (status: Appointment["status"]) => {
    switch (status) {
      case "scheduled":
        return "bg-blue-500/20 text-blue-600 border-blue-500";
      case "confirmed":
        return "bg-green-500/20 text-green-600 border-green-500";
      case "completed":
        return "bg-gray-500/20 text-gray-600 border-gray-500";
      case "cancelled":
        return "bg-red-500/20 text-red-600 border-red-500";
      default:
        return "bg-yellow-500/20 text-yellow-600 border-yellow-500";
    }
  };

  const getClientName = (clientId: string) => {
    const client = clients.find(c => c.id === clientId);
    return client?.name || clientId;
  };

  const getBarberName = (barberId: string) => {
    const barber = barbers.find(b => b.id === barberId);
    return barber?.name || barberId;
  };

  const getServicesNames = (serviceIds: string[]) => {
    return serviceIds.map(id => {
      const service = services.find(s => s.id === id);
      return service?.name || id;
    }).join(", ");
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-foreground mx-auto mb-4"></div>
          <p className="text-muted-foreground">Carregando agendamentos...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold uppercase">Agendamentos</h1>
          <p className="text-muted-foreground mt-2">Gerencie todos os agendamentos da sua barbearia</p>
        </div>
        <Button onClick={() => handleOpenDialog()} className="border-2 border-foreground">
          <Plus className="mr-2 h-4 w-4" />
          Novo Agendamento
        </Button>
      </div>

      {/* Filtros */}
      <Card className="p-4 border-2 border-border">
        <div className="flex flex-wrap gap-4">
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className={cn(
                  "w-[280px] justify-start text-left font-normal border-2",
                  !selectedDate && "text-muted-foreground"
                )}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {selectedDate ? format(selectedDate, "PPP", { locale: ptBR }) : "Filtrar por data"}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0">
              <Calendar
                mode="single"
                selected={selectedDate}
                onSelect={setSelectedDate}
                initialFocus
              />
            </PopoverContent>
          </Popover>
          
          {selectedDate && (
            <Button
              variant="outline"
              onClick={() => setSelectedDate(undefined)}
              className="border-2"
            >
              Limpar filtro
            </Button>
          )}
        </div>
      </Card>

      {/* Lista de Agendamentos */}
      <div className="grid gap-4">
        {appointments
          .filter(apt => !selectedDate || format(new Date(apt.date), "yyyy-MM-dd") === format(selectedDate, "yyyy-MM-dd"))
          .sort((a, b) => {
            const dateA = new Date(a.date);
            const dateB = new Date(b.date);
            if (dateA.getTime() !== dateB.getTime()) {
              return dateA.getTime() - dateB.getTime();
            }
            return a.startTime.localeCompare(b.startTime);
          })
          .map((appointment) => (
            <Card key={appointment.id} className="p-6 border-2 border-border hover:border-foreground transition-all">
              <div className="flex justify-between items-start">
                <div className="flex gap-6 flex-1">
                  <div className="flex flex-col items-center justify-center min-w-[80px]">
                    <div className="text-2xl font-bold">
                      {format(new Date(appointment.date), "dd", { locale: ptBR })}
                    </div>
                    <div className="text-sm text-muted-foreground uppercase">
                      {format(new Date(appointment.date), "MMM", { locale: ptBR })}
                    </div>
                  </div>
                  
                  <div className="flex-1">
                    <div className="flex items-center gap-4 mb-2">
                      <h3 className="text-xl font-bold">{getClientName(appointment.clientId)}</h3>
                      <span className={cn("px-3 py-1 rounded-full text-xs font-bold border-2 uppercase", getStatusColor(appointment.status))}>
                        {appointment.status === "scheduled" ? "Agendado" :
                         appointment.status === "confirmed" ? "Confirmado" :
                         appointment.status === "completed" ? "Concluído" :
                         appointment.status === "cancelled" ? "Cancelado" : appointment.status}
                      </span>
                    </div>
                    
                    <div className="space-y-2 text-sm text-muted-foreground">
                      <div className="flex items-center gap-2">
                        <Clock className="h-4 w-4" />
                        <span>{appointment.startTime} - {appointment.endTime}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <User className="h-4 w-4" />
                        <span>Barbeiro: {getBarberName(appointment.barberId)}</span>
                      </div>
                      <div>
                        <strong>Serviços:</strong> {getServicesNames(appointment.serviceIds)}
                      </div>
                      {appointment.notes && (
                        <div>
                          <strong>Observações:</strong> {appointment.notes}
                        </div>
                      )}
                    </div>
                  </div>
                  
                  <div className="text-right">
                    <div className="text-2xl font-bold mb-2">R$ {appointment.totalPrice.toFixed(2)}</div>
                    <div className="text-xs text-muted-foreground mb-4">
                      {appointment.paymentStatus === "paid" ? "✅ Pago" : "⏳ Pendente"}
                    </div>
                  </div>
                </div>

                <div className="flex gap-2 ml-4">
                  {appointment.status !== "completed" && appointment.status !== "cancelled" && (
                    <>
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => handleOpenDialog(appointment)}
                        className="border-2"
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => handleComplete(appointment)}
                        className="border-2 border-green-500 text-green-600"
                      >
                        <Check className="h-4 w-4" />
                      </Button>
                    </>
                  )}
                  {appointment.status !== "cancelled" && (
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => handleCancel(appointment)}
                      className="border-2 border-red-500 text-red-600"
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              </div>
            </Card>
          ))}
        
        {appointments.length === 0 && (
          <Card className="p-12 text-center border-2 border-border">
            <p className="text-muted-foreground text-lg">Nenhum agendamento encontrado</p>
            <Button
              onClick={() => handleOpenDialog()}
              className="mt-4 border-2 border-foreground"
            >
              <Plus className="mr-2 h-4 w-4" />
              Criar Primeiro Agendamento
            </Button>
          </Card>
        )}
      </div>

      {/* Dialog de Criar/Editar */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto border-4 border-foreground">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold uppercase">
              {selectedAppointment ? "Editar Agendamento" : "Novo Agendamento"}
            </DialogTitle>
            <DialogDescription>
              Preencha os dados do agendamento
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="date">Data *</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        "w-full justify-start text-left font-normal border-2",
                        !formDate && "text-muted-foreground"
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {formDate ? format(formDate, "PPP", { locale: ptBR }) : "Selecione a data"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar
                      mode="single"
                      selected={formDate}
                      onSelect={setFormDate}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>

              <div className="space-y-2">
                <Label htmlFor="time">Horário de Início *</Label>
                <Input
                  id="time"
                  type="time"
                  value={formStartTime}
                  onChange={(e) => setFormStartTime(e.target.value)}
                  className="border-2"
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="barber">Barbeiro *</Label>
                <Select value={formBarberId} onValueChange={setFormBarberId}>
                  <SelectTrigger className="border-2">
                    <SelectValue placeholder="Selecione o barbeiro" />
                  </SelectTrigger>
                  <SelectContent>
                    {barbers.map((barber) => (
                      <SelectItem key={barber.id} value={barber.id}>
                        {barber.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="client">Cliente *</Label>
                <Select value={formClientId} onValueChange={setFormClientId}>
                  <SelectTrigger className="border-2">
                    <SelectValue placeholder="Selecione o cliente" />
                  </SelectTrigger>
                  <SelectContent>
                    {clients.map((client) => (
                      <SelectItem key={client.id} value={client.id}>
                        {client.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label>Serviços *</Label>
              <div className="grid grid-cols-2 gap-2 border-2 border-border p-4 rounded-lg">
                {services.map((service) => (
                  <label key={service.id} className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formServiceIds.includes(service.id)}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setFormServiceIds([...formServiceIds, service.id]);
                        } else {
                          setFormServiceIds(formServiceIds.filter(id => id !== service.id));
                        }
                      }}
                      className="w-4 h-4"
                    />
                    <span className="text-sm">
                      {service.name} - R$ {service.price.toFixed(2)} ({service.duration}min)
                    </span>
                  </label>
                ))}
              </div>
              {formServiceIds.length > 0 && (
                <div className="mt-2 p-3 bg-muted rounded-lg border-2 border-border">
                  <div className="flex justify-between text-sm">
                    <span>Duração total:</span>
                    <span className="font-bold">{calculateDuration(formServiceIds)} minutos</span>
                  </div>
                  <div className="flex justify-between text-sm mt-1">
                    <span>Valor total:</span>
                    <span className="font-bold text-lg">R$ {calculateTotal(formServiceIds).toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-sm mt-1">
                    <span>Horário de término:</span>
                    <span className="font-bold">
                      {formStartTime ? getEndTime(formStartTime, calculateDuration(formServiceIds)) : "-"}
                    </span>
                  </div>
                </div>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="notes">Observações</Label>
              <Input
                id="notes"
                value={formNotes}
                onChange={(e) => setFormNotes(e.target.value)}
                placeholder="Observações adicionais..."
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
              {selectedAppointment ? "Atualizar" : "Criar"} Agendamento
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Appointments;

