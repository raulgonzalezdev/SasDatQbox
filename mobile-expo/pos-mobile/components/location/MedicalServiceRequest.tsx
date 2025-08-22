import React, { useState } from 'react';
import {
  View,
  StyleSheet,
  TouchableOpacity,
  Modal,
  ScrollView,
  Alert,
  TextInput,
} from 'react-native';
import { ThemedText } from '@/components/ThemedText';
import { Ionicons } from '@expo/vector-icons';
import { Colors, Spacing, BordersAndShadows, Typography } from '@/constants/GlobalStyles';
import { useLocationStore, DoctorLocation } from '@/store/locationStore';

type ServiceType = 'virtual' | 'in_person' | 'home_visit';
type Urgency = 'low' | 'medium' | 'high' | 'emergency';

interface ServiceRequest {
  serviceType: ServiceType;
  urgency: Urgency;
  symptoms: string;
  preferredTime: 'now' | 'today' | 'tomorrow' | 'this_week';
  notes: string;
  patientLocation?: {
    latitude: number;
    longitude: number;
    address: string;
  };
}

interface MedicalServiceRequestProps {
  visible: boolean;
  onClose: () => void;
  selectedDoctor?: DoctorLocation;
  onRequestSubmitted?: (request: ServiceRequest) => void;
}

