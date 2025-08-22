'use client';

import { Fab, Tooltip } from '@mui/material';
import ChatIcon from '@mui/icons-material/Chat';
import React from 'react';

const FloatingChatButton = React.forwardRef<HTMLButtonElement, { onClick: () => void }>(({ onClick }, ref) => {
  return (
    <Tooltip title="Chatea con nosotros" placement="left">
      <Fab
        color="primary"
        aria-label="chat"
        sx={{
          position: 'fixed',
          bottom: 24,
          right: 24,
          zIndex: 1300, 
        }}
        onClick={onClick}
        ref={ref}
      >
        <ChatIcon />
      </Fab>
    </Tooltip>
  );
});

FloatingChatButton.displayName = 'FloatingChatButton';

export default FloatingChatButton;
