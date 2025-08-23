import React, { useState, useEffect } from 'react';
import { 
  View, 
  StyleSheet, 
  ScrollView, 
  TouchableOpacity, 
  Modal, 
  TextInput,
  Alert,
  Text,
  Image,
  ActivityIndicator
} from 'react-native';
import { ThemedText } from '@/components/ThemedText';
import { Ionicons } from '@expo/vector-icons';
import { Colors, Spacing, BordersAndShadows, Typography } from '@/constants/GlobalStyles';
import { DoctorLocation } from '@/store/locationStore';
import { useMedicalLocation } from '@/hooks/useMedicalLocation';
import { useServiceTrackingStore } from '@/store/serviceTrackingStore';

export interface ServiceRequest {
  serviceType: 'virtual' | 'in_person' | 'home_visit';
  symptoms: string;
  urgency: 'low' | 'medium' | 'high' | 'emergency';
  preferredTime: string;
  notes?: string;
  patientLocation?: {
    latitude: number;
    longitude: number;
    address: string;
  };
}

interface MedicalServiceRequestProps {
  visible: boolean;
  onClose: () => void;
  selectedDoctor: DoctorLocation | null;
  onRequestSubmitted: (request: ServiceRequest) => void;
}

const MedicalServiceRequest: React.FC<MedicalServiceRequestProps> = ({
  visible,
  onClose,
  selectedDoctor,
  onRequestSubmitted,
}) => {
  // Estados del formulario
  const [serviceType, setServiceType] = useState<'virtual' | 'in_person' | 'home_visit'>('virtual');
  const [symptoms, setSymptoms] = useState('');
  const [urgency, setUrgency] = useState<'low' | 'medium' | 'high' | 'emergency'>('medium');
  const [preferredTime, setPreferredTime] = useState('today');
  const [notes, setNotes] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Hooks
  const {
    userLocation,
    canDoctorVisitHome,
    getEstimatedArrivalTime,
    isDoctorAvailableNow,
  } = useMedicalLocation();
  
  const { createServiceRequest } = useServiceTrackingStore();

  // Resetear formulario cuando se abre el modal
  useEffect(() => {
    if (visible && selectedDoctor) {
      // Auto-seleccionar el tipo de servicio más apropiado
      if (selectedDoctor.consultationTypes.includes('virtual')) {
        setServiceType('virtual');
      } else if (selectedDoctor.consultationTypes.includes('in_person')) {
        setServiceType('in_person');
      } else if (selectedDoctor.consultationTypes.includes('home_visit')) {
        setServiceType('home_visit');
      }
      
      // Limpiar formulario
      setSymptoms('');
      setNotes('');
      setUrgency('medium');
      setPreferredTime('today');
    }
  }, [visible, selectedDoctor]);

  const serviceTypes = [
    {
      id: 'virtual' as const,
      title: 'Consulta Virtual',
      description: 'Videollamada desde casa',
      icon: 'videocam',
      price: selectedDoctor ? selectedDoctor.priceRange.min : 45,
    },
    {
      id: 'in_person' as const,
      title: 'Consulta Presencial',
      description: 'En el consultorio del doctor',
      icon: 'business',
      price: selectedDoctor ? selectedDoctor.priceRange.max : 65,
    },
    {
      id: 'home_visit' as const,
      title: 'Visita Domiciliaria',
      description: 'El doctor va a tu hogar',
      icon: 'home',
      price: selectedDoctor ? selectedDoctor.priceRange.max * 1.5 : 90,
    },
  ];

  const urgencyLevels = [
    { id: 'low' as const, label: 'Baja', color: Colors.success, description: 'No es urgente' },
    { id: 'medium' as const, label: 'Media', color: Colors.warning, description: 'Moderadamente urgente' },
    { id: 'high' as const, label: 'Alta', color: Colors.danger, description: 'Requiere atención pronta' },
    { id: 'emergency' as const, label: 'Emergencia', color: Colors.danger, description: 'Requiere atención inmediata' },
  ];

  const timeOptions = [
    { id: 'now', label: 'Ahora mismo', description: 'Lo más pronto posible' },
    { id: 'today', label: 'Hoy', description: 'En las próximas horas' },
    { id: 'tomorrow', label: 'Mañana', description: 'En las próximas 24 horas' },
    { id: 'this_week', label: 'Esta semana', description: 'En los próximos 7 días' },
  ];

  // Calcular precio estimado
  const calculateEstimatedPrice = (): { min: number; max: number; currency: string } => {
    if (!selectedDoctor) return { min: 0, max: 0, currency: 'USD' };
    
    let baseMin = selectedDoctor.priceRange.min;
    let baseMax = selectedDoctor.priceRange.max;
    
    // Multiplicadores según tipo de servicio
    switch (serviceType) {
      case 'virtual':
        // Virtual es el precio base (más económico)
        break;
      case 'in_person':
        // Presencial tiene un ligero incremento
        baseMin *= 1.2;
        baseMax *= 1.2;
        break;
      case 'home_visit':
        // Visita domiciliaria es más costosa
        baseMin *= 1.5;
        baseMax *= 1.5;
        break;
    }
    
    // Multiplicador por urgencia
    switch (urgency) {
      case 'low':
        // Precio estándar
        break;
      case 'medium':
        baseMin *= 1.1;
        baseMax *= 1.1;
        break;
      case 'high':
        baseMin *= 1.3;
        baseMax *= 1.3;
        break;
      case 'emergency':
        baseMin *= 2.0;
        baseMax *= 2.0;
        break;
    }
    
    return {
      min: Math.round(baseMin),
      max: Math.round(baseMax),
      currency: 'USD'
    };
  };

  const handleSubmit = async () => {
    if (!selectedDoctor) {
      Alert.alert('Error', 'No hay doctor seleccionado');
      return;
    }

    if (!symptoms.trim()) {
      Alert.alert('Error', 'Por favor describe tus síntomas');
      return;
    }

    if (symptoms.trim().length < 10) {
      Alert.alert('Error', 'Por favor proporciona más detalles sobre tus síntomas (mínimo 10 caracteres)');
      return;
    }

    // Validar que el doctor ofrezca el tipo de servicio seleccionado
    if (!selectedDoctor.consultationTypes.includes(serviceType)) {
      Alert.alert(
        'Servicio no disponible', 
        `El Dr. ${selectedDoctor.doctorName} no ofrece ${
          serviceType === 'virtual' ? 'consultas virtuales' : 
          serviceType === 'in_person' ? 'consultas presenciales' : 
          'visitas domiciliarias'
        }`
      );
      return;
    }

    // Validar visita domiciliaria
    if (serviceType === 'home_visit' && !canDoctorVisitHome(selectedDoctor)) {
      Alert.alert(
        'Fuera del área de servicio',
        `El Dr. ${selectedDoctor.doctorName} no puede realizar visitas domiciliarias en tu ubicación (máximo ${selectedDoctor.serviceRadius}km)`
      );
      return;
    }

    setIsSubmitting(true);

    try {
      const estimatedPrice = calculateEstimatedPrice();
      
      const request: ServiceRequest = {
        serviceType,
        symptoms: symptoms.trim(),
        urgency,
        preferredTime,
        notes: notes.trim() || undefined,
        patientLocation: (serviceType === 'home_visit' && userLocation) ? {
          latitude: userLocation.coordinates.latitude,
          longitude: userLocation.coordinates.longitude,
          address: userLocation.address?.street || 'Ubicación del paciente',
        } : undefined,
      };

      console.log('📋 Enviando solicitud de servicio médico:', {
        request,
        doctor: selectedDoctor.doctorName,
        estimatedPrice,
        eta: serviceType === 'home_visit' ? getEstimatedArrivalTime(selectedDoctor) : null
      });

      // Crear solicitud en el tracking store
      const serviceId = await createServiceRequest({
        patientId: 'patient-001', // Mock ID
        doctorId: selectedDoctor.doctorId,
        serviceType,
        symptoms: symptoms.trim(),
        urgency,
        preferredTime,
        notes: notes.trim(),
        estimatedPrice,
        patientLocation: request.patientLocation,
        doctorLocation: {
          latitude: selectedDoctor.latitude,
          longitude: selectedDoctor.longitude,
          address: selectedDoctor.address.street,
        }
      });

      console.log('✅ Solicitud creada con ID:', serviceId);
      
      // Mostrar confirmación
      Alert.alert(
        '✅ Solicitud Enviada',
        `Tu solicitud ha sido enviada al Dr. ${selectedDoctor.doctorName}.\n\nTipo: ${
          serviceType === 'virtual' ? 'Consulta Virtual' : 
          serviceType === 'in_person' ? 'Consulta Presencial' : 
          'Visita Domiciliaria'
        }\nPrecio estimado: $${estimatedPrice.min} - $${estimatedPrice.max} USD${
          serviceType === 'home_visit' ? `\nTiempo estimado: ~${getEstimatedArrivalTime(selectedDoctor)} min` : ''
        }`,
        [
          {
            text: 'OK',
            onPress: () => {
              onRequestSubmitted(request);
              onClose();
            }
          }
        ]
      );

    } catch (error) {
      console.error('❌ Error creando solicitud:', error);
      Alert.alert(
        'Error',
        'No se pudo enviar la solicitud. Por favor intenta nuevamente.',
        [{ text: 'OK' }]
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const selectedServiceType = serviceTypes.find(st => st.id === serviceType);
  const selectedUrgency = urgencyLevels.find(ul => ul.id === urgency);
  const selectedTime = timeOptions.find(to => to.id === preferredTime);

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
          <ThemedText style={styles.title}>Solicitar Servicio Médico</ThemedText>
          <TouchableOpacity onPress={onClose} style={styles.closeButton}>
            <Ionicons name="close" size={24} color={Colors.dark} />
          </TouchableOpacity>
        </View>

        <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
          {/* Doctor seleccionado */}
          {selectedDoctor && (
            <View style={styles.doctorCard}>
              <View style={styles.doctorHeader}>
                <View style={styles.doctorAvatar}>
                  {selectedDoctor.avatar ? (
                    <Image source={{ uri: selectedDoctor.avatar }} style={styles.avatarImage} />
                  ) : (
                    <Ionicons name="person" size={32} color={Colors.white} />
                  )}
                </View>
                <View style={styles.doctorInfo}>
                  <ThemedText style={styles.doctorName}>{selectedDoctor.doctorName}</ThemedText>
                  <Text style={styles.doctorSpecialty}>{selectedDoctor.specialty}</Text>
                  <View style={styles.doctorMeta}>
                    <View style={styles.metaItem}>
                      <Ionicons name="star" size={14} color={Colors.warning} />
                      <Text style={styles.metaText}>{selectedDoctor.rating}</Text>
                    </View>
                    <View style={styles.metaItem}>
                      <Ionicons name="location" size={14} color={Colors.info} />
                      <Text style={styles.metaText}>{selectedDoctor.distance?.toFixed(1)} km</Text>
                    </View>
                    <View style={styles.metaItem}>
                      <Ionicons 
                        name={isDoctorAvailableNow(selectedDoctor) ? "checkmark-circle" : "time"} 
                        size={14} 
                        color={isDoctorAvailableNow(selectedDoctor) ? Colors.success : Colors.warning} 
                      />
                      <Text style={[
                        styles.metaText, 
                        { color: isDoctorAvailableNow(selectedDoctor) ? Colors.success : Colors.warning }
                      ]}>
                        {isDoctorAvailableNow(selectedDoctor) ? 'Disponible' : 'No disponible'}
                      </Text>
                    </View>
                  </View>
                </View>
              </View>

              {/* Servicios disponibles */}
              <View style={styles.availableServices}>
                <Text style={styles.servicesTitle}>Servicios disponibles:</Text>
                <View style={styles.servicesList}>
                  {selectedDoctor.consultationTypes.map((type) => (
                    <View key={type} style={styles.serviceChip}>
                      <Ionicons 
                        name={
                          type === 'virtual' ? 'videocam' : 
                          type === 'in_person' ? 'business' : 
                          'home'
                        } 
                        size={12} 
                        color={Colors.primary} 
                      />
                      <Text style={styles.serviceText}>
                        {type === 'virtual' ? 'Virtual' : 
                         type === 'in_person' ? 'Presencial' : 
                         'Domicilio'}
                      </Text>
                    </View>
                  ))}
                </View>
              </View>

              {/* Precio estimado dinámico */}
              <View style={styles.priceEstimation}>
                <Text style={styles.priceTitle}>💰 Precio estimado</Text>
                <View style={styles.priceContainer}>
                  <Text style={styles.priceText}>
                    ${calculateEstimatedPrice().min} - ${calculateEstimatedPrice().max} USD
                  </Text>
                  {serviceType === 'home_visit' && canDoctorVisitHome(selectedDoctor) && (
                    <Text style={styles.etaText}>
                      ETA: ~{getEstimatedArrivalTime(selectedDoctor)} min
                    </Text>
                  )}
                </View>
              </View>
            </View>
          )}

          {/* Tipo de servicio */}
          <View style={styles.section}>
            <ThemedText style={styles.sectionTitle}>Tipo de Consulta</ThemedText>
            {serviceTypes.map((type) => (
              <TouchableOpacity
                key={type.id}
                style={[
                  styles.serviceTypeCard,
                  serviceType === type.id && styles.serviceTypeCardActive
                ]}
                onPress={() => setServiceType(type.id)}
              >
                <View style={styles.serviceTypeIcon}>
                  <Ionicons 
                    name={type.icon as any} 
                    size={24} 
                    color={serviceType === type.id ? Colors.white : Colors.primary} 
                  />
                </View>
                <View style={styles.serviceTypeContent}>
                  <ThemedText style={[
                    styles.serviceTypeTitle,
                    serviceType === type.id && styles.serviceTypeTextActive
                  ]}>
                    {type.title}
                  </ThemedText>
                  <Text style={[
                    styles.serviceTypeDescription,
                    serviceType === type.id && styles.serviceTypeTextActive
                  ]}>
                    {type.description}
                  </Text>
                </View>
                <View style={styles.serviceTypePrice}>
                  <Text style={[
                    styles.priceText,
                    serviceType === type.id && styles.serviceTypeTextActive
                  ]}>
                    ${type.price}
                  </Text>
                </View>
              </TouchableOpacity>
            ))}
          </View>

          {/* Síntomas */}
          <View style={styles.section}>
            <ThemedText style={styles.sectionTitle}>Describe tus síntomas</ThemedText>
            <TextInput
              style={styles.textArea}
              placeholder="Describe detalladamente tus síntomas, cuándo comenzaron y qué los empeora o mejora..."
              value={symptoms}
              onChangeText={setSymptoms}
              multiline
              numberOfLines={4}
              textAlignVertical="top"
            />
          </View>

          {/* Urgencia */}
          <View style={styles.section}>
            <ThemedText style={styles.sectionTitle}>Nivel de Urgencia</ThemedText>
            <View style={styles.urgencyContainer}>
              {urgencyLevels.map((level) => (
                <TouchableOpacity
                  key={level.id}
                  style={[
                    styles.urgencyChip,
                    urgency === level.id && { backgroundColor: level.color }
                  ]}
                  onPress={() => setUrgency(level.id)}
                >
                  <Text style={[
                    styles.urgencyText,
                    urgency === level.id && styles.urgencyTextActive
                  ]}>
                    {level.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
            {selectedUrgency && (
              <Text style={styles.urgencyDescription}>{selectedUrgency.description}</Text>
            )}
          </View>

          {/* Tiempo preferido */}
          <View style={styles.section}>
            <ThemedText style={styles.sectionTitle}>¿Cuándo prefieres la consulta?</ThemedText>
            <TouchableOpacity 
              style={styles.timeSelector}
              onPress={() => setShowTimeOptions(true)}
            >
              <View style={styles.timeSelectorContent}>
                <Ionicons name="time" size={20} color={Colors.primary} />
                <Text style={styles.timeSelectorText}>
                  {selectedTime?.label || 'Seleccionar tiempo'}
                </Text>
              </View>
              <Ionicons name="chevron-down" size={20} color={Colors.darkGray} />
            </TouchableOpacity>
            {selectedTime && (
              <Text style={styles.timeDescription}>{selectedTime.description}</Text>
            )}
          </View>

          {/* Notas adicionales */}
          <View style={styles.section}>
            <ThemedText style={styles.sectionTitle}>Notas adicionales (opcional)</ThemedText>
            <TextInput
              style={styles.textInput}
              placeholder="Medicamentos actuales, alergias, información relevante..."
              value={notes}
              onChangeText={setNotes}
              multiline
              numberOfLines={3}
              textAlignVertical="top"
            />
          </View>

          {/* Resumen del costo */}
          <View style={styles.costSummary}>
            <View style={styles.costRow}>
              <Text style={styles.costLabel}>Tipo de consulta:</Text>
              <Text style={styles.costValue}>{selectedServiceType?.title}</Text>
            </View>
            <View style={styles.costRow}>
              <Text style={styles.costLabel}>Costo estimado:</Text>
              <Text style={styles.costAmount}>${selectedServiceType?.price}</Text>
            </View>
            <View style={styles.costDivider} />
            <View style={styles.costRow}>
              <Text style={styles.costTotal}>Total:</Text>
              <Text style={styles.costTotalAmount}>${selectedServiceType?.price}</Text>
            </View>
          </View>
        </ScrollView>

        {/* Botón de envío */}
        <View style={styles.footer}>
          <TouchableOpacity 
            style={[
              styles.submitButton, 
              isSubmitting && styles.submitButtonDisabled
            ]} 
            onPress={handleSubmit}
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <View style={styles.submitButtonContent}>
                <ActivityIndicator size="small" color={Colors.white} />
                <ThemedText style={[styles.submitButtonText, { marginLeft: Spacing.sm }]}>
                  Enviando...
                </ThemedText>
              </View>
            ) : (
              <ThemedText style={styles.submitButtonText}>
                💬 Solicitar Consulta
              </ThemedText>
            )}
          </TouchableOpacity>
        </View>

        {/* Modal de opciones de tiempo */}
        <Modal
          visible={showTimeOptions}
          animationType="slide"
          presentationStyle="pageSheet"
          onRequestClose={() => setShowTimeOptions(false)}
        >
          <View style={styles.timeOptionsContainer}>
            <View style={styles.timeOptionsHeader}>
              <ThemedText style={styles.timeOptionsTitle}>¿Cuándo prefieres la consulta?</ThemedText>
              <TouchableOpacity onPress={() => setShowTimeOptions(false)}>
                <Ionicons name="close" size={24} color={Colors.dark} />
              </TouchableOpacity>
            </View>
            <ScrollView style={styles.timeOptionsList}>
              {timeOptions.map((option) => (
                <TouchableOpacity
                  key={option.id}
                  style={[
                    styles.timeOption,
                    preferredTime === option.id && styles.timeOptionActive
                  ]}
                  onPress={() => {
                    setPreferredTime(option.id);
                    setShowTimeOptions(false);
                  }}
                >
                  <View style={styles.timeOptionContent}>
                    <Text style={[
                      styles.timeOptionLabel,
                      preferredTime === option.id && styles.timeOptionTextActive
                    ]}>
                      {option.label}
                    </Text>
                    <Text style={[
                      styles.timeOptionDescription,
                      preferredTime === option.id && styles.timeOptionTextActive
                    ]}>
                      {option.description}
                    </Text>
                  </View>
                  {preferredTime === option.id && (
                    <Ionicons name="checkmark" size={20} color={Colors.primary} />
                  )}
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        </Modal>
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
  },
  title: {
    fontSize: Typography.fontSizes.xl,
    fontWeight: Typography.fontWeights.bold as any,
    color: Colors.dark,
  },
  closeButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.lightGray,
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    flex: 1,
    paddingHorizontal: Spacing.lg,
  },
  doctorCard: {
    flexDirection: 'row',
    backgroundColor: Colors.white,
    borderRadius: BordersAndShadows.borderRadius.lg,
    padding: Spacing.md,
    marginVertical: Spacing.md,
    ...BordersAndShadows.shadows.sm,
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
  doctorInfo: {
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
  doctorDistance: {
    fontSize: Typography.fontSizes.sm,
    color: Colors.darkGray,
  },
  section: {
    marginBottom: Spacing.xl,
  },
  sectionTitle: {
    fontSize: Typography.fontSizes.lg,
    fontWeight: Typography.fontWeights.bold as any,
    color: Colors.dark,
    marginBottom: Spacing.md,
  },
  serviceTypeCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.white,
    borderRadius: BordersAndShadows.borderRadius.lg,
    padding: Spacing.md,
    marginBottom: Spacing.md,
    borderWidth: 2,
    borderColor: Colors.lightGray,
  },
  serviceTypeCardActive: {
    borderColor: Colors.primary,
    backgroundColor: Colors.primary,
  },
  serviceTypeIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: Colors.lightGray,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: Spacing.md,
  },
  serviceTypeContent: {
    flex: 1,
  },
  serviceTypeTitle: {
    fontSize: Typography.fontSizes.md,
    fontWeight: Typography.fontWeights.bold as any,
    color: Colors.dark,
    marginBottom: Spacing.xs,
  },
  serviceTypeDescription: {
    fontSize: Typography.fontSizes.sm,
    color: Colors.darkGray,
  },
  serviceTypePrice: {
    alignItems: 'flex-end',
  },
  priceText: {
    fontSize: Typography.fontSizes.lg,
    fontWeight: Typography.fontWeights.bold as any,
    color: Colors.primary,
  },
  serviceTypeTextActive: {
    color: Colors.white,
  },
  textArea: {
    backgroundColor: Colors.white,
    borderRadius: BordersAndShadows.borderRadius.md,
    padding: Spacing.md,
    fontSize: Typography.fontSizes.md,
    color: Colors.dark,
    borderWidth: 1,
    borderColor: Colors.lightGray,
    minHeight: 100,
  },
  textInput: {
    backgroundColor: Colors.white,
    borderRadius: BordersAndShadows.borderRadius.md,
    padding: Spacing.md,
    fontSize: Typography.fontSizes.md,
    color: Colors.dark,
    borderWidth: 1,
    borderColor: Colors.lightGray,
    minHeight: 80,
  },
  urgencyContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: Spacing.sm,
  },
  urgencyChip: {
    backgroundColor: Colors.white,
    borderRadius: 20,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    marginRight: Spacing.sm,
    marginBottom: Spacing.sm,
    borderWidth: 1,
    borderColor: Colors.lightGray,
  },
  urgencyText: {
    fontSize: Typography.fontSizes.sm,
    color: Colors.dark,
  },
  urgencyTextActive: {
    color: Colors.white,
    fontWeight: Typography.fontWeights.bold as any,
  },
  urgencyDescription: {
    fontSize: Typography.fontSizes.sm,
    color: Colors.darkGray,
    fontStyle: 'italic',
  },
  timeSelector: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: Colors.white,
    borderRadius: BordersAndShadows.borderRadius.md,
    padding: Spacing.md,
    borderWidth: 1,
    borderColor: Colors.lightGray,
    marginBottom: Spacing.sm,
  },
  timeSelectorContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  timeSelectorText: {
    fontSize: Typography.fontSizes.md,
    color: Colors.dark,
    marginLeft: Spacing.sm,
  },
  timeDescription: {
    fontSize: Typography.fontSizes.sm,
    color: Colors.darkGray,
    fontStyle: 'italic',
  },
  costSummary: {
    backgroundColor: Colors.white,
    borderRadius: BordersAndShadows.borderRadius.lg,
    padding: Spacing.lg,
    marginBottom: Spacing.lg,
    ...BordersAndShadows.shadows.sm,
  },
  costRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.sm,
  },
  costLabel: {
    fontSize: Typography.fontSizes.md,
    color: Colors.darkGray,
  },
  costValue: {
    fontSize: Typography.fontSizes.md,
    color: Colors.dark,
  },
  costAmount: {
    fontSize: Typography.fontSizes.md,
    color: Colors.primary,
    fontWeight: Typography.fontWeights.bold as any,
  },
  costDivider: {
    height: 1,
    backgroundColor: Colors.lightGray,
    marginVertical: Spacing.sm,
  },
  costTotal: {
    fontSize: Typography.fontSizes.lg,
    fontWeight: Typography.fontWeights.bold as any,
    color: Colors.dark,
  },
  costTotalAmount: {
    fontSize: Typography.fontSizes.lg,
    fontWeight: Typography.fontWeights.bold as any,
    color: Colors.primary,
  },
  footer: {
    padding: Spacing.lg,
    borderTopWidth: 1,
    borderTopColor: Colors.lightGray,
  },
  submitButton: {
    backgroundColor: Colors.primary,
    borderRadius: BordersAndShadows.borderRadius.lg,
    padding: Spacing.lg,
    alignItems: 'center',
    ...BordersAndShadows.shadows.sm,
  },
  submitButtonDisabled: {
    backgroundColor: Colors.lightGray,
    opacity: 0.6,
  },
  submitButtonContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  submitButtonText: {
    fontSize: Typography.fontSizes.lg,
    fontWeight: Typography.fontWeights.bold as any,
    color: Colors.white,
  },

  // Estilos mejorados para el doctor
  doctorHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Spacing.md,
  },
  avatarImage: {
    width: 60,
    height: 60,
    borderRadius: 30,
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: Spacing.md,
  },
  metaText: {
    fontSize: Typography.fontSizes.sm,
    color: Colors.darkGray,
    marginLeft: Spacing.xs,
  },
  availableServices: {
    marginTop: Spacing.md,
    paddingTop: Spacing.md,
    borderTopWidth: 1,
    borderTopColor: Colors.lightGray,
  },
  servicesTitle: {
    fontSize: Typography.fontSizes.sm,
    color: Colors.darkGray,
    marginBottom: Spacing.sm,
    fontWeight: Typography.fontWeights.medium as any,
  },
  servicesList: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.sm,
  },
  serviceChip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.background,
    paddingHorizontal: Spacing.sm,
    paddingVertical: Spacing.xs,
    borderRadius: 15,
    gap: Spacing.xs,
  },
  serviceText: {
    fontSize: Typography.fontSizes.xs,
    color: Colors.primary,
    fontWeight: Typography.fontWeights.medium as any,
  },
  priceEstimation: {
    marginTop: Spacing.md,
    paddingTop: Spacing.md,
    borderTopWidth: 1,
    borderTopColor: Colors.lightGray,
  },
  priceTitle: {
    fontSize: Typography.fontSizes.md,
    color: Colors.dark,
    marginBottom: Spacing.sm,
    fontWeight: Typography.fontWeights.bold as any,
  },
  priceContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  priceText: {
    fontSize: Typography.fontSizes.lg,
    color: Colors.success,
    fontWeight: Typography.fontWeights.bold as any,
  },
  etaText: {
    fontSize: Typography.fontSizes.sm,
    color: Colors.info,
    fontWeight: Typography.fontWeights.medium as any,
  },
  // Estilos para el modal de tiempo
  timeOptionsContainer: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  timeOptionsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: Spacing.lg,
    borderBottomWidth: 1,
    borderBottomColor: Colors.lightGray,
  },
  timeOptionsTitle: {
    fontSize: Typography.fontSizes.lg,
    fontWeight: Typography.fontWeights.bold as any,
    color: Colors.dark,
  },
  timeOptionsList: {
    flex: 1,
    paddingHorizontal: Spacing.lg,
  },
  timeOption: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: Colors.white,
    borderRadius: BordersAndShadows.borderRadius.lg,
    padding: Spacing.lg,
    marginVertical: Spacing.sm,
    borderWidth: 2,
    borderColor: Colors.lightGray,
  },
  timeOptionActive: {
    borderColor: Colors.primary,
    backgroundColor: Colors.primary,
  },
  timeOptionContent: {
    flex: 1,
  },
  timeOptionLabel: {
    fontSize: Typography.fontSizes.md,
    fontWeight: Typography.fontWeights.bold as any,
    color: Colors.dark,
    marginBottom: Spacing.xs,
  },
  timeOptionDescription: {
    fontSize: Typography.fontSizes.sm,
    color: Colors.darkGray,
  },
  timeOptionTextActive: {
    color: Colors.white,
  },
});

export default MedicalServiceRequest;