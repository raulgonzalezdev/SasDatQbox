'use client';

import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import {
  TextField,
  Button,
  Box,
  Grid,
  CircularProgress,
  MenuItem
} from '@mui/material';
import { Patient } from '@/app/schemas/patient'; // Asumiendo que tienes un schema de Zod para Patient

// Schema de validación para el formulario
const patientFormSchema = z.object({
  first_name: z.string().min(1, 'El nombre es requerido.'),
  last_name: z.string().min(1, 'El apellido es requerido.'),
  email: z.string().email('Email inválido.').min(1, 'El email es requerido.'),
  phone_number: z.string().optional(),
  date_of_birth: z.string().min(1, 'La fecha de nacimiento es requerida.'),
  gender: z.enum(['MALE', 'FEMALE', 'OTHER']),
});

type PatientFormData = z.infer<typeof patientFormSchema>;

interface PatientFormProps {
  patient?: Patient; // Opcional, para modo edición
  onSubmit: (data: PatientFormData) => void;
  isSubmitting: boolean;
}

export default function PatientForm({ patient, onSubmit, isSubmitting }: PatientFormProps) {
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<PatientFormData>({
    resolver: zodResolver(patientFormSchema),
    defaultValues: {
      first_name: patient?.first_name || '',
      last_name: patient?.last_name || '',
      email: patient?.contact_info?.email || '',
      phone_number: patient?.contact_info?.phone_number || '',
      date_of_birth: patient?.demographics?.date_of_birth ? new Date(patient.demographics.date_of_birth).toISOString().split('T')[0] : '',
      gender: patient?.demographics?.gender || 'OTHER',
    },
  });

  return (
    <Box component="form" onSubmit={handleSubmit(onSubmit)} noValidate sx={{ mt: 1 }}>
      <Grid container spacing={2}>
        <Grid item xs={12} sm={6}>
          <Controller
            name="first_name"
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                label="Nombre"
                required
                fullWidth
                error={!!errors.first_name}
                helperText={errors.first_name?.message}
              />
            )}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <Controller
            name="last_name"
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                label="Apellido"
                required
                fullWidth
                error={!!errors.last_name}
                helperText={errors.last_name?.message}
              />
            )}
          />
        </Grid>
        <Grid item xs={12}>
          <Controller
            name="email"
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                label="Email"
                type="email"
                required
                fullWidth
                error={!!errors.email}
                helperText={errors.email?.message}
              />
            )}
          />
        </Grid>
        <Grid item xs={12}>
          <Controller
            name="phone_number"
            control={control}
            render={({ field }) => (
              <TextField {...field} label="Número de Teléfono" fullWidth />
            )}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <Controller
            name="date_of_birth"
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                label="Fecha de Nacimiento"
                type="date"
                required
                fullWidth
                InputLabelProps={{ shrink: true }}
                error={!!errors.date_of_birth}
                helperText={errors.date_of_birth?.message}
              />
            )}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <Controller
            name="gender"
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                select
                label="Género"
                fullWidth
                required
                error={!!errors.gender}
                helperText={errors.gender?.message}
              >
                <MenuItem value="MALE">Masculino</MenuItem>
                <MenuItem value="FEMALE">Femenino</MenuItem>
                <MenuItem value="OTHER">Otro</MenuItem>
              </TextField>
            )}
          />
        </Grid>
      </Grid>
      <Button
        type="submit"
        fullWidth
        variant="contained"
        sx={{ mt: 3, mb: 2 }}
        disabled={isSubmitting}
      >
        {isSubmitting ? <CircularProgress size={24} /> : (patient ? 'Guardar Cambios' : 'Crear Paciente')}
      </Button>
    </Box>
  );
}
