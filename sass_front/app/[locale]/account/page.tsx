'use client';

import { useQuery } from '@tanstack/react-query';
import { Grid, CircularProgress, Typography, Box } from '@mui/material';
import StatCard from '@/components/ui/Dashboard/StatCard';
import MonthlyRevenueChart from '@/components/ui/Dashboard/MonthlyRevenueChart';
import PeopleIcon from '@mui/icons-material/People';
import MonetizationOnIcon from '@mui/icons-material/MonetizationOn';
import { customFetch } from '@/utils/api';
import { useAuth } from '@/hooks/useAuth';

const fetchDashboardStats = async () => {
  const res = await customFetch('/api/v1/dashboard/stats');
  if (!res.ok) {
    throw new Error('Error al cargar las estadísticas del dashboard');
  }
  return res.json();
};

export default function AccountPage() {
  const { user } = useAuth();
  
  const { data: stats, isLoading, error } = useQuery({
    queryKey: ['dashboardStats'],
    queryFn: fetchDashboardStats,
    enabled: !!user, // Solo ejecuta la consulta si el usuario está cargado
  });

  if (isLoading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return <Typography color="error">No se pudieron cargar los datos del dashboard.</Typography>;
  }

  return (
    <Grid container spacing={3}>
      {/* Stat Card for Patients */}
      <Grid item xs={12} md={6}>
        <StatCard
          title="Total de Pacientes"
          value={stats?.patient_count.toString() ?? '0'}
          icon={<PeopleIcon color="primary" sx={{ fontSize: 40 }} />}
        />
      </Grid>
      {/* Stat Card for Revenue */}
      <Grid item xs={12} md={6}>
        <StatCard
          title="Ingresos de Hoy"
          value={`$${stats?.todays_revenue.toFixed(2) ?? '0.00'}`}
          icon={<MonetizationOnIcon color="success" sx={{ fontSize: 40 }} />}
        />
      </Grid>
      {/* Monthly Revenue Chart */}
      <Grid item xs={12}>
        <MonthlyRevenueChart />
      </Grid>
    </Grid>
  );
}
