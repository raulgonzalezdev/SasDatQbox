'use client';
import { Drawer, Box, Typography, TextField, Button, IconButton } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { useState } from 'react';

export default function ContactDrawer() {
  const [open, setOpen] = useState(false);

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  return (
    <>
      <Button
        variant="outlined"
        color="primary"
        onClick={handleOpen}
        sx={{ position: 'fixed', left: 16, bottom: 16, zIndex: 1000 }}
      >
        Contacto
      </Button>
      
      <Drawer
        anchor="left"
        open={open}
        onClose={handleClose}
        sx={{
          '& .MuiDrawer-paper': {
            width: 400,
            maxWidth: '90vw',
          },
        }}
      >
        <Box sx={{ p: 3 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
            <Typography variant="h5" color="primary.main">
              Contacto
            </Typography>
            <IconButton onClick={handleClose}>
              <CloseIcon />
            </IconButton>
          </Box>
          
          <Box component="form" sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            <TextField
              label="Nombre"
              variant="outlined"
              fullWidth
              required
            />
            <TextField
              label="Email"
              type="email"
              variant="outlined"
              fullWidth
              required
            />
            <TextField
              label="Asunto"
              variant="outlined"
              fullWidth
              required
            />
            <TextField
              label="Mensaje"
              variant="outlined"
              multiline
              rows={4}
              fullWidth
              required
            />
            <Button
              type="submit"
              variant="contained"
              color="primary"
              sx={{ mt: 2 }}
            >
              Enviar Mensaje
            </Button>
          </Box>
        </Box>
      </Drawer>
    </>
  );
}
