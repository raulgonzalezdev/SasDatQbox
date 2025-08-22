import React, { useEffect, useState } from 'react';
import {
  View,
  StyleSheet,
  Modal,
  TouchableOpacity,
  Animated,
  Dimensions,
} from 'react-native';
import { ThemedText } from '@/components/ThemedText';
import { Ionicons } from '@expo/vector-icons';
import { Colors, Spacing, BordersAndShadows, Typography } from '@/constants/GlobalStyles';
import { useServiceTrackingStore, ServiceStatus } from '@/store/serviceTrackingStore';
import MapView, { Marker, PROVIDER_GOOGLE } from 'react-native-maps';

const { width, height } = Dimensions.get('window');

interface ServiceTrackerProps {
  visible: boolean;
  onClose: () => void;
  serviceId?: string;
}

const ServiceTracker: React.FC<ServiceTrackerProps> = ({
  visible,
  onClose,
  serviceId,
}) => {
  const { currentService, activeServices, updateServiceStatus } = useServiceTrackingStore();
  const [pulseAnim] = useState(new Animated.Value(1));
  const [progressAnim] = useState(new Animated.Value(0));

  const service = serviceId 
    ? activeServices.find(s => s.id === serviceId) || currentService
    : currentService;

  useEffect(() => {
    if (visible && service) {
      // Animación de pulso para el estado activo
      const pulseAnimation = Animated.loop(
        Animated.sequence([
          Animated.timing(pulseAnim, {
            toValue: 1.2,
            duration: 1000,
            useNativeDriver: true,
          }),
          Animated.timing(pulseAnim, {
            toValue: 1,
            duration: 1000,
            useNativeDriver: true,
          }),
        ])
      );
      pulseAnimation.start();

      // Animación de progreso
      const progressValue = getProgressValue(service.status);
      Animated.timing(progressAnim, {
        toValue: progressValue,
        duration: 800,
        useNativeDriver: false,
      }).start();

      return () => pulseAnimation.stop();
    }
  }, [visible, service?.status]);

  const getProgressValue = (status: ServiceStatus): number => {
    const statusProgress = {
      requested: 0.1,
      accepted: 0.2,
      preparing: 0.4,
      on_the_way: 0.6,
      arrived: 0.8,
      in_consultation: 0.9,
      completed: 1.0,
      cancelled: 0,
      payment_pending: 0.95,
      paid: 1.0,
    };
    return statusProgress[status] || 0;
  };

  const getStatusInfo = (status: ServiceStatus) => {
    const statusMap = {
      requested: {
        title: 'Solicitud Enviada',
        subtitle: 'Esperando confirmación del doctor',
        icon: 'hourglass-outline',
        color: Colors.warning,
      },
      accepted: {
        title: 'Solicitud Aceptada',
        subtitle: 'El doctor confirmó tu consulta',
        icon: 'checkmark-circle',
        color: Colors.success,
      },
      preparing: {
        title: 'Preparándose',
        subtitle: 'El doctor se está preparando',
        icon: 'person',
        color: Colors.info,
      },
      on_the_way: {
        title: 'En Camino',
        subtitle: 'El doctor está yendo hacia ti',
        icon: 'car',
        color: Colors.primary,
      },
      arrived: {
        title: 'Doctor Llegó',
        subtitle: 'El doctor está en tu ubicación',
        icon: 'location',
        color: Colors.success,
      },
      in_consultation: {
        title: 'En Consulta',
        subtitle: 'Consulta médica en progreso',
        icon: 'medical',
        color: Colors.primary,
      },
      completed: {
        title: 'Consulta Completada',
        subtitle: 'Servicio médico finalizado',
        icon: 'checkmark-done',
        color: Colors.success,
      },
      cancelled: {
        title: 'Cancelado',
        subtitle: 'El servicio fue cancelado',
        icon: 'close-circle',
        color: Colors.danger,
      },
      payment_pending: {
        title: 'Procesando Pago',
        subtitle: 'Confirmando el pago del servicio',
        icon: 'card',
        color: Colors.warning,
      },
      paid: {
        title: 'Pago Completado',
        subtitle: 'Servicio pagado exitosamente',
        icon: 'checkmark-done-circle',
        color: Colors.success,
      },
    };

    return statusMap[status] || statusMap.requested;
  };

  const getEstimatedTime = () => {
    if (!service) return null;
    
    const now = new Date();
    switch (service.status) {
      case 'accepted':
      case 'preparing':
        return '5-10 min';
      case 'on_the_way':
        return '15-25 min';
      case 'arrived':
        return 'Ahora';
      case 'in_consultation':
        const elapsed = service.startedAt 
          ? Math.round((now.getTime() - service.startedAt.getTime()) / (1000 * 60))
          : 0;
        return `${elapsed} min transcurridos`;
      default:
        return null;
    }
  };

  const renderProgressSteps = () => {
    if (!service) return null;

    const steps = [
      { key: 'requested', label: 'Solicitado' },
      { key: 'accepted', label: 'Aceptado' },
      ...(service.serviceType === 'home_visit' ? [
        { key: 'preparing', label: 'Preparando' },
        { key: 'on_the_way', label: 'En Camino' },
        { key: 'arrived', label: 'Llegó' },
      ] : []),
      { key: 'in_consultation', label: 'En Consulta' },
      { key: 'completed', label: 'Completado' },
    ];

    const currentStepIndex = steps.findIndex(step => step.key === service.status);

    return (
      <View style={styles.progressSteps}>
        {steps.map((step, index) => (
          <View key={step.key} style={styles.progressStep}>
            <View style={[
              styles.progressStepCircle,
              {
                backgroundColor: index <= currentStepIndex ? Colors.primary : Colors.lightGray,
              }
            ]}>
              {index < currentStepIndex && (
                <Ionicons name="checkmark" size={12} color={Colors.white} />
              )}
              {index === currentStepIndex && (
                <Animated.View style={[
                  styles.activeStepIndicator,
                  { transform: [{ scale: pulseAnim }] }
                ]} />
              )}
            </View>
            <ThemedText style={[
              styles.progressStepLabel,
              { color: index <= currentStepIndex ? Colors.dark : Colors.lightGray }
            ]}>
              {step.label}
            </ThemedText>
            {index < steps.length - 1 && (
              <View style={[
                styles.progressStepLine,
                { backgroundColor: index < currentStepIndex ? Colors.primary : Colors.lightGray }
              ]} />
            )}
          </View>
        ))}
      </View>
    );
  };

  const renderMap = () => {
    if (!service || service.serviceType !== 'home_visit' || !service.patientLocation) {
      return null;
    }

    return (
      <View style={styles.mapContainer}>
        <MapView
          style={styles.map}
          provider={PROVIDER_GOOGLE}
          region={{
            latitude: service.patientLocation.latitude,
            longitude: service.patientLocation.longitude,
            latitudeDelta: 0.01,
            longitudeDelta: 0.01,
          }}
        >
          {/* Marcador del paciente */}
          <Marker
            coordinate={service.patientLocation}
            title="Tu ubicación"
            pinColor={Colors.secondary}
          />

          {/* Marcador del doctor */}
          {service.doctorLocation && (
            <Marker
              coordinate={service.doctorLocation}
              title={service.doctorName}
              description="Doctor"
              pinColor={Colors.primary}
            />
          )}
        </MapView>
      </View>
    );
  };

  const renderActionButtons = () => {
    if (!service) return null;

    const buttons = [];

    if (service.status === 'requested') {
      buttons.push(
        <TouchableOpacity
          key="cancel"
          style={[styles.actionButton, styles.cancelButton]}
          onPress={() => {
            updateServiceStatus(service.id, 'cancelled');
            onClose();
          }}
        >
          <Ionicons name="close" size={20} color={Colors.white} />
          <ThemedText style={styles.actionButtonText}>Cancelar</ThemedText>
        </TouchableOpacity>
      );
    }

    if (service.status === 'arrived') {
      buttons.push(
        <TouchableOpacity
          key="confirm"
          style={[styles.actionButton, styles.confirmButton]}
          onPress={() => updateServiceStatus(service.id, 'in_consultation')}
        >
          <Ionicons name="checkmark" size={20} color={Colors.white} />
          <ThemedText style={styles.actionButtonText}>Confirmar Llegada</ThemedText>
        </TouchableOpacity>
      );
    }

    if (service.status === 'completed') {
      buttons.push(
        <TouchableOpacity
          key="rate"
          style={[styles.actionButton, styles.rateButton]}
          onPress={() => {
            // Aquí se abriría el modal de calificación
            updateServiceStatus(service.id, 'paid');
            onClose();
          }}
        >
          <Ionicons name="star" size={20} color={Colors.white} />
          <ThemedText style={styles.actionButtonText}>Calificar Servicio</ThemedText>
        </TouchableOpacity>
      );
    }

    return buttons.length > 0 ? (
      <View style={styles.actionButtons}>
        {buttons}
      </View>
    ) : null;
  };

  if (!service) {
    return (
      <Modal visible={visible} animationType="slide" onRequestClose={onClose}>
        <View style={styles.container}>
          <View style={styles.header}>
            <TouchableOpacity onPress={onClose}>
              <Ionicons name="close" size={24} color={Colors.white} />
            </TouchableOpacity>
            <ThemedText style={styles.headerTitle}>Seguimiento de Servicio</ThemedText>
            <View style={{ width: 24 }} />
          </View>
          <View style={styles.emptyState}>
            <Ionicons name="medical-outline" size={64} color={Colors.lightGray} />
            <ThemedText style={styles.emptyTitle}>No hay servicios activos</ThemedText>
            <ThemedText style={styles.emptySubtitle}>
              Solicita un servicio médico para comenzar el seguimiento
            </ThemedText>
          </View>
        </View>
      </Modal>
    );
  }

  const statusInfo = getStatusInfo(service.status);
  const estimatedTime = getEstimatedTime();

  return (
    <Modal visible={visible} animationType="slide" onRequestClose={onClose}>
      <View style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={onClose}>
            <Ionicons name="close" size={24} color={Colors.white} />
          </TouchableOpacity>
          <ThemedText style={styles.headerTitle}>Seguimiento de Servicio</ThemedText>
          <TouchableOpacity onPress={() => console.log('Más opciones')}>
            <Ionicons name="ellipsis-horizontal" size={24} color={Colors.white} />
          </TouchableOpacity>
        </View>

        <View style={styles.content}>
          {/* Información del doctor */}
          <View style={styles.doctorCard}>
            <View style={styles.doctorAvatar}>
              <Ionicons name="person" size={32} color={Colors.white} />
            </View>
            <View style={styles.doctorInfo}>
              <ThemedText style={styles.doctorName}>{service.doctorName}</ThemedText>
              <ThemedText style={styles.serviceType}>
                {service.serviceType === 'virtual' ? 'Consulta Virtual' :
                 service.serviceType === 'in_person' ? 'Consulta Presencial' :
                 'Visita Domiciliaria'}
              </ThemedText>
              <ThemedText style={styles.servicePrice}>
                {service.finalPrice ? `$${service.finalPrice}` : 'Precio a confirmar'}
              </ThemedText>
            </View>
          </View>

          {/* Estado actual */}
          <View style={styles.statusCard}>
            <Animated.View style={[
              styles.statusIcon,
              { backgroundColor: statusInfo.color, transform: [{ scale: pulseAnim }] }
            ]}>
              <Ionicons name={statusInfo.icon as any} size={24} color={Colors.white} />
            </Animated.View>
            <View style={styles.statusInfo}>
              <ThemedText style={styles.statusTitle}>{statusInfo.title}</ThemedText>
              <ThemedText style={styles.statusSubtitle}>{statusInfo.subtitle}</ThemedText>
              {estimatedTime && (
                <ThemedText style={styles.estimatedTime}>{estimatedTime}</ThemedText>
              )}
            </View>
          </View>

          {/* Barra de progreso */}
          <View style={styles.progressBar}>
            <Animated.View
              style={[
                styles.progressFill,
                {
                  width: progressAnim.interpolate({
                    inputRange: [0, 1],
                    outputRange: ['0%', '100%'],
                  }),
                },
              ]}
            />
          </View>

          {/* Pasos del progreso */}
          {renderProgressSteps()}

          {/* Mapa para visitas domiciliarias */}
          {renderMap()}

          {/* Información adicional */}
          <View style={styles.additionalInfo}>
            <View style={styles.infoRow}>
              <Ionicons name="time-outline" size={16} color={Colors.darkGray} />
              <ThemedText style={styles.infoText}>
                Solicitado: {service.requestedAt.toLocaleTimeString()}
              </ThemedText>
            </View>
            {service.symptoms && (
              <View style={styles.infoRow}>
                <Ionicons name="medical-outline" size={16} color={Colors.darkGray} />
                <ThemedText style={styles.infoText}>Síntomas: {service.symptoms}</ThemedText>
              </View>
            )}
            <View style={styles.infoRow}>
              <Ionicons name="alert-circle-outline" size={16} color={Colors.darkGray} />
              <ThemedText style={styles.infoText}>
                Urgencia: {service.urgency === 'low' ? 'Baja' :
                          service.urgency === 'medium' ? 'Media' :
                          service.urgency === 'high' ? 'Alta' : 'Emergencia'}
              </ThemedText>
            </View>
          </View>

          {/* Botones de acción */}
          {renderActionButtons()}
        </View>
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
    backgroundColor: Colors.primary,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 50,
    paddingBottom: Spacing.lg,
    paddingHorizontal: Spacing.lg,
  },
  headerTitle: {
    fontSize: Typography.fontSizes.lg,
    fontWeight: Typography.fontWeights.bold as any,
    color: Colors.white,
  },
  content: {
    flex: 1,
    padding: Spacing.lg,
  },
  doctorCard: {
    backgroundColor: Colors.white,
    flexDirection: 'row',
    alignItems: 'center',
    padding: Spacing.lg,
    borderRadius: BordersAndShadows.borderRadius.lg,
    marginBottom: Spacing.lg,
    ...BordersAndShadows.shadows.md,
  },
  doctorAvatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: Colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: Spacing.md,
  },
  doctorInfo: {
    flex: 1,
  },
  doctorName: {
    fontSize: Typography.fontSizes.lg,
    fontWeight: Typography.fontWeights.bold as any,
    color: Colors.dark,
    marginBottom: Spacing.xs,
  },
  serviceType: {
    fontSize: Typography.fontSizes.md,
    color: Colors.darkGray,
    marginBottom: Spacing.xs,
  },
  servicePrice: {
    fontSize: Typography.fontSizes.md,
    fontWeight: Typography.fontWeights.bold as any,
    color: Colors.primary,
  },
  statusCard: {
    backgroundColor: Colors.white,
    flexDirection: 'row',
    alignItems: 'center',
    padding: Spacing.lg,
    borderRadius: BordersAndShadows.borderRadius.lg,
    marginBottom: Spacing.lg,
    ...BordersAndShadows.shadows.sm,
  },
  statusIcon: {
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: Spacing.md,
  },
  activeStepIndicator: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: Colors.white,
  },
  statusInfo: {
    flex: 1,
  },
  statusTitle: {
    fontSize: Typography.fontSizes.lg,
    fontWeight: Typography.fontWeights.bold as any,
    color: Colors.dark,
    marginBottom: Spacing.xs,
  },
  statusSubtitle: {
    fontSize: Typography.fontSizes.md,
    color: Colors.darkGray,
    marginBottom: Spacing.xs,
  },
  estimatedTime: {
    fontSize: Typography.fontSizes.sm,
    color: Colors.primary,
    fontWeight: Typography.fontWeights.bold as any,
  },
  progressBar: {
    height: 4,
    backgroundColor: Colors.lightGray,
    borderRadius: 2,
    marginBottom: Spacing.lg,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: Colors.primary,
    borderRadius: 2,
  },
  progressSteps: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.lg,
    paddingHorizontal: Spacing.sm,
  },
  progressStep: {
    alignItems: 'center',
    flex: 1,
    position: 'relative',
  },
  progressStepCircle: {
    width: 24,
    height: 24,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: Spacing.xs,
  },
  progressStepLabel: {
    fontSize: Typography.fontSizes.xs,
    textAlign: 'center',
  },
  progressStepLine: {
    position: 'absolute',
    top: 12,
    left: '50%',
    width: '100%',
    height: 2,
    zIndex: -1,
  },
  mapContainer: {
    height: 200,
    borderRadius: BordersAndShadows.borderRadius.lg,
    overflow: 'hidden',
    marginBottom: Spacing.lg,
    ...BordersAndShadows.shadows.sm,
  },
  map: {
    flex: 1,
  },
  additionalInfo: {
    backgroundColor: Colors.white,
    padding: Spacing.lg,
    borderRadius: BordersAndShadows.borderRadius.lg,
    marginBottom: Spacing.lg,
    ...BordersAndShadows.shadows.sm,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Spacing.sm,
    gap: Spacing.sm,
  },
  infoText: {
    fontSize: Typography.fontSizes.sm,
    color: Colors.darkGray,
    flex: 1,
  },
  actionButtons: {
    flexDirection: 'row',
    gap: Spacing.md,
  },
  actionButton: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: Spacing.md,
    borderRadius: BordersAndShadows.borderRadius.lg,
    gap: Spacing.sm,
  },
  actionButtonText: {
    fontSize: Typography.fontSizes.md,
    fontWeight: Typography.fontWeights.bold as any,
    color: Colors.white,
  },
  cancelButton: {
    backgroundColor: Colors.danger,
  },
  confirmButton: {
    backgroundColor: Colors.success,
  },
  rateButton: {
    backgroundColor: Colors.warning,
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: Spacing.xl,
  },
  emptyTitle: {
    fontSize: Typography.fontSizes.lg,
    fontWeight: Typography.fontWeights.bold as any,
    color: Colors.dark,
    marginTop: Spacing.lg,
    marginBottom: Spacing.sm,
  },
  emptySubtitle: {
    fontSize: Typography.fontSizes.md,
    color: Colors.darkGray,
    textAlign: 'center',
  },
});

export default ServiceTracker;
