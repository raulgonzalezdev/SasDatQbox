import React, { useEffect } from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity, SafeAreaView, ActivityIndicator } from 'react-native';
import { ThemedView } from '@/components/ThemedView';
import { ThemedText } from '@/components/ThemedText';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { CustomStatusBar } from '@/components/ui/CustomStatusBar';
import { Colors, CommonStyles, Spacing, BordersAndShadows, Typography } from '@/constants/GlobalStyles';
import { useAppStore } from '@/store/appStore';
import { useAppointmentStore } from '@/store/appointmentStore'; // Importar el nuevo store

export default function AppointmentsScreen() {
  const { user } = useAppStore();
  const { appointments, loading, fetchAppointments } = useAppointmentStore();

  useEffect(() => {
    fetchAppointments();
  }, [fetchAppointments]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmed':
        return Colors.success;
      case 'pending':
        return Colors.warning;
      case 'cancelled':
        return Colors.danger;
      default:
        return Colors.darkGray;
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'confirmed':
        return 'Confirmada';
      case 'pending':
        return 'Pendiente';
      case 'cancelled':
        return 'Cancelada';
      default:
        return 'Desconocido';
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('es-ES', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const navigateToCalendar = () => {
    // La ruta será '(drawer)/appointments/calendar', la crearemos en el siguiente paso
    router.push('/(drawer)/appointments/calendar');
  };

  if (loading) {
    return (
        <SafeAreaView style={CommonStyles.safeArea}>
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                <ActivityIndicator size="large" color={Colors.primary} />
                <ThemedText>Cargando citas...</ThemedText>
            </View>
        </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={CommonStyles.safeArea}>
      <ThemedView style={CommonStyles.container}>
        <ScrollView style={CommonStyles.content} showsVerticalScrollIndicator={false}>
          {/* Sección de título y botón */}
          <View style={styles.titleSection}>
            <View style={styles.titleContent}>
              <ThemedText style={styles.pageTitle}>Resumen de Citas</ThemedText>
              <ThemedText style={styles.pageSubtitle}>
                Gestiona tus citas médicas
              </ThemedText>
            </View>
            <TouchableOpacity 
              style={styles.addButton}
              onPress={navigateToCalendar}
            >
              <Ionicons name="add" size={24} color={Colors.white} />
            </TouchableOpacity>
          </View>

          {/* Estadísticas */}
          <View style={styles.statsSection}>
            <View style={styles.statCard}>
              <Ionicons name="calendar" size={24} color={Colors.primary} />
              <ThemedText style={styles.statNumber}>{appointments.length}</ThemedText>
              <ThemedText style={styles.statLabel}>Total Citas</ThemedText>
            </View>
            <View style={styles.statCard}>
              <Ionicons name="checkmark-circle" size={24} color={Colors.success} />
              <ThemedText style={styles.statNumber}>
                {appointments.filter(a => a.status === 'confirmed').length}
              </ThemedText>
              <ThemedText style={styles.statLabel}>Confirmadas</ThemedText>
            </View>
            <View style={styles.statCard}>
              <Ionicons name="time" size={24} color={Colors.warning} />
              <ThemedText style={styles.statNumber}>
                {appointments.filter(a => a.status === 'pending').length}
              </ThemedText>
              <ThemedText style={styles.statLabel}>Pendientes</ThemedText>
            </View>
          </View>

          {/* Botón para ver Calendario */}
          <View style={styles.calendarButtonContainer}>
            <TouchableOpacity 
                style={styles.calendarButton}
                onPress={navigateToCalendar}
              >
                <Ionicons name="calendar-outline" size={20} color={Colors.white} />
                <ThemedText style={styles.calendarButtonText}>
                  Ver Agenda / Calendario
                </ThemedText>
              </TouchableOpacity>
          </View>

          {/* Lista de citas */}
          <View style={styles.appointmentsSection}>
            <ThemedText style={styles.sectionTitle}>Próximas Citas</ThemedText>
            
            {appointments.length === 0 ? (
              <View style={styles.emptyState}>
                <Ionicons name="calendar-outline" size={64} color={Colors.darkGray} />
                <ThemedText style={styles.emptyTitle}>No hay citas programadas</ThemedText>
                <ThemedText style={styles.emptySubtitle}>
                  Agenda tu primera cita médica
                </ThemedText>
                <TouchableOpacity 
                  style={styles.emptyButton}
                  onPress={navigateToCalendar}
                >
                  <ThemedText style={styles.emptyButtonText}>
                    Agendar Cita
                  </ThemedText>
                </TouchableOpacity>
              </View>
            ) : (
              appointments.map((appointment) => (
                <TouchableOpacity
                  key={appointment.id}
                  style={styles.appointmentCard}
                  onPress={() => router.push(`/appointment/${appointment.id}`)}
                >
                  <View style={styles.appointmentHeader}>
                    <View style={styles.appointmentInfo}>
                      <ThemedText style={styles.patientName}>{appointment.patientName}</ThemedText>
                      <ThemedText style={styles.appointmentType}>{appointment.type}</ThemedText>
                    </View>
                    <View style={[styles.statusBadge, { backgroundColor: getStatusColor(appointment.status) }]}>
                      <ThemedText style={styles.statusText}>
                        {getStatusText(appointment.status)}
                      </ThemedText>
                    </View>
                  </View>
                  
                  <View style={styles.appointmentDetails}>
                    <View style={styles.detailRow}>
                      <Ionicons name="calendar-outline" size={16} color={Colors.darkGray} />
                      <ThemedText style={styles.detailText}>
                        {formatDate(appointment.date)}
                      </ThemedText>
                    </View>
                    <View style={styles.detailRow}>
                      <Ionicons name="time-outline" size={16} color={Colors.darkGray} />
                      <ThemedText style={styles.detailText}>
                        {appointment.time}
                      </ThemedText>
                    </View>
                  </View>
                </TouchableOpacity>
              ))
            )}
          </View>
        </ScrollView>
      </ThemedView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  titleSection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.lg,
    backgroundColor: 'transparent',
  },
  titleContent: {
    flex: 1,
  },
  pageTitle: {
    fontSize: Typography.fontSizes.xl,
    fontWeight: Typography.fontWeights.bold,
    color: Colors.white, // Cambiado a blanco
    marginBottom: Spacing.xs,
  },
  pageSubtitle: {
    fontSize: Typography.fontSizes.md,
    color: Colors.white, // Cambiado a blanco
    opacity: 0.9, // Ligera transparencia para jerarquía
  },
  addButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.secondary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  statsSection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: Spacing.lg,
    paddingHorizontal: Spacing.lg,
    paddingTop: Spacing.md,
  },
  statCard: {
    flex: 1,
    backgroundColor: Colors.white,
    padding: Spacing.md,
    borderRadius: 20, // Más redondeadas
    alignItems: 'center',
    marginHorizontal: Spacing.xs,
    // Efecto 3D mejorado
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 8,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  statNumber: {
    fontSize: Typography.fontSizes.xl,
    fontWeight: Typography.fontWeights.bold,
    color: Colors.dark,
    marginVertical: Spacing.xs,
  },
  statLabel: {
    fontSize: Typography.fontSizes.xs,
    color: Colors.darkGray,
    textAlign: 'center',
  },
  calendarButtonContainer: {
    paddingHorizontal: Spacing.lg,
    marginBottom: Spacing.lg,
  },
  calendarButton: {
    flexDirection: 'row',
    backgroundColor: Colors.secondary,
    paddingHorizontal: Spacing.xl,
    paddingVertical: Spacing.md,
    borderRadius: BordersAndShadows.borderRadius.lg,
    justifyContent: 'center',
    alignItems: 'center',
    ...BordersAndShadows.shadows.md,
  },
  calendarButtonText: {
    color: Colors.white,
    fontSize: Typography.fontSizes.md,
    fontWeight: Typography.fontWeights.bold,
    marginLeft: Spacing.sm,
  },
  appointmentsSection: {
    marginBottom: Spacing.xl,
  },
  sectionTitle: {
    fontSize: Typography.fontSizes.lg,
    fontWeight: Typography.fontWeights.bold,
    color: Colors.dark,
    marginBottom: Spacing.lg,
    paddingHorizontal: Spacing.lg,
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: Spacing.xxxl,
  },
  emptyTitle: {
    fontSize: Typography.fontSizes.lg,
    fontWeight: Typography.fontWeights.bold,
    color: Colors.dark,
    marginTop: Spacing.lg,
    marginBottom: Spacing.sm,
  },
  emptySubtitle: {
    fontSize: Typography.fontSizes.md,
    color: Colors.darkGray,
    textAlign: 'center',
    marginBottom: Spacing.xl,
    paddingHorizontal: Spacing.lg,
  },
  emptyButton: {
    backgroundColor: Colors.secondary,
    paddingHorizontal: Spacing.xl,
    paddingVertical: Spacing.md,
    borderRadius: BordersAndShadows.borderRadius.lg,
  },
  emptyButtonText: {
    color: Colors.white,
    fontSize: Typography.fontSizes.md,
    fontWeight: Typography.fontWeights.bold,
  },
  appointmentCard: {
    backgroundColor: Colors.white,
    borderRadius: 20, // Más redondeadas
    padding: Spacing.lg,
    marginBottom: Spacing.md,
    marginHorizontal: Spacing.lg,
    // Efecto 3D mejorado
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 8,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  appointmentHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.sm,
  },
  appointmentInfo: {
    flex: 1,
  },
  patientName: {
    fontSize: Typography.fontSizes.md,
    fontWeight: Typography.fontWeights.bold,
    color: Colors.dark,
    marginBottom: Spacing.xs,
  },
  appointmentType: {
    fontSize: Typography.fontSizes.sm,
    color: Colors.darkGray,
  },
  statusBadge: {
    paddingHorizontal: Spacing.sm,
    paddingVertical: Spacing.xs,
    borderRadius: BordersAndShadows.borderRadius.circle,
  },
  statusText: {
    fontSize: Typography.fontSizes.xs,
    color: Colors.white,
    fontWeight: Typography.fontWeights.bold,
  },
  appointmentDetails: {
    marginBottom: Spacing.sm,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Spacing.xs,
  },
  detailText: {
    fontSize: Typography.fontSizes.sm,
    color: Colors.darkGray,
    marginLeft: Spacing.xs,
  },
});
