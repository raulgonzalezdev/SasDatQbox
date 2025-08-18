'use client';

import React, { useState } from 'react';
import {
  Box,
  Typography,
  Paper,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  Avatar,
  Divider,
  TextField,
  Button,
  Grid,
  Card,
  CardContent,
  Chip,
  IconButton,
  CircularProgress
} from '@mui/material';
import {
  Send as SendIcon,
  Person as PersonIcon,
  Chat as ChatIcon,
  MedicalServices as MedicalIcon,
  Support as SupportIcon
} from '@mui/icons-material';
import { useChat } from '@/hooks/useChat';
import { useAuth } from '@/hooks/useAuth';
import dayjs from 'dayjs';

export default function ChatPage() {
  const { user } = useAuth();
  const { 
    conversations, 
    isLoading, 
    useConversationMessages,
    sendMessage,
    isSendingMessage,
    getMedicalConsultations,
    getSupportConversations,
    getGeneralConversations
  } = useChat();

  const [selectedConversationId, setSelectedConversationId] = useState<string | null>(null);
  const [newMessage, setNewMessage] = useState('');

  // Get messages for selected conversation
  const { data: messages = [] } = useConversationMessages(selectedConversationId || '');

  const selectedConversation = conversations.find(conv => conv.id === selectedConversationId);

  const handleSendMessage = () => {
    if (!selectedConversationId || !newMessage.trim()) return;
    
    sendMessage({
      conversation_id: selectedConversationId,
      content: newMessage
    });
    
    setNewMessage('');
  };

  const getConversationTypeIcon = (type: string) => {
    switch (type) {
      case 'medical_consultation':
        return <MedicalIcon />;
      case 'support':
        return <SupportIcon />;
      default:
        return <ChatIcon />;
    }
  };

  const getConversationTypeColor = (type: string) => {
    switch (type) {
      case 'medical_consultation':
        return 'primary';
      case 'support':
        return 'secondary';
      default:
        return 'default';
    }
  };

  const getConversationTypeText = (type: string) => {
    switch (type) {
      case 'medical_consultation':
        return 'Consulta Médica';
      case 'support':
        return 'Soporte';
      default:
        return 'General';
    }
  };

  if (isLoading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3 }}>
      {/* Header */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4" sx={{ color: 'primary.main', fontWeight: 'bold' }}>
          Chat y Conversaciones
        </Typography>
      </Box>

      {/* Stats Cards */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ 
            backgroundColor: 'primary.main', 
            color: 'white',
            '&:hover': { transform: 'translateY(-2px)', transition: 'transform 0.2s' }
          }}>
            <CardContent>
              <Typography variant="h4" sx={{ fontWeight: 'bold' }}>
                {conversations.length}
              </Typography>
              <Typography variant="body2" sx={{ opacity: 0.9 }}>
                Conversaciones Totales
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ 
            backgroundColor: 'success.main', 
            color: 'white',
            '&:hover': { transform: 'translateY(-2px)', transition: 'transform 0.2s' }
          }}>
            <CardContent>
              <Typography variant="h4" sx={{ fontWeight: 'bold' }}>
                {getMedicalConsultations().length}
              </Typography>
              <Typography variant="body2" sx={{ opacity: 0.9 }}>
                Consultas Médicas
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ 
            backgroundColor: 'info.main', 
            color: 'white',
            '&:hover': { transform: 'translateY(-2px)', transition: 'transform 0.2s' }
          }}>
            <CardContent>
              <Typography variant="h4" sx={{ fontWeight: 'bold' }}>
                {getSupportConversations().length}
              </Typography>
              <Typography variant="body2" sx={{ opacity: 0.9 }}>
                Soporte Técnico
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ 
            backgroundColor: 'warning.main', 
            color: 'white',
            '&:hover': { transform: 'translateY(-2px)', transition: 'transform 0.2s' }
          }}>
            <CardContent>
              <Typography variant="h4" sx={{ fontWeight: 'bold' }}>
                {getGeneralConversations().length}
              </Typography>
              <Typography variant="body2" sx={{ opacity: 0.9 }}>
                Conversaciones Generales
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      <Grid container spacing={3}>
        {/* Conversations List */}
        <Grid item xs={12} md={4}>
          <Paper sx={{ height: '600px', overflow: 'auto' }}>
            <Box sx={{ p: 2, borderBottom: 1, borderColor: 'divider' }}>
              <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                Conversaciones
              </Typography>
            </Box>
            <List>
              {conversations.map((conversation) => (
                <React.Fragment key={conversation.id}>
                  <ListItem 
                    button
                    selected={selectedConversationId === conversation.id}
                    onClick={() => setSelectedConversationId(conversation.id)}
                    sx={{
                      '&.Mui-selected': {
                        backgroundColor: 'primary.light',
                        '&:hover': {
                          backgroundColor: 'primary.light',
                        },
                      },
                    }}
                  >
                    <ListItemAvatar>
                      <Avatar sx={{ bgcolor: `${getConversationTypeColor(conversation.type)}.main` }}>
                        {getConversationTypeIcon(conversation.type)}
                      </Avatar>
                    </ListItemAvatar>
                    <ListItemText
                      primary={
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <Typography variant="subtitle2" sx={{ fontWeight: 'bold' }}>
                            {getConversationTypeText(conversation.type)}
                          </Typography>
                          <Chip
                            label={conversation.type}
                            size="small"
                            color={getConversationTypeColor(conversation.type) as any}
                          />
                        </Box>
                      }
                      secondary={
                        <Typography variant="caption" color="text.secondary">
                          {dayjs(conversation.created_at).format('DD/MM/YYYY HH:mm')}
                        </Typography>
                      }
                    />
                  </ListItem>
                  <Divider />
                </React.Fragment>
              ))}
              {conversations.length === 0 && (
                <ListItem>
                  <ListItemText
                    primary={
                      <Typography variant="body2" color="text.secondary" sx={{ textAlign: 'center' }}>
                        No hay conversaciones disponibles
                      </Typography>
                    }
                  />
                </ListItem>
              )}
            </List>
          </Paper>
        </Grid>

        {/* Chat Messages */}
        <Grid item xs={12} md={8}>
          <Paper sx={{ height: '600px', display: 'flex', flexDirection: 'column' }}>
            {selectedConversation ? (
              <>
                {/* Chat Header */}
                <Box sx={{ p: 2, borderBottom: 1, borderColor: 'divider', backgroundColor: 'primary.main', color: 'white' }}>
                  <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                    {getConversationTypeText(selectedConversation.type)}
                  </Typography>
                  <Typography variant="caption">
                    Creada: {dayjs(selectedConversation.created_at).format('DD/MM/YYYY HH:mm')}
                  </Typography>
                </Box>

                {/* Messages */}
                <Box sx={{ flex: 1, overflow: 'auto', p: 2 }}>
                  {messages.map((message) => (
                    <Box
                      key={message.id}
                      sx={{
                        display: 'flex',
                        justifyContent: message.sender_id === user?.id ? 'flex-end' : 'flex-start',
                        mb: 2,
                      }}
                    >
                      <Box
                        sx={{
                          maxWidth: '70%',
                          p: 2,
                          borderRadius: 2,
                          backgroundColor: message.sender_id === user?.id ? 'primary.main' : 'grey.100',
                          color: message.sender_id === user?.id ? 'white' : 'text.primary',
                        }}
                      >
                        <Typography variant="body2">
                          {message.content}
                        </Typography>
                        <Typography variant="caption" sx={{ opacity: 0.7, display: 'block', mt: 1 }}>
                          {dayjs(message.created_at).format('HH:mm')}
                        </Typography>
                      </Box>
                    </Box>
                  ))}
                  {messages.length === 0 && (
                    <Box sx={{ textAlign: 'center', py: 4 }}>
                      <Typography variant="body2" color="text.secondary">
                        No hay mensajes en esta conversación
                      </Typography>
                    </Box>
                  )}
                </Box>

                {/* Message Input */}
                <Box sx={{ p: 2, borderTop: 1, borderColor: 'divider' }}>
                  <Box sx={{ display: 'flex', gap: 1 }}>
                    <TextField
                      fullWidth
                      placeholder="Escribe un mensaje..."
                      value={newMessage}
                      onChange={(e) => setNewMessage(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                      disabled={isSendingMessage}
                    />
                    <Button
                      variant="contained"
                      onClick={handleSendMessage}
                      disabled={!newMessage.trim() || isSendingMessage}
                      sx={{ minWidth: 'auto', px: 2 }}
                    >
                      <SendIcon />
                    </Button>
                  </Box>
                </Box>
              </>
            ) : (
              <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
                <Typography variant="body1" color="text.secondary">
                  Selecciona una conversación para comenzar a chatear
                </Typography>
              </Box>
            )}
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
}
