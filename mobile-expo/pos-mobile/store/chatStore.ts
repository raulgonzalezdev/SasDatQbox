import { create } from 'zustand';

// Tipos para el sistema de chat médico
export type MessageType = 'text' | 'image' | 'file' | 'voice' | 'video_call' | 'audio_call' | 'prescription' | 'medical_document';
export type CallStatus = 'idle' | 'ringing' | 'connecting' | 'connected' | 'ended' | 'declined';
export type ConversationType = 'medical_consultation' | 'appointment_discussion' | 'general';

export interface ChatUser {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  avatar_url?: string;
  role: 'doctor' | 'patient' | 'admin';
  is_online: boolean;
  last_seen?: string;
}

export interface MediaFile {
  id: string;
  name: string;
  url: string;
  type: 'image' | 'document' | 'audio' | 'video';
  size: number;
  mime_type: string;
}

export interface ChatMessage {
  id: string;
  conversation_id: string;
  sender_id: string;
  sender: ChatUser;
  content: string;
  message_type: MessageType;
  media_files?: MediaFile[];
  read_at?: string;
  created_at: string;
  updated_at: string;
  // Para llamadas
  call_duration?: number;
  call_status?: CallStatus;
  // Para archivos médicos
  is_confidential?: boolean;
  medical_category?: 'prescription' | 'lab_result' | 'x_ray' | 'report' | 'other';
}

export interface Conversation {
  id: string;
  type: ConversationType;
  appointment_id?: string;
  participants: ChatUser[];
  title: string;
  last_message?: ChatMessage;
  unread_count: number;
  is_muted: boolean;
  created_at: string;
  updated_at: string;
  // Para contexto médico
  patient_id?: string;
  doctor_id?: string;
  appointment_date?: string;
  medical_priority?: 'low' | 'medium' | 'high' | 'urgent';
}

export interface ActiveCall {
  id: string;
  conversation_id: string;
  type: 'audio' | 'video';
  participants: ChatUser[];
  status: CallStatus;
  started_at?: string;
  duration?: number;
  is_muted: boolean;
  is_video_enabled: boolean;
  is_screen_sharing: boolean;
}

interface ChatState {
  // Conversaciones
  conversations: Conversation[];
  activeConversation: Conversation | null;
  messages: { [conversationId: string]: ChatMessage[] };
  
  // Estado de conexión
  isConnected: boolean;
  isLoading: boolean;
  
  // Llamadas
  activeCall: ActiveCall | null;
  incomingCall: ActiveCall | null;
  
  // UI Estado
  isTyping: { [conversationId: string]: string[] }; // Array de user IDs que están escribiendo
  drafts: { [conversationId: string]: string }; // Borradores de mensajes
  
  // Archivos
  pendingUploads: { [messageId: string]: { progress: number; file: any } };
  
  // Acciones
  setConversations: (conversations: Conversation[]) => void;
  addConversation: (conversation: Conversation) => void;
  updateConversation: (conversationId: string, updates: Partial<Conversation>) => void;
  setActiveConversation: (conversation: Conversation | null) => void;
  
  // Mensajes
  setMessages: (conversationId: string, messages: ChatMessage[]) => void;
  addMessage: (message: ChatMessage) => void;
  updateMessage: (messageId: string, updates: Partial<ChatMessage>) => void;
  markMessagesAsRead: (conversationId: string) => void;
  
  // Llamadas
  startCall: (conversationId: string, type: 'audio' | 'video') => void;
  acceptCall: () => void;
  declineCall: () => void;
  endCall: () => void;
  toggleMute: () => void;
  toggleVideo: () => void;
  toggleScreenShare: () => void;
  
  // Estado de escritura
  setTyping: (conversationId: string, userId: string, isTyping: boolean) => void;
  
  // Borradores
  saveDraft: (conversationId: string, content: string) => void;
  clearDraft: (conversationId: string) => void;
  
  // Conexión
  setConnected: (isConnected: boolean) => void;
  setLoading: (isLoading: boolean) => void;
  
  // Reset
  reset: () => void;
}

