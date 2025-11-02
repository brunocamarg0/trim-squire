import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Settings as SettingsIcon, Building2, Clock, Bell, Save } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { barbershopService } from "@/services/barbershopService";
import { Barbershop } from "@/types";
import { useToast } from "@/hooks/use-toast";

const Settings = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [barbershop, setBarbershop] = useState<Barbershop | null>(null);
  
  // Form states - Informações Básicas
  const [formName, setFormName] = useState("");
  const [formPhone, setFormPhone] = useState("");
  const [formEmail, setFormEmail] = useState("");
  const [formStreet, setFormStreet] = useState("");
  const [formCity, setFormCity] = useState("");
  const [formState, setFormState] = useState("");
  const [formZipCode, setFormZipCode] = useState("");
  const [formComplement, setFormComplement] = useState("");

  // Form states - Configurações
  const [bookingAdvanceDays, setBookingAdvanceDays] = useState(30);
  const [bookingDuration, setBookingDuration] = useState(30);
  const [allowOnlineBooking, setAllowOnlineBooking] = useState(true);
  const [sendEmailNotifications, setSendEmailNotifications] = useState(true);
  const [sendSMSNotifications, setSendSMSNotifications] = useState(false);

  // Form states - Horários
  const [weekSchedule, setWeekSchedule] = useState<{ [key: string]: { open: string; close: string; isOpen: boolean } }>({});

  const daysOfWeek = [
    { key: "monday", label: "Segunda-feira" },
    { key: "tuesday", label: "Terça-feira" },
    { key: "wednesday", label: "Quarta-feira" },
    { key: "thursday", label: "Quinta-feira" },
    { key: "friday", label: "Sexta-feira" },
    { key: "saturday", label: "Sábado" },
    { key: "sunday", label: "Domingo" },
  ];

  useEffect(() => {
    loadBarbershop();
  }, [user]);

  const loadBarbershop = async () => {
    if (!user?.barbershopId) return;
    
    try {
      setLoading(true);
      const barbershopData = await barbershopService.getBarbershop(user.barbershopId);
      if (barbershopData) {
        setBarbershop(barbershopData);
        setFormName(barbershopData.name);
        setFormPhone(barbershopData.phone || "");
        setFormEmail(barbershopData.email || "");
        setFormStreet(barbershopData.address?.street || "");
        setFormCity(barbershopData.address?.city || "");
        setFormState(barbershopData.address?.state || "");
        setFormZipCode(barbershopData.address?.zipCode || "");
        setFormComplement(barbershopData.address?.complement || "");
        
        if (barbershopData.settings) {
          setBookingAdvanceDays(barbershopData.settings.bookingAdvanceDays || 30);
          setBookingDuration(barbershopData.settings.bookingDuration || 30);
          setAllowOnlineBooking(barbershopData.settings.allowOnlineBooking ?? true);
          setSendEmailNotifications(barbershopData.settings.sendEmailNotifications ?? true);
          setSendSMSNotifications(barbershopData.settings.sendSMSNotifications ?? false);
        }

        if (barbershopData.operatingHours) {
          setWeekSchedule(barbershopData.operatingHours);
        } else {
          // Inicializar com horário padrão
          const defaultSchedule: { [key: string]: { open: string; close: string; isOpen: boolean } } = {};
          daysOfWeek.forEach(day => {
            defaultSchedule[day.key] = {
              open: "08:00",
              close: "18:00",
              isOpen: day.key !== "sunday",
            };
          });
          setWeekSchedule(defaultSchedule);
        }
      }
    } catch (error) {
      console.error("Erro ao carregar configurações:", error);
      toast({
        title: "Erro",
        description: "Não foi possível carregar as configurações",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSaveBasic = async () => {
    if (!user?.barbershopId || !formName) {
      toast({
        title: "Campos obrigatórios",
        description: "Nome da barbearia é obrigatório",
        variant: "destructive",
      });
      return;
    }

    try {
      await barbershopService.updateBarbershop(user.barbershopId, {
        name: formName,
        phone: formPhone || undefined,
        email: formEmail || undefined,
        address: {
          street: formStreet,
          city: formCity,
          state: formState,
          zipCode: formZipCode,
          complement: formComplement || undefined,
        },
      });

      toast({
        title: "Sucesso",
        description: "Informações básicas salvas!",
      });
      loadBarbershop();
    } catch (error: any) {
      toast({
        title: "Erro",
        description: error.message || "Não foi possível salvar as configurações",
        variant: "destructive",
      });
    }
  };

  const handleSaveSettings = async () => {
    if (!user?.barbershopId) return;

    try {
      await barbershopService.updateBarbershop(user.barbershopId, {
        settings: {
          bookingAdvanceDays,
          bookingDuration,
          allowOnlineBooking,
          sendEmailNotifications,
          sendSMSNotifications,
        },
        operatingHours: weekSchedule,
      });

      toast({
        title: "Sucesso",
        description: "Configurações salvas!",
      });
      loadBarbershop();
    } catch (error: any) {
      toast({
        title: "Erro",
        description: error.message || "Não foi possível salvar as configurações",
        variant: "destructive",
      });
    }
  };

  const updateDaySchedule = (day: string, field: "open" | "close" | "isOpen", value: string | boolean) => {
    setWeekSchedule(prev => ({
      ...prev,
      [day]: {
        ...prev[day],
        [field]: value,
      },
    }));
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-foreground mx-auto mb-4"></div>
          <p className="text-muted-foreground">Carregando configurações...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold uppercase">Configurações</h1>
        <p className="text-muted-foreground mt-2">Gerencie as configurações da sua barbearia</p>
      </div>

      <Tabs defaultValue="basic" className="space-y-6">
        <TabsList className="grid w-full max-w-2xl grid-cols-3 border-2 border-border">
          <TabsTrigger value="basic" className="font-bold">Informações Básicas</TabsTrigger>
          <TabsTrigger value="settings" className="font-bold">Configurações</TabsTrigger>
          <TabsTrigger value="hours" className="font-bold">Horários</TabsTrigger>
        </TabsList>

        <TabsContent value="basic">
          <Card className="p-6 border-2 border-border">
            <div className="flex items-center gap-3 mb-6">
              <Building2 className="h-6 w-6" />
              <h2 className="text-xl font-bold uppercase">Informações Básicas</h2>
            </div>

            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Nome da Barbearia *</Label>
                <Input
                  id="name"
                  value={formName}
                  onChange={(e) => setFormName(e.target.value)}
                  className="border-2"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
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
              </div>

              <div className="space-y-2">
                <Label htmlFor="street">Endereço</Label>
                <Input
                  id="street"
                  value={formStreet}
                  onChange={(e) => setFormStreet(e.target.value)}
                  placeholder="Rua, número"
                  className="border-2"
                />
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="city">Cidade</Label>
                  <Input
                    id="city"
                    value={formCity}
                    onChange={(e) => setFormCity(e.target.value)}
                    className="border-2"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="state">Estado</Label>
                  <Input
                    id="state"
                    value={formState}
                    onChange={(e) => setFormState(e.target.value)}
                    placeholder="SP"
                    className="border-2"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="zipCode">CEP</Label>
                  <Input
                    id="zipCode"
                    value={formZipCode}
                    onChange={(e) => setFormZipCode(e.target.value)}
                    placeholder="00000-000"
                    className="border-2"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="complement">Complemento</Label>
                <Input
                  id="complement"
                  value={formComplement}
                  onChange={(e) => setFormComplement(e.target.value)}
                  className="border-2"
                />
              </div>

              <Button onClick={handleSaveBasic} className="w-full border-2 border-foreground">
                <Save className="mr-2 h-4 w-4" />
                Salvar Informações
              </Button>
            </div>
          </Card>
        </TabsContent>

        <TabsContent value="settings">
          <Card className="p-6 border-2 border-border">
            <div className="flex items-center gap-3 mb-6">
              <SettingsIcon className="h-6 w-6" />
              <h2 className="text-xl font-bold uppercase">Configurações do Sistema</h2>
            </div>

            <div className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="advanceDays">Dias de antecedência para agendamento</Label>
                <Input
                  id="advanceDays"
                  type="number"
                  value={bookingAdvanceDays}
                  onChange={(e) => setBookingAdvanceDays(parseInt(e.target.value))}
                  className="border-2"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="duration">Duração padrão dos agendamentos (minutos)</Label>
                <Input
                  id="duration"
                  type="number"
                  value={bookingDuration}
                  onChange={(e) => setBookingDuration(parseInt(e.target.value))}
                  className="border-2"
                />
              </div>

              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 border-2 border-border rounded-lg">
                  <div>
                    <Label htmlFor="onlineBooking">Permitir agendamento online</Label>
                    <p className="text-sm text-muted-foreground">
                      Clientes podem agendar pelo site
                    </p>
                  </div>
                  <Switch
                    id="onlineBooking"
                    checked={allowOnlineBooking}
                    onCheckedChange={setAllowOnlineBooking}
                  />
                </div>

                <div className="flex items-center justify-between p-4 border-2 border-border rounded-lg">
                  <div>
                    <Label htmlFor="emailNotif">Notificações por Email</Label>
                    <p className="text-sm text-muted-foreground">
                      Enviar emails de confirmação e lembretes
                    </p>
                  </div>
                  <Switch
                    id="emailNotif"
                    checked={sendEmailNotifications}
                    onCheckedChange={setSendEmailNotifications}
                  />
                </div>

                <div className="flex items-center justify-between p-4 border-2 border-border rounded-lg">
                  <div>
                    <Label htmlFor="smsNotif">Notificações por SMS</Label>
                    <p className="text-sm text-muted-foreground">
                      Enviar SMS de confirmação e lembretes
                    </p>
                  </div>
                  <Switch
                    id="smsNotif"
                    checked={sendSMSNotifications}
                    onCheckedChange={setSendSMSNotifications}
                  />
                </div>
              </div>

              <Button onClick={handleSaveSettings} className="w-full border-2 border-foreground">
                <Save className="mr-2 h-4 w-4" />
                Salvar Configurações
              </Button>
            </div>
          </Card>
        </TabsContent>

        <TabsContent value="hours">
          <Card className="p-6 border-2 border-border">
            <div className="flex items-center gap-3 mb-6">
              <Clock className="h-6 w-6" />
              <h2 className="text-xl font-bold uppercase">Horários de Funcionamento</h2>
            </div>

            <div className="space-y-4">
              {daysOfWeek.map((day) => {
                const schedule = weekSchedule[day.key] || { open: "08:00", close: "18:00", isOpen: true };
                return (
                  <div key={day.key} className="p-4 border-2 border-border rounded-lg">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <Switch
                          checked={schedule.isOpen}
                          onCheckedChange={(checked) => updateDaySchedule(day.key, "isOpen", checked)}
                        />
                        <Label className="font-bold">{day.label}</Label>
                      </div>
                    </div>

                    {schedule.isOpen && (
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label>Abertura</Label>
                          <Input
                            type="time"
                            value={schedule.open}
                            onChange={(e) => updateDaySchedule(day.key, "open", e.target.value)}
                            className="border-2"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label>Fechamento</Label>
                          <Input
                            type="time"
                            value={schedule.close}
                            onChange={(e) => updateDaySchedule(day.key, "close", e.target.value)}
                            className="border-2"
                          />
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}

              <Button onClick={handleSaveSettings} className="w-full border-2 border-foreground">
                <Save className="mr-2 h-4 w-4" />
                Salvar Horários
              </Button>
            </div>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Settings;

