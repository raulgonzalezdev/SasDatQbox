import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Estados del servicio médico (como Uber)
export type ServiceStatus = 
  | 'requested'        // Solicitud enviada
  | 'accepted'         // Doctor aceptó
  | 'preparing'        // Doctor preparándose
  | 'on_the_way'       // En camino (para visitas domiciliarias)
  | 'arrived'          // Doctor llegó
  | 'in_consultation'  // Consulta en progreso
  | 'completed'        // Consulta terminada
  | 'cancelled'        // Cancelada
  | 'payment_pending'  // Esperando pago
  | 'paid';            // Pagado

export interface ServiceRequest {
  id: string;
  patientId: string;
  doctorId: string;
  doctorName: string;
  doctorAvatar?: string;
  serviceType: 'virtual' | 'in_person' | 'home_visit';
  status: ServiceStatus;
  
  // Información de la solicitud
  symptoms: string;
  urgency: 'low' | 'medium' | 'high' | 'emergency';
  preferredTime: string;
  notes?: string;
  
  // Información de ubicación (para visitas domiciliarias)
  patientLocation?: {
    latitude: number;
    longitude: number;
    address: string;
  };
  doctorLocation?: {
    latitude: number;
    longitude: number;
  };
  
  // Información de tiempo
  requestedAt: Date;
  acceptedAt?: Date;
  startedAt?: Date;
  completedAt?: Date;
  estimatedArrival?: Date;
  
  // Información financiera
  basePrice: number;
  finalPrice: number;
  platformFee: number; // Comisión de la plataforma
  
  // Rating y feedback
  patientRating?: number;
  doctorRating?: number;
  patientFeedback?: string;
  doctorFeedback?: string;
}

export interface ServiceMetrics {
  totalServices: number;
  completedServices: number;
  activeServices: number;
  totalRevenue: number;
  platformRevenue: number; // Total de comisiones
  averageServiceTime: number; // En minutos
  averageRating: number;
  
  // Métricas por tipo de servicio
  virtualConsults: number;
  inPersonConsults: number;
  homeVisits: number;
  
  // Métricas de crecimiento
  dailyServices: number;
  weeklyGrowth: number;
  monthlyRevenue: number;
}

interface ServiceTrackingState {
  // Estado actual
  activeServices: ServiceRequest[];
  completedServices: ServiceRequest[];
  currentService: ServiceRequest | null;
  
  // Métricas del negocio
  metrics: ServiceMetrics;
  
  // Estados de UI
  isTrackingActive: boolean;
  showTrackingModal: boolean;
  
  // Acciones principales
  createServiceRequest: (request: Omit<ServiceRequest, 'id' | 'requestedAt' | 'status'>) => string;
  updateServiceStatus: (serviceId: string, status: ServiceStatus, additionalData?: Partial<ServiceRequest>) => void;
  acceptService: (serviceId: string, doctorLocation?: { latitude: number; longitude: number }) => void;
  completeService: (serviceId: string, patientRating: number, doctorRating: number, feedback?: { patient?: string; doctor?: string }) => void;
  cancelService: (serviceId: string, reason: string) => void;
  
  // Tracking en tiempo real
  updateDoctorLocation: (serviceId: string, location: { latitude: number; longitude: number }) => void;
  calculateETA: (serviceId: string) => number; // Retorna minutos
  
  // Métricas y analytics
  updateMetrics: () => void;
  getRevenueProjection: (months: number) => number[];
  getGrowthMetrics: () => { daily: number; weekly: number; monthly: number };
  
  // Simulaciones para demo
  simulateServiceFlow: (serviceType: 'virtual' | 'in_person' | 'home_visit') => Promise<void>;
  generateMockData: () => void;
  
  // Limpieza
  clearAllData: () => void;
}

