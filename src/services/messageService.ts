import { collection, doc, getDoc, getDocs, addDoc, updateDoc, query, where, orderBy, limit, onSnapshot, Timestamp, serverTimestamp } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { Message, Chat } from '@/types';

export const messageService = {
  // Criar ou obter chat entre cliente e barbearia
  async getOrCreateChat(barbershopId: string, clientId: string, clientName: string): Promise<string> {
    try {
      // Verificar se jÃ¡ existe um chat
      const chatsRef = collection(db, 'chats');
      const q = query(
        chatsRef,
        where('barbershopId', '==', barbershopId),
        where('clientId', '==', clientId),
        where('status', '==', 'active')
      );
      const querySnapshot = await getDocs(q);

      if (!querySnapshot.empty) {
        const existingChat = querySnapshot.docs[0];
        return existingChat.id;
      }

      // Criar novo chat
      const chatData: Omit<Chat, 'id'> = {
        barbershopId,
        clientId,
        clientName,
        unreadCount: 0,
        status: 'active',
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      const docRef = await addDoc(collection(db, 'chats'), {
        ...chatData,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      });

      return docRef.id;
    } catch (error) {
      console.error('Erro ao criar/buscar chat:', error);
      throw error;
    }
  },

  // Enviar mensagem
  async sendMessage(
    chatId: string,
    senderId: string,
    senderRole: 'client' | 'barber' | 'owner' | 'ai',
    senderName: string,
    content: string,
    type: 'text' | 'appointment_request' | 'appointment_confirmed' | 'system' = 'text',
    appointmentData?: any
  ): Promise<string> {
    try {
      const messageData: Omit<Message, 'id'> = {
        chatId,
        senderId,
        senderRole,
        senderName,
        content,
        type,
        appointmentData,
        read: false,
        createdAt: new Date(),
      };

      const docRef = await addDoc(collection(db, 'chats', chatId, 'messages'), {
        ...messageData,
        createdAt: serverTimestamp(),
        appointmentData: appointmentData ? {
          ...appointmentData,
          date: Timestamp.fromDate(appointmentData.date),
        } : undefined,
      });

      // Atualizar chat com Ãºltima mensagem
      const chatRef = doc(db, 'chats', chatId);
      await updateDoc(chatRef, {
        lastMessage: content,
        lastMessageAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      });

      return docRef.id;
    } catch (error) {
      console.error('Erro ao enviar mensagem:', error);
      throw error;
    }
  },

  // Buscar mensagens de um chat
  async getMessages(chatId: string): Promise<Message[]> {
    try {
      const messagesRef = collection(db, 'chats', chatId, 'messages');
      const q = query(messagesRef, orderBy('createdAt', 'asc'));
      const querySnapshot = await getDocs(q);

      return querySnapshot.docs.map(doc => {
        const data = doc.data();
        return {
          id: doc.id,
          ...data,
          createdAt: data.createdAt?.toDate() || new Date(),
          appointmentData: data.appointmentData ? {
            ...data.appointmentData,
            date: data.appointmentData.date?.toDate() || new Date(),
          } : undefined,
        } as Message;
      });
    } catch (error) {
      console.error('Erro ao buscar mensagens:', error);
      return [];
    }
  },

  // Listener para mensagens em tempo real
  subscribeToMessages(chatId: string, callback: (messages: Message[]) => void): () => void {
    const messagesRef = collection(db, 'chats', chatId, 'messages');
    const q = query(messagesRef, orderBy('createdAt', 'asc'));

    return onSnapshot(q, (querySnapshot) => {
      const messages = querySnapshot.docs.map(doc => {
        const data = doc.data();
        return {
          id: doc.id,
          ...data,
          createdAt: data.createdAt?.toDate() || new Date(),
          appointmentData: data.appointmentData ? {
            ...data.appointmentData,
            date: data.appointmentData.date?.toDate() || new Date(),
          } : undefined,
        } as Message;
      });
      callback(messages);
    });
  },

  // Buscar chats de uma barbearia
  async getBarbershopChats(barbershopId: string): Promise<Chat[]> {
    try {
      const chatsRef = collection(db, 'chats');
      const q = query(
        chatsRef,
        where('barbershopId', '==', barbershopId),
        where('status', '==', 'active'),
        orderBy('lastMessageAt', 'desc')
      );
      const querySnapshot = await getDocs(q);

      return querySnapshot.docs.map(doc => {
        const data = doc.data();
        return {
          id: doc.id,
          ...data,
          createdAt: data.createdAt?.toDate() || new Date(),
          updatedAt: data.updatedAt?.toDate() || new Date(),
          lastMessageAt: data.lastMessageAt?.toDate(),
        } as Chat;
      });
    } catch (error) {
      console.error('Erro ao buscar chats:', error);
      return [];
    }
  },

  // Buscar chats de um cliente
  async getClientChats(clientId: string): Promise<Chat[]> {
    try {
      const chatsRef = collection(db, 'chats');
      const q = query(
        chatsRef,
        where('clientId', '==', clientId),
        where('status', '==', 'active'),
        orderBy('lastMessageAt', 'desc')
      );
      const querySnapshot = await getDocs(q);

      return querySnapshot.docs.map(doc => {
        const data = doc.data();
        return {
          id: doc.id,
          ...data,
          createdAt: data.createdAt?.toDate() || new Date(),
          updatedAt: data.updatedAt?.toDate() || new Date(),
          lastMessageAt: data.lastMessageAt?.toDate(),
        } as Chat;
      });
    } catch (error) {
      console.error('Erro ao buscar chats do cliente:', error);
      return [];
    }
  },

  // Marcar mensagens como lidas
  async markMessagesAsRead(chatId: string, userId: string): Promise<void> {
    try {
      const messagesRef = collection(db, 'chats', chatId, 'messages');
      const q = query(messagesRef, where('read', '==', false), where('senderId', '!=', userId));
      const querySnapshot = await getDocs(q);

      const batch = querySnapshot.docs.map(doc => {
        return updateDoc(doc.ref, { read: true });
      });

      await Promise.all(batch);

      // Atualizar contador de nÃ£o lidas no chat
      const chatRef = doc(db, 'chats', chatId);
      await updateDoc(chatRef, {
        unreadCount: 0,
      });
    } catch (error) {
      console.error('Erro ao marcar mensagens como lidas:', error);
    }
  },
};
