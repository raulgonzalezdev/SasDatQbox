'use client';

import { customFetch } from '@/utils/api';
import { Box, Typography, CircularProgress } from '@mui/material';
import PatientForm from '@/components/ui/Dashboard/PatientForm';
import { useQuery } from '@tanstack/react-query';

const fetchPatientById = async (id: string) => {
  return await customFetch(`/patients/${id}`);
};

export default function EditPatientPage({ params }: { params: { id: string } }) {
  const { data: patient, isLoading, isError } = useQuery({
    queryKey: ['patient', params.id],
    queryFn: () => fetchPatientById(params.id)
  });

  if (isLoading) {
    return <CircularProgress />;
  }

  if (isError || !patient) {
    return (
      <Box>
        <Typography variant="h4">Paciente no encontrado</Typography>
        <Typography>No se pudo encontrar al paciente con el ID especificado o hubo un error al cargarlo.</Typography>
      </Box>
    );
  }

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Editar Paciente
      </Typography>
      <PatientForm patient={patient} />
    </Box>
  );
}