const MedicalServiceRequest: React.FC<MedicalServiceRequestProps> = ({
  visible,
  onClose,
  selectedDoctor,
  onRequestSubmitted,
}) => {
  const { userLocation } = useLocationStore();
  
  const [serviceType, setServiceType] = useState<ServiceType>('virtual');
  const [urgency, setUrgency] = useState<Urgency>('medium');
  const [symptoms, setSymptoms] = useState('');
  const [preferredTime, setPreferredTime] = useState<ServiceRequest['preferredTime']>('today');
  const [notes, setNotes] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const serviceTypes = [
    {
      type: 'virtual' as ServiceType,
      title: 'Consulta Virtual',
      subtitle: 'Videollamada desde casa',
      icon: 'videocam',
      available: true,
      estimatedTime: '5-15 min',
    },
    {
      type: 'in_person' as ServiceType,
      title: 'Consulta Presencial',
      subtitle: 'En el consultorio del doctor',
      icon: 'medical',
      available: true,
      estimatedTime: '30 min - 2 hrs',
    },
    {
      type: 'home_visit' as ServiceType,
      title: 'Visita Domiciliaria',
      subtitle: 'El doctor viene a tu casa',
      icon: 'home',
      available: selectedDoctor?.consultationTypes.includes('home_visit') || false,
      estimatedTime: '1-3 hrs',
    },
  ];

  const urgencyLevels = [
    {
      level: 'low' as Urgency,
      title: 'Consulta de Rutina',
      subtitle: 'No es urgente',
      color: Colors.success,
      icon: 'checkmark-circle',
    },
    {
      level: 'medium' as Urgency,
      title: 'Consulta Normal',
      subtitle: 'Síntomas molestos',
      color: Colors.warning,
      icon: 'alert-circle',
    },
    {
      level: 'high' as Urgency,
      title: 'Consulta Prioritaria',
      subtitle: 'Síntomas preocupantes',
      color: Colors.danger,
      icon: 'warning',
    },
    {
      level: 'emergency' as Urgency,
      title: 'Emergencia',
      subtitle: 'Requiere atención inmediata',
      color: Colors.danger,
      icon: 'medical',
    },
  ];

  const timeOptions = [
    { value: 'now' as const, label: 'Ahora mismo', subtitle: 'Lo antes posible' },
    { value: 'today' as const, label: 'Hoy', subtitle: 'En las próximas horas' },
    { value: 'tomorrow' as const, label: 'Mañana', subtitle: 'Al día siguiente' },
    { value: 'this_week' as const, label: 'Esta semana', subtitle: 'En los próximos días' },
  ];

  const handleSubmitRequest = async () => {
    if (!symptoms.trim()) {
      Alert.alert('Información Requerida', 'Por favor describe tus síntomas');
      return;
    }

    if (serviceType === 'home_visit' && !userLocation) {
      Alert.alert('Ubicación Requerida', 'Necesitamos tu ubicación para la visita domiciliaria');
      return;
    }

    setIsSubmitting(true);

    try {
      const request: ServiceRequest = {
        serviceType,
        urgency,
        symptoms: symptoms.trim(),
        preferredTime,
        notes: notes.trim(),
        patientLocation: serviceType === 'home_visit' && userLocation ? {
          latitude: userLocation.coordinates.latitude,
          longitude: userLocation.coordinates.longitude,
          address: userLocation.address?.street || 'Dirección no especificada',
        } : undefined,
      };

      // Simular envío de solicitud
      console.log('📋 Enviando solicitud de servicio médico:', request);
      
      // Aquí se enviaría la solicitud al backend
      await new Promise(resolve => setTimeout(resolve, 2000));

      if (onRequestSubmitted) {
        onRequestSubmitted(request);
      }

      Alert.alert(
        '✅ Solicitud Enviada',
        `Tu solicitud de ${serviceTypes.find(s => s.type === serviceType)?.title.toLowerCase()} ha sido enviada${selectedDoctor ? ` a ${selectedDoctor.doctorName}` : ''}. Te notificaremos cuando sea confirmada.`,
        [
          {
            text: 'OK',
            onPress: () => {
              onClose();
              // Reset form
              setSymptoms('');
              setNotes('');
              setServiceType('virtual');
              setUrgency('medium');
              setPreferredTime('today');
            },
          },
        ]
      );
    } catch (error) {
      Alert.alert('Error', 'No se pudo enviar la solicitud. Intenta de nuevo.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const getEstimatedCost = () => {
    if (!selectedDoctor) return 'A definir';
    
    const basePrice = selectedDoctor.priceRange.min;
    const multiplier = 
      serviceType === 'home_visit' ? 1.5 :
      urgency === 'emergency' ? 2 :
      urgency === 'high' ? 1.3 : 1;
    
    return `$${Math.round(basePrice * multiplier)}-${Math.round(selectedDoctor.priceRange.max * multiplier)}`;
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={onClose}
    >
      <View style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={onClose} style={styles.closeButton}>
            <Ionicons name="close" size={24} color={Colors.dark} />
          </TouchableOpacity>
          <ThemedText style={styles.headerTitle}>Solicitar Consulta</ThemedText>
          <View style={styles.placeholder} />
        </View>

        <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
          {/* Doctor seleccionado */}
          {selectedDoctor && (
            <View style={styles.selectedDoctorCard}>
              <View style={styles.doctorInfo}>
                <View style={styles.doctorAvatar}>
                  <Ionicons name="person" size={24} color={Colors.white} />
                </View>
                <View>
                  <ThemedText style={styles.doctorName}>{selectedDoctor.doctorName}</ThemedText>
                  <ThemedText style={styles.doctorSpecialty}>{selectedDoctor.specialty}</ThemedText>
                  <View style={styles.doctorMeta}>
                    <Ionicons name="star" size={12} color={Colors.warning} />
                    <ThemedText style={styles.doctorRating}>{selectedDoctor.rating}</ThemedText>
                    <ThemedText style={styles.doctorDistance}>
                      • {selectedDoctor.distance?.toFixed(1)} km
                    </ThemedText>
                  </View>
                </View>
              </View>
              <View style={styles.estimatedCost}>
                <ThemedText style={styles.costLabel}>Costo estimado</ThemedText>
                <ThemedText style={styles.costAmount}>{getEstimatedCost()}</ThemedText>
              </View>
            </View>
          )}

          {/* Tipo de servicio */}
          <View style={styles.section}>
            <ThemedText style={styles.sectionTitle}>Tipo de Consulta</ThemedText>
            <View style={styles.optionsContainer}>
              {serviceTypes.map((service) => (
                <TouchableOpacity
                  key={service.type}
                  style={[
                    styles.optionCard,
                    serviceType === service.type && styles.selectedOptionCard,
                    !service.available && styles.disabledOptionCard,
                  ]}
                  onPress={() => service.available && setServiceType(service.type)}
                  disabled={!service.available}
                >
                  <View style={styles.optionHeader}>
                    <Ionicons
                      name={service.icon as any}
                      size={24}
                      color={
                        !service.available ? Colors.lightGray :
                        serviceType === service.type ? Colors.primary : Colors.darkGray
                      }
                    />
                    <View style={styles.optionInfo}>
                      <ThemedText style={[
                        styles.optionTitle,
                        !service.available && styles.disabledText,
                      ]}>
                        {service.title}
                      </ThemedText>
                      <ThemedText style={[
                        styles.optionSubtitle,
                        !service.available && styles.disabledText,
                      ]}>
                        {service.subtitle}
                      </ThemedText>
                    </View>
                    <ThemedText style={[
                      styles.estimatedTime,
                      !service.available && styles.disabledText,
                    ]}>
                      {service.available ? service.estimatedTime : 'No disponible'}
                    </ThemedText>
                  </View>
                  {serviceType === service.type && (
                    <View style={styles.selectedIndicator}>
                      <Ionicons name="checkmark-circle" size={20} color={Colors.primary} />
                    </View>
                  )}
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* Nivel de urgencia */}
          <View style={styles.section}>
            <ThemedText style={styles.sectionTitle}>Nivel de Urgencia</ThemedText>
            <View style={styles.optionsContainer}>
              {urgencyLevels.map((level) => (
                <TouchableOpacity
                  key={level.level}
                  style={[
                    styles.urgencyCard,
                    urgency === level.level && styles.selectedUrgencyCard,
                  ]}
                  onPress={() => setUrgency(level.level)}
                >
                  <Ionicons
                    name={level.icon as any}
                    size={20}
                    color={urgency === level.level ? Colors.white : level.color}
                  />
                  <View style={styles.urgencyInfo}>
                    <ThemedText style={[
                      styles.urgencyTitle,
                      urgency === level.level && styles.selectedUrgencyText,
                    ]}>
                      {level.title}
                    </ThemedText>
                    <ThemedText style={[
                      styles.urgencySubtitle,
                      urgency === level.level && styles.selectedUrgencyText,
                    ]}>
                      {level.subtitle}
                    </ThemedText>
                  </View>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* Síntomas */}
          <View style={styles.section}>
            <ThemedText style={styles.sectionTitle}>Describe tus Síntomas *</ThemedText>
            <TextInput
              style={styles.textArea}
              placeholder="Describe brevemente qué síntomas tienes y desde cuándo..."
              placeholderTextColor={Colors.lightGray}
              value={symptoms}
              onChangeText={setSymptoms}
              multiline
              numberOfLines={4}
              textAlignVertical="top"
            />
          </View>

          {/* Tiempo preferido */}
          <View style={styles.section}>
            <ThemedText style={styles.sectionTitle}>¿Cuándo necesitas la consulta?</ThemedText>
            <View style={styles.timeOptionsContainer}>
              {timeOptions.map((option) => (
                <TouchableOpacity
                  key={option.value}
                  style={[
                    styles.timeOption,
                    preferredTime === option.value && styles.selectedTimeOption,
                  ]}
                  onPress={() => setPreferredTime(option.value)}
                >
                  <ThemedText style={[
                    styles.timeOptionLabel,
                    preferredTime === option.value && styles.selectedTimeOptionText,
                  ]}>
                    {option.label}
                  </ThemedText>
                  <ThemedText style={[
                    styles.timeOptionSubtitle,
                    preferredTime === option.value && styles.selectedTimeOptionText,
                  ]}>
                    {option.subtitle}
                  </ThemedText>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* Notas adicionales */}
          <View style={styles.section}>
            <ThemedText style={styles.sectionTitle}>Notas Adicionales (Opcional)</ThemedText>
            <TextInput
              style={styles.textInput}
              placeholder="Información adicional que consideres importante..."
              placeholderTextColor={Colors.lightGray}
              value={notes}
              onChangeText={setNotes}
              multiline
              numberOfLines={2}
            />
          </View>
        </ScrollView>

        {/* Footer con botón de envío */}
        <View style={styles.footer}>
          <TouchableOpacity
            style={[styles.submitButton, isSubmitting && styles.disabledSubmitButton]}
            onPress={handleSubmitRequest}
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <ThemedText style={styles.submitButtonText}>Enviando...</ThemedText>
            ) : (
              <>
                <Ionicons name="send" size={20} color={Colors.white} />
                <ThemedText style={styles.submitButtonText}>
                  Solicitar Consulta {selectedDoctor ? `($${getEstimatedCost()})` : ''}
                </ThemedText>
              </>
            )}
          </TouchableOpacity>
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
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: Spacing.lg,
    backgroundColor: Colors.white,
    borderBottomWidth: 1,
    borderBottomColor: Colors.lightGray,
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
    width: 40,
  },
  content: {
    flex: 1,
    padding: Spacing.lg,
  },
  selectedDoctorCard: {
    backgroundColor: Colors.white,
    padding: Spacing.lg,
    borderRadius: BordersAndShadows.borderRadius.lg,
    marginBottom: Spacing.lg,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    ...BordersAndShadows.shadows.sm,
  },
  doctorInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
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
  doctorMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.xs,
  },
  doctorRating: {
    fontSize: Typography.fontSizes.sm,
    color: Colors.darkGray,
    marginLeft: Spacing.xs,
  },
  doctorDistance: {
    fontSize: Typography.fontSizes.sm,
    color: Colors.darkGray,
  },
  estimatedCost: {
    alignItems: 'flex-end',
  },
  costLabel: {
    fontSize: Typography.fontSizes.xs,
    color: Colors.darkGray,
    marginBottom: Spacing.xs,
  },
  costAmount: {
    fontSize: Typography.fontSizes.lg,
    fontWeight: Typography.fontWeights.bold as any,
    color: Colors.primary,
  },
  section: {
    marginBottom: Spacing.xl,
  },
  sectionTitle: {
    fontSize: Typography.fontSizes.md,
    fontWeight: Typography.fontWeights.bold as any,
    color: Colors.dark,
    marginBottom: Spacing.md,
  },
  optionsContainer: {
    gap: Spacing.md,
  },
  optionCard: {
    backgroundColor: Colors.white,
    padding: Spacing.lg,
    borderRadius: BordersAndShadows.borderRadius.lg,
    borderWidth: 2,
    borderColor: Colors.lightGray,
    position: 'relative',
  },
  selectedOptionCard: {
    borderColor: Colors.primary,
  },
  disabledOptionCard: {
    backgroundColor: Colors.background,
    opacity: 0.5,
  },
  optionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  optionInfo: {
    flex: 1,
    marginLeft: Spacing.md,
  },
  optionTitle: {
    fontSize: Typography.fontSizes.md,
    fontWeight: Typography.fontWeights.bold as any,
    color: Colors.dark,
    marginBottom: Spacing.xs,
  },
  optionSubtitle: {
    fontSize: Typography.fontSizes.sm,
    color: Colors.darkGray,
  },
  estimatedTime: {
    fontSize: Typography.fontSizes.sm,
    color: Colors.primary,
    fontWeight: Typography.fontWeights.bold as any,
  },
  disabledText: {
    color: Colors.lightGray,
  },
  selectedIndicator: {
    position: 'absolute',
    top: Spacing.sm,
    right: Spacing.sm,
  },
  urgencyCard: {
    backgroundColor: Colors.white,
    padding: Spacing.md,
    borderRadius: BordersAndShadows.borderRadius.md,
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: Colors.lightGray,
  },
  selectedUrgencyCard: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
  },
  urgencyInfo: {
    marginLeft: Spacing.md,
    flex: 1,
  },
  urgencyTitle: {
    fontSize: Typography.fontSizes.md,
    fontWeight: Typography.fontWeights.bold as any,
    color: Colors.dark,
    marginBottom: Spacing.xs,
  },
  urgencySubtitle: {
    fontSize: Typography.fontSizes.sm,
    color: Colors.darkGray,
  },
  selectedUrgencyText: {
    color: Colors.white,
  },
  textArea: {
    backgroundColor: Colors.white,
    borderWidth: 1,
    borderColor: Colors.lightGray,
    borderRadius: BordersAndShadows.borderRadius.md,
    padding: Spacing.md,
    fontSize: Typography.fontSizes.md,
    color: Colors.dark,
    minHeight: 100,
  },
  timeOptionsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.sm,
  },
  timeOption: {
    backgroundColor: Colors.white,
    padding: Spacing.md,
    borderRadius: BordersAndShadows.borderRadius.md,
    borderWidth: 1,
    borderColor: Colors.lightGray,
    flex: 1,
    minWidth: '45%',
  },
  selectedTimeOption: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
  },
  timeOptionLabel: {
    fontSize: Typography.fontSizes.md,
    fontWeight: Typography.fontWeights.bold as any,
    color: Colors.dark,
    marginBottom: Spacing.xs,
  },
  timeOptionSubtitle: {
    fontSize: Typography.fontSizes.sm,
    color: Colors.darkGray,
  },
  selectedTimeOptionText: {
    color: Colors.white,
  },
  textInput: {
    backgroundColor: Colors.white,
    borderWidth: 1,
    borderColor: Colors.lightGray,
    borderRadius: BordersAndShadows.borderRadius.md,
    padding: Spacing.md,
    fontSize: Typography.fontSizes.md,
    color: Colors.dark,
  },
  footer: {
    padding: Spacing.lg,
    backgroundColor: Colors.white,
    borderTopWidth: 1,
    borderTopColor: Colors.lightGray,
  },
  submitButton: {
    backgroundColor: Colors.primary,
    padding: Spacing.lg,
    borderRadius: BordersAndShadows.borderRadius.lg,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: Spacing.sm,
    ...BordersAndShadows.shadows.md,
  },
  disabledSubmitButton: {
    backgroundColor: Colors.lightGray,
  },
  submitButtonText: {
    color: Colors.white,
    fontSize: Typography.fontSizes.lg,
    fontWeight: Typography.fontWeights.bold as any,
  },
});

export default MedicalServiceRequest;
