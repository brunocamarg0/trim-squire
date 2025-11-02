import { ReactNode } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import {
  Calendar,
  Users,
  Scissors,
  DollarSign,
  Settings,
  LogOut,
  LayoutDashboard,
  BarChart3,
  Menu,
  X
} from "lucide-react";
import { BarberLogo } from "@/components/BarberLogo";
import { useState } from "react";

interface LayoutProps {
  children: ReactNode;
}

const navigationItems = [
  { path: "/dashboard", icon: LayoutDashboard, label: "Dashboard" },
  { path: "/appointments", icon: Calendar, label: "Agendamentos" },
  { path: "/clients", icon: Users, label: "Clientes" },
  { path: "/barbers", icon: Scissors, label: "Barbeiros" },
  { path: "/services", icon: Scissors, label: "Serviços" },
  { path: "/financial", icon: DollarSign, label: "Financeiro" },
  { path: "/reports", icon: BarChart3, label: "Relatórios" },
  { path: "/settings", icon: Settings, label: "Configurações" },
];

export const Layout = ({ children }: LayoutProps) => {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleLogout = async () => {
    await signOut();
    navigate("/");
  };

  return (
    <div className="min-h-screen bg-gradient-dark flex">
      {/* Sidebar - Desktop */}
      <aside className="hidden md:flex md:w-64 md:flex-col md:fixed md:inset-y-0 border-r-2 border-border bg-background">
        <div className="flex flex-col flex-grow pt-5 overflow-y-auto">
          <div className="flex items-center flex-shrink-0 px-4 mb-8">
            <BarberLogo size="sm" showText={true} />
          </div>
          
          <nav className="flex-1 px-4 space-y-2">
            {navigationItems.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`
                    flex items-center gap-3 px-4 py-3 rounded-lg transition-all font-medium
                    ${isActive 
                      ? 'bg-foreground text-background border-2 border-foreground' 
                      : 'border-2 border-border hover:border-foreground hover:bg-muted'
                    }
                  `}
                >
                  <Icon className="h-5 w-5" />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </nav>

          <div className="p-4 border-t-2 border-border">
            <div className="mb-4 px-4 py-2 bg-muted rounded-lg">
              <p className="text-sm font-bold">{user?.name || "Usuário"}</p>
              <p className="text-xs text-muted-foreground">{user?.email}</p>
            </div>
            <Button
              variant="outline"
              className="w-full justify-start border-2 border-border"
              onClick={handleLogout}
            >
              <LogOut className="mr-2 h-4 w-4" />
              Sair
            </Button>
          </div>
        </div>
      </aside>

      {/* Mobile Sidebar */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-50 md:hidden">
          <div className="fixed inset-0 bg-black/50" onClick={() => setSidebarOpen(false)} />
          <aside className="fixed left-0 top-0 bottom-0 w-64 bg-background border-r-2 border-border z-50 overflow-y-auto">
            <div className="flex items-center justify-between p-4 border-b-2 border-border">
              <BarberLogo size="sm" showText={true} />
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setSidebarOpen(false)}
              >
                <X className="h-5 w-5" />
              </Button>
            </div>
            
            <nav className="p-4 space-y-2">
              {navigationItems.map((item) => {
                const Icon = item.icon;
                const isActive = location.pathname === item.path;
                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    onClick={() => setSidebarOpen(false)}
                    className={`
                      flex items-center gap-3 px-4 py-3 rounded-lg transition-all font-medium
                      ${isActive 
                        ? 'bg-foreground text-background border-2 border-foreground' 
                        : 'border-2 border-border hover:border-foreground'
                      }
                    `}
                  >
                    <Icon className="h-5 w-5" />
                    <span>{item.label}</span>
                  </Link>
                );
              })}
            </nav>

            <div className="p-4 border-t-2 border-border">
              <Button
                variant="outline"
                className="w-full justify-start border-2 border-border"
                onClick={handleLogout}
              >
                <LogOut className="mr-2 h-4 w-4" />
                Sair
              </Button>
            </div>
          </aside>
        </div>
      )}

      {/* Main Content */}
      <div className="flex-1 md:ml-64">
        {/* Mobile Header */}
        <header className="md:hidden sticky top-0 z-40 bg-background border-b-2 border-border p-4 flex items-center justify-between">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setSidebarOpen(true)}
          >
            <Menu className="h-5 w-5" />
          </Button>
          <BarberLogo size="sm" showText={true} />
          <div className="w-10" />
        </header>

        {/* Page Content */}
        <main className="p-4 md:p-6">
          {children}
        </main>
      </div>
    </div>
  );
};

