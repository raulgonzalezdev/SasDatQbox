'use client';

import React, { useState, useMemo } from 'react';
import {
  Box,
  Container,
  Typography,
  Button,
  Grid,
  Paper,
  Avatar,
  Chip,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  ToggleButton,
  ToggleButtonGroup,
} from '@mui/material';
import {
  Add as AddIcon,
  Person as PersonIcon,
  Delete as DeleteIcon,
  Close as CloseIcon,
  Schedule as ScheduleIcon,
  Event as EventIcon,
  Today as TodayIcon,
  ChevronLeft as ChevronLeftIcon,
  ChevronRight as ChevronRightIcon,
} from '@mui/icons-material';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { TimePicker } from '@mui/x-date-pickers/TimePicker';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs, { Dayjs } from 'dayjs';
import weekOfYear from 'dayjs/plugin/weekOfYear';

dayjs.extend(weekOfYear);

import { useAppointmentStore, Appointment } from '@/stores/appointmentStore';
import { usePatients } from '@/hooks/usePatients';
import { useAuth } from '@/hooks/useAuth';

type ViewMode = 'week' | 'month';

export default function AppointmentsPage() {
  const { user } = useAuth();
  const { patients } = usePatients();

  const {
    selectedDate,
    appointments,
    setSelectedDate,
    addAppointment,
    getAppointmentsForDate,
  } = useAppointmentStore();

  const sd = useMemo(() => dayjs(selectedDate), [selectedDate]);

  const [viewMode, setViewMode] = useState<ViewMode>('week');
  const [newAppointmentForm, setNewAppointmentForm] = useState({
    patient_id: '',
    appointment_datetime: dayjs(),
    reason: '',
    notes: '',
  });

  // Slots horarios
  const timeSlots = useMemo(() => {
    const slots: Dayjs[] = [];
    for (let hour = 8; hour <= 20; hour++) {
      for (let minute = 0; minute < 60; minute += 30) {
        slots.push(dayjs().hour(hour).minute(minute));
      }
    }
    return slots;
  }, []);

  // Días de la semana
  const weekDays = useMemo(() => {
    const days: Dayjs[] = [];
    const startOfWeek = sd.startOf('week');
    for (let i = 0; i < 7; i++) {
      days.push(startOfWeek.add(i, 'day'));
    }
    return days;
  }, [sd]);

  // Mini calendario mensual
  const calendarDays = useMemo(() => {
    const startOfMonth = sd.startOf('month');
    const endOfMonth = sd.endOf('month');
    const startOfCalendar = startOfMonth.startOf('week');
    const endOfCalendar = endOfMonth.endOf('week');

    const days: Dayjs[] = [];
    let current = startOfCalendar;

    while (current.isBefore(endOfCalendar) || current.isSame(endOfCalendar, 'day')) {
      days.push(current);
      current = current.add(1, 'day');
    }
    return days;
  }, [sd]);

  const getMonthName = (date: Dayjs) => {
    const months = [
      'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
      'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
    ];
    return months[date.month()];
  };

  // Crear cita rápida
  const handleCreateAppointment = () => {
    if (!user || !newAppointmentForm.patient_id) return;
    const newAppointment: Appointment = {
      id: Date.now().toString(),
      patient_id: newAppointmentForm.patient_id,
      doctor_id: user.id,
      appointment_datetime: newAppointmentForm.appointment_datetime.toISOString(),
      reason: newAppointmentForm.reason,
      notes: newAppointmentForm.notes,
      status: 'scheduled',
      patient: patients.find(p => p.id === newAppointmentForm.patient_id),
      doctor: { id: user.id, first_name: user.first_name, last_name: user.last_name },
    };
    addAppointment(newAppointment);
    setNewAppointmentForm({ patient_id: '', appointment_datetime: dayjs(), reason: '', notes: '' });
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <Container maxWidth="xl" sx={{ py: 3 }}>
        {/* Encabezado */}
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
          <Typography variant="h4" sx={{ fontWeight: 'bold', color: 'primary.main' }}>
            Agenda de citas
          </Typography>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            sx={{ backgroundColor: 'orange.main', '&:hover': { backgroundColor: 'orange.dark' } }}
          >
            Agendar nueva cita
          </Button>
        </Box>

        <Grid container spacing={2}>
          {/* Panel izquierdo */}
          <Grid item xs={12} md={3}>
            <Paper sx={{ p: 2, mb: 2 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                <IconButton onClick={() => setSelectedDate(sd.subtract(1, 'month'))}>
                  <ChevronLeftIcon />
                </IconButton>
                <Typography variant="h6">{getMonthName(sd)} {sd.year()}</Typography>
                <IconButton onClick={() => setSelectedDate(sd.add(1, 'month'))}>
                  <ChevronRightIcon />
                </IconButton>
              </Box>

              {/* Mini calendario */}
              <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: 1 }}>
                {['L', 'M', 'M', 'J', 'V', 'S', 'D'].map((d, i) => (
                  <Typography key={i} align="center" sx={{ fontWeight: 'bold' }}>{d}</Typography>
                ))}
                {calendarDays.map((date, idx) => {
                  const isToday = date.isSame(dayjs(), 'day');
                  const isSelected = date.isSame(sd, 'day');
                  const hasAppointments = getAppointmentsForDate(date).length > 0;
                  return (
                    <Box
                      key={idx}
                      onClick={() => setSelectedDate(date)}
                      sx={{
                        textAlign: 'center',
                        py: 1,
                        borderRadius: '50%',
                        cursor: 'pointer',
                        backgroundColor: isSelected ? 'primary.main' : isToday ? 'primary.light' : 'transparent',
                        color: isSelected ? 'white' : isToday ? 'primary.main' : 'text.primary',
                        fontWeight: hasAppointments ? 'bold' : 'normal',
                        '&:hover': { backgroundColor: 'grey.200' },
                      }}
                    >
                      {date.date()}
                    </Box>
                  );
                })}
              </Box>
            </Paper>

            {/* Citas de hoy */}
            <Paper sx={{ p: 2 }}>
              <Typography variant="h6" gutterBottom>Hoy</Typography>
              <List>
                {getAppointmentsForDate(dayjs()).map((apt) => (
                  <ListItem key={apt.id}>
                    <ListItemAvatar>
                      <Avatar sx={{ bgcolor: 'primary.main' }}><PersonIcon /></Avatar>
                    </ListItemAvatar>
                    <ListItemText
                      primary={`${apt.patient?.first_name} ${apt.patient?.last_name}`}
                      secondary={`${dayjs(apt.appointment_datetime).format('HH:mm')} - ${apt.reason}`}
                    />
                  </ListItem>
                ))}
                {getAppointmentsForDate(dayjs()).length === 0 && (
                  <Typography variant="body2" color="text.secondary" align="center">No hay citas hoy</Typography>
                )}
              </List>
            </Paper>
          </Grid>

          {/* Panel derecho - Vista semanal */}
          <Grid item xs={12} md={9}>
            <Paper sx={{ p: 2 }}>
              <Box sx={{ display: 'grid', gridTemplateColumns: '80px repeat(7, 1fr)', mb: 1 }}>
                <Box></Box>
                {weekDays.map((d, i) => (
                  <Typography key={i} align="center" sx={{ fontWeight: 'bold' }}>
                    {d.format('ddd DD')}
                  </Typography>
                ))}
              </Box>

              <Box sx={{ maxHeight: 600, overflow: 'auto', position: 'relative' }}>
                {timeSlots.map((t) => (
                  <Box key={t.format('HH:mm')} sx={{ display: 'grid', gridTemplateColumns: '80px repeat(7, 1fr)', gap: 1 }}>
                    <Typography align="right" sx={{ pr: 1, color: 'text.secondary' }}>{t.format('HH:mm')}</Typography>
                    {weekDays.map((d, i) => {
                      const hasApt = getAppointmentsForDate(d).some((apt) =>
                        dayjs(apt.appointment_datetime).hour() === t.hour() &&
                        dayjs(apt.appointment_datetime).minute() === t.minute()
                      );
                      return (
                        <Box key={i} sx={{
                          minHeight: 40,
                          border: '1px solid',
                          borderColor: 'divider',
                          backgroundColor: hasApt ? 'primary.light' : 'transparent',
                          cursor: hasApt ? 'pointer' : 'default',
                        }} />
                      );
                    })}
                  </Box>
                ))}
                {/* Línea de hora actual */}
                <Box sx={{
                  position: 'absolute',
                  left: 80,
                  right: 0,
                  top: `${(dayjs().hour() - 8) * 80 + (dayjs().minute() / 60) * 80}px`,
                  height: '2px',
                  backgroundColor: 'red'
                }} />
              </Box>
            </Paper>
          </Grid>
        </Grid>
      </Container>
    </LocalizationProvider>
  );
}
