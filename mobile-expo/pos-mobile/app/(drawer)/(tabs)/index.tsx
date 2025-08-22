import React, { useEffect } from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity, SafeAreaView } from 'react-native';
import { ThemedView } from '@/components/ThemedView';
import { ThemedText } from '@/components/ThemedText';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { Colors, CommonStyles, Spacing, BordersAndShadows, Typography } from '@/constants/GlobalStyles';
import { useAppStore } from '@/store/appStore';
import DoctorDashboard from '@/components/dashboard/DoctorDashboard';
import PatientDashboard from '@/components/dashboard/PatientDashboard';
import { mockUsers } from '@/data/mockUsers';

export default function HomeScreen() {
  const { user, setUser } = useAppStore();
  const isDoctor = user?.role === 'doctor';
  const isPatient = user?.role === 'patient';

  // Para testing: establecer usuario mock si no hay uno
  useEffect(() => {
    if (!user) {
      // Por defecto, establecer como doctor para testing
      // Puedes cambiar esto a mockUsers.patient para probar la vista de paciente
      setUser(mockUsers.doctor);
    }
  }, [user, setUser]);

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Buenos días';
    if (hour < 18) return 'Buenas tardes';
    return 'Buenas noches';
  };

  const summaryCards = [
    {
      id: 'next_appointment',
      title: 'Próxima Cita',
      value: 'Mañana',
      icon: 'calendar',
      color: Colors.primary,
      route: '/(drawer)/(tabs)/appointments',
    },
    {
      id: 'total_appointments',
      title: 'Citas Totales',
      value: '15',
      icon: 'checkmark-circle',
      color: Colors.success,
      route: '/(drawer)/(tabs)/appointments',
    },
    {
      id: 'new_patients',
      title: 'Nuevos Pacientes',
      value: '3',
      icon: 'person-add',
      color: Colors.info,
      route: '/(drawer)/(tabs)/patients',
    },
    {
      id: 'unread_messages',
      title: 'Mensajes Sin Leer',
      value: '2',
      icon: 'chatbubbles',
      color: Colors.warning,
      route: '/(tabs)/chat',
    },
    {
      id: 'premium_features',
      title: 'Funciones Premium',
      value: 'Explorar',
      icon: 'star',
      color: Colors.info,
      route: '/(drawer)/explore',
    },
    {
      id: 'profile_completion',
      title: 'Perfil Completo',
      value: '80%',
      icon: 'document-text',
      color: Colors.warning,
      route: '/(drawer)/profile',
    },
  ];

  const quickActions = [
    {
      id: 'my_appointments',
      title: 'Mis Citas',
      subtitle: 'Ver próximas citas',
      icon: 'calendar',
      color: Colors.primary,
      route: '/(drawer)/(tabs)/appointments',
    },
    {
      id: 'schedule_appointment',
      title: 'Agendar Cita',
      subtitle: 'Reservar nueva cita',
      icon: 'add-circle',
      color: Colors.info,
      route: '/(drawer)/(tabs)/appointments',
    },
  ];

  const handleCardPress = (route: string) => {
    router.push(route as any);
  };

  // Mostrar mensaje de carga si no hay usuario
  if (!user) {
    return (
      <SafeAreaView style={styles.safeAreaContent}>
        <ThemedView style={CommonStyles.container}>
          <View style={styles.loadingContainer}>
            <ThemedText style={styles.loadingText}>Cargando...</ThemedText>
          </View>
        </ThemedView>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safeAreaContent}>
      <ThemedView style={CommonStyles.container}>
        {/* Mostrar dashboard específico según el rol */}
        {isDoctor && <DoctorDashboard user={user} />}
        {isPatient && <PatientDashboard user={user} />}
        
        {/* Fallback para otros roles o admin */}
        {!isDoctor && !isPatient && (
          <ScrollView showsVerticalScrollIndicator={false}>
            <View style={styles.greetingSection}>
              <ThemedText style={styles.greeting}>{getGreeting()}</ThemedText>
              <ThemedText style={styles.userName}>
                {`${user?.first_name || 'Usuario'} ${user?.last_name || ''}`}
              </ThemedText>
              <ThemedText style={styles.roleText}>
                Rol: {user?.role || 'No definido'}
              </ThemedText>
            </View>
            
            <View style={styles.section}>
              <ThemedText style={styles.sectionTitle}>Panel de Administración</ThemedText>
              <View style={styles.adminCard}>
                <Ionicons name="settings" size={48} color={Colors.primary} />
                <ThemedText style={styles.adminText}>
                  Panel administrativo en desarrollo
                </ThemedText>
              </View>
            </View>
          </ScrollView>
        )}
      </ThemedView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeAreaContent: {
    flex: 1,
    backgroundColor: Colors.background, // Fondo claro para el contenido
  },
  greetingSection: {
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.lg,
  },
  greeting: {
    fontSize: Typography.fontSizes.xl,
    fontWeight: 'bold' as const,
    color: Colors.dark,
    marginBottom: Spacing.xs,
  },
  userName: {
    fontSize: Typography.fontSizes.md,
    color: Colors.darkGray,
  },
  section: {
    marginBottom: Spacing.xl,
  },
  sectionTitle: {
    fontSize: Typography.fontSizes.lg,
    fontWeight: 'bold' as const,
    color: Colors.dark,
    marginBottom: Spacing.lg,
    paddingHorizontal: Spacing.lg,
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
    borderRadius: 20, // Más redondeadas
    padding: Spacing.lg,
    marginBottom: Spacing.md,
    alignItems: 'center',
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
    fontWeight: 'bold' as const,
    color: Colors.dark,
    textAlign: 'center',
  },
  quickActionsGrid: {
    paddingHorizontal: Spacing.lg,
  },
  quickActionCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.white,
    borderRadius: 20, // Más redondeadas
    padding: Spacing.lg,
    marginBottom: Spacing.md,
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
    fontWeight: 'bold' as const,
    color: Colors.dark,
    marginBottom: Spacing.xs,
  },
  quickActionSubtitle: {
    fontSize: Typography.fontSizes.sm,
    color: Colors.darkGray,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    fontSize: Typography.fontSizes.lg,
    color: Colors.darkGray,
  },
  roleText: {
    fontSize: Typography.fontSizes.sm,
    color: Colors.white,
    opacity: 0.8,
    marginTop: Spacing.xs,
  },
  adminCard: {
    backgroundColor: Colors.white,
    borderRadius: 20,
    padding: Spacing.xl,
    marginHorizontal: Spacing.lg,
    alignItems: 'center',
    ...BordersAndShadows.shadows.md,
  },
  adminText: {
    fontSize: Typography.fontSizes.md,
    color: Colors.darkGray,
    textAlign: 'center',
    marginTop: Spacing.md,
  },
});
