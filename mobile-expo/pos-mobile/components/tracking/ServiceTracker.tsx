import React, { useState, useEffect } from 'react';
import { 
  View, 
  StyleSheet, 
  ScrollView, 
  TouchableOpacity, 
  Modal,
  Alert,
  Text
} from 'react-native';
import { ThemedText } from '@/components/ThemedText';
import { Ionicons } from '@expo/vector-icons';
import { Colors, Spacing, BordersAndShadows, Typography } from '@/constants/GlobalStyles';

interface ServiceTrackerProps {
  visible: boolean;
  onClose: () => void;
}

type ServiceStatus = 
  | 'requested'
  | 'accepted'
  | 'preparing'
  | 'on_the_way'
  | 'arrived'
  | 'in_consultation'
  | 'completed';

interface MockService {
  id: string;
  patientName: string;
  doctorName: string;
  serviceType: 'virtual' | 'in_person' | 'home_visit';
  status: ServiceStatus;
  estimatedTime: number; // minutes
  symptoms: string;
  location?: string;
}

const ServiceTracker: React.FC<ServiceTrackerProps> = ({ visible, onClose }) => {
  const [currentService, setCurrentService] = useState<MockService>({
    id: 'service-demo-001',
    patientName: 'Ana Martínez',
    doctorName: 'Dr. María González',
    serviceType: 'home_visit',
    status: 'requested',
    estimatedTime: 15,
    symptoms: 'Dolor de cabeza persistente y fiebre',
    location: 'Caracas, Venezuela',
  });

  const [elapsedTime, setElapsedTime] = useState(0);

  // Simular progreso del servicio
  useEffect(() => {
    if (!visible) return;

    const progressInterval = setInterval(() => {
      setCurrentService(prev => {
        const statusProgression: ServiceStatus[] = [
          'requested',
          'accepted', 
          'preparing',
          'on_the_way',
          'arrived',
          'in_consultation',
          'completed'
        ];
        
        const currentIndex = statusProgression.indexOf(prev.status);
        if (currentIndex < statusProgression.length - 1) {
          return {
            ...prev,
            status: statusProgression[currentIndex + 1],
            estimatedTime: Math.max(1, prev.estimatedTime - 3),
          };
        }
        return prev;
      });
    }, 5000); // Cambiar estado cada 5 segundos

    const timeInterval = setInterval(() => {
      setElapsedTime(prev => prev + 1);
    }, 60000); // Incrementar tiempo cada minuto

    return () => {
      clearInterval(progressInterval);
      clearInterval(timeInterval);
    };
  }, [visible]);

  const getStatusInfo = (status: ServiceStatus) => {
    switch (status) {
      case 'requested':
        return {
          title: 'Solicitud Enviada',
          description: 'Buscando doctores disponibles...',
          icon: 'paper-plane',
          color: Colors.primary,
          progress: 10,
        };
      case 'accepted':
        return {
          title: 'Solicitud Aceptada',
          description: 'El doctor ha aceptado tu solicitud',
          icon: 'checkmark-circle',
          color: Colors.success,
          progress: 25,
        };
      case 'preparing':
        return {
          title: 'Preparándose',
          description: 'El doctor se está preparando para la consulta',
          icon: 'medical',
          color: Colors.info,
          progress: 40,
        };
      case 'on_the_way':
        return {
          title: 'En Camino',
          description: 'El doctor está en camino a tu ubicación',
          icon: 'car',
          color: Colors.warning,
          progress: 60,
        };
      case 'arrived':
        return {
          title: 'Ha Llegado',
          description: 'El doctor ha llegado a tu ubicación',
          icon: 'location',
          color: Colors.success,
          progress: 75,
        };
      case 'in_consultation':
        return {
          title: 'En Consulta',
          description: 'La consulta médica está en progreso',
          icon: 'pulse',
          color: Colors.success,
          progress: 90,
        };
      case 'completed':
        return {
          title: 'Consulta Completada',
          description: 'La consulta ha terminado exitosamente',
          icon: 'checkmark-done',
          color: Colors.success,
          progress: 100,
        };
      default:
        return {
          title: 'Estado Desconocido',
          description: 'Verificando estado...',
          icon: 'help-circle',
          color: Colors.darkGray,
          progress: 0,
        };
    }
  };

  const statusInfo = getStatusInfo(currentService.status);

  const handleContactDoctor = () => {
    Alert.alert(
      'Contactar Doctor',
      '¿Cómo quieres contactar al doctor?',
      [
        { text: 'Llamar', onPress: () => console.log('📞 Llamando al doctor...') },
        { text: 'Chat', onPress: () => console.log('💬 Abriendo chat...') },
        { text: 'Cancelar', style: 'cancel' },
      ]
    );
  };

  const handleCancelService = () => {
    Alert.alert(
      'Cancelar Servicio',
      '¿Estás seguro de que quieres cancelar este servicio?',
      [
        {
          text: 'Cancelar Servicio',
          style: 'destructive',
          onPress: () => {
            console.log('❌ Servicio cancelado');
            onClose();
          },
        },
        { text: 'Mantener', style: 'cancel' },
      ]
    );
  };

  const formatTime = (minutes: number) => {
    if (minutes < 60) {
      return `${minutes} min`;
    }
    const hours = Math.floor(minutes / 60);
    const remainingMinutes = minutes % 60;
    return `${hours}h ${remainingMinutes}m`;
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="fullScreen"
      onRequestClose={onClose}
    >
      <View style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={onClose} style={styles.backButton}>
            <Ionicons name="arrow-back" size={24} color={Colors.dark} />
          </TouchableOpacity>
          <ThemedText style={styles.title}>Seguimiento del Servicio</ThemedText>
          <View style={styles.placeholder} />
        </View>

        <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
          {/* Estado actual */}
          <View style={styles.statusCard}>
            <View style={[styles.statusIcon, { backgroundColor: statusInfo.color }]}>
              <Ionicons name={statusInfo.icon as any} size={32} color={Colors.white} />
            </View>
            <View style={styles.statusContent}>
              <ThemedText style={styles.statusTitle}>{statusInfo.title}</ThemedText>
              <Text style={styles.statusDescription}>{statusInfo.description}</Text>
              {currentService.status !== 'completed' && (
                <Text style={styles.estimatedTime}>
                  Tiempo estimado: {formatTime(currentService.estimatedTime)}
                </Text>
              )}
            </View>
          </View>

          {/* Barra de progreso */}
          <View style={styles.progressSection}>
            <View style={styles.progressBar}>
              <View 
                style={[
                  styles.progressFill, 
                  { 
                    width: `${statusInfo.progress}%`,
                    backgroundColor: statusInfo.color,
                  }
                ]} 
              />
            </View>
            <Text style={styles.progressText}>{statusInfo.progress}% completado</Text>
          </View>

          {/* Información del doctor */}
          <View style={styles.doctorCard}>
            <View style={styles.doctorHeader}>
              <ThemedText style={styles.sectionTitle}>Tu Doctor</ThemedText>
              <TouchableOpacity 
                style={styles.contactButton}
                onPress={handleContactDoctor}
              >
                <Ionicons name="chatbubbles" size={20} color={Colors.primary} />
                <Text style={styles.contactButtonText}>Contactar</Text>
              </TouchableOpacity>
            </View>
            
            <View style={styles.doctorInfo}>
              <View style={styles.doctorAvatar}>
                <Ionicons name="person" size={24} color={Colors.white} />
              </View>
              <View style={styles.doctorDetails}>
                <ThemedText style={styles.doctorName}>{currentService.doctorName}</ThemedText>
                <Text style={styles.doctorSpecialty}>Medicina General</Text>
                <View style={styles.doctorMeta}>
                  <Ionicons name="star" size={14} color={Colors.warning} />
                  <Text style={styles.doctorRating}>4.8</Text>
                  <Text style={styles.doctorExperience}> • 15 años de experiencia</Text>
                </View>
              </View>
            </View>
          </View>

          {/* Detalles del servicio */}
          <View style={styles.serviceDetails}>
            <ThemedText style={styles.sectionTitle}>Detalles del Servicio</ThemedText>
            
            <View style={styles.detailItem}>
              <Ionicons name="medical" size={20} color={Colors.primary} />
              <View style={styles.detailContent}>
                <Text style={styles.detailLabel}>Tipo de consulta</Text>
                <Text style={styles.detailValue}>
                  {currentService.serviceType === 'home_visit' ? 'Visita domiciliaria' :
                   currentService.serviceType === 'virtual' ? 'Consulta virtual' : 
                   'Consulta presencial'}
                </Text>
              </View>
            </View>

            <View style={styles.detailItem}>
              <Ionicons name="document-text" size={20} color={Colors.primary} />
              <View style={styles.detailContent}>
                <Text style={styles.detailLabel}>Síntomas</Text>
                <Text style={styles.detailValue}>{currentService.symptoms}</Text>
              </View>
            </View>

            {currentService.location && (
              <View style={styles.detailItem}>
                <Ionicons name="location" size={20} color={Colors.primary} />
                <View style={styles.detailContent}>
                  <Text style={styles.detailLabel}>Ubicación</Text>
                  <Text style={styles.detailValue}>{currentService.location}</Text>
                </View>
              </View>
            )}

            <View style={styles.detailItem}>
              <Ionicons name="time" size={20} color={Colors.primary} />
              <View style={styles.detailContent}>
                <Text style={styles.detailLabel}>Tiempo transcurrido</Text>
                <Text style={styles.detailValue}>{formatTime(elapsedTime)}</Text>
              </View>
            </View>
          </View>

          {/* Mapa simulado para servicios a domicilio */}
          {currentService.serviceType === 'home_visit' && 
           ['on_the_way', 'arrived'].includes(currentService.status) && (
            <View style={styles.mapSection}>
              <ThemedText style={styles.sectionTitle}>Ubicación del Doctor</ThemedText>
              <View style={styles.mapPlaceholder}>
                <Ionicons name="map" size={48} color={Colors.primary} />
                <Text style={styles.mapText}>Mapa en tiempo real</Text>
                <Text style={styles.mapSubtext}>
                  {currentService.status === 'on_the_way' ? 'En camino a tu ubicación' : 'Ha llegado'}
                </Text>
              </View>
            </View>
          )}

          {/* Timeline del servicio */}
          <View style={styles.timeline}>
            <ThemedText style={styles.sectionTitle}>Cronología</ThemedText>
            
            {[
              { status: 'requested', time: '10:00 AM', completed: true },
              { status: 'accepted', time: '10:02 AM', completed: true },
              { status: 'preparing', time: '10:05 AM', completed: currentService.status !== 'requested' && currentService.status !== 'accepted' },
              { status: 'on_the_way', time: '10:15 AM', completed: ['on_the_way', 'arrived', 'in_consultation', 'completed'].includes(currentService.status) },
              { status: 'arrived', time: '10:30 AM', completed: ['arrived', 'in_consultation', 'completed'].includes(currentService.status) },
              { status: 'in_consultation', time: '10:35 AM', completed: ['in_consultation', 'completed'].includes(currentService.status) },
              { status: 'completed', time: '11:00 AM', completed: currentService.status === 'completed' },
            ].map((item, index) => {
              const itemStatusInfo = getStatusInfo(item.status);
              return (
                <View key={item.status} style={styles.timelineItem}>
                  <View style={[
                    styles.timelineIcon,
                    { 
                      backgroundColor: item.completed ? itemStatusInfo.color : Colors.lightGray,
                    }
                  ]}>
                    <Ionicons 
                      name={itemStatusInfo.icon as any} 
                      size={16} 
                      color={Colors.white} 
                    />
                  </View>
                  <View style={styles.timelineContent}>
                    <Text style={[
                      styles.timelineTitle,
                      { color: item.completed ? Colors.dark : Colors.darkGray }
                    ]}>
                      {itemStatusInfo.title}
                    </Text>
                    <Text style={styles.timelineTime}>{item.time}</Text>
                  </View>
                </View>
              );
            })}
          </View>
        </ScrollView>

        {/* Footer con acciones */}
        {currentService.status !== 'completed' && (
          <View style={styles.footer}>
            <TouchableOpacity 
              style={styles.cancelButton}
              onPress={handleCancelService}
            >
              <Text style={styles.cancelButtonText}>Cancelar Servicio</Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={styles.chatButton}
              onPress={handleContactDoctor}
            >
              <Ionicons name="chatbubbles" size={20} color={Colors.white} />
              <Text style={styles.chatButtonText}>Chat</Text>
            </TouchableOpacity>
          </View>
        )}

        {/* Mensaje de servicio completado */}
        {currentService.status === 'completed' && (
          <View style={styles.completedFooter}>
            <View style={styles.completedMessage}>
              <Ionicons name="checkmark-circle" size={24} color={Colors.success} />
              <Text style={styles.completedText}>¡Consulta completada exitosamente!</Text>
            </View>
            <TouchableOpacity style={styles.doneButton} onPress={onClose}>
              <Text style={styles.doneButtonText}>Finalizar</Text>
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
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: Spacing.lg,
    borderBottomWidth: 1,
    borderBottomColor: Colors.lightGray,
    backgroundColor: Colors.white,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.lightGray,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: Typography.fontSizes.lg,
    fontWeight: Typography.fontWeights.bold as any,
    color: Colors.dark,
  },
  placeholder: {
    width: 40,
  },
  content: {
    flex: 1,
    paddingHorizontal: Spacing.lg,
  },
  statusCard: {
    flexDirection: 'row',
    backgroundColor: Colors.white,
    borderRadius: BordersAndShadows.borderRadius.lg,
    padding: Spacing.lg,
    marginVertical: Spacing.lg,
    ...BordersAndShadows.shadows.md,
  },
  statusIcon: {
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: Spacing.md,
  },
  statusContent: {
    flex: 1,
  },
  statusTitle: {
    fontSize: Typography.fontSizes.xl,
    fontWeight: Typography.fontWeights.bold as any,
    color: Colors.dark,
    marginBottom: Spacing.xs,
  },
  statusDescription: {
    fontSize: Typography.fontSizes.md,
    color: Colors.darkGray,
    marginBottom: Spacing.sm,
  },
  estimatedTime: {
    fontSize: Typography.fontSizes.sm,
    color: Colors.primary,
    fontWeight: Typography.fontWeights.bold as any,
  },
  progressSection: {
    backgroundColor: Colors.white,
    borderRadius: BordersAndShadows.borderRadius.lg,
    padding: Spacing.lg,
    marginBottom: Spacing.lg,
    ...BordersAndShadows.shadows.sm,
  },
  progressBar: {
    height: 8,
    backgroundColor: Colors.lightGray,
    borderRadius: 4,
    marginBottom: Spacing.sm,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    borderRadius: 4,
  },
  progressText: {
    fontSize: Typography.fontSizes.sm,
    color: Colors.darkGray,
    textAlign: 'center',
  },
  doctorCard: {
    backgroundColor: Colors.white,
    borderRadius: BordersAndShadows.borderRadius.lg,
    padding: Spacing.lg,
    marginBottom: Spacing.lg,
    ...BordersAndShadows.shadows.sm,
  },
  doctorHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.md,
  },
  contactButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.lightGray,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    borderRadius: 20,
  },
  contactButtonText: {
    fontSize: Typography.fontSizes.sm,
    color: Colors.primary,
    marginLeft: Spacing.xs,
    fontWeight: Typography.fontWeights.bold as any,
  },
  doctorInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  doctorAvatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: Colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: Spacing.md,
  },
  doctorDetails: {
    flex: 1,
  },
  doctorName: {
    fontSize: Typography.fontSizes.lg,
    fontWeight: Typography.fontWeights.bold as any,
    color: Colors.dark,
    marginBottom: Spacing.xs,
  },
  doctorSpecialty: {
    fontSize: Typography.fontSizes.md,
    color: Colors.primary,
    marginBottom: Spacing.xs,
  },
  doctorMeta: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  doctorRating: {
    fontSize: Typography.fontSizes.sm,
    color: Colors.dark,
    marginLeft: Spacing.xs,
  },
  doctorExperience: {
    fontSize: Typography.fontSizes.sm,
    color: Colors.darkGray,
  },
  serviceDetails: {
    backgroundColor: Colors.white,
    borderRadius: BordersAndShadows.borderRadius.lg,
    padding: Spacing.lg,
    marginBottom: Spacing.lg,
    ...BordersAndShadows.shadows.sm,
  },
  sectionTitle: {
    fontSize: Typography.fontSizes.lg,
    fontWeight: Typography.fontWeights.bold as any,
    color: Colors.dark,
    marginBottom: Spacing.md,
  },
  detailItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: Spacing.md,
  },
  detailContent: {
    flex: 1,
    marginLeft: Spacing.md,
  },
  detailLabel: {
    fontSize: Typography.fontSizes.sm,
    color: Colors.darkGray,
    marginBottom: Spacing.xs,
  },
  detailValue: {
    fontSize: Typography.fontSizes.md,
    color: Colors.dark,
  },
  mapSection: {
    backgroundColor: Colors.white,
    borderRadius: BordersAndShadows.borderRadius.lg,
    padding: Spacing.lg,
    marginBottom: Spacing.lg,
    ...BordersAndShadows.shadows.sm,
  },
  mapPlaceholder: {
    height: 200,
    backgroundColor: Colors.lightGray,
    borderRadius: BordersAndShadows.borderRadius.md,
    justifyContent: 'center',
    alignItems: 'center',
  },
  mapText: {
    fontSize: Typography.fontSizes.md,
    fontWeight: Typography.fontWeights.bold as any,
    color: Colors.dark,
    marginTop: Spacing.sm,
  },
  mapSubtext: {
    fontSize: Typography.fontSizes.sm,
    color: Colors.darkGray,
    marginTop: Spacing.xs,
  },
  timeline: {
    backgroundColor: Colors.white,
    borderRadius: BordersAndShadows.borderRadius.lg,
    padding: Spacing.lg,
    marginBottom: Spacing.lg,
    ...BordersAndShadows.shadows.sm,
  },
  timelineItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Spacing.md,
  },
  timelineIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: Spacing.md,
  },
  timelineContent: {
    flex: 1,
  },
  timelineTitle: {
    fontSize: Typography.fontSizes.md,
    fontWeight: Typography.fontWeights.bold as any,
    marginBottom: Spacing.xs,
  },
  timelineTime: {
    fontSize: Typography.fontSizes.sm,
    color: Colors.darkGray,
  },
  footer: {
    flexDirection: 'row',
    padding: Spacing.lg,
    borderTopWidth: 1,
    borderTopColor: Colors.lightGray,
    backgroundColor: Colors.white,
  },
  cancelButton: {
    flex: 1,
    backgroundColor: Colors.lightGray,
    borderRadius: BordersAndShadows.borderRadius.lg,
    padding: Spacing.md,
    alignItems: 'center',
    marginRight: Spacing.md,
  },
  cancelButtonText: {
    fontSize: Typography.fontSizes.md,
    color: Colors.darkGray,
    fontWeight: Typography.fontWeights.bold as any,
  },
  chatButton: {
    flex: 1,
    backgroundColor: Colors.primary,
    borderRadius: BordersAndShadows.borderRadius.lg,
    padding: Spacing.md,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  chatButtonText: {
    fontSize: Typography.fontSizes.md,
    color: Colors.white,
    fontWeight: Typography.fontWeights.bold as any,
    marginLeft: Spacing.sm,
  },
  completedFooter: {
    backgroundColor: Colors.white,
    padding: Spacing.lg,
    borderTopWidth: 1,
    borderTopColor: Colors.lightGray,
  },
  completedMessage: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: Spacing.md,
  },
  completedText: {
    fontSize: Typography.fontSizes.md,
    color: Colors.success,
    fontWeight: Typography.fontWeights.bold as any,
    marginLeft: Spacing.sm,
  },
  doneButton: {
    backgroundColor: Colors.success,
    borderRadius: BordersAndShadows.borderRadius.lg,
    padding: Spacing.lg,
    alignItems: 'center',
  },
  doneButtonText: {
    fontSize: Typography.fontSizes.lg,
    color: Colors.white,
    fontWeight: Typography.fontWeights.bold as any,
  },
});

export default ServiceTracker;