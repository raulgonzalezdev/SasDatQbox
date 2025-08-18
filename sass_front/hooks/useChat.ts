'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { customFetch } from '@/utils/api';
import { handleApiError } from '@/utils/api-helpers';
import toast from 'react-hot-toast';

// --- Type Definitions ---
export interface Conversation {
  id: string;
  appointment_id: string;
  type: 'medical_consultation' | 'support' | 'general';
  participant_ids: string[];
  created_at: string;
  updated_at: string;
}

export interface Message {
  id: string;
  conversation_id: string;
  sender_id: string;
  content: string;
  created_at: string;
  updated_at: string;
  sender?: {
    id: string;
    first_name: string;
    last_name: string;
    email: string;
  };
}

export interface CreateConversationPayload {
  appointment_id: string;
  type: 'medical_consultation' | 'support' | 'general';
  participant_ids: string[];
}

export interface CreateMessagePayload {
  conversation_id: string;
  content: string;
}

// --- API Functions ---
const fetchUserConversations = async (): Promise<Conversation[]> => {
  const res = await customFetch('/chat/conversations/');
  if (!res.ok) {
    throw new Error('Failed to fetch conversations');
  }
  return res.json();
};

const fetchConversationMessages = async (conversationId: string): Promise<Message[]> => {
  const res = await customFetch(`/chat/conversations/${conversationId}/messages/`);
  if (!res.ok) {
    throw new Error('Failed to fetch conversation messages');
  }
  return res.json();
};

const createConversation = async (payload: CreateConversationPayload): Promise<Conversation> => {
  const res = await customFetch('/chat/conversations/', {
    method: 'POST',
    body: JSON.stringify(payload),
  });
  if (!res.ok) {
    throw new Error('Failed to create conversation');
  }
  return res.json();
};

const sendMessage = async (payload: CreateMessagePayload): Promise<Message> => {
  const res = await customFetch('/chat/messages/', {
    method: 'POST',
    body: JSON.stringify(payload),
  });
  if (!res.ok) {
    throw new Error('Failed to send message');
  }
  return res.json();
};

// --- Main Hook ---
export function useChat() {
  const queryClient = useQueryClient();

  // Query for user conversations
  const { data: conversations = [], isLoading: conversationsLoading, error: conversationsError } = useQuery({
    queryKey: ['chat-conversations'],
    queryFn: fetchUserConversations,
    retry: 1,
    onError: () => {
      // Silently handle error to use mock data
    },
  });

  // Query for conversation messages
  const useConversationMessages = (conversationId: string) => {
    return useQuery({
      queryKey: ['chat-messages', conversationId],
      queryFn: () => fetchConversationMessages(conversationId),
      enabled: !!conversationId,
      retry: 1,
      onError: () => {
        // Silently handle error to use mock data
      },
    });
  };

  // Mutation for creating conversation
  const { mutate: createConversationMutation, isPending: isCreatingConversation } = useMutation({
    mutationFn: createConversation,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['chat-conversations'] });
      toast.success('Conversación creada exitosamente');
    },
    onError: handleApiError,
  });

  // Mutation for sending message
  const { mutate: sendMessageMutation, isPending: isSendingMessage } = useMutation({
    mutationFn: sendMessage,
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['chat-messages', data.conversation_id] });
      // Don't show toast for messages to avoid spam
    },
    onError: handleApiError,
  });

  // Helper function to get conversation by ID
  const getConversationById = (id: string) => {
    return conversations.find(conversation => conversation.id === id);
  };

  // Helper function to get conversations by type
  const getConversationsByType = (type: string) => {
    return conversations.filter(conversation => conversation.type === type);
  };

  // Helper function to get conversations by appointment
  const getConversationsByAppointment = (appointmentId: string) => {
    return conversations.filter(conversation => conversation.appointment_id === appointmentId);
  };

  // Helper function to get medical consultations
  const getMedicalConsultations = () => {
    return getConversationsByType('medical_consultation');
  };

  // Helper function to get support conversations
  const getSupportConversations = () => {
    return getConversationsByType('support');
  };

  // Helper function to get general conversations
  const getGeneralConversations = () => {
    return getConversationsByType('general');
  };

  // Helper function to check if user is participant in conversation
  const isUserParticipant = (conversationId: string, userId: string) => {
    const conversation = getConversationById(conversationId);
    return conversation?.participant_ids.includes(userId) || false;
  };

  return {
    conversations,
    isLoading: conversationsLoading,
    error: conversationsError,
    useConversationMessages,
    createConversation: createConversationMutation,
    sendMessage: sendMessageMutation,
    isCreatingConversation,
    isSendingMessage,
    getConversationById,
    getConversationsByType,
    getConversationsByAppointment,
    getMedicalConsultations,
    getSupportConversations,
    getGeneralConversations,
    isUserParticipant,
  };
}
