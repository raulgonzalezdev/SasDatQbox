'use client';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { Container, Typography, Paper, Box, CircularProgress } from '@mui/material';
import PatientForm from '@/components/ui/Dashboard/PatientForm';
import { customFetch } from '@/utils/api';
import { toast } from 'react-hot-toast';
import { handleApiError } from '@/utils/api-helpers';

// Función para obtener un paciente por ID
const fetchPatientById = async (id: string) => {
  const res = await customFetch(`/api/v1/patients/${id}`);
  if (!res.ok) throw new Error('No se pudo cargar la información del paciente.');
  return res.json();
};

// Función para actualizar un paciente
const updatePatient = async ({ id, data }: { id: string; data: any }) => {
  const res = await customFetch(`/api/v1/patients/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  });
  if (!res.ok) {
    const errorData = await res.json();
    throw new Error(errorData.detail || 'Error al actualizar el paciente');
  }
  return res.json();
};

export default function EditPatientPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const queryClient = useQueryClient();
  const patientId = params.id;

  const { data: patient, isLoading, error } = useQuery({
    queryKey: ['patient', patientId],
    queryFn: () => fetchPatientById(patientId),
    enabled: !!patientId, // Solo ejecuta la query si el ID existe
  });

  const mutation = useMutation({
    mutationFn: updatePatient,
    onSuccess: () => {
      toast.success('Paciente actualizado exitosamente');
      queryClient.invalidateQueries({ queryKey: ['patients'] });
      queryClient.invalidateQueries({ queryKey: ['patient', patientId] });
      router.push('/account/patients');
    },
    onError: (error) => {
      handleApiError(error);
    },
  });

  const handleSubmit = (data: any) => {
    mutation.mutate({ id: patientId, data });
  };

  if (isLoading) {
    return <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}><CircularProgress /></Box>;
  }

  if (error) {
    return <Typography color="error" sx={{ mt: 4, textAlign: 'center' }}>{error.message}</Typography>;
  }

  return (
    <Container maxWidth="md">
      <Paper sx={{ p: { xs: 2, md: 4 }, mt: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Editar Paciente
        </Typography>
        <Typography paragraph color="text.secondary">
          Modifica la información del paciente y guarda los cambios.
        </Typography>
        <Box mt={4}>
          {patient && <PatientForm patient={patient} onSubmit={handleSubmit} isSubmitting={mutation.isPending} />}
        </Box>
      </Paper>
    </Container>
  );
}