// Datos mock para demostración
const generateMockServices = (): ServiceRequest[] => {
  const mockServices: ServiceRequest[] = [];
  const now = new Date();
  
  for (let i = 0; i < 50; i++) {
    const serviceDate = new Date(now.getTime() - (Math.random() * 30 * 24 * 60 * 60 * 1000)); // Últimos 30 días
    const serviceTypes: ('virtual' | 'in_person' | 'home_visit')[] = ['virtual', 'in_person', 'home_visit'];
    const serviceType = serviceTypes[Math.floor(Math.random() * serviceTypes.length)];
    const basePrice = 25 + Math.random() * 100;
    const platformFeeRate = 0.15; // 15% de comisión
    
    mockServices.push({
      id: `service-${i + 1}`,
      patientId: `patient-${Math.floor(Math.random() * 20) + 1}`,
      doctorId: `doctor-${Math.floor(Math.random() * 10) + 1}`,
      doctorName: `Dr. ${['María González', 'Carlos Rodríguez', 'Ana Martínez', 'Luis Pérez', 'Carmen Silva'][Math.floor(Math.random() * 5)]}`,
      serviceType,
      status: 'completed',
      symptoms: ['Dolor de cabeza', 'Fiebre', 'Dolor de garganta', 'Consulta de rutina', 'Dolor abdominal'][Math.floor(Math.random() * 5)],
      urgency: ['low', 'medium', 'high'][Math.floor(Math.random() * 3)] as any,
      preferredTime: 'today',
      requestedAt: serviceDate,
      acceptedAt: new Date(serviceDate.getTime() + 5 * 60 * 1000), // 5 min después
      startedAt: new Date(serviceDate.getTime() + 15 * 60 * 1000), // 15 min después
      completedAt: new Date(serviceDate.getTime() + 45 * 60 * 1000), // 45 min después
      basePrice: Math.round(basePrice),
      finalPrice: Math.round(basePrice * (serviceType === 'home_visit' ? 1.5 : 1)),
      platformFee: Math.round(basePrice * (serviceType === 'home_visit' ? 1.5 : 1) * platformFeeRate),
      patientRating: 3.5 + Math.random() * 1.5, // 3.5 - 5.0
      doctorRating: 4 + Math.random() * 1, // 4.0 - 5.0
      patientLocation: serviceType === 'home_visit' ? {
        latitude: 10.4806 + (Math.random() - 0.5) * 0.1,
        longitude: -66.9036 + (Math.random() - 0.5) * 0.1,
        address: `Calle ${Math.floor(Math.random() * 100) + 1}, Caracas`,
      } : undefined,
    });
  }
  
  return mockServices;
};

