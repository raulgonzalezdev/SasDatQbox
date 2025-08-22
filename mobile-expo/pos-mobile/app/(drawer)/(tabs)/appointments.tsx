import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity, SafeAreaView, Alert } from 'react-native';
import { ThemedView } from '@/components/ThemedView';
import { ThemedText } from '@/components/ThemedText';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { CustomStatusBar } from '@/components/ui/CustomStatusBar';
import { Colors, CommonStyles, Spacing, BordersAndShadows, Typography } from '@/constants/GlobalStyles';
import { useAppStore } from '@/store/appStore';
import { useMedicalStore, Appointment } from '@/store/medicalStore';
import AppointmentScheduler from '@/components/appointments/AppointmentScheduler';
import PaymentProofUploader from '@/components/payments/PaymentProofUploader';

export default function AppointmentsScreen() {
  const { user } = useAppStore();
  const { 
    appointments, 
    patientDoctors,
    getAppointmentsByPatient,
    getUnpaidAppointments,
    updatePaymentStatus 
  } = useMedicalStore();
  
  const [showScheduler, setShowScheduler] = useState(false);
  const [showPaymentUploader, setShowPaymentUploader] = useState(false);
  const [selectedAppointment, setSelectedAppointment] = useState<Appointment | null>(null);

  // Obtener citas del paciente actual
  const userAppointments = user ? getAppointmentsByPatient(user.id) : [];
  const unpaidAppointments = user ? getUnpaidAppointments(user.id) : [];

  const getStatusColor = (status: Appointment['status']) => {
    switch (status) {
      case 'confirmed':
        return Colors.success;
      case 'scheduled':
        return Colors.info;
      case 'in_progress':
        return Colors.warning;
      case 'completed':
        return Colors.success;
      case 'cancelled':
        return Colors.danger;
      case 'paid':
        return Colors.primary;
      default:
        return Colors.darkGray;
    }
  };

  const getStatusText = (status: Appointment['status']) => {
    switch (status) {
      case 'confirmed':
        return 'Confirmada';
      case 'scheduled':
        return 'Programada';
      case 'in_progress':
        return 'En progreso';
      case 'completed':
        return 'Completada';
      case 'cancelled':
        return 'Cancelada';
      case 'paid':
        return 'Pagada';
      default:
        return 'Desconocido';
    }
  };

  const getPaymentStatusColor = (status: Appointment['payment_status']) => {
    switch (status) {
      case 'paid':
        return Colors.success;
      case 'pending':
        return Colors.warning;
      case 'unpaid':
        return Colors.danger;
      case 'refunded':
        return Colors.info;
      default:
        return Colors.darkGray;
    }
  };

  const getPaymentStatusText = (status: Appointment['payment_status']) => {
    switch (status) {
      case 'paid':
        return 'Pagado';
      case 'pending':
        return 'Pendiente';
      case 'unpaid':
        return 'Sin pagar';
      case 'refunded':
        return 'Reembolsado';
      default:
        return 'Desconocido';
    }
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('es-ES', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('es-ES', {
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const handleScheduleAppointment = () => {
    if (patientDoctors.length === 0) {
      Alert.alert(
        'Sin doctores',
        'Primero debes agregar un doctor a tu lista para poder agendar una cita.',
        [{ text: 'OK' }]
      );
      return;
    }
    setShowScheduler(true);
  };

  const handlePayAppointment = (appointment: Appointment) => {
    setSelectedAppointment(appointment);
    setShowPaymentUploader(true);
  };

  const handleJoinConsultation = (appointment: Appointment) => {
    if (appointment.type === 'virtual') {
      // TODO: Implementar videollamada
      Alert.alert('Consulta Virtual', 'Uniéndose a la videollamada...');
      router.push('/(drawer)/(tabs)/chat');
    } else {
      Alert.alert(
        'Consulta Presencial',
        'Recuerda asistir a la clínica en la fecha y hora programada.',
        [{ text: 'OK' }]
      );
    }
  };

  const renderUnpaidAlert = () => {
    if (unpaidAppointments.length === 0) return null;

    return (
      <View style={styles.alertCard}>
        <View style={styles.alertIcon}>
          <Ionicons name="warning" size={24} color={Colors.warning} />
        </View>
        <View style={styles.alertContent}>
          <ThemedText style={styles.alertTitle}>
            Pagos Pendientes
          </ThemedText>
          <ThemedText style={styles.alertText}>
            Tienes {unpaidAppointments.length} cita{unpaidAppointments.length > 1 ? 's' : ''} sin pagar
          </ThemedText>
        </View>
        <TouchableOpacity 
          style={styles.alertButton}
          onPress={() => {
            // Mostrar primera cita sin pagar
            if (unpaidAppointments[0]) {
              handlePayAppointment(unpaidAppointments[0]);
            }
          }}
        >
          <ThemedText style={styles.alertButtonText}>Pagar</ThemedText>
        </TouchableOpacity>
      </View>
    );
  };

  const renderStats = () => {
    const completedAppointments = userAppointments.filter(apt => apt.status === 'completed').length;
    const upcomingAppointments = userAppointments.filter(apt => 
      apt.status === 'scheduled' || apt.status === 'confirmed'
    ).length;

    return (
      <View style={styles.statsContainer}>
        <View style={styles.statCard}>
          <Ionicons name="checkmark-circle" size={24} color={Colors.success} />
          <ThemedText style={styles.statNumber}>{completedAppointments}</ThemedText>
          <ThemedText style={styles.statLabel}>Completadas</ThemedText>
        </View>
        <View style={styles.statCard}>
          <Ionicons name="calendar" size={24} color={Colors.primary} />
          <ThemedText style={styles.statNumber}>{upcomingAppointments}</ThemedText>
          <ThemedText style={styles.statLabel}>Próximas</ThemedText>
        </View>
        <View style={styles.statCard}>
          <Ionicons name="card" size={24} color={Colors.warning} />
          <ThemedText style={styles.statNumber}>{unpaidAppointments.length}</ThemedText>
          <ThemedText style={styles.statLabel}>Sin Pagar</ThemedText>
        </View>
      </View>
    );
  };

  const renderAppointmentCard = (appointment: Appointment) => {
    const doctor = patientDoctors.find(pd => pd.doctor_id === appointment.doctor_id)?.doctor;
    const scheduledDate = new Date(appointment.scheduled_at);
    const isUpcoming = scheduledDate > new Date();
    const canJoin = appointment.status === 'confirmed' && isUpcoming;

    return (
      <View key={appointment.id} style={styles.appointmentCard}>
        <View style={styles.appointmentHeader}>
          <View style={styles.appointmentInfo}>
            <ThemedText style={styles.doctorName}>
              Dr. {doctor?.first_name} {doctor?.last_name}
            </ThemedText>
            <ThemedText style={styles.specialty}>
              {doctor?.specialty}
            </ThemedText>
          </View>
          <View style={styles.statusContainer}>
            <View style={[styles.statusBadge, { backgroundColor: getStatusColor(appointment.status) }]}>
              <ThemedText style={styles.statusText}>
                {getStatusText(appointment.status)}
              </ThemedText>
            </View>
          </View>
        </View>

        <View style={styles.appointmentDetails}>
          <View style={styles.detailRow}>
            <Ionicons name="calendar" size={16} color={Colors.darkGray} />
            <ThemedText style={styles.detailText}>
              {formatDate(scheduledDate)}
            </ThemedText>
          </View>
          <View style={styles.detailRow}>
            <Ionicons name="time" size={16} color={Colors.darkGray} />
            <ThemedText style={styles.detailText}>
              {formatTime(scheduledDate)} ({appointment.duration_minutes} min)
            </ThemedText>
          </View>
          <View style={styles.detailRow}>
            <Ionicons 
              name={appointment.type === 'virtual' ? 'videocam' : 'medical'} 
              size={16} 
              color={Colors.darkGray} 
            />
            <ThemedText style={styles.detailText}>
              {appointment.type === 'virtual' ? 'Consulta Virtual' : 'Consulta Presencial'}
            </ThemedText>
          </View>
          <View style={styles.detailRow}>
            <Ionicons name="card" size={16} color={getPaymentStatusColor(appointment.payment_status)} />
            <ThemedText style={[
              styles.detailText,
              { color: getPaymentStatusColor(appointment.payment_status) }
            ]}>
              {getPaymentStatusText(appointment.payment_status)} - ${appointment.consultation_fee}
            </ThemedText>
          </View>
        </View>

        <View style={styles.appointmentActions}>
          {appointment.payment_status === 'unpaid' && (
            <TouchableOpacity 
              style={[styles.actionButton, styles.payButton]}
              onPress={() => handlePayAppointment(appointment)}
            >
              <Ionicons name="card" size={16} color={Colors.white} />
              <ThemedText style={styles.actionButtonText}>Pagar</ThemedText>
            </TouchableOpacity>
          )}
          
          {canJoin && appointment.payment_status === 'paid' && (
            <TouchableOpacity 
              style={[styles.actionButton, styles.joinButton]}
              onPress={() => handleJoinConsultation(appointment)}
            >
              <Ionicons 
                name={appointment.type === 'virtual' ? 'videocam' : 'medical'} 
                size={16} 
                color={Colors.white} 
              />
              <ThemedText style={styles.actionButtonText}>
                {appointment.type === 'virtual' ? 'Unirse' : 'Ver detalles'}
              </ThemedText>
            </TouchableOpacity>
          )}
          
          {appointment.status === 'completed' && (
            <TouchableOpacity 
              style={[styles.actionButton, styles.chatButton]}
              onPress={() => router.push('/(drawer)/(tabs)/chat')}
            >
              <Ionicons name="chatbubbles" size={16} color={Colors.white} />
              <ThemedText style={styles.actionButtonText}>Chat</ThemedText>
            </TouchableOpacity>
          )}
        </View>
      </View>
    );
  };

  return (
    <SafeAreaView style={CommonStyles.safeArea}>
      <CustomStatusBar backgroundColor={Colors.primary} barStyle="dark-content" />
      
      <ThemedView style={CommonStyles.container}>
        <View style={styles.header}>
          <View>
            <ThemedText style={styles.headerTitle}>Mis Citas</ThemedText>
            <ThemedText style={styles.headerSubtitle}>
              Gestiona tus consultas médicas
            </ThemedText>
          </View>
          <TouchableOpacity 
            style={styles.scheduleButton}
            onPress={handleScheduleAppointment}
          >
            <Ionicons name="add" size={24} color={Colors.white} />
          </TouchableOpacity>
        </View>

        <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
          {renderUnpaidAlert()}
          {renderStats()}

          <View style={styles.section}>
            <ThemedText style={styles.sectionTitle}>
              Todas las Citas ({userAppointments.length})
            </ThemedText>
            
            {userAppointments.length === 0 ? (
              <View style={styles.emptyState}>
                <Ionicons name="calendar" size={64} color={Colors.lightGray} />
                <ThemedText style={styles.emptyTitle}>Sin citas programadas</ThemedText>
                <ThemedText style={styles.emptyText}>
                  Agenda tu primera consulta médica
                </ThemedText>
                <TouchableOpacity 
                  style={styles.emptyButton}
                  onPress={handleScheduleAppointment}
                >
                  <ThemedText style={styles.emptyButtonText}>Agendar Cita</ThemedText>
                </TouchableOpacity>
              </View>
            ) : (
              userAppointments
                .sort((a, b) => new Date(b.scheduled_at).getTime() - new Date(a.scheduled_at).getTime())
                .map(renderAppointmentCard)
            )}
          </View>
        </ScrollView>
      </ThemedView>

      <AppointmentScheduler
        visible={showScheduler}
        onClose={() => setShowScheduler(false)}
      />

      {selectedAppointment && (
        <PaymentProofUploader
          visible={showPaymentUploader}
          onClose={() => {
            setShowPaymentUploader(false);
            setSelectedAppointment(null);
          }}
          appointmentId={selectedAppointment.id}
          amount={selectedAppointment.consultation_fee}
        />
      )}
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
    backgroundColor: Colors.white,
    borderBottomWidth: 1,
    borderBottomColor: Colors.lightGray,
  },
  headerTitle: {
    fontSize: Typography.fontSizes.xl,
    fontWeight: Typography.fontWeights.bold as any,
    color: Colors.dark,
    marginBottom: Spacing.xs,
  },
  headerSubtitle: {
    fontSize: Typography.fontSizes.sm,
    color: Colors.darkGray,
  },
  scheduleButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: Colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    ...BordersAndShadows.shadows.md,
  },
  content: {
    flex: 1,
  },
  alertCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF3CD',
    borderLeftWidth: 4,
    borderLeftColor: Colors.warning,
    padding: Spacing.md,
    margin: Spacing.lg,
    borderRadius: 8,
  },
  alertIcon: {
    marginRight: Spacing.md,
  },
  alertContent: {
    flex: 1,
  },
  alertTitle: {
    fontSize: Typography.fontSizes.md,
    fontWeight: Typography.fontWeights.bold as any,
    color: Colors.dark,
    marginBottom: Spacing.xs,
  },
  alertText: {
    fontSize: Typography.fontSizes.sm,
    color: Colors.darkGray,
  },
  alertButton: {
    backgroundColor: Colors.warning,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    borderRadius: 6,
  },
  alertButtonText: {
    color: Colors.white,
    fontSize: Typography.fontSizes.sm,
    fontWeight: Typography.fontWeights.bold as any,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingHorizontal: Spacing.lg,
    marginBottom: Spacing.lg,
  },
  statCard: {
    backgroundColor: Colors.white,
    padding: Spacing.md,
    borderRadius: 12,
    alignItems: 'center',
    flex: 1,
    marginHorizontal: Spacing.xs,
    ...BordersAndShadows.shadows.sm,
  },
  statNumber: {
    fontSize: Typography.fontSizes.xl,
    fontWeight: Typography.fontWeights.bold as any,
    color: Colors.dark,
    marginTop: Spacing.sm,
    marginBottom: Spacing.xs,
  },
  statLabel: {
    fontSize: Typography.fontSizes.sm,
    color: Colors.darkGray,
    textAlign: 'center',
  },
  section: {
    paddingHorizontal: Spacing.lg,
    marginBottom: Spacing.lg,
  },
  sectionTitle: {
    fontSize: Typography.fontSizes.lg,
    fontWeight: Typography.fontWeights.bold as any,
    color: Colors.dark,
    marginBottom: Spacing.md,
  },
  appointmentCard: {
    backgroundColor: Colors.white,
    borderRadius: 12,
    padding: Spacing.lg,
    marginBottom: Spacing.md,
    ...BordersAndShadows.shadows.sm,
  },
  appointmentHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: Spacing.md,
  },
  appointmentInfo: {
    flex: 1,
  },
  doctorName: {
    fontSize: Typography.fontSizes.lg,
    fontWeight: Typography.fontWeights.bold as any,
    color: Colors.dark,
    marginBottom: Spacing.xs,
  },
  specialty: {
    fontSize: Typography.fontSizes.sm,
    color: Colors.darkGray,
  },
  statusContainer: {
    alignItems: 'flex-end',
  },
  statusBadge: {
    paddingHorizontal: Spacing.sm,
    paddingVertical: Spacing.xs,
    borderRadius: 12,
  },
  statusText: {
    fontSize: Typography.fontSizes.xs,
    color: Colors.white,
    fontWeight: Typography.fontWeights.bold as any,
  },
  appointmentDetails: {
    marginBottom: Spacing.md,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Spacing.sm,
  },
  detailText: {
    fontSize: Typography.fontSizes.sm,
    color: Colors.darkGray,
    marginLeft: Spacing.sm,
  },
  appointmentActions: {
    flexDirection: 'row',
    gap: Spacing.sm,
  },
  actionButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: Spacing.sm,
    paddingHorizontal: Spacing.md,
    borderRadius: 8,
    gap: Spacing.xs,
  },
  payButton: {
    backgroundColor: Colors.warning,
  },
  joinButton: {
    backgroundColor: Colors.success,
  },
  chatButton: {
    backgroundColor: Colors.primary,
  },
  actionButtonText: {
    fontSize: Typography.fontSizes.sm,
    fontWeight: Typography.fontWeights.medium as any,
    color: Colors.white,
  },
  emptyState: {
    alignItems: 'center',
    padding: Spacing.xl,
    backgroundColor: Colors.white,
    borderRadius: 12,
    ...BordersAndShadows.shadows.sm,
  },
  emptyTitle: {
    fontSize: Typography.fontSizes.lg,
    fontWeight: Typography.fontWeights.bold as any,
    color: Colors.dark,
    marginTop: Spacing.md,
    marginBottom: Spacing.sm,
  },
  emptyText: {
    fontSize: Typography.fontSizes.md,
    color: Colors.darkGray,
    textAlign: 'center',
    marginBottom: Spacing.lg,
  },
  emptyButton: {
    backgroundColor: Colors.primary,
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.md,
    borderRadius: 8,
  },
  emptyButtonText: {
    fontSize: Typography.fontSizes.md,
    fontWeight: Typography.fontWeights.bold as any,
    color: Colors.white,
  },
});