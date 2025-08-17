'use client';
import PatientForm from '@/components/ui/Dashboard/PatientForm';
import { Container, Typography, Paper, Box } from '@mui/material';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { toast } from 'react-hot-toast';
import { customFetch } from '@/utils/api';
import { handleApiError } from '@/utils/api-helpers';

// La función que se comunica con la API para crear el paciente
const createPatient = async (data: any) => {
  const res = await customFetch('/api/v1/patients/', {
    method: 'POST',
    body: JSON.stringify(data),
  });
  if (!res.ok) {
    const errorData = await res.json();
    throw new Error(errorData.detail || 'Error al crear el paciente');
  }
  return res.json();
};

export default function NewPatientPage() {
  const router = useRouter();
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: createPatient,
    onSuccess: () => {
      toast.success('Paciente creado exitosamente');
      queryClient.invalidateQueries({ queryKey: ['patients'] });
      router.push('/account/patients');
    },
    onError: (error) => {
      handleApiError(error);
    },
  });

  const handleSubmit = (data: any) => {
    // Aquí podrías transformar la data si el backend espera una estructura diferente
    mutation.mutate(data);
  };

  return (
    <Container maxWidth="md">
      <Paper sx={{ p: { xs: 2, md: 4 }, mt: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Registrar Nuevo Paciente
        </Typography>
        <Typography paragraph color="text.secondary">
          Completa los siguientes campos para añadir un nuevo paciente a tu lista.
        </Typography>
        <Box mt={4}>
          <PatientForm onSubmit={handleSubmit} isSubmitting={mutation.isPending} />
        </Box>
      </Paper>
    </Container>
  );
}
