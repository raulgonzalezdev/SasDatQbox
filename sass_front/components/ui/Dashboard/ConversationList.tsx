'use client';

import { useQuery } from '@tanstack/react-query';
import {
  List,
  ListItemButton,
  ListItemText,
  ListItemAvatar,
  Avatar,
  Typography,
  Box,
  CircularProgress,
  Alert
} from '@mui/material';
import { customFetch } from '@/utils/api';
import { useAuth } from '@/hooks/useAuth';

// Tipos provisionales, los ajustaremos con los esquemas del backend
interface Participant {
  id: string;
  first_name: string;
  last_name: string;
}
interface Conversation {
  id: string;
  participants: Participant[];
}

const fetchConversations = async (): Promise<Conversation[]> => {
  const res = await customFetch('/api/v1/chat/conversations/');
  if (!res.ok) {
    throw new Error('No se pudieron cargar las conversaciones.');
  }
  return res.json();
};

export default function ConversationList({ onSelectConversation }: { onSelectConversation: (id: string) => void }) {
  const { user } = useAuth();
  const { data: conversations, isLoading, error } = useQuery<Conversation[]>({
    queryKey: ['conversations'],
    queryFn: fetchConversations,
    enabled: !!user,
  });

  if (isLoading) {
    return <Box sx={{ display: 'flex', justifyContent: 'center', p: 2 }}><CircularProgress /></Box>;
  }

  if (error) {
    return <Alert severity="error" sx={{ m: 2 }}>{error.message}</Alert>;
  }
  
  const getOtherParticipant = (participants: Participant[]) => {
    return participants.find(p => p.id !== user?.id);
  }

  return (
    <Box sx={{ overflowY: 'auto', height: '100%' }}>
      <Typography variant="h6" sx={{ p: 2, pb: 1 }}>
        Conversaciones
      </Typography>
      <List>
        {conversations && conversations.length > 0 ? (
          conversations.map((conv) => {
            const otherParticipant = getOtherParticipant(conv.participants);
            
            const participantName = (otherParticipant?.first_name && otherParticipant?.last_name) 
              ? `${otherParticipant.first_name} ${otherParticipant.last_name}`
              : 'Usuario';
            
            const participantInitial = otherParticipant?.first_name ? otherParticipant.first_name[0] : 'U';

            return (
              <ListItemButton key={conv.id} onClick={() => onSelectConversation(conv.id)}>
                <ListItemAvatar>
                  <Avatar>{participantInitial}</Avatar>
                </ListItemAvatar>
                <ListItemText
                  primary={participantName}
                  secondary="Último mensaje..."
                />
              </ListItemButton>
            );
          })
        ) : (
          <Typography sx={{ p: 2 }}>No tienes conversaciones.</Typography>
        )}
      </List>
    </Box>
  );
}
