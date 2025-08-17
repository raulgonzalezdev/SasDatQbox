'use client';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import {
  TextField, Button, Box, Grid, CircularProgress, MenuItem, FormControl, InputLabel, Select
} from '@mui/material';

const paymentSchema = z.object({
  patientId: z.string().min(1, 'Debes seleccionar un paciente.'),
  amount: z.number().positive('El monto debe ser mayor a cero.'),
  method: z.enum(['Card', 'Transfer', 'Cash']),
});

type PaymentFormData = z.infer<typeof paymentSchema>;

const mockPatients = [
  { id: '1', name: 'Juan Pérez' },
  { id: '2', name: 'Ana Gómez' },
];

interface PaymentFormProps {
  onSubmit: (data: PaymentFormData) => void;
  isSubmitting: boolean;
}

export default function PaymentForm({ onSubmit, isSubmitting }: PaymentFormProps) {
  const { control, handleSubmit, formState: { errors } } = useForm<PaymentFormData>({
    resolver: zodResolver(paymentSchema),
  });

  return (
    <Box component="form" onSubmit={handleSubmit(onSubmit)} noValidate sx={{ mt: 1 }}>
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <FormControl fullWidth error={!!errors.patientId}>
            <InputLabel>Paciente</InputLabel>
            <Controller
              name="patientId"
              control={control}
              render={({ field }) => (
                <Select {...field} label="Paciente">
                  {mockPatients.map(p => <MenuItem key={p.id} value={p.id}>{p.name}</MenuItem>)}
                </Select>
              )}
            />
          </FormControl>
        </Grid>
        <Grid item xs={12} sm={6}>
          <Controller
            name="amount"
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                label="Monto"
                type="number"
                required
                fullWidth
                error={!!errors.amount}
                helperText={errors.amount?.message}
                onChange={e => field.onChange(parseFloat(e.target.value))}
              />
            )}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <FormControl fullWidth error={!!errors.method}>
            <InputLabel>Método de Pago</InputLabel>
            <Controller
              name="method"
              control={control}
              render={({ field }) => (
                <Select {...field} label="Método de Pago">
                  <MenuItem value="Card">Tarjeta</MenuItem>
                  <MenuItem value="Transfer">Transferencia</MenuItem>
                  <MenuItem value="Cash">Efectivo</MenuItem>
                </Select>
              )}
            />
          </FormControl>
        </Grid>
      </Grid>
      <Button
        type="submit"
        fullWidth
        variant="contained"
        sx={{ mt: 3, mb: 2 }}
        disabled={isSubmitting}
      >
        {isSubmitting ? <CircularProgress size={24} /> : 'Registrar Pago'}
      </Button>
    </Box>
  );
}
