import React from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { ThemedText } from '@/components/ThemedText';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { Colors, Spacing, BordersAndShadows, Typography } from '@/constants/GlobalStyles';
import { useAppStore } from '@/store/appStore';
import { mockPatientMedicalData } from '@/data/mockUsers';

interface PatientDashboardProps {
  user: any;
}

const PatientDashboard: React.FC<PatientDashboardProps> = ({ user }) => {
  const handleCardPress = (route: string) => {
    router.push(route as any);
  };

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
      title: 'Mi Doctor',
      value: 'Dr. González',
      icon: 'medical',
      color: Colors.success,
      route: '/(drawer)/(tabs)/chat', // Ir al chat con el doctor
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
    fontSize: Typography.fontSizes.xl,
    fontWeight: 'bold',
    color: Colors.white,
    marginBottom: Spacing.xs,
  },
  userName: {
    fontSize: Typography.fontSizes.md,
    color: Colors.white,
    opacity: 0.9,
    marginBottom: Spacing.md,
  },
  healthStatusCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 15,
    padding: Spacing.md,
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
    color: Colors.white,
    fontSize: Typography.fontSizes.sm,
    fontWeight: Typography.fontWeights.medium,
  },
  lastCheckup: {
    color: Colors.white,
    fontSize: Typography.fontSizes.xs,
    opacity: 0.8,
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
    backgroundColor: Colors.white,
    borderRadius: 20,
    padding: Spacing.lg,
    marginBottom: Spacing.md,
    alignItems: 'center',
    ...BordersAndShadows.shadows.md,
  },
  summaryIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: Spacing.sm,
  },
  summaryTitle: {
    fontSize: Typography.fontSizes.sm,
    color: Colors.darkGray,
    textAlign: 'center',
    marginBottom: Spacing.xs,
  },
  summaryValue: {
    fontSize: Typography.fontSizes.lg,
    fontWeight: 'bold',
    color: Colors.dark,
    textAlign: 'center',
  },
  medicationCard: {
    flexDirection: 'row',
    backgroundColor: Colors.white,
    borderRadius: 15,
    padding: Spacing.lg,
    marginHorizontal: Spacing.lg,
    marginBottom: Spacing.md,
    alignItems: 'center',
    ...BordersAndShadows.shadows.sm,
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
});

export default PatientDashboard;
