import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Location from 'expo-location';

// Tipos para el sistema de geolocalización
export interface Coordinates {
  latitude: number;
  longitude: number;
}

export interface Address {
  street: string;
  city: string;
  state: string;
  country: string;
  postalCode: string;
}

export interface DoctorLocation extends Coordinates {
  id: string;
  doctorId: string;
  doctorName: string;
  specialty: string;
  rating: number;
  avatar?: string;
  address: Address;
  distance?: number; // En km
  isAvailable: boolean;
  consultationTypes: ('virtual' | 'in_person' | 'home_visit')[];
  priceRange: {
    min: number;
    max: number;
  };
  workingHours: {
    start: string; // "09:00"
    end: string;   // "18:00"
  };
  serviceRadius: number; // Radio de servicio en km para visitas domiciliarias
}

export interface ClinicLocation extends Coordinates {
  id: string;
  name: string;
  address: Address;
  phone: string;
  doctors: string[]; // IDs de doctores
  services: string[];
  rating: number;
  distance?: number;
}

export interface UserLocation {
  coordinates: Coordinates;
  address?: Address;
  timestamp: number;
}

interface LocationState {
  // Estado de ubicación del usuario
  userLocation: UserLocation | null;
  locationPermission: boolean;
  isLoadingLocation: boolean;
  locationError: string | null;

  // Doctores y clínicas cercanas
  nearbyDoctors: DoctorLocation[];
  nearbyClinics: ClinicLocation[];
  searchRadius: number; // km
  selectedDoctor: DoctorLocation | null;

  // Filtros de búsqueda
  filters: {
    specialty: string | null;
    consultationType: 'virtual' | 'in_person' | 'home_visit' | null;
    maxDistance: number;
    priceRange: { min: number; max: number };
    rating: number;
    availability: 'now' | 'today' | 'this_week' | null;
  };

  // Acciones
  requestLocationPermission: () => Promise<boolean>;
  getCurrentLocation: () => Promise<void>;
  updateUserLocation: (location: UserLocation) => void;
  searchNearbyDoctors: (coordinates: Coordinates, radius?: number) => Promise<void>;
  searchNearbyClinics: (coordinates: Coordinates, radius?: number) => Promise<void>;
  selectDoctor: (doctor: DoctorLocation) => void;
  updateFilters: (filters: Partial<LocationState['filters']>) => void;
  calculateDistance: (from: Coordinates, to: Coordinates) => number;
  clearLocationData: () => void;
}

