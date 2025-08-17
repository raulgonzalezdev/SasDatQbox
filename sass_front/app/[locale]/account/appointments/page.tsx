'use client';

import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Box, Typography, Button, CircularProgress } from '@mui/material';
import Link from 'next/link';
import AppointmentsTable from '@/components/ui/Dashboard/AppointmentsTable';
import { customFetch } from '@/utils/api';

const fetchAppointments = async () => {
  const res = await customFetch('/api/v1/appointments/');
  if (!res.ok) {
    throw new Error('Network response was not ok');
  }
  return res.json();
};

export default function AppointmentsPage() {
  const { data: appointments, error, isLoading } = useQuery({
    queryKey: ['appointments'],
    queryFn: fetchAppointments
  });

  if (isLoading) {
    return <CircularProgress />;
  }

  if (error) {
    return <Typography color="error">Error al cargar las consultas: {error.message}</Typography>;
  }

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
        <Typography variant="h4" component="h1">
          Consultas Programadas
        </Typography>
        <Button
          variant="contained"
          color="primary"
          component={Link}
          href="/account/appointments/new"
        >
          Nueva Consulta
        </Button>
      </Box>
      <AppointmentsTable appointments={appointments || []} />
    </Box>
  );
}
