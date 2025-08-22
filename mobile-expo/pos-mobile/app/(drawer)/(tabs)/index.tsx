import React, { useEffect, useState } from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity, SafeAreaView, Modal } from 'react-native';
import { ThemedView } from '@/components/ThemedView';
import { ThemedText } from '@/components/ThemedText';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { Colors, CommonStyles, Spacing, BordersAndShadows, Typography } from '@/constants/GlobalStyles';
import { useAppStore } from '@/store/appStore';
import DoctorDashboard from '@/components/dashboard/DoctorDashboard';
import PatientDashboard from '@/components/dashboard/PatientDashboard';
import DoctorMapSearch from '@/components/location/DoctorMapSearch';
import MedicalServiceRequest from '@/components/location/MedicalServiceRequest';
import ServiceTracker from '@/components/tracking/ServiceTracker';
import InvestorDashboard from '@/components/investor/InvestorDashboard';
import { DoctorLocation } from '@/store/locationStore';
import { useServiceTrackingStore } from '@/store/serviceTrackingStore';
import { mockUsers } from '@/data/mockUsers';

export default function HomeScreen() {
  const { user, setUser } = useAppStore();
  const isDoctor = user?.role === 'doctor';
  const isPatient = user?.role === 'patient';
  
  // Estados para el marketplace médico
  const [showDoctorSearch, setShowDoctorSearch] = useState(false);
  const [showServiceRequest, setShowServiceRequest] = useState(false);
  const [selectedDoctor, setSelectedDoctor] = useState<DoctorLocation | null>(null);
  
  // Estados para tracking e investor dashboard
  const [showServiceTracker, setShowServiceTracker] = useState(false);
  const [showInvestorDashboard, setShowInvestorDashboard] = useState(false);
  
  // Store de tracking de servicios
  const { 
    currentService, 
    createServiceRequest, 
    simulateServiceFlow,
    metrics 
  } = useServiceTrackingStore();

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

  // Funciones para el marketplace médico
  const handleDoctorSelect = (doctor: DoctorLocation) => {
    setSelectedDoctor(doctor);
    setShowDoctorSearch(false);
    setShowServiceRequest(true);
  };

  const handleQuickAction = async (action: string) => {
    switch (action) {
      case 'find_doctor':
        setShowDoctorSearch(true);
        break;
      case 'emergency':
        console.log('🚨 Emergencia médica');
        setShowServiceRequest(true);
        break;
      case 'virtual_consult':
        setShowServiceRequest(true);
        break;
      case 'home_visit':
        setShowServiceRequest(true);
        break;
      case 'track_service':
        setShowServiceTracker(true);
        break;
      case 'investor_demo':
        setShowInvestorDashboard(true);
        break;
      case 'simulate_service':
        // Demostración para inversionistas
        await simulateServiceFlow('home_visit');
        setShowServiceTracker(true);
        break;
      default:
        console.log('Acción no implementada:', action);
    }
  };

  // Renderizar acciones rápidas para pacientes (estilo Uber)
  const renderPatientQuickActions = () => (
    <View style={styles.marketplaceSection}>
      <ThemedText style={styles.sectionTitle}>¿Qué necesitas hoy?</ThemedText>
      
      {/* Acción principal - Encontrar Doctor */}
      <TouchableOpacity
        style={styles.primaryActionCard}
        onPress={() => handleQuickAction('find_doctor')}
      >
        <View style={styles.primaryActionContent}>
          <View style={styles.primaryActionIcon}>
            <Ionicons name="search" size={32} color={Colors.white} />
          </View>
          <View style={styles.primaryActionText}>
            <ThemedText style={styles.primaryActionTitle}>Encontrar Doctor</ThemedText>
            <ThemedText style={styles.primaryActionSubtitle}>
              Busca profesionales cerca de ti
            </ThemedText>
          </View>
          <Ionicons name="chevron-forward" size={24} color={Colors.white} />
        </View>
      </TouchableOpacity>

      {/* Acciones secundarias */}
      <View style={styles.secondaryActionsGrid}>
        <TouchableOpacity
          style={[styles.secondaryActionCard, styles.emergencyCard]}
          onPress={() => handleQuickAction('emergency')}
        >
          <Ionicons name="medical" size={24} color={Colors.white} />
          <ThemedText style={styles.secondaryActionTitle}>Emergencia</ThemedText>
          <ThemedText style={styles.secondaryActionSubtitle}>Atención inmediata</ThemedText>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.secondaryActionCard}
          onPress={() => handleQuickAction('virtual_consult')}
        >
          <Ionicons name="videocam" size={24} color={Colors.primary} />
          <ThemedText style={styles.secondaryActionTitleDark}>Consulta Virtual</ThemedText>
          <ThemedText style={styles.secondaryActionSubtitleDark}>Desde casa</ThemedText>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.secondaryActionCard}
          onPress={() => handleQuickAction('home_visit')}
        >
          <Ionicons name="home" size={24} color={Colors.primary} />
          <ThemedText style={styles.secondaryActionTitleDark}>Visita a Casa</ThemedText>
          <ThemedText style={styles.secondaryActionSubtitleDark}>Doctor a domicilio</ThemedText>
        </TouchableOpacity>
      </View>

      {/* Acciones adicionales para demo */}
      <View style={styles.demoSection}>
        <ThemedText style={styles.demoSectionTitle}>🚀 Demo para Inversionistas</ThemedText>
        <View style={styles.demoActions}>
          <TouchableOpacity
            style={styles.demoActionCard}
            onPress={() => handleQuickAction('track_service')}
          >
            <Ionicons name="pulse" size={20} color={Colors.info} />
            <ThemedText style={styles.demoActionText}>Tracking Tiempo Real</ThemedText>
          </TouchableOpacity>
          
          <TouchableOpacity
            style={styles.demoActionCard}
            onPress={() => handleQuickAction('investor_demo')}
          >
            <Ionicons name="analytics" size={20} color={Colors.success} />
            <ThemedText style={styles.demoActionText}>Dashboard Inversionistas</ThemedText>
          </TouchableOpacity>
          
          <TouchableOpacity
            style={styles.demoActionCard}
            onPress={() => handleQuickAction('simulate_service')}
          >
            <Ionicons name="play-circle" size={20} color={Colors.warning} />
            <ThemedText style={styles.demoActionText}>Simular Servicio</ThemedText>
          </TouchableOpacity>
        </View>
      </View>

      {/* Métricas en tiempo real */}
      {metrics.totalServices > 0 && (
        <View style={styles.metricsPreview}>
          <ThemedText style={styles.metricsTitle}>📊 Métricas del Negocio</ThemedText>
          <View style={styles.metricsGrid}>
            <View style={styles.metricItem}>
              <ThemedText style={styles.metricValue}>{metrics.completedServices}</ThemedText>
              <ThemedText style={styles.metricLabel}>Servicios</ThemedText>
            </View>
            <View style={styles.metricItem}>
              <ThemedText style={styles.metricValue}>${Math.round(metrics.totalRevenue)}</ThemedText>
              <ThemedText style={styles.metricLabel}>Ingresos</ThemedText>
            </View>
            <View style={styles.metricItem}>
              <ThemedText style={styles.metricValue}>${Math.round(metrics.platformRevenue)}</ThemedText>
              <ThemedText style={styles.metricLabel}>Comisiones</ThemedText>
            </View>
            <View style={styles.metricItem}>
              <ThemedText style={styles.metricValue}>{metrics.averageRating.toFixed(1)}★</ThemedText>
              <ThemedText style={styles.metricLabel}>Rating</ThemedText>
            </View>
          </View>
        </View>
      )}

      {/* Información del marketplace */}
      <View style={styles.marketplaceInfo}>
        <Ionicons name="information-circle" size={20} color={Colors.primary} />
        <ThemedText style={styles.marketplaceInfoText}>
          Conectamos pacientes con doctores verificados en tu zona
        </ThemedText>
      </View>
    </View>
  );

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
        {/* Dashboard para doctores */}
        {isDoctor && <DoctorDashboard user={user} />}
        
        {/* Dashboard para pacientes + Marketplace */}
        {isPatient && (
          <ScrollView showsVerticalScrollIndicator={false}>
            <PatientDashboard user={user} />
            {renderPatientQuickActions()}
          </ScrollView>
        )}
        
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

      {/* Modal de búsqueda de doctores */}
      <Modal
        visible={showDoctorSearch}
        animationType="slide"
        presentationStyle="pageSheet"
        onRequestClose={() => setShowDoctorSearch(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <ThemedText style={styles.modalTitle}>Encontrar Doctor</ThemedText>
            <TouchableOpacity
              onPress={() => setShowDoctorSearch(false)}
              style={styles.modalCloseButton}
            >
              <Ionicons name="close" size={24} color={Colors.dark} />
            </TouchableOpacity>
          </View>
          <DoctorMapSearch
            onDoctorSelect={handleDoctorSelect}
            showFilters={true}
          />
        </View>
      </Modal>

      {/* Modal de solicitud de servicio */}
      <MedicalServiceRequest
        visible={showServiceRequest}
        onClose={() => {
          setShowServiceRequest(false);
          setSelectedDoctor(null);
        }}
        selectedDoctor={selectedDoctor}
        onRequestSubmitted={(request) => {
          console.log('📋 Solicitud enviada:', request);
          
          // Crear el servicio en el store de tracking
          const serviceId = createServiceRequest({
            patientId: user?.id || 'demo-patient',
            doctorId: selectedDoctor?.doctorId || 'demo-doctor',
            doctorName: selectedDoctor?.doctorName || 'Dr. Demo',
            serviceType: request.serviceType,
            symptoms: request.symptoms,
            urgency: request.urgency,
            preferredTime: request.preferredTime,
            notes: request.notes,
            basePrice: selectedDoctor?.priceRange.min || 50,
            finalPrice: selectedDoctor?.priceRange.min || 50,
            patientLocation: request.patientLocation,
          });
          
          setShowServiceRequest(false);
          setSelectedDoctor(null);
          
          // Mostrar tracking automáticamente
          setTimeout(() => {
            setShowServiceTracker(true);
          }, 1000);
        }}
      />

      {/* Modal de tracking de servicios */}
      <ServiceTracker
        visible={showServiceTracker}
        onClose={() => setShowServiceTracker(false)}
      />

      {/* Dashboard para inversionistas */}
      <InvestorDashboard
        visible={showInvestorDashboard}
        onClose={() => setShowInvestorDashboard(false)}
      />
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
  // Estilos para el marketplace médico
  marketplaceSection: {
    padding: Spacing.lg,
    backgroundColor: Colors.background,
  },
  primaryActionCard: {
    backgroundColor: Colors.primary,
    borderRadius: BordersAndShadows.borderRadius.xl,
    padding: Spacing.lg,
    marginBottom: Spacing.lg,
    ...BordersAndShadows.shadows.lg,
  },
  primaryActionContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  primaryActionIcon: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: Spacing.md,
  },
  primaryActionText: {
    flex: 1,
  },
  primaryActionTitle: {
    fontSize: Typography.fontSizes.lg,
    fontWeight: Typography.fontWeights.bold as any,
    color: Colors.white,
    marginBottom: Spacing.xs,
  },
  primaryActionSubtitle: {
    fontSize: Typography.fontSizes.md,
    color: Colors.white,
    opacity: 0.9,
  },
  secondaryActionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.md,
    marginBottom: Spacing.lg,
  },
  secondaryActionCard: {
    flex: 1,
    minWidth: '30%',
    backgroundColor: Colors.white,
    borderRadius: BordersAndShadows.borderRadius.lg,
    padding: Spacing.lg,
    alignItems: 'center',
    ...BordersAndShadows.shadows.sm,
  },
  emergencyCard: {
    backgroundColor: Colors.danger,
  },
  secondaryActionTitle: {
    fontSize: Typography.fontSizes.sm,
    fontWeight: Typography.fontWeights.bold as any,
    color: Colors.white,
    textAlign: 'center',
    marginTop: Spacing.sm,
    marginBottom: Spacing.xs,
  },
  secondaryActionSubtitle: {
    fontSize: Typography.fontSizes.xs,
    color: Colors.white,
    textAlign: 'center',
    opacity: 0.9,
  },
  secondaryActionTitleDark: {
    fontSize: Typography.fontSizes.sm,
    fontWeight: Typography.fontWeights.bold as any,
    color: Colors.dark,
    textAlign: 'center',
    marginTop: Spacing.sm,
    marginBottom: Spacing.xs,
  },
  secondaryActionSubtitleDark: {
    fontSize: Typography.fontSizes.xs,
    color: Colors.darkGray,
    textAlign: 'center',
  },
  marketplaceInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.white,
    padding: Spacing.md,
    borderRadius: BordersAndShadows.borderRadius.md,
    gap: Spacing.sm,
    ...BordersAndShadows.shadows.sm,
  },
  marketplaceInfoText: {
    flex: 1,
    fontSize: Typography.fontSizes.sm,
    color: Colors.darkGray,
  },
  // Estilos para modales
  modalContainer: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: Spacing.lg,
    backgroundColor: Colors.white,
    borderBottomWidth: 1,
    borderBottomColor: Colors.lightGray,
  },
  modalTitle: {
    fontSize: Typography.fontSizes.lg,
    fontWeight: Typography.fontWeights.bold as any,
    color: Colors.dark,
  },
  modalCloseButton: {
    padding: Spacing.sm,
  },
  // Estilos para la sección de demo
  demoSection: {
    backgroundColor: Colors.white,
    padding: Spacing.lg,
    marginBottom: Spacing.lg,
    borderRadius: BordersAndShadows.borderRadius.lg,
    borderWidth: 2,
    borderColor: Colors.success,
    ...BordersAndShadows.shadows.sm,
  },
  demoSectionTitle: {
    fontSize: Typography.fontSizes.md,
    fontWeight: Typography.fontWeights.bold as any,
    color: Colors.success,
    textAlign: 'center',
    marginBottom: Spacing.md,
  },
  demoActions: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.sm,
  },
  demoActionCard: {
    flex: 1,
    minWidth: '30%',
    backgroundColor: Colors.background,
    borderRadius: BordersAndShadows.borderRadius.md,
    padding: Spacing.md,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Colors.lightGray,
    gap: Spacing.xs,
  },
  demoActionText: {
    fontSize: Typography.fontSizes.xs,
    color: Colors.dark,
    textAlign: 'center',
    fontWeight: Typography.fontWeights.bold as any,
  },
  // Estilos para preview de métricas
  metricsPreview: {
    backgroundColor: Colors.white,
    padding: Spacing.lg,
    marginBottom: Spacing.lg,
    borderRadius: BordersAndShadows.borderRadius.lg,
    ...BordersAndShadows.shadows.sm,
  },
  metricsTitle: {
    fontSize: Typography.fontSizes.md,
    fontWeight: Typography.fontWeights.bold as any,
    color: Colors.dark,
    textAlign: 'center',
    marginBottom: Spacing.md,
  },
  metricsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  metricItem: {
    alignItems: 'center',
  },
  metricValue: {
    fontSize: Typography.fontSizes.lg,
    fontWeight: Typography.fontWeights.bold as any,
    color: Colors.primary,
    marginBottom: Spacing.xs,
  },
  metricLabel: {
    fontSize: Typography.fontSizes.xs,
    color: Colors.darkGray,
  },
});