export const useChatStore = create<ChatState>()((set, get) => ({
      // Estado inicial
      conversations: [],
      activeConversation: null,
      messages: {},
      isConnected: false,
      isLoading: false,
      activeCall: null,
      incomingCall: null,
      isTyping: {},
      drafts: {},
      pendingUploads: {},
      
      // Implementación de acciones
      setConversations: (conversations) => set({ conversations }),
      
      addConversation: (conversation) => set((state) => ({
        conversations: [conversation, ...state.conversations],
      })),
      
      updateConversation: (conversationId, updates) => set((state) => ({
        conversations: state.conversations.map(conv =>
          conv.id === conversationId ? { ...conv, ...updates } : conv
        ),
      })),
      
      setActiveConversation: (conversation) => set({ activeConversation: conversation }),
      
      setMessages: (conversationId, messages) => set((state) => ({
        messages: { ...state.messages, [conversationId]: messages },
      })),
      
      addMessage: (message) => set((state) => {
        const conversationMessages = state.messages[message.conversation_id] || [];
        return {
          messages: {
            ...state.messages,
            [message.conversation_id]: [...conversationMessages, message],
          },
          conversations: state.conversations.map(conv =>
            conv.id === message.conversation_id
              ? { ...conv, last_message: message, unread_count: conv.unread_count + 1 }
              : conv
          ),
        };
      }),
      
      updateMessage: (messageId, updates) => set((state) => {
        const newMessages = { ...state.messages };
        Object.keys(newMessages).forEach(conversationId => {
          newMessages[conversationId] = newMessages[conversationId].map(msg =>
            msg.id === messageId ? { ...msg, ...updates } : msg
          );
        });
        return { messages: newMessages };
      }),
      
      markMessagesAsRead: (conversationId) => set((state) => ({
        conversations: state.conversations.map(conv =>
          conv.id === conversationId ? { ...conv, unread_count: 0 } : conv
        ),
        messages: {
          ...state.messages,
          [conversationId]: (state.messages[conversationId] || []).map(msg => ({
            ...msg,
            read_at: msg.read_at || new Date().toISOString(),
          })),
        },
      })),
      
      // Funciones de llamadas
      startCall: (conversationId, type) => {
        const conversation = get().conversations.find(c => c.id === conversationId);
        if (!conversation) return;
        
        const call: ActiveCall = {
          id: `call_${Date.now()}`,
          conversation_id: conversationId,
          type,
          participants: conversation.participants,
          status: 'connecting',
          started_at: new Date().toISOString(),
          is_muted: false,
          is_video_enabled: type === 'video',
          is_screen_sharing: false,
        };
        
        set({ activeCall: call });
      },
      
      acceptCall: () => set((state) => ({
        activeCall: state.incomingCall,
        incomingCall: null,
      })),
      
      declineCall: () => set({ incomingCall: null }),
      
      endCall: () => set({ activeCall: null, incomingCall: null }),
      
      toggleMute: () => set((state) => ({
        activeCall: state.activeCall
          ? { ...state.activeCall, is_muted: !state.activeCall.is_muted }
          : null,
      })),
      
      toggleVideo: () => set((state) => ({
        activeCall: state.activeCall
          ? { ...state.activeCall, is_video_enabled: !state.activeCall.is_video_enabled }
          : null,
      })),
      
      toggleScreenShare: () => set((state) => ({
        activeCall: state.activeCall
          ? { ...state.activeCall, is_screen_sharing: !state.activeCall.is_screen_sharing }
          : null,
      })),
      
      // Estado de escritura
      setTyping: (conversationId, userId, isTyping) => set((state) => {
        const currentTyping = state.isTyping[conversationId] || [];
        const newTyping = isTyping
          ? [...currentTyping.filter(id => id !== userId), userId]
          : currentTyping.filter(id => id !== userId);
        
        return {
          isTyping: { ...state.isTyping, [conversationId]: newTyping },
        };
      }),
      
      // Borradores
      saveDraft: (conversationId, content) => set((state) => ({
        drafts: { ...state.drafts, [conversationId]: content },
      })),
      
      clearDraft: (conversationId) => set((state) => {
        const newDrafts = { ...state.drafts };
        delete newDrafts[conversationId];
        return { drafts: newDrafts };
      }),
      
      // Conexión
      setConnected: (isConnected) => set({ isConnected }),
      setLoading: (isLoading) => set({ isLoading }),
      
      // Reset
      reset: () => set({
        conversations: [],
        activeConversation: null,
        messages: {},
        isConnected: false,
        isLoading: false,
        activeCall: null,
        incomingCall: null,
        isTyping: {},
        drafts: {},
        pendingUploads: {},
      }),
    }));

// Funciones de utilidad
export const getConversationById = (id: string): Conversation | undefined => {
  return useChatStore.getState().conversations.find(conv => conv.id === id);
};

export const getMessagesByConversation = (conversationId: string): ChatMessage[] => {
  return useChatStore.getState().messages[conversationId] || [];
};

export const getTotalUnreadCount = (): number => {
  return useChatStore.getState().conversations.reduce((total, conv) => total + conv.unread_count, 0);
};

export const isUserTyping = (conversationId: string, userId: string): boolean => {
  const typingUsers = useChatStore.getState().isTyping[conversationId] || [];
  return typingUsers.includes(userId);
};

export const hasActiveCall = (): boolean => {
  return useChatStore.getState().activeCall !== null;
};

export const hasIncomingCall = (): boolean => {
  return useChatStore.getState().incomingCall !== null;
};
