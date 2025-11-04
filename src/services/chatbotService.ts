import { messageService } from './messageService';
import { appointmentService } from './appointmentService';
import { barbershopService } from './barbershopService';
import { format, parse, addDays, isAfter, addMinutes } from 'date-fns';
import { ptBR } from 'date-fns/locale';

interface ChatbotContext {
  chatId: string;
  barbershopId: string;
  clientId: string;
  clientName: string;
  conversationState: 'idle' | 'waiting_service' | 'waiting_date' | 'waiting_time' | 'waiting_barber' | 'confirming';
  appointmentData?: {
    serviceIds: string[];
    date?: Date;
    time?: string;
    barberId?: string;
  };
}

const conversationContexts = new Map<string, ChatbotContext>();

export const chatbotService = {
  async processMessage(
    chatId: string,
    barbershopId: string,
    clientId: string,
    clientName: string,
    message: string
  ): Promise<void> {
    let context = conversationContexts.get(chatId);
    if (!context) {
      context = {
        chatId,
        barbershopId,
        clientId,
        clientName,
        conversationState: 'idle',
      };
      conversationContexts.set(chatId, context);
    }

    const lowerMessage = message.toLowerCase();

    if (this.isGreeting(lowerMessage)) {
      await this.handleGreeting(context);
    } else if (this.isBookingIntent(lowerMessage)) {
      await this.handleBookingStart(context);
    } else if (this.isCancellationIntent(lowerMessage)) {
      await this.handleCancellation(context);
    } else if (context.conversationState === 'waiting_service') {
      await this.handleServiceSelection(context, message);
    } else if (context.conversationState === 'waiting_date') {
      await this.handleDateSelection(context, message);
    } else if (context.conversationState === 'waiting_time') {
      await this.handleTimeSelection(context, message);
    } else if (context.conversationState === 'waiting_barber') {
      await this.handleBarberSelection(context, message);
    } else if (context.conversationState === 'confirming') {
      await this.handleConfirmation(context, message);
    } else {
      await this.handleUnknown(context);
    }
  },

  isGreeting(message: string): boolean {
    const greetings = ['oi', 'olá', 'ola', 'bom dia', 'boa tarde', 'boa noite', 'hi', 'hello', 'e aí'];
    return greetings.some(g => message.includes(g));
  },

  isBookingIntent(message: string): boolean {
    const keywords = ['agendar', 'marcar', 'horário', 'horario', 'agendamento', 'corte', 'serviço', 'servico', 'quero'];
    return keywords.some(k => message.includes(k));
  },

  isCancellationIntent(message: string): boolean {
    const keywords = ['cancelar', 'desmarcar', 'remover agendamento'];
    return keywords.some(k => message.includes(k));
  },

  async handleGreeting(context: ChatbotContext): Promise<void> {
    await messageService.sendMessage(
      context.chatId,
      'ai',
      'ai',
      'Assistente',
      `Olá ${context.clientName}! 👋\n\nComo posso ajudar você hoje? Você pode:\n• Agendar um serviço\n• Ver seus agendamentos\n• Cancelar um agendamento\n\nO que você gostaria de fazer?`,
      'text'
    );
  },

  async handleBookingStart(context: ChatbotContext): Promise<void> {
    try {
      const services = await barbershopService.getServices(context.barbershopId);
      const activeServices = services.filter(s => s.isActive);

      if (activeServices.length === 0) {
        await messageService.sendMessage(
          context.chatId,
          'ai',
          'ai',
          'Assistente',
          'Desculpe, não há serviços disponíveis no momento. Entre em contato diretamente com a barbearia.',
          'text'
        );
        return;
      }

      context.conversationState = 'waiting_service';
      context.appointmentData = { serviceIds: [] };

      const servicesList = activeServices.map((s, i) => `${i + 1}. ${s.name} - R$ ${s.price.toFixed(2)}`).join('\n');

      await messageService.sendMessage(
        context.chatId,
        'ai',
        'ai',
        'Assistente',
        `Ótimo! Vou ajudar você a agendar. Primeiro, qual serviço você gostaria?\n\n${servicesList}\n\nPor favor, digite o número ou o nome do serviço desejado.`,
        'text'
      );

      conversationContexts.set(context.chatId, context);
    } catch (error) {
      console.error('Erro ao iniciar agendamento:', error);
      await messageService.sendMessage(
        context.chatId,
        'ai',
        'ai',
        'Assistente',
        'Desculpe, ocorreu um erro. Tente novamente mais tarde.',
        'text'
      );
    }
  },

  async handleServiceSelection(context: ChatbotContext, message: string): Promise<void> {
    try {
      const services = await barbershopService.getServices(context.barbershopId);
      const activeServices = services.filter(s => s.isActive);

      const serviceNumber = parseInt(message);
      if (!isNaN(serviceNumber) && serviceNumber > 0 && serviceNumber <= activeServices.length) {
        const selectedService = activeServices[serviceNumber - 1];
        context.appointmentData!.serviceIds = [selectedService.id];
      } else {
        const selectedService = activeServices.find(s => 
          s.name.toLowerCase().includes(message.toLowerCase())
        );
        if (selectedService) {
          context.appointmentData!.serviceIds = [selectedService.id];
        } else {
          await messageService.sendMessage(
            context.chatId,
            'ai',
            'ai',
            'Assistente',
            'Não encontrei esse serviço. Por favor, digite o número ou o nome correto do serviço.',
            'text'
          );
          return;
        }
      }

      context.conversationState = 'waiting_date';
      conversationContexts.set(context.chatId, context);

      await messageService.sendMessage(
        context.chatId,
        'ai',
        'ai',
        'Assistente',
        'Ótimo! Agora preciso saber a data. Por favor, digite a data desejada (ex: 25/12/2024 ou amanhã, ou hoje).',
        'text'
      );
    } catch (error) {
      console.error('Erro ao selecionar serviço:', error);
      await messageService.sendMessage(
        context.chatId,
        'ai',
        'ai',
        'Assistente',
        'Desculpe, ocorreu um erro. Tente novamente.',
        'text'
      );
    }
  },

  async handleDateSelection(context: ChatbotContext, message: string): Promise<void> {
    try {
      let selectedDate: Date | null = null;
      const lowerMessage = message.toLowerCase();

      if (lowerMessage.includes('hoje')) {
        selectedDate = new Date();
      } else if (lowerMessage.includes('amanhã') || lowerMessage.includes('amanha')) {
        selectedDate = addDays(new Date(), 1);
      } else {
        try {
          selectedDate = parse(message, 'dd/MM/yyyy', new Date());
        } catch {
          try {
            selectedDate = parse(message, 'd/M/yyyy', new Date());
          } catch {
            selectedDate = new Date(message);
          }
        }
      }

      if (!selectedDate || isNaN(selectedDate.getTime())) {
        await messageService.sendMessage(
          context.chatId,
          'ai',
          'ai',
          'Assistente',
          'Data inválida. Por favor, digite a data no formato DD/MM/AAAA (ex: 25/12/2024) ou use "hoje" ou "amanhã".',
          'text'
        );
        return;
      }

      const today = new Date();
      today.setHours(0, 0, 0, 0);
      selectedDate.setHours(0, 0, 0, 0);

      if (!isAfter(selectedDate, today) && selectedDate.getTime() !== today.getTime()) {
        await messageService.sendMessage(
          context.chatId,
          'ai',
          'ai',
          'Assistente',
          'A data não pode ser no passado. Por favor, escolha uma data futura.',
          'text'
        );
        return;
      }

      context.appointmentData!.date = selectedDate;
      context.conversationState = 'waiting_time';
      conversationContexts.set(context.chatId, context);

      const formattedDate = format(selectedDate, "dd 'de' MMMM", { locale: ptBR });

      await messageService.sendMessage(
        context.chatId,
        'ai',
        'ai',
        'Assistente',
        `Perfeito! Data escolhida: ${formattedDate}.\n\nAgora preciso saber o horário. Por favor, digite o horário desejado (ex: 14:30 ou 14h30).`,
        'text'
      );
    } catch (error) {
      console.error('Erro ao selecionar data:', error);
      await messageService.sendMessage(
        context.chatId,
        'ai',
        'ai',
        'Assistente',
        'Desculpe, ocorreu um erro. Tente novamente.',
        'text'
      );
    }
  },

  async handleTimeSelection(context: ChatbotContext, message: string): Promise<void> {
    try {
      let timeStr = message.replace(/[hH]/g, ':').replace(/\s/g, '');
      
      if (timeStr.length === 4 && !timeStr.includes(':')) {
        timeStr = timeStr.substring(0, 2) + ':' + timeStr.substring(2);
      }

      const timeParts = timeStr.split(':');
      if (timeParts.length !== 2) {
        await messageService.sendMessage(
          context.chatId,
          'ai',
          'ai',
          'Assistente',
          'Horário inválido. Por favor, digite no formato HH:MM (ex: 14:30).',
          'text'
        );
        return;
      }

      const hours = parseInt(timeParts[0]);
      const minutes = parseInt(timeParts[1]);

      if (isNaN(hours) || isNaN(minutes) || hours < 0 || hours > 23 || minutes < 0 || minutes > 59) {
        await messageService.sendMessage(
          context.chatId,
          'ai',
          'ai',
          'Assistente',
          'Horário inválido. Por favor, digite um horário válido (ex: 09:00, 14:30, 18:00).',
          'text'
        );
        return;
      }

      context.appointmentData!.time = `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
      
      const barbers = await barbershopService.getBarbers(context.barbershopId);
      const availableBarbers = barbers.filter(b => b.isActive);

      if (availableBarbers.length === 0) {
        await messageService.sendMessage(
          context.chatId,
          'ai',
          'ai',
          'Assistente',
          'Desculpe, não há barbeiros disponíveis no momento.',
          'text'
        );
        context.conversationState = 'idle';
        conversationContexts.set(context.chatId, context);
        return;
      }

      if (availableBarbers.length === 1) {
        context.appointmentData!.barberId = availableBarbers[0].id;
        context.conversationState = 'confirming';
        conversationContexts.set(context.chatId, context);
        await this.showConfirmation(context);
      } else {
        context.conversationState = 'waiting_barber';
        conversationContexts.set(context.chatId, context);

        const barbersList = availableBarbers.map((b, i) => `${i + 1}. ${b.name}`).join('\n');

        await messageService.sendMessage(
          context.chatId,
          'ai',
          'ai',
          'Assistente',
          `Horário escolhido: ${context.appointmentData!.time}.\n\nQual barbeiro você prefere?\n\n${barbersList}\n\nDigite o número ou o nome do barbeiro.`,
          'text'
        );
      }
    } catch (error) {
      console.error('Erro ao selecionar horário:', error);
      await messageService.sendMessage(
        context.chatId,
        'ai',
        'ai',
        'Assistente',
        'Desculpe, ocorreu um erro. Tente novamente.',
        'text'
      );
    }
  },

  async handleBarberSelection(context: ChatbotContext, message: string): Promise<void> {
    try {
      const barbers = await barbershopService.getBarbers(context.barbershopId);
      const availableBarbers = barbers.filter(b => b.isActive);

      const barberNumber = parseInt(message);
      if (!isNaN(barberNumber) && barberNumber > 0 && barberNumber <= availableBarbers.length) {
        context.appointmentData!.barberId = availableBarbers[barberNumber - 1].id;
      } else {
        const selectedBarber = availableBarbers.find(b => 
          b.name.toLowerCase().includes(message.toLowerCase())
        );
        if (selectedBarber) {
          context.appointmentData!.barberId = selectedBarber.id;
        } else {
          await messageService.sendMessage(
            context.chatId,
            'ai',
            'ai',
            'Assistente',
            'Não encontrei esse barbeiro. Por favor, digite o número ou o nome correto.',
            'text'
          );
          return;
        }
      }

      context.conversationState = 'confirming';
      conversationContexts.set(context.chatId, context);
      await this.showConfirmation(context);
    } catch (error) {
      console.error('Erro ao selecionar barbeiro:', error);
      await messageService.sendMessage(
        context.chatId,
        'ai',
        'ai',
        'Assistente',
        'Desculpe, ocorreu um erro. Tente novamente.',
        'text'
      );
    }
  },

  async showConfirmation(context: ChatbotContext): Promise<void> {
    try {
      const services = await barbershopService.getServices(context.barbershopId);
      const barbers = await barbershopService.getBarbers(context.barbershopId);
      
      const selectedServices = services.filter(s => context.appointmentData!.serviceIds.includes(s.id));
      const selectedBarber = barbers.find(b => b.id === context.appointmentData!.barberId);
      
      const totalPrice = selectedServices.reduce((sum, s) => sum + s.price, 0);
      const totalDuration = selectedServices.reduce((sum, s) => sum + s.duration, 0);
      const formattedDate = format(context.appointmentData!.date!, "dd 'de' MMMM 'de' yyyy", { locale: ptBR });

      const [hours, minutes] = context.appointmentData!.time!.split(':').map(Number);
      const startDateTime = new Date(context.appointmentData!.date!);
      startDateTime.setHours(hours, minutes, 0, 0);
      const endDateTime = addMinutes(startDateTime, totalDuration);
      const endTime = format(endDateTime, 'HH:mm');

      const summary = `📅 **Resumo do Agendamento:**

📋 Serviço(s): ${selectedServices.map(s => s.name).join(', ')}
👤 Barbeiro: ${selectedBarber?.name || 'Não especificado'}
📅 Data: ${formattedDate}
⏰ Horário: ${context.appointmentData!.time} - ${endTime}
💰 Total: R$ ${totalPrice.toFixed(2)}

Confirma o agendamento? (sim/não)`;

      await messageService.sendMessage(
        context.chatId,
        'ai',
        'ai',
        'Assistente',
        summary,
        'text'
      );
    } catch (error) {
      console.error('Erro ao mostrar confirmação:', error);
    }
  },

  async handleConfirmation(context: ChatbotContext, message: string): Promise<void> {
    const lowerMessage = message.toLowerCase();
    
    if (lowerMessage.includes('sim') || lowerMessage.includes('confirmar') || lowerMessage.includes('ok')) {
      try {
        const services = await barbershopService.getServices(context.barbershopId);
        const selectedServices = services.filter(s => context.appointmentData!.serviceIds.includes(s.id));
        
        const totalPrice = selectedServices.reduce((sum, s) => sum + s.price, 0);
        const totalDuration = selectedServices.reduce((sum, s) => sum + s.duration, 0);
        
        const [hours, minutes] = context.appointmentData!.time!.split(':').map(Number);
        const startDateTime = new Date(context.appointmentData!.date!);
        startDateTime.setHours(hours, minutes, 0, 0);
        const endDateTime = addMinutes(startDateTime, totalDuration);
        const endTime = format(endDateTime, 'HH:mm');

        const appointment = await appointmentService.createAppointment({
          barbershopId: context.barbershopId,
          barberId: context.appointmentData!.barberId!,
          clientId: context.clientId,
          serviceIds: context.appointmentData!.serviceIds,
          date: context.appointmentData!.date!,
          startTime: context.appointmentData!.time!,
          endTime: endTime,
          duration: totalDuration,
          totalPrice: totalPrice,
          status: 'scheduled',
          paymentStatus: 'pending',
        });

        await messageService.sendMessage(
          context.chatId,
          'ai',
          'ai',
          'Assistente',
          `✅ Agendamento confirmado com sucesso!\n\nO agendamento foi criado e será revisado pela barbearia. Você receberá uma confirmação em breve.`,
          'appointment_confirmed',
          {
            date: context.appointmentData!.date!,
            time: context.appointmentData!.time!,
            serviceIds: context.appointmentData!.serviceIds,
            barberId: context.appointmentData!.barberId,
          }
        );

        conversationContexts.delete(context.chatId);
      } catch (error) {
        console.error('Erro ao criar agendamento:', error);
        await messageService.sendMessage(
          context.chatId,
          'ai',
          'ai',
          'Assistente',
          'Desculpe, ocorreu um erro ao criar o agendamento. Entre em contato diretamente com a barbearia.',
          'text'
        );
      }
    } else if (lowerMessage.includes('não') || lowerMessage.includes('nao') || lowerMessage.includes('cancelar')) {
      await messageService.sendMessage(
        context.chatId,
        'ai',
        'ai',
        'Assistente',
        'Agendamento cancelado. Se precisar de algo mais, é só avisar! 😊',
        'text'
      );
      conversationContexts.delete(context.chatId);
    } else {
      await messageService.sendMessage(
        context.chatId,
        'ai',
        'ai',
        'Assistente',
        'Por favor, responda "sim" para confirmar ou "não" para cancelar.',
        'text'
      );
    }
  },

  async handleCancellation(context: ChatbotContext): Promise<void> {
    await messageService.sendMessage(
      context.chatId,
      'ai',
      'ai',
      'Assistente',
      'Para cancelar um agendamento, você precisa entrar em contato diretamente com a barbearia pelo telefone ou email. Desculpe pelo inconveniente.',
      'text'
    );
  },

  async handleUnknown(context: ChatbotContext): Promise<void> {
    await messageService.sendMessage(
      context.chatId,
      'ai',
      'ai',
      'Assistente',
      'Desculpe, não entendi. Você pode:\n• Agendar um serviço (digite "agendar")\n• Ver seus agendamentos\n• Cancelar um agendamento\n\nComo posso ajudar?',
      'text'
    );
  },

  clearContext(chatId: string): void {
    conversationContexts.delete(chatId);
  },
};