export const useServiceTrackingStore = create<ServiceTrackingState>()(
  persist(
    (set, get) => ({
      // Estado inicial
      activeServices: [],
      completedServices: [],
      currentService: null,
      metrics: {
        totalServices: 0,
        completedServices: 0,
        activeServices: 0,
        totalRevenue: 0,
        platformRevenue: 0,
        averageServiceTime: 0,
        averageRating: 0,
        virtualConsults: 0,
        inPersonConsults: 0,
        homeVisits: 0,
        dailyServices: 0,
        weeklyGrowth: 0,
        monthlyRevenue: 0,
      },
      isTrackingActive: false,
      showTrackingModal: false,

      // Crear nueva solicitud de servicio
      createServiceRequest: (requestData) => {
        const serviceId = `service-${Date.now()}`;
        const newService: ServiceRequest = {
          ...requestData,
          id: serviceId,
          requestedAt: new Date(),
          status: 'requested',
          platformFee: Math.round(requestData.finalPrice * 0.15), // 15% comisión
        };

        set((state) => ({
          activeServices: [...state.activeServices, newService],
          currentService: newService,
          isTrackingActive: true,
        }));

        get().updateMetrics();
        
        console.log('📋 Nueva solicitud de servicio creada:', serviceId);
        return serviceId;
      },

      // Actualizar estado del servicio
      updateServiceStatus: (serviceId, status, additionalData) => {
        const now = new Date();
        
        set((state) => {
          const activeServices = state.activeServices.map((service) =>
            service.id === serviceId
              ? {
                  ...service,
                  status,
                  ...additionalData,
                  ...(status === 'accepted' && { acceptedAt: now }),
                  ...(status === 'in_consultation' && { startedAt: now }),
                  ...(status === 'completed' && { completedAt: now }),
                }
              : service
          );

          let completedServices = state.completedServices;
          let currentService = state.currentService;

          // Si el servicio se completó o canceló, moverlo a completedServices
          if (status === 'completed' || status === 'cancelled' || status === 'paid') {
            const completedService = activeServices.find(s => s.id === serviceId);
            if (completedService) {
              completedServices = [...completedServices, completedService];
              if (currentService?.id === serviceId) {
                currentService = null;
              }
            }
            
            return {
              activeServices: activeServices.filter(s => s.id !== serviceId),
              completedServices,
              currentService,
            };
          }

          return { activeServices };
        });

        get().updateMetrics();
        console.log(`📊 Servicio ${serviceId} actualizado a estado: ${status}`);
      },

      // Doctor acepta el servicio
      acceptService: (serviceId, doctorLocation) => {
        get().updateServiceStatus(serviceId, 'accepted', {
          acceptedAt: new Date(),
          doctorLocation,
        });
        
        // Simular progreso automático para demo
        setTimeout(() => {
          get().updateServiceStatus(serviceId, 'preparing');
        }, 2000);
        
        setTimeout(() => {
          const service = get().activeServices.find(s => s.id === serviceId);
          if (service?.serviceType === 'home_visit') {
            get().updateServiceStatus(serviceId, 'on_the_way');
          } else {
            get().updateServiceStatus(serviceId, 'in_consultation');
          }
        }, 5000);
      },

      // Completar servicio con ratings
      completeService: (serviceId, patientRating, doctorRating, feedback) => {
        get().updateServiceStatus(serviceId, 'completed', {
          completedAt: new Date(),
          patientRating,
          doctorRating,
          patientFeedback: feedback?.patient,
          doctorFeedback: feedback?.doctor,
        });
        
        // Después de 2 segundos, marcar como pagado
        setTimeout(() => {
          get().updateServiceStatus(serviceId, 'paid');
        }, 2000);
      },

      // Cancelar servicio
      cancelService: (serviceId, reason) => {
        get().updateServiceStatus(serviceId, 'cancelled', {
          notes: `Cancelado: ${reason}`,
        });
      },

      // Actualizar ubicación del doctor (para tracking)
      updateDoctorLocation: (serviceId, location) => {
        set((state) => ({
          activeServices: state.activeServices.map((service) =>
            service.id === serviceId
              ? { ...service, doctorLocation: location }
              : service
          ),
        }));
      },

      // Calcular tiempo estimado de llegada
      calculateETA: (serviceId) => {
        const service = get().activeServices.find(s => s.id === serviceId);
        if (!service || !service.doctorLocation || !service.patientLocation) {
          return 15; // Default 15 minutos
        }
        
        // Simulación simple de ETA basada en distancia
        const distance = Math.sqrt(
          Math.pow(service.doctorLocation.latitude - service.patientLocation.latitude, 2) +
          Math.pow(service.doctorLocation.longitude - service.patientLocation.longitude, 2)
        );
        
        return Math.max(5, Math.round(distance * 1000)); // Mínimo 5 minutos
      },

      // Actualizar métricas del negocio
      updateMetrics: () => {
        const { activeServices, completedServices } = get();
        const allServices = [...activeServices, ...completedServices];
        const completedOnly = completedServices.filter(s => s.status === 'paid');
        
        const totalRevenue = completedOnly.reduce((sum, service) => sum + service.finalPrice, 0);
        const platformRevenue = completedOnly.reduce((sum, service) => sum + service.platformFee, 0);
        
        const totalServiceTime = completedOnly
          .filter(s => s.startedAt && s.completedAt)
          .reduce((sum, service) => {
            const duration = service.completedAt!.getTime() - service.startedAt!.getTime();
            return sum + (duration / (1000 * 60)); // Convertir a minutos
          }, 0);
        
        const averageServiceTime = completedOnly.length > 0 ? totalServiceTime / completedOnly.length : 0;
        
        const totalRating = completedOnly.reduce((sum, service) => 
          sum + ((service.patientRating || 0) + (service.doctorRating || 0)) / 2, 0);
        const averageRating = completedOnly.length > 0 ? totalRating / completedOnly.length : 0;
        
        // Métricas por tipo
        const virtualConsults = completedOnly.filter(s => s.serviceType === 'virtual').length;
        const inPersonConsults = completedOnly.filter(s => s.serviceType === 'in_person').length;
        const homeVisits = completedOnly.filter(s => s.serviceType === 'home_visit').length;
        
        // Métricas de tiempo
        const today = new Date();
        const startOfDay = new Date(today.getFullYear(), today.getMonth(), today.getDate());
        const dailyServices = completedOnly.filter(s => s.completedAt! >= startOfDay).length;
        
        const startOfWeek = new Date(startOfDay.getTime() - (7 * 24 * 60 * 60 * 1000));
        const weeklyServices = completedOnly.filter(s => s.completedAt! >= startOfWeek).length;
        
        const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
        const monthlyRevenue = completedOnly
          .filter(s => s.completedAt! >= startOfMonth)
          .reduce((sum, service) => sum + service.finalPrice, 0);

        set({
          metrics: {
            totalServices: allServices.length,
            completedServices: completedOnly.length,
            activeServices: activeServices.length,
            totalRevenue,
            platformRevenue,
            averageServiceTime,
            averageRating,
            virtualConsults,
            inPersonConsults,
            homeVisits,
            dailyServices,
            weeklyGrowth: weeklyServices,
            monthlyRevenue,
          },
        });
      },

      // Proyección de ingresos
      getRevenueProjection: (months) => {
        const { metrics } = get();
        const monthlyGrowthRate = 1.15; // 15% crecimiento mensual
        const projections = [];
        
        for (let i = 0; i < months; i++) {
          const projectedRevenue = metrics.monthlyRevenue * Math.pow(monthlyGrowthRate, i);
          projections.push(Math.round(projectedRevenue));
        }
        
        return projections;
      },

      // Métricas de crecimiento
      getGrowthMetrics: () => {
        const { metrics } = get();
        return {
          daily: metrics.dailyServices,
          weekly: metrics.weeklyGrowth,
          monthly: Math.round(metrics.monthlyRevenue),
        };
      },

      // Simulación completa de flujo de servicio
      simulateServiceFlow: async (serviceType) => {
        console.log(`🎭 Iniciando simulación de ${serviceType}...`);
        
        const mockRequest = {
          patientId: 'demo-patient',
          doctorId: 'demo-doctor',
          doctorName: 'Dr. Demo',
          serviceType,
          symptoms: 'Consulta de demostración para inversionistas',
          urgency: 'medium' as const,
          preferredTime: 'now',
          basePrice: serviceType === 'home_visit' ? 75 : 50,
          finalPrice: serviceType === 'home_visit' ? 75 : 50,
          patientLocation: serviceType === 'home_visit' ? {
            latitude: 10.4806,
            longitude: -66.9036,
            address: 'Caracas, Venezuela',
          } : undefined,
        };
        
        const serviceId = get().createServiceRequest(mockRequest);
        
        // Simular flujo completo con delays realistas
        await new Promise(resolve => setTimeout(resolve, 3000));
        get().acceptService(serviceId, { latitude: 10.4900, longitude: -66.8900 });
        
        if (serviceType === 'home_visit') {
          await new Promise(resolve => setTimeout(resolve, 5000));
          get().updateServiceStatus(serviceId, 'arrived');
        }
        
        await new Promise(resolve => setTimeout(resolve, 3000));
        get().updateServiceStatus(serviceId, 'in_consultation');
        
        await new Promise(resolve => setTimeout(resolve, 8000));
        get().completeService(serviceId, 4.8, 4.9, {
          patient: 'Excelente atención, muy profesional',
          doctor: 'Paciente muy colaborativo',
        });
        
        console.log('✅ Simulación completada exitosamente');
      },

      // Generar datos mock para demo
      generateMockData: () => {
        const mockServices = generateMockServices();
        set({
          completedServices: mockServices,
        });
        get().updateMetrics();
        console.log('📊 Datos mock generados para demo');
      },

      // Limpiar todos los datos
      clearAllData: () => {
        set({
          activeServices: [],
          completedServices: [],
          currentService: null,
          isTrackingActive: false,
          showTrackingModal: false,
          metrics: {
            totalServices: 0,
            completedServices: 0,
            activeServices: 0,
            totalRevenue: 0,
            platformRevenue: 0,
            averageServiceTime: 0,
            averageRating: 0,
            virtualConsults: 0,
            inPersonConsults: 0,
            homeVisits: 0,
            dailyServices: 0,
            weeklyGrowth: 0,
            monthlyRevenue: 0,
          },
        });
      },
    }),
    {
      name: 'service-tracking-store',
      storage: createJSONStorage(() => AsyncStorage),
      // No persistir servicios activos para evitar inconsistencias
      partialize: (state) => ({
        completedServices: state.completedServices,
        metrics: state.metrics,
      }),
    }
  )
);
