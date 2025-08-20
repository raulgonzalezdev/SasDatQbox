import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity, SafeAreaView, TextInput } from 'react-native';
import { ThemedView } from '@/components/ThemedView';
import { ThemedText } from '@/components/ThemedText';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { CustomStatusBar } from '@/components/ui/CustomStatusBar';
import { Colors, CommonStyles, Spacing, BordersAndShadows, Typography } from '@/constants/GlobalStyles';
import { useAppStore } from '@/store/appStore';

export default function AppointmentsScreen() {
  const { user } = useAppStore();
  const isDoctor = user?.role === 'doctor';
  const [selectedDate, setSelectedDate] = useState(new Date());

  // Datos simulados de citas
  const appointments = [
    {
      id: '1',
      patientName: 'María González',
      doctorName: 'Dr. Carlos Rodríguez',
      date: '2024-01-15',
      time: '09:00',
      type: 'Consulta General',
      status: 'confirmed',
      duration: 30,
    },
    {
      id: '2',
      patientName: 'Juan Pérez',
      doctorName: 'Dr. Ana Martínez',
      date: '2024-01-15',
      time: '10:30',
      type: 'Control',
      status: 'pending',
      duration: 45,
    },
    {
      id: '3',
      patientName: 'Laura Silva',
      doctorName: 'Dr. Carlos Rodríguez',
      date: '2024-01-15',
      time: '14:00',
      type: 'Primera Vez',
      status: 'confirmed',
      duration: 60,
    },
  ];

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

  const formatTime = (time: string) => {
    return time;
  };

  return (
    <SafeAreaView style={CommonStyles.safeArea}>
      <CustomStatusBar backgroundColor={Colors.primary} barStyle="dark-content" />
      
      <ThemedView style={CommonStyles.container}>
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.headerContent}>
            <ThemedText style={styles.headerTitle}>
              {isDoctor ? 'Citas del Día' : 'Mis Citas'}
            </ThemedText>
            <ThemedText style={styles.headerSubtitle}>
              {formatDate(selectedDate.toISOString().split('T')[0])}
            </ThemedText>
          </View>
          <TouchableOpacity 
            style={styles.addButton}
            onPress={() => router.push('/book-appointment')}
          >
            <Ionicons name="add" size={24} color={Colors.white} />
          </TouchableOpacity>
        </View>

        <ScrollView style={CommonStyles.content} showsVerticalScrollIndicator={false}>
          {/* Filtros */}
          <View style={styles.filtersSection}>
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              <TouchableOpacity style={[styles.filterChip, styles.filterChipActive]}>
                <ThemedText style={[styles.filterChipText, styles.filterChipTextActive]}>
                  Hoy
                </ThemedText>
              </TouchableOpacity>
              <TouchableOpacity style={styles.filterChip}>
                <ThemedText style={styles.filterChipText}>
                  Mañana
                </ThemedText>
              </TouchableOpacity>
              <TouchableOpacity style={styles.filterChip}>
                <ThemedText style={styles.filterChipText}>
                  Esta Semana
                </ThemedText>
              </TouchableOpacity>
              <TouchableOpacity style={styles.filterChip}>
                <ThemedText style={styles.filterChipText}>
                  Próximo Mes
                </ThemedText>
              </TouchableOpacity>
            </ScrollView>
          </View>

          {/* Estadísticas rápidas */}
          <View style={styles.statsSection}>
            <View style={styles.statCard}>
              <Ionicons name="calendar" size={24} color={Colors.primary} />
              <ThemedText style={styles.statNumber}>{appointments.length}</ThemedText>
              <ThemedText style={styles.statLabel}>Citas Hoy</ThemedText>
            </View>
            <View style={styles.statCard}>
              <Ionicons name="time" size={24} color={Colors.warning} />
              <ThemedText style={styles.statNumber}>
                {appointments.filter(a => a.status === 'pending').length}
              </ThemedText>
              <ThemedText style={styles.statLabel}>Pendientes</ThemedText>
            </View>
            <View style={styles.statCard}>
              <Ionicons name="checkmark-circle" size={24} color={Colors.success} />
              <ThemedText style={styles.statNumber}>
                {appointments.filter(a => a.status === 'confirmed').length}
              </ThemedText>
              <ThemedText style={styles.statLabel}>Confirmadas</ThemedText>
            </View>
          </View>

          {/* Lista de citas */}
          <View style={styles.appointmentsSection}>
            <ThemedText style={styles.sectionTitle}>Citas Programadas</ThemedText>
            
            {appointments.length === 0 ? (
              <View style={styles.emptyState}>
                <Ionicons name="calendar-outline" size={64} color={Colors.darkGray} />
                <ThemedText style={styles.emptyTitle}>No hay citas programadas</ThemedText>
                <ThemedText style={styles.emptySubtitle}>
                  {isDoctor 
                    ? 'No tienes citas programadas para hoy'
                    : 'No tienes citas programadas. ¡Agenda una ahora!'
                  }
                </ThemedText>
                <TouchableOpacity 
                  style={styles.emptyButton}
                  onPress={() => router.push('/book-appointment')}
                >
                  <ThemedText style={styles.emptyButtonText}>
                    {isDoctor ? 'Ver Calendario' : 'Agendar Cita'}
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
                    <View style={styles.appointmentTime}>
                      <ThemedText style={styles.timeText}>
                        {formatTime(appointment.time)}
                      </ThemedText>
                      <ThemedText style={styles.durationText}>
                        {appointment.duration} min
                      </ThemedText>
                    </View>
                    <View style={[styles.statusBadge, { backgroundColor: getStatusColor(appointment.status) }]}>
                      <ThemedText style={styles.statusText}>
                        {getStatusText(appointment.status)}
                      </ThemedText>
                    </View>
                  </View>
                  
                  <View style={styles.appointmentContent}>
                    <ThemedText style={styles.patientName}>
                      {isDoctor ? appointment.patientName : appointment.doctorName}
                    </ThemedText>
                    <ThemedText style={styles.appointmentType}>
                      {appointment.type}
                    </ThemedText>
                    {!isDoctor && (
                      <ThemedText style={styles.doctorName}>
                        {appointment.doctorName}
                      </ThemedText>
                    )}
                  </View>
                  
                  <View style={styles.appointmentActions}>
                    <TouchableOpacity style={styles.actionButton}>
                      <Ionicons name="chatbubble" size={20} color={Colors.secondary} />
                      <ThemedText style={styles.actionText}>Chat</ThemedText>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.actionButton}>
                      <Ionicons name="call" size={20} color={Colors.info} />
                      <ThemedText style={styles.actionText}>Llamar</ThemedText>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.actionButton}>
                      <Ionicons name="videocam" size={20} color={Colors.success} />
                      <ThemedText style={styles.actionText}>Video</ThemedText>
                    </TouchableOpacity>
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
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.md,
    backgroundColor: Colors.primary,
  },
  headerContent: {
    flex: 1,
  },
  headerTitle: {
    fontSize: Typography.fontSizes.xl,
    fontWeight: Typography.fontWeights.bold,
    color: Colors.dark,
    marginBottom: Spacing.xs,
  },
  headerSubtitle: {
    fontSize: Typography.fontSizes.md,
    color: Colors.darkGray,
  },
  addButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.secondary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  filtersSection: {
    marginBottom: Spacing.lg,
  },
  filterChip: {
    backgroundColor: Colors.white,
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.sm,
    borderRadius: BordersAndShadows.borderRadius.circle,
    marginRight: Spacing.md,
    borderWidth: 1,
    borderColor: Colors.lightGray,
  },
  filterChipActive: {
    backgroundColor: Colors.secondary,
    borderColor: Colors.secondary,
  },
  filterChipText: {
    fontSize: Typography.fontSizes.sm,
    color: Colors.darkGray,
    fontWeight: Typography.fontWeights.medium,
  },
  filterChipTextActive: {
    color: Colors.white,
  },
  statsSection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: Spacing.xl,
  },
  statCard: {
    flex: 1,
    backgroundColor: Colors.white,
    padding: Spacing.md,
    borderRadius: BordersAndShadows.borderRadius.lg,
    alignItems: 'center',
    marginHorizontal: Spacing.xs,
    ...BordersAndShadows.shadows.sm,
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
  appointmentsSection: {
    marginBottom: Spacing.xl,
  },
  sectionTitle: {
    fontSize: Typography.fontSizes.lg,
    fontWeight: Typography.fontWeights.bold,
    color: Colors.dark,
    marginBottom: Spacing.lg,
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
    borderRadius: BordersAndShadows.borderRadius.lg,
    padding: Spacing.lg,
    marginBottom: Spacing.md,
    ...BordersAndShadows.shadows.md,
  },
  appointmentHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.md,
  },
  appointmentTime: {
    alignItems: 'flex-start',
  },
  timeText: {
    fontSize: Typography.fontSizes.lg,
    fontWeight: Typography.fontWeights.bold,
    color: Colors.dark,
  },
  durationText: {
    fontSize: Typography.fontSizes.sm,
    color: Colors.darkGray,
  },
  statusBadge: {
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.xs,
    borderRadius: BordersAndShadows.borderRadius.circle,
  },
  statusText: {
    fontSize: Typography.fontSizes.xs,
    color: Colors.white,
    fontWeight: Typography.fontWeights.bold,
  },
  appointmentContent: {
    marginBottom: Spacing.md,
  },
  patientName: {
    fontSize: Typography.fontSizes.md,
    fontWeight: Typography.fontWeights.bold,
    color: Colors.dark,
    marginBottom: Spacing.xs,
  },
  appointmentType: {
    fontSize: Typography.fontSizes.sm,
    color: Colors.secondary,
    fontWeight: Typography.fontWeights.medium,
    marginBottom: Spacing.xs,
  },
  doctorName: {
    fontSize: Typography.fontSizes.sm,
    color: Colors.darkGray,
  },
  appointmentActions: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    borderTopWidth: 1,
    borderTopColor: Colors.lightGray,
    paddingTop: Spacing.md,
  },
  actionButton: {
    alignItems: 'center',
    paddingHorizontal: Spacing.sm,
  },
  actionText: {
    fontSize: Typography.fontSizes.xs,
    color: Colors.darkGray,
    marginTop: Spacing.xs,
  },
});
