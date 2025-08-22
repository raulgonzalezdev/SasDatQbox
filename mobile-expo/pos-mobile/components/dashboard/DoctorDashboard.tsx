import React from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { ThemedText } from '@/components/ThemedText';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { Colors, Spacing, BordersAndShadows, Typography } from '@/constants/GlobalStyles';
import { useAppStore } from '@/store/appStore';
import { mockDoctorData } from '@/data/mockUsers';

interface DoctorDashboardProps {
  user: any;
}

const DoctorDashboard: React.FC<DoctorDashboardProps> = ({ user }) => {
  const handleCardPress = (route: string) => {
    router.push(route as any);
  };

  // Tarjetas específicas para doctores
  const doctorSummaryCards = [
    {
      id: 'today_appointments',
      title: 'Citas de Hoy',
      value: '8',
      icon: 'calendar-clear',
      color: Colors.primary,
      route: '/(drawer)/(tabs)/appointments',
    },
    {
      id: 'active_patients',
      title: 'Pacientes Activos',
      value: mockDoctorData.patients.filter(p => p.status === 'active').length.toString(),
      icon: 'people',
      color: Colors.success,
      route: '/(drawer)/(tabs)/patients',
    },
    {
      id: 'pending_consultations',
      title: 'Consultas Pendientes',
      value: '3',
      icon: 'medical',
      color: Colors.warning,
      route: '/(drawer)/(tabs)/chat',
    },
    {
      id: 'prescriptions_today',
      title: 'Recetas Emitidas',
      value: '12',
      icon: 'document-text',
      color: Colors.info,
      route: '/(drawer)/(tabs)/appointments',
    },
    {
      id: 'emergency_calls',
      title: 'Llamadas Urgentes',
      value: mockDoctorData.monthlyStats.emergencyCalls.toString(),
      icon: 'call',
      color: Colors.danger,
      route: '/(drawer)/(tabs)/chat',
    },
    {
      id: 'monthly_revenue',
      title: 'Ingresos del Mes',
      value: '$2,450',
      icon: 'cash',
      color: Colors.success,
      route: '/(drawer)/explore',
    },
  ];

  // Acciones rápidas específicas para doctores
  const doctorQuickActions = [
    {
      id: 'new_consultation',
      title: 'Nueva Consulta',
      subtitle: 'Iniciar consulta médica',
      icon: 'medical',
      color: Colors.primary,
      route: '/(drawer)/(tabs)/appointments/new',
    },
    {
      id: 'patient_search',
      title: 'Buscar Paciente',
      subtitle: 'Encontrar historial médico',
      icon: 'search',
      color: Colors.info,
      route: '/(drawer)/(tabs)/patients',
    },
    {
      id: 'prescriptions',
      title: 'Crear Receta',
      subtitle: 'Generar nueva prescripción',
      icon: 'create',
      color: Colors.secondary,
      route: '/(drawer)/(tabs)/chat', // Se podría abrir el chat para enviar receta
    },
    {
      id: 'schedule_review',
      title: 'Revisar Agenda',
      subtitle: 'Ver próximas citas',
      icon: 'time',
      color: Colors.warning,
      route: '/(drawer)/(tabs)/appointments',
    },
  ];

  // Próximas citas prioritarias
  const upcomingAppointments = mockDoctorData.upcomingAppointments.slice(0, 3);

  return (
    <ScrollView showsVerticalScrollIndicator={false}>
      {/* Sección de saludo específica para doctores */}
      <View style={styles.greetingSection}>
        <ThemedText style={styles.greeting}>¡Buenos días, Doctor!</ThemedText>
        <ThemedText style={styles.userName}>
          {`${user?.first_name || 'Doctor'} ${user?.last_name || ''}`}
        </ThemedText>
        <View style={styles.specialtyBadge}>
          <Ionicons name="medical" size={16} color={Colors.primary} />
          <ThemedText style={styles.specialtyText}>
            {user?.specialization || 'Medicina General'}
          </ThemedText>
        </View>
      </View>

      {/* Resumen médico */}
      <View style={styles.section}>
        <ThemedText style={styles.sectionTitle}>Panel Médico</ThemedText>
        <View style={styles.summaryGrid}>
          {doctorSummaryCards.map((card) => (
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

      {/* Próximas citas */}
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <ThemedText style={styles.sectionTitle}>Próximas Citas</ThemedText>
          <TouchableOpacity onPress={() => handleCardPress('/(drawer)/(tabs)/appointments')}>
            <ThemedText style={styles.seeAllText}>Ver todas</ThemedText>
          </TouchableOpacity>
        </View>
        
        {upcomingAppointments.map((appointment) => (
          <TouchableOpacity key={appointment.id} style={styles.appointmentCard}>
            <View style={styles.appointmentTime}>
              <ThemedText style={styles.timeText}>{appointment.time}</ThemedText>
              <ThemedText style={styles.dateText}>
                {new Date(appointment.date).toLocaleDateString('es-ES', { 
                  month: 'short', 
                  day: 'numeric' 
                })}
              </ThemedText>
            </View>
            
            <View style={styles.appointmentContent}>
              <ThemedText style={styles.patientName}>{appointment.patientName}</ThemedText>
              <ThemedText style={styles.appointmentType}>{appointment.type}</ThemedText>
            </View>
            
            <View style={[
              styles.statusBadge, 
              { backgroundColor: appointment.status === 'confirmed' ? Colors.success : Colors.warning }
            ]}>
              <ThemedText style={styles.statusText}>
                {appointment.status === 'confirmed' ? 'Confirmada' : 'Pendiente'}
              </ThemedText>
            </View>
          </TouchableOpacity>
        ))}
      </View>

      {/* Acciones rápidas */}
      <View style={styles.section}>
        <ThemedText style={styles.sectionTitle}>Acciones Médicas</ThemedText>
        <View style={styles.quickActionsGrid}>
          {doctorQuickActions.map((action) => (
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

      {/* Estadísticas del mes */}
      <View style={styles.section}>
        <ThemedText style={styles.sectionTitle}>Estadísticas del Mes</ThemedText>
        <View style={styles.statsContainer}>
          <View style={styles.statItem}>
            <Ionicons name="calendar" size={20} color={Colors.primary} />
            <ThemedText style={styles.statNumber}>
              {mockDoctorData.monthlyStats.totalAppointments}
            </ThemedText>
            <ThemedText style={styles.statLabel}>Citas Atendidas</ThemedText>
          </View>
          
          <View style={styles.statItem}>
            <Ionicons name="person-add" size={20} color={Colors.success} />
            <ThemedText style={styles.statNumber}>
              {mockDoctorData.monthlyStats.newPatients}
            </ThemedText>
            <ThemedText style={styles.statLabel}>Nuevos Pacientes</ThemedText>
          </View>
          
          <View style={styles.statItem}>
            <Ionicons name="document" size={20} color={Colors.info} />
            <ThemedText style={styles.statNumber}>
              {mockDoctorData.monthlyStats.prescriptionsIssued}
            </ThemedText>
            <ThemedText style={styles.statLabel}>Recetas Emitidas</ThemedText>
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
    color: Colors.dark,
    marginBottom: Spacing.xs,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    borderRadius: 8,
    overflow: 'hidden',
  },
  userName: {
    fontSize: Typography.fontSizes.md,
    color: Colors.dark,
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.xs,
    borderRadius: 6,
    overflow: 'hidden',
    marginBottom: Spacing.sm,
  },
  specialtyBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    borderRadius: 20,
    alignSelf: 'flex-start',
  },
  specialtyText: {
    color: Colors.white,
    fontSize: Typography.fontSizes.sm,
    marginLeft: Spacing.xs,
    fontWeight: Typography.fontWeights.medium,
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
  appointmentCard: {
    flexDirection: 'row',
    backgroundColor: Colors.white,
    borderRadius: 15,
    padding: Spacing.lg,
    marginHorizontal: Spacing.lg,
    marginBottom: Spacing.md,
    alignItems: 'center',
    ...BordersAndShadows.shadows.sm,
  },
  appointmentTime: {
    width: 60,
    alignItems: 'center',
    marginRight: Spacing.md,
  },
  timeText: {
    fontSize: Typography.fontSizes.md,
    fontWeight: 'bold',
    color: Colors.primary,
  },
  dateText: {
    fontSize: Typography.fontSizes.xs,
    color: Colors.darkGray,
  },
  appointmentContent: {
    flex: 1,
  },
  patientName: {
    fontSize: Typography.fontSizes.md,
    fontWeight: 'bold',
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
    borderRadius: 12,
  },
  statusText: {
    fontSize: Typography.fontSizes.xs,
    color: Colors.white,
    fontWeight: 'bold',
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
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    backgroundColor: Colors.white,
    borderRadius: 20,
    padding: Spacing.lg,
    marginHorizontal: Spacing.lg,
    ...BordersAndShadows.shadows.sm,
  },
  statItem: {
    alignItems: 'center',
  },
  statNumber: {
    fontSize: Typography.fontSizes.xl,
    fontWeight: 'bold',
    color: Colors.dark,
    marginVertical: Spacing.xs,
  },
  statLabel: {
    fontSize: Typography.fontSizes.xs,
    color: Colors.darkGray,
    textAlign: 'center',
  },
});

export default DoctorDashboard;
