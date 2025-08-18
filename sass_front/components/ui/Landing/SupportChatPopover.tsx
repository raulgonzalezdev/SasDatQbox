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
import { useTranslations } from 'next-intl';

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
  const t = useTranslations('SupportChat');
  const [messages, setMessages] = useState<Message[]>([
    { sender: 'support', text: t('welcomeMessage') }
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
      const supportResponse: Message = { sender: 'support', text: t('responseMessage') };
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
          flexDirection: 'column'
        } 
      }}
    >
      <Box sx={{ p: 2, bgcolor: 'primary.main', color: 'white', position: 'relative', minHeight: '60px' }}>
        <Avatar sx={{ width: 60, height: 60, position: 'absolute', top: '30px', left: '50%', transform: 'translateX(-50%)', border: '3px solid white', zIndex: 1 }}>SIA</Avatar>
        <IconButton onClick={onClose} sx={{ color: 'white', position: 'absolute', top: 8, right: 8 }}>
          <CloseIcon />
        </IconButton>
      </Box>
      <Box sx={{ pt: '40px', pb: 1, px: 2, textAlign: 'center' }}>
        <Typography variant="h6">{t('assistantName')}</Typography>
        <Typography variant="body2" color="text.secondary">{t('assistantSubtitle')}</Typography>
      </Box>
      <Divider sx={{ mb: 1 }} />
      <Box ref={chatContentRef} sx={{ 
          flexGrow: 1, 
          overflowY: 'auto', 
          p: 2, 
          bgcolor: '#f5f5f5',
          '&::-webkit-scrollbar': { width: '6px' },
          '&::-webkit-scrollbar-track': { backgroundColor: '#f5f5f5' },
          '&::-webkit-scrollbar-thumb': { backgroundColor: '#ccc', borderRadius: '3px' }
      }}>
        {messages.map((msg, index) => (
          <Box key={index} sx={{ display: 'flex', justifyContent: msg.sender === 'user' ? 'flex-end' : 'flex-start', mb: 2 }}>
            <Paper elevation={1} sx={{ 
                p: 1.5, 
                borderRadius: msg.sender === 'user' ? '20px 20px 5px 20px' : '20px 20px 20px 5px',
                maxWidth: '80%', 
                bgcolor: msg.sender === 'user' ? 'primary.main' : 'white', 
                color: msg.sender === 'user' ? 'primary.contrastText' : 'text.primary',
                wordWrap: 'break-word'
            }}>
              <Typography variant="body1">{msg.text}</Typography>
            </Paper>
          </Box>
        ))}
      </Box>
        <Box sx={{ p: 1, display: 'flex', alignItems: 'center', borderTop: '1px solid #ddd' }}>
          <IconButton onClick={handleMenuClick}><AppsIcon /></IconButton>
          <Menu anchorEl={menuAnchorEl} open={menuOpen} onClose={handleMenuClose}>
            <MenuItem onClick={handleMenuClose} component={Link} href="/signin/signup">{t('menu.register')}</MenuItem>
            <MenuItem onClick={handleMenuClose} component={Link} href="/signin">{t('menu.login')}</MenuItem>
          </Menu>
          <Box sx={{
            flexGrow: 1,
            mx: 1,
            bgcolor: 'action.hover',
            borderRadius: '20px',
            display: 'flex',
            alignItems: 'center',
            px: 1.5,
            py: 0.5
          }}>
            <InputBase
              sx={{ flex: 1 }}
              placeholder={t('placeholder')}
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
            />
          </Box>
          <IconButton><MicIcon /></IconButton>
          <IconButton color="primary" onClick={handleSendMessage}><SendIcon /></IconButton>
        </Box>
    </Popover>
  );
}
