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

// Datos mock de doctores para desarrollo
const getMockDoctors = (): DoctorLocation[] => [
  {
    id: 'doc-1',
    doctorId: 'doctor-001',
    doctorName: 'Dr. María González',
    specialty: 'Medicina General',
    rating: 4.8,
    latitude: 10.4806, // Caracas
    longitude: -66.9036,
    address: {
      street: 'Av. Francisco de Miranda, Centro Comercial Lido',
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
    id: 'doc-2',
    doctorId: 'doctor-002',
    doctorName: 'Dr. Carlos Rodríguez',
    specialty: 'Cardiología',
    rating: 4.9,
    latitude: 10.4880,
    longitude: -66.8790,
    address: {
      street: 'Centro Médico de Caracas, Piso 5',
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
    id: 'doc-3',
    doctorId: 'doctor-003',
    doctorName: 'Dra. Ana Martínez',
    specialty: 'Pediatría',
    rating: 4.7,
    latitude: 10.4750,
    longitude: -66.9150,
    address: {
      street: 'Hospital de Niños J.M. de los Ríos',
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
