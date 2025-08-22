import { post, get, put, del } from './api';
import { CHAT_ENDPOINTS } from '../constants/api';

// Interfaces para el chat
export interface Conversation {
  id: string;
  type: 'appointment' | 'general';
  appointment_id?: string;
  participants: User[];
  created_at: string;
  updated_at: string;
}

export interface User {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  avatar_url?: string;
}

export interface Message {
  id: string;
  conversation_id: string;
  sender_id: string;
  content: string;
  message_type: 'text' | 'image' | 'file';
  read_at?: string;
  created_at: string;
  updated_at: string;
}

export interface ConversationCreate {
  type: 'appointment' | 'general';
  appointment_id?: string;
  participant_ids: string[];
}

export interface MessageCreate {
  content: string;
  message_type?: 'text' | 'image' | 'file';
}

// Función para crear una nueva conversación
export const createConversation = async (conversationData: ConversationCreate): Promise<Conversation> => {
  console.log('🔍 Creando conversación');
  
  try {
    const conversation = await post<Conversation>(CHAT_ENDPOINTS.CREATE_CONVERSATION, conversationData, { requireAuth: true });
    return conversation;
  } catch (error) {
    console.error('❌ Error al crear conversación:', error);
    throw error;
  }
};

// Función para obtener todas las conversaciones del usuario
export const getConversations = async (): Promise<Conversation[]> => {
  console.log('🔍 Obteniendo conversaciones');
  
  try {
    const conversations = await get<Conversation[]>(CHAT_ENDPOINTS.CONVERSATIONS, { requireAuth: true });
    return conversations;
  } catch (error) {
    console.error('❌ Error al obtener conversaciones:', error);
    throw error;
  }
};

// Función para obtener una conversación específica
export const getConversation = async (id: string): Promise<Conversation> => {
  console.log('🔍 Obteniendo conversación:', id);
  
  try {
    const conversation = await get<Conversation>(`${CHAT_ENDPOINTS.CONVERSATIONS}/${id}`, { requireAuth: true });
    return conversation;
  } catch (error) {
    console.error('❌ Error al obtener conversación:', error);
    throw error;
  }
};

// Función para obtener mensajes de una conversación
export const getMessages = async (conversationId: string): Promise<Message[]> => {
  console.log('🔍 Obteniendo mensajes de la conversación:', conversationId);
  
  try {
    const messages = await get<Message[]>(CHAT_ENDPOINTS.MESSAGES(conversationId), { requireAuth: true });
    return messages;
  } catch (error) {
    console.error('❌ Error al obtener mensajes:', error);
    throw error;
  }
};

// Función para enviar un mensaje
export const sendMessage = async (conversationId: string, messageData: MessageCreate): Promise<Message> => {
  console.log('🔍 Enviando mensaje a la conversación:', conversationId);
  
  try {
    const message = await post<Message>(CHAT_ENDPOINTS.SEND_MESSAGE(conversationId), messageData, { requireAuth: true });
    return message;
  } catch (error) {
    console.error('❌ Error al enviar mensaje:', error);
    throw error;
  }
};

// Función para marcar conversación como leída
export const markConversationAsRead = async (conversationId: string): Promise<void> => {
  console.log('🔍 Marcando conversación como leída:', conversationId);
  
  try {
    await post(CHAT_ENDPOINTS.MARK_READ(conversationId), {}, { requireAuth: true });
  } catch (error) {
    console.error('❌ Error al marcar conversación como leída:', error);
    throw error;
  }
};

// Función para eliminar una conversación
export const deleteConversation = async (conversationId: string): Promise<void> => {
  console.log('🔍 Eliminando conversación:', conversationId);
  
  try {
    await del(`${CHAT_ENDPOINTS.CONVERSATIONS}/${conversationId}`, { requireAuth: true });
  } catch (error) {
    console.error('❌ Error al eliminar conversación:', error);
    throw error;
  }
};
