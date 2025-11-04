// User Types
export interface User {
  id: string;
  email: string;
  name: string;
  role: 'owner' | 'barber' | 'client';
  barbershopId?: string; // Para barbeiros e donos
  createdAt: Date;
  updatedAt: Date;
}

// Barbershop Types
export interface Barbershop {
  id: string;
  name: string;
  ownerId: string;
  address?: {
    street: string;
    city: string;
    state: string;
    zipCode: string;
    complement?: string;
  };
  phone?: string;
  email?: string;
  operatingHours?: {
    [key: string]: {
      open: string;
      close: string;
      isOpen: boolean;
    };
  };
  settings?: {
    bookingAdvanceDays: number;
    bookingDuration: number; // em minutos
    allowOnlineBooking: boolean;
    sendEmailNotifications: boolean;
    sendSMSNotifications: boolean;
  };
  subscription?: {
    plan: 'free' | 'monthly' | 'annual';
    startDate: Date;
    endDate?: Date;
    status: 'active' | 'expired' | 'cancelled';
  };
  createdAt: Date;
  updatedAt: Date;
}

// Barber Types
export interface Barber {
  id: string;
  barbershopId: string;
  name: string;
  email?: string;
  phone?: string;
  specialties?: string[];
  commissionRate?: number; // porcentagem
  weeklySchedule?: {
    [key: string]: {
      start: string;
      end: string;
      breaks?: Array<{ start: string; end: string }>;
    };
  };
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

// Client Types
export interface Client {
  id: string;
  barbershopId: string;
  name: string;
  email?: string;
  phone: string;
  dateOfBirth?: Date;
  preferences?: {
    preferredBarber?: string;
    preferredServices?: string[];
    notes?: string;
  };
  lastVisit?: Date;
  totalVisits: number;
  totalSpent: number;
  createdAt: Date;
  updatedAt: Date;
}

// Service Types
export interface Service {
  id: string;
  barbershopId: string;
  name: string;
  description?: string;
  duration: number; // em minutos
  price: number;
  category?: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

// Appointment Types
export interface Appointment {
  id: string;
  barbershopId: string;
  barberId: string;
  clientId: string;
  serviceIds: string[];
  date: Date;
  startTime: string;
  endTime: string;
  duration: number; // em minutos
  totalPrice: number;
  status: 'scheduled' | 'confirmed' | 'completed' | 'cancelled' | 'no_show';
  notes?: string;
  paymentStatus: 'pending' | 'paid' | 'refunded';
  paymentMethod?: 'cash' | 'card' | 'pix';
  createdAt: Date;
  updatedAt: Date;
}

// Financial Types
export interface Transaction {
  id: string;
  barbershopId: string;
  type: 'revenue' | 'expense';
  category: string;
  description: string;
  amount: number;
  date: Date;
  appointmentId?: string;
  receipt?: string; // URL do comprovante
  createdAt: Date;
  createdBy: string;
}

// Dashboard Stats
export interface DashboardStats {
  todayAppointments: number;
  todayRevenue: number;
  monthlyAppointments: number;
  monthlyRevenue: number;
  activeBarbers: number;
  activeClients: number;
  upcomingAppointments: Appointment[];
  recentTransactions: Transaction[];
}

// Chat Types

// Chat Types
export interface Message {
  id: string;
  chatId: string;
  senderId: string;
  senderRole: 'client' | 'barber' | 'owner' | 'ai';
  senderName: string;
  content: string;
  type: 'text' | 'appointment_request' | 'appointment_confirmed' | 'system';
  appointmentData?: {
    date: Date;
    time: string;
    serviceIds: string[];
    barberId?: string;
  };
  read: boolean;
  createdAt: Date;
}

export interface Chat {
  id: string;
  barbershopId: string;
  clientId: string;
  clientName: string;
  lastMessage?: string;
  lastMessageAt?: Date;
  unreadCount: number;
  status: 'active' | 'archived';
  createdAt: Date;
  updatedAt: Date;
}
