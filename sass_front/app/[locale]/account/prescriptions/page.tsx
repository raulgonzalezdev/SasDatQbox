'use client';
import { useState } from 'react';
import {
  Box, Typography, Button, Paper, Dialog, DialogContent, DialogTitle, IconButton, Slide
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import CloseIcon from '@mui/icons-material/Close';
import PrescriptionForm from '@/components/ui/Dashboard/PrescriptionForm';
import { TransitionProps } from '@mui/material/transitions';
import React from 'react';

// --- Transición para el Dialog ---
const Transition = React.forwardRef(function Transition(
  props: TransitionProps & { children: React.ReactElement },
  ref: React.Ref<unknown>,
) {
  return <Slide direction="up" ref={ref} {...props} />;
});

export default function PrescriptionsPage() {
  const [open, setOpen] = useState(false);

  const handleClickOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
        <Typography variant="h4" component="h1">
          Gestión de Recetas
        </Typography>
        <Button
          variant="contained"
          color="primary"
          startIcon={<AddIcon />}
          onClick={handleClickOpen}
        >
          Crear Nueva Receta
        </Button>
      </Box>
      <Paper sx={{ p: 3, textAlign: 'center' }}>
        <Typography color="text.secondary">
          Aquí se mostrará la lista de recetas médicas.
        </Typography>
        {/* Aquí iría la PrescriptionsTable en el futuro */}
      </Paper>

      {/* --- Modal para crear receta --- */}
      <Dialog
        fullScreen
        open={open}
        onClose={handleClose}
        TransitionComponent={Transition}
      >
        <DialogTitle sx={{ bgcolor: 'primary.main', color: 'white' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            Nueva Receta Médica
            <IconButton edge="end" color="inherit" onClick={handleClose} aria-label="close">
              <CloseIcon />
            </IconButton>
          </Box>
        </DialogTitle>
        <DialogContent sx={{ p: 3 }}>
          <PrescriptionForm />
        </DialogContent>
      </Dialog>
    </Box>
  );
}
