'use client';

import React, { useMemo } from 'react';
import { Box, Container, Typography, Paper, Grid, Button, IconButton } from '@mui/material';
import { useRouter } from 'next/navigation';
import dayjs, { Dayjs } from 'dayjs';
import 'dayjs/locale/es';
import weekOfYear from 'dayjs/plugin/weekOfYear';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
dayjs.extend(weekOfYear);
dayjs.locale('es');

import { useAppointmentStore } from '@/stores/appointmentStore';

export default function AppointmentsPage() {
  const { selectedDate, setSelectedDate, getAppointmentsForDate } = useAppointmentStore();
  const router = useRouter();

  const sd = useMemo(() => dayjs(selectedDate), [selectedDate]);

  // slots horarios
  const timeSlots = useMemo(() => {
    const slots: Dayjs[] = [];
    for (let h = 8; h <= 20; h++) {
      for (let m = 0; m < 60; m += 30) {
        slots.push(dayjs(sd).hour(h).minute(m));
      }
    }
    return slots;
  }, [sd]);

  // días de la semana actual
  const weekDays = useMemo(() => {
    const days: Dayjs[] = [];
    const start = sd.startOf('week');
    for (let i = 0; i < 7; i++) days.push(start.add(i, 'day'));
    return days;
  }, [sd]);

  // días del mes para el calendario lateral
  const calendarDays = useMemo(() => {
    const start = sd.startOf('month').startOf('week');
    const end = sd.endOf('month').endOf('week');
    const days: Dayjs[] = [];
    let day = start;
    while (day.isBefore(end) || day.isSame(end, 'day')) {
      days.push(day);
      day = day.add(1, 'day');
    }
    return days;
  }, [sd]);

  // cita en hora específica
  const getAppointmentAt = (date: Dayjs, time: Dayjs) => {
    return getAppointmentsForDate(date).find((apt) => {
      const aptDate = dayjs(apt.appointment_datetime);
      return aptDate.hour() === time.hour() && aptDate.minute() === time.minute();
    });
  };

  return (
    <Container maxWidth="xl" sx={{ py: 3 }}>
      <Typography variant="h4" sx={{ fontWeight: 'bold', mb: 2 }}>
        Agenda de citas
      </Typography>

      <Grid container spacing={2}>
        {/* Panel izquierdo */}
        <Grid item xs={12} md={3}>
          <Paper sx={{ p: 2, mb: 2 }}>
            {/* Navegador de mes */}
            <Box display="flex" justifyContent="space-between" alignItems="center" mb={1}>
              <IconButton onClick={() => setSelectedDate(sd.subtract(1, 'month'))}>
                <ChevronLeftIcon />
              </IconButton>
              <Typography variant="h6">{sd.format('MMMM YYYY')}</Typography>
              <IconButton onClick={() => setSelectedDate(sd.add(1, 'month'))}>
                <ChevronRightIcon />
              </IconButton>
            </Box>

            {/* Calendario mensual */}
            <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: 1 }}>
              {calendarDays.map((date, index) => {
                const isToday = date.isSame(dayjs(), 'day');
                const isSelected = date.isSame(sd, 'day');
                const hasAppointments = getAppointmentsForDate(date).length > 0;

                return (
                  <Box
                    key={index}
                    onClick={() => setSelectedDate(date)}
                    sx={{
                      textAlign: 'center',
                      py: 1,
                      cursor: 'pointer',
                      borderRadius: '50%',
                      bgcolor: isSelected ? 'primary.main' : isToday ? 'secondary.light' : 'transparent',
                      color: isSelected ? 'white' : 'text.primary',
                      fontWeight: hasAppointments ? 'bold' : 'normal',
                      '&:hover': { bgcolor: 'grey.200' },
                    }}
                  >
                    {date.date()}
                  </Box>
                );
              })}
            </Box>
          </Paper>

          {/* citas del día */}
          <Paper sx={{ p: 2, mb: 2 }}>
            <Typography variant="subtitle1" gutterBottom>
              {/* 👇 ahora muestra el día seleccionado */}
              {sd.format('dddd DD [de] MMMM')}
            </Typography>
            {getAppointmentsForDate(sd).length === 0 ? (
              <Typography variant="body2" color="text.secondary">
                No hay citas este día
              </Typography>
            ) : (
              getAppointmentsForDate(sd).map((apt) => (
                <Box
                  key={apt.id}
                  onDoubleClick={() => router.push(`/account/appointments/${apt.id}`)}
                  sx={{
                    p: 1,
                    mb: 1,
                    borderRadius: 1,
                    bgcolor: 'primary.light',
                    cursor: 'pointer',
                  }}
                >
                  <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
                    {apt.patient?.first_name} {apt.patient?.last_name}
                  </Typography>
                  <Typography variant="caption">
                    {dayjs(apt.appointment_datetime).format('HH:mm')}
                  </Typography>
                </Box>
              ))
            )}
          </Paper>

          <Button
            variant="contained"
            fullWidth
            color="secondary"
            onClick={() => router.push('/account/appointments/new')}
          >
            Agendar nueva cita
          </Button>
        </Grid>

        {/* Panel derecho */}
        <Grid item xs={12} md={9}>
          {/* Cabecera de semana con navegación */}
          <Box display="flex" justifyContent="center" alignItems="center" mb={2}>
            <IconButton onClick={() => setSelectedDate(sd.subtract(1, 'week'))}>
              <ChevronLeftIcon />
            </IconButton>
            <Typography variant="h6" sx={{ mx: 2 }}>
              Semana {sd.week()} ({sd.format('MMMM YYYY')})
            </Typography>
            <IconButton onClick={() => setSelectedDate(sd.add(1, 'week'))}>
              <ChevronRightIcon />
            </IconButton>
            <Button sx={{ ml: 2 }} onClick={() => setSelectedDate(dayjs())}>
              Hoy
            </Button>
          </Box>

          <Paper sx={{ overflow: 'auto' }}>
            <Box
              sx={{
                display: 'grid',
                gridTemplateColumns: '80px repeat(7, 1fr)',
                border: '1px solid',
                borderColor: 'divider',
              }}
            >
              {/* Encabezado */}
              <Box />
              {weekDays.map((d) => (
                <Box
                  key={d.toString()}
                  sx={{
                    textAlign: 'center',
                    p: 1,
                    fontWeight: 'bold',
                    border: '1px solid',
                    borderColor: 'divider',
                    bgcolor: d.isSame(dayjs(), 'day') ? 'secondary.light' : 'grey.50',
                  }}
                >
                  {d.format('dddd DD')}
                </Box>
              ))}

              {/* Celdas */}
              {timeSlots.map((time) => (
                <React.Fragment key={time.toString()}>
                  <Box
                    sx={{
                      border: '1px solid',
                      borderColor: 'divider',
                      textAlign: 'right',
                      p: 0.5,
                      fontSize: 12,
                      color: 'text.secondary',
                      bgcolor: 'grey.50',
                    }}
                  >
                    {time.format('HH:mm')}
                  </Box>

                  {weekDays.map((d) => {
                    const apt = getAppointmentAt(d, time);
                    return (
                      <Box
                        key={d.toString() + time.toString()}
                        sx={{
                          border: '1px solid',
                          borderColor: 'divider',
                          height: 40,
                          bgcolor: apt ? 'primary.light' : 'transparent',
                          cursor: 'pointer',
                        }}
                        onDoubleClick={() => {
                          if (apt) {
                            router.push(`/account/appointments/${apt.id}`);
                          } else {
                            router.push(
                              `/account/appointments/new?date=${d.hour(time.hour()).minute(time.minute()).toISOString()}`
                            );
                          }
                        }}
                      >
                        {apt && (
                          <Typography variant="caption" sx={{ p: 0.5, display: 'block' }}>
                            {apt.patient?.first_name} {apt.patient?.last_name}
                          </Typography>
                        )}
                      </Box>
                    );
                  })}
                </React.Fragment>
              ))}
            </Box>
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
}
