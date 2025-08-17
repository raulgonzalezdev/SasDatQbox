'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import {
  TextField,
  Button,
  Box,
  Grid,
  CircularProgress,
  Paper,
} from '@mui/material';
import { useRouter } from 'next/navigation';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { customFetch } from '@/utils/api';
import { handleApiError } from '@/utils/api-helpers';
import toast from 'react-hot-toast';

// Esquema de validación con Zod
const patientFormSchema = z.object({
  first_name: z.string().min(1, 'El nombre es requerido'),
  last_name: z.string().min(1, 'El apellido es requerido'),
  date_of_birth: z.string().min(1, 'La fecha de nacimiento es requerida'),
  email: z.string().email('Correo electrónico inválido').optional().or(z.literal('')),
  phone: z.string().optional(),
});

type PatientFormData = z.infer<typeof patientFormSchema>;

// Función para enviar los datos a la API
const createPatient = async (data: PatientFormData) => {
  const payload = { ...data, contact_info: { email: data.email, phone: data.phone } };
  return await customFetch('/patients/', { method: 'POST', body: JSON.stringify(payload) });
};

// Nueva función para actualizar un paciente
const updatePatient = async ({ id, data }: { id: string; data: PatientFormData }) => {
  const payload = { ...data, contact_info: { email: data.email, phone: data.phone } };
  return await customFetch(`/patients/${id}`, { method: 'PUT', body: JSON.stringify(payload) });
};

interface PatientFormProps {
  patient?: any; // Hacemos el paciente opcional
}

export default function PatientForm({ patient }: PatientFormProps) {
  const router = useRouter();
  const queryClient = useQueryClient();
  const isEditMode = !!patient;

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<PatientFormData>({
    resolver: zodResolver(patientFormSchema),
    // Establecemos los valores por defecto si estamos en modo edición
    defaultValues: {
      first_name: patient?.first_name || '',
      last_name: patient?.last_name || '',
      date_of_birth: patient?.date_of_birth ? new Date(patient.date_of_birth).toISOString().split('T')[0] : '',
      email: patient?.contact_info?.email || '',
      phone: patient?.contact_info?.phone || '',
    },
  });

  const { mutate: mutatePatient, isPending } = useMutation({
    mutationFn: isEditMode ? updatePatient : createPatient,
    onSuccess: () => {
      toast.success(`Paciente ${isEditMode ? 'actualizado' : 'creado'} exitosamente`);
      queryClient.invalidateQueries({ queryKey: ['patients'] });
      router.push('/account/patients');
    },
    onError: handleApiError,
  });

  const onSubmit = (data: PatientFormData) => {
    if (isEditMode) {
      mutatePatient({ id: patient.id, data });
    } else {
      mutatePatient(data);
    }
  };

  return (
    <Paper sx={{ p: 4 }}>
      <Box component="form" onSubmit={handleSubmit(onSubmit)} noValidate>
        <Grid container spacing={3}>
          <Grid item xs={12} sm={6}>
            <TextField
              required
              fullWidth
              id="first_name"
              label="Nombre"
              {...register('first_name')}
              error={!!errors.first_name}
              helperText={errors.first_name?.message}
              disabled={isPending}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              required
              fullWidth
              id="last_name"
              label="Apellido"
              {...register('last_name')}
              error={!!errors.last_name}
              helperText={errors.last_name?.message}
              disabled={isPending}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              required
              fullWidth
              id="date_of_birth"
              label="Fecha de Nacimiento"
              type="date"
              InputLabelProps={{ shrink: true }}
              {...register('date_of_birth')}
              error={!!errors.date_of_birth}
              helperText={errors.date_of_birth?.message}
              disabled={isPending}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              id="email"
              label="Correo Electrónico"
              type="email"
              {...register('email')}
              error={!!errors.email}
              helperText={errors.email?.message}
              disabled={isPending}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              id="phone"
              label="Teléfono"
              {...register('phone')}
              error={!!errors.phone}
              helperText={errors.phone?.message}
              disabled={isPending}
            />
          </Grid>
        </Grid>
        <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 3 }}>
          <Button
            variant="text"
            onClick={() => router.back()}
            disabled={isPending}
            sx={{ mr: 2 }}
          >
            Cancelar
          </Button>
          <Button
            type="submit"
            variant="contained"
            disabled={isPending}
          >
            {isPending ? <CircularProgress size={24} /> : 'Guardar Paciente'}
          </Button>
        </Box>
      </Box>
    </Paper>
  );
}
