import React, { useState } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  Modal,
  Text,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { ThemedText } from '@/components/ThemedText';
import { Colors, Spacing, BordersAndShadows, Typography } from '@/constants/GlobalStyles';
import { useMedicalStore, Doctor } from '@/store/medicalStore';
import { useAppStore } from '@/store/appStore';

interface AppointmentSchedulerProps {
  visible: boolean;
  onClose: () => void;
  selectedDoctor?: Doctor;
}

const AppointmentScheduler: React.FC<AppointmentSchedulerProps> = ({
  visible,
  onClose,
  selectedDoctor,
}) => {
  const { user } = useAppStore();
  const { 
    patientDoctors, 
    scheduleAppointment, 
    paymentMethods,
    addPaymentMethod 
  } = useMedicalStore();

  const [appointmentType, setAppointmentType] = useState<'virtual' | 'in_person'>('virtual');
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [selectedTime, setSelectedTime] = useState('10:00');
  const [selectedDoctorId, setSelectedDoctorId] = useState(selectedDoctor?.id || '');
  const [paymentStep, setPaymentStep] = useState(1); // 1: detalles, 2: pago, 3: confirmación

  // Obtener el doctor seleccionado
  const doctor = selectedDoctor || patientDoctors.find(pd => pd.doctor_id === selectedDoctorId)?.doctor;
  
  // Calcular tarifa según tipo de consulta
  const consultationFee = doctor 
    ? (appointmentType === 'virtual' ? doctor.virtual_consultation_fee : doctor.consultation_fee)
    : 0;

  const availableTimes = [
    '08:00', '08:30', '09:00', '09:30', '10:00', '10:30',
    '11:00', '11:30', '14:00', '14:30', '15:00', '15:30',
    '16:00', '16:30', '17:00', '17:30'
  ];

  const handleScheduleAppointment = () => {
    if (!doctor) {
      Alert.alert('Error', 'Selecciona un doctor primero');
      return;
    }

    if (!user) {
      Alert.alert('Error', 'Usuario no autenticado');
      return;
    }

    const appointmentDateTime = new Date(selectedDate);
    const [hours, minutes] = selectedTime.split(':');
    appointmentDateTime.setHours(parseInt(hours), parseInt(minutes));

    const newAppointment = {
      patient_id: user.id,
      doctor_id: doctor.id,
      type: appointmentType,
      status: 'scheduled' as const,
      scheduled_at: appointmentDateTime,
      duration_minutes: 30,
      consultation_fee: consultationFee,
      payment_status: 'unpaid' as const,
    };

    scheduleAppointment(newAppointment);
    setPaymentStep(2); // Ir al paso de pago
  };

  const handlePaymentComplete = () => {
    setPaymentStep(3);
    // TODO: Procesar pago real
  };

  const renderDoctorSelection = () => (
    <View style={styles.section}>
      <ThemedText style={styles.sectionTitle}>Seleccionar Doctor</ThemedText>
      {patientDoctors.map((patientDoctor) => (
        <TouchableOpacity
          key={patientDoctor.doctor_id}
          style={[
            styles.doctorOption,
            selectedDoctorId === patientDoctor.doctor_id && styles.selectedOption
          ]}
          onPress={() => setSelectedDoctorId(patientDoctor.doctor_id)}
        >
          <View style={styles.doctorInfo}>
            <View style={styles.doctorAvatar}>
              <Ionicons name="person" size={24} color={Colors.white} />
            </View>
            <View style={styles.doctorDetails}>
              <ThemedText style={styles.doctorName}>
                Dr. {patientDoctor.doctor.first_name} {patientDoctor.doctor.last_name}
              </ThemedText>
              <ThemedText style={styles.doctorSpecialty}>
                {patientDoctor.doctor.specialty}
              </ThemedText>
              <ThemedText style={styles.doctorRating}>
                ⭐ {patientDoctor.doctor.rating} • {patientDoctor.doctor.experience_years} años exp.
              </ThemedText>
            </View>
          </View>
          <View style={styles.feeInfo}>
            <ThemedText style={styles.virtualFee}>
              Virtual: ${patientDoctor.doctor.virtual_consultation_fee}
            </ThemedText>
            <ThemedText style={styles.inPersonFee}>
              Presencial: ${patientDoctor.doctor.consultation_fee}
            </ThemedText>
          </View>
        </TouchableOpacity>
      ))}
    </View>
  );

  const renderAppointmentDetails = () => (
    <>
      {renderDoctorSelection()}
      
      <View style={styles.section}>
        <ThemedText style={styles.sectionTitle}>Tipo de Consulta</ThemedText>
        <View style={styles.typeSelector}>
          <TouchableOpacity
            style={[
              styles.typeOption,
              appointmentType === 'virtual' && styles.selectedOption
            ]}
            onPress={() => setAppointmentType('virtual')}
          >
            <Ionicons name="videocam" size={24} color={appointmentType === 'virtual' ? Colors.white : Colors.primary} />
            <ThemedText style={[
              styles.typeText,
              appointmentType === 'virtual' && styles.selectedText
            ]}>
              Virtual
            </ThemedText>
            <ThemedText style={[
              styles.feeText,
              appointmentType === 'virtual' && styles.selectedText
            ]}>
              ${doctor?.virtual_consultation_fee || 0}
            </ThemedText>
          </TouchableOpacity>
          
          <TouchableOpacity
            style={[
              styles.typeOption,
              appointmentType === 'in_person' && styles.selectedOption
            ]}
            onPress={() => setAppointmentType('in_person')}
          >
            <Ionicons name="medical" size={24} color={appointmentType === 'in_person' ? Colors.white : Colors.primary} />
            <ThemedText style={[
              styles.typeText,
              appointmentType === 'in_person' && styles.selectedText
            ]}>
              Presencial
            </ThemedText>
            <ThemedText style={[
              styles.feeText,
              appointmentType === 'in_person' && styles.selectedText
            ]}>
              ${doctor?.consultation_fee || 0}
            </ThemedText>
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.section}>
        <ThemedText style={styles.sectionTitle}>Horarios Disponibles</ThemedText>
        <View style={styles.timeGrid}>
          {availableTimes.map((time) => (
            <TouchableOpacity
              key={time}
              style={[
                styles.timeSlot,
                selectedTime === time && styles.selectedTimeSlot
              ]}
              onPress={() => setSelectedTime(time)}
            >
              <ThemedText style={[
                styles.timeText,
                selectedTime === time && styles.selectedText
              ]}>
                {time}
              </ThemedText>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      <View style={styles.summary}>
        <ThemedText style={styles.summaryTitle}>Resumen de la Cita</ThemedText>
        <View style={styles.summaryRow}>
          <ThemedText style={styles.summaryLabel}>Doctor:</ThemedText>
          <ThemedText style={styles.summaryValue}>
            Dr. {doctor?.last_name || 'No seleccionado'}
          </ThemedText>
        </View>
        <View style={styles.summaryRow}>
          <ThemedText style={styles.summaryLabel}>Tipo:</ThemedText>
          <ThemedText style={styles.summaryValue}>
            {appointmentType === 'virtual' ? 'Consulta Virtual' : 'Consulta Presencial'}
          </ThemedText>
        </View>
        <View style={styles.summaryRow}>
          <ThemedText style={styles.summaryLabel}>Fecha:</ThemedText>
          <ThemedText style={styles.summaryValue}>
            {selectedDate.toLocaleDateString()} - {selectedTime}
          </ThemedText>
        </View>
        <View style={[styles.summaryRow, styles.totalRow]}>
          <ThemedText style={styles.totalLabel}>Total a Pagar:</ThemedText>
          <ThemedText style={styles.totalValue}>${consultationFee}</ThemedText>
        </View>
      </View>
    </>
  );

  const renderPaymentStep = () => (
    <View style={styles.paymentContainer}>
      <ThemedText style={styles.sectionTitle}>Realizar Pago</ThemedText>
      
      <View style={styles.paymentSummary}>
        <ThemedText style={styles.paymentTitle}>
          Consulta {appointmentType === 'virtual' ? 'Virtual' : 'Presencial'}
        </ThemedText>
        <ThemedText style={styles.paymentDoctor}>
          Dr. {doctor?.first_name} {doctor?.last_name}
        </ThemedText>
        <ThemedText style={styles.paymentAmount}>${consultationFee}</ThemedText>
      </View>

      <View style={styles.paymentMethods}>
        <ThemedText style={styles.paymentMethodTitle}>Métodos de Pago</ThemedText>
        
        <TouchableOpacity 
          style={styles.paymentMethodOption}
          onPress={() => {
            // TODO: Implementar pago móvil
            Alert.alert('Pago Móvil', 'Funcionalidad en desarrollo');
          }}
        >
          <Ionicons name="phone-portrait" size={24} color={Colors.primary} />
          <View style={styles.paymentMethodInfo}>
            <ThemedText style={styles.paymentMethodName}>Pago Móvil</ThemedText>
            <ThemedText style={styles.paymentMethodDesc}>Instantáneo</ThemedText>
          </View>
          <Ionicons name="chevron-forward" size={20} color={Colors.darkGray} />
        </TouchableOpacity>

        <TouchableOpacity 
          style={styles.paymentMethodOption}
          onPress={() => {
            // TODO: Implementar transferencia bancaria
            Alert.alert('Transferencia', 'Funcionalidad en desarrollo');
          }}
        >
          <Ionicons name="card" size={24} color={Colors.primary} />
          <View style={styles.paymentMethodInfo}>
            <ThemedText style={styles.paymentMethodName}>Transferencia Bancaria</ThemedText>
            <ThemedText style={styles.paymentMethodDesc}>Subir comprobante</ThemedText>
          </View>
          <Ionicons name="chevron-forward" size={20} color={Colors.darkGray} />
        </TouchableOpacity>
      </View>
    </View>
  );

  const renderConfirmationStep = () => (
    <View style={styles.confirmationContainer}>
      <View style={styles.successIcon}>
        <Ionicons name="checkmark-circle" size={64} color={Colors.success} />
      </View>
      <ThemedText style={styles.successTitle}>¡Cita Programada!</ThemedText>
      <ThemedText style={styles.successMessage}>
        Tu cita ha sido programada exitosamente. Recibirás un recordatorio antes de la consulta.
      </ThemedText>
      
      <View style={styles.appointmentDetails}>
        <ThemedText style={styles.detailTitle}>Detalles de la Cita</ThemedText>
        <ThemedText style={styles.detailText}>
          Doctor: Dr. {doctor?.first_name} {doctor?.last_name}
        </ThemedText>
        <ThemedText style={styles.detailText}>
          Fecha: {selectedDate.toLocaleDateString()} - {selectedTime}
        </ThemedText>
        <ThemedText style={styles.detailText}>
          Tipo: {appointmentType === 'virtual' ? 'Virtual' : 'Presencial'}
        </ThemedText>
      </View>
    </View>
  );

  return (
    <Modal visible={visible} animationType="slide" presentationStyle="pageSheet">
      <View style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity onPress={onClose} style={styles.closeButton}>
            <Ionicons name="close" size={24} color={Colors.dark} />
          </TouchableOpacity>
          <ThemedText style={styles.headerTitle}>
            {paymentStep === 1 ? 'Agendar Cita' : 
             paymentStep === 2 ? 'Pagar Consulta' : 
             'Confirmación'}
          </ThemedText>
          <View style={styles.placeholder} />
        </View>

        <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
          {paymentStep === 1 && renderAppointmentDetails()}
          {paymentStep === 2 && renderPaymentStep()}
          {paymentStep === 3 && renderConfirmationStep()}
        </ScrollView>

        {paymentStep === 1 && (
          <View style={styles.footer}>
            <TouchableOpacity
              style={[styles.primaryButton, !doctor && styles.disabledButton]}
              onPress={handleScheduleAppointment}
              disabled={!doctor}
            >
              <ThemedText style={styles.primaryButtonText}>
                Continuar al Pago
              </ThemedText>
            </TouchableOpacity>
          </View>
        )}

        {paymentStep === 3 && (
          <View style={styles.footer}>
            <TouchableOpacity style={styles.primaryButton} onPress={onClose}>
              <ThemedText style={styles.primaryButtonText}>Finalizar</ThemedText>
            </TouchableOpacity>
          </View>
        )}
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: Colors.lightGray,
    backgroundColor: Colors.white,
  },
  closeButton: {
    padding: Spacing.sm,
  },
  headerTitle: {
    fontSize: Typography.fontSizes.lg,
    fontWeight: Typography.fontWeights.bold as any,
    color: Colors.dark,
  },
  placeholder: {
    width: 24,
  },
  content: {
    flex: 1,
  },
  section: {
    padding: Spacing.lg,
    backgroundColor: Colors.white,
    marginBottom: Spacing.md,
  },
  sectionTitle: {
    fontSize: Typography.fontSizes.lg,
    fontWeight: Typography.fontWeights.bold as any,
    color: Colors.dark,
    marginBottom: Spacing.md,
  },
  doctorOption: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: Spacing.md,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: Colors.lightGray,
    marginBottom: Spacing.md,
  },
  selectedOption: {
    borderColor: Colors.primary,
    backgroundColor: Colors.primary,
  },
  doctorInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  doctorAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: Spacing.md,
  },
  doctorDetails: {
    flex: 1,
  },
  doctorName: {
    fontSize: Typography.fontSizes.md,
    fontWeight: Typography.fontWeights.bold as any,
    color: Colors.dark,
    marginBottom: Spacing.xs,
  },
  doctorSpecialty: {
    fontSize: Typography.fontSizes.sm,
    color: Colors.darkGray,
    marginBottom: Spacing.xs,
  },
  doctorRating: {
    fontSize: Typography.fontSizes.xs,
    color: Colors.darkGray,
  },
  feeInfo: {
    alignItems: 'flex-end',
  },
  virtualFee: {
    fontSize: Typography.fontSizes.sm,
    color: Colors.success,
    marginBottom: Spacing.xs,
  },
  inPersonFee: {
    fontSize: Typography.fontSizes.sm,
    color: Colors.primary,
  },
  typeSelector: {
    flexDirection: 'row',
    gap: Spacing.md,
  },
  typeOption: {
    flex: 1,
    alignItems: 'center',
    padding: Spacing.lg,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: Colors.lightGray,
  },
  typeText: {
    fontSize: Typography.fontSizes.md,
    fontWeight: Typography.fontWeights.medium as any,
    color: Colors.dark,
    marginTop: Spacing.sm,
  },
  feeText: {
    fontSize: Typography.fontSizes.sm,
    color: Colors.darkGray,
    marginTop: Spacing.xs,
  },
  selectedText: {
    color: Colors.white,
  },
  timeGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.sm,
  },
  timeSlot: {
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: Colors.lightGray,
    backgroundColor: Colors.white,
  },
  selectedTimeSlot: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
  },
  timeText: {
    fontSize: Typography.fontSizes.sm,
    color: Colors.dark,
  },
  summary: {
    backgroundColor: Colors.white,
    margin: Spacing.lg,
    padding: Spacing.lg,
    borderRadius: 12,
    ...BordersAndShadows.shadows.md,
  },
  summaryTitle: {
    fontSize: Typography.fontSizes.lg,
    fontWeight: Typography.fontWeights.bold as any,
    color: Colors.dark,
    marginBottom: Spacing.md,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.sm,
  },
  summaryLabel: {
    fontSize: Typography.fontSizes.md,
    color: Colors.darkGray,
  },
  summaryValue: {
    fontSize: Typography.fontSizes.md,
    color: Colors.dark,
    fontWeight: Typography.fontWeights.medium as any,
  },
  totalRow: {
    borderTopWidth: 1,
    borderTopColor: Colors.lightGray,
    paddingTop: Spacing.sm,
    marginTop: Spacing.sm,
  },
  totalLabel: {
    fontSize: Typography.fontSizes.lg,
    fontWeight: Typography.fontWeights.bold as any,
    color: Colors.dark,
  },
  totalValue: {
    fontSize: Typography.fontSizes.lg,
    fontWeight: Typography.fontWeights.bold as any,
    color: Colors.primary,
  },
  paymentContainer: {
    padding: Spacing.lg,
  },
  paymentSummary: {
    backgroundColor: Colors.white,
    padding: Spacing.lg,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: Spacing.lg,
    ...BordersAndShadows.shadows.sm,
  },
  paymentTitle: {
    fontSize: Typography.fontSizes.lg,
    fontWeight: Typography.fontWeights.bold as any,
    color: Colors.dark,
    marginBottom: Spacing.xs,
  },
  paymentDoctor: {
    fontSize: Typography.fontSizes.md,
    color: Colors.darkGray,
    marginBottom: Spacing.md,
  },
  paymentAmount: {
    fontSize: Typography.fontSizes.xxl,
    fontWeight: Typography.fontWeights.bold as any,
    color: Colors.primary,
  },
  paymentMethods: {
    backgroundColor: Colors.white,
    borderRadius: 12,
    padding: Spacing.lg,
    ...BordersAndShadows.shadows.sm,
  },
  paymentMethodTitle: {
    fontSize: Typography.fontSizes.lg,
    fontWeight: Typography.fontWeights.bold as any,
    color: Colors.dark,
    marginBottom: Spacing.md,
  },
  paymentMethodOption: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: Spacing.md,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: Colors.lightGray,
    marginBottom: Spacing.md,
  },
  paymentMethodInfo: {
    flex: 1,
    marginLeft: Spacing.md,
  },
  paymentMethodName: {
    fontSize: Typography.fontSizes.md,
    fontWeight: Typography.fontWeights.medium as any,
    color: Colors.dark,
    marginBottom: Spacing.xs,
  },
  paymentMethodDesc: {
    fontSize: Typography.fontSizes.sm,
    color: Colors.darkGray,
  },
  confirmationContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: Spacing.xl,
  },
  successIcon: {
    marginBottom: Spacing.xl,
  },
  successTitle: {
    fontSize: Typography.fontSizes.xxl,
    fontWeight: Typography.fontWeights.bold as any,
    color: Colors.success,
    marginBottom: Spacing.md,
    textAlign: 'center',
  },
  successMessage: {
    fontSize: Typography.fontSizes.md,
    color: Colors.darkGray,
    textAlign: 'center',
    marginBottom: Spacing.xl,
    lineHeight: 22,
  },
  appointmentDetails: {
    backgroundColor: Colors.white,
    padding: Spacing.lg,
    borderRadius: 12,
    width: '100%',
    ...BordersAndShadows.shadows.sm,
  },
  detailTitle: {
    fontSize: Typography.fontSizes.lg,
    fontWeight: Typography.fontWeights.bold as any,
    color: Colors.dark,
    marginBottom: Spacing.md,
  },
  detailText: {
    fontSize: Typography.fontSizes.md,
    color: Colors.darkGray,
    marginBottom: Spacing.sm,
  },
  footer: {
    padding: Spacing.lg,
    backgroundColor: Colors.white,
    borderTopWidth: 1,
    borderTopColor: Colors.lightGray,
  },
  primaryButton: {
    backgroundColor: Colors.primary,
    borderRadius: 12,
    padding: Spacing.lg,
    alignItems: 'center',
  },
  disabledButton: {
    backgroundColor: Colors.lightGray,
  },
  primaryButtonText: {
    fontSize: Typography.fontSizes.lg,
    fontWeight: Typography.fontWeights.bold as any,
    color: Colors.white,
  },
});

export default AppointmentScheduler;
