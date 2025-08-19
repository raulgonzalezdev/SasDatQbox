'use client';

import { Grid, CircularProgress, Typography, Box } from '@mui/material';
import StatCard from '@/components/ui/Dashboard/StatCard';
import MonthlyRevenueChart from '@/components/ui/Dashboard/MonthlyRevenueChart';
import PeopleIcon from '@mui/icons-material/People';
import MonetizationOnIcon from '@mui/icons-material/MonetizationOn';
import EventIcon from '@mui/icons-material/Event';
import ChatIcon from '@mui/icons-material/Chat';
import { useAuth } from '@/hooks/useAuth';
import { usePatients } from '@/hooks/usePatients';
import { useAppointments } from '@/hooks/useAppointments';
import { useChat } from '@/hooks/useChat';
import { useTranslations } from 'next-intl';
import { useAppStore } from '@/store/appStore';
import { useEffect } from 'react';

export default function AccountPage() {
  const { user } = useAuth();
  const { patients, isLoading: patientsLoading } = usePatients();
  const { appointments, isLoading: appointmentsLoading } = useAppointments();
  const { conversations, isLoading: chatLoading } = useChat();
  const t = useTranslations('Dashboard');
  const { setCurrentDashboardSection } = useAppStore();
  
  // Establecer la sección actual del dashboard
  useEffect(() => {
    setCurrentDashboardSection('dashboard');
  }, [setCurrentDashboardSection]);
  
  // Calculate dashboard stats from hooks data
  const dashboardStats = {
    patient_count: patients.length,
    appointment_count: appointments.length,
    todays_appointments: appointments.filter(apt => {
      const today = new Date().toISOString().split('T')[0];
      return apt.appointment_datetime.startsWith(today);
    }).length,
    active_conversations: conversations.length,
    todays_revenue: appointments.filter(apt => {
      const today = new Date().toISOString().split('T')[0];
      return apt.appointment_datetime.startsWith(today);
    }).length * 50 // Mock revenue calculation: $50 per appointment
  };

  const isLoading = patientsLoading || appointmentsLoading || chatLoading;

  if (isLoading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Grid container spacing={3}>
      {/* Stat Card for Patients */}
      <Grid item xs={12} sm={6} md={3}>
        <StatCard
          title={t('stats.totalPatients')}
          value={dashboardStats.patient_count.toString()}
          icon={<PeopleIcon color="primary" sx={{ fontSize: 40 }} />}
        />
      </Grid>
      
      {/* Stat Card for Appointments */}
      <Grid item xs={12} sm={6} md={3}>
        <StatCard
          title={t('stats.totalAppointments')}
          value={dashboardStats.appointment_count.toString()}
          icon={<EventIcon color="info" sx={{ fontSize: 40 }} />}
        />
      </Grid>
      
      {/* Stat Card for Today's Appointments */}
      <Grid item xs={12} sm={6} md={3}>
        <StatCard
          title={t('stats.todayAppointments')}
          value={dashboardStats.todays_appointments.toString()}
          icon={<EventIcon color="warning" sx={{ fontSize: 40 }} />}
        />
      </Grid>
      
      {/* Stat Card for Revenue */}
      <Grid item xs={12} sm={6} md={3}>
        <StatCard
          title={t('stats.todayRevenue')}
          value={`$${dashboardStats.todays_revenue.toFixed(2)}`}
          icon={<MonetizationOnIcon color="success" sx={{ fontSize: 40 }} />}
        />
      </Grid>
      
      {/* Stat Card for Active Conversations */}
      <Grid item xs={12} sm={6} md={3}>
        <StatCard
          title={t('stats.activeConversations')}
          value={dashboardStats.active_conversations.toString()}
          icon={<ChatIcon color="secondary" sx={{ fontSize: 40 }} />}
        />
      </Grid>
      
      {/* Monthly Revenue Chart */}
      <Grid item xs={12}>
        <MonthlyRevenueChart />
      </Grid>
    </Grid>
  );
}
