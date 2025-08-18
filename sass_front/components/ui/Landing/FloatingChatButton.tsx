'use client';
import { Fab, Tooltip, Zoom } from '@mui/material';
import ChatIcon from '@mui/icons-material/Chat';
import { useState, useRef } from 'react';
import SupportChatPopover from './SupportChatPopover';

export default function FloatingChatButton() {
  const [isOpen, setIsOpen] = useState(false);
  const anchorEl = useRef<HTMLButtonElement>(null);

  const handleClick = () => {
    setIsOpen(!isOpen);
  };

  const handleClose = () => {
    setIsOpen(false);
  };

  return (
    <>
      <Zoom in={!isOpen}>
        <Tooltip title="Chat de Soporte" placement="left">
          <Fab
            ref={anchorEl}
            color="primary"
            aria-label="chat"
            onClick={handleClick}
            sx={{
              position: 'fixed',
              bottom: 16,
              right: 16,
              zIndex: 1000,
              backgroundColor: 'primary.main',
              '&:hover': {
                backgroundColor: 'primary.dark',
              },
            }}
          >
            <ChatIcon />
          </Fab>
        </Tooltip>
      </Zoom>
      
      <SupportChatPopover
        open={isOpen}
        onClose={handleClose}
        anchorEl={anchorEl.current}
      />
    </>
  );
}
