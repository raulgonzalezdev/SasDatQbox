'use client';

import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  Box,
  Typography,
  TextField,
  Button,
  Paper,
  Avatar,
  CircularProgress,
  Alert,
  IconButton
} from '@mui/material';
import SendIcon from '@mui/icons-material/Send';
import { customFetch } from '@/utils/api';
import { useAuth } from '@/hooks/useAuth';

interface Message {
  id: string;
  content: string;
  sender_id: string;
  created_at: string;
}

const fetchMessages = async (conversationId: string): Promise<Message[]> => {
  const res = await customFetch(`/api/v1/chat/conversations/${conversationId}/messages`);
  if (!res.ok) throw new Error('Error al cargar los mensajes.');
  return res.json();
};

const sendMessage = async ({ conversationId, content }: { conversationId: string; content: string }) => {
  const res = await customFetch(`/api/v1/chat/messages/`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ conversation_id: conversationId, content }),
  });
  if (!res.ok) throw new Error('No se pudo enviar el mensaje.');
  return res.json();
};

export default function MessagePanel({ conversationId }: { conversationId: string | null }) {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [newMessage, setNewMessage] = useState('');

  const { data: messages, isLoading, error } = useQuery<Message[]>({
    queryKey: ['messages', conversationId],
    queryFn: () => fetchMessages(conversationId!),
    enabled: !!conversationId,
  });

  const mutation = useMutation({
    mutationFn: sendMessage,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['messages', conversationId] });
      setNewMessage('');
    },
  });

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (newMessage.trim() && conversationId) {
      mutation.mutate({ conversationId, content: newMessage });
    }
  };

  if (!conversationId) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
        <Typography color="text.secondary">Selecciona una conversación para empezar a chatear.</Typography>
      </Box>
    );
  }

  if (isLoading) return <CircularProgress />;
  if (error) return <Alert severity="error">{error.message}</Alert>;

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      <Box sx={{ flexGrow: 1, overflowY: 'auto', p: 2 }}>
        {messages?.map((msg) => (
          <Box
            key={msg.id}
            sx={{
              display: 'flex',
              justifyContent: msg.sender_id === user?.id ? 'flex-end' : 'flex-start',
              mb: 2,
            }}
          >
            <Paper
              elevation={2}
              sx={{
                p: 1.5,
                maxWidth: '70%',
                bgcolor: msg.sender_id === user?.id ? 'primary.main' : 'grey.300',
                color: msg.sender_id === user?.id ? 'primary.contrastText' : 'text.primary',
              }}
            >
              {msg.content}
            </Paper>
          </Box>
        ))}
      </Box>
      <Box component="form" onSubmit={handleSendMessage} sx={{ p: 2, borderTop: '1px solid #ddd', display: 'flex' }}>
        <TextField
          fullWidth
          variant="outlined"
          placeholder="Escribe un mensaje..."
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          disabled={mutation.isPending}
        />
        <IconButton type="submit" color="primary" disabled={mutation.isPending || !newMessage.trim()}>
          <SendIcon />
        </IconButton>
      </Box>
    </Box>
  );
}