// Función para calcular distancia entre dos puntos (Haversine formula)
const calculateHaversineDistance = (from: Coordinates, to: Coordinates): number => {
  const R = 6371; // Radio de la Tierra en km
  const dLat = (to.latitude - from.latitude) * Math.PI / 180;
  const dLon = (to.longitude - from.longitude) * Math.PI / 180;
  const a = 
    Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(from.latitude * Math.PI / 180) * Math.cos(to.latitude * Math.PI / 180) * 
    Math.sin(dLon/2) * Math.sin(dLon/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  return R * c;
};

// Especialidades médicas disponibles en Venezuela
export const MEDICAL_SPECIALTIES = [
  'Medicina General',
  'Cardiología',
  'Pediatría',
  'Ginecología',
  'Dermatología',
  'Neurología',
  'Psiquiatría',
  'Oftalmología',
  'Traumatología',
  'Gastroenterología',
  'Endocrinología',
  'Urología',
  'Otorrinolaringología',
  'Neumología',
  'Oncología',
  'Medicina Interna',
  'Psicología',
  'Nutrición',
  'Fisioterapia',
  'Emergencia Médica'
] as const;

// Datos mock de doctores realistas para Venezuela
const getMockDoctors = (): DoctorLocation[] => [
  // CARACAS - Doctores principales
  {
    id: 'doc-001',
    doctorId: 'doctor-001',
    doctorName: 'Dr. María González Pérez',
    specialty: 'Medicina General',
    rating: 4.8,
    latitude: 10.4806, // Altamira, Caracas
    longitude: -66.9036,
    avatar: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=300&h=300&fit=crop&crop=face',
    address: {
      street: 'Av. Francisco de Miranda, Centro Comercial Lido, Torre A, Piso 3',
      city: 'Caracas',
      state: 'Distrito Capital',
      country: 'Venezuela',
      postalCode: '1060'
    },
    isAvailable: true,
    consultationTypes: ['virtual', 'in_person', 'home_visit'],
    priceRange: { min: 25, max: 50 },
    workingHours: { start: '08:00', end: '17:00' },
    serviceRadius: 15
  },
  {
    id: 'doc-002',
    doctorId: 'doctor-002',
    doctorName: 'Dr. Carlos Rodríguez Mendoza',
    specialty: 'Cardiología',
    rating: 4.9,
    latitude: 10.4880, // Las Mercedes, Caracas
    longitude: -66.8790,
    avatar: 'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=300&h=300&fit=crop&crop=face',
    address: {
      street: 'Centro Médico de Caracas, Av. Los Erasos, Piso 5',
      city: 'Caracas',
      state: 'Distrito Capital',
      country: 'Venezuela',
      postalCode: '1050'
    },
    isAvailable: true,
    consultationTypes: ['virtual', 'in_person'],
    priceRange: { min: 60, max: 120 },
    workingHours: { start: '09:00', end: '18:00' },
    serviceRadius: 10
  },
  {
    id: 'doc-003',
    doctorId: 'doctor-003',
    doctorName: 'Dra. Ana Martínez Herrera',
    specialty: 'Pediatría',
    rating: 4.7,
    latitude: 10.4750, // San Bernardino, Caracas
    longitude: -66.9150,
    avatar: 'https://images.unsplash.com/photo-1594824019870-a8be8e3b8d14?w=300&h=300&fit=crop&crop=face',
    address: {
      street: 'Hospital de Niños J.M. de los Ríos, Av. Volteador',
      city: 'Caracas',
      state: 'Distrito Capital',
      country: 'Venezuela',
      postalCode: '1011'
    },
    isAvailable: false,
    consultationTypes: ['in_person', 'home_visit'],
    priceRange: { min: 30, max: 70 },
    workingHours: { start: '07:00', end: '15:00' },
    serviceRadius: 20
  },
  {
    id: 'doc-004',
    doctorId: 'doctor-004',
    doctorName: 'Dr. José Fernández Silva',
    specialty: 'Dermatología',
    rating: 4.6,
    latitude: 10.4950, // Chacao, Caracas
    longitude: -66.8530,
    avatar: 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?w=300&h=300&fit=crop&crop=face',
    address: {
      street: 'Centro Comercial Ciudad Tamanaco, Torre Oeste, Piso 2',
      city: 'Caracas',
      state: 'Distrito Capital',
      country: 'Venezuela',
      postalCode: '1060'
    },
    isAvailable: true,
    consultationTypes: ['virtual', 'in_person'],
    priceRange: { min: 40, max: 85 },
    workingHours: { start: '10:00', end: '19:00' },
    serviceRadius: 12
  },
  {
    id: 'doc-005',
    doctorId: 'doctor-005',
    doctorName: 'Dra. Carmen Delgado López',
    specialty: 'Ginecología',
    rating: 4.9,
    latitude: 10.4600, // La Candelaria, Caracas
    longitude: -66.9200,
    avatar: 'https://images.unsplash.com/photo-1588152850700-3635b83fc065?w=300&h=300&fit=crop&crop=face',
    address: {
      street: 'Clínica El Avila, Av. San Martín, Torre B, Piso 4',
      city: 'Caracas',
      state: 'Distrito Capital',
      country: 'Venezuela',
      postalCode: '1010'
    },
    isAvailable: true,
    consultationTypes: ['virtual', 'in_person', 'home_visit'],
    priceRange: { min: 50, max: 100 },
    workingHours: { start: '08:30', end: '16:30' },
    serviceRadius: 18
  },
  {
    id: 'doc-006',
    doctorId: 'doctor-006',
    doctorName: 'Dr. Rafael Morales Castro',
    specialty: 'Neurología',
    rating: 4.8,
    latitude: 10.4900, // Sabana Grande, Caracas
    longitude: -66.8850,
    avatar: 'https://images.unsplash.com/photo-1582750433449-648ed127bb54?w=300&h=300&fit=crop&crop=face',
    address: {
      street: 'Hospital Universitario de Caracas, Pabellón de Neurología',
      city: 'Caracas',
      state: 'Distrito Capital',
      country: 'Venezuela',
      postalCode: '1040'
    },
    isAvailable: false,
    consultationTypes: ['in_person'],
    priceRange: { min: 80, max: 150 },
    workingHours: { start: '07:00', end: '14:00' },
    serviceRadius: 8
  },
  
  // VALENCIA - Doctores regionales
  {
    id: 'doc-007',
    doctorId: 'doctor-007',
    doctorName: 'Dr. Luis Ramírez Gutiérrez',
    specialty: 'Medicina General',
    rating: 4.5,
    latitude: 10.1621, // Valencia, Carabobo
    longitude: -67.9073,
    avatar: 'https://images.unsplash.com/photo-1607990281513-2c110a25bd8c?w=300&h=300&fit=crop&crop=face',
    address: {
      street: 'Centro Médico Valencia, Av. Bolívar Norte',
      city: 'Valencia',
      state: 'Carabobo',
      country: 'Venezuela',
      postalCode: '2001'
    },
    isAvailable: true,
    consultationTypes: ['virtual', 'in_person', 'home_visit'],
    priceRange: { min: 20, max: 45 },
    workingHours: { start: '06:00', end: '14:00' },
    serviceRadius: 25
  },
  {
    id: 'doc-008',
    doctorId: 'doctor-008',
    doctorName: 'Dra. Patricia Vásquez Torres',
    specialty: 'Psiquiatría',
    rating: 4.7,
    latitude: 10.1800, // Valencia Centro
    longitude: -67.9300,
    avatar: 'https://images.unsplash.com/photo-1594824019870-a8be8e3b8d14?w=300&h=300&fit=crop&crop=face',
    address: {
      street: 'Policlínica Valencia, Torre Médica, Piso 6',
      city: 'Valencia',
      state: 'Carabobo',
      country: 'Venezuela',
      postalCode: '2003'
    },
    isAvailable: true,
    consultationTypes: ['virtual', 'in_person'],
    priceRange: { min: 35, max: 75 },
    workingHours: { start: '09:00', end: '17:00' },
    serviceRadius: 15
  },
  
  // MARACAIBO - Doctores del Zulia
  {
    id: 'doc-009',
    doctorId: 'doctor-009',
    doctorName: 'Dr. Alberto Chávez Medina',
    specialty: 'Traumatología',
    rating: 4.6,
    latitude: 10.6666, // Maracaibo, Zulia
    longitude: -71.6125,
    avatar: 'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=300&h=300&fit=crop&crop=face',
    address: {
      street: 'Hospital Universitario de Maracaibo, Servicio de Traumatología',
      city: 'Maracaibo',
      state: 'Zulia',
      country: 'Venezuela',
      postalCode: '4001'
    },
    isAvailable: true,
    consultationTypes: ['in_person', 'home_visit'],
    priceRange: { min: 45, max: 90 },
    workingHours: { start: '08:00', end: '16:00' },
    serviceRadius: 20
  },
  {
    id: 'doc-010',
    doctorId: 'doctor-010',
    doctorName: 'Dra. Isabel Romero Peña',
    specialty: 'Oftalmología',
    rating: 4.8,
    latitude: 10.6400, // Maracaibo Centro
    longitude: -71.6400,
    avatar: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=300&h=300&fit=crop&crop=face',
    address: {
      street: 'Centro Oftalmológico de Maracaibo, Av. 15 con Calle 70',
      city: 'Maracaibo',
      state: 'Zulia',
      country: 'Venezuela',
      postalCode: '4002'
    },
    isAvailable: true,
    consultationTypes: ['virtual', 'in_person'],
    priceRange: { min: 55, max: 110 },
    workingHours: { start: '07:30', end: '15:30' },
    serviceRadius: 12
  },
  
  // DOCTORES ESPECIALIZADOS EN EMERGENCIAS
  {
    id: 'doc-011',
    doctorId: 'doctor-011',
    doctorName: 'Dr. Manuel Guerrero Rivas',
    specialty: 'Emergencia Médica',
    rating: 4.9,
    latitude: 10.4700, // Caracas - Emergencias móviles
    longitude: -66.9000,
    avatar: 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?w=300&h=300&fit=crop&crop=face',
    address: {
      street: 'Servicio Móvil de Emergencias - Cobertura Metropolitana',
      city: 'Caracas',
      state: 'Distrito Capital',
      country: 'Venezuela',
      postalCode: '1000'
    },
    isAvailable: true,
    consultationTypes: ['home_visit'],
    priceRange: { min: 100, max: 200 },
    workingHours: { start: '00:00', end: '23:59' }, // 24 horas
    serviceRadius: 30 // Cobertura amplia para emergencias
  },
  {
    id: 'doc-012',
    doctorId: 'doctor-012',
    doctorName: 'Psic. Andrea Salinas Vargas',
    specialty: 'Psicología',
    rating: 4.7,
    latitude: 10.4820,
    longitude: -66.8680,
    avatar: 'https://images.unsplash.com/photo-1594824019870-a8be8e3b8d14?w=300&h=300&fit=crop&crop=face',
    address: {
      street: 'Centro de Salud Mental Integral, Av. Urdaneta',
      city: 'Caracas',
      state: 'Distrito Capital',
      country: 'Venezuela',
      postalCode: '1020'
    },
    isAvailable: true,
    consultationTypes: ['virtual', 'in_person'],
    priceRange: { min: 25, max: 60 },
    workingHours: { start: '10:00', end: '18:00' },
    serviceRadius: 0 // Solo virtual e in-person
  }
];

export const useLocationStore = create<LocationState>()(
  persist(
    (set, get) => ({
      // Estado inicial
      userLocation: null,
      locationPermission: false,
      isLoadingLocation: false,
      locationError: null,
      nearbyDoctors: [],
      nearbyClinics: [],
      searchRadius: 10, // 10km por defecto
      selectedDoctor: null,
      filters: {
        specialty: null,
        consultationType: null,
        maxDistance: 25,
        priceRange: { min: 0, max: 200 },
        rating: 0,
        availability: null,
      },

      // Solicitar permisos de ubicación
      requestLocationPermission: async () => {
        try {
          console.log('📍 Solicitando permisos de ubicación...');
          const { status } = await Location.requestForegroundPermissionsAsync();
          const granted = status === 'granted';
          set({ locationPermission: granted });
          console.log('📍 Permisos de ubicación:', granted ? 'Concedidos' : 'Denegados');
          return granted;
        } catch (error) {
          console.error('❌ Error solicitando permisos:', error);
          set({ locationError: 'Error solicitando permisos de ubicación' });
          return false;
        }
      },

      // Obtener ubicación actual
      getCurrentLocation: async () => {
        const { locationPermission } = get();
        if (!locationPermission) {
          const granted = await get().requestLocationPermission();
          if (!granted) return;
        }

        set({ isLoadingLocation: true, locationError: null });
        
        try {
          console.log('📍 Obteniendo ubicación actual...');
          const location = await Location.getCurrentPositionAsync({
            accuracy: Location.Accuracy.High,
          });

          const userLocation: UserLocation = {
            coordinates: {
              latitude: location.coords.latitude,
              longitude: location.coords.longitude,
            },
            timestamp: Date.now(),
          };

          console.log('📍 Ubicación obtenida:', userLocation);
          set({ userLocation, isLoadingLocation: false });

          // Buscar doctores cercanos automáticamente
          await get().searchNearbyDoctors(userLocation.coordinates);
          
        } catch (error) {
          console.error('❌ Error obteniendo ubicación:', error);
          set({ 
            locationError: 'No se pudo obtener la ubicación',
            isLoadingLocation: false 
          });
        }
      },

      // Actualizar ubicación del usuario
      updateUserLocation: (location) => {
        set({ userLocation: location });
      },

      // Buscar doctores cercanos
      searchNearbyDoctors: async (coordinates, radius) => {
        const searchRadius = radius || get().searchRadius;
        const { filters } = get();
        
        console.log('🔍 Buscando doctores cercanos...', { coordinates, searchRadius });
        
        // Simulación con datos mock
        const mockDoctors = getMockDoctors();
        
        // Calcular distancias y filtrar
        const doctorsWithDistance = mockDoctors
          .map(doctor => ({
            ...doctor,
            distance: calculateHaversineDistance(coordinates, {
              latitude: doctor.latitude,
              longitude: doctor.longitude
            })
          }))
          .filter(doctor => {
            // Filtrar por distancia
            if (doctor.distance! > filters.maxDistance) return false;
            
            // Filtrar por especialidad
            if (filters.specialty && doctor.specialty !== filters.specialty) return false;
            
            // Filtrar por tipo de consulta
            if (filters.consultationType && !doctor.consultationTypes.includes(filters.consultationType)) return false;
            
            // Filtrar por rating
            if (doctor.rating < filters.rating) return false;
            
            // Filtrar por rango de precios
            if (doctor.priceRange.max < filters.priceRange.min || 
                doctor.priceRange.min > filters.priceRange.max) return false;
            
            // Filtrar por disponibilidad
            if (filters.availability === 'now' && !doctor.isAvailable) return false;
            
            return true;
          })
          .sort((a, b) => a.distance! - b.distance!); // Ordenar por distancia

        console.log('✅ Doctores encontrados:', doctorsWithDistance.length);
        set({ nearbyDoctors: doctorsWithDistance });
      },

      // Buscar clínicas cercanas (implementación similar)
      searchNearbyClinics: async (coordinates, radius) => {
        // Por ahora, implementación mock
        console.log('🏥 Buscando clínicas cercanas...');
        set({ nearbyClinics: [] });
      },

      // Seleccionar doctor
      selectDoctor: (doctor) => {
        console.log('👨‍⚕️ Doctor seleccionado:', doctor.doctorName);
        set({ selectedDoctor: doctor });
      },

      // Actualizar filtros
      updateFilters: (newFilters) => {
        const currentFilters = get().filters;
        const updatedFilters = { ...currentFilters, ...newFilters };
        set({ filters: updatedFilters });
        
        // Reejecutar búsqueda si tenemos ubicación
        const { userLocation } = get();
        if (userLocation) {
          get().searchNearbyDoctors(userLocation.coordinates);
        }
      },

      // Calcular distancia
      calculateDistance: calculateHaversineDistance,

      // Limpiar datos de ubicación
      clearLocationData: () => {
        set({
          userLocation: null,
          nearbyDoctors: [],
          nearbyClinics: [],
          selectedDoctor: null,
          locationError: null,
        });
      },
    }),
    {
      name: 'location-store',
      storage: createJSONStorage(() => AsyncStorage),
      // No persistir datos sensibles de ubicación
      partialize: (state) => ({
        locationPermission: state.locationPermission,
        searchRadius: state.searchRadius,
        filters: state.filters,
      }),
    }
  )
);
