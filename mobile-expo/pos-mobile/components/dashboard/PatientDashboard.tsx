import React, { useEffect } from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { ThemedText } from '@/components/ThemedText';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { Colors, Spacing, BordersAndShadows, Typography } from '@/constants/GlobalStyles';
import { useAppStore } from '@/store/appStore';
import { useMedicalStore, getMockDoctors } from '@/store/medicalStore';
import { mockPatientMedicalData } from '@/data/mockUsers';

interface PatientDashboardProps {
  user: any;
}

const PatientDashboard: React.FC<PatientDashboardProps> = ({ user }) => {
  const { 
    patientDoctors, 
    addDoctorToPatient, 
    getUnpaidAppointments,
    scheduleAppointment 
  } = useMedicalStore();

  // Inicializar doctores de ejemplo si no hay ninguno
  useEffect(() => {
    if (patientDoctors.length === 0) {
      const mockDoctors = getMockDoctors();
      // Agregar múltiples doctores - el primero como primario
      addDoctorToPatient(mockDoctors[0], true);  // Dr. María González - Primario
      addDoctorToPatient(mockDoctors[1], false); // Dr. Carlos Rodríguez - Secundario
      addDoctorToPatient(mockDoctors[2], false); // Dra. Ana Martínez - Secundario
    }
  }, [patientDoctors.length, addDoctorToPatient]);

  const handleCardPress = (route: string) => {
    router.push(route as any);
  };

  const handleScheduleAppointment = () => {
    if (patientDoctors.length === 0) {
      Alert.alert('Sin doctores', 'Primero debe agregar un doctor a su lista.');
      return;
    }
    router.push('/(drawer)/(tabs)/appointments');
  };

  const handleViewDoctors = () => {
    // TODO: Navegar a página de mis doctores
    router.push('/(drawer)/(tabs)/patients');
  };

  // Obtener doctor primario
  const primaryDoctor = patientDoctors.find(pd => pd.is_primary)?.doctor;

  // Tarjetas específicas para pacientes
  const patientSummaryCards = [
    {
      id: 'next_appointment',
      title: 'Próxima Cita',
      value: 'Mañana 10:00',
      icon: 'calendar',
      color: Colors.primary,
      route: '/(drawer)/(tabs)/appointments',
    },
    {
      id: 'my_doctor',
      title: patientDoctors.length > 1 ? 'Mis Doctores' : 'Mi Doctor',
      value: primaryDoctor ? `Dr. ${primaryDoctor.last_name}` : 'Sin asignar',
      icon: 'medical',
      color: Colors.success,
      route: '/(drawer)/(tabs)/patients', // Ir a ver doctores
    },
    {
      id: 'medications',
      title: 'Medicamentos',
      value: mockPatientMedicalData.currentMedications.length.toString(),
      icon: 'fitness',
      color: Colors.info,
      route: '/(drawer)/(tabs)/patients', // Ir a mi perfil médico
    },
    {
      id: 'health_records',
      title: 'Mis Registros',
      value: 'Ver Historial',
      icon: 'document-text',
      color: Colors.warning,
      route: '/(drawer)/(tabs)/patients',
    },
    {
      id: 'symptoms_tracker',
      title: 'Seguimiento',
      value: 'Registrar',
      icon: 'pulse',
      color: Colors.secondary,
      route: '/(drawer)/explore',
    },
    {
      id: 'emergency_contact',
      title: 'Emergencia',
      value: 'Contactar',
      icon: 'call',
      color: Colors.danger,
      route: '/(drawer)/(tabs)/chat',
    },
  ];

  // Acciones rápidas específicas para pacientes
  const patientQuickActions = [
    {
      id: 'book_appointment',
      title: 'Agendar Cita',
      subtitle: 'Reservar nueva consulta',
      icon: 'add-circle',
      color: Colors.primary,
      route: '/(drawer)/(tabs)/appointments',
    },
    {
      id: 'message_doctor',
      title: 'Consultar Médico',
      subtitle: 'Enviar mensaje o consulta',
      icon: 'chatbubbles',
      color: Colors.info,
      route: '/(drawer)/(tabs)/chat',
    },
    {
      id: 'upload_results',
      title: 'Subir Resultados',
      subtitle: 'Compartir estudios médicos',
      icon: 'cloud-upload',
      color: Colors.secondary,
      route: '/(drawer)/(tabs)/chat', // Enviar por chat
    },
    {
      id: 'view_prescriptions',
      title: 'Mis Recetas',
      subtitle: 'Ver prescripciones médicas',
      icon: 'receipt',
      color: Colors.success,
      route: '/(drawer)/(tabs)/patients',
    },
  ];

  return (
    <ScrollView showsVerticalScrollIndicator={false}>
      {/* Sección de saludo específica para pacientes */}
      <View style={styles.greetingSection}>
        <ThemedText style={styles.greeting}>¡Hola!</ThemedText>
        <ThemedText style={styles.userName}>
          {`${user?.first_name || 'Paciente'} ${user?.last_name || ''}`}
        </ThemedText>
        <View style={styles.healthStatusCard}>
          <View style={styles.healthIndicator}>
            <View style={[styles.statusDot, { backgroundColor: Colors.success }]} />
            <ThemedText style={styles.healthStatusText}>Estado: Estable</ThemedText>
          </View>
          <ThemedText style={styles.lastCheckup}>
            Última consulta: 15 Ene 2024
          </ThemedText>
        </View>
      </View>

      {/* Panel de salud del paciente */}
      <View style={styles.section}>
        <ThemedText style={styles.sectionTitle}>Mi Panel de Salud</ThemedText>
        <View style={styles.summaryGrid}>
          {patientSummaryCards.map((card) => (
            <TouchableOpacity
              key={card.id}
              style={styles.summaryCard}
              onPress={() => handleCardPress(card.route)}
            >
              <View style={[styles.summaryIcon, { backgroundColor: card.color }]}>
                <Ionicons name={card.icon as any} size={24} color={Colors.white} />
              </View>
              <ThemedText style={styles.summaryTitle}>{card.title}</ThemedText>
              <ThemedText style={styles.summaryValue}>{card.value}</ThemedText>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* Mis Doctores */}
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <ThemedText style={styles.sectionTitle}>Mis Doctores</ThemedText>
          <TouchableOpacity onPress={handleViewDoctors}>
            <ThemedText style={styles.seeAllText}>Ver todos</ThemedText>
          </TouchableOpacity>
        </View>
        
        <View style={styles.doctorsContainer}>
          {patientDoctors.slice(0, 4).map((patientDoctor) => (
            <View key={patientDoctor.doctor_id} style={styles.doctorCard}>
              <View style={styles.doctorAvatar}>
                <Ionicons name="person" size={24} color={Colors.white} />
              </View>
              <View style={styles.doctorContent}>
                <ThemedText style={styles.doctorName}>
                  Dr. {patientDoctor.doctor.first_name} {patientDoctor.doctor.last_name}
                </ThemedText>
                <ThemedText style={styles.doctorSpecialty}>
                  {patientDoctor.doctor.specialty}
                </ThemedText>
                {patientDoctor.is_primary && (
                  <View style={styles.primaryBadge}>
                    <ThemedText style={styles.primaryText}>Principal</ThemedText>
                  </View>
                )}
              </View>
              <TouchableOpacity 
                style={styles.chatButton}
                onPress={() => router.push('/(drawer)/(tabs)/chat')}
              >
                <Ionicons name="chatbubbles" size={20} color={Colors.primary} />
              </TouchableOpacity>
            </View>
          ))}
          
          {patientDoctors.length === 0 && (
            <View style={styles.emptyDoctors}>
              <Ionicons name="medical" size={48} color={Colors.lightGray} />
              <ThemedText style={styles.emptyText}>
                No tienes doctores asignados
              </ThemedText>
            </View>
          )}
        </View>
      </View>

      {/* Medicamentos actuales */}
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <ThemedText style={styles.sectionTitle}>Medicamentos Actuales</ThemedText>
          <TouchableOpacity onPress={() => handleCardPress('/(drawer)/(tabs)/patients')}>
            <ThemedText style={styles.seeAllText}>Ver todos</ThemedText>
          </TouchableOpacity>
        </View>
        
        {mockPatientMedicalData.currentMedications.slice(0, 2).map((medication) => (
          <View key={medication.id} style={styles.medicationCard}>
            <View style={styles.medicationIcon}>
              <Ionicons name="medical" size={20} color={Colors.primary} />
            </View>
            
            <View style={styles.medicationContent}>
              <ThemedText style={styles.medicationName}>{medication.name}</ThemedText>
              <ThemedText style={styles.medicationDosage}>
                {medication.dosage} - {medication.frequency}
              </ThemedText>
              <ThemedText style={styles.prescribedBy}>
                Prescrito por: {medication.prescribedBy}
              </ThemedText>
            </View>
            
            <TouchableOpacity style={styles.reminderButton}>
              <Ionicons name="alarm" size={16} color={Colors.warning} />
            </TouchableOpacity>
          </View>
        ))}
      </View>

      {/* Signos vitales recientes */}
      <View style={styles.section}>
        <ThemedText style={styles.sectionTitle}>Últimos Signos Vitales</ThemedText>
        <View style={styles.vitalsContainer}>
          <View style={styles.vitalItem}>
            <Ionicons name="heart" size={20} color={Colors.danger} />
            <ThemedText style={styles.vitalValue}>
              {mockPatientMedicalData.vitalSigns.heartRate}
            </ThemedText>
            <ThemedText style={styles.vitalUnit}>bpm</ThemedText>
            <ThemedText style={styles.vitalLabel}>Frecuencia Cardíaca</ThemedText>
          </View>
          
          <View style={styles.vitalItem}>
            <Ionicons name="speedometer" size={20} color={Colors.primary} />
            <ThemedText style={styles.vitalValue}>
              {mockPatientMedicalData.vitalSigns.bloodPressure}
            </ThemedText>
            <ThemedText style={styles.vitalUnit}>mmHg</ThemedText>
            <ThemedText style={styles.vitalLabel}>Presión Arterial</ThemedText>
          </View>
          
          <View style={styles.vitalItem}>
            <Ionicons name="thermometer" size={20} color={Colors.info} />
            <ThemedText style={styles.vitalValue}>
              {mockPatientMedicalData.vitalSigns.temperature}
            </ThemedText>
            <ThemedText style={styles.vitalUnit}>°C</ThemedText>
            <ThemedText style={styles.vitalLabel}>Temperatura</ThemedText>
          </View>
        </View>
      </View>

      {/* Acciones rápidas */}
      <View style={styles.section}>
        <ThemedText style={styles.sectionTitle}>Acciones Rápidas</ThemedText>
        <View style={styles.quickActionsGrid}>
          {patientQuickActions.map((action) => (
            <TouchableOpacity
              key={action.id}
              style={styles.quickActionCard}
              onPress={() => handleCardPress(action.route)}
            >
              <View style={[styles.quickActionIcon, { backgroundColor: action.color }]}>
                <Ionicons name={action.icon as any} size={24} color={Colors.white} />
              </View>
              <View style={styles.quickActionContent}>
                <ThemedText style={styles.quickActionTitle}>{action.title}</ThemedText>
                <ThemedText style={styles.quickActionSubtitle}>{action.subtitle}</ThemedText>
              </View>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* Alertas de salud */}
      <View style={styles.section}>
        <ThemedText style={styles.sectionTitle}>Alertas de Salud</ThemedText>
        
        {mockPatientMedicalData.allergies.length > 0 && (
          <View style={styles.alertCard}>
            <View style={styles.alertIcon}>
              <Ionicons name="warning" size={20} color={Colors.warning} />
            </View>
            <View style={styles.alertContent}>
              <ThemedText style={styles.alertTitle}>Alergias Registradas</ThemedText>
              <ThemedText style={styles.alertText}>
                {mockPatientMedicalData.allergies.map(a => a.allergen).join(', ')}
              </ThemedText>
            </View>
          </View>
        )}
        
        <View style={styles.alertCard}>
          <View style={styles.alertIcon}>
            <Ionicons name="information-circle" size={20} color={Colors.info} />
          </View>
          <View style={styles.alertContent}>
            <ThemedText style={styles.alertTitle}>Recordatorio</ThemedText>
            <ThemedText style={styles.alertText}>
              No olvides tomar tu medicación de la mañana
            </ThemedText>
          </View>
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  greetingSection: {
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.lg,
  },
  greeting: {
    fontSize: Typography.fontSizes.xxl,
    fontWeight: Typography.fontWeights.bold,
    color: Colors.white,
    marginBottom: Spacing.xs,
    lineHeight: Typography.lineHeights.tight * Typography.fontSizes.xxl,
    letterSpacing: Typography.letterSpacing.tight,
  },
  userName: {
    fontSize: Typography.fontSizes.lg,
    fontWeight: Typography.fontWeights.medium,
    color: 'rgba(255, 255, 255, 0.9)',
    marginBottom: Spacing.md,
    lineHeight: Typography.lineHeights.normal * Typography.fontSizes.lg,
  },
  healthStatusCard: {
    backgroundColor: Colors.surface,
    borderRadius: BordersAndShadows.borderRadius.xl,
    padding: Spacing.lg,
    ...BordersAndShadows.shadows.md,
    ...BordersAndShadows.borders.light,
    borderWidth: 1,
    borderColor: Colors.borderLight,
  },
  healthIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Spacing.xs,
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: Spacing.sm,
  },
  healthStatusText: {
    color: Colors.dark,
    fontSize: Typography.fontSizes.sm,
    fontWeight: Typography.fontWeights.medium as any,
  },
  lastCheckup: {
    color: Colors.darkGray,
    fontSize: Typography.fontSizes.xs,
    opacity: 0.9,
  },
  section: {
    marginBottom: Spacing.xl,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: Spacing.lg,
    marginBottom: Spacing.lg,
  },
  sectionTitle: {
    fontSize: Typography.fontSizes.lg,
    fontWeight: 'bold',
    color: Colors.dark,
    paddingHorizontal: Spacing.lg,
    marginBottom: Spacing.lg,
  },
  seeAllText: {
    fontSize: Typography.fontSizes.sm,
    color: Colors.primary,
    fontWeight: Typography.fontWeights.medium,
  },
  summaryGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.lg,
  },
  summaryCard: {
    width: '48%',
    backgroundColor: Colors.surface,
    borderRadius: BordersAndShadows.borderRadius.xl,
    padding: Spacing.lg,
    marginBottom: Spacing.md,
    alignItems: 'center',
    ...BordersAndShadows.shadows.sm,
    ...BordersAndShadows.borders.light,
    borderWidth: 1,
    borderColor: Colors.borderLight,
  },
  summaryIcon: {
    width: 52,
    height: 52,
    borderRadius: BordersAndShadows.borderRadius.lg,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: Spacing.md,
    ...BordersAndShadows.shadows.xs,
  },
  summaryTitle: {
    fontSize: Typography.fontSizes.sm,
    fontWeight: Typography.fontWeights.semibold,
    color: Colors.neutral[600],
    textAlign: 'center',
    marginBottom: Spacing.xs,
    lineHeight: Typography.lineHeights.normal * Typography.fontSizes.sm,
  },
  summaryValue: {
    fontSize: Typography.fontSizes.xl,
    fontWeight: Typography.fontWeights.bold,
    color: Colors.dark,
    textAlign: 'center',
    lineHeight: Typography.lineHeights.tight * Typography.fontSizes.xl,
    letterSpacing: Typography.letterSpacing.tight,
  },
  medicationCard: {
    flexDirection: 'row',
    backgroundColor: Colors.surface,
    borderRadius: BordersAndShadows.borderRadius.lg,
    padding: Spacing.lg,
    marginHorizontal: Spacing.lg,
    marginBottom: Spacing.md,
    alignItems: 'center',
    ...BordersAndShadows.shadows.sm,
    ...BordersAndShadows.borders.light,
    borderWidth: 1,
    borderColor: Colors.borderLight,
  },
  medicationIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.lightGray,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: Spacing.md,
  },
  medicationContent: {
    flex: 1,
  },
  medicationName: {
    fontSize: Typography.fontSizes.md,
    fontWeight: 'bold',
    color: Colors.dark,
    marginBottom: Spacing.xs,
  },
  medicationDosage: {
    fontSize: Typography.fontSizes.sm,
    color: Colors.darkGray,
    marginBottom: Spacing.xs,
  },
  prescribedBy: {
    fontSize: Typography.fontSizes.xs,
    color: Colors.primary,
  },
  reminderButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: Colors.lightGray,
    justifyContent: 'center',
    alignItems: 'center',
  },
  vitalsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    backgroundColor: Colors.white,
    borderRadius: 20,
    padding: Spacing.lg,
    marginHorizontal: Spacing.lg,
    ...BordersAndShadows.shadows.sm,
  },
  vitalItem: {
    alignItems: 'center',
    flex: 1,
  },
  vitalValue: {
    fontSize: Typography.fontSizes.lg,
    fontWeight: 'bold',
    color: Colors.dark,
    marginTop: Spacing.xs,
  },
  vitalUnit: {
    fontSize: Typography.fontSizes.xs,
    color: Colors.darkGray,
  },
  vitalLabel: {
    fontSize: Typography.fontSizes.xs,
    color: Colors.darkGray,
    textAlign: 'center',
    marginTop: Spacing.xs,
  },
  quickActionsGrid: {
    paddingHorizontal: Spacing.lg,
  },
  quickActionCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.white,
    borderRadius: 20,
    padding: Spacing.lg,
    marginBottom: Spacing.md,
    ...BordersAndShadows.shadows.sm,
  },
  quickActionIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: Spacing.md,
  },
  quickActionContent: {
    flex: 1,
  },
  quickActionTitle: {
    fontSize: Typography.fontSizes.md,
    fontWeight: 'bold',
    color: Colors.dark,
    marginBottom: Spacing.xs,
  },
  quickActionSubtitle: {
    fontSize: Typography.fontSizes.sm,
    color: Colors.darkGray,
  },
  alertCard: {
    flexDirection: 'row',
    backgroundColor: Colors.white,
    borderRadius: 15,
    padding: Spacing.lg,
    marginHorizontal: Spacing.lg,
    marginBottom: Spacing.md,
    borderLeftWidth: 4,
    borderLeftColor: Colors.warning,
    ...BordersAndShadows.shadows.sm,
  },
  alertIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.lightGray,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: Spacing.md,
  },
  alertContent: {
    flex: 1,
  },
  alertTitle: {
    fontSize: Typography.fontSizes.sm,
    fontWeight: 'bold',
    color: Colors.dark,
    marginBottom: Spacing.xs,
  },
  alertText: {
    fontSize: Typography.fontSizes.sm,
    color: Colors.darkGray,
  },
  // Estilos para sección de doctores
  doctorsContainer: {
    paddingHorizontal: Spacing.lg,
  },
  doctorCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.surface,
    borderRadius: BordersAndShadows.borderRadius.lg,
    padding: Spacing.lg,
    marginBottom: Spacing.md,
    ...BordersAndShadows.shadows.sm,
    ...BordersAndShadows.borders.light,
    borderWidth: 1,
    borderColor: Colors.borderLight,
  },
  doctorAvatar: {
    width: 56,
    height: 56,
    borderRadius: BordersAndShadows.borderRadius.lg,
    backgroundColor: Colors.primarySoft,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: Spacing.lg,
    ...BordersAndShadows.shadows.xs,
  },
  doctorContent: {
    flex: 1,
  },
  doctorName: {
    fontSize: Typography.fontSizes.lg,
    fontWeight: Typography.fontWeights.semibold,
    color: Colors.dark,
    marginBottom: Spacing.xs,
    lineHeight: Typography.lineHeights.tight * Typography.fontSizes.lg,
  },
  doctorSpecialty: {
    fontSize: Typography.fontSizes.md,
    fontWeight: Typography.fontWeights.medium,
    color: Colors.primary,
    marginBottom: Spacing.xs,
  },
  primaryBadge: {
    backgroundColor: Colors.primary,
    borderRadius: 12,
    paddingHorizontal: Spacing.sm,
    paddingVertical: 2,
    alignSelf: 'flex-start',
  },
  primaryText: {
    fontSize: Typography.fontSizes.xs,
    color: Colors.white,
    fontWeight: Typography.fontWeights.bold as any,
  },
  chatButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.lightGray,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyDoctors: {
    alignItems: 'center',
    padding: Spacing.xl,
    backgroundColor: Colors.white,
    borderRadius: 15,
    marginHorizontal: Spacing.lg,
    ...BordersAndShadows.shadows.sm,
  },
  emptyText: {
    fontSize: Typography.fontSizes.md,
    color: Colors.darkGray,
    textAlign: 'center',
    marginTop: Spacing.md,
  },
});

export default PatientDashboard;
