import React, { useMemo, useEffect } from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity, SafeAreaView } from 'react-native';
import { Calendar, LocaleConfig } from 'react-native-calendars';
import dayjs from 'dayjs';
import 'dayjs/locale/es';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { Colors, Spacing, Typography, BordersAndShadows, CommonStyles } from '@/constants/GlobalStyles';
import { Ionicons } from '@expo/vector-icons';
import { Stack, router } from 'expo-router';
import { CustomStatusBar } from '@/components/ui/CustomStatusBar';
import { useAppointmentStore } from '@/store/appointmentStore'; // Importar store

// Configuración de idioma para el calendario
LocaleConfig.locales['es'] = {
  monthNames: ['Enero','Febrero','Marzo','Abril','Mayo','Junio','Julio','Agosto','Septiembre','Octubre','Noviembre','Diciembre'],
  monthNamesShort: ['Ene.','Feb.','Mar.','Abr.','May.','Jun.','Jul.','Ago.','Sep.','Oct.','Nov.','Dic.'],
  dayNames: ['Domingo','Lunes','Martes','Miércoles','Jueves','Viernes','Sábado'],
  dayNamesShort: ['Dom.','Lun.','Mar.','Mié.','Jue.','Vie.','Sáb.'],
  today: 'Hoy'
};
LocaleConfig.defaultLocale = 'es';

// ¡Eliminamos los datos simulados de aquí!
// const mockAppointments = [
//     { id: '1', patientName: 'María González', date: '2024-07-15', time: '10:00', type: 'Consulta General' },
//     { id: '2', patientName: 'Juan Pérez', date: '2024-07-15', time: '11:30', type: 'Revisión'},
//     { id: '3', patientName: 'Laura Silva', date: '2024-07-16', time: '09:00', type: 'Consulta General'},
//     { id: '4', patientName: 'Carlos Rivas', date: '2024-07-18', time: '14:00', type: 'Dental'},
// ];

