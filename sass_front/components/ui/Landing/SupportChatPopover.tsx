'use client';
import { useState, useRef, useEffect } from 'react';
import {
  Popover, Box, Paper, Typography, InputBase, IconButton, Avatar, Menu, MenuItem, Divider
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import SendIcon from '@mui/icons-material/Send';
import MicIcon from '@mui/icons-material/Mic';
import AppsIcon from '@mui/icons-material/Apps';
import Link from 'next/link';

interface Message {
  sender: 'user' | 'support';
  text: string;
}

interface SupportChatPopoverProps {
  open: boolean;
  onClose: () => void;
  anchorEl: HTMLElement | null;
}

export default function SupportChatPopover({ open, onClose, anchorEl }: SupportChatPopoverProps) {
  const [messages, setMessages] = useState<Message[]>([
    { sender: 'support', text: '¡Hola! Soy SIA, tu asistente virtual. ¿En qué puedo ayudarte hoy?' }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [menuAnchorEl, setMenuAnchorEl] = useState<null | HTMLElement>(null);
  const chatContentRef = useRef<HTMLDivElement>(null);
  const menuOpen = Boolean(menuAnchorEl);

  useEffect(() => {
    if (chatContentRef.current) {
      chatContentRef.current.scrollTop = chatContentRef.current.scrollHeight;
    }
  }, [messages]);
  
  const handleSendMessage = () => {
    if (inputValue.trim() === '') return;
    const userMessage: Message = { sender: 'user', text: inputValue };
    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setTimeout(() => {
      const supportResponse: Message = { sender: 'support', text: 'Gracias por tu mensaje. Un agente te responderá pronto.' };
      setMessages(prev => [...prev, supportResponse]);
    }, 1500);
  };
  
  const handleMenuClick = (event: React.MouseEvent<HTMLElement>) => setMenuAnchorEl(event.currentTarget);
  const handleMenuClose = () => setMenuAnchorEl(null);

  return (
    <Popover 
      open={open} 
      onClose={onClose} 
      anchorEl={anchorEl}
      anchorOrigin={{
        vertical: 'top',
        horizontal: 'left',
      }}
      transformOrigin={{
        vertical: 'bottom',
        horizontal: 'right',
      }}
      PaperProps={{ 
        sx: { 
          width: { xs: '90vw', sm: 400 },
          height: { xs: '80vh', sm: '650px' },
          maxHeight: '700px',
          borderRadius: '20px', 
          overflow: 'hidden',
          display: 'flex',
          flexDirection: 'column',
          bgcolor: (theme) => theme.palette.mode === 'dark' ? '#1a1a1a' : 'background.paper',
          border: (theme) => theme.palette.mode === 'dark' ? '1px solid rgba(255,255,255,0.1)' : 'none'
        } 
      }}
    >
      <Box sx={{ 
        p: 2, 
        bgcolor: (theme) => theme.palette.mode === 'dark' ? '#1a1a1a' : 'primary.main', 
        color: 'white', 
        position: 'relative', 
        minHeight: '60px' 
      }}>
        <Avatar sx={{ 
          width: 60, 
          height: 60, 
          position: 'absolute', 
          top: '30px', 
          left: '50%', 
          transform: 'translateX(-50%)', 
          border: '3px solid white', 
          zIndex: 1,
          bgcolor: (theme) => theme.palette.mode === 'dark' ? '#2d2d2d' : 'primary.main'
        }}>SIA</Avatar>
        <IconButton onClick={onClose} sx={{ color: 'white', position: 'absolute', top: 8, right: 8 }}>
          <CloseIcon />
        </IconButton>
      </Box>
      <Box sx={{ 
        pt: '40px', 
        pb: 1, 
        px: 2, 
        textAlign: 'center',
        bgcolor: (theme) => theme.palette.mode === 'dark' ? '#2d2d2d' : 'background.paper'
      }}>
        <Typography variant="h6" sx={{ color: (theme) => theme.palette.mode === 'dark' ? 'white' : 'text.primary' }}>
          SIA - Asistente Virtual
        </Typography>
        <Typography variant="body2" sx={{ color: (theme) => theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.7)' : 'text.secondary' }}>
          Tu asistente de soporte 24/7
        </Typography>
      </Box>
      <Divider sx={{ 
        mb: 1,
        borderColor: (theme) => theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.1)' : 'divider'
      }} />
      <Box ref={chatContentRef} sx={{ 
          flexGrow: 1, 
          overflowY: 'auto', 
          p: 2, 
          bgcolor: (theme) => theme.palette.mode === 'dark' ? '#1e1e1e' : '#f5f5f5',
          '&::-webkit-scrollbar': { width: '6px' },
          '&::-webkit-scrollbar-track': { 
            backgroundColor: (theme) => theme.palette.mode === 'dark' ? '#1e1e1e' : '#f5f5f5' 
          },
          '&::-webkit-scrollbar-thumb': { 
            backgroundColor: (theme) => theme.palette.mode === 'dark' ? '#555' : '#ccc', 
            borderRadius: '3px' 
          }
      }}>
        {messages.map((msg, index) => (
          <Box key={index} sx={{ display: 'flex', justifyContent: msg.sender === 'user' ? 'flex-end' : 'flex-start', mb: 2 }}>
            <Paper elevation={1} sx={{ 
                p: 1.5, 
                borderRadius: msg.sender === 'user' ? '20px 20px 5px 20px' : '20px 20px 20px 5px',
                maxWidth: '80%', 
                bgcolor: msg.sender === 'user' 
                  ? 'primary.main' 
                  : (theme) => theme.palette.mode === 'dark' ? '#2d2d2d' : 'white', 
                color: msg.sender === 'user' 
                  ? 'primary.contrastText' 
                  : (theme) => theme.palette.mode === 'dark' ? 'white' : 'text.primary',
                wordWrap: 'break-word',
                border: (theme) => theme.palette.mode === 'dark' && msg.sender !== 'user' 
                  ? '1px solid rgba(255,255,255,0.1)' 
                  : 'none'
            }}>
              <Typography variant="body1">{msg.text}</Typography>
            </Paper>
          </Box>
        ))}
      </Box>
        <Box sx={{ 
          p: 1, 
          display: 'flex', 
          alignItems: 'center', 
          borderTop: (theme) => `1px solid ${theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.1)' : '#ddd'}`,
          bgcolor: (theme) => theme.palette.mode === 'dark' ? '#2d2d2d' : 'background.paper'
        }}>
          <IconButton onClick={handleMenuClick} sx={{ color: (theme) => theme.palette.mode === 'dark' ? 'white' : 'inherit' }}>
            <AppsIcon />
          </IconButton>
          <Menu 
            anchorEl={menuAnchorEl} 
            open={menuOpen} 
            onClose={handleMenuClose}
            PaperProps={{
              sx: {
                bgcolor: (theme) => theme.palette.mode === 'dark' ? '#2d2d2d' : 'background.paper',
                color: (theme) => theme.palette.mode === 'dark' ? 'white' : 'text.primary'
              }
            }}
          >
            <MenuItem onClick={handleMenuClose} component={Link} href="/signin/signup">Registrarse</MenuItem>
            <MenuItem onClick={handleMenuClose} component={Link} href="/signin">Iniciar Sesión</MenuItem>
          </Menu>
          <Box sx={{
            flexGrow: 1,
            mx: 1,
            bgcolor: (theme) => theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.1)' : 'action.hover',
            borderRadius: '20px',
            display: 'flex',
            alignItems: 'center',
            px: 1.5,
            py: 0.5,
            border: (theme) => theme.palette.mode === 'dark' ? '1px solid rgba(255,255,255,0.2)' : 'none'
          }}>
            <InputBase
              sx={{ 
                flex: 1,
                color: (theme) => theme.palette.mode === 'dark' ? 'white' : 'inherit',
                '& input::placeholder': {
                  color: (theme) => theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.5)' : 'rgba(0,0,0,0.5)',
                  opacity: 1
                }
              }}
              placeholder="Escribe tu mensaje..."
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
            />
          </Box>
          <IconButton sx={{ color: (theme) => theme.palette.mode === 'dark' ? 'white' : 'inherit' }}>
            <MicIcon />
          </IconButton>
          <IconButton color="primary" onClick={handleSendMessage}>
            <SendIcon />
          </IconButton>
        </Box>
    </Popover>
  );
}
