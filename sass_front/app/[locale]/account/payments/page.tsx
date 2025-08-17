'use client';
import { useState } from 'react';
import {
  Box, Typography, Button, Dialog, DialogContent, DialogTitle, DialogActions
} from '@mui/material';
import AddCardIcon from '@mui/icons-material/AddCard';
import PaymentsTable from '@/components/ui/Dashboard/PaymentsTable';
import PaymentForm from '@/components/ui/Dashboard/PaymentForm';

export default function PaymentsPage() {
  const [open, setOpen] = useState(false);

  const handleClickOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const handlePaymentSubmit = (data: any) => {
    console.log('Payment data:', data);
    // Aquí iría la lógica de `useMutation`
    handleClose();
  };

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
        <Typography variant="h4" component="h1">
          Procesamiento de Pagos
        </Typography>
        <Button
          variant="contained"
          color="primary"
          startIcon={<AddCardIcon />}
          onClick={handleClickOpen}
        >
          Registrar Nuevo Pago
        </Button>
      </Box>
      <PaymentsTable />

      {/* --- Modal para registrar pago --- */}
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>Registrar un Nuevo Pago</DialogTitle>
        <DialogContent>
          <PaymentForm
            onSubmit={handlePaymentSubmit}
            isSubmitting={false /* Aquí iría mutation.isPending */}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancelar</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