export default function CalendarScreen() {
  // Obtenemos el estado y las acciones del store
  const { 
    appointments, 
    selectedDate, 
    setSelectedDate,
    fetchAppointments 
  } = useAppointmentStore();

  // Llamamos a fetchAppointments si aún no se han cargado
  useEffect(() => {
    if (appointments.length === 0) {
      fetchAppointments();
    }
  }, [appointments, fetchAppointments]);

  const timeSlots = useMemo(() => {
    const slots = [];
    let time = dayjs(selectedDate).hour(8).minute(0).second(0);
    const endTime = dayjs(selectedDate).hour(20).minute(0).second(0);

    while (time.isBefore(endTime)) {
      slots.push(time.format('HH:mm'));
      time = time.add(30, 'minute');
    }
    return slots;
  }, [selectedDate]);
  
  const markedDates = useMemo(() => {
    const markings = {};
    // Usamos 'appointments' del store
    appointments.forEach(apt => {
      // Aseguramos que apt.date exista
      const dateKey = apt.date || dayjs(apt.appointment_datetime).format('YYYY-MM-DD');
      markings[dateKey] = { marked: true, dotColor: Colors.primary };
    });
    markings[selectedDate] = { ...markings[selectedDate], selected: true, selectedColor: Colors.secondary };
    return markings;
  }, [appointments, selectedDate]);

  const appointmentsForSelectedDate = useMemo(() => {
    // Usamos 'appointments' del store
    return appointments.filter(apt => {
        const dateKey = apt.date || dayjs(apt.appointment_datetime).format('YYYY-MM-DD');
        return dateKey === selectedDate
    });
  }, [appointments, selectedDate]);

  return (
    <SafeAreaView style={CommonStyles.safeArea}>
        <Stack.Screen options={{ headerShown: true, title: 'Agenda' }} />
        <CustomStatusBar backgroundColor={Colors.primary} barStyle="dark-content" />

        <ThemedView style={styles.container}>
            <Calendar
                current={selectedDate}
                onDayPress={(day) => setSelectedDate(day.dateString)} // Usamos la acción del store
                markedDates={markedDates}
                theme={{
                    backgroundColor: Colors.background,
                    calendarBackground: Colors.white,
                    textSectionTitleColor: Colors.darkGray,
                    selectedDayBackgroundColor: Colors.secondary,
                    selectedDayTextColor: Colors.white,
                    todayTextColor: Colors.secondary,
                    dayTextColor: Colors.dark,
                    textDisabledColor: Colors.lightGray,
                    arrowColor: Colors.primary,
                    monthTextColor: Colors.primary,
                    indicatorColor: Colors.primary,
                    textDayFontWeight: '300',
                    textMonthFontWeight: 'bold',
                    textDayHeaderFontWeight: '300',
                    textDayFontSize: 16,
                    textMonthFontSize: 16,
                    textDayHeaderFontSize: 14,
                }}
                style={styles.calendar}
            />
            <View style={styles.header}>
                <ThemedText style={styles.headerTitle}>Agenda del día</ThemedText>
                <ThemedText style={styles.headerSubtitle}>
                {dayjs(selectedDate).locale('es').format('dddd, D [de] MMMM [de] YYYY')}
                </ThemedText>
            </View>

            <ScrollView style={styles.timeSlotsContainer}>
                {timeSlots.map(slot => {
                    const appointment = appointmentsForSelectedDate.find(apt => apt.time === slot);
                    return (
                        <TouchableOpacity 
                            key={slot} 
                            style={[styles.slot, appointment ? styles.slotBooked : styles.slotFree]}
                            onPress={() => {
                                if (appointment) {
                                    router.push(`/appointment/${appointment.id}`);
                                } else {
                                    // Navegar a la pantalla de nueva cita con la fecha y hora preseleccionadas
                                    const newAppointmentPath = `/(drawer)/appointments/new?date=${selectedDate}&time=${slot}`;
                                    router.push(newAppointmentPath);
                                }
                            }}
                        >
                            <ThemedText style={styles.slotTime}>{slot}</ThemedText>
                            {appointment && (
                                <View style={styles.appointmentInfo}>
                                    <ThemedText style={styles.patientName}>{appointment.patientName}</ThemedText>
                                    <ThemedText style={styles.appointmentType}>{appointment.type}</ThemedText>
                                </View>
                            )}
                            {!appointment && (
                                <Ionicons name="add-circle-outline" size={24} color={Colors.secondary} />
                            )}
                        </TouchableOpacity>
                    )
                })}
            </ScrollView>
        </ThemedView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.background,
    },
    calendar: {
        borderBottomWidth: 1,
        borderBottomColor: Colors.lightGray,
        ...BordersAndShadows.shadows.sm,
    },
    header: {
      paddingHorizontal: Spacing.lg,
      paddingVertical: Spacing.md,
      backgroundColor: Colors.white,
      borderBottomWidth: 1,
      borderBottomColor: Colors.lightGray,
    },
    headerTitle: {
      fontSize: Typography.fontSizes.lg,
      fontWeight: Typography.fontWeights.bold,
      color: Colors.dark,
    },
    headerSubtitle: {
        fontSize: Typography.fontSizes.md,
        color: Colors.darkGray,
    },
    timeSlotsContainer: {
        flex: 1,
        paddingHorizontal: Spacing.lg,
        paddingTop: Spacing.sm,
    },
    slot: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: Spacing.md,
        paddingHorizontal: Spacing.lg,
        borderBottomWidth: 1,
        borderBottomColor: Colors.lightGray,
        borderRadius: BordersAndShadows.borderRadius.md,
        marginVertical: Spacing.xs,
    },
    slotFree: {
        backgroundColor: Colors.white,
        justifyContent: 'space-between'
    },
    slotBooked: {
        backgroundColor: Colors.primaryLight,
    },
    slotTime: {
        fontSize: Typography.fontSizes.md,
        fontWeight: Typography.fontWeights.bold,
        color: Colors.dark,
        width: 60,
    },
    appointmentInfo: {
        flex: 1,
        marginLeft: Spacing.md,
    },
    patientName: {
        fontSize: Typography.fontSizes.md,
        fontWeight: Typography.fontWeights.bold,
        color: Colors.dark,
    },
    appointmentType: {
        fontSize: Typography.fontSizes.sm,
        color: Colors.darkGray,
    }
});
