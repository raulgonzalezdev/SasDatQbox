'use client';

import { useState } from 'react';
import { Box, Paper, Grid } from '@mui/material';
import ConversationList from '@/components/ui/Dashboard/ConversationList';
import MessagePanel from '@/components/ui/Dashboard/MessagePanel';

export default function ChatPage() {
  const [selectedConversationId, setSelectedConversationId] = useState<string | null>(null);

  return (
    <Paper sx={{ height: 'calc(100vh - 120px)', display: 'flex', overflow: 'hidden' }}>
      <Grid container sx={{ height: '100%' }}>
        <Grid item xs={12} sm={4} md={3} sx={{ height: '100%', borderRight: '1px solid #ddd' }}>
          <ConversationList onSelectConversation={setSelectedConversationId} />
        </Grid>
        <Grid item xs={12} sm={8} md={9} sx={{ height: '100%' }}>
          <MessagePanel conversationId={selectedConversationId} />
        </Grid>
      </Grid>
    </Paper>
  );
}
