import React from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity, SafeAreaView } from 'react-native';
import { ThemedView } from '@/components/ThemedView';
import { ThemedText } from '@/components/ThemedText';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { CustomStatusBar } from '@/components/ui/CustomStatusBar';
import { Colors, CommonStyles, Spacing, BordersAndShadows, Typography } from '@/constants/GlobalStyles';
import { useAppStore } from '@/store/appStore';

export default function AppointmentsScreen() {
  const { user } = useAppStore();

  // Datos simulados de citas
  const appointments = [
    {
      id: '1',
      patientName: 'María González',
      date: '2024-01-15',
      time: '10:00',
      type: 'Consulta General',
      status: 'confirmed',
    },
    {
      id: '2',
      patientName: 'Juan Pérez',
      date: '2024-01-15',
      time: '11:30',
      type: 'Revisión',
      status: 'pending',
    },
    {
      id: '3',
      patientName: 'Laura Silva',
      date: '2024-01-16',
      time: '09:00',
      type: 'Consulta General',
      status: 'confirmed',
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

  return (
    <SafeAreaView style={CommonStyles.safeArea}>
      <CustomStatusBar backgroundColor={Colors.primary} barStyle="dark-content" />

      <ThemedView style={CommonStyles.container}>
        <ScrollView style={CommonStyles.content} showsVerticalScrollIndicator={false}>
          {/* Header */}
          <View style={styles.header}>
            <View style={styles.headerContent}>
              <ThemedText style={styles.headerTitle}>Citas</ThemedText>
              <ThemedText style={styles.headerSubtitle}>
                Gestiona tus citas médicas
              </ThemedText>
            </View>
            <TouchableOpacity 
              style={styles.addButton}
              onPress={() => router.push('/(drawer)/more/appointments')}
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
                  onPress={() => router.push('/(drawer)/more/appointments')}
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
                  
                  <View style={styles.appointmentActions}>
                    <TouchableOpacity style={styles.actionButton}>
                      <Ionicons name="chatbubble" size={20} color={Colors.secondary} />
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.actionButton}>
                      <Ionicons name="call" size={20} color={Colors.info} />
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.actionButton}>
                      <Ionicons name="medical" size={20} color={Colors.success} />
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
  statsSection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: Spacing.xl,
    paddingHorizontal: Spacing.lg,
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
    borderRadius: BordersAndShadows.borderRadius.lg,
    padding: Spacing.lg,
    marginBottom: Spacing.md,
    marginHorizontal: Spacing.lg,
    ...BordersAndShadows.shadows.sm,
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
  appointmentActions: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    borderTopWidth: 1,
    borderTopColor: Colors.lightGray,
    paddingTop: Spacing.sm,
  },
  actionButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: Colors.lightGray,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
