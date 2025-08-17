'use client';

import { useEffect } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import {
  TextField,
  Button,
  Box,
  Typography,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  FormHelperText,
  CircularProgress
} from '@mui/material';
import { useRouter } from 'next/navigation';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'react-hot-toast';
import { Patient } from '@/app/schemas/patient';
import { customFetch } from '@/utils/api';
import { handleApiError } from '@/utils/api-helpers';

const appointmentSchema = z.object({
  patient_id: z.string().uuid({ message: 'Por favor, selecciona un paciente.' }),
  appointment_datetime: z.string().refine((val) => !isNaN(Date.parse(val)), {
    message: 'Por favor, introduce una fecha y hora válida.',
  }),
  reason: z.string().min(1, 'El motivo de la consulta es requerido.'),
});

type AppointmentFormData = z.infer<typeof appointmentSchema>;

const fetchPatients = async (): Promise<Patient[]> => {
  const res = await customFetch('/api/v1/patients/');
  if (!res.ok) {
    throw new Error('Error al cargar los pacientes');
  }
  return res.json();
};

export default function AppointmentForm() {
  const router = useRouter();
  const queryClient = useQueryClient();

  const { data: patients, isLoading: isLoadingPatients, error: patientsError } = useQuery<Patient[]>({
    queryKey: ['patients'],
    queryFn: fetchPatients,
  });

  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
    setError
  } = useForm<AppointmentFormData>({
    resolver: zodResolver(appointmentSchema),
    defaultValues: {
      patient_id: '',
      appointment_datetime: '',
      reason: ''
    }
  });

  const mutation = useMutation({
    mutationFn: (newAppointment: AppointmentFormData) => {
        return customFetch('/api/v1/appointments/', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(newAppointment),
        });
    },
    onSuccess: async (res) => {
        if (!res.ok) {
            const errorData = await res.json().catch(() => ({ detail: 'Error al crear la cita.' }));
            throw new Error(errorData.detail);
        }
        toast.success('Consulta creada exitosamente');
        await queryClient.invalidateQueries({ queryKey: ['appointments'] });
        router.push('/account/appointments');
    },
    onError: (error) => {
        handleApiError(error, setError);
    },
  });

  const onSubmit = (data: AppointmentFormData) => {
    mutation.mutate(data);
  };
  
  if (isLoadingPatients) {
    return <CircularProgress />;
  }
  
  if (patientsError) {
    return <Typography color="error">Error al cargar la lista de pacientes.</Typography>;
  }

  return (
    <Box component="form" onSubmit={handleSubmit(onSubmit)} noValidate sx={{ mt: 1 }}>
      <FormControl fullWidth margin="normal" error={!!errors.patient_id}>
        <InputLabel id="patient-select-label">Paciente</InputLabel>
        <Controller
          name="patient_id"
          control={control}
          render={({ field }) => (
            <Select
              labelId="patient-select-label"
              id="patient_id"
              label="Paciente"
              {...field}
            >
              {patients?.map((patient) => (
                <MenuItem key={patient.id} value={patient.id}>
                  {`${patient.first_name} ${patient.last_name}`}
                </MenuItem>
              ))}
            </Select>
          )}
        />
        {errors.patient_id && <FormHelperText>{errors.patient_id.message}</FormHelperText>}
      </FormControl>

      <Controller
        name="appointment_datetime"
        control={control}
        render={({ field }) => (
          <TextField
            {...field}
            margin="normal"
            required
            fullWidth
            id="appointment_datetime"
            label="Fecha y Hora de la Consulta"
            type="datetime-local"
            InputLabelProps={{
              shrink: true,
            }}
            error={!!errors.appointment_datetime}
            helperText={errors.appointment_datetime?.message}
          />
        )}
      />

      <Controller
        name="reason"
        control={control}
        render={({ field }) => (
          <TextField
            {...field}
            margin="normal"
            required
            fullWidth
            id="reason"
            label="Motivo de la Consulta"
            multiline
            rows={4}
            error={!!errors.reason}
            helperText={errors.reason?.message}
          />
        )}
      />

      <Button
        type="submit"
        fullWidth
        variant="contained"
        sx={{ mt: 3, mb: 2 }}
        disabled={isSubmitting || mutation.isPending}
      >
        {isSubmitting || mutation.isPending ? <CircularProgress size={24} /> : 'Programar Consulta'}
      </Button>
    </Box>
  );
}
