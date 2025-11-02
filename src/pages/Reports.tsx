import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { CalendarIcon, TrendingUp, DollarSign, Users, Clock, Download } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { dashboardService } from "@/services/dashboardService";
import { financialService } from "@/services/financialService";
import { appointmentService } from "@/services/appointmentService";
import { format, startOfMonth, endOfMonth, subMonths } from "date-fns";
import { ptBR } from "date-fns/locale";
import { cn } from "@/lib/utils";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  LineChart,
  Line,
} from "recharts";

const Reports = () => {
  const { user } = useAuth();
  const [startDate, setStartDate] = useState<Date>(startOfMonth(new Date()));
  const [endDate, setEndDate] = useState<Date>(endOfMonth(new Date()));
  const [reportType, setReportType] = useState<"daily" | "weekly" | "monthly">("monthly");
  const [loading, setLoading] = useState(true);
  const [reportData, setReportData] = useState<any>(null);

  useEffect(() => {
    loadReportData();
  }, [user, startDate, endDate, reportType]);

  const loadReportData = async () => {
    if (!user?.barbershopId) return;
    
    try {
      setLoading(true);
      const [stats, transactions, appointments] = await Promise.all([
        financialService.getFinancialStats(user.barbershopId, startDate, endDate),
        financialService.getTransactions(user.barbershopId, { startDate, endDate }),
        appointmentService.getAppointments(user.barbershopId, { startDate, endDate }),
      ]);

      // Processar dados para gráficos
      const chartData = processChartData(transactions, appointments);
      
      setReportData({
        stats,
        transactions,
        appointments,
        chartData,
      });
    } catch (error) {
      console.error("Erro ao carregar relatórios:", error);
    } finally {
      setLoading(false);
    }
  };

  const processChartData = (transactions: any[], appointments: any[]) => {
    const revenueByDate: { [key: string]: number } = {};
    const expenseByDate: { [key: string]: number } = {};
    
    transactions.forEach(t => {
      const dateKey = format(new Date(t.date), "dd/MM");
      if (t.type === "revenue") {
        revenueByDate[dateKey] = (revenueByDate[dateKey] || 0) + t.amount;
      } else {
        expenseByDate[dateKey] = (expenseByDate[dateKey] || 0) + t.amount;
      }
    });

    const allDates = new Set([...Object.keys(revenueByDate), ...Object.keys(expenseByDate)]);
    
    return Array.from(allDates).map(date => ({
      date,
      receitas: revenueByDate[date] || 0,
      despesas: expenseByDate[date] || 0,
      lucro: (revenueByDate[date] || 0) - (expenseByDate[date] || 0),
    }));
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-foreground mx-auto mb-4"></div>
          <p className="text-muted-foreground">Carregando relatórios...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold uppercase">Relatórios</h1>
          <p className="text-muted-foreground mt-2">Análises e estatísticas do seu negócio</p>
        </div>
        <Button className="border-2 border-foreground">
          <Download className="mr-2 h-4 w-4" />
          Exportar
        </Button>
      </div>

      {/* Filtros */}
      <Card className="p-4 border-2 border-border">
        <div className="flex flex-wrap gap-4 items-end">
          <div className="space-y-2">
            <Label>Período</Label>
            <Select value={reportType} onValueChange={(v) => setReportType(v as any)}>
              <SelectTrigger className="w-[150px] border-2">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="daily">Diário</SelectItem>
                <SelectItem value="weekly">Semanal</SelectItem>
                <SelectItem value="monthly">Mensal</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className={cn(
                  "w-[200px] justify-start text-left font-normal border-2",
                  !startDate && "text-muted-foreground"
                )}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {startDate ? format(startDate, "PPP", { locale: ptBR }) : "Data inicial"}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0">
              <Calendar
                mode="single"
                selected={startDate}
                onSelect={(date) => date && setStartDate(date)}
                initialFocus
              />
            </PopoverContent>
          </Popover>

          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className={cn(
                  "w-[200px] justify-start text-left font-normal border-2",
                  !endDate && "text-muted-foreground"
                )}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {endDate ? format(endDate, "PPP", { locale: ptBR }) : "Data final"}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0">
              <Calendar
                mode="single"
                selected={endDate}
                onSelect={(date) => date && setEndDate(date)}
                initialFocus
              />
            </PopoverContent>
          </Popover>

          <Button
            variant="outline"
            onClick={() => {
              setStartDate(startOfMonth(new Date()));
              setEndDate(endOfMonth(new Date()));
            }}
            className="border-2"
          >
            Este Mês
          </Button>
        </div>
      </Card>

      {/* Estatísticas Resumidas */}
      {reportData && (
        <>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <Card className="p-6 border-2 border-border">
              <div className="flex items-center gap-4">
                <DollarSign className="h-8 w-8 text-green-600" />
                <div>
                  <p className="text-sm text-muted-foreground">Receitas</p>
                  <p className="text-2xl font-bold">R$ {reportData.stats.totalRevenue.toFixed(2)}</p>
                </div>
              </div>
            </Card>

            <Card className="p-6 border-2 border-border">
              <div className="flex items-center gap-4">
                <TrendingDown className="h-8 w-8 text-red-600" />
                <div>
                  <p className="text-sm text-muted-foreground">Despesas</p>
                  <p className="text-2xl font-bold">R$ {reportData.stats.totalExpenses.toFixed(2)}</p>
                </div>
              </div>
            </Card>

            <Card className="p-6 border-2 border-border">
              <div className="flex items-center gap-4">
                <TrendingUp className="h-8 w-8" />
                <div>
                  <p className="text-sm text-muted-foreground">Lucro</p>
                  <p className={`text-2xl font-bold ${reportData.stats.profit >= 0 ? "text-green-600" : "text-red-600"}`}>
                    R$ {reportData.stats.profit.toFixed(2)}
                  </p>
                </div>
              </div>
            </Card>

            <Card className="p-6 border-2 border-border">
              <div className="flex items-center gap-4">
                <Clock className="h-8 w-8" />
                <div>
                  <p className="text-sm text-muted-foreground">Agendamentos</p>
                  <p className="text-2xl font-bold">{reportData.appointments.length}</p>
                </div>
              </div>
            </Card>
          </div>

          {/* Gráficos */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="p-6 border-2 border-border">
              <h3 className="text-xl font-bold mb-4 uppercase">Receitas vs Despesas</h3>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={reportData.chartData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="receitas" fill="#10b981" />
                  <Bar dataKey="despesas" fill="#ef4444" />
                </BarChart>
              </ResponsiveContainer>
            </Card>

            <Card className="p-6 border-2 border-border">
              <h3 className="text-xl font-bold mb-4 uppercase">Evolução do Lucro</h3>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={reportData.chartData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line type="monotone" dataKey="lucro" stroke="#3b82f6" strokeWidth={2} />
                </LineChart>
              </ResponsiveContainer>
            </Card>
          </div>
        </>
      )}
    </div>
  );
};

export default Reports;

